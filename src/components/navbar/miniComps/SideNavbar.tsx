import React from "react";
import Link from "next/link";
import style from "./sidenavBar.module.css";
import { MdOutlineClose } from "react-icons/md";
const SideNavbar = ({
  setSideNavbar,
  navRoutes,
}: {
  setSideNavbar: Function;
  navRoutes: Array<string>;
}) => {
  return (
    <div className=" absolute top-0 left-0 h-screen  min-w-[220px] w-[70vw] bg-[#00ffffd0] rounded-sm py-[3px] px-[5px]">
      <button onClick={() => setSideNavbar(false)}>
        <MdOutlineClose
          style={{ fontSize: "x-large", fontWeight: "600", color: "black" }}
        />
      </button>

      <div className={style.mobileNavRoutes}>
        <ul>
          {navRoutes.map((nav, i) => {
            return (
              <li key={nav + i}>
                <button>
                  <Link href={`/${nav}`}>
                    {nav}
                    </Link>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SideNavbar;
