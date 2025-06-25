
import { CATEGORY_KEYWORDS } from '@/types/expense';

export const predictCategory = (description: string): string | null => {
  const text = description.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'Other') continue;
    
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }
  
  return null;
};
