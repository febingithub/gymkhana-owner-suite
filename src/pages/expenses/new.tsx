import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { ExpenseForm } from '@/components/expense/ExpenseForm';
import { createExpense } from '@/services/expenseService';
import type { ExpenseFormData } from '@/types/expense';

export default function AddExpensePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      setIsSubmitting(true);
      await createExpense(data);
      toast({
        title: 'Success',
        description: 'Expense added successfully',
      });
      navigate('/dashboard/expenses');
    } catch (error) {
      console.error('Error adding expense:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add expense. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New Expense</h1>
        <p className="text-muted-foreground">
          Record a new expense for your gym
        </p>
      </div>
      
      <div className="max-w-3xl">
        <ExpenseForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
