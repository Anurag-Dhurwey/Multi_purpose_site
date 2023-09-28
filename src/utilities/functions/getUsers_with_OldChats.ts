import { admin,  session } from "@/typeScript/basics";
import { client } from "../sanityClient";
import { set_users_with_old_chats } from "@/redux_toolkit/features/indexSlice";

export  async function get_Users_with_Old_Chat({session,admin,dispatch}:argType) {
    if (session && admin._id) {
      try {
        const users_with_old_chat = await client.fetch(
          `*[_type=="chat" && (userOne._ref=="${admin._id}"|| userTwo._ref=="${admin._id}") ]{_id,userOne->{_id,name,email,image},userTwo->{_id,name,email,image}}`
        );
        if (users_with_old_chat.length) {
          dispatch(set_users_with_old_chats(users_with_old_chat));
          // return chatMessages[0];
        }
      } catch (error) {
        console.error(error);
      }
    }
  }


  interface argType{session:session,admin:admin,dispatch:Function
  }