export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category?: TransactionCategory; // Optional
  passbookId: string;
  passbookName: string;
  passbookColor: string;
  date: Date;
  isIncome: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum TransactionCategory {
  // Income categories
  SALARY = 'salary',
  FREELANCE = 'freelance',
  INVESTMENT = 'investment',
  GIFT = 'gift',
  OTHER_INCOME = 'other_income',
  
  // Expense categories - Needs (50%)
  RENT = 'rent',
  UTILITIES = 'utilities',
  GROCERIES = 'groceries',
  INSURANCE = 'insurance',
  HEALTHCARE = 'healthcare',
  TRANSPORTATION = 'transportation',
  
  // Expense categories - Wants (30%)
  DINING = 'dining',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  TRAVEL = 'travel',
  HOBBIES = 'hobbies',
  SUBSCRIPTIONS = 'subscriptions',
  
  // Expense categories - Savings (20%)
  EMERGENCY_FUND = 'emergency_fund',
  INVESTMENTS = 'investments',
  RETIREMENT = 'retirement',
  SAVINGS_GOAL = 'savings_goal',
}

// Type for category strings
export type TransactionCategoryString = keyof typeof TransactionCategory;

export interface CreateTransactionRequest {
  amount: number;
  description: string;
  category?: TransactionCategory; // Optional
  passbookId: string;
  date: Date;
  isIncome: boolean;
}

export interface UpdateTransactionRequest {
  id: string;
  amount?: number;
  description?: string;
  category?: TransactionCategory;
  passbookId?: string;
  date?: Date;
}

export interface TransactionDistribution {
  passbookId: string;
  passbookName: string;
  passbookColor: string;
  amount: number;
  percentage: number;
}
