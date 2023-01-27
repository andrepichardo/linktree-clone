import Head from 'next/head';

export default function Home() {
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
