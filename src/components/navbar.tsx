"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { status } = useSession();
  const [display, setDisplay] = useState<boolean>(true);

  useEffect(() => {
    if (status == "unauthenticated") {
      setDisplay((prev) => !prev);
    }
  }, [status]);

  return (
    <div
      className={`${
        !display ? "flex" : "hidden"
      } bg-[#1A1A1D] justify-end absolute top-4 right-4`}
    >
      <Button variant={"secondary"} onClick={() => signOut()}>
        Logout
      </Button>
    </div>
  );
};

export default Navbar;
