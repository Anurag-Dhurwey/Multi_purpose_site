"use client";
import { useSession } from "next-auth/react";
import { Chat } from "@/components";
const Page = () => {
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

export default Page;
