import { SideNav } from "../_components/SideNav";
import { SideContainer } from "../_components/sideContainer";
import { Sidebar } from "../_components/sidebar";

export const metadata = {
  title: "Ecoffice Dashboard",
  description: "Ecoffice Dashboard",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-background">
      <main className="hidden h-screen md:hidden lg:flex">
        <section className="w-[20%]">
          <Sidebar />
        </section>
        <section className="h-screen w-[80%]">{children}</section>
      </main>

      <main className="h-full w-full md:flex lg:hidden">
        <SideContainer>{children}</SideContainer>
      </main>
    </div>
  );
}
