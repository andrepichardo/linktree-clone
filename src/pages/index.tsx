import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import supabase from 'utils/supabaseClient';
import Logo from '../../public/Logo.png';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser();
      console.log(user);
      if (user.data.user) {
        const userId = user.data.user?.id;
        setIsAuthenticated(true);
        setUserId(userId);
        SignedIn();
      } else {
        router.push('/login');
      }

      async function SignedIn() {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('username')
            .eq('id', userId)
            .single();
          if (error) throw error;
          const username = data.username;
          router.push(`/${username}`);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getUser();
  }, [isAuthenticated, router, userId]);

  return (
    <>
      <Head>
        <title>LinkSpaceApp</title>
        <meta name="description" content="A Linktree inspired app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col gap-8 w-full min-h-screen justify-center items-center bg-gradient-to-b from-sky-500 to-sky-800 py-6">
        <div className="flex w-full justify-center items-end text-6xl italic animate-text bg-gradient-to-r bg-clip-text text-transparent from-sky-900 via-sky-600 to-sky-900 font-mono font-bold">
          <h1>Link</h1>
          <Image
            className="w-20 pl-1 translate-y-3 animate-pulse"
            src={Logo}
            alt=""
          />
          <h1>pace</h1>
        </div>
        <span className=" text-white text-sm absolute bottom-5 mt-8 font-semibold font-mono">
          © André Pichardo 2023
        </span>
      </main>
    </>
  );
}
