export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen overflow-scroll md:w-screen lg:w-full lg:overflow-auto lg:p-4">
      <section className="h-full bg-slate-100 p-3 lg:rounded-2xl">
        {children}
      </section>
    </main>
  );
}
