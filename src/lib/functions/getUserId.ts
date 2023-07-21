import { userAgent } from "next/server";
import { client } from "../sanityClient";
import { session, sessionUser, user } from "@/typeScript/basics";
interface states {
  dispatch: Function;
  setUser: Function;
  user:user,
  session:session
  // if session is null below function will throw error 
  // so question is why i gave type null  
  // because while calling below function there is typescript error 
}


export const getUserId = async (
  { dispatch, setUser,user,session, }: states
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
      alert(`Unable to find Profile ID => ${error} `);
    }
  } else {
    return user;
  }
};

