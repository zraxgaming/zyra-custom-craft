
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  ShoppingCart, 
  Gift, 
  Mail, 
  BarChart3,
  LogOut,
  ArrowLeft,
  Scan
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin panel.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Gift, label: 'Gift Cards', path: '/admin/gift-cards' },
    { icon: Mail, label: 'Newsletter', path: '/admin/newsletter' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Scan, label: 'Scanner', path: '/admin/scanner' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      {/* Top Navigation */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <Container>
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </Container>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
