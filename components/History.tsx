
import React, { useState, useMemo } from 'react';
import { Expense } from '../types';
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Search, Filter, Trash2, Calendar, ShoppingBag, Coffee, Car, Film, Zap, Heart, MoreHorizontal, Edit2 } from 'lucide-react';

interface HistoryProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'Food & Dining': return <Coffee size={16} />;
    case 'Shopping': return <ShoppingBag size={16} />;
    case 'Transportation': return <Car size={16} />;
    case 'Entertainment': return <Film size={16} />;
    case 'Utilities': return <Zap size={16} />;
    case 'Health': return <Heart size={16} />;
    default: return <MoreHorizontal size={16} />;
  }
};

const History: React.FC<HistoryProps> = ({ expenses, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(e => {
        const matchesSearch = e.merchant.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             e.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesDate = true;
        if (startDate && endDate) {
          const expenseDate = parseISO(e.date);
          matchesDate = isWithinInterval(expenseDate, {
            start: startOfDay(parseISO(startDate)),
            end: endOfDay(parseISO(endDate))
          });
        }
        
        return matchesSearch && matchesDate;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, searchTerm, startDate, endDate]);

  const totalFiltered = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-800">History</h2>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}
        >
          <Filter size={20} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text"
          placeholder="Search by merchant or category..."
          className="w-full bg-white border border-gray-200 py-3 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Date Range</p>
          <div className="grid grid-cols-2 gap-3">
            <input 
              type="date" 
              className="bg-gray-50 border border-gray-200 p-2 rounded-lg text-sm w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input 
              type="date" 
              className="bg-gray-50 border border-gray-200 p-2 rounded-lg text-sm w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {(startDate || endDate) && (
            <button 
              onClick={() => {setStartDate(''); setEndDate('');}}
              className="mt-3 text-xs text-indigo-600 font-bold"
            >
              Clear Dates
            </button>
          )}
        </div>
      )}

      {filteredExpenses.length > 0 && (
        <div className="flex justify-between items-center text-xs font-bold text-gray-400 px-1">
          <span>{filteredExpenses.length} TRANSACTIONS</span>
          <span>TOTAL: ${totalFiltered.toFixed(2)}</span>
        </div>
      )}

      <div className="space-y-3 pb-8">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <div 
              key={expense.id} 
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100 shrink-0">
                  <CategoryIcon category={expense.category} />
                </div>
                <div className="truncate">
                  <h4 className="font-bold text-gray-800 leading-tight truncate">{expense.merchant}</h4>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {format(parseISO(expense.date), 'MMM dd, yyyy')} • {expense.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-black text-gray-800 mr-2 shrink-0">${expense.amount.toFixed(2)}</p>
                <div className="flex gap-1">
                  <button 
                    onClick={() => onEdit(expense)}
                    className="p-2 text-gray-300 hover:text-indigo-600 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(expense.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar size={32} />
            </div>
            <p className="text-sm font-medium">No expenses found for this selection</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
