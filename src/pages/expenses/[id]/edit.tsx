import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ExpenseForm } from '@/components/expense/ExpenseForm';
import { getExpense, updateExpense } from '@/services/expenseService';
import type { ExpenseFormData } from '@/types/expense';

export default function EditExpensePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expense, setExpense] = useState<ExpenseFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        if (!id) return;
        
        const data = await getExpense(id);
        if (data) {
          setExpense({
            ...data,
            // Convert date to YYYY-MM-DD format for the date input
            date: data.date.split('T')[0],
          });
        }
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

  const handleSubmit = async (data: ExpenseFormData) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      await updateExpense(id, data);
      toast({
        title: 'Success',
        description: 'Expense updated successfully',
      });
      navigate(`/dashboard/expenses/${id}`);
    } catch (error) {
      console.error('Error updating expense:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update expense. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Expense</h1>
        <p className="text-muted-foreground">
          Update the expense details below
        </p>
      </div>
      
      <div className="max-w-3xl">
        <ExpenseForm 
          defaultValues={expense}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitButtonText="Update Expense"
        />
      </div>
    </div>
  );
}
