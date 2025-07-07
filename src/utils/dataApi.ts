// CLIENTS
export async function getClients() {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5001/api/clients', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch clients');
  return res.json();
}

export async function addClient(client) {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5001/api/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(client)
  });
  if (!res.ok) throw new Error('Failed to add client');
  return res.json();
}

export async function updateClient(id, client) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5001/api/clients/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(client)
  });
  if (!res.ok) throw new Error('Failed to update client');
  return res.json();
}

export async function deleteClient(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5001/api/clients/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete client');
  return res.json();
}

// INVENTORY
export async function getInventory() {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5001/api/inventory', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch inventory');
  return res.json();
}

export async function addInventoryItem(item) {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5001/api/inventory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to add inventory item');
  return res.json();
}

export async function updateInventoryItem(id, item) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5001/api/inventory/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to update inventory item');
  return res.json();
}

export async function deleteInventoryItem(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5001/api/inventory/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete inventory item');
  return res.json();
}

// CHALANS
export async function getChalans() {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5001/api/chalans', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch chalans');
  return res.json();
}

export async function addChalan(chalan) {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5001/api/chalans', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(chalan)
  });
  if (!res.ok) throw new Error('Failed to add chalan');
  return res.json();
}

export async function updateChalan(id, chalan) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5001/api/chalans/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(chalan)
  });
  if (!res.ok) throw new Error('Failed to update chalan');
  return res.json();
}

export async function deleteChalan(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5001/api/chalans/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete chalan');
  return res.json();
} 