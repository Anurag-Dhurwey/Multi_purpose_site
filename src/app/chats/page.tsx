"use client";
import { useSession } from "next-auth/react";
import { Chat } from "@/components";
const page = () => {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }


  return (
    <section>
      <Chat />
    </section>
  );
};

export default page;
