import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Expense } from '@/types/expense';
import { ExpenseForm } from './ExpenseForm';

interface CalendarViewProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  expenses, 
  onAddExpense 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const getExpensesForDate = (dateStr: string) => {
    return expenses.filter(expense => expense.date === dateStr);
  };

  const getTotalForDate = (dateStr: string) => {
    return getExpensesForDate(dateStr).reduce((sum, expense) => sum + expense.amount, 0);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: number) => {
    const dateStr = formatDate(day);
    setSelectedDate(dateStr);
    setShowModal(true);
  };

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    onAddExpense({
      ...expense,
      date: selectedDate || expense.date
    });
    setShowModal(false);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Create array of days including empty cells for proper alignment
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Add actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendar View
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {monthName}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium p-2 text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={index} className="p-2" />;
              }
              
              const dateStr = formatDate(day);
              const dayExpenses = getExpensesForDate(dateStr);
              const total = getTotalForDate(dateStr);
              const hasExpenses = dayExpenses.length > 0;
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              
              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`
                    p-2 text-center cursor-pointer rounded-lg transition-colors
                    hover:bg-gray-100 dark:hover:bg-gray-800 retro:hover:bg-green-900/20
                    ${isToday ? 'bg-blue-100 dark:bg-blue-900/30 retro:bg-green-900/30' : ''}
                    ${hasExpenses ? 'bg-red-50 dark:bg-red-900/20 retro:bg-red-900/20 border border-red-200 dark:border-red-800 retro:border-red-600' : ''}
                  `}
                >
                  <div className="text-sm font-medium">{day}</div>
                  {hasExpenses && (
                    <div className="text-xs text-red-600 dark:text-red-400 retro:text-red-400 mt-1">
                      ₹{total.toFixed(0)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal for adding/viewing expenses */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Expenses for {selectedDate ? new Date(selectedDate).toLocaleDateString() : ''}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Show existing expenses for the date */}
            {selectedDate && getExpensesForDate(selectedDate).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Existing Expenses:</h4>
                {getExpensesForDate(selectedDate).map(expense => (
                  <div key={expense.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 retro:bg-green-900/10 rounded">
                    <div>
                      <div className="font-medium">₹{expense.amount.toFixed(2)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 retro:text-green-400">{expense.description}</div>
                    </div>
                    <div className="text-sm text-gray-500">{expense.category}</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add new expense form */}
            <div>
              <h4 className="font-medium mb-2">Add New Expense:</h4>
              <ExpenseForm 
                onAddExpense={handleAddExpense}
                defaultDate={selectedDate || undefined}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
