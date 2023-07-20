import { client } from "../sanityClient";
interface states {
  dispatch: Function;
  setUser: Function;
  user:user,
  session:Object
}
interface user {
  _id: string;
  name: string;
  email: string;
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
      alert(`Unable to find Profile ID => ${error.message} `);
    }
  } else {
    return user;
  }
};
