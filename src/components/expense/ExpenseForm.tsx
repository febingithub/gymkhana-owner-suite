import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { getExpenseCategories, getPaymentMethods } from '@/services/expenseService';
import type { ExpenseFormData, ExpenseCategory, PaymentMethod } from '@/types/expense';

const expenseFormSchema = z.object({
  date: z.string().min(1, { message: 'Date is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  amount: z.number().min(0.01, { message: 'Amount must be greater than 0' }),
  description: z.string().optional(),
  paymentMethod: z.string().min(1, { message: 'Payment method is required' }),
  paidById: z.string().min(1, { message: 'Paid by is required' }),
  receipt: z.instanceof(File).optional().nullable(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface ExpenseFormProps {
  defaultValues?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText?: string;
}

export function ExpenseForm({
  defaultValues = {
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: 0,
  },
  onSubmit,
  isSubmitting,
  submitButtonText = 'Save Expense',
}: ExpenseFormProps) {
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      ...defaultValues,
      date: defaultValues.date || format(new Date(), 'yyyy-MM-dd'),
      category: defaultValues.category || 'MISCELLANEOUS',
      amount: defaultValues.amount || 0,
      paymentMethod: defaultValues.paymentMethod || 'CASH',
      paidById: defaultValues.paidById || '1',
      description: defaultValues.description || '',
    } as ExpenseFormValues,
  });

  const categories = getExpenseCategories();
  const paymentMethods = getPaymentMethods();

  // In a real app, you would fetch this from your API
  const staffMembers = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Owner' },
  ].filter(Boolean); // Ensure no empty values

  const handleSubmit = async (values: ExpenseFormValues) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append('receipt', value);
          } else if (key === 'date' && !value) {
            formData.append(key, format(new Date(), 'yyyy-MM-dd'));
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      // Ensure required fields have values
      if (!formData.get('category')) {
        formData.set('category', 'MISCELLANEOUS');
      }
      if (!formData.get('paymentMethod')) {
        formData.set('paymentMethod', 'CASH');
      }
      if (!formData.get('date')) {
        formData.set('date', format(new Date(), 'yyyy-MM-dd'));
      }
      
      // Convert FormData to ExpenseFormData
      const expenseData: ExpenseFormData = {
        date: formData.get('date') as string,
        category: formData.get('category') as ExpenseCategory,
        amount: Number(formData.get('amount')) || 0,
        description: formData.get('description') as string || '',
        paymentMethod: formData.get('paymentMethod') as PaymentMethod,
        paidById: formData.get('paidById') as string,
        receipt: values.receipt,
      };
      
      await onSubmit(expenseData);
    } catch (error) {
      console.error('Error submitting form:', error);
      // The error will be handled by the parent component
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        form.setValue('date', format(date || new Date(), 'yyyy-MM-dd'), {
                          shouldValidate: true,
                        });
                      }}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paidById"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paid By</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select who paid" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {staffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="receipt"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem className="col-span-2">
                <FormLabel>Receipt (Optional)</FormLabel>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {value ? (
                      <div className="flex flex-col items-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600">{value.name}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onChange(null)}
                          className="mt-2"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex justify-center">
                          <Upload className="h-12 w-12 text-gray-400" />
                        </div>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*,.pdf"
                              onChange={(e) => onChange(e.target.files?.[0] || null)}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any additional details about this expense..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
