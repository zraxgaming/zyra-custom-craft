
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
  const [adminEmail, setAdminEmail] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Get admin email from environment variables
    const configuredAdminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    if (configuredAdminEmail) {
      setAdminEmail(configuredAdminEmail);
    } else {
      console.warn("Admin email not set in environment variables");
    }
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
        // Try to get the session from Supabase as backup method
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && session.user) {
            const userEmail = session.user.email || '';
            
            // Store in localStorage for our custom auth
            localStorage.setItem('user_authenticated', 'true');
            localStorage.setItem('user_id', session.user.id);
            localStorage.setItem('user_email', userEmail);
            localStorage.setItem('user_name', session.user.user_metadata.name || '');
            
            setUser({
              id: session.user.id,
              email: userEmail, 
              name: session.user.user_metadata.name
            });
            
            setIsAdmin(userEmail === adminEmail);
          } else {
            setUser(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error getting Supabase session:", error);
          setUser(null);
          setIsAdmin(false);
        }
      }
      
      setIsLoading(false);
    };
    
    initialize();
    
    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const userEmail = session.user.email || '';
        
        // Store in localStorage for our custom auth
        localStorage.setItem('user_authenticated', 'true');
        localStorage.setItem('user_id', session.user.id);
        localStorage.setItem('user_email', userEmail);
        if (session.user.user_metadata && session.user.user_metadata.name) {
          localStorage.setItem('user_name', session.user.user_metadata.name);
        }
        
        setUser({
          id: session.user.id,
          email: userEmail,
          name: session.user.user_metadata?.name
        });
        
        setIsAdmin(userEmail === adminEmail);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('user_authenticated');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_picture');
        
        setUser(null);
        setIsAdmin(false);
      }
    });
    
    // Listen for storage changes in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_authenticated' || e.key === 'user_id' || e.key === 'user_email') {
        initialize();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      authListener.subscription.unsubscribe();
    };
  }, [adminEmail]);
  
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // Success is handled by the auth state listener
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
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
      
      // Success is handled by the auth state listener
    } catch (error: any) {
      console.error("Sign up error:", error);
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
      
      // Also sign out from Supabase
      await supabase.auth.signOut();
      
      setUser(null);
      setIsAdmin(false);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
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
