import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import supabase from 'utils/supabaseClient';

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
      <main className="flex flex-col w-full min-h-screen justify-center items-center bg-gradient-to-b from-sky-500 to-sky-800 py-6"></main>
    </>
  );
}
