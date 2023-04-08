import Head from 'next/head';
import supabase from 'utils/supabaseClient';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { useEffect, useState, useRef } from 'react';
import {
  FiEdit,
  FiLoader,
  FiLogOut,
  FiSearch,
  FiShare2,
  FiTrash,
  FiUpload,
} from 'react-icons/fi';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import Logo from '../../../public/Logo.png';
import samplePicture from '../../../public/images/sampleProfilePic.png';
import Image from 'next/image';
import Link from 'next/link';
import { RWebShare } from 'react-web-share';
type Link = {
  title: string;
  url: string;
};

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState<string | undefined>();
  const [title, setTitle] = useState<string | undefined>();
  const [search, setSearch] = useState('');
  const [mobileSearch, setMobileSearch] = useState(false);
  const [url, setUrl] = useState<string | undefined>();
  const [addButton, setAddButton] = useState<any>('Add new Link');
  const [signOutButton, setSignOutButton] = useState<any>(
    <FiLogOut size={20} />
  );
  const [uploadButton, setUploadButton] = useState<any>(
    'Upload Profile Picture'
  );
  const [links, setLinks] = useState<Link[] | any>();
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
  }, [creatorSlug]);

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

  if (typeof window !== 'undefined') {
    if (mobileSearch === true) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'auto';
    }
  }

  const handleShowMobileSearch = () => {
    setMobileSearch(!mobileSearch);
    if (inputRef.current != null) {
      inputRef.current.focus();
    }
  };

  const handleSearch = () => {
    if (search.length > 0) {
      router.push(`/${search}`);
    }
    if (mobileSearch == true && search.length > 0) {
      setMobileSearch(false);
    }
    setSearch('');
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleSearch();
      if (mobileSearch == true && search.length > 0) {
        setMobileSearch(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>{PageTitle}</title>
        <meta name="description" content="A Linktree inspired app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col gap-12 md:gap-14 w-full min-h-screen justify-start items-center bg-gradient-to-b from-sky-500 to-sky-800 py-4 ">
        <Link
          href="/"
          className="flex justify-center items-end text-2xl italic text-sky-900 font-mono font-bold"
        >
          <h1>Link</h1>
          <Image className="w-9 pl-0.5 translate-y-1" src={Logo} alt="" />
          <h1>pace</h1>
        </Link>

        <div className="hidden md:flex items-center absolute h-9 left-5 top-5 ">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search for a username..."
            className="rounded-full focus:ring-2 ring-2 ring-transparent transition-all duration-300 focus:ring-emerald-500 h-8 md:w-48 lg:w-60 pl-3 pr-10 placeholder:text-xs text-sm outline-none text-emerald-600 font-semibold"
            type="search"
          />
          <button
            type="submit"
            onClick={handleSearch}
            title="Search by username"
            className="rounded-full transition-all active:scale-90 active:bg-white active:border-emerald-500 active:text-emerald-500 border border-transparent -right-1 absolute h-full w-9 flex items-center justify-center hover:bg-emerald-400 bg-emerald-500 text-white"
          >
            <FiSearch size={18} />
          </button>
        </div>

        <button
          title="Search by username"
          onClick={handleShowMobileSearch}
          className="rounded-full md:hidden transition-all active:scale-95 active:bg-white active:border-emerald-500 active:text-emerald-500 border border-transparent left-5 top-5 absolute h-11 w-11 flex items-center justify-center hover:bg-emerald-400 bg-emerald-500 text-white"
        >
          <FiSearch size={20} />
        </button>
        <div
          className={
            mobileSearch
              ? 'w-11/12 max-w-lg left-0 px-3 top-5 right-0 fixed mx-auto z-50 transition-all duration-500'
              : 'w-11/12 max-w-lg left-0 px-3 top-[-100%] right-0 fixed mx-auto z-50 transition-all duration-500'
          }
        >
          <input
            ref={inputRef}
            onClick={(e) => {
              e.stopPropagation();
            }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search for a username..."
            className="pl-4 pr-14 py-4 rounded-full outline-none w-full"
            type="search"
          />
          <FiSearch
            onClick={handleSearch}
            title="Search by username"
            className="absolute bottom-0 top-0 my-auto right-8 text-gray-400 hover:text-gray-300 transition-all rounded-full cursor-pointer"
            size={20}
          />
        </div>
        {mobileSearch ? (
          <div
            onClick={() => setMobileSearch(!mobileSearch)}
            className="w-full h-full min-h-screen top-0 left-0 z-10 bg-black/60 fixed transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full min-h-screen top-0 left-0 z-10 invisible bg-transparent fixed transition-all duration-500" />
        )}

        {isAuthenticated && (
          <button
            title="Sign out"
            onClick={SignOut}
            className="bg-red-500 hover:bg-red-500/80 transition-all p-2 flex justify-center items-center w-11 h-11 md:w-12 md:h-12 rounded-full absolute top-5 right-5 active:scale-95 text-white font-mono"
          >
            {signOutButton}
          </button>
        )}
        <div className="flex flex-col w-full items-center gap-10">
          <div className="flex flex-col items-center gap-4 max-w-sm w-full h-full px-4">
            <Toaster />
            <div className="flex flex-col w-full justify-center items-center gap-2">
              {profilePictureUrl ? (
                <div className="relative w-full flex justify-center">
                  <Image
                    priority
                    className="rounded-full bg-white border-2 border-white w-full h-full sm:min-w-[120px] max-w-[120px] min-h-[120px] max-h-[120px] object-cover shrink"
                    src={profilePictureUrl}
                    width={120}
                    height={120}
                    alt=""
                  />
                  <div className="absolute flex items-center top-0 bottom-0 right-[4.5rem]">
                    <RWebShare
                      data={{
                        text: `Check out ${creatorSlug}'s profile on LinkSpace:`,
                        url: `${window.location}`,
                        title: `${creatorSlug}`,
                      }}
                    >
                      <FiShare2
                        title="Share user's profile"
                        className="text-white hover:bg-gray-50/10 rounded-lg transition-all p-1 w-8 h-8 cursor-pointer"
                      />
                    </RWebShare>
                  </div>
                </div>
              ) : (
                <FiLoader className="animate-spin text-4xl text-white" />
              )}
              {creatorSlug ? (
                <div className="text-white font-semibold italic text-lg">
                  @{creatorSlug}
                </div>
              ) : (
                <FiLoader className="animate-spin text-white" size={20} />
              )}
            </div>
            {links ? (
              links == 0 ? (
                <div className="text-white font-mono py-5 uppercase text-center border-2 border-white rounded-lg w-full">
                  No links available.
                </div>
              ) : (
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
              )
            ) : (
              <FiLoader className="animate-spin text-emerald-500 text-4xl" />
            )}
          </div>
          {isAuthenticated && (
            <div className="flex max-w-sm w-full flex-col gap-2 px-4">
              <div className="flex flex-col mb-4">
                <h3 className="text-white uppercase flex justify-between items-center gap-1 font-semibold text-lg">
                  Add a new link <FiEdit />
                </h3>
                <span className="h-0.5 bg-white rounded-full" />
              </div>
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
              <div className="flex flex-col mb-4">
                <h3 className="text-white uppercase flex justify-between items-center gap-1 font-semibold text-lg">
                  Update profile picture{' '}
                  <MdOutlineAddPhotoAlternate size={24} />
                </h3>
                <span className="h-0.5 bg-white rounded-full" />
              </div>
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
                      Click to upload new image or drag and drop a new image
                      here
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
        </div>
      </main>
    </>
  );
}
