
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchVehicles } from "@/store/slices/vehiclesSlice";
import { fetchSlotRequests } from "@/store/slices/slotRequestsSlice";
import { fetchParkingSlots } from "@/store/slices/parkingSlotsSlice";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { vehicles } = useAppSelector((state) => state.vehicles);
  const { slots } = useAppSelector((state) => state.parkingSlots);
  const { requests } = useAppSelector((state) => state.slotRequests);
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalSlots: 0,
    availableSlots: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    dispatch(fetchVehicles({ page: 1, limit: 1000 }));
    dispatch(fetchSlotRequests({ page: 1, limit: 1000 }));
    dispatch(fetchParkingSlots({ page: 1, limit: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    setStats({
      totalVehicles: vehicles.length,
      totalSlots: slots.length,
      availableSlots: slots.filter((slot) => slot.status === "available").length,
      pendingRequests: requests.filter((req) => req.requestStatus === "pending").length,
    });
  }, [vehicles, slots, requests]);

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered vehicles in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requests waiting for approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Parking Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSlots}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total slots in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.availableSlots}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Slots ready for assignment
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to do</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="rounded-lg border bg-card text-card-foreground p-4 hover:bg-muted/50 cursor-pointer">
              <a href="/dashboard/vehicles" className="block">
                <h3 className="font-semibold">Manage Vehicles</h3>
                <p className="text-muted-foreground text-sm">View and add your vehicles</p>
              </a>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground p-4 hover:bg-muted/50 cursor-pointer">
              <a href="/dashboard/requests" className="block">
                <h3 className="font-semibold">Parking Requests</h3>
                <p className="text-muted-foreground text-sm">Request or check status of parking slots</p>
              </a>
            </div>
            {isAdmin && (
              <div className="rounded-lg border bg-card text-card-foreground p-4 hover:bg-muted/50 cursor-pointer">
                <a href="/dashboard/manage-slots" className="block">
                  <h3 className="font-semibold">Parking Slot Management</h3>
                  <p className="text-muted-foreground text-sm">Add and manage parking slots</p>
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Important details about the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">User Role</span>
              <span className="font-medium">{user?.role}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-t">
              <span className="text-muted-foreground">Current Time</span>
              <span className="font-medium">{new Date().toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
