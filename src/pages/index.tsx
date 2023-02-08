import Head from 'next/head';
import supabase from 'utils/supabaseClient';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { useEffect, useState } from 'react';
import { FiLoader, FiTrash, FiUpload } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
type Link = {
  title: string;
  url: string;
};

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [title, setTitle] = useState<string | undefined>();
  const [url, setUrl] = useState<string | undefined>();
  const [addButton, setAddButton] = useState<any>('Add new Link');
  const [links, setLinks] = useState<Link[]>();
  const [images, setImages] = useState<ImageListType>([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState<
    string | undefined
  >();

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
  };

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

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('profile_picture_url')
          .eq('id', userId);
        if (error) throw error;
        const profile_picture_url = data[0]['profile_picture_url'];
        setProfilePictureUrl(profile_picture_url);
      } catch (error) {
        console.log(error);
      }
    };

    if (userId) {
      getUser();
    }
  }, [userId]);

  const addNewLink = async () => {
    try {
      setAddButton(
        <div className="flex items-center gap-1">
          Adding <FaSpinner className="animate-spin" />
        </div>
      );
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

  const uploadProfilePicture = async () => {
    try {
      if (images.length > 0) {
        const image = images[0];
        if (image.file && userId) {
          const { data, error } = await supabase.storage
            .from('public')
            .upload(`${userId}/${image.file.name}`, image.file, {
              upsert: true,
            });
          if (error) throw error;
          const resp = supabase.storage.from('public').getPublicUrl(data.path);
          const publicUrl = resp.data.publicUrl;
          const updateUserResponse = await supabase
            .from('users')
            .update({ profile_picture_url: publicUrl })
            .eq('id', userId);
          if (updateUserResponse.error) throw error;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>LinkSpaceApp</title>
        <meta name="description" content="A Linktree inspired app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col w-full min-h-screen justify-center items-center bg-gradient-to-b from-sky-500 to-sky-800 py-6">
        <div className="flex flex-col items-center gap-4 max-w-sm w-full px-4">
          {profilePictureUrl ? (
            <Image
              className="rounded-full w-full h-full max-w-[120px] max-h-[120px]"
              src={profilePictureUrl}
              width={120}
              height={120}
              alt=""
            />
          ) : (
            ''
          )}
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
              className="my-5 bg-emerald-500 rounded-lg shadow-lg text-white font-semibold px-5 py-1.5 hover:bg-emerald-500/80 active:scale-95 transition-all self-center"
            >
              {addButton}
            </button>
            <ImageUploading
              multiple
              value={images}
              onChange={onChange}
              maxNumber={1}
              dataURLKey="data_url"
            >
              {({
                imageList,
                onImageUpload,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                // write your building UI
                <div className="flex flex-col items-center justify-center bg-gray-200 border-2 border-dashed border-gray-400 rounded-md">
                  <button
                    className="text-gray-500 italic font-semibold rounded-md py-4 px-4"
                    style={isDragging ? { color: 'red' } : undefined}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    Click to upload new image or drag and drop a new image here
                  </button>
                  {imageList.map((image, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-3"
                    >
                      <Image
                        className="rounded-lg min-w-[120px] max-w-[120px] min-h-[120px] max-h-[120px]"
                        src={images[0]['data_url']}
                        alt=""
                        width={120}
                        height={120}
                      />
                      <div className="flex gap-3 mb-3">
                        <button
                          className="hover:bg-gray-300 p-2 rounded-md"
                          onClick={() => onImageUpdate(index)}
                        >
                          <FiUpload className="text-blue-500 w-5 h-5" />
                        </button>
                        <button
                          className="hover:bg-gray-300 p-2 rounded-md"
                          onClick={() => onImageRemove(index)}
                        >
                          <FiTrash className="text-red-500 w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ImageUploading>
            <button
              type="submit"
              onClick={uploadProfilePicture}
              className="mt-5 bg-emerald-500 rounded-lg shadow-lg text-white font-semibold px-5 py-1.5 hover:bg-emerald-500/80 active:scale-95 transition-all self-center"
            >
              Upload profile picture
            </button>
          </div>
        )}
      </main>
    </>
  );
}
