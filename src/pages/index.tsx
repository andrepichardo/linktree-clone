import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Logo from '../../public/Logo.png';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const resp = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) {
          router.push('/login');
          return;
        }
        const data = await resp.json();
        setIsAuthenticated(true);
        router.push(`/${data.username}`);
      } catch (error) {
        router.push('/login');
      }
    };
    getUser();
  }, [isAuthenticated, router]);

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
          &copy; Andr&eacute; Pichardo 2023
        </span>
      </main>
    </>
  );
}
