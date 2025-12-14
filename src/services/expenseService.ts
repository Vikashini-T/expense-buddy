import axios from 'axios';

// Base URL - configurable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Expense data structure
export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
}

// Type for creating/updating expense (without _id)
export interface ExpenseInput {
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
}

// API service functions
export const expenseService = {
  // Fetch all expenses
  getAllExpenses: async (): Promise<Expense[]> => {
    const response = await api.get('/expenses');
    return response.data;
  },

  // Fetch expense by ID
  getExpenseById: async (id: string): Promise<Expense> => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  // Add new expense
  createExpense: async (expense: ExpenseInput): Promise<Expense> => {
    const response = await api.post('/expenses', expense);
    return response.data;
  },

  // Update expense
  updateExpense: async (id: string, expense: ExpenseInput): Promise<Expense> => {
    const response = await api.put(`/expenses/${id}`, expense);
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },
};

export default expenseService;
