import React from "react";

const Upload = ({
  visibility,
  setVisibility,
  isPosting,
  onSuccess,
}: {
  visibility: Boolean;
  setVisibility: Function;
  isPosting: boolean;
  onSuccess: boolean|null;
}) => {
  return (
    <div
      className={`${
        visibility ? "" : "hidden"
      } fixed top-0 bottom-0 left-0 right-0 min-h-[90vh] min-w-screen bg-[#8f8e8ea9] flex justify-center items-center`}
    >
      <div className=" min-w-[320px] min-h-[320px] w-[90vw] bg-cyan-300 rounded-xl flex flex-col justify-center items-center gap-y-2">
        {isPosting && (
          <span>
            <span className="w-10 h-10 rounded-full bg-orange-500"></span>
          <h4 className=" uppercase font-semibold text-center">
            Uploading
          </h4>
          </span>
        )}
        {!isPosting && (
          <span>
            <h3 className=" font-semibold" style={{textTransform:"uppercase",color:onSuccess?'#008000be':'#ff000094'}}>
              {onSuccess
                ? "File uploaded Successfully"
                :onSuccess==null?'': "failed something went wrong"}
            </h3>
          </span>
        )}
        <button onClick={() => setVisibility(false)} className="" style={{color:'white',border:'2px solid blue',padding:'2px 8px',borderRadius:'4px',backgroundColor:'#0000ffc2'}}>
          {isPosting ? "Cancel" : "BACK"}
        </button>
      </div>
    </div>
  );
};

export default Upload;
