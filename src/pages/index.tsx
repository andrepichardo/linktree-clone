import Head from 'next/head';
import supabase from 'utils/supabaseClient';
import { useEffect, useState } from 'react';
import { FiLoader } from 'react-icons/fi';
type Link = {
  title: string;
  url: string;
};

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [title, setTitle] = useState<string | undefined>();
  const [url, setUrl] = useState<string | undefined>();
  const [addButton, setAddButton] = useState<string | undefined>(
    'Add new Link'
  );
  const [links, setLinks] = useState<Link[]>();

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

  useEffect(() => {
    const getLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('links')
          .select('title, url')
          .eq('user_id', userId);

        if (error) throw error;
        setLinks(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      getLinks();
    }
  }, [userId]);

  const addNewLink = async () => {
    try {
      if (title && url && userId) {
        const { data, error } = await supabase
          .from('links')
          .insert({
            title: title,
            url: url,
            user_id: userId,
          })
          .select();
        if (error) throw error;
        console.log(data);
        setAddButton('Adding');
        setTitle('');
        setUrl('');
        if (links) {
          setLinks([...links, ...data]);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setAddButton('Add new Link');
  };

  return (
    <>
      <Head>
        <title>LinkSpaceApp</title>
        <meta name="description" content="A Linktree inspired app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col w-full min-h-screen justify-center items-center bg-gradient-to-b from-sky-500 to-sky-800">
        <div className="flex flex-col items-center gap-4 max-w-sm w-full px-4">
          {links ? (
            links?.map((link: Link, index: number) => {
              return (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = link.url;
                  }}
                  className="flex flex-col w-full items-center hover:scale-[97%] transition-all rounded-lg shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold px-3 font-mono py-4 cursor-pointer"
                  key={index}
                >
                  <span>{link.title}</span>
                </div>
              );
            })
          ) : (
            <FiLoader className="animate-spin text-white text-4xl" />
          )}
        </div>

        {isAuthenticated && (
          <div className="flex max-w-sm w-full flex-col gap-2 mt-4 px-4">
            <div>
              <label className="text-white font-semibold" htmlFor="title">
                Link Title:
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                id="title"
                name="title"
                type="text"
                className=" w-full border placeholder:text-sm placeholder:italic border-gray-300 px-3 py-3 rounded text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-sm sm:text-base"
                placeholder="Link Title"
              />
            </div>
            <div>
              <label className="text-white font-semibold" htmlFor="url">
                URL:
              </label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                id="url"
                name="url"
                type="url"
                className=" w-full border placeholder:text-sm placeholder:italic border-gray-300 px-3 py-3 rounded text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-sm sm:text-base"
                placeholder="https://example.com/"
              />
            </div>
            <button
              onClick={addNewLink}
              className="mt-5 bg-emerald-500 rounded-lg shadow-lg text-white font-semibold px-5 py-1.5 hover:bg-emerald-500/80 active:scale-95 transition-all self-center"
            >
              {addButton}
            </button>
          </div>
        )}
      </main>
    </>
  );
}
