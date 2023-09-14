import { set_ConnectionsId } from "@/redux_toolkit/features/indexSlice";
import { client } from "../sanityClient";
import { _ref, admin, usr_and_key_in_array } from "@/typeScript/basics";

export async function getAdminConnectionId({
  dispatch,
  id,
  admin,
}: {
  id: string;
  dispatch: Function;
  admin: admin;
}) {
  try {
    const res:Array<{_id:string}> = await client.fetch(
      `*[_type=="connections" && user._ref=="${id}" ]{_id}`
    );

    if (res[0]) {
      if (id == admin?._id) {
        console.log({ dispatch });
        if (dispatch) {
          dispatch(set_ConnectionsId(res[0]._id));
        }
        return res[0]._id;
      }

      
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getUsrConnectionId(id:string) {
  try {
    const res:Array<resType> = await client.fetch(
      `*[_type=="connections" && user._ref=="${id}" ]{_id,requests_sent}`
    );
    if(res[0]){
      return res[0]
    }

  } catch (error) {
    
  }
}

interface resType{
  _id:string;
  requests_sent:{_key:string;user:_ref}[]
}