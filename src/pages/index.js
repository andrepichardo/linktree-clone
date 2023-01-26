import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>LinkSpace App</title>
        <meta name="description" content="A Linktree inspired app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <span className="text-emerald-700 font-bold">Hello Drew!</span>
      </main>
    </>
  );
}
