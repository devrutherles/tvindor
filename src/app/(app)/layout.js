"use client";

import { useAuth } from "@/hooks/auth";
import Navigation from "@/app/(app)/Navigation";
import Loading from "@/app/(app)/Loading";
import Sidebar from "@/components/SideBar";
import ProgressProvider from "../../hooks/Fd";
import FeedBack from "../../components/FeedBack";
import SidePod from "../../components/QrCode";
import { useEffect, useState } from "react";

const AppLayout = ({ children, header }) => {
  const { user } = useAuth({ middleware: "auth" });
  const [open, setOpen] = useState(false);

  if (!user) {
    return <Loading />;
  }
  return (
    <ProgressProvider>
      <div className="min-h-screen">
        <Sidebar
          isOpen={open}
          setIsOpen={setOpen}
          children={children}
          user={user}
        ></Sidebar>
        <FeedBack />
        <SidePod isOpen={open} setIsOpen={setOpen} />
      </div>
    </ProgressProvider>
  );
};

export default AppLayout;
