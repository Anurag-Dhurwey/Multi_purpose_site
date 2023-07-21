"use client";
import React, { useEffect, useState } from "react";
import { user, uploadForm, media_Item } from "@/typeScript/basics";
import style from "./upload.module.css";
import { Upload } from "@/components";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { setUser, set_media_items } from "@/redux_toolkit/features/indexSlice";
import { client } from "@/lib/sanityClient";
import { useSession } from "next-auth/react";
import { getUserId } from "@/lib/functions/getUserId";
import { getMediaItems } from "@/lib/functions/getMediaItems";
const Page = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.hooks.user);
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
    if (session && file) {
      if (!isFileValid.length) {
        setModal(true);
        const user_with_id = await getUserId({
          dispatch,
          setUser,
          user,
          session,
        });
        uploadingData(
          file,
          form,
          user_with_id,
          { set_media_items, setIsPosting, dispatch, setOnSuccess },
          meadia_items
        );
      } else if (isFileValid.length) {
        alert(isFileValid[0].message);
      }
    } else {
      console.log("session not found");
    }
  };

  useEffect(() => {
    if (session) {
      if (!meadia_items.length) {
        getMediaItems({ dispatch, set_media_items });
      }
    }
  }, [session]);
  return (
    <div className="flex justify-center items-start w-screen min-h-screen bg-slate-200">
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
  set_media_items: Function;
  setOnSuccess: Function;
}

async function uploadingData(
  file: File,
  form: uploadForm,
  user: user_with_id,
  States: useStates,
  meadia_items: Array<media_Item>
) {
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
          body: JSON.stringify({ uploadedFileRes, user, form }),
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
type user_with_id =
  | user
  | {
      _id: any;
      name: string | null | undefined;
      email: string | null | undefined;
      image?: string | undefined;
      desc?: string | undefined;
      link?: string | undefined;
    }
  | undefined;
