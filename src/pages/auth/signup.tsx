import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    displayName: z.string().min(2, 'Display name must be at least 2 characters'),
    language: z.string().default('en'),
    ageConfirm: z.boolean().refine((val) => val === true, 'You must be 18+ to sign up'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      language: 'en',
      ageConfirm: false,
    },
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      await signup(data.email, data.password, data.displayName, data.language);
      const returnUrl = (router.query.returnUrl as string) || '/';
      router.push(returnUrl);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-display font-bold text-text mb-2">Create Account</h1>
          <p className="text-textSecondary mb-8">Join our community</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Display Name"
              type="text"
              placeholder="Your display name"
              {...register('displayName')}
              error={errors.displayName?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
            <div>
              <label className="flex items-center gap-2 text-sm text-textSecondary">
                <select
                  {...register('language')}
                  className="px-3 py-2 bg-card border border-bgSecondary rounded-lg text-text"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
                Language Preference
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-textSecondary">
                <input
                  type="checkbox"
                  {...register('ageConfirm')}
                  className="rounded"
                />
                I confirm that I am 18 years or older
              </label>
              {errors.ageConfirm && (
                <p className="mt-1 text-sm text-danger">{errors.ageConfirm.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-textSecondary text-sm">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-textSecondary">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-bgSecondary" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-bg text-textSecondary">Or continue with</span>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="ghost" className="w-full" type="button">
                Google
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

