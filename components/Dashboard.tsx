
import React, { useMemo, useState } from 'react';
import { Expense, AppSettings } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, startOfToday, startOfWeek, startOfMonth, subDays, isSameDay, isWithinInterval, startOfDay, endOfDay, parseISO } from 'date-fns';
import { Wallet, TrendingUp, AlertCircle, Calendar, Filter, X } from 'lucide-react';

interface DashboardProps {
  expenses: Expense[];
  settings: AppSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, settings }) => {
  const today = startOfToday();
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const dailyTotal = useMemo(() => {
    return expenses
      .filter(e => isSameDay(new Date(e.date), today))
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses, today]);

  const isOverLimit = dailyTotal > settings.dailyLimit;

  // Custom range summary
  const customRangeSummary = useMemo(() => {
    if (!filterStart || !filterEnd) return null;
    const filtered = expenses.filter(e => {
      const expenseDate = parseISO(e.date);
      return isWithinInterval(expenseDate, {
        start: startOfDay(parseISO(filterStart)),
        end: endOfDay(parseISO(filterEnd))
      });
    });
    return {
      total: filtered.reduce((acc, curr) => acc + curr.amount, 0),
      count: filtered.length
    };
  }, [expenses, filterStart, filterEnd]);

  // Prepare chart data for last 7 days
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayStr = format(date, 'MMM dd');
      const total = expenses
        .filter(e => isSameDay(new Date(e.date), date))
        .reduce((acc, curr) => acc + curr.amount, 0);
      data.push({ name: dayStr, amount: total });
    }
    return data;
  }, [expenses, today]);

  const stats = useMemo(() => {
    const weekStart = startOfWeek(today);
    const monthStart = startOfMonth(today);
    
    return {
      week: expenses.filter(e => new Date(e.date) >= weekStart).reduce((a, b) => a + b.amount, 0),
      month: expenses.filter(e => new Date(e.date) >= monthStart).reduce((a, b) => a + b.amount, 0),
    };
  }, [expenses, today]);

  return (
    <div className="p-4 space-y-4">
      {/* Date Range Filter Section */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-indigo-600">
            <Calendar size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Quick Filter</span>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="text-[10px] font-bold text-gray-400 flex items-center gap-1 hover:text-indigo-600"
          >
            {showFilters ? <X size={14} /> : <Filter size={14} />}
            {showFilters ? 'Close' : 'Custom Range'}
          </button>
        </div>
        
        {showFilters && (
          <div className="flex items-center gap-2 mt-2 animate-in slide-in-from-top-2 duration-200">
            <input 
              type="date" 
              className="flex-1 bg-gray-50 border border-gray-100 p-2 rounded-lg text-[10px]"
              value={filterStart}
              onChange={(e) => setFilterStart(e.target.value)}
            />
            <span className="text-gray-300 text-xs">to</span>
            <input 
              type="date" 
              className="flex-1 bg-gray-50 border border-gray-100 p-2 rounded-lg text-[10px]"
              value={filterEnd}
              onChange={(e) => setFilterEnd(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Custom Range Result Card */}
      {customRangeSummary && (
        <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow-lg animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-wider">Custom Range Spent</p>
              <h2 className="text-3xl font-black mt-1">${customRangeSummary.total.toFixed(2)}</h2>
              <p className="text-indigo-200 text-[10px] mt-1 italic">{customRangeSummary.count} transactions recorded</p>
            </div>
            <button 
              onClick={() => { setFilterStart(''); setFilterEnd(''); }}
              className="bg-indigo-500 hover:bg-indigo-400 p-1.5 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Daily Status Card */}
      <div className={`p-5 rounded-2xl shadow-sm border transition-colors ${isOverLimit ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Spent Today</p>
            <h2 className={`text-3xl font-black mt-1 ${isOverLimit ? 'text-red-600' : 'text-gray-800'}`}>
              ${dailyTotal.toFixed(2)}
            </h2>
          </div>
          <div className={`p-3 rounded-xl ${isOverLimit ? 'bg-red-100 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
            <Wallet size={24} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Daily Limit: ${settings.dailyLimit}</span>
            <span className={isOverLimit ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
              {isOverLimit ? `${((dailyTotal / settings.dailyLimit) * 100 - 100).toFixed(0)}% Over` : 'On track'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${isOverLimit ? 'bg-red-500' : 'bg-indigo-500'}`} 
              style={{ width: `${Math.min((dailyTotal / settings.dailyLimit) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {isOverLimit && (
          <div className="mt-4 flex items-center gap-2 text-red-700 bg-red-100/50 p-2 rounded-lg text-xs animate-pulse">
            <AlertCircle size={14} />
            <span>Budget Alert: You've exceeded your daily limit!</span>
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-bold uppercase">This Week</p>
          <p className="text-xl font-bold text-gray-800">${stats.week.toFixed(2)}</p>
          <div className="mt-2 text-[10px] text-indigo-600 flex items-center gap-1">
            <TrendingUp size={10} />
            <span>Active spending</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-bold uppercase">This Month</p>
          <p className="text-xl font-bold text-gray-800">${stats.month.toFixed(2)}</p>
          <div className="mt-2 text-[10px] text-gray-400">Monthly overview</div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Spending Trends (7 Days)</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#9ca3af'}} 
              />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: '#f3f4f6'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.amount > settings.dailyLimit ? '#ef4444' : '#4f46e5'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
