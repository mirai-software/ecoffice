"use client";

import Container from "../../_components/container";
import Image from "next/image";
import { api } from "@/trpc/react";
import { EditCalendarModal } from "./modals/EditCalendarModal";
import { EditCalendarComModal } from "./modals/EditCalendarComModal";
import LoadingComponent from "@/app/_components/loading";
import { getBaseUrl } from "@/trpc/shared";

const getDayItalian = (day: string) => {
  switch (day) {
    case "Monday":
      return "Lunedì";
    case "Tuesday":
      return "Martedì";
    case "Wednesday":
      return "Mercoledì";
    case "Thursday":
      return "Giovedì";
    case "Friday":
      return "Venerdì";
    case "Saturday":
      return "Sabato";
    case "Sunday":
      return "Domenica";
    default:
      return "Errore";
  }
};

const WasteTypeComponent = ({
  wastetype,
}: {
  wastetype: {
    name: string;
    icon: string;
    color: string;
  };
}) => {
  return (
    <div
      className={`flex min-h-10 w-full items-center gap-2 pl-2`}
      style={{
        backgroundColor: wastetype.color,
      }}
    >
      <Image
        src={getBaseUrl() + `/icon/${wastetype.icon}`}
        alt={wastetype.name}
        width={25}
        height={25}
      />
      <p className="text-sm text-white">{wastetype.name}</p>
    </div>
  );
};

const CalendarSorter = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface Calendartype {
  day: string;
  wasteTypes: {
    wasteType: {
      name: string;
      icon: string;
      color: string;
      category: string;
    };
  }[];
}

const DailyCalendarDialogDomestic = ({
  Calendar,
}: {
  Calendar: Calendartype[];
}) => {
  Calendar = Calendar.sort((a, b) =>
    CalendarSorter.indexOf(a.day) > CalendarSorter.indexOf(b.day) ? 1 : -1,
  );
  return (
    <section className="flex h-fit min-w-max flex-1 flex-col rounded-2xl bg-white">
      <div className="flex w-full flex-row justify-between px-5 pt-4">
        <p className="text-md font-normal">Utenze Domestiche</p>
        <EditCalendarModal />
      </div>
      <section className="mb-10 flex flex-col gap-4 p-3 lg:mb-0">
        <div className="flex flex-col items-center">
          <p className="text-md text-gray-400">
            Orario di ritiro: 18:00 - 24:00
          </p>
          <div className="flex w-full flex-col gap-2 p-3">
            {Calendar.map((day) => {
              return (
                <section className="flex w-full flex-1 flex-row items-center gap-4">
                  <p className="flex w-[20%] ">{getDayItalian(day.day)}</p>
                  <section className="flex flex-1 flex-col">
                    {day.wasteTypes
                      .filter(
                        ({ wasteType }) => wasteType.category === "Citizen",
                      )
                      .map(({ wasteType }) => (
                        <WasteTypeComponent
                          wastetype={{
                            name: wasteType.name,
                            icon: wasteType.icon,
                            color: wasteType.color,
                          }}
                        />
                      ))}
                  </section>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
};

const DailyCalendarDialogCommercial = ({
  Calendar,
}: {
  Calendar: Calendartype[];
}) => {
  Calendar = Calendar.sort((a, b) =>
    CalendarSorter.indexOf(a.day) > CalendarSorter.indexOf(b.day) ? 1 : -1,
  );

  return (
    <section className="flex h-fit min-w-max flex-1 flex-col rounded-2xl bg-white">
      <div className="flex w-full flex-row justify-between px-5 pt-4">
        <p className="text-md font-normal">Utenze Commerciali</p>
        <EditCalendarComModal />
      </div>
      <section className="mb-10 flex flex-col gap-4 p-3 lg:mb-0">
        <div className="flex flex-col items-center">
          <p className="text-md text-gray-400">
            Orario di ritiro : 18:00 - 24:00
          </p>
          <div className="flex w-full flex-col gap-2 p-3">
            {Calendar.map((day) => {
              return (
                <section className="flex w-full flex-1 flex-row items-center gap-4">
                  <p className="flex w-[20%] ">{getDayItalian(day.day)}</p>
                  <section className="flex flex-1 flex-col">
                    {day.wasteTypes
                      .filter(
                        ({ wasteType }) => wasteType.category === "Commercial",
                      )
                      .map(({ wasteType }) => (
                        <WasteTypeComponent
                          wastetype={{
                            name: wasteType.name,
                            icon: wasteType.icon,
                            color: wasteType.color,
                          }}
                        />
                      ))}
                  </section>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
};

export default function home() {
  const { data, isLoading } = api.user.getAdminCity.useQuery();

  if (isLoading) {
    return (
      <Container>
        <LoadingComponent />
      </Container>
    );
  }
  return (
    <Container>
      <section className="flex h-full w-full flex-col gap-4 lg:flex-row">
        <DailyCalendarDialogDomestic Calendar={data?.calendars || []} />
        <DailyCalendarDialogCommercial Calendar={data?.calendars || []} />
      </section>
    </Container>
  );
}
