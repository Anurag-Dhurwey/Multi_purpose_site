import React from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import style from "./titleDesc.module.css";
interface Iprops {
  useStates: {
    cmtView: boolean;
    descView: boolean;
    setCmtView: Function;
    setDescView: Function;
  };
  user: string;
  caption: string|undefined;
  desc: string|undefined;
}
const TitleDesc = ({ useStates, user, caption, desc }: Iprops) => {
  const { cmtView, descView, setCmtView, setDescView } = useStates;
  return (
    <>
      {!cmtView && (
        <div className={`${style.titleDesc} ${descView ? "h-full" : ""} `}>
          <span className={style.titleDescSpan}>
            <button className="h-8 w-8 bg-blue-600 rounded-3xl"></button>
            <h4>{user}</h4>
          </span>
          <h3>{descView ? caption : caption?.slice(0, 30) + "....."}</h3>
          <p className={`text-sm ${descView ? "" : "hidden"}`}>{desc}</p>
          <span className={style.titleDescSpan2}>
            <button
              className={style.titleDescSpan2Button}
              onClick={() => {
                setDescView(!descView);
                setCmtView(false);
              }}
            >
              {descView ? (
                <MdExpandLess className="p-0" />
              ) : (
                <MdExpandMore className="p-0" />
              )}
            </button>
          </span>
        </div>
      )}
    </>
  );
};

export default TitleDesc;
