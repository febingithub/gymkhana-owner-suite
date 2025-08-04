import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Search, Edit, Trash2, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getExpenses, deleteExpense, getExpenseCategories, getPaymentMethods } from '@/services/expenseService';
import type { Expense, ExpenseCategory, ExpenseFilters, ExpenseCategoryFilter } from '@/types/expense';

export default function ExpensesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ExpenseFilters>({
    startDate: '',
    endDate: '',
    category: 'all',
    searchQuery: '',
  });

  const categories = getExpenseCategories();
  const paymentMethods = getPaymentMethods();

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const data = await getExpenses({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        category: (filters.category as ExpenseCategory) || undefined,
        searchQuery: filters.searchQuery || undefined,
      });
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Error',
        description: `Failed to load expenses: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        toast({
          title: 'Success',
          description: 'Expense deleted successfully',
        });
        fetchExpenses();
      } catch (error) {
        console.error('Failed to delete expense:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete expense. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const getPaymentMethodLabel = (method: string) => {
    return paymentMethods.find(m => m.value === method)?.label || method;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Track and manage your gym's expenses
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/expenses/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex-1">
              <Input
                placeholder="Search expenses..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="max-w-sm"
              />
            </div>
            <div className="flex space-x-2">
              <Select
                value={filters.category}
                onValueChange={(value: ExpenseCategoryFilter) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-[150px]"
                placeholder="Start Date"
              />
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-[150px]"
                placeholder="End Date"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Paid By</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Loading expenses...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No expenses found. Try adjusting your filters or add a new expense.
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{format(new Date(expense.date), 'dd MMM yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getCategoryLabel(expense.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {expense.description || 'No description'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getPaymentMethodLabel(expense.paymentMethod)}
                        </Badge>
                      </TableCell>
                      <TableCell>{expense.paidByName}</TableCell>
                      <TableCell>
                        {expense.receiptUrl ? (
                          <a
                            href={expense.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </a>
                        ) : (
                          <span className="text-muted-foreground">No receipt</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/dashboard/expenses/${expense.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(expense.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
