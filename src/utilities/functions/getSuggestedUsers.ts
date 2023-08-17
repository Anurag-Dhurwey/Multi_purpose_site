
import { suggestedDataPayloadType } from '@/redux_toolkit/features/indexSlice';
import {client} from '../sanityClient'
import { admin, session, suggestedData, users} from '@/typeScript/basics'
import { MessageInstance } from 'antd/es/message/interface';

type argType={
    admin:admin
    session: session
    suggestedData:suggestedData;
    dispatch:Function;
    set_suggestedData:(payload:suggestedDataPayloadType)=>void;
    message:MessageInstance;

}

async function getSuggestedUsers({session,admin,suggestedData,dispatch,set_suggestedData,message}:argType) {
   if(!suggestedData.users.length && session && admin){
    try {
        const usersArr:Array<users> = await client.fetch(
            `*[_type=="user" ]{_id,name,image,email,connections{connectedUsr}}`
          );
          dispatch(set_suggestedData({ _type: "users", data: usersArr }));
          return usersArr
    } catch (error) {
        console.error(error)
        message.error("something went wrong");
    }
   }
}


export {getSuggestedUsers}