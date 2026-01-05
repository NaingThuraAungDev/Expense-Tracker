
import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Bell, CreditCard, Shield, User, Info, Save } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [limit, setLimit] = useState(settings.dailyLimit.toString());

  const handleSave = () => {
    onSave({ dailyLimit: parseFloat(limit) || 0 });
    alert("Settings saved successfully!");
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Settings</h2>

      {/* Account Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <User size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">User Profile</h3>
            <p className="text-[10px] text-gray-400 font-medium">Local storage account</p>
          </div>
        </div>
        
        <div className="p-4 space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Daily Expense Limit ($)</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="number" 
                className="w-full bg-gray-50 border border-gray-100 py-3 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              />
            </div>
            <p className="text-[10px] text-gray-400 ml-1 mt-1">We'll alert you if you cross this threshold in a single day.</p>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <Save size={18} />
            Save Budget Settings
          </button>
        </div>
      </div>

      {/* Other Options */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase ml-1">General</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Push Notifications</span>
            </div>
            <div className="w-10 h-5 bg-indigo-600 rounded-full relative p-1 cursor-not-allowed">
              <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Biometric Lock</span>
            </div>
            <div className="w-10 h-5 bg-gray-200 rounded-full relative p-1 cursor-not-allowed">
              <div className="w-3 h-3 bg-white rounded-full absolute left-1"></div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info size={20} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">App Version</span>
            </div>
            <span className="text-xs text-gray-400 font-mono">v1.0.4-beta</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-[10px] text-gray-400 italic">SmartReceipt • Personal Finance Made Easy</p>
      </div>
    </div>
  );
};

export default Settings;
