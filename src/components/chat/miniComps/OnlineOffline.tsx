
import Image from "next/image";
import { onlineUsers } from "@/redux_toolkit/features/indexSlice";
import { useAppSelector } from "@/redux_toolkit/hooks";
import { useSession } from "next-auth/react";
import {
  currentUser_On_Chat,
  min_id_of_usr,
  usr_and_key_in_array,
} from "@/typeScript/basics";

interface propType {
  remain_usr: usr_and_key_in_array[];
  setCurrentUsr: React.Dispatch<
    React.SetStateAction<currentUser_On_Chat | undefined>
  >;
}
const OnlineOffline = ({ remain_usr, setCurrentUsr }: propType) => {

  return (
    <ul>
<MapUsr remain_usr={remain_usr} setCurrentUsr={setCurrentUsr} onlyOnline />
<MapUsr remain_usr={remain_usr} setCurrentUsr={setCurrentUsr} />
    </ul>
  );
};

export default OnlineOffline;

interface mapUsr extends propType {
  onlyOnline?: boolean;
}

const MapUsr = ({ remain_usr, setCurrentUsr, onlyOnline }: mapUsr) => {
  const { data: session } = useSession();

  const onLineUsers = useAppSelector((state) => state.hooks.onLineUsers);



  return (
    <>
      {remain_usr?.map((item, i) => {
        const { name, email, image, _id } = item.user;
        if (email == session?.user?.email) {
          return null;
        }
        const isOnline = isUserOnline(item.user,onLineUsers);

        if (onlyOnline) {
          if (!isOnline) {
            return null;
          }
        } else {
          if (isOnline) {
            return null;
          }
        }

        return (
          <li
            key={_id}
            className="w-fit py-2 px-1 rounded-xl  overflow-hidden flex flex-col justify-evenly items-center border-2 border-blue-500"
          >
            <button onClick={() => setCurrentUsr({ user: item.user })}>
              <Image
                src={`${image}`}
                height={100}
                width={100}
                alt="image"
                className=" max-sm:h-16 max-sm:w-16 rounded-full overflow-hidden"
              />
              <p style={{ color: isOnline?"green":"black" }} className="text-xs">
                {name}
              </p>
            </button>
          </li>
        );
      })}
    </>
  );
};


export function isUserOnline(user: min_id_of_usr,onLineUsers:onlineUsers[]) {
  const check = onLineUsers?.find((Onusr) => {
    return Onusr.email == user.email;
  });
  return check ? true : false;
}