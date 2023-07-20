"use client";
import React, { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import style from "./navbar.module.css";
import { FaBars } from "react-icons/fa";
import { BiUpload } from "react-icons/bi";
import { useSession } from "next-auth/react";
import Link from "next/link";
import SideNavbar from "./miniComps/SideNavbar";
const Navbar = () => {
  const nav = ["home", "discover", "about", "post", "search"];
  const { data: session } = useSession();
  const [sideNavbar, setSideNavbar] = useState<boolean>(false);
  return (
    <div className="max-[430px]:h-[42px] h-[56px]" >
      <div className={`${style.nav}`} style={{width:'100vw',position:'fixed',top:'0',zIndex:'9'}}>
        <span className={style.sideBarForMobile} style={{ zIndex: "10" }}>
          {!sideNavbar && (
            <button onClick={() => setSideNavbar(true)}>
              <FaBars
                style={{ fontSize: "large", fontWeight: "600", color: "black" }}
              />
            </button>
          )}
          {sideNavbar && <SideNavbar setSideNavbar={setSideNavbar} navRoutes={nav}/>}
        </span>

        <Link href={"/"} className={style.LOGO}>
          <button>LOGO</button>
        </Link>

        <div className={style.navRoutes}>
        <ul>
          {nav.map((nav, i) => {
            return <li key={i}>{nav}</li>;
          })}
        </ul>
        </div>

        <div className={style.right}>
          {!session && <button onClick={() => signIn()}>Login</button>}
          {session && (
            <Link href={"/upload"} className="text-xs">
              <button>
                <BiUpload
                  style={{
                    fontSize: "large",
                    fontWeight: "600",
                    color: "black",
                  }}
                />
              </button>
            </Link>
          )}
          <div onClick={() => {}} className={style.profile_icon}>
            <span className=" font-extrabold text-2xl text-yellow-700">
              {session?.user?.name?.slice(0, 1)}
            </span>
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
    </div>
  );
};

export default Navbar;
