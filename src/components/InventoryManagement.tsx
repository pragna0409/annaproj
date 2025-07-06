import React, { useState } from 'react';
import { Plus, Save, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { InventoryItem } from '../types';

interface InventoryManagementProps {
  onNavigate: (page: string) => void;
}

export const InventoryManagement: React.FC<InventoryManagementProps> = ({ onNavigate }) => {
  const { clients, inventory, addInventoryItems, updateInventoryItem, deleteInventoryItem } = useData();
  const { user } = useAuth();
  const [selectedClientId, setSelectedClientId] = useState('');
  const [inventoryForms, setInventoryForms] = useState<Omit<InventoryItem, 'id' | 'createdAt'>[]>([
    { clientId: '', itemName: '', description: '' }
  ]);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showExistingInventory, setShowExistingInventory] = useState(false);

  const canEdit = user?.role === 'root' || user?.role === 'edit' || user?.role === 'full';

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    setInventoryForms(prev => 
      prev.map(form => ({ ...form, clientId }))
    );
  };

  const handleFormChange = (index: number, field: keyof Omit<InventoryItem, 'id' | 'createdAt'>, value: string) => {
    setInventoryForms(prev => 
      prev.map((form, i) => 
        i === index ? { ...form, [field]: value } : form
      )
    );
  };

  const addNewForm = () => {
    setInventoryForms(prev => [...prev, { 
      clientId: selectedClientId, 
      itemName: '', 
      description: '' 
    }]);
  };

  const removeForm = (index: number) => {
    setInventoryForms(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const validForms = inventoryForms.filter(form => 
      form.clientId && form.itemName.trim()
    );
    
    if (validForms.length > 0) {
      addInventoryItems(validForms);
      setInventoryForms([{ clientId: selectedClientId, itemName: '', description: '' }]);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
  };

  const handleUpdate = () => {
    if (editingItem) {
      updateInventoryItem(editingItem.id, editingItem);
      setEditingItem(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      deleteInventoryItem(id);
    }
  };

  const filteredInventory = showExistingInventory 
    ? inventory.filter(item => !selectedClientId || item.clientId === selectedClientId)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowExistingInventory(false)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !showExistingInventory 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Add Inventory
        </button>
        <button
          onClick={() => setShowExistingInventory(true)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            showExistingInventory 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          View Existing Inventory
        </button>
      </div>

      {/* Client Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white mb-2">Choose Client</label>
        <select
          value={selectedClientId}
          onChange={(e) => handleClientChange(e.target.value)}
          className="w-full md:w-64 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" className="text-gray-900">Select a client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id} className="text-gray-900">
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {!showExistingInventory ? (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Add Inventory Items</h2>
            <div className="flex gap-2">
              <button
                onClick={addNewForm}
                disabled={!selectedClientId}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedClientId}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save All
              </button>
            </div>
          </div>

          {!selectedClientId ? (
            <p className="text-gray-400 text-center py-8">Please select a client first</p>
          ) : (
            <div className="space-y-6">
              {inventoryForms.map((form, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Item {index + 1}</h3>
                    {inventoryForms.length > 1 && (
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
                      <label className="block text-sm font-medium text-white mb-1">Item Name</label>
                      <input
                        type="text"
                        value={form.itemName}
                        onChange={(e) => handleFormChange(index, 'itemName', e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter item name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">Description (Optional)</label>
                      <input
                        type="text"
                        value={form.description || ''}
                        onChange={(e) => handleFormChange(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Existing Inventory</h2>
          
          {filteredInventory.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              {selectedClientId ? 'No inventory items found for this client' : 'No inventory items found'}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredInventory.map(item => {
                const client = clients.find(c => c.id === item.clientId);
                return (
                  <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    {editingItem?.id === item.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-white mb-1">Item Name</label>
                            <input
                              type="text"
                              value={editingItem.itemName}
                              onChange={(e) => setEditingItem({...editingItem, itemName: e.target.value})}
                              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white mb-1">Description</label>
                            <input
                              type="text"
                              value={editingItem.description || ''}
                              onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
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
                            onClick={() => setEditingItem(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">{item.itemName}</h3>
                          <p className="text-gray-400">Client: {client?.name || 'Unknown'}</p>
                          {item.description && <p className="text-gray-400">Description: {item.description}</p>}
                        </div>
                        {canEdit && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};