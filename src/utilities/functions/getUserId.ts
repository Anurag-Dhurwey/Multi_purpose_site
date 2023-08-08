import { userAgent } from "next/server";
import { client } from "../sanityClient";
import { MessageInstance } from "antd/es/message/interface";
import { connections, session, sessionUser, user } from "@/typeScript/basics";
interface states {
  dispatch: Function;
  setUser: (action:user)=>void;
  user:user,
  session:session;
  messageApi?:MessageInstance;
}


export const getUserId = async (
  { dispatch, setUser,user,session, messageApi}: states
) => {
  if (!user._id && session.user?.name && session.user?.email && session.user?.image) {
    try {
      const res :Array<{_id:string,connections:connections}>= await client.fetch(
        `*[_type=="user" && email=="${session?.user?.email}"]{_id,connections}`
      );
      dispatch(
        setUser({
          ...user,
          _id: res[0]._id,
          name: session?.user?.name,
          email: session?.user?.email,
          connections:res[0].connections,
          image:session?.user?.image
          
        })
      );
      return {
        ...user,
        _id: res[0]._id,
        name: session?.user?.name,
        email: session?.user?.email,
        connections:res[0].connections,
        image:session?.user?.image
      };
    } catch (error) {
      console.error(error);
      messageApi?.error(`internal server error `);
    }
  } else {
    return user;
  }
};
