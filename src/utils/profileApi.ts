export async function getProfile() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  const res = await fetch('http://localhost:5001/api/users/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function deleteProfile() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  const res = await fetch('http://localhost:5001/api/users/me', {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete profile');
  return res.json();
} 