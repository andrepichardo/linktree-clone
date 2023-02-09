import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { FiLock } from 'react-icons/fi';
import supabase from 'utils/supabaseClient';
import Logo from '../../public/Logo.png';

const Login = () => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [signinButton, setSigninButton] = useState<any>('Sign in');
  const router = useRouter();

  async function signInWithEmail() {
    try {
      setSigninButton(
        <div className="flex items-center gap-1">
          Signing In <FaSpinner className="animate-spin" />
        </div>
      );
      if (email && password) {
        const resp = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (resp.error) throw resp.error;
        const userId = resp.data.user?.id;
        console.log(userId);

        const { data, error } = await supabase
          .from('users')
          .select('username')
          .eq('id', userId)
          .single();
        if (error) throw error;
        const username = data.username;
        router.push(`/${username}`);
      }
    } catch (error) {
      console.log(error);
    }
    setSigninButton('Sign In');
  }

  return (
    <>
      <Head>
        <title>Login | LinkSpaceApp</title>
        <meta name="description" content="A Linktree inspired app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen bg-gradient-to-b from-sky-500 to-sky-800">
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <div className="flex w-full justify-center items-end text-4xl italic text-sky-900 font-mono font-bold">
                <h1>Link</h1>
                <Image className="w-16 pl-1 translate-y-3" src={Logo} alt="" />
                <h1>pace</h1>
              </div>
              <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-white">
                Sign in to your account
              </h2>
            </div>
            <form className="mt-8 space-y-6" action="#" method="POST">
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="#"
                    className="font-medium text-[#043569] hover:text-[#043569]/70"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={signInWithEmail}
                  type="button"
                  className="group relative flex w-full justify-center rounded-md border border-transparent shadow-lg hover:opacity-90 bg-gradient-to-br from-emerald-500 to-emerald-600 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiLock
                      className="h-5 w-5 text-sky-600 group-hover:text-sky-700"
                      aria-hidden="true"
                    />
                  </span>
                  {signinButton}
                </button>
                <div className="flex gap-2 items-center text-[#043569]">
                  <span className="h-[1.2px] w-full bg-[#043569]"></span>
                  <p>or</p>
                  <span className="h-[1.2px] w-full bg-[#043569]"></span>
                </div>
                <Link
                  href="/signup"
                  type="submit"
                  className="text-sky-900 flex w-full justify-center rounded-md border border-transparent bg-[#e1e7eb] py-2 px-4 text-sm font-medium hover:bg-[#e1e7eb]/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
        <span className=" text-white w-full flex justify-center text-sm absolute bottom-5 mt-8 font-semibold font-mono">
          © André Pichardo 2023
        </span>
      </div>
    </>
  );
};

export default Login;
