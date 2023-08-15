"use client";
import React, { useEffect, useState } from "react";
import { admin, uploadForm, media_Item } from "@/typeScript/basics";
import style from "./upload.module.css";
import { Upload } from "@/components";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";

import {
  set_Admin,
  set_media_items,
  set_onLineUsers,
} from "@/redux_toolkit/features/indexSlice";
import { useSession } from "next-auth/react";
import { client } from "@/utilities/sanityClient";
import { getMediaItems } from "@/utilities/functions/getMediaItems";
import { getAdminData } from "@/utilities/functions/getAdminData";
import { socketIoConnection } from "@/utilities/socketIo";
import { message } from "antd";

const Page = () => {
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const admin = useAppSelector((state) => state.hooks.admin);
  const meadia_items = useAppSelector((state) => state.hooks.media_Items);
  const { data: session } = useSession();

  const [onSuccess, setOnSuccess] = useState<boolean | null>(null);
  const [modal, setModal] = useState<Boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [isFileValid, setIsFileValid] = useState<
    Array<{ name: string; message: string }>
  >([]);
  const [form, setForm] = useState<uploadForm>({
    caption: "",
    desc: "",
    filePath: "",
  });
  const [file, setFile] = useState<File>();

  const onChageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    const file = e.target.files;

    if (file) {
      setFile(file[0]);
      setForm({ ...form, filePath: e.target.value });
      checkFileSize(file[0], setIsFileValid);
    }
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (session && file && admin._id) {
      if (!isFileValid.length) {
        setModal(true);
        // const user_with_id = await getAdminData({
        //   dispatch,
        //   set_Admin,
        //   admin,
        //   session,
        //   messageApi,
        // });
        uploadingData({
          file,
          form,
          admin,
          meadia_items,
          States: { set_media_items, setIsPosting, dispatch, setOnSuccess },
        });
      } else if (isFileValid.length) {
        alert(isFileValid[0].message);
      }
    } else {
      console.log("session or adminId not found");
    }
  };

  if (!session) {
    return null;
  }
  
  useEffect(() => {
    if (session) {
      socketIoConnection({
        session,
        set_onLineUsers,
        set_Admin,
        dispatch,
        admin,
        message
      });
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      if (!meadia_items.length) {
        getMediaItems({ dispatch, set_media_items, messageApi });
      }
    }
  }, [session]);

  return (
    <div className="flex justify-center items-start w-screen min-h-screen bg-slate-200">
      {contextHolder}
      <Upload
        visibility={modal}
        setVisibility={setModal}
        isPosting={isPosting}
        onSuccess={onSuccess}
      />
      <div className="py-6 max-w-[800px] min-w-[325px] w-full h-full rounded-xl bg-red-200 flex justify-evenly items-center">
        <form
          onSubmit={(e) => onSubmitHandler(e)}
          className={`${style.form} flex flex-col justify-evenly items-center`}
        >
          <div>
            <label htmlFor="caption">Caption</label>
            <input
              required
              minLength={2}
              id="caption"
              name="caption"
              type="text"
              onChange={(e) => onChageHandler(e)}
              value={form.caption}
            />
          </div>

          <div>
            <label htmlFor="desc">Description</label>
            <input
              minLength={10}
              id="desc"
              name="desc"
              type="text"
              onChange={(e) => onChageHandler(e)}
              value={form.desc}
            />
          </div>

          <div>
            <label htmlFor="file">Upload File</label>
            <input
              required
              id="file"
              name="filePath"
              type="file"
              onChange={(e) => onChageHandler(e)}
              value={form.filePath}
            />

            {isFileValid.length > 0 &&
              isFileValid.map((error, i) => {
                return (
                  <p className="text-red-700 text-xs" key={i}>
                    {error.message}
                  </p>
                );
              })}
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded text-white"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;

function checkFileSize(file: File, setIsFileValid: Function) {
  const size: boolean = file.size <= 1000 * 1024 * 10;
  if (size) {
    setIsFileValid([]);
  } else if (!size) {
    setIsFileValid([
      { name: "size", message: "File size should be less than 10 MB" },
    ]);
  }
}

interface useStates {
  setIsPosting: Function;
  dispatch: Function;
  set_media_items: (payload: Array<media_Item>) => void;
  setOnSuccess: Function;
}

async function uploadingData({
  file,
  form,
  admin,
  States,
  meadia_items,
}: {
  file: File;
  form: uploadForm;
  admin: admin;
  States: useStates;
  meadia_items: Array<media_Item>;
}) {
  const { dispatch, setIsPosting, set_media_items, setOnSuccess } = States;
  try {
    setIsPosting(true);

    const uploadedFileRes = await client.assets.upload("file", file, {
      contentType: file.type,
      filename: file.name,
    });
    if (uploadedFileRes) {
      try {
        const postedData = await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify({ uploadedFileRes, user: admin, form }),
        });
        const jsonData = await postedData.json();
        if (jsonData) {
          const { res, createdPost } = jsonData;
          dispatch(set_media_items([{ ...createdPost }, ...meadia_items]));
          setOnSuccess(true);
          setIsPosting(false);
        }
      } catch (error) {
        setIsPosting(false);
        setOnSuccess(false);
        console.error(error);
      }
    }
  } catch (error) {
    setOnSuccess(false);
    setIsPosting(false);
    console.error(error);
  }
}

// below type is for resolving type script error
// type user_with_id =
//   | user
//   | {
//       _id: any;
//       name: string | null | undefined;
//       email: string | null | undefined;
//       image?: string | undefined;
//       desc?: string | undefined;
//       link?: string | undefined;
//     }
//   | undefined;
