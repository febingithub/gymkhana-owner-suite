import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Trash2, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getExpense, deleteExpense } from '@/services/expenseService';
import { getExpenseCategories, getPaymentMethods } from '@/services/expenseService';
import type { Expense } from '@/types/expense';

export default function ExpenseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = getExpenseCategories();
  const paymentMethods = getPaymentMethods();

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        if (!id) return;
        
        const data = await getExpense(id);
        setExpense(data);
      } catch (error) {
        console.error('Failed to fetch expense:', error);
        toast({
          title: 'Error',
          description: 'Failed to load expense details. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpense();
  }, [id, toast]);

  const handleDelete = async () => {
    if (!id) return;
    
    if (!window.confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteExpense(id);
      
      toast({
        title: 'Success',
        description: 'Expense deleted successfully',
      });
      
      navigate('/dashboard/expenses');
    } catch (error) {
      console.error('Failed to delete expense:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete expense. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const getPaymentMethodLabel = (method: string) => {
    return paymentMethods.find(m => m.value === method)?.label || method;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Expense not found</h2>
        <p className="text-muted-foreground mt-2">
          The expense you're looking for doesn't exist or has been deleted.
        </p>
        <Button 
          onClick={() => navigate('/dashboard/expenses')} 
          className="mt-4"
        >
          Back to Expenses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/expenses')}
          className="-ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Expenses
        </Button>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/dashboard/expenses/${expense.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">
                  {format(new Date(expense.date), 'MMMM d, yyyy')}
                </CardTitle>
                <p className="text-muted-foreground">
                  Added on {format(new Date(expense.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {formatCurrency(expense.amount)}
                </div>
                <Badge variant="outline" className="mt-2">
                  {getCategoryLabel(expense.category)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-medium text-muted-foreground">Payment Method</h3>
                <p>{getPaymentMethodLabel(expense.paymentMethod)}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-muted-foreground">Paid By</h3>
                <p>{expense.paidByName}</p>
              </div>
              {expense.description && (
                <div className="space-y-2 md:col-span-2">
                  <h3 className="font-medium text-muted-foreground">Description</h3>
                  <p className="whitespace-pre-line">{expense.description}</p>
                </div>
              )}
              {expense.receiptUrl && (
                <div className="space-y-2 md:col-span-2">
                  <h3 className="font-medium text-muted-foreground">Receipt</h3>
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                    <a
                      href={expense.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      View Receipt
                      <Download className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
