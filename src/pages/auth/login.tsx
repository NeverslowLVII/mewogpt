import { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Auth, AuthContext } from '@/context/AuthContext';

function useLoginMutation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (credentials: any, options: any = {}) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
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

export default function LoginPage() {
  const [email, setemail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const router = useRouter();
  const mutation = useLoginMutation();
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
    <main className="flex flex-col h-full w-full bg-gray-200 dark:bg-gray-800">
      <div className="flex flex-1 overflow-y-auto">
        <div className="flex-1" />
        <div className="items-center justify-center w-1/2 p-4 m-auto">
          <div className="w-full space-y-4 p-4 rounded-lg bg-gray-500">
            <h1 className="text-2xl font-bold">Login</h1>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input
                disabled={mutation.isLoading}
                type="email"
                id="email"
                name="email"
                className="border border-gray-300 p-2 rounded-lg text-black"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <label htmlFor="password">Password</label>
              <input
                disabled={mutation.isLoading}
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                className="border border-gray-300 p-2 rounded-lg text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {mutation.isError && (
                <div className="bg-red-500 text-white p-4">
                  {mutation.error?.message}
                </div>
              )}
              <button
                disabled={mutation.isLoading}
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
              >
                Login
              </button>
            </form>
            <Link href="/auth/signup">
              <span className="hover:underline">
                You don't have an account?
              </span>
            </Link>
          </div>
        </div>
        <div className="flex-1" />
      </div>
    </main>
  );
}
