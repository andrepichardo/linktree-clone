import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronLeft } from 'react-icons/fi';
import Logo from '../../public/Logo.png';

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
        <Link
          href="/"
          className="flex absolute top-5 md:left-5 justify-center items-end text-2xl italic text-sky-900 font-mono font-bold"
        >
          <h1>Link</h1>
          <Image className="w-9 pl-0.5 translate-y-1" src={Logo} alt="" />
          <h1>pace</h1>
        </Link>

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
