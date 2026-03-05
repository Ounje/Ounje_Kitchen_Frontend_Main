"use client";

import { useState, useEffect } from 'react';
import { usersService } from '@/lib/api/services/users.service';

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'customers' | 'vendors' | 'riders'>('customers');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [activeTab]);

  const loadUsers = async () => {
    try {
      let data;
      if (activeTab === 'customers') {
        data = await usersService.getCustomers({ page: 1, limit: 20 });
      } else if (activeTab === 'vendors') {
        data = await usersService.getVendors({ page: 1, limit: 20 });
      } else {
        data = await usersService.getRiders({ page: 1, limit: 20 });
      }
      setUsers(data.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      if (activeTab === 'customers') {
        await usersService.suspendCustomer(id);
      }
      // Reload data
      loadUsers();
    } catch (error) {
      console.error('Failed to suspend user:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">User & Staff</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button 
          onClick={() => setActiveTab('customers')}
          className={activeTab === 'customers' ? 'border-b-2 border-primary font-semibold' : ''}
        >
          Customers
        </button>
        <button 
          onClick={() => setActiveTab('vendors')}
          className={activeTab === 'vendors' ? 'border-b-2 border-primary font-semibold' : ''}
        >
          Vendors
        </button>
        <button 
          onClick={() => setActiveTab('riders')}
          className={activeTab === 'riders' ? 'border-b-2 border-primary font-semibold' : ''}
        >
          Riders
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user: any) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isActive ? (
                    <button 
                      onClick={() => handleSuspend(user.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleActivate(user.id)}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}