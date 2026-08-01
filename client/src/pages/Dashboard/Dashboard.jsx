import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import dashboardService from "@/services/dashboard/dashboardService";

import StatsCard from "@/components/dashboard/StatsCard";
import ProjectOverviewToolbar from "@/components/dashboard/ProjectOverviewToolbar";
import ProjectOverviewTable from "@/components/dashboard/ProjectOverviewTable";

const Dashboard = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    featured: "",
    sort: "newest",
    page: 1,
  });

  const {
    data: statsResponse,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardService.getStats,
  });

  const {
    data: overviewResponse,
    isLoading: overviewLoading,
    isError: overviewError,
  } = useQuery({
    queryKey: ["project-overview", filters],
    queryFn: () =>
      dashboardService.getProjectOverview(filters),
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleReset = () => {
    setFilters({
      search: "",
      status: "",
      featured: "",
      sort: "newest",
      page: 1,
    });
  };

  if (statsLoading) {
    return <h2>Loading dashboard...</h2>;
  }

  if (statsError) {
    return <h2>Failed to load dashboard.</h2>;
  }

  const stats = statsResponse.data;

  const projects =
    overviewResponse?.data?.items ?? [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
        />

        <StatsCard
          title="Published"
          value={stats.publishedProjects}
        />

        <StatsCard
          title="Draft"
          value={stats.draftProjects}
        />

        <StatsCard
          title="Featured"
          value={stats.featuredProjects}
        />
      </div>

      <ProjectOverviewToolbar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      <ProjectOverviewTable
        projects={projects}
        isLoading={overviewLoading}
        isError={overviewError}
      />
    </div>
  );
};

export default Dashboard;