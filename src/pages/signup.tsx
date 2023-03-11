import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { FiChevronLeft } from 'react-icons/fi';
import supabase from 'utils/supabaseClient';
import Logo from '../../public/Logo.png';

const SignUp = () => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [username, setUsername] = useState<string | undefined>();
  const [signupButton, setSignupButton] = useState<any>('Sign Up');

  async function signUpWithEmail() {
    try {
      setSignupButton(
        <div className="flex items-center gap-1">
          Signing Up <FaSpinner className="animate-spin" />
        </div>
      );
      if (email && password && username) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('id, username')
            .eq('username', username);
          if (error) throw error;
          if (data[0].username == username) {
            toast.error('That username is already in use!');
          }
        } catch (error) {
          const resp = await supabase.auth.signUp({
            email: email,
            password: password,
          });
          if (resp.error) throw resp.error;
          const userId = resp.data.user?.id;

          if (userId) {
            await createUser(userId);
          }
        }
      } else {
        toast(<span>Please fill all required fields.</span>, {
          icon: <FaExclamationCircle className="text-yellow-500" />,
        });
      }
    } catch (error) {
      toast.error(`${error}`);
    }
    setSignupButton('Sign Up');
  }

  async function createUser(userId: string) {
    try {
      const { error } = await supabase
        .from('users')
        .insert({ id: userId, username: username });
      if (error) throw error;
      toast.success(
        <div className="flex flex-col gap-2">
          <span>Your account has been successfully created!</span>
          <b>
            Check your email inbox and follow the link to verify your account.
          </b>
        </div>
      );
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (error) {
      toast.error('That email address is already in use!');
    }
  }

  return (
    <>
      <Head>
        <title>Sign Up | LinkSpaceApp</title>
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
                Create an account
              </h2>
            </div>
            <form className="mt-8 space-y-6" action="#" method="POST">
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Username  *"
                  />
                </div>
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Email address  *"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Password  *"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={signUpWithEmail}
                  type="button"
                  className="flex w-full justify-center rounded-md border border-transparent shadow-lg hover:opacity-90 bg-gradient-to-br from-emerald-500 to-emerald-600 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {signupButton}
                </button>
                <Toaster
                  toastOptions={{
                    success: {
                      duration: 8000,
                    },
                  }}
                />
                <Link
                  className="flex items-center text-white font-medium hover:text-blue-400 mt-5 text-sm hover:underline underline-offset-4 w-fit"
                  href="/login"
                >
                  <FiChevronLeft />
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
        <span className="text-white w-full flex justify-center text-sm absolute bottom-5 mt-8 font-semibold font-mono">
          © André Pichardo 2023
        </span>
      </div>
    </>
  );
};

export default SignUp;
