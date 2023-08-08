
import {client} from '../sanityClient'
import { users} from '@/typeScript/basics'
async function getSuggestedUsers() {
    try {
        const usersArr:Array<users> = await client.fetch(
            `*[_type=="user" ]{_id,name,image,email,connections{connectedUsr}}`
          );

          return usersArr
    } catch (error) {
        console.error(error)
    }
}


export {getSuggestedUsers}