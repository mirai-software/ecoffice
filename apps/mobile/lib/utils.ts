import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTitle(route: { name: string }) {
  switch (route.name) {
    case "home":
      return "Ecooffice";
    case "create-report":
      return "Segnalazione";
    case "create-request":
      return "Ritiro a Domicilio";
    case "shop":
      return "Seconda Mano";
    case "[slug]":
      return "Seconda Mano";

    case "calendar":
      return "Calendario";

    case "orari":
      return "Orari Comune";

    case "[info]":
      return "Info";

    case "profile-home":
      return "Profilo";

    case "profile":
      return "Il mio Profilo";

    case "profile-edit":
      return "Modifica Profilo";

    case "reports":
      return "Segnalazioni Effettuate";

    case "repid":
      return "Segnalazioni Effettuate";

    case "reqid":
      return "Ritiri richiesti";

    case "requests":
      return "Ritiri richiesti";

    case "assistance":
      return "Assistenza";

    default:
      return route.name;
  }
}

export function canGoBack(route: string): boolean {
  if (
    route == "home" ||
    route == "profile-home" ||
    route == "shop" ||
    route == "calendar"
  ) {
    return false;
  }

  return true;
}
