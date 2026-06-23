import { createContext, useEffect, useState, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null); 
  const [loading, setLoading] = useState(true); 

  const signupNewUser = async ({email, password}) => { 
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('Sign up error occurred:', error);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      console.error('An error occurred:', error);
      return { success: false, error: error.message };
    }
  };

  const signInuser = async (email, password) => { 
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) { 
        console.error('Sign in error occurred:', error);
        return { success: false, error: error.message }; 
      }
      console.log('Sign-in success: ', data);
      return { success: true, data }; 
    } catch (error) {
      console.error('An error occurred:', error); 
      return { success: false, error: error.message };
    }
  };

  const signout = async () => { 
    try {
      const { error } = await supabase.auth.signOut(); 
      if (error) {
        console.error('There was an error signing out: ', error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('An error occurred during sign out:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return ( 
    <AuthContext.Provider value={{ session, loading, signupNewUser, signInuser, signout }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};