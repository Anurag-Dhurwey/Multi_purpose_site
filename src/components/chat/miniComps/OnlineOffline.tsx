
import { onlineUsers } from "@/redux_toolkit/features/indexSlice";
import { useAppSelector } from "@/redux_toolkit/hooks";
import { useSession } from "next-auth/react";
import {
  currentUser_On_Chat,
  min_id_of_usr,
  usr_and_key_in_array,
} from "@/typeScript/basics";
import UserGui from "@/components/userMinData/UserGui";
import style from './onlineoffline.module.css'
interface propType {
  remain_usr: usr_and_key_in_array[];
  setCurrentUsr: React.Dispatch<
    React.SetStateAction<currentUser_On_Chat | undefined>
  >;
}
const OnlineOffline = ({ remain_usr, setCurrentUsr }: propType) => {
  return (
    <ul className={style.onlineoffline_Ul}>
      {/* this component will map all ony Online Connected users  */}
      <MapUsr
        remain_usr={remain_usr}
        setCurrentUsr={setCurrentUsr}
        onlyOnline
      />

      {/* this component will map all ofline Connected users  */}
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
        const isOnline = isUserOnline(item.user, onLineUsers);

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
          <li key={i}>
            <button onClick={() => setCurrentUsr({ user: item.user })}>
              <UserGui disableProfineNav user={item.user} />
            </button>
          </li>
        );
      })}
    </>
  );
};

export function isUserOnline(user: min_id_of_usr, onLineUsers: onlineUsers[]) {
  const check = onLineUsers?.find((Onusr) => {
    return Onusr.email == user.email;
  });
  return check ? true : false;
}
