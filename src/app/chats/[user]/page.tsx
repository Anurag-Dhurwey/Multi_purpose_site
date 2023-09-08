"use client";

import UserChatBox from "@/components/chat/UserChatBox";
import { useSession } from "next-auth/react";

export default function Page({ params }: { params: { user: string } }) {
  const { data: session } = useSession();
  if (!session) {
    return null;
  }

  const parsedObject: { _id: string; email: string; name: string } = params.user
    ? JSON.parse(decodeURIComponent(params.user))
    : null;

  return (
    <section>
      <UserChatBox parsedObject={parsedObject} />
    </section>
  );
}
