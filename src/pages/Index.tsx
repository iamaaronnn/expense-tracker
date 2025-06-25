
import React, { useState, useEffect } from 'react';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseSummary } from '@/components/ExpenseSummary';
import { ExpenseFilters } from '@/components/ExpenseFilters';
import { SpendingInsights } from '@/components/SpendingInsights';
import { SpendingGoals } from '@/components/SpendingGoals';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DataManager } from '@/components/DataManager';
import { CalendarView } from '@/components/CalendarView';
import { Button } from '@/components/ui/button';
import { Expense } from '@/types/expense';
import { saveWeeklySnapshot } from '@/utils/spendingInsights';
import { Calendar, Grid } from 'lucide-react';

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');

  // Load expenses from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses);
      setExpenses(parsedExpenses);
      setFilteredExpenses(parsedExpenses);
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    if (expenses.length > 0) {
      saveWeeklySnapshot(expenses);
    }
  }, [expenses]);

  // Filter expenses based on current filters
  useEffect(() => {
    let filtered = expenses;
    
    if (filters.category) {
      filtered = filtered.filter(expense => expense.category === filters.category);
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(expense => expense.date >= filters.startDate);
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(expense => expense.date <= filters.endDate);
    }
    
    setFilteredExpenses(filtered);
  }, [expenses, filters]);

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString()
    };
    setExpenses(prev => [expense, ...prev]);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleImportExpenses = (importedExpenses: Expense[]) => {
    setExpenses(prev => [...importedExpenses, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 retro:bg-black transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid View
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
            </div>
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 retro:text-green-400 mb-2">
            Expense Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300 retro:text-green-300">
            Track your expenses and manage your budget with smart insights
          </p>
        </header>

        {viewMode === 'calendar' ? (
          <CalendarView expenses={expenses} onAddExpense={addExpense} />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Left Column - Form and Goals */}
            <div className="xl:col-span-1 space-y-6">
              <ExpenseForm onAddExpense={addExpense} />
              <SpendingGoals expenses={expenses} />
              <DataManager 
                expenses={expenses} 
                onImportExpenses={handleImportExpenses} 
              />
            </div>

            {/* Middle Column - Summary and Insights */}
            <div className="xl:col-span-1 space-y-6">
              <ExpenseSummary expenses={expenses} />
              <SpendingInsights expenses={expenses} />
            </div>

            {/* Right Column - Filters and List */}
            <div className="xl:col-span-2 space-y-6">
              <ExpenseFilters 
                filters={filters} 
                onFilterChange={handleFilterChange}
                expenseCount={filteredExpenses.length}
              />
              <ExpenseList expenses={filteredExpenses} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
