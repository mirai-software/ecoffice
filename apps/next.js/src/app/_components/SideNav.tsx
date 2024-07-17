"use client";

import { Fragment } from "react";
import Logo from "@/../public/icon/ecoffice.png";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button, Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getRouteName } from "@/lib/getRouteName";

export const navigation = [
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

export function SideNav(props: {
  children: React.ReactNode;
  topBar?: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="h-full">
        <Transition.Root show={props.sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={props.setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => props.setSidebarOpen(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="white"
                          className="h-8 w-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </Transition.Child>

                  <Sidebar isMobile setSidebarOpen={props.setSidebarOpen} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="2xl:w-72 hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
          <Sidebar isMobile={false} setSidebarOpen={props.setSidebarOpen} />
        </div>

        <main className="2xl:pl-72 flex h-full w-full flex-col lg:pl-60">
          <div className="flex h-14 w-screen items-center justify-around border-b-2 bg-white ">
            <p className="flex-1 pl-2 text-xl font-semibold">
              {getRouteName(pathname)}
            </p>

            <div className="flex flex-1 justify-end pr-4">
              <button
                type="button"
                className=""
                onClick={() => props.setSidebarOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          {props.children}
        </main>
      </div>
    </>
  );
}

function Sidebar(props: {
  isMobile: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const router = useRouter();

  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  return (
    <div
      className={clsx(
        "flex grow flex-col items-start gap-y-5 overflow-y-auto bg-foreground/90 px-6 pb-4",
        {
          "ring-1 ring-white/10": props.isMobile,
        },
      )}
    >
      <nav className="flex flex-1 items-center">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <Image src={Logo} alt="Rosy Landi" width={70} height={70} />
          <li>
            <ul role="list" className="-mx-2 space-y-3">
              {navigation.map((item) => (
                <li key={item.name} className="w-full ">
                  <button
                    onClick={() => {
                      props.setSidebarOpen(false);

                      router.push(item.route);
                    }}
                    className={cn(
                      "group flex gap-x-3 rounded-md p-2 text-lg font-normal leading-6 text-white hover:bg-white hover:text-foreground",
                    )}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
      <div className="mt-auto pb-6 text-left">
        <Button onClick={handleSignOut} className="text-white hover:underline">
          Log Out
        </Button>
      </div>
    </div>
  );
}
