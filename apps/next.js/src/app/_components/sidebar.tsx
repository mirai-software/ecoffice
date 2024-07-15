"use client";

import Logo from "@/../public/icon/ecoffice.png";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, usePathname } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@headlessui/react";
const SidebarRoute = [
  {
    name: "Dashboard",
    slug: "dashboard",
    route: "/dashboard/home",
    info: null,
  },
  {
    name: "Comune",
    slug: "comune",
    route: "/dashboard/comune",
    info: null,
  },
  {
    name: "Seconda Mano",
    slug: "seconda-mano",
    route: "/seconda-mano",
    info: null,
  },
  {
    name: "Calendario",
    slug: "calendario",
    route: "/calendario",
    info: null,
  },
  {
    name: "Ritiri",
    slug: "ritiri",
    route: "/ritiri",
    info: 3,
  },
  {
    name: "Segnalazioni",
    slug: "segnalazioni",
    route: "/segnalazioni",
    info: 4,
  },
  {
    name: "Assistenza",
    slug: "assistenza",
    route: "/assistenza",
    info: 2,
  },
];

export function Sidebar() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <section className="flex h-screen w-full flex-col bg-background p-4 text-white">
      <div className="mb-4 mt-6 flex justify-start">
        <Image src={Logo} alt="logo" width={100} height={100} />
      </div>
      <ul className="space-y-2">
        {SidebarRoute.map((route) => (
          <li
            key={route.slug}
            className={`w-full rounded-lg p-2 hover:bg-white hover:text-background ${pathname === route.route ? "bg-white text-background" : ""}`}
          >
            <Link href={route.route} className="w-full" aria-current="page">
              {route.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto px-2 pb-6 text-left">
        <Button onClick={handleSignOut} className="hover:underline">
          Log Out
        </Button>
      </div>
    </section>
  );
}
