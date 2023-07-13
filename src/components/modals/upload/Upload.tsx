import React from "react";

const Upload = ({
  visibility,
  setVisibility,
  isPosting
}: {
  visibility: Boolean;
  setVisibility: Function;
  isPosting:boolean
}) => {
  return (
    <div
      className={`${
        visibility ? "" : "hidden"
      } fixed top-0 bottom-0 left-0 right-0 min-h-[90vh] min-w-screen bg-[#8f8e8ea9] flex justify-center items-center`}
    >
      <div className=" min-w-[320px] min-h-[320px] w-[90vw] bg-cyan-300 rounded-xl">
        {isPosting && <button className="w-10 h-10 rounded-full bg-orange-500"></button>}
        <button onClick={()=>setVisibility(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default Upload;
