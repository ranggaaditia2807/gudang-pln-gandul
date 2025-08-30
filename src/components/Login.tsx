import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from '@/contexts/UserContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useUser();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(email, password)) {
      // Login successful
      setEmail('');
      setPassword('');
      setTimeout(() => {
        navigate('/'); // Redirect to home page after login
      }, 100);
    } else {
      setError('Email atau password salah. Gunakan "owner@gudang.com" atau "user@gudang.com" dengan password "password123"');
    }
  };

  const handleQuickLogin = (testEmail: string) => {
    setEmail(testEmail);
    setPassword('password123');
    if (login(testEmail, 'password123')) {
      setError('');
      setTimeout(() => {
        navigate('/'); // Redirect after quick login
      }, 100);
    }
  };

  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sudah Login</CardTitle>
          <CardDescription>
            Anda sudah login sebagai {user.name} ({user.role})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/')} className="w-full">
            Ke Halaman Utama
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login Sistem Gudang</CardTitle>
        <CardDescription>
          Masuk untuk mengakses sistem manajemen gudang
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-destructive text-sm">{error}</div>
          )}

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t">
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickLogin('owner@gudang.com')}
            >
              Login sebagai Pemilik (Owner)
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickLogin('user@gudang.com')}
            >
              Login sebagai Staff (User)
            </Button>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>Password untuk semua akun: password123</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Login;

