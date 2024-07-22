"use client";

import { useState } from "react";
import { SideNav } from "./SideNav";

export function SideContainer(props: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SideNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      {props.children}
    </SideNav>
  );
}
