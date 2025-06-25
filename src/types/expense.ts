
export interface Expense {
  id: string;
  amount: number;
  category: 'Food' | 'Travel' | 'Shopping' | 'Bills' | 'Other';
  description: string;
  date: string; // YYYY-MM-DD format
}

export interface SpendingGoal {
  category: string;
  limit: number;
  spent: number;
}

export interface WeeklySnapshot {
  weekStart: string;
  totalSpent: number;
  categoryBreakdown: Record<string, number>;
}

export interface Theme {
  name: string;
  value: 'light' | 'dark' | 'retro';
  icon: string;
}

export const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Other'] as const;

export const CATEGORY_COLORS = {
  Food: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Travel: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Shopping: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  Bills: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  Other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
} as const;

// Auto-categorization keywords
export const CATEGORY_KEYWORDS = {
  Food: ['food', 'restaurant', 'pizza', 'burger', 'coffee', 'lunch', 'dinner', 'breakfast', 'snack', 'grocery', 'market', 'cafe', 'kitchen', 'meal', 'eat', 'drink'],
  Travel: ['flight', 'hotel', 'taxi', 'uber', 'bus', 'train', 'gas', 'fuel', 'petrol', 'parking', 'toll', 'airport', 'vacation', 'trip', 'travel'],
  Shopping: ['shop', 'store', 'amazon', 'flipkart', 'clothes', 'shoes', 'electronics', 'gadget', 'phone', 'laptop', 'book', 'gift', 'mall', 'online'],
  Bills: ['bill', 'electric', 'water', 'internet', 'phone', 'mobile', 'rent', 'insurance', 'loan', 'emi', 'subscription', 'netflix', 'spotify', 'utility'],
  Other: []
} as const;

export const THEMES: Theme[] = [
  { name: 'Light', value: 'light', icon: '☀️' },
  { name: 'Dark', value: 'dark', icon: '🌙' },
  { name: 'Retro', value: 'retro', icon: '💚' }
];
