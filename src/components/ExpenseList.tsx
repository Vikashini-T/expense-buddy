import { Expense } from '@/services/expenseService';
import ExpenseItem from './ExpenseItem';
import { Receipt, TrendingUp } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const ExpenseList = ({
  expenses,
  onEdit,
  onDelete,
  isLoading = false,
}: ExpenseListProps) => {
  // Calculate total expenses
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl bg-card p-4 shadow-card">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-5 w-40 animate-pulse rounded bg-muted" />
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-6 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (expenses.length === 0) {
    return (
      <div className="rounded-xl bg-card p-12 text-center shadow-card animate-fade-in">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <Receipt className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          No expenses yet
        </h3>
        <p className="text-muted-foreground">
          Start tracking your spending by adding your first expense above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Summary Card */}
      <div className="rounded-xl bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground shadow-card animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary-foreground/20 p-2">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-90">Total Expenses</p>
              <p className="text-xs opacity-75">{expenses.length} transactions</p>
            </div>
          </div>
          <span className="text-2xl font-bold">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      {/* Expense Items */}
      <div className="space-y-3">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense._id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
