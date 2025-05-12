
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
      console.log("Admin email configured:", configuredAdminEmail);
    } else {
      console.warn("Admin email not set in environment variables");
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      
      try {
        // Check if user is authenticated via Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          const userEmail = session.user.email || '';
          const userName = session.user.user_metadata?.name || '';
          
          setUser({
            id: session.user.id,
            email: userEmail,
            name: userName
          });
          
          // Check if user email matches admin email
          const isUserAdmin = userEmail === adminEmail;
          console.log("Checking admin status:", userEmail, adminEmail, isUserAdmin);
          setIsAdmin(isUserAdmin);
          
          // Store in localStorage for persistence
          localStorage.setItem('user_authenticated', 'true');
          localStorage.setItem('user_id', session.user.id);
          localStorage.setItem('user_email', userEmail);
          localStorage.setItem('user_name', userName);
        } else {
          // No active session
          localStorage.removeItem('user_authenticated');
          localStorage.removeItem('user_id');
          localStorage.removeItem('user_email');
          localStorage.removeItem('user_name');
          
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
    
    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const userEmail = session.user.email || '';
        const userName = session.user.user_metadata?.name || '';
        
        setUser({
          id: session.user.id,
          email: userEmail,
          name: userName
        });
        
        // Check if user is admin
        const isUserAdmin = userEmail === adminEmail;
        console.log("Auth state changed - checking admin:", userEmail, adminEmail, isUserAdmin);
        setIsAdmin(isUserAdmin);
        
        // Store in localStorage
        localStorage.setItem('user_authenticated', 'true');
        localStorage.setItem('user_id', session.user.id);
        localStorage.setItem('user_email', userEmail);
        localStorage.setItem('user_name', userName);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('user_authenticated');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        
        setUser(null);
        setIsAdmin(false);
      }
    });
    
    return () => {
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
      await supabase.auth.signOut();
      
      localStorage.removeItem('user_authenticated');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
      
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
