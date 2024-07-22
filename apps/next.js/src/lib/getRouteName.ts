export function getRouteName(route: string) {
  switch (route) {
    case "/dashboard/home":
      return "Dashboard";
    case "/dashboard/comune":
      return "Comune";
    case "/dashboard/seconda-mano":
      return "Seconda Mano";
    case "/dashboard/calendario":
      return "Calendario";
    default:
      return "Dashboard";
  }
}
