
import { Expense } from '@/types/expense';

export const exportToCSV = (expenses: Expense[]) => {
  const headers = ['date', 'amount', 'category', 'description'];
  const csvContent = [
    headers.join(','),
    ...expenses.map(expense => 
      [expense.date, expense.amount, expense.category, `"${expense.description}"`].join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const importFromCSV = (file: File): Promise<Expense[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',');
        
        const expenses: Expense[] = lines.slice(1).map((line, index) => {
          const values = line.split(',');
          const description = values[3]?.replace(/"/g, '') || '';
          
          return {
            id: `imported_${Date.now()}_${index}`,
            date: values[0],
            amount: parseFloat(values[1]) || 0,
            category: values[2] as Expense['category'],
            description
          };
        }).filter(expense => expense.amount > 0);
        
        resolve(expenses);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};
