
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminChatbot from "./AdminChatbot";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin } = useAuth();

  useEffect(() => {
    // Add admin-user class to body when user is admin
    if (isAdmin) {
      document.body.classList.add('admin-user');
    } else {
      document.body.classList.remove('admin-user');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('admin-user');
    };
  }, [isAdmin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6 overflow-auto">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
      <AdminChatbot />
    </div>
  );
};

export default AdminLayout;
