
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Sparkles } from 'lucide-react';
import { Expense, CATEGORIES } from '@/types/expense';
import { predictCategory } from '@/utils/autoCategorize';
import { toast } from 'sonner';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  defaultDate?: string;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  onAddExpense, 
  defaultDate 
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food' as Expense['category'],
    description: '',
    date: defaultDate || new Date().toISOString().split('T')[0]
  });
  const [predictedCategory, setPredictedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (formData.description.trim()) {
      const predicted = predictCategory(formData.description);
      setPredictedCategory(predicted);
    } else {
      setPredictedCategory(null);
    }
  }, [formData.description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    onAddExpense({
      amount,
      category: formData.category,
      description: formData.description.trim(),
      date: formData.date
    });

    // Reset form
    setFormData({
      amount: '',
      category: 'Food',
      description: '',
      date: defaultDate || new Date().toISOString().split('T')[0]
    });
    setPredictedCategory(null);

    toast.success('Expense added successfully!');
  };

  const applyPredictedCategory = () => {
    if (predictedCategory) {
      setFormData(prev => ({ ...prev, category: predictedCategory as Expense['category'] }));
      setPredictedCategory(null);
      toast.success(`Category set to ${predictedCategory}`);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="pl-8"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <div className="space-y-2">
              <Input
                id="description"
                type="text"
                placeholder="e.g., Lunch at restaurant"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
              
              {predictedCategory && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 retro:bg-green-900/20 rounded-lg">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 retro:text-green-400" />
                  <span className="text-sm text-blue-800 dark:text-blue-200 retro:text-green-200">
                    Suggested category:
                  </span>
                  <Badge 
                    className="cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 retro:hover:bg-green-800"
                    onClick={applyPredictedCategory}
                  >
                    {predictedCategory}
                  </Badge>
                  <span className="text-xs text-blue-600 dark:text-blue-400 retro:text-green-400">
                    (click to apply)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Expense['category'] }))}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
