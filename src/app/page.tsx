"use client";
import { useEffect } from "react";
import { Home } from "@/components";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux_toolkit/hooks";
import { socketIoConnection } from "@/utilities/socketIo";
import { message } from "antd";

export default function Assemble() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const admin = useAppSelector((state) => state.hooks.admin);

  function withUseEffect() {
    if (session) {
      socketIoConnection({
        session,
        dispatch,
        admin,
        message: message,
      });
    }
  }

  useEffect(() => {
    withUseEffect();
  }, [session]);

  return (
    <>
      <Home />
    </>
  );
}
