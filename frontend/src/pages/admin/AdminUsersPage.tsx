import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowLeft, Trash2, Shield, User } from 'lucide-react';
import { apiRequest } from '../../api/client';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/api/admin/users');
      setUsers(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user ${name}?`)) return;
    try {
      await apiRequest(`/api/admin/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch {
      alert('Could not delete user.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Overview</span>
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            Manage Registered Users
          </h1>
          <p className="text-xs text-slate-500">
            Total {users.length} registered accounts across Maharashtra and India.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4">User</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Location</th>
                <th className="p-4">Business</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.profile_photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover border"
                      />
                      <span>{u.full_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div>{u.email}</div>
                    <div className="text-xs text-slate-400">{u.phone}</div>
                  </td>
                  <td className="p-4 text-slate-600">
                    {u.village}, {u.district}
                  </td>
                  <td className="p-4 text-slate-800 font-medium">
                    {u.business_type}
                  </td>
                  <td className="p-4">
                    <Badge variant={u.role === 'admin' ? 'verified' : 'brand'}>{u.role}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleDelete(u.id, u.full_name)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
