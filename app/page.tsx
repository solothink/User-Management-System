"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Toaster, toast } from "sonner";
import { UserTable } from "./components/UserTable";
import { UserModal } from "./components/UserModal";
import { type User } from "./types";

const ITEMS_PER_PAGE = 5;

export default function Home() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "George Bluth", email: "george.bluth@reqres.in", role: "User" },
    { id: 2, name: "Janet Weaver", email: "janet.weaver@reqres.in", role: "Editor" },
    { id: 3, name: "Emma Wong", email: "emma.wong@reqres.in", role: "Admin" },
    { id: 4, name: "Eve Holt", email: "eve.holt@reqres.in", role: "Editor" },
    { id: 5, name: "Charles Morris", email: "charles.morris@reqres.in", role: "User" },
    { id: 6, name: "Tracey Ramos", email: "tracey.ramos@reqres.in", role: "User" },
    { id: 7, name: "Michael Smith", email: "michael.smith@reqres.in", role: "Editor" },
    { id: 8, name: "Lindsay Ferguson", email: "lindsay.ferguson@reqres.in", role: "Admin" },
    { id: 9, name: "Tobias Funke", email: "tobias.funke@reqres.in", role: "User" },
    { id: 10, name: "Byron Fields", email: "byron.fields@reqres.in", role: "Editor" }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddUser = (data: any) => {
    const newUser = {
      id: users.length + 1,
      ...data
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    toast.success("User added successfully");
  };

  const handleEditUser = (data: any) => {
    if (!editingUser) return;
    
    const updatedUsers = users.map(user => 
      user.id === editingUser.id ? { ...user, ...data } : user
    );
    setUsers(updatedUsers);
    setEditingUser(null);
    toast.success("User updated successfully");
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success("User deleted successfully");
  };

  const handlePreviousPage = () => {
    setCurrentPage(page => Math.max(1, page - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(page => Math.min(totalPages, page + 1));
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">User Management System</h1>
        
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Add User
          </button>
        </div>

        <UserTable
          users={paginatedUsers}
          onEdit={setEditingUser}
          onDelete={handleDeleteUser}
        />

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        {(showAddModal || editingUser) && (
          <UserModal
            user={editingUser || undefined}
            onSubmit={editingUser ? handleEditUser : handleAddUser}
            onClose={() => {
              setShowAddModal(false);
              setEditingUser(null);
            }}
          />
        )}

        <Toaster position="top-right" />
      </div>
    </main>
  );
}