import Head from 'next/head';
import supabase from 'utils/supabaseClient';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userID, setUserId] = useState<string | undefined>();

  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser();
      console.log(user);
      if (user) {
        const userId = user.data.user?.id;
        setIsAuthenticated(true);
        setUserId(userId);
      }
    };
    getUser();
  }, []);

  return (
    <>
      <Head>
        <title>LinkSpaceApp</title>
        <meta name="description" content="A Linktree inspired app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-emerald-500 text-xl font-bold">Hello Drew!</main>
    </>
  );
}
