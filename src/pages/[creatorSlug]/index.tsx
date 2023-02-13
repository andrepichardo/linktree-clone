import Head from 'next/head';
import supabase from 'utils/supabaseClient';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { useEffect, useState } from 'react';
import { FiLoader, FiLogOut, FiTrash, FiUpload } from 'react-icons/fi';
import { FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import Logo from '../../../public/Logo.png';
import samplePicture from '../../../public/images/sampleProfilePic.png';
import Image from 'next/image';
import Link from 'next/link';
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
  const [signOutButton, setSignOutButton] = useState<any>(
    <FiLogOut size={20} />
  );
  const [uploadButton, setUploadButton] = useState<any>(
    'Upload Profile Picture'
  );
  const [links, setLinks] = useState<Link[]>();
  const [images, setImages] = useState<ImageListType>([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState<
    string | undefined
  >();
  const router = useRouter();
  const { creatorSlug } = router.query;
  const PageTitle = (creatorSlug || 'loading...') + ' | LinkSpace';

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
  };

  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        const userId = user.data.user?.id;

        try {
          const { data, error } = await supabase
            .from('users')
            .select('username')
            .eq('id', userId)
            .single();
          if (error) throw error;
          const username = data.username;

          if (creatorSlug == username) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {}
      }
    };
    getUser();
  }, [router, userId, creatorSlug]);

  useEffect(() => {
    const getLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('links')
          .select('title, url')
          .eq('user_id', userId);
        if (error) throw error;
        setLinks(data);
      } catch (error) {}
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
          .select('id, profile_picture_url')
          .eq('username', creatorSlug);
        if (error) throw error;
        const profile_picture_url = data[0]['profile_picture_url'];
        const userId = data[0]['id'];
        setProfilePictureUrl(profile_picture_url || samplePicture);
        setUserId(userId);
      } catch (error) {
        router.push('/404');
      }
    };

    if (creatorSlug) {
      getUser();
      setUserId(userId);
    }
  }, [creatorSlug, userId, router]);

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
        setTitle('');
        setUrl('');
        if (links) {
          setLinks([...links, ...data]);
        }
        toast.success('Link added successfully!');
      } else {
        toast(<span>Please fill all required fields.</span>, {
          icon: <FaExclamationCircle className="text-yellow-500" />,
        });
      }
    } catch (error) {
      toast.error('Error adding new link! Try again.');
    }
    setAddButton('Add new Link');
  };

  const uploadProfilePicture = async () => {
    try {
      setUploadButton(
        <div className="flex items-center gap-1">
          Uploading <FaSpinner className="animate-spin" />
        </div>
      );
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
          if (profilePictureUrl) {
            setProfilePictureUrl(publicUrl);
          }
          toast.success('Profile picture added successfully!');
        }
      } else {
        toast(<span>Please select an image.</span>, {
          icon: <FaExclamationCircle className="text-yellow-500" />,
        });
      }
    } catch (error) {
      toast.error('Error uploading image. Try again.');
    }
    setUploadButton('Upload Profile Picture');
  };

  async function SignOut() {
    try {
      setSignOutButton(<FaSpinner className="animate-spin" size={20} />);
      if (isAuthenticated) {
        const resp = await supabase.auth.signOut();
        if (resp.error) throw resp.error;
        router.push('/login');
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  return (
    <>
      <Head>
        <title>{PageTitle}</title>
        <meta name="description" content="A Linktree inspired app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col gap-2 w-full min-h-screen justify-center items-center bg-gradient-to-b from-sky-500 to-sky-800 py-4 md:py-8">
        <Link
          href="/"
          className="flex md:absolute mb-6 top-5 left-5 justify-center items-end text-2xl italic text-sky-900 font-mono font-bold"
        >
          <h1>Link</h1>
          <Image className="w-9 pl-0.5 translate-y-1" src={Logo} alt="" />
          <h1>pace</h1>
        </Link>

        {isAuthenticated && (
          <button
            onClick={SignOut}
            className="bg-red-500 hover:bg-red-500/80 transition-all p-2 flex justify-center items-center w-11 h-11 md:w-12 md:h-12 rounded-full absolute top-5 right-5 active:scale-95 text-white font-mono"
          >
            {signOutButton}
          </button>
        )}
        <div className="flex flex-col items-center gap-4 max-w-sm w-full px-4">
          <Toaster />
          {profilePictureUrl ? (
            <Image
              priority
              className="rounded-full bg-white border-2 border-white w-full h-full sm:min-w-[120px] max-w-[120px] min-h-[120px] max-h-[120px] shrink"
              src={profilePictureUrl}
              width={120}
              height={120}
              alt=""
            />
          ) : (
            <FiLoader className="animate-spin text-4xl text-white" />
          )}
          {links ? (
            links?.map((link: Link, index: number) => {
              return (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(link.url, '_blank');
                  }}
                  className="flex flex-col w-full items-center hover:scale-[97%] transition-all rounded-lg shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold px-3 font-mono py-4 cursor-pointer"
                  key={index}
                >
                  <span>{link.title}</span>
                </div>
              );
            })
          ) : (
            <FiLoader className="animate-spin text-emerald-500 text-4xl" />
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
              onClick={uploadProfilePicture}
              className="mt-5 bg-emerald-500 rounded-lg shadow-lg text-white font-semibold px-5 py-1.5 hover:bg-emerald-500/80 active:scale-95 transition-all self-center"
            >
              {uploadButton}
            </button>
          </div>
        )}
      </main>
    </>
  );
}
