"use client";
import React, { useState } from 'react';
import RoleGuard from '@/components/guards/RoleGuard';

type MemberStatus = 'active' | 'inactive';
type MemberRole = 'Company Administrator' | 'Independent Recruiter';

type Member = {
  id: string;
  name: string;
  email: string;
  company: string;
  accountType: MemberRole;
  status: MemberStatus;
  joinDate: string;
};

const AccountManagement = () => {
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'Dr Mike Oparaji',
      email: 'mike@veritalent.com',
      company: 'VeriTalent',
      accountType: 'Company Administrator',
      status: 'active',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@techcorp.com',
      company: 'TechCorp',
      accountType: 'Independent Recruiter',
      status: 'active',
      joinDate: '2024-02-20'
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael@healthcare.com',
      company: 'HealthCare Plus',
      accountType: 'Company Administrator',
      status: 'inactive',
      joinDate: '2024-01-10'
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [form, setForm] = useState<Partial<Member>>({
    name: '',
    email: '',
    company: '',
    accountType: 'Independent Recruiter',
    status: 'active'
  });

  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === 'active').length,
    inactive: members.filter((m) => m.status === 'inactive').length,
    administrators: members.filter((m) => m.accountType === 'Company Administrator').length
  };

  const openAdd = () => {
    setModalMode('add');
    setForm({ name: '', email: '', company: '', accountType: 'Independent Recruiter', status: 'active' });
    setSelectedMember(null);
    setModalOpen(true);
  };

  const openEdit = (member: Member) => {
    setModalMode('edit');
    setSelectedMember(member);
    setForm(member);
    setModalOpen(true);
  };

  const openDelete = (member: Member) => {
    setModalMode('delete');
    setSelectedMember(member);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMember(null);
  };

  const handleSubmit = () => {
    if (modalMode === 'delete' && selectedMember) {
      setMembers((prev) => prev.filter((m) => m.id !== selectedMember.id));
      closeModal();
      return;
    }

    if (!form.name || !form.email || !form.company || !form.accountType || !form.status) return;

    if (modalMode === 'add') {
      const newMember: Member = {
        id: Date.now().toString(),
        name: form.name,
        email: form.email,
        company: form.company,
        accountType: form.accountType as MemberRole,
        status: form.status as MemberStatus,
        joinDate: new Date().toISOString().slice(0, 10),
      };
      setMembers((prev) => [newMember, ...prev]);
    }

    if (modalMode === 'edit' && selectedMember) {
      setMembers((prev) => prev.map((m) => (m.id === selectedMember.id ? { ...m, ...form, accountType: form.accountType as MemberRole, status: form.status as MemberStatus } : m)));
    }

    closeModal();
  };

  return (
    <RoleGuard allowedRoles={['org_admin']}>
      <div className="flex h-screen bg-gray-50">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Account Management</h2>
              <p className="text-sm sm:text-base text-gray-600">Manage employers and their accounts</p>
            </div>
            <button
              onClick={openAdd}
              className="w-full sm:w-auto bg-brand-primary hover:bg-cyan-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base"
            >
              Add New Account
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg border border-gray-200">
              <div className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Total Employers</div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.total}</div>
            </div>
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg border border-gray-200">
              <div className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Active</div>
              <div className="text-2xl sm:text-3xl font-bold text-brand-primary">{stats.active}</div>
            </div>
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg border border-gray-200">
              <div className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Inactive</div>
              <div className="text-2xl sm:text-3xl font-bold text-red-600">{stats.inactive}</div>
            </div>
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg border border-gray-200">
              <div className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Administrators</div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.administrators}</div>
            </div>
          </div>

          {/* Employers Section */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Employers</h3>
            </div>

            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-800">{member.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {member.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {member.accountType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            member.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {member.joinDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openEdit(member)}
                          className="text-teal-600 hover:text-teal-700 font-medium mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDelete(member)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View - Visible only on mobile */}
            <div className="md:hidden divide-y divide-gray-200">
              {members.map((member) => (
                <div key={member.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-base mb-1 truncate">
                        {member.name}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">{member.email}</p>
                    </div>
                    <span
                      className={`ml-2 px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Company:</span>
                      <span className="text-gray-900 font-medium">{member.company}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Account Type:</span>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {member.accountType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Join Date:</span>
                      <span className="text-gray-900">{member.joinDate}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => openEdit(member)}
                      className="flex-1 text-teal-600 hover:bg-teal-50 font-medium py-2 rounded-lg text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDelete(member)}
                      className="flex-1 text-red-600 hover:bg-red-50 font-medium py-2 rounded-lg text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  {modalMode === 'add' && 'Add Account'}
                  {modalMode === 'edit' && 'Edit Account'}
                  {modalMode === 'delete' && 'Delete Account'}
                </h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">X</button>
              </div>

              {modalMode === 'delete' ? (
                <div className="px-6 py-6">
                  <p className="text-gray-700 mb-6">Are you sure you want to remove {selectedMember?.name}? This action cannot be undone.</p>
                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <button onClick={closeModal} className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSubmit} className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Delete</button>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      value={form.name || ''}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      value={form.email || ''}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      placeholder="name@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      value={form.company || ''}
                      onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      placeholder="Company name"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                      <select
                        value={form.accountType || 'Independent Recruiter'}
                        onChange={(e) => setForm((prev) => ({ ...prev, accountType: e.target.value as MemberRole }))}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      >
                        <option value="Company Administrator">Company Administrator</option>
                        <option value="Independent Recruiter">Independent Recruiter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={form.status || 'active'}
                        onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as MemberStatus }))}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                    <button onClick={closeModal} className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button
                      onClick={handleSubmit}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-brand-primary text-white hover:bg-cyan-700"
                    >
                      {modalMode === 'add' ? 'Add Account' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
    </RoleGuard>
  );
};

export default AccountManagement;