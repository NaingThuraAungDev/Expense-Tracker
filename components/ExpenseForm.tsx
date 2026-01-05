
import React, { useState, useRef, useEffect } from 'react';
import { scanReceipt } from '../geminiService';
import { Expense } from '../types';
import { Camera, Loader2, X, Check, Save } from 'lucide-react';

interface ExpenseFormProps {
  onSave: (expense: Expense) => void;
  onCancel: () => void;
  initialData?: Expense;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSave, onCancel, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Expense>>({
    amount: undefined,
    merchant: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount,
        merchant: initialData.merchant,
        category: initialData.category,
        date: initialData.date,
        isAiGenerated: initialData.isAiGenerated,
      });
    }
  }, [initialData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await scanReceipt(base64);
        setFormData({
          ...formData,
          amount: result.amount,
          merchant: result.merchant,
          category: result.category,
          date: result.date || new Date().toISOString().split('T')[0],
          isAiGenerated: true,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Scanning failed:", error);
      alert("Failed to scan receipt. Please try again or enter manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount === undefined || !formData.merchant || !formData.category) {
      alert("Please fill in all required fields.");
      return;
    }

    const expense: Expense = {
      id: initialData?.id || crypto.randomUUID(),
      amount: Number(formData.amount),
      merchant: formData.merchant!,
      category: formData.category!,
      date: formData.date!,
      isAiGenerated: formData.isAiGenerated || false,
    };

    onSave(expense);
  };

  return (
    <div className="p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {initialData ? 'Edit Expense' : 'Add Expense'}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      {!initialData && (
        <div className="mb-8 flex gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="flex-1 bg-indigo-50 border-2 border-dashed border-indigo-200 p-6 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-indigo-100 transition-colors group"
          >
            {loading ? (
              <Loader2 className="animate-spin text-indigo-600" size={32} />
            ) : (
              <>
                <Camera className="text-indigo-600 group-hover:scale-110 transition-transform" size={32} />
                <span className="text-xs font-bold text-indigo-700">Scan Receipt</span>
              </>
            )}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Amount ($)</label>
            <input 
              type="number" 
              step="0.01"
              required
              className="w-full bg-white border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
              placeholder="0.00"
              value={formData.amount || ''}
              onChange={(e) => setFormData({...formData, amount: e.target.value === '' ? undefined : parseFloat(e.target.value)})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Date</label>
            <input 
              type="date" 
              required
              className="w-full bg-white border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Merchant / Title</label>
          <input 
            type="text" 
            required
            className="w-full bg-white border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
            placeholder="e.g. Starbucks, Walmart"
            value={formData.merchant}
            onChange={(e) => setFormData({...formData, merchant: e.target.value})}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Category</label>
          <select 
            required
            className="w-full bg-white border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow appearance-none"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="">Select Category</option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Shopping">Shopping</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {formData.isAiGenerated && (
          <div className="bg-green-50 text-green-700 p-3 rounded-xl flex items-center gap-2 text-xs border border-green-100">
            <Check size={14} />
            <span>AI successfully pre-filled your receipt details!</span>
          </div>
        )}

        <div className="pt-4 flex gap-3 pb-12">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 border border-gray-200 py-4 rounded-xl font-bold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-[2] bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {initialData ? 'Update Expense' : 'Save Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
