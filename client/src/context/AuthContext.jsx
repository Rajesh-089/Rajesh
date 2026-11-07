import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient.js';
import { api } from '../services/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state from Supabase
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured || !supabase) {
        // Fallback for development without configured Supabase credentials
        const storedMockUser = localStorage.getItem('agriguide_mock_user');
        if (storedMockUser) {
          try {
            const parsed = JSON.parse(storedMockUser);
            setUser(parsed);
            setProfile(parsed.profile || null);
          } catch (e) {
            // ignore
          }
        }
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          setUser(session.user);
          // Fetch backend profile
          try {
            const res = await api.getProfile();
            if (res.data) setProfile(res.data);
          } catch (e) {
            console.warn('Profile fetch warning:', e.message);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) setLoading(false);
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          setUser(session.user);
          try {
            const res = await api.getProfile();
            if (res.data) setProfile(res.data);
          } catch (e) {
            // ignore
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      // Local dev simulation
      const mockUser = {
        id: 'mock-user-123',
        email,
        user_metadata: { full_name: 'Demo Farmer' },
        profile: {
          id: 'mock-user-123',
          full_name: 'Demo Farmer',
          preferred_language: 'en',
          state: 'Karnataka',
          district: 'Dharwad',
          farming_experience: 8
        }
      };
      localStorage.setItem('agriguide_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setProfile(mockUser.profile);
      return { user: mockUser };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);
    try {
      const res = await api.getProfile();
      if (res.data) setProfile(res.data);
    } catch (e) {}
    return data;
  };

  const register = async ({ fullName, email, password, state, district, preferredLanguage }) => {
    if (!isSupabaseConfigured || !supabase) {
      const mockUser = {
        id: `user-${Date.now()}`,
        email,
        user_metadata: { full_name: fullName, preferred_language: preferredLanguage },
        profile: {
          id: `user-${Date.now()}`,
          full_name: fullName,
          state: state || 'Karnataka',
          district: district || 'Dharwad',
          preferred_language: preferredLanguage || 'en'
        }
      };
      localStorage.setItem('agriguide_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setProfile(mockUser.profile);
      return { user: mockUser };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          state,
          district,
          preferred_language: preferredLanguage || 'en'
        }
      }
    });

    if (error) throw error;
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('agriguide_mock_user');
    setUser(null);
    setProfile(null);
  };

  const reloadProfile = async () => {
    try {
      const res = await api.getProfile();
      if (res.data) setProfile(res.data);
    } catch (e) {
      console.warn('Failed to reload profile:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        reloadProfile,
        isConfigured: isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
