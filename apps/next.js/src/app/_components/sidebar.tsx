export function Sidebar() {
  return (
    <div className="flex h-screen w-full flex-col bg-blue-900 p-4 text-white">
      <div className="mb-6 flex justify-center">
        <img src="/path/to/logo.png" alt="Logo" className="h-12" />
      </div>
      <ul className="space-y-4">
        <li>
          <a
            href="/dashboard"
            className="flex items-center justify-between hover:underline"
          >
            Dashboard
          </a>
        </li>
        <li>
          <a
            href="/comune"
            className="flex items-center justify-between hover:underline"
          >
            Comune
          </a>
        </li>
        <li>
          <a
            href="/seconda-mano"
            className="flex items-center justify-between hover:underline"
          >
            Seconda Mano
          </a>
        </li>
        <li>
          <a
            href="/calendario"
            className="flex items-center justify-between hover:underline"
          >
            Calendario
          </a>
        </li>
        <li>
          <a
            href="/ritiri"
            className="flex items-center justify-between hover:underline"
          >
            Ritiri{" "}
            <span className="rounded-full bg-red-500 px-2 py-1 text-xs">3</span>
          </a>
        </li>
        <li>
          <a
            href="/segnalazioni"
            className="flex items-center justify-between hover:underline"
          >
            Segnalazioni{" "}
            <span className="rounded-full bg-red-500 px-2 py-1 text-xs">4</span>
          </a>
        </li>
        <li>
          <a
            href="/assistenza"
            className="flex items-center justify-between hover:underline"
          >
            Assistenza{" "}
            <span className="rounded-full bg-red-500 px-2 py-1 text-xs">2</span>
          </a>
        </li>
      </ul>
      <div className="mt-auto text-center">
        <a href="/logout" className="hover:underline">
          Log Out
        </a>
      </div>
    </div>
  );
}
