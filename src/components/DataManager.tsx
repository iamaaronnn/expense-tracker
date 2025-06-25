
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload } from 'lucide-react';
import { Expense } from '@/types/expense';
import { exportToCSV, importFromCSV } from '@/utils/csvUtils';
import { toast } from 'sonner';

interface DataManagerProps {
  expenses: Expense[];
  onImportExpenses: (expenses: Expense[]) => void;
}

export const DataManager: React.FC<DataManagerProps> = ({ 
  expenses, 
  onImportExpenses 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (expenses.length === 0) {
      toast.error('No expenses to export');
      return;
    }
    
    exportToCSV(expenses);
    toast.success('Expenses exported successfully!');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedExpenses = await importFromCSV(file);
      onImportExpenses(importedExpenses);
      toast.success(`Imported ${importedExpenses.length} expenses successfully!`);
    } catch (error) {
      toast.error('Error importing CSV file');
      console.error(error);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={handleExport}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          
          <Button
            onClick={handleImportClick}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="text-xs text-gray-500 mt-2">
          <p>CSV Format: date,amount,category,description</p>
          <p>Example: 2024-01-15,50.00,Food,"Pizza dinner"</p>
        </div>
      </CardContent>
    </Card>
  );
};
