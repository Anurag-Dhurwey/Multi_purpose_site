"use client";
import React from "react";
import { signIn, signOut } from "next-auth/react";
import style from "./navbar.module.css";
import { useSession } from "next-auth/react";
const Navbar = () => {
  const nav = ["home", "discover", "about", "post", "search"];
  const { data: session } = useSession();

  console.log(session)

  return (
    <div className={style.nav}>
      <h2>LOGO</h2>
      <ul>
        {nav.map((nav, i) => {
          return <li key={i}>{nav}</li>;
        })}
      </ul>
      <div className={style.right}>
        <ul>
          <li onClick={()=>signIn()}>Login</li>
        </ul>
        <ul>
          <li onClick={()=>signOut()}>Logout</li>
        </ul>
        <div className="h-8 w-8 rounded-full bg-blue-700"></div>
      </div>
    </div>
  );
};

export default Navbar;
