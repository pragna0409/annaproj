import React, { useState } from 'react';
import { Plus, Save, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Client } from '../types';

interface ClientManagementProps {
  onNavigate: (page: string) => void;
}

export const ClientManagement: React.FC<ClientManagementProps> = ({ onNavigate }) => {
  const { clients, addClients, updateClient, deleteClient } = useData();
  const { user } = useAuth();
  const [clientForms, setClientForms] = useState<Omit<Client, 'id' | 'createdAt'>[]>([
    { name: '', address: '', phone: '', email: '' }
  ]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showExistingClients, setShowExistingClients] = useState(false);

  const canEdit = user?.role === 'root' || user?.role === 'edit' || user?.role === 'full';

  const handleFormChange = (index: number, field: keyof Omit<Client, 'id' | 'createdAt'>, value: string) => {
    setClientForms(prev => 
      prev.map((form, i) => 
        i === index ? { ...form, [field]: value } : form
      )
    );
  };

  const addNewForm = () => {
    setClientForms(prev => [...prev, { name: '', address: '', phone: '', email: '' }]);
  };

  const removeForm = (index: number) => {
    setClientForms(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const validForms = clientForms.filter(form => 
      form.name.trim() && form.address.trim() && form.phone.trim() && form.email.trim()
    );
    
    if (validForms.length > 0) {
      addClients(validForms);
      setClientForms([{ name: '', address: '', phone: '', email: '' }]);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
  };

  const handleUpdate = () => {
    if (editingClient) {
      updateClient(editingClient.id, editingClient);
      setEditingClient(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      deleteClient(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-white">Client Management</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowExistingClients(false)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !showExistingClients 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Add New Clients
        </button>
        <button
          onClick={() => setShowExistingClients(true)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            showExistingClients 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          View Existing Clients
        </button>
      </div>

      {!showExistingClients ? (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Add New Clients</h2>
            <div className="flex gap-2">
              <button
                onClick={addNewForm}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save All
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {clientForms.map((form, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Client {index + 1}</h3>
                  {clientForms.length > 1 && (
                    <button
                      onClick={() => removeForm(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleFormChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Client name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleFormChange(index, 'phone', e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleFormChange(index, 'email', e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Address</label>
                    <textarea
                      value={form.address}
                      onChange={(e) => handleFormChange(index, 'address', e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Full address"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Existing Clients</h2>
          
          {clients.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No clients added yet</p>
          ) : (
            <div className="space-y-4">
              {clients.map(client => (
                <div key={client.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  {editingClient?.id === client.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-1">Name</label>
                          <input
                            type="text"
                            value={editingClient.name}
                            onChange={(e) => setEditingClient({...editingClient, name: e.target.value})}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-1">Phone</label>
                          <input
                            type="tel"
                            value={editingClient.phone}
                            onChange={(e) => setEditingClient({...editingClient, phone: e.target.value})}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-1">Email</label>
                          <input
                            type="email"
                            value={editingClient.email}
                            onChange={(e) => setEditingClient({...editingClient, email: e.target.value})}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-1">Address</label>
                          <textarea
                            value={editingClient.address}
                            onChange={(e) => setEditingClient({...editingClient, address: e.target.value})}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdate}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setEditingClient(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-white">{client.name}</h3>
                        <p className="text-gray-400">{client.email}</p>
                        <p className="text-gray-400">{client.phone}</p>
                        <p className="text-gray-400">{client.address}</p>
                      </div>
                      {canEdit && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(client)}
                            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};