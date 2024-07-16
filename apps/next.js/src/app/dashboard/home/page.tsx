import Link from "next/link";
import Container from "../../_components/container";
import Image from "next/image";
import { api } from "@/trpc/server";

const InformationDialog = ({
  info,
}: {
  info: {
    secondHandProduct: number;
    assistanceRequest: number;
    pickupRequest: number;
    newReport: number;
  };
}) => {
  return (
    <section className="flex h-fit min-w-max flex-1 flex-col rounded-2xl bg-white">
      <div className="flex w-full flex-row justify-between px-5 pt-4">
        <p className="text-md font-normal">Comune di Battipaglia</p>
        <Link
          href={"/dashboard/comune"}
          className="text-sm text-background underline"
        >
          Modifica
        </Link>
      </div>
      <section className="flex flex-col gap-4 p-3">
        <div className="flex w-full flex-col items-center rounded-lg border-[1px] border-black/20 bg-white ">
          <p className="pt-2 text-2xl font-bold text-foreground">
            {info.secondHandProduct}
          </p>
          <p className="pb-2">Articoli in vendita</p>
        </div>
        <div className="flex w-full flex-col items-center rounded-lg border-[1px] border-black/20 bg-white ">
          <p className="pt-2 text-2xl font-bold text-foreground">
            {info.assistanceRequest}
          </p>
          <p className="pb-2">Richieste di assistenza</p>
        </div>
        <div className="flex w-full flex-col items-center rounded-lg border-[1px] border-black/20 bg-white ">
          <p className="pt-2 text-2xl font-bold text-foreground">
            {info.pickupRequest}
          </p>
          <p className="pb-2">Richieste di ritiro</p>
        </div>

        <div className="flex w-full flex-col items-center rounded-lg border-[1px] border-black/20 bg-white ">
          <p className="pt-2 text-2xl font-bold text-foreground">
            {info.newReport}
          </p>
          <p className="pb-2">Nuove segnalazioni </p>
        </div>
      </section>
    </section>
  );
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
        src={process.env.NEXT_PUBLIC_WEBSITE_URL + `/icon/${wastetype.icon}`}
        alt="Carta"
        width={25}
        height={25}
      />
      <p className="text-sm text-white">{wastetype.name}</p>
    </div>
  );
};

const DailyCalendarDialog = ({ Calendar }: { Calendar: unknown[] }) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const currentDay = Calendar?.find((day) => day.day === today);

  return (
    <section className="flex h-fit min-w-max flex-1 flex-col rounded-2xl bg-white">
      <div className="flex w-full flex-row justify-between px-5 pt-4">
        <p className="text-md font-normal">Calendario</p>
        <Link
          href={"/dashboard/calendario"}
          className="text-sm text-background underline"
        >
          Gestisci
        </Link>
      </div>
      <section className="mb-10 flex flex-col gap-4 p-3 lg:mb-0">
        <div className="flex flex-col items-center">
          <p className="text-md font-semibold">Utenze domestiche</p>
          <div className="flex w-full flex-col  p-3">
            {currentDay?.wasteTypes
              .filter(({ wasteType }) => wasteType.category === "Citizen")
              .map(({ wasteType }) => (
                <WasteTypeComponent
                  wastetype={{
                    name: wasteType.name,
                    icon: wasteType.icon,
                    color: wasteType.color,
                  }}
                />
              ))}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-md font-semibold">Utenze Commerciali</p>
          <div className="flex w-full flex-col  p-3">
            {currentDay?.wasteTypes
              .filter(
                ({ wasteType }: { wasteType: unknown }) =>
                  wasteType.category === "Commercial",
              )
              .map(({ wasteType }: { wasteType: unknown }) => (
                <WasteTypeComponent
                  wastetype={{
                    name: wasteType.name,
                    icon: wasteType.icon,
                    color: wasteType.color,
                  }}
                />
              ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default async function home() {
  const data = await api.user.getAdminCity.query();
  console.log(data);
  return (
    <Container>
      <section className="flex h-full w-full flex-col gap-4 lg:flex-row">
        <InformationDialog
          info={{
            secondHandProduct: data?.secondHandProduct.length || 0,
            assistanceRequest: data?.SupportRequest.length || 0,
            pickupRequest: data?.pickups.length || 0,
            newReport: data?.reports.length || 0,
          }}
        />

        <DailyCalendarDialog Calendar={data?.calendars || []} />
      </section>
    </Container>
  );
}
