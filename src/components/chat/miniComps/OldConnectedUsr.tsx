import { useAppSelector } from "@/redux_toolkit/hooks";
import { currentUser_On_Chat, users_with_old_chats } from "@/typeScript/basics";
import React from "react";
import UserGui from "@/components/userMinData/UserGui";
interface propType {
  users_with_old_chats: users_with_old_chats[];
  setCurrentUsr: React.Dispatch<
    React.SetStateAction<currentUser_On_Chat | undefined>
  >;
}
const OldConnectedUsr = ({ users_with_old_chats, setCurrentUsr }: propType) => {
  const admin = useAppSelector((state) => state.hooks.admin);
  return (
      <ul>
        {users_with_old_chats?.map((usr, i) => {
          const { userOne, userTwo } = usr;
          const friend = admin.email != userOne.email ? userOne : userTwo;
          return (
            <li key={i}>
              <button
                onClick={() =>
                  setCurrentUsr({ user: friend, chat_id: usr._id })
                }
              >
                <UserGui disableProfineNav user={friend} />
              </button>
            </li>
          );
        })}
      </ul>
  );
};

export default OldConnectedUsr;
