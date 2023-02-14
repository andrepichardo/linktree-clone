import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    if (router.asPath == '/login') {
      toast.remove();
    }
    if (router.asPath == '/signup') {
      toast.remove();
    }
    if (router.asPath == '/') {
      toast.remove();
    }
  }, [router]);
  return <Component {...pageProps} />;
}
