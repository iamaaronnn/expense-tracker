
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Lightbulb } from 'lucide-react';
import { Expense } from '@/types/expense';
import { generateSpendingInsights } from '@/utils/spendingInsights';

interface SpendingInsightsProps {
  expenses: Expense[];
}

export const SpendingInsights: React.FC<SpendingInsightsProps> = ({ expenses }) => {
  const insights = generateSpendingInsights(expenses);

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Spending Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 retro:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400 retro:text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-200 retro:text-green-200">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
