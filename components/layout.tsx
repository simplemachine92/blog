import Head from 'next/head'
import Image from 'next/image'
import profilePic from "../pages/resume/me.jpg";
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import ThemeToggler from './toggle'
import { useTheme } from "next-themes";
import { useEffect, useState } from 'react';

export const siteTitle = 'Justin Pulley ☯️'

export default function Layout({
  children,
  home
}: {
  children: React.ReactNode
  home?: boolean
}) {
  const resolvedTheme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <div className={styles.container}>
      <ThemeToggler />
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className="">
        {home ? (
          <>
            <div className="flex space-x-8 flex space-y-2 mt-4 mb-4">
              <Image
                src={profilePic}
                width={100}
                height={100}
                alt="Picture of the author"
                className="rounded-full h-20 w-20 object-cover"
              />
              <div className="">
                <h1 className="text-2xl font-bold">👨‍💻 Justin Pulley</h1>
                <p className="text-md mt-2 ">Full-Stack Blockchain Engineer</p>
              </div>
            </div>
            <div className="flex mt-4 h-1/2 w-3/4 flex-row items-start">
              <div className="animate-border inline-block rounded-md bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-[length:400%_400%] p-0.5">
                <h1
                  className={
                    resolvedTheme.theme == "dark"
                      ? "text-sm block rounded-md bg-slate-800 text-inherit px-5 py-3"
                      : "text-sm block rounded-md bg-slate-200 text-inherit px-5 py-3"
                  }
                >
                  Hello 👋, I mostly write about software I'm developing. You're
                  likely to read about blockchains, and how to interact with
                  them.
                </h1>
              </div>
            </div>
            <div className="w-1/2 items-start space-x-4 my-6 ml-1">
              <Link
                className="inline-block hover:opacity-75"
                href="https://twitter.com/nowonderer"
              >
                <svg
                  aria-hidden="true"
                  height="27"
                  version="1.1"
                  viewBox="0 0 21 21"
                  width="27"
                  className={
                    resolvedTheme.theme == "dark" ? "fill-white" : "fill-black"
                  }
                >
                  <path d="M20.055 7.983c.011.174.011.347.011.523 0 5.338-3.92 11.494-11.09 11.494v-.003A10.755 10.755 0 0 1 3 18.186c.308.038.618.057.928.058a7.655 7.655 0 0 0 4.841-1.733c-1.668-.032-3.13-1.16-3.642-2.805a3.753 3.753 0 0 0 1.76-.07C5.07 13.256 3.76 11.6 3.76 9.676v-.05a3.77 3.77 0 0 0 1.77.505C3.816 8.945 3.288 6.583 4.322 4.737c1.98 2.524 4.9 4.058 8.034 4.22a4.137 4.137 0 0 1 1.128-3.86A3.807 3.807 0 0 1 19 5.274a7.657 7.657 0 0 0 2.475-.98c-.29.934-.9 1.729-1.713 2.233A7.54 7.54 0 0 0 22 5.89a8.084 8.084 0 0 1-1.945 2.093Z"></path>
                </svg>
              </Link>
              <Link
                className="inline-block hover:opacity-75"
                href="https://github.com/simplemachine92"
              >
                <svg
                  className={
                    resolvedTheme.theme == "dark" ? "fill-white" : "fill-black"
                  }
                  aria-hidden="true"
                  height="24"
                  version="1.1"
                  viewBox="0 0 16 16"
                  width="24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                  ></path>
                </svg>
              </Link>
              <Link
                className="inline-block hover:opacity-75"
                href="https://www.linkedin.com/in/justin-pulley-1324b3161/"
              >
                <svg
                  viewBox="0 0 22 22"
                  aria-hidden="true"
                  height="26"
                  version="1.1"
                  width="26"
                  className={
                    resolvedTheme.theme == "dark" ? "fill-white" : "fill-black"
                  }
                >
                  <path d="M18.335 18.339H15.67v-4.177c0-.996-.02-2.278-1.39-2.278-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.7 0 3.2 1.778 3.2 4.091v4.715zM7.003 8.575a1.546 1.546 0 01-1.548-1.549 1.548 1.548 0 111.547 1.549zm1.336 9.764H5.666V9.75H8.34v8.589zM19.67 3H4.329C3.593 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.338C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.666 3h.003z"></path>
                </svg>
              </Link>
              <Link
                className="inline-block hover:opacity-75"
                href="mailto:justinpulley92@gmail.com"
              >
                <svg
                  viewBox="0 0 22 22"
                  aria-hidden="true"
                  height="26"
                  version="1.1"
                  width="26"
                  className={
                    resolvedTheme.theme == "dark" ? "fill-white" : "fill-black"
                  }
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"></path>
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"></path>
                </svg>
              </Link>
              {/*  */}
            </div>
          </>
        ) : (
          <>
            <h2 className={utilStyles.headingLg}>
              <Link href="/" className={utilStyles.colorInherit}>
                ← Back to Posts
              </Link>
            </h2>
          </>
        )}
      </header>

      <main>{children}</main>
      {!home && <Link href="/">← Back to home</Link>}
    </div>
  );
}
