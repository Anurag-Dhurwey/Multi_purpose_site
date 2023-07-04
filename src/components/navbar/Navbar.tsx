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
      <h2>LOGO</h2>
      <ul>
        {nav.map((nav, i) => {
          return <li key={i}>{nav}</li>;
        })}
      </ul>
      <div className={style.right}>
        {!session && (
          <ul>
            <li onClick={() => signIn()}>
              {" "}
              <button>Login</button>{" "}
            </li>
          </ul>
        )}
        <div onClick={() => {}} className={style.profile_icon}>
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
