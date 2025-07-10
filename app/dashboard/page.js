"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  LayoutDashboard,
  Pencil,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import ApplicationModal from "@/components/modals/application-modal";
import { format, set } from "date-fns";
import AddApplicationModal from "@/components/modals/add-application";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StatsCard from "./components/StatsCard";
import { createUser, getUserApplications } from "@/actions/user";
import { useServerAction } from "@/hooks/useServerAction";
import {
  createApplication,
  deleteApplication,
  editApplication,
  getApplicationsByFilter,
} from "@/actions/application";
import BounceLoader from "react-spinners/BounceLoader";
import { ShimmerThumbnail } from "react-shimmer-effects";
import FilterModal from "@/components/modals/filter-modal";
import EditModal from "@/components/modals/edit-modal";

export default function Dashboard() {
  // State for Add Application modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [editApp, setEditApp] = useState(null);
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    status: { Interview: 0, Offer: 0 },
    upcoming: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    jobType: "",
  });

  const { call: createUserFn, loading: createUserLoading } =
    useServerAction(createUser);

  const { call: fetchApplicationsFn, loading: fetchApplicationsLoading } =
    useServerAction(getUserApplications);

  const { call: deleteApplicationFn, loading: deleteApplicationLoading } =
    useServerAction(deleteApplication);

  const { call: createApplicationFn, loading: createApplicationLoading } =
    useServerAction(createApplication);

  const { call: filterApplicationsFn, loading: filterApplicationsLoading } =
    useServerAction(getApplicationsByFilter);

  const { call: editApplicationFn, loading: editApplicationLoading } =
    useServerAction(editApplication);

  // Fetch user applications and create user on initial load
  useEffect(() => {
    async function fetchData() {
      await createUserFn();
      const data = await fetchApplicationsFn();
      console.log("Fetched applications:", data);
      setAllApplications(data?.applications || []);
      setApplications(data?.applications || []);
    }
    fetchData();
  }, []);

  //   update stats whenever applications change
  useEffect(() => {
    if (applications.length !== 0) {
      setStatsLoading(true);

      const status = {
        Interview: 0,
        Offer: 0,
      };
      applications.forEach((app) => {
        if (app.status === "Interview") {
          status.Interview += 1;
        } else if (app.status === "Offer") {
          status.Offer += 1;
        }
      });

      setStats({
        total: applications.length || 0,
        status: status,
        upcoming: applications.filter(
          (app) => new Date(app.deadline) > new Date()
        ).length,
      });
      setStatsLoading(false);
    } else {
      setStats({
        total: 0,
        status: { Interview: 0, Offer: 0 },
        upcoming: 0,
      });
    }
  }, [allApplications]);

  // Handle delete application
  const handleDeleteApplication = async (appId) => {
    const result = await deleteApplicationFn(appId);
    if (result?.success) {
      setAllApplications((prev) => prev.filter((app) => app.id !== appId));
      setApplications((prev) => prev.filter((app) => app.id !== appId));
      setSelectedApp(null);
    }
  };

  // Handle form submission for adding a new application
  const handleFormSubmit = async (data) => {
    const result = await createApplicationFn(data);
    if (result?.success) {
      setAllApplications((prev) => [...prev, result.application]);
      setApplications((prev) => [...prev, result.application]);
    }
  };

  // Handle filter submission
  const handleFilterSubmit = async (filters) => {
    setFilters(filters);
    const result = await filterApplicationsFn(filters);
    if (result?.success) {
      setAllApplications(result.applications);
      setApplications(result.applications);
    }
  };

  // Handle edit application submission
  const handleEditSubmit = async (appId, data) => {
    const result = await editApplicationFn(appId, data);
    if (result?.success) {
      setAllApplications((prev) =>
        prev.map((app) => (app.id === appId ? result.application : app))
      );
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? result.application : app))
      );
      setEditApp(null);
    }
  };

  //   search applications based on company or role
  useEffect(() => {
    if (!search) {
      setApplications(allApplications);
    } else {
      const searchedApps = allApplications.filter(
        (app) =>
          app.company.toLowerCase().includes(search.toLowerCase()) ||
          app.role.toLowerCase().includes(search.toLowerCase())
      );
      setApplications(searchedApps);
    }
  }, [search]);

  return createUserLoading ||
    fetchApplicationsLoading ||
    createApplicationLoading ||
    deleteApplicationLoading ||
    filterApplicationsLoading ||
    editApplicationLoading ? (
    <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] w-full">
      <BounceLoader color="#a9afff" size={120} />
    </div>
  ) : (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl pl-1.5 font-bold flex items-center gap-2">
          <LayoutDashboard className="-mb-1" />
          Dashboard
        </h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </Button>
      </div>
      {/* Stats Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ShimmerThumbnail height={250} rounded />
          <ShimmerThumbnail height={250} rounded />
          <ShimmerThumbnail height={250} rounded />
          <ShimmerThumbnail height={250} rounded />
        </div>
      ) : (
        <StatsCard stats={stats} />
      )}

      {/* Applications Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center mb-2">
            <CardTitle className="text-xl">Applications</CardTitle>
            <div className="flex mx-auto w-[50%] gap-2">
              <Input
                placeholder="Search applications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={() => setIsFilterModalOpen(true)}
              className={"cursor-pointer"}
            >
              <SlidersHorizontal />
              <span>Filter</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent text-[1rem]">
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} className="hover:bg-transparent">
                  <TableCell className="font-medium">{app.company}</TableCell>
                  <TableCell>{app.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        app.status === "Interview"
                          ? "success"
                          : app.status === "Offer"
                          ? "secondary"
                          : app.status === "Rejected"
                          ? "destructive"
                          : app.status === "Ghosted"
                          ? "outline"
                          : "default" // Applied
                      }
                    >
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(app.appliedDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{app.location || "-"}</TableCell>
                  <TableCell className="text-right flex justify-end gap-1.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedApp(app)}
                          className={"cursor-pointer"}
                        >
                          <Eye />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Application</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditApp(app)}
                          className={"cursor-pointer"}
                        >
                          <Pencil />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Application</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Application Modal */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <ApplicationModal
          app={selectedApp}
          deleteFn={handleDeleteApplication}
          onOpenChange={() => setSelectedApp(null)}
          loading={deleteApplicationLoading}
        />
      </Dialog>

      {/* Add Application Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <AddApplicationModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSubmit={(data) => handleFormSubmit(data)}
          loading={createApplicationLoading}
        />
      </Dialog>

      {/* Filter Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <FilterModal
          open={isFilterModalOpen}
          onOpenChange={setIsFilterModalOpen}
          onSubmit={handleFilterSubmit}
          filters={filters}
          setFilters={setFilters}
          loading={filterApplicationsLoading}
        />
      </Dialog>

      <Dialog open={!!editApp} onOpenChange={() => setEditApp(null)}>
        <EditModal
          app={editApp}
          onOpenChange={() => setEditApp(null)}
          onSubmit={(appId, data) => handleEditSubmit(appId, data)}
          loading={editApplicationLoading}
        />
      </Dialog>
    </div>
  );
}
