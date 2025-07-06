import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

interface HistoryProps {
  onNavigate: (page: string) => void;
}

export const History: React.FC<HistoryProps> = ({ onNavigate }) => {
  const { clients, inventory, chalans, deleteClient, deleteInventoryItem, deleteChalan } = useData();
  const { user } = useAuth();
  const [fetchType, setFetchType] = useState<'client' | 'chalan'>('client');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedChalan, setSelectedChalan] = useState<any>(null);

  const canEdit = user?.role === 'root' || user?.role === 'edit' || user?.role === 'full';

  const handleShow = () => {
    setShowResults(true);
  };

  const handleDeleteClient = (id: string) => {
    if (confirm('Are you sure you want to delete this client and all related data?')) {
      deleteClient(id);
      // Also delete related inventory and chalans
      inventory.filter(item => item.clientId === id).forEach(item => deleteInventoryItem(item.id));
      chalans.filter(chalan => chalan.clientId === id).forEach(chalan => deleteChalan(chalan.id));
    }
  };

  const handleDeleteChalan = (id: string) => {
    if (confirm('Are you sure you want to delete this chalan?')) {
      deleteChalan(id);
    }
  };

  const filteredChalans = chalans.filter(chalan => {
    if (selectedDate) {
      return chalan.date === selectedDate;
    }
    return true;
  });

  const selectedClientData = selectedClientId ? clients.find(c => c.id === selectedClientId) : null;
  const clientInventory = selectedClientId ? inventory.filter(item => item.clientId === selectedClientId) : [];
  const clientChalans = selectedClientId ? chalans.filter(chalan => chalan.clientId === selectedClientId) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-white">History</h1>
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Fetch Type</label>
            <select
              value={fetchType}
              onChange={(e) => {
                setFetchType(e.target.value as 'client' | 'chalan');
                setShowResults(false);
              }}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="client" className="text-gray-900">Client</option>
              <option value="chalan" className="text-gray-900">Chalan</option>
            </select>
          </div>

          {fetchType === 'client' && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">Select Client</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" className="text-gray-900">Choose a client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id} className="text-gray-900">
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {fetchType === 'chalan' && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">Select Date (Optional)</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            onClick={handleShow}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" />
            Show
          </button>
        </div>
      </div>

      {showResults && (
        <div className="space-y-6">
          {fetchType === 'client' && selectedClientData && (
            <>
              {/* Client Details */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Client Information</h2>
                  {canEdit && (
                    <button
                      onClick={() => handleDeleteClient(selectedClientData.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-300">Name</p>
                    <p className="text-white font-medium">{selectedClientData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Phone</p>
                    <p className="text-white font-medium">{selectedClientData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Email</p>
                    <p className="text-white font-medium">{selectedClientData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Address</p>
                    <p className="text-white font-medium">{selectedClientData.address}</p>
                  </div>
                </div>
              </div>

              {/* Client Inventory */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Inventory Items</h2>
                {clientInventory.length === 0 ? (
                  <p className="text-gray-400">No inventory items found</p>
                ) : (
                  <div className="space-y-3">
                    {clientInventory.map(item => (
                      <div key={item.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3">
                        <div>
                          <p className="text-white font-medium">{item.itemName}</p>
                          {item.description && <p className="text-gray-400 text-sm">{item.description}</p>}
                        </div>
                        {canEdit && (
                          <button
                            onClick={() => deleteInventoryItem(item.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Client Chalans */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Chalans</h2>
                {clientChalans.length === 0 ? (
                  <p className="text-gray-400">No chalans found</p>
                ) : (
                  <div className="space-y-3">
                    {clientChalans.map(chalan => (
                      <div key={chalan.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3">
                        <div>
                          <p className="text-white font-medium">Chalan #{chalan.serialNumber}</p>
                          <p className="text-gray-400 text-sm">Date: {chalan.date}</p>
                          <p className="text-gray-400 text-sm">Items: {chalan.items.length}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedChalan(chalan)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => handleDeleteChalan(chalan.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {fetchType === 'chalan' && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Chalan History</h2>
              {filteredChalans.length === 0 ? (
                <p className="text-gray-400">No chalans found</p>
              ) : (
                <div className="space-y-3">
                  {filteredChalans.map(chalan => {
                    const client = clients.find(c => c.id === chalan.clientId);
                    return (
                      <div key={chalan.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3">
                        <div>
                          <p className="text-white font-medium">Chalan #{chalan.serialNumber}</p>
                          <p className="text-gray-400 text-sm">Client: {client?.name || 'Unknown'}</p>
                          <p className="text-gray-400 text-sm">Date: {chalan.date}</p>
                          <p className="text-gray-400 text-sm">Items: {chalan.items.length}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedChalan(chalan)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => handleDeleteChalan(chalan.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Chalan Details Modal */}
      {selectedChalan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Chalan Details</h2>
              <button
                onClick={() => setSelectedChalan(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Serial Number</p>
                  <p className="font-medium">{selectedChalan.serialNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{selectedChalan.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">PO Date</p>
                  <p className="font-medium">{selectedChalan.poDate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">PO Number</p>
                  <p className="font-medium">{selectedChalan.poNumber || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Items</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Particulars</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Boxes</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Cost/Box</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedChalan.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="border border-gray-300 px-4 py-2">{item.sno}</td>
                          <td className="border border-gray-300 px-4 py-2">{item.particulars}</td>
                          <td className="border border-gray-300 px-4 py-2">{item.noOfBoxes}</td>
                          <td className="border border-gray-300 px-4 py-2">{item.costPerBox}</td>
                          <td className="border border-gray-300 px-4 py-2">{item.totalQty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Vehicle No.</p>
                  <p className="font-medium">{selectedChalan.vehicleNo || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created By</p>
                  <p className="font-medium">{selectedChalan.createdBy}</p>
                </div>
              </div>
              
              {selectedChalan.remarks && (
                <div>
                  <p className="text-sm text-gray-600">Remarks</p>
                  <p className="font-medium">{selectedChalan.remarks}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};