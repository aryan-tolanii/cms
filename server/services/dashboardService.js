import Project from "../models/Project.js";

/**
 * Computes dashboard statistics in a single aggregation pipeline:
 * total/published/draft/archived/featured project counts, plus the 5
 * most recently created projects. Soft-deleted projects (status.isDeleted
 * = true) are excluded from every count and from the recent projects list.
 *
 * @returns {Promise<object>} Dashboard statistics
 */
const getDashboardStats = async () => {
  const [result] = await Project.aggregate([
    {
      $match: { "status.isDeleted": { $ne: true } },
    },
    {
      $facet: {
        totalProjects: [{ $count: "count" }],
        publishedProjects: [{ $match: { "status.status": "Published" } }, { $count: "count" }],
        draftProjects: [{ $match: { "status.status": "Draft" } }, { $count: "count" }],
        archivedProjects: [{ $match: { "status.status": "Archived" } }, { $count: "count" }],
        featuredProjects: [{ $match: { "status.featured": true } }, { $count: "count" }],
        recentProjects: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $project: {
              _id: 1,
              projectName: "$general.projectName",
              builderName: "$general.builderName",
              status: "$status.status",
              featured: "$status.featured",
              createdAt: 1,
            },
          },
        ],
      },
    },
  ]);

  // Each count facet resolves to either [{ count: N }] or [] (no matches),
  // so unwrap accordingly and default to 0.
  const extractCount = (facetResult) => facetResult?.[0]?.count || 0;

  return {
    totalProjects: extractCount(result.totalProjects),
    publishedProjects: extractCount(result.publishedProjects),
    draftProjects: extractCount(result.draftProjects),
    archivedProjects: extractCount(result.archivedProjects),
    featuredProjects: extractCount(result.featuredProjects),
    recentProjects: result.recentProjects,
  };
};

export { getDashboardStats };