
import { Expense, WeeklySnapshot } from '@/types/expense';

export const generateSpendingInsights = (expenses: Expense[]): string[] => {
  const insights: string[] = [];
  
  // Current week analysis
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const weekStartStr = weekStart.toISOString().split('T')[0];
  
  const thisWeekExpenses = expenses.filter(expense => expense.date >= weekStartStr);
  const categoryTotals = thisWeekExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Find highest spending category - only if there are categories
  const categoryEntries = Object.entries(categoryTotals);
  if (categoryEntries.length > 0) {
    const topCategory = categoryEntries.reduce((a, b) => 
      categoryTotals[a[0]] > categoryTotals[b[0]] ? a : b
    );
    
    if (topCategory && topCategory[1] > 0) {
      insights.push(`You spent the most on ${topCategory[0]} this week (₹${topCategory[1].toFixed(2)})`);
    }
  }
  
  // Compare with last week
  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekStartStr = lastWeekStart.toISOString().split('T')[0];
  
  const lastWeekExpenses = expenses.filter(expense => 
    expense.date >= lastWeekStartStr && expense.date < weekStartStr
  );
  
  const thisWeekTotal = thisWeekExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const lastWeekTotal = lastWeekExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  if (lastWeekTotal > 0) {
    const change = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;
    if (Math.abs(change) > 5) {
      const direction = change > 0 ? 'increased' : 'decreased';
      insights.push(`Spending ${direction} by ${Math.abs(change).toFixed(1)}% compared to last week`);
    }
  }
  
  // Add more insights
  if (thisWeekExpenses.length > 0) {
    const averageExpense = thisWeekTotal / thisWeekExpenses.length;
    insights.push(`Average expense this week: ₹${averageExpense.toFixed(2)}`);
  }
  
  return insights;
};

export const saveWeeklySnapshot = (expenses: Expense[]) => {
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const weekStartStr = weekStart.toISOString().split('T')[0];
  
  const weekExpenses = expenses.filter(expense => expense.date >= weekStartStr);
  const totalSpent = weekExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryBreakdown = weekExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const snapshot: WeeklySnapshot = {
    weekStart: weekStartStr,
    totalSpent,
    categoryBreakdown
  };
  
  const snapshots = JSON.parse(localStorage.getItem('weeklySnapshots') || '[]');
  const existingIndex = snapshots.findIndex((s: WeeklySnapshot) => s.weekStart === weekStartStr);
  
  if (existingIndex >= 0) {
    snapshots[existingIndex] = snapshot;
  } else {
    snapshots.push(snapshot);
  }
  
  localStorage.setItem('weeklySnapshots', JSON.stringify(snapshots));
};
