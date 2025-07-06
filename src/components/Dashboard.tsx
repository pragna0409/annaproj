import React, { useState } from 'react';
import { Plus, FileText, Users, Package, History, Bell, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { clients, inventory, chalans } = useData();
  const [reminders, setReminders] = useState([
    { id: 1, text: 'MTR Delivery Chalan pending', completed: false },
    { id: 2, text: 'Giva rigid box delivery pending', completed: false }
  ]);

  const canEdit = user?.role === 'root' || user?.role === 'edit' || user?.role === 'full';

  const toggleReminder = (id: number) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const deleteReminder = (id: number) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const addReminder = () => {
    const text = prompt('Enter reminder text:');
    if (text) {
      setReminders(prev => [...prev, { 
        id: Date.now(), 
        text, 
        completed: false 
      }]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-blue-200">Welcome back, {user?.username}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Total Clients</p>
              <p className="text-2xl font-bold text-white">{clients.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Inventory Items</p>
              <p className="text-2xl font-bold text-white">{inventory.length}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Total Chalans</p>
              <p className="text-2xl font-bold text-white">{chalans.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <button
          onClick={() => onNavigate('create-chalan')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold mb-2">Create a Chalan</h3>
            <p className="text-blue-100 text-sm">Create a chalan and download its PDF</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('clients')}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold mb-2">Clients</h3>
            <p className="text-emerald-100 text-sm">Manage client database</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('inventory')}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold mb-2">Inventory</h3>
            <p className="text-purple-100 text-sm">Manage client inventory</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('history')}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold mb-2">History</h3>
            <p className="text-orange-100 text-sm">View and manage records</p>
          </div>
        </button>
      </div>

      {/* Reminders Section */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Reminders
          </h2>
          <button
            onClick={addReminder}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Add Reminder
          </button>
        </div>
        
        <div className="space-y-3">
          {reminders.map(reminder => (
            <div
              key={reminder.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                reminder.completed 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'bg-yellow-500/10 border border-yellow-500/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    reminder.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-yellow-500 hover:border-yellow-400'
                  }`}
                >
                  {reminder.completed && <CheckCircle className="w-3 h-3" />}
                </button>
                <span className={`${reminder.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                  {reminder.text}
                </span>
              </div>
              {canEdit && (
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-red-400 hover:text-red-300 transition-colors text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          
          {reminders.length === 0 && (
            <p className="text-gray-400 text-center py-4">No reminders yet</p>
          )}
        </div>
      </div>
    </div>
  );
};