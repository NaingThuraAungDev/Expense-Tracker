
export interface Expense {
  id: string;
  amount: number;
  merchant: string;
  category: string;
  date: string; // ISO string
  isAiGenerated: boolean;
}

export interface AppSettings {
  dailyLimit: number;
}

export type ViewType = 'dashboard' | 'history' | 'add' | 'settings';
