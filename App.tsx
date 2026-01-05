
import React, { useState, useEffect, useCallback } from 'react';
import { db } from './db';
import { Expense, AppSettings, ViewType } from './types';
import Dashboard from './components/Dashboard';
import History from './components/History';
import ExpenseForm from './components/ExpenseForm';
import Settings from './components/Settings';
import { LayoutDashboard, History as HistoryIcon, PlusCircle, Settings as SettingsIcon } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ dailyLimit: 50 });
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  const loadData = useCallback(() => {
    setExpenses(db.getExpenses());
    setSettings(db.getSettings());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveExpense = (expense: Expense) => {
    if (editingExpense) {
      db.updateExpense(expense);
    } else {
      db.saveExpense(expense);
    }
    setEditingExpense(undefined);
    loadData();
    setView('dashboard');
  };

  const handleDeleteExpense = (id: string) => {
    db.deleteExpense(id);
    loadData();
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setView('add');
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    db.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard expenses={expenses} settings={settings} />;
      case 'history':
        return <History expenses={expenses} onDelete={handleDeleteExpense} onEdit={handleEditExpense} />;
      case 'add':
        return (
          <ExpenseForm 
            onSave={handleSaveExpense} 
            onCancel={() => {
              setEditingExpense(undefined);
              setView('dashboard');
            }} 
            initialData={editingExpense}
          />
        );
      case 'settings':
        return <Settings settings={settings} onSave={handleUpdateSettings} />;
      default:
        return <Dashboard expenses={expenses} settings={settings} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 overflow-hidden relative shadow-2xl">
      {/* Top Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold tracking-tight">SmartReceipt</h1>
        <div className="text-xs bg-indigo-500 px-2 py-1 rounded-full uppercase font-medium">
          {view === 'add' && editingExpense ? 'edit' : view}
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
        <button 
          onClick={() => { setView('dashboard'); setEditingExpense(undefined); }}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium">Overview</span>
        </button>
        <button 
          onClick={() => { setView('history'); setEditingExpense(undefined); }}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'history' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <HistoryIcon size={24} />
          <span className="text-[10px] font-medium">History</span>
        </button>
        <button 
          onClick={() => { setView('add'); setEditingExpense(undefined); }}
          className="flex flex-col items-center -mt-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <PlusCircle size={32} />
        </button>
        <button 
          onClick={() => { setView('settings'); setEditingExpense(undefined); }}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'settings' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <SettingsIcon size={24} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
