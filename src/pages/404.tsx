import Head from 'next/head';
import Link from 'next/link';
import { FiChevronLeft } from 'react-icons/fi';

const Error404 = () => {
  return (
    <>
      <Head>
        <title>Not Found | LinkSpaceApp</title>
        <meta name="description" content="A Linktree inspired app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col w-full min-h-screen text-white text-[200px] font-mono justify-center items-center text-center bg-gradient-to-b from-sky-500 to-sky-800 py-6">
        <h1>404</h1>
        <p className="text-4xl text-center">User Not Found.</p>
        <Link
          className="text-2xl underline flex items-center underline-offset-4 mt-8"
          href="/"
        >
          <FiChevronLeft />
          Go Back
        </Link>
      </main>
    </>
  );
};

export default Error404;
