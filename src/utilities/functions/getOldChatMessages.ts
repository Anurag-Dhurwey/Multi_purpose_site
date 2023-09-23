import { admin, oldChats, session } from "@/typeScript/basics";
import { client } from "../sanityClient";
import { set_OldChats } from "@/redux_toolkit/features/indexSlice";

export  async function get_Old_ChatMessages({oldChats,session,admin,dispatch}:argType) {
    if (!oldChats?.length && session) {
      try {
        const admins_all_old_chats = await client.fetch(
          `*[_type=="chat" && (userOne._ref=="${admin._id}"|| userTwo._ref=="${admin._id}") ]{_id,userOne->{_id,name,email,image},userTwo->{_id,name,email,image}}`
        );
        if (admins_all_old_chats.length) {
          dispatch(set_OldChats(admins_all_old_chats));
          // return chatMessages[0];
        }
      } catch (error) {
        console.error(error);
      }
    }
  }


  interface argType{
    oldChats:oldChats[] | undefined,session:session,admin:admin,dispatch:Function
  }