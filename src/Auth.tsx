import { useState } from 'react';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';
import './Auth.css';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('✅ 注册成功！请检查邮箱确认链接。');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage('✅ 登录成功！');
      }
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🎄 圣诞树登录</h2>
        <p className="auth-subtitle">
          {isSignUp ? '创建账号以保存您的照片' : '登录查看您的圣诞树'}
        </p>

        <form onSubmit={handleAuth}>
          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {message && (
            <div className={`auth-message ${message.includes('❌') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? '处理中...' : isSignUp ? '注册' : '登录'}
          </button>
        </form>

        <div className="auth-toggle">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage('');
            }}
            className="toggle-button"
          >
            {isSignUp ? '已有账号？点击登录' : '没有账号？点击注册'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface UserInfoProps {
  user: User;
}

export function UserInfo({ user }: UserInfoProps) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="user-info">
      <span className="user-email">{user.email}</span>
      <button onClick={handleSignOut} className="signout-button">
        退出
      </button>
    </div>
  );
}
