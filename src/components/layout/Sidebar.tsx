import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Car,
  Calendar,
  Settings,
  Users,
  Home,
} from "lucide-react";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>

const Sidebar = ({ className }: SidebarProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className={cn("pb-12 bg-sidebar border-r min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                )
              }
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/dashboard/vehicles"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                )
              }
            >
              <Car className="h-4 w-4" />
              <span>My Vehicles</span>
            </NavLink>
            <NavLink
              to="/dashboard/requests"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                )
              }
            >
              <Calendar className="h-4 w-4" />
              <span>Slot Requests</span>
            </NavLink>
            {isAdmin && (
              <>
                <h2 className="mt-6 mb-2 px-2 text-lg font-semibold tracking-tight">
                  Admin
                </h2>
                <NavLink
                  to="/dashboard/manage-slots"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground"
                    )
                  }
                >
                  <Settings className="h-4 w-4" />
                  <span>Manage Slots</span>
                </NavLink>
                <NavLink
                  to="/dashboard/manage-users"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground"
                    )
                  }
                >
                  <Users className="h-4 w-4" />
                  <span>Manage Users</span>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
