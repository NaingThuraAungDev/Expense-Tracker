
import { Expense, AppSettings } from './types';

const EXPENSES_KEY = 'smartreceipt_expenses';
const SETTINGS_KEY = 'smartreceipt_settings';

export const db = {
  getExpenses: (): Expense[] => {
    const data = localStorage.getItem(EXPENSES_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveExpense: (expense: Expense) => {
    const expenses = db.getExpenses();
    expenses.push(expense);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  },

  updateExpense: (updatedExpense: Expense) => {
    const expenses = db.getExpenses();
    const index = expenses.findIndex(e => e.id === updatedExpense.id);
    if (index !== -1) {
      expenses[index] = updatedExpense;
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    }
  },

  deleteExpense: (id: string) => {
    const expenses = db.getExpenses().filter(e => e.id !== id);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  },

  getSettings: (): AppSettings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { dailyLimit: 50 };
  },

  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};
