'use client'
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserId } from "@/utilities/functions/getUserId";
import { setUser } from "@/redux_toolkit/features/indexSlice";
import Image from "next/image";
const Page = () => {
  const dispatch=useAppDispatch()
  const { data: session } = useSession();
  const connectionRequests = useAppSelector(
    (state) => state.hooks.user.connections?.requests
  );
  const user=useAppSelector(state=>state.hooks.user)
  console.log(connectionRequests);
  if (!session) {
    return null;
  }

  useEffect(() => {
    if (session) {
      getUserId({dispatch,user,session,setUser})
    }
    console.log('hello')
  }, [session]);

  return (
    <section style={{paddingTop:'8px'}}>
      <ul className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2">
        {connectionRequests?.map((req, i) => {
          return <li
          key={req.userId}
          className="py-2 px-1 rounded-xl  overflow-hidden flex flex-col justify-evenly items-center border-2 border-blue-500"
        >
          <Image
            src={`${req.img}`}
            height={100}
            width={100}
            alt="image"
            className=" max-sm:h-16 max-sm:w-16 rounded-full overflow-hidden"
          />
          <p className="text-xs">{req.name}</p>
          <button className="" onClick={() => {}}>
            accept
          </button>
        </li>;
        })}
      </ul>
    </section>
  );
};

export default Page;
