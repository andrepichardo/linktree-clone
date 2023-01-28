import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import supabase from 'utils/supabaseClient';
import Logo from '../../public/Logo.png';

const SignUp = () => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();

  async function signUpWithEmail() {
    try {
      if (email && password) {
        const resp = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        if (resp.error) throw resp.error;
        const userId = resp.data.user?.id;
        console.log(userId);
      }
    } catch {}
  }
  return (
    <>
      <Head>
        <title>Sign Up | LinkSpaceApp</title>
        <meta name="description" content="A Linktree inspired app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen bg-gradient-to-b from-sky-400 to-sky-700">
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <Image className="w-20 mx-auto" src={Logo} alt="" />
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Create an account
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

              <div className="flex flex-col gap-3">
                <button
                  onClick={signUpWithEmail}
                  type="button"
                  className="flex w-full justify-center rounded-md border border-transparent bg-[#043569] py-2 px-4 text-sm font-medium text-white hover:bg-[#043569]/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Sign up
                </button>
                <Link
                  className="flex items-center text-blue-900 hover:text-blue-800 mt-5 text-sm hover:underline underline-offset-4 w-fit"
                  href="/login"
                >
                  <FiChevronLeft />
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
