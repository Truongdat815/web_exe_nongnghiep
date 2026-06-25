import { createContext, useContext, useState } from 'react';
import { mockAccounts } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = chưa đăng nhập

  // Đăng nhập bằng email + password (demo)
  const login = (email, password) => {
    const account = mockAccounts.find(
      a => a.email === email && a.password === password
    );
    if (account) {
      const { password: _, ...safeUser } = account;
      setUser(safeUser);
      return { success: true, user: safeUser };
    }
    return { success: false, error: 'Email hoặc mật khẩu không đúng' };
  };

  // Đăng nhập nhanh theo role (demo button)
  const loginAsRole = (role) => {
    const account = mockAccounts.find(a => a.role === role);
    if (account) {
      const { password: _, ...safeUser } = account;
      setUser(safeUser);
    }
  };

  // Đăng ký tài khoản mới (demo - chỉ lưu vào state)
  const register = (formData) => {
    // Kiểm tra email trùng
    const exists = mockAccounts.find(a => a.email === formData.email);
    if (exists) {
      return { success: false, error: 'Email này đã được đăng ký' };
    }
    const newUser = {
      id: `u_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone || '',
      location: formData.province || '',
      company: formData.company || undefined,
      farmArea: formData.farmArea || undefined,
      cropTypes: formData.cropTypes || undefined,
      trustScore: 50,
      walletBalance: 0,
      avatar: null,
    };
    // Thêm vào danh sách mock (chỉ trong session này)
    mockAccounts.push({ ...newUser, password: formData.password });
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAsRole, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
