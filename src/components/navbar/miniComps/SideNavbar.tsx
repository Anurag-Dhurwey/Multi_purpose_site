import React from "react";
import { MdOutlineClose } from "react-icons/md";
const SideNavbar = ({ setSideNavbar }: { setSideNavbar: Function }) => {
  return (
    <div className=" absolute top-0 left-0 h-screen  min-w-[220px] w-[70vw] bg-slate-500 rounded-sm py-[3px] px-[5px]" >
      <button onClick={() => setSideNavbar(false)}>
        <MdOutlineClose  style={{fontSize:'x-large',fontWeight:'600', color:'black'}} />
      </button>
    </div>
  );
};

export default SideNavbar;
