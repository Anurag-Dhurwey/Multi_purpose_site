import { userAgent } from "next/server";
import { client } from "../sanityClient";
import { MessageInstance } from "antd/es/message/interface";
import { session, sessionUser, user } from "@/typeScript/basics";
interface states {
  dispatch: Function;
  setUser: Function;
  user:user,
  session:session;
  messageApi?:MessageInstance;
}


export const getUserId = async (
  { dispatch, setUser,user,session, messageApi}: states
) => {
  if (!user._id) {
    try {
      const id = await client.fetch(
        `*[_type=="user" && email=="${session?.user?.email}"]{_id}`
      );
      dispatch(
        setUser({
          ...user,
          _id: id[0]._id,
          name: session?.user?.name,
          email: session?.user?.email,
        })
      );
      return {
        ...user,
        _id: id[0]._id,
        name: session?.user?.name,
        email: session?.user?.email,
      };
    } catch (error) {
      console.error(error);
      messageApi?.error(`internal server error `);
    }
  } else {
    return user;
  }
};

