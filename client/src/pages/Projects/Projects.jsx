import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import projectService from "@/services/project/projectService";

import ProjectTable from "@/components/project/ProjectTable";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { ROUTES } from "@/constants/routes";

const Projects = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [featured, setFeatured] = useState("all");
    const [sort, setSort] = useState("newest");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [projectCategory, setProjectCategory] = useState("all");

    useEffect(() => {
        setPage(1);
    }, [
        search,
        status,
        featured,
        sort,
        projectCategory,
    ]);

    const { data, isLoading, isError } = useQuery({
        queryKey: [
            "projects",
            search,
            status,
            featured,
            projectCategory,
            sort,
            page,
            limit,
        ],
        queryFn: () =>
            projectService.getProjects({
                page,
                limit,
                search,
                status:
                    status === "all"
                        ? undefined
                        : status,
                featured:
                    featured === "all"
                        ? undefined
                        : featured === "featured",
                projectCategory:
                    projectCategory === "all"
                        ? undefined
                        : projectCategory,
                sort,
            }),
    });


    const projects = data?.data?.items ?? [];

    const totalPages = data?.data?.totalPages ?? 1;
    const currentPage = data?.data?.currentPage ?? 1;
    const totalItems = data?.data?.totalItems ?? 0;

    const startItem =
        totalItems === 0
            ? 0
            : (currentPage - 1) * limit + 1;

    const endItem = Math.min(
        currentPage * limit,
        totalItems
    );

    console.log({
        currentPage,
        totalPages,
        totalItems,
        startItem,
        endItem,
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <div>
                    <h1 className="text-3xl font-bold">
                        Projects
                    </h1>

                    <p className="mt-1 text-slate-500">
                        Manage all portfolio projects.
                    </p>
                </div>

                <Link to={ROUTES.PROJECT_CREATE} className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto">
                        + New Project
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by project or builder..."
                        className="pl-10 w-full"
                    />
                </div>

                <Select
                    value={status}
                    onValueChange={setStatus}
                >
                    <SelectTrigger className="w-full md:w-44">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">
                            All Statuses
                        </SelectItem>

                        <SelectItem value="Draft">
                            Draft
                        </SelectItem>

                        <SelectItem value="Published">
                            Published
                        </SelectItem>

                        <SelectItem value="Archived">
                            Archived
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={projectCategory}
                    onValueChange={setProjectCategory}
                >
                    <SelectTrigger className="w-full md:w-52">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">
                            All Categories
                        </SelectItem>

                        <SelectItem value="portfolio">
                            Portfolio Tours
                        </SelectItem>

                        <SelectItem value="individual">
                            Individual Projects
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={featured}
                    onValueChange={setFeatured}
                >
                    <SelectTrigger className="w-full md:w-44">
                        <SelectValue placeholder="Featured" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">
                            All Projects
                        </SelectItem>

                        <SelectItem value="featured">
                            Featured
                        </SelectItem>

                        <SelectItem value="not-featured">
                            Not Featured
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={sort}
                    onValueChange={setSort}
                >
                    <SelectTrigger className="w-full md:w-52">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="newest">
                            Newest First
                        </SelectItem>

                        <SelectItem value="oldest">
                            Oldest First
                        </SelectItem>

                        <SelectItem value="name-asc">
                            Project Name (A-Z)
                        </SelectItem>

                        <SelectItem value="name-desc">
                            Project Name (Z-A)
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="rounded-xl border bg-white p-16 text-center">
                    <h2 className="text-xl font-medium">
                        Loading projects...
                    </h2>
                </div>
            ) : isError ? (
                <div className="rounded-xl border bg-white p-16 text-center">
                    <h2 className="text-xl font-medium text-red-500">
                        Failed to load projects.
                    </h2>
                </div>
            ) : projects.length === 0 ? (
                <div className="rounded-xl border bg-white p-16 text-center">
                    <h2 className="text-2xl font-semibold">
                        No Projects Found
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Try changing your filters or create a new project.
                    </p>

                    <Link
                        to={ROUTES.PROJECT_CREATE}
                        className="mt-6 inline-block"
                    >
                        <Button>
                            Create Project
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    <ProjectTable projects={projects} />

                    <div className="mt-6 flex flex-col md:flex-row items-center justify-between rounded-lg border bg-white p-4 gap-4">
                        <div className="text-sm text-slate-500 text-center md:text-left">
                            Showing <strong>{startItem}</strong> -{" "}
                            <strong>{endItem}</strong> of{" "}
                            <strong>{totalItems}</strong> projects
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3">

                            <Select
                                value={String(limit)}
                                onValueChange={(value) => {
                                    setLimit(Number(value));
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-24">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="10">
                                        10
                                    </SelectItem>

                                    <SelectItem value="25">
                                        25
                                    </SelectItem>

                                    <SelectItem value="50">
                                        50
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                disabled={currentPage === 1}
                                onClick={() => setPage((prev) => prev - 1)}
                            >
                                Previous
                            </Button>

                            <span className="text-sm font-medium whitespace-nowrap">
                                Page {currentPage} of {totalPages}
                            </span>

                            <Button
                                variant="outline"
                                disabled={currentPage === totalPages}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Projects;