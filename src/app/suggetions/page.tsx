"use client";
// import React, { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { getSuggestedUsers } from "@/utilities/functions/getSuggestedUsers";
// import { users } from "@/typeScript/basics";
// import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
// import {
//   set_Admin,
//   set_Admins_Connections,
//   set_suggestedData,
// } from "@/redux_toolkit/features/indexSlice";
// import Image from "next/image";
// import { client } from "@/utilities/sanityClient";
// import { message } from "antd";
// import { getAdminData } from "@/utilities/functions/getAdminData";
// import { socket } from "@/utilities/socketIo";
// const page = () => {
//   const dispatch: Function = useAppDispatch();
//   const { data: session } = useSession();
//   const suggestedData = useAppSelector((state) => state.hooks.suggestedData);
//   const admin = useAppSelector((state) => state.hooks.admin);
//   async function configureSuggestions() {
//     if (session) {
//       if (!suggestedData.users.length) {
//         try {
//           const userArr = await getSuggestedUsers();
//         console.log(userArr);
//         if (userArr) {
//           dispatch(set_suggestedData({ _type: "users", data: userArr }));
//         }
//         } catch (error) {
//           message.error('something went wrong')
//         }finally{
//         }
//       }
//     }
//   }

//   const emitConnectionRequestSent = (userTosendReq: users) => {
//     socket.emit("ConnectionRequest", { user: userTosendReq });
//     socket.on("ConnectionRequest", (msg) => {
//       console.log(msg);
//     });
//   };

//   async function sendRequestHandler(userTosendReq: users) {
//     if (admin._id) {
//       const { _id, image, name, email } = userTosendReq;
//       console.log(userTosendReq.email, userTosendReq.name);
//       try {
//         const res = await client
//           .patch(userTosendReq._id)
//           .setIfMissing({ connections: { requests: [] } })
//           .insert("after", "connections.requests[-1]", [
//             {
//               name: admin.name,
//               userId: admin._id,
//               mail: admin.email,
//               img: admin.image,
//             },
//           ])
//           .commit({ autoGenerateArrayKeys: true });
//         const check = res.connections.requests?.find(
//           (usr) => usr.userId == admin._id
//         );
//         console.log(check);
//         if (check) {
//           emitConnectionRequestSent(userTosendReq);
//           message.success("Request sent");
//         } else {
//           message.error("something went wrong");
//         }
//       } catch (error) {
//         message.error("something went wrong");
//         console.error(error);
//       }
//     } else {
//       console.error("user not found");
//       message.error("user id not found");
//     }
//   }

//   if (!session) {
//     return null;
//   }

//   useEffect(() => {
//     configureSuggestions();
//     if (!admin._id && session) {
//       getAdminData({ dispatch, set_Admin, admin, session });
//     }
//   }, [session]);

//   return (
//     <section style={{ paddingTop: "8px" }}>
//       <ul className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2">
//         {suggestedData.users ? (
//           suggestedData.users.map((user, i) => {
//             return (
//               <li
//                 key={user._id ? user._id : i}
//                 style={{ display: admin._id == user._id ? "none" : "" }}
//                 className="py-2 px-1 rounded-xl  overflow-hidden flex flex-col justify-evenly items-center border-2 border-blue-500"
//               >
//                 <Image
//                   src={`${user.image}`}
//                   height={100}
//                   width={100}
//                   alt="image"
//                   className=" max-sm:h-16 max-sm:w-16 rounded-full overflow-hidden"
//                 />
//                 <p className="text-xs">{user.name}</p>
//                 <button className="" onClick={() => sendRequestHandler(user)}>
//                   connect
//                 </button>
//               </li>
//             );
//           })
//         ) : (
//           <li>Gathering information</li>
//         )}
//       </ul>
//     </section>
//   );
// };

// export default page;

import Suggetions from "@/components/suggetions/Suggetions";
import { useAppSelector } from "@/redux_toolkit/hooks";
import { users, usersMinData } from "@/typeScript/basics";
import { client } from "@/utilities/sanityClient";
import { socket } from "@/utilities/socketIo";
import { message } from "antd";
import { useSession } from "next-auth/react";
import React from "react";

const Page = () => {
  const admin = useAppSelector((state) => state.hooks.admin);
  const { data: session } = useSession();

  const emitConnectionRequestSent = (userTosendReq: users) => {
    socket.emit("ConnectionRequest", { user: userTosendReq });
  };

  async function sendRequestHandler(userTosendReq: users) {
    if (admin._id) {
      const { _id, image, name, email } = userTosendReq;
      console.log(userTosendReq.email, userTosendReq.name);
      try {
        const res = await client
          .patch(userTosendReq._id)
          .setIfMissing({ connections: { requests: [] } })
          .insert("after", "connections.requests[-1]", [
            {
              name: admin.name,
              userId: admin._id,
              mail: admin.email,
              img: admin.image,
            },
          ])
          .commit({ autoGenerateArrayKeys: true });
        const check = res.connections.requests?.find(
          (usr: usersMinData) => usr.userId == admin._id
        );
        console.log(check);
        if (check) {
          emitConnectionRequestSent(userTosendReq);
          message.success("Request sent");
        } else {
          message.error("unable to add something went wrong");
        }
      } catch (error) {
        message.error("something went wrong");
        console.error(error);
      }
    } else {
      console.error("user not found");
      message.error("user id not found");
    }
  }

  if(!session){return null}
 

  return (
    <main>
      <Suggetions sendRequestHandler={sendRequestHandler} />
    </main>
  );
};

export default Page;
