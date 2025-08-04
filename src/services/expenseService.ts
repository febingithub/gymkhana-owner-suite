import { apiService } from './api';
import type { Expense, ExpenseFormData, ExpenseFilters, ExpenseCategoryFilter } from '@/types/expense';

// Get all expenses with optional filters
export const getExpenses = async (filters: ExpenseFilters = {}): Promise<Expense[]> => {
  try {
    const response = await apiService.getExpenses({
      startDate: filters.startDate,
      endDate: filters.endDate,
      category: filters.category === 'all' ? undefined : filters.category,
      search: filters.searchQuery,
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch expenses');
    }
    
    // Mock data for development
    if (!response.data) {
      return [
        {
          id: '1',
          date: new Date().toISOString(),
          category: 'EQUIPMENT',
          amount: 15000,
          description: 'New treadmill',
          paymentMethod: 'CARD',
          paidById: '1',
          paidByName: 'John Doe',
          receiptUrl: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error in getExpenses:', error);
    throw error;
  }
};

// Get single expense by ID
export const getExpense = async (id: string): Promise<Expense> => {
  try {
    const response = await apiService.getExpense(id);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch expense');
    }
    
    // Mock data for development
    if (!response.data) {
      return {
        id,
        date: new Date().toISOString(),
        category: 'EQUIPMENT',
        amount: 15000,
        description: 'New treadmill',
        paymentMethod: 'CARD',
        paidById: '1',
        paidByName: 'John Doe',
        receiptUrl: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error in getExpense(${id}):`, error);
    throw error;
  }
};

// Create new expense
export const createExpense = async (expenseData: ExpenseFormData): Promise<Expense> => {
  const formData = new FormData();
  
  // Append all fields to formData
  Object.entries(expenseData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'receipt' && value instanceof File) {
        formData.append('receipt', value);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await apiService.createExpense(formData);
  if (!response.success) {
    throw new Error(response.message || 'Failed to create expense');
  }
  return response.data!;
};

// Update expense
export const updateExpense = async (id: string, updates: Partial<ExpenseFormData>): Promise<Expense> => {
  const formData = new FormData();
  
  // Append only the updated fields to formData
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'receipt' && value instanceof File) {
        formData.append('receipt', value);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await apiService.updateExpense(id, formData);
  if (!response.success) {
    throw new Error(response.message || 'Failed to update expense');
  }
  return response.data!;
};

// Delete expense
export const deleteExpense = async (id: string): Promise<void> => {
  const response = await apiService.deleteExpense(id);
  if (!response.success) {
    throw new Error(response.message || 'Failed to delete expense');
  }
};

// Get expense categories
export const getExpenseCategories = (): { value: string; label: string }[] => {
  return [
    { value: 'EQUIPMENT', label: 'Equipment' },
    { value: 'RENT', label: 'Rent' },
    { value: 'SALARY', label: 'Salary' },
    { value: 'UTILITY', label: 'Utility' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'SUPPLIES', label: 'Supplies' },
    { value: 'MISCELLANEOUS', label: 'Miscellaneous' },
  ];
};

// Get payment methods
export const getPaymentMethods = (): { value: string; label: string }[] => {
  return [
    { value: 'CASH', label: 'Cash' },
    { value: 'CARD', label: 'Card' },
    { value: 'UPI', label: 'UPI' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'WALLET', label: 'Wallet' },
  ];
};
