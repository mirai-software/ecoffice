export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen md:w-screen lg:w-full lg:p-4">
      <section className="h-full bg-white lg:rounded-2xl">{children}</section>
    </main>
  );
}
