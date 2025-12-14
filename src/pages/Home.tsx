import { useState, useEffect, useCallback } from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { expenseService, Expense, ExpenseInput } from '@/services/expenseService';
import { useToast } from '@/hooks/use-toast';
import { Wallet, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  // State management
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();

  // Fetch all expenses from API
  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load expenses. Please check if the backend is running.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Handle adding or updating an expense
  const handleSubmit = async (expenseData: ExpenseInput) => {
    try {
      setIsSubmitting(true);

      if (editingExpense) {
        // Update existing expense
        const updated = await expenseService.updateExpense(
          editingExpense._id,
          expenseData
        );
        setExpenses((prev) =>
          prev.map((exp) => (exp._id === updated._id ? updated : exp))
        );
        toast({
          title: 'Success',
          description: 'Expense updated successfully!',
        });
        setEditingExpense(null);
      } else {
        // Create new expense
        const created = await expenseService.createExpense(expenseData);
        setExpenses((prev) => [created, ...prev]);
        toast({
          title: 'Success',
          description: 'Expense added successfully!',
        });
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save expense. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  // Handle delete button click - show confirmation
  const handleDeleteClick = (id: string) => {
    const expense = expenses.find((exp) => exp._id === id);
    if (expense) {
      setExpenseToDelete(expense);
      setDeleteDialogOpen(true);
    }
  };

  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;

    try {
      setIsDeleting(true);
      await expenseService.deleteExpense(expenseToDelete._id);
      setExpenses((prev) =>
        prev.filter((exp) => exp._id !== expenseToDelete._id)
      );
      toast({
        title: 'Deleted',
        description: 'Expense deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete expense. Please try again.',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary p-2.5">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Expense Tracker
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your personal finances
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchExpenses}
              disabled={isLoading}
              title="Refresh expenses"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Expense Form */}
          <ExpenseForm
            onSubmit={handleSubmit}
            editingExpense={editingExpense}
            onCancel={handleCancelEdit}
            isLoading={isSubmitting}
          />

          {/* Expense List */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Recent Expenses
            </h2>
            <ExpenseList
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              isLoading={isLoading}
            />
          </section>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title={expenseToDelete?.title}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Home;
