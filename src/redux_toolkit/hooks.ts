import { TypedUseSelectorHook, useDispatch,useSelector } from "react-redux";
// import { UseSelector,useSelector } from "react-redux/es/hooks/useSelector";

import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
