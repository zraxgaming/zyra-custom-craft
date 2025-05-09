
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>("zainabusal113@gmail.com");
  const { toast } = useToast();

  useEffect(() => {
    // Fetch admin email from site_config
    const fetchAdminEmail = async () => {
      try {
        const { data, error } = await supabase
          .from("site_config")
          .select("value")
          .eq("key", "admin_email")
          .single();
        
        if (!error && data) {
          setAdminEmail(data.value);
        }
      } catch (error) {
        console.error("Error fetching admin email:", error);
      }
    };

    fetchAdminEmail();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      
      // Check if user is authenticated via localStorage
      const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';
      
      if (isAuthenticated) {
        const userId = localStorage.getItem('user_id');
        const userEmail = localStorage.getItem('user_email');
        const userName = localStorage.getItem('user_name');
        
        if (userId && userEmail) {
          const user = {
            id: userId,
            email: userEmail,
            name: userName || undefined
          };
          
          setUser(user);
          
          // Check if the user is an admin
          setIsAdmin(userEmail === adminEmail);
        } else {
          // Clear invalid authentication state
          localStorage.removeItem('user_authenticated');
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    };
    
    initialize();
    
    // Listen for storage changes in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_authenticated' || e.key === 'user_id' || e.key === 'user_email') {
        initialize();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [adminEmail]);
  
  // Note: These functions would need to be implemented separately
  // using your auth provider of choice. For now, they're placeholders.
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    
    if (error) {
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      // For custom Google auth
      localStorage.removeItem('user_authenticated');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_picture');
      
      // Also sign out from Supabase if using that
      await supabase.auth.signOut();
      
      setUser(null);
      setIsAdmin(false);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const value = {
    user,
    isAdmin,
    isLoading,
    signIn,
    signUp,
    signOut,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
