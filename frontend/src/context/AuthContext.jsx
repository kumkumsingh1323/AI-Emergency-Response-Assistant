import { createContext, useContext, useState, useEffect } from 'react';

// Pre-defined demo accounts
export const DEMO_ACCOUNTS = {
  'citizen.demo@example.test': { role: 'Citizen', name: 'Demo Citizen', region: 'All' },
  'operator.demo@example.test': { role: 'Control-Room Operator', name: 'Demo Operator', region: 'Chennai Metro' },
  'responder.demo@example.test': { role: 'Emergency Responder', name: 'Demo Responder', region: 'Chennai South' },
  'leader.demo@example.test': { role: 'Team Leader', name: 'Demo Leader', region: 'Chennai Metro' },
  'admin.demo@example.test': { role: 'Administrator', name: 'Demo Admin', region: 'All' }
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from local storage on mount to persist session
    const storedUser = localStorage.getItem('demo_auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email) => {
    if (DEMO_ACCOUNTS[email]) {
      const userData = { email, ...DEMO_ACCOUNTS[email] };
      setUser(userData);
      localStorage.setItem('demo_auth_user', JSON.stringify(userData));
      return { success: true, role: userData.role };
    }
    return { success: false, error: 'Invalid demo credentials.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo_auth_user');
  };

  if (loading) return null; // Or a spinner

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
