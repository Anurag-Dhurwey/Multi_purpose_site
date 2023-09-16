"use client";
import { Connections } from "@/components";
import ConnectionRequests from "@/components/connectionRequests/ConnectionRequests";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

const Page = () => {

  // connectedUsr=0
  // connecctions-requests=1
  const [viewState, setViewState] = useState<number>(0);
  const { data: session } = useSession();

  if (!session) {
    return null;
  }


  return (
    <section>
      <button onClick={() => setViewState((pre) => (pre == 0 ? 1 : 0))}>
        change
      </button>
      {viewState == 0 ? <Connections /> : <ConnectionRequests />}
    </section>
  );
};

export default Page;
