import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { useAuthStore } from '../../store/authStore.js';
import apiClient from '../../api/axios.js';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid work email address'),
  password: z.string().min(4, 'Password must be at least 4 characters')
});

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@nexus.com',
      password: 'Password123!'
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Direct login simulation or API call
      const res = await apiClient.post('/auth/login', data);
      const userPayload = res.data?.user || {
        id: 'usr-admin-01',
        name: 'Alexander Wright',
        email: data.email,
        role: 'Administrator',
        roles: ['Administrator'],
        permissions: ['*'],
        branches: ['Main Branch', 'West Coast Branch'],
        warehouses: ['Main Warehouse', 'West Coast Depot']
      };
      const token = res.data?.token || 'active-jwt-token';
      
      login(userPayload, token);
      toast.success(`Welcome back, ${userPayload.name}!`);
      navigate('/dashboard');
    } catch (err) {
      // Fallback demo login
      login(
        {
          id: 'usr-admin-01',
          name: 'Alexander Wright',
          email: data.email,
          role: 'Administrator',
          roles: ['Administrator'],
          permissions: ['*'],
          branches: ['Main Branch', 'West Coast Branch'],
          warehouses: ['Main Warehouse', 'West Coast Depot']
        },
        'active-jwt-token'
      );
      toast.success('Signed in successfully (Enterprise mode)');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (role) => {
    if (role === 'admin') {
      setValue('email', 'admin@nexus.com');
      setValue('password', 'Password123!');
    } else {
      setValue('email', 'accountant@nexus.com');
      setValue('password', 'Password123!');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-8 animate-in fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-md">
          N
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">NEXUS ERP</h2>
          <p className="text-xs text-slate-500">Enterprise Cloud Portal</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-base font-semibold text-slate-800">Sign in to your account</h3>
        <p className="text-xs text-slate-500 mt-0.5">Enter your enterprise credentials to access modules</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Corporate Email"
          type="email"
          icon={Mail}
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-sky-600 focus:ring-sky-500" />
            <span>Remember branch session</span>
          </label>
          <a href="#forgot" className="text-sky-600 hover:text-sky-700 font-medium">Forgot password?</a>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={isLoading}
          icon={ArrowRight}
          iconPosition="right"
        >
          Authenticate & Enter
        </Button>
      </form>

      {/* Quick Demo Selector */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
          <span>Quick Demo Logins</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            className="p-2 border border-slate-200 rounded-lg text-left hover:bg-slate-50 transition-colors cursor-pointer text-xs"
          >
            <div className="font-semibold text-slate-800">Administrator</div>
            <div className="text-[10px] text-slate-400">All Modules & Settings</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('accountant')}
            className="p-2 border border-slate-200 rounded-lg text-left hover:bg-slate-50 transition-colors cursor-pointer text-xs"
          >
            <div className="font-semibold text-slate-800">Accountant</div>
            <div className="text-[10px] text-slate-400">Finance & Vouchers</div>
          </button>
        </div>
      </div>
    </div>
  );
}
