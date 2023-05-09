import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronLeft } from 'react-icons/fi';
import { RiEmotionSadLine } from 'react-icons/ri';
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
          className="absolute flex items-end justify-center font-mono text-2xl italic font-bold top-5 md:left-5 text-sky-900"
        >
          <h1>Link</h1>
          <Image className="w-9 pl-0.5 translate-y-1" src={Logo} alt="" />
          <h1>pace</h1>
        </Link>

        <h1>
          <RiEmotionSadLine size={200} />
        </h1>
        <p className="mt-10 text-4xl text-center">User Not Found.</p>
        <Link
          className="flex items-center mt-8 text-2xl hover:text-emerald-500"
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
