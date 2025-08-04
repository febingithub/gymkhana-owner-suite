export type PaymentMethod = 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER' | 'WALLET';
export type ExpenseCategory = 'EQUIPMENT' | 'RENT' | 'SALARY' | 'UTILITY' | 'MAINTENANCE' | 'SUPPLIES' | 'MISCELLANEOUS';

export interface Expense {
  id: string;
  date: string; // ISO date string
  amount: number;
  category: ExpenseCategory;
  description?: string;
  paymentMethod: PaymentMethod;
  paidById: string;
  paidByName: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  date: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  paymentMethod: PaymentMethod;
  paidById: string;
  receipt?: File | null;
}

export type ExpenseCategoryFilter = ExpenseCategory | 'all';

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  category?: ExpenseCategoryFilter;
  searchQuery?: string;
}
