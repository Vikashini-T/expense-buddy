import { Expense } from '@/services/expenseService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

// Get category color class based on category name
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Food: 'bg-category-food/15 text-category-food border-category-food/30',
    Transport: 'bg-category-transport/15 text-category-transport border-category-transport/30',
    Entertainment: 'bg-category-entertainment/15 text-category-entertainment border-category-entertainment/30',
    Utilities: 'bg-category-utilities/15 text-category-utilities border-category-utilities/30',
    Shopping: 'bg-category-shopping/15 text-category-shopping border-category-shopping/30',
    Other: 'bg-category-other/15 text-category-other border-category-other/30',
  };
  return colors[category] || colors.Other;
};

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const ExpenseItem = ({ expense, onEdit, onDelete }: ExpenseItemProps) => {
  // Format the date for display
  const formattedDate = format(new Date(expense.date), 'MMM dd, yyyy');

  return (
    <div className="group rounded-xl bg-card p-4 shadow-card transition-all duration-200 hover:shadow-card-hover animate-slide-up">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Section: Title, Category, Date */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">{expense.title}</h3>
            <Badge
              variant="outline"
              className={`text-xs font-medium ${getCategoryColor(expense.category)}`}
            >
              {expense.category}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
            {expense.notes && (
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                <span className="max-w-[200px] truncate">{expense.notes}</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Section: Amount and Actions */}
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(expense.amount)}
          </span>

          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(expense)}
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              title="Edit expense"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(expense._id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              title="Delete expense"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
