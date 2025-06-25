
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Target, Edit, Check, X } from 'lucide-react';
import { Expense, SpendingGoal, CATEGORIES } from '@/types/expense';

interface SpendingGoalsProps {
  expenses: Expense[];
}

export const SpendingGoals: React.FC<SpendingGoalsProps> = ({ expenses }) => {
  const [goals, setGoals] = useState<SpendingGoal[]>([]);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [newLimit, setNewLimit] = useState<string>('');

  useEffect(() => {
    const savedGoals = localStorage.getItem('spendingGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Initialize default goals
      const defaultGoals = CATEGORIES.map(category => ({
        category,
        limit: 0,
        spent: 0
      }));
      setGoals(defaultGoals);
    }
  }, []);

  useEffect(() => {
    // Calculate current month spending
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    const updatedGoals = goals.map(goal => ({
      ...goal,
      spent: monthlyExpenses
        .filter(expense => expense.category === goal.category)
        .reduce((sum, expense) => sum + expense.amount, 0)
    }));

    setGoals(updatedGoals);
    localStorage.setItem('spendingGoals', JSON.stringify(updatedGoals));
  }, [expenses]);

  const handleSaveGoal = (category: string) => {
    const limit = parseFloat(newLimit);
    if (isNaN(limit) || limit < 0) return;

    const updatedGoals = goals.map(goal =>
      goal.category === category ? { ...goal, limit } : goal
    );

    setGoals(updatedGoals);
    localStorage.setItem('spendingGoals', JSON.stringify(updatedGoals));
    setEditingGoal(null);
    setNewLimit('');
  };

  const getProgressColor = (spent: number, limit: number) => {
    if (limit === 0) return 'bg-gray-300';
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRewardEmoji = (spent: number, limit: number) => {
    if (limit === 0) return '';
    const percentage = (spent / limit) * 100;
    if (percentage < 50) return '🎉';
    if (percentage < 80) return '👍';
    if (percentage < 100) return '⚠️';
    return '🚨';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Spending Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const percentage = goal.limit > 0 ? (goal.spent / goal.limit) * 100 : 0;
          const isEditing = editingGoal === goal.category;

          return (
            <div key={goal.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{goal.category}</span>
                  <span className="text-2xl">{getRewardEmoji(goal.spent, goal.limit)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingGoal(goal.category);
                        setNewLimit(goal.limit.toString());
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={newLimit}
                        onChange={(e) => setNewLimit(e.target.value)}
                        className="w-20 h-8"
                        placeholder="0"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveGoal(goal.category)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingGoal(null);
                          setNewLimit('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>₹{goal.spent.toFixed(2)} spent</span>
                  <span>₹{goal.limit.toFixed(2)} limit</span>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className="h-2"
                />
                <div className="text-xs text-gray-500 text-center">
                  {percentage.toFixed(1)}% used
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
