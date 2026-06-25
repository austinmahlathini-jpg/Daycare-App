import { createContext, useEffect, useState, useContext } from 'react';
import { supabase } from '../supabaseClient';

/**
 * AuthContext - Central authentication state management for the Daycare App
 * 
 * This context follows clean architecture principles:
 * - Keeps authentication logic separate from UI components
 * - Manages session, user profile, and loading states
 * - Provides reusable auth methods with consistent error handling
 */

const AuthContext = createContext();

/**
 * AuthContextProvider Component
 * 
 * Wraps the entire application (see main.jsx or App.jsx)
 * Handles:
 * - Supabase session management
 * - Automatic parent profile fetching
 * - Authentication methods (signup, signin, signout)
 */
export const AuthContextProvider = ({ children }) => {
  // State management
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null); // Parent details from 'profiles' table
  const [loading, setLoading] = useState(true);

  /**
   * Registers a new parent user
   * Stores full_name in Supabase Auth metadata for easy access
   * 
   * @param {Object} credentials - { email, password, fullName }
   * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
   */
  const signupNewUser = async ({ email, password, fullName }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName } // Saved in auth.users.user_metadata
        }
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Signup error occurred:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Authenticates existing parent with email & password
   * 
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
   */
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Sign in error occurred:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Signs out the current user and clears session state
   * 
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Sign out error occurred:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Fetches detailed parent profile from the 'profiles' table
   * Automatically called after login or session change
   * 
   * @param {string} userId - UUID from auth.users.id
   */
  const fetchUserProfile = async (userId) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setUserProfile(data);
    }
  };

  // Initialize authentication state and listen for real-time changes
  useEffect(() => {
    // Load initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Subscribe to auth changes (login, logout, refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUserProfile(null); // Reset profile when auth state changes

        if (session?.user) {
          fetchUserProfile(session.user.id);
        }

        setLoading(false);
      }
    );

    // Cleanup subscription to prevent memory leaks
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Context value object - everything components can access via useAuth()
  const value = {
    session,
    user: session?.user ?? null,
    userProfile,
    loading,
    signupNewUser,
    signInUser,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to consume AuthContext safely
 * Throws clear error if used outside of Provider (helps catch bugs early)
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthContextProvider'
    );
  }

  return context;
};