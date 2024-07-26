"use client";
import { api } from "@/trpc/react";
import Container from "../../_components/container";
import { useState } from "react";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HoursModal } from "./modals/HoursModal";
import { StatisticModal } from "./modals/StatisticModal";
import { ContactModal } from "./modals/ContactModal";
import { WasteTypeModal } from "./modals/WasteTypeModal";
import { MemberModal } from "./modals/MemberModal";
import LoadingComponent from "@/app/_components/loading";
import { getBaseUrl } from "@/trpc/shared";

const CitySelector = ({
  citys,
  userData,
  utils,
}: {
  citys: { label: string; value: string }[];
  userData: { city: { name: string } };
  utils: {
    invalidate: () => void;
  };
}) => {
  const setAdminCity = api.admin.setAdminCity.useMutation();

  return (
    <section className="flex h-fit max-h-28 min-w-max flex-1 flex-col rounded-2xl bg-white">
      <div className="flex w-full flex-row justify-between px-5 pt-4">
        <p className="text-sm font-normal text-gray-500">Comune Selezionato</p>
      </div>
      <section className="flex flex-col gap-4 p-3">
        <Select
          onValueChange={(e) => {
            try {
              setAdminCity.mutate({ city: e });
            } catch (error) {
              console.error(error);
            }
            // Give time to the mutation to update the user
            setTimeout(() => {
              utils.invalidate();
            }, 1000);
          }}
        >
          <SelectTrigger className="w-full bg-slate-100">
            <SelectValue placeholder={userData.city?.name} />
          </SelectTrigger>
          <SelectContent>
            {citys?.map((city) => (
              <SelectItem key={city.value} value={city.value}>
                {city.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>
    </section>
  );
};

const CityHours = ({
  cityHours,
}: {
  cityHours: {
    id: string;
    day: string;
    isOpen: boolean;
    openTime1: string;
    closeTime1: string;
    openTime2: string | null;
    closeTime2: string | null;
    cityId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) => {
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

  if (!cityHours || cityHours.length === 0) {
    return (
      <section className="flex h-fit min-w-max flex-1 flex-col rounded-2xl bg-white p-4">
        <div className="flex w-full flex-row justify-between ">
          <p className="text-lg font-semibold text-black">Orari</p>
          <HoursModal />
        </div>
        <section className="flex flex-col gap-3"></section>
        <div className="mt-3 flex w-full flex-1 items-center justify-center ">
          <p className="text-center font-normal text-gray-600">
            Nessun Orario Presente
          </p>
        </div>
      </section>
    );
  } else
    return (
      <section className="flex h-fit min-w-max flex-1 flex-col rounded-2xl bg-white p-4">
        <div className="flex w-full flex-row justify-between ">
          <p className="text-lg font-semibold text-black">Orari</p>
          <HoursModal />
        </div>
        <section className="flex flex-col gap-3">
          {cityHours &&
            cityHours.map((orario) => (
              <div
                className="flex flex-row items-center justify-between "
                key={orario.id}
              >
                <p className="text-base font-normal">
                  {getDayItalian(orario.day)}
                </p>
                <div className="flex flex-col items-end">
                  {orario.openTime1 && orario.closeTime1 && orario.isOpen ? (
                    <div className="flex flex-row gap-2">
                      <p className="text-base font-normal">
                        {orario.openTime1}
                      </p>
                      <p className="text-base font-normal">-</p>
                      <p className="text-base font-normal">
                        {orario.closeTime1}
                      </p>
                    </div>
                  ) : (
                    <p className="text-base font-normal">Chiuso</p>
                  )}
                  {orario.openTime2 && orario.closeTime2 && orario.isOpen ? (
                    <div className="flex flex-row gap-2">
                      <p className="text-base font-normal">
                        {orario.openTime2}
                      </p>
                      <p className="text-base font-normal">-</p>
                      <p className="text-base font-normal">
                        {orario.closeTime2}
                      </p>
                    </div>
                  ) : (
                    <p className="text-base font-normal">Chiuso</p>
                  )}
                </div>
              </div>
            ))}
        </section>
      </section>
    );
};

enum StatisticType {
  ProductionIndicator = "ProductionIndicator",
  SpecificIndicator = "SpecificIndicator",
}

const StatisticsComponent = ({
  statistics,
}: {
  statistics: {
    id: string;
    name: string;
    data: string;
    type: string;
    cityId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) => {
  const [selected, setSelected] = useState<StatisticType>(
    StatisticType.ProductionIndicator,
  );

  if (!statistics || statistics.length === 0) {
    return (
      <div className="mt-3 flex w-full flex-1 items-center justify-center ">
        <p className="text-center font-normal text-gray-600">
          Nessuna Statistica Presente
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex-1">
      <div className="mt-4 flex w-full flex-row items-center justify-between rounded-3xl border-2 border-gray-300">
        <button
          onClick={() => setSelected(StatisticType.ProductionIndicator)}
          className="w-[50%]"
        >
          <div
            className={
              selected === StatisticType.ProductionIndicator
                ? "w-full flex-1 rounded-3xl bg-[#334493] p-2"
                : "w-full flex-1 rounded-3xl p-2 text-secondary"
            }
          >
            <p
              className={
                selected === StatisticType.ProductionIndicator
                  ? "text-md text-center text-white"
                  : "text-md text-center text-black"
              }
            >
              Indicatori di Produzione
            </p>
          </div>
        </button>
        <button
          onClick={() => setSelected(StatisticType.SpecificIndicator)}
          className="w-[50%]"
        >
          <div
            className={
              selected === StatisticType.SpecificIndicator
                ? "w-full flex-1 rounded-3xl bg-[#334493] p-2"
                : "w-full flex-1 rounded-3xl p-2 text-secondary"
            }
          >
            <p
              className={
                selected === StatisticType.SpecificIndicator
                  ? "text-md text-center text-white"
                  : "text-md text-center text-black"
              }
            >
              Indicatori Specifici
            </p>
          </div>
        </button>
      </div>

      <div className="mt-4 flex w-full flex-col gap-2">
        {statistics.map((statistic) => {
          if (statistic.type === selected) {
            return (
              <div
                key={statistic.id}
                className="flex w-full flex-row items-center justify-between border-b-2 border-gray-300 p-1"
              >
                <p className="text-md uppercase text-gray-500">
                  {statistic.name}
                </p>
                <p className="text-md font-medium text-black">
                  {statistic.data}
                </p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

const CityIndicator = ({
  cityIndicator,
}: {
  cityIndicator: {
    id: string;
    name: string;
    data: string;
    type: string;
    cityId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) => {
  return (
    <section className="flex h-fit min-w-max flex-1 flex-col rounded-2xl bg-white">
      <div className="flex w-full flex-row justify-between px-5 pt-4">
        <p className="text-lg font-semibold text-black">Indicatori</p>
        <StatisticModal />
      </div>
      <section className="flex h-full flex-col gap-4  p-3">
        <StatisticsComponent statistics={cityIndicator} />
      </section>
    </section>
  );
};

const UserContact = ({
  whatsapp,
  email,
}: {
  whatsapp: string | null | undefined;
  email: string | null | undefined;
}) => {
  return (
    <section className="flex h-fit min-w-max flex-col rounded-2xl bg-white">
      <div className="flex w-full flex-row justify-between px-5 pt-4">
        <p className="text-lg font-semibold text-black">Contatti</p>
        <ContactModal />
      </div>
      <section className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-normal text-gray-500">Email</label>
          <input
            type="email"
            className={
              "w-full rounded-xl border border-gray-300 p-2 dark:bg-white " +
              (!email ? "text-gray-400" : "")
            }
            value={email ?? "Ancora non definito..."}
            readOnly
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-normal text-gray-500">
            Numero di whatsapp
          </label>
          <div className="flex flex-row gap-2">
            <div className="flex items-center justify-center rounded-xl border border-gray-300 p-2">
              <span role="img" aria-label="Italy flag">
                🇮🇹
              </span>
              <span className="ml-2">+39</span>
            </div>
            <input
              type="text"
              className={
                "w-full rounded-xl border border-gray-300 p-2 dark:bg-white " +
                (!whatsapp ? "text-gray-400" : "")
              }
              value={whatsapp ?? "Ancora non definito..."}
              readOnly
            />
          </div>
        </div>
      </section>
    </section>
  );
};

const WasteTypeSection = ({
  wasteTypes,
}: {
  wasteTypes: {
    id: string;
    name: string;
    color: string;
    category: string;
    info: string[];
    icon: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) => {
  if (!wasteTypes || wasteTypes.length === 0) {
    return (
      <section className="flex h-fit min-w-max flex-1 flex-col rounded-2xl bg-white p-4">
        <div className="flex w-full flex-row justify-between ">
          <p className="text-lg font-semibold text-black">Gestione Rifiuti</p>
          <a href="#" className="text-sm text-foreground underline">
            Modifica
          </a>
        </div>
        <section className="flex flex-col gap-3"></section>
        <div className="mt-3 flex w-full flex-1 items-center justify-center ">
          <p className="text-center font-normal text-gray-600">
            Nessun Rifiuto Presente
          </p>
        </div>
      </section>
    );
  } else
    return (
      <section className="flex h-fit flex-col rounded-2xl bg-white">
        <div className="flex w-full flex-row justify-between px-5 pt-4">
          <p className="text-lg font-semibold text-black">Gestione rifiuti</p>
          <WasteTypeModal />
        </div>
        <section className="grid grid-cols-3 gap-4 p-5 lg:grid-cols-4">
          {wasteTypes.map((wasteType) => (
            <div key={wasteType.id} className="flex flex-col items-center">
              <div
                className="flex items-center justify-center rounded-full p-3"
                style={{ backgroundColor: wasteType.color }}
              >
                <Image
                  src={getBaseUrl() + `/icon/${wasteType.icon}`}
                  width={20}
                  height={20}
                  alt={wasteType.name}
                  className="h-6 w-6"
                />
              </div>
              <p
                className="mt-2 text-center text-sm font-normal"
                style={{
                  color: wasteType.color,
                }}
              >
                {wasteType.name}
              </p>
            </div>
          ))}
        </section>
      </section>
    );
};

const MemberSection = ({
  adminUsers,
}: {
  adminUsers: {
    id: string;
    email: string;
    phone: string | null;
    role: string;
    firstName: string | null;
    lastName: string | null;
    cityId: string | null;
    address: string | null;
    SignInCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) => {
  const getInitials = (firstName: string | null, lastName: string | null) => {
    if (!firstName && !lastName) return "";
    const firstInitial = firstName ? firstName.charAt(0) : "";
    const lastInitial = lastName ? lastName.charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  if (!adminUsers || adminUsers.length === 0) {
    return (
      <section className="flex h-fit min-w-max flex-1 flex-col rounded-2xl bg-white p-4">
        <div className="flex w-full flex-row justify-between ">
          <p className="text-lg font-semibold text-black">Gestione Membri</p>
          <MemberModal />
        </div>
        <section className="flex flex-col gap-3"></section>
        <div className="mt-3 flex w-full flex-1 items-center justify-center ">
          <p className="text-center font-normal text-gray-600">
            Nessun Membro Presente
          </p>
        </div>
      </section>
    );
  } else
    return (
      <section className="flex h-fit min-w-max flex-col rounded-2xl bg-white">
        <div className="flex w-full flex-row justify-between px-5 pt-4">
          <p className="text-lg font-semibold text-black">Gestione Membri</p>
          <MemberModal />
        </div>
        <section className="flex flex-col gap-4 p-5">
          <div className="grid grid-cols-2 gap-4">
            {adminUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-white">
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <div>
                  <p className="text-base font-medium text-black">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {capitalizeFirstLetter(user.role)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    );
};

export default function Comune() {
  const { data: citys, isLoading: citysLoading } = api.city.getAllcity.useQuery(
    {},
  );

  const { data: wasteTypes, isLoading: wasteTypesLoading } =
    api.admin.getWasteTypes.useQuery();
  const { data: user, isLoading: userLoading } = api.user.getUser.useQuery({});
  const { data: adminUsers, isLoading: adminUsersLoading } =
    api.admin.getAdminUsers.useQuery();
  const { data: cityIndicator, isLoading: cityIndicatorLoading } =
    api.city.getCityStatistics.useQuery();

  const utils = api.useUtils();

  if (
    citysLoading ||
    userLoading ||
    cityIndicatorLoading ||
    wasteTypesLoading ||
    adminUsersLoading ||
    !adminUsers ||
    !wasteTypes ||
    !cityIndicator ||
    !citys ||
    !user
  ) {
    return (
      <Container>
        <LoadingComponent />
      </Container>
    );
  } else
    return (
      <Container>
        <section className="flex w-full flex-col gap-4 lg:flex-row">
          <section className="flex w-full flex-col gap-4">
            <CitySelector
              citys={citys}
              userData={{ city: { name: user.city?.name || "" } }}
              utils={utils}
            />
            <CityHours cityHours={user.city?.openingHours || []} />
            <CityIndicator cityIndicator={cityIndicator} />
          </section>
          <section className="flex w-full flex-col gap-4">
            <UserContact
              whatsapp={user.city?.whatsappNumber}
              email={user.city?.email}
            />
            <WasteTypeSection wasteTypes={wasteTypes} />
            <MemberSection adminUsers={adminUsers} />
          </section>
        </section>
      </Container>
    );
}
