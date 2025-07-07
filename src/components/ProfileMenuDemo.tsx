import React, { useState } from 'react';
import { getProfile, deleteProfile } from '../utils/profileApi';

const ProfileMenuDemo: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleViewProfile = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This cannot be undone.')) return;
    setError(null);
    setLoading(true);
    try {
      await deleteProfile();
      localStorage.clear();
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto mt-10">
      <h2 className="text-lg font-bold mb-4">Profile Menu Demo</h2>
      <button onClick={handleViewProfile} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">View Profile</button>
      <button onClick={handleDeleteProfile} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Delete Profile</button>
      <button onClick={handleLogout} className="bg-gray-500 text-white px-4 py-2 rounded">Logout</button>
      {loading && <div className="mt-2 text-blue-600">Loading...</div>}
      {error && <div className="mt-2 text-red-600">{error}</div>}
      {profile && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          <div><b>ID:</b> {profile.id}</div>
          <div><b>Username:</b> {profile.username}</div>
          <div><b>Email:</b> {profile.email}</div>
          <div><b>Role:</b> {profile.role}</div>
          <div><b>Root:</b> {profile.isRoot ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenuDemo; 