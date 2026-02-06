import { Home, Search, ShoppingBag, Plane, LogIn } from "lucide-react";

export const NAV_ITEMS = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: Home,
    },
    {
        label: "Explorer",
        href: "/explorer",
        icon: Search,
    },
    {
        label: "Lost & Found",
        href: "/lostfound",
        icon: Search, // Maybe use a different icon? Search is fine for now or maybe AlertCircle? 
        // User used Search in the page header. Let's stick to consistent icons if possible.
        // But Explorer uses Search too.
        // Let's use Search for Explorer and maybe HelpCircle or Archive per sidebar?
        // Sidebar.tsx used: LayoutDashboard (Dashboard), Map (Explorer), Search (Lost), ShoppingBag (Market), Plane (Trips).
    },
    {
        label: "Marketplace",
        href: "/marketplace",
        icon: ShoppingBag,
    },
    {
        label: "Trips",
        href: "/trips",
        icon: Plane,
    },
] as const;
