import { oldChats } from "@/typeScript/basics";
import React from "react";
interface propType {
  users_with_old_chats: oldChats[];
}
const OldConnectedUsr = ({ users_with_old_chats }: propType) => {
  return (
    <div>
      <ul>
        {users_with_old_chats?.map((usr, i) => {
          return (
            <li>
              <p>{usr.userOne.email}</p>
              <p>{usr.userTwo.email}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OldConnectedUsr;
