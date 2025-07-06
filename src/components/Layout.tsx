import React, { ReactNode, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Trash2, Eye } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, viewProfile, deleteProfile } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      setDeleting(true);
      const success = await deleteProfile();
      setDeleting(false);
      if (success) {
        alert('Profile deleted successfully.');
      } else {
        alert('Failed to delete profile.');
      }
    }
  };

  const handleViewProfile = async () => {
    setLoadingProfile(true);
    setProfileModal(true);
    const data = await viewProfile();
    setProfileData(data);
    setLoadingProfile(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">CP</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Creative Prints</h1>
                <p className="text-sm text-blue-200">Delivery Chalan Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 relative">
              <div className="flex items-center space-x-2 text-white cursor-pointer select-none" onClick={() => setMenuOpen(v => !v)}>
                <User className="w-4 h-4" />
                <span className="text-sm font-semibold">{user?.username}</span>
                <span className="text-xs bg-blue-500/30 px-2 py-1 rounded-full">
                  {user?.role}
                </span>
              </div>
              {menuOpen && (
                <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg py-2 w-44 z-50 border border-gray-200 animate-fade-in">
                  <button
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-blue-50"
                    onClick={() => { setMenuOpen(false); handleViewProfile(); }}
                  >
                    <Eye className="w-4 h-4 mr-2" /> View Profile
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
                    onClick={() => { setMenuOpen(false); handleDeleteProfile(); }}
                    disabled={deleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> {deleting ? 'Deleting...' : 'Delete Profile'}
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 border-t border-gray-200"
                    onClick={() => { setMenuOpen(false); logout(); }}
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {profileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setProfileModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Profile Details</h2>
            {loadingProfile ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : profileData ? (
              <div className="space-y-2">
                <div><span className="font-semibold">Username:</span> {profileData.username}</div>
                <div><span className="font-semibold">Email:</span> {profileData.email}</div>
                <div><span className="font-semibold">Role:</span> {profileData.role}</div>
                <div><span className="font-semibold">Root User:</span> {profileData.isRoot ? 'Yes' : 'No'}</div>
                <div><span className="font-semibold">ID:</span> {profileData.id}</div>
              </div>
            ) : (
              <div className="text-center text-red-500">Failed to load profile.</div>
            )}
          </div>
        </div>
      )}

      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};