
import {client} from '../sanityClient'
import { userTosendReq} from '@/typeScript/basics'
async function getSuggestedUsers() {
    try {
        const usersArr:Array<userTosendReq> = await client.fetch(
            `*[_type=="user" ]{_id,name,image,email,requests,connectedUsr}`
          );

          return usersArr
    } catch (error) {
        console.error(error)
    }
}


export {getSuggestedUsers}