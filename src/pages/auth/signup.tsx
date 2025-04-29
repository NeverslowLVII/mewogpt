import { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Auth, AuthContext } from '@/context/AuthContext';
import Image from 'next/image';

function useSignupMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (credentials: any, options: any = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();

      if (options.onSuccess) {
        options.onSuccess(data);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, isError: !!error, error };
}

export default function SignupPage() {
  const [email, setemail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const router = useRouter();
  const mutation = useSignupMutation();
  const { setAuth } = useContext(AuthContext);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) return;
    if (mutation.isLoading) return;

    mutation.mutate(
      { email, password },
      {
        onSuccess: (data: Auth) => {
          setAuth(data);
          router.push('/');
        },
      }
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#343541] text-white">
      <div className="flex flex-col items-center mb-8">
        <Image
          src="/chatratp.png"
          alt="Logo"
          width={180}
          height={50}
          className="mb-6"
        />
        <h1 className="text-3xl font-semibold">Créez votre compte</h1>
      </div>

      <div className="w-full max-w-md px-6 py-8 rounded-lg border border-gray-700 bg-[#202123] shadow-lg">
        <h2 className="text-xl font-medium mb-6">S&apos;inscrire</h2>
        <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm">
              Adresse e-mail
            </label>
            <input
              disabled={mutation.isLoading}
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="email@exemple.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm">
              Mot de passe
            </label>
            <input
              disabled={mutation.isLoading}
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-1 focus:ring-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {mutation.isError && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-md text-sm">
              {mutation.error?.message}
            </div>
          )}

          <button
            disabled={mutation.isLoading}
            type="submit"
            className="w-full py-2 px-4 bg-[#10a37f] hover:bg-[#0d8c6d] text-white font-medium rounded-md transition duration-200 disabled:opacity-50"
          >
            {mutation.isLoading ? 'Création du compte...' : 'Continuer'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Vous avez déjà un compte?{' '}
          <Link href="/auth/login" className="text-[#10a37f] hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </main>
  );
}
