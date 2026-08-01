const ProjectOverviewToolbar = ({
    filters,
    onChange,
    onReset,
}) => {
    return (
        <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Search
                    </label>

                    <input
                        type="text"
                        placeholder="Project or Builder..."
                        value={filters.search}
                        onChange={(e) =>
                            onChange("search", e.target.value)
                        }
                        className="w-full rounded-md border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Status
                    </label>

                    <select
                        value={filters.status}
                        onChange={(e) =>
                            onChange("status", e.target.value)
                        }
                        className="w-full rounded-md border px-3 py-2"
                    >
                        <option value="">All</option>
                        <option value="Published">
                            Published
                        </option>
                        <option value="Draft">
                            Draft
                        </option>
                        <option value="Archived">
                            Archived
                        </option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Featured
                    </label>

                    <select
                        value={filters.featured}
                        onChange={(e) =>
                            onChange("featured", e.target.value)
                        }
                        className="w-full rounded-md border px-3 py-2"
                    >
                        <option value="">All</option>
                        <option value="true">
                            Featured
                        </option>
                        <option value="false">
                            Not Featured
                        </option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Sort
                    </label>

                    <select
                        value={filters.sort}
                        onChange={(e) =>
                            onChange("sort", e.target.value)
                        }
                        className="w-full rounded-md border px-3 py-2"
                    >
                        <option value="newest">
                            Newest
                        </option>

                        <option value="oldest">
                            Oldest
                        </option>

                        <option value="name-asc">
                            Name A-Z
                        </option>

                        <option value="name-desc">
                            Name Z-A
                        </option>
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={onReset}
                        className="w-full rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
                    >
                        Reset Filters
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProjectOverviewToolbar;