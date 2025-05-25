
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user?.id) {
        // Use setTimeout to prevent recursive calls
        setTimeout(() => {
          checkAdminStatus(session.user);
        }, 0);
      } else {
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session:', session?.user?.id);
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            setTimeout(() => {
              checkAdminStatus(session.user);
            }, 0);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (currentUser: User) => {
    try {
      console.log('Checking admin status for user:', currentUser.id, 'Email:', currentUser.email);
      
      // First check if profiles table exists and get user data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();
      
      if (profileError) {
        console.log("Profile error (might not exist):", profileError);
        
        // If profile doesn't exist, create one for admin email
        if (currentUser.email === 'zainabusal113@gmail.com') {
          console.log('Creating admin profile for:', currentUser.email);
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: currentUser.id,
              email: currentUser.email,
              first_name: currentUser.user_metadata?.first_name || currentUser.email?.split('@')[0] || '',
              last_name: currentUser.user_metadata?.last_name || '',
              role: 'admin'
            });
          
          if (insertError) {
            console.error('Error creating admin profile:', insertError);
          } else {
            console.log('Admin profile created successfully');
            setIsAdmin(true);
            return;
          }
        }
        
        setIsAdmin(false);
        return;
      }
      
      const adminStatus = profileData?.role === 'admin';
      console.log('Admin status result:', adminStatus, 'Role:', profileData?.role);
      setIsAdmin(adminStatus);
      
      // If not admin but email is admin email, update role
      if (!adminStatus && currentUser.email === 'zainabusal113@gmail.com') {
        console.log('Updating role to admin for:', currentUser.email);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', currentUser.id);
        
        if (!updateError) {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.error("Error in checkAdminStatus:", error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      return response;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ')
          }
        }
      });
      return response;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
