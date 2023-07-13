"use client";
import React from "react";
import { signIn, signOut } from "next-auth/react";
import style from "./navbar.module.css";
import { useSession } from "next-auth/react";
import Link from "next/link";
const Navbar = () => {
  const nav = ["home", "discover", "about", "post", "search"];
  const { data: session } = useSession();

  return (
    <div className={style.nav}>
      <Link href={'/'}>
      <button>LOGO</button>
      </Link>
      <ul>
        {nav.map((nav, i) => {
          return <li key={i}>{nav}</li>;
        })}
      </ul>
      <div className={style.right}>
        {!session && <button onClick={() => signIn()}>Login</button>}
        {session && (
          <Link href={'/upload'}>
            <button>Upload</button>
          </Link>
        )}
        <div onClick={() => {}} className={style.profile_icon}>
            <span className=" font-extrabold text-2xl text-yellow-700">{session?.user?.name?.slice(0,1)}</span>
          <div className={style.dropdown_content}>
            {session && (
              <>
                <button>
                  <Link href={"/profile"}>Profile</Link>
                </button>
                <button onClick={() => signOut()}>Logout</button>
              </>
            )}
            {!session && (
              <>
                <button onClick={() => signIn()}>Login</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
