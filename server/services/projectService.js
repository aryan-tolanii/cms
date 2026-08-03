import Project from "../models/Project.js";
import ApiError from "../utils/ApiError.js";
import { syncProjectFilters } from "./filterService.js";
import path from "path";
import floorPlanService, { deleteFloorPlanFiles } from "./floorPlanService.js";
import { backupProjects } from "../utils/databaseBackup.js";

/**
 * Creates a new project after confirming the slug is not already in use.
 *
 * @param {object} projectData - Validated request body
 * @returns {Promise<object>} The created project document
 */

const buildProjectFilter = ({
  search,
  status,
  featured,
  projectCategory,
  parentProject,
} = {}) => {
  const filter = {
    "status.isDeleted": { $ne: true },
  };

  if (search) {
    const searchRegex = new RegExp(search, "i");

    filter.$or = [
      { "general.projectName": searchRegex },
      { "general.builderName": searchRegex },
    ];
  }

  if (status) {
    filter["status.status"] = status;
  }

  if (featured !== undefined) {
    filter["status.featured"] = featured === true || featured === "true";
  }

  if (projectCategory) {
    filter.projectCategory = projectCategory;
  }

  if (parentProject) {
    filter.parentProject = parentProject;
  } else if (!search) {
    // Default: hide individual projects that are part of a portfolio tour 
    // unless the user is actively searching
    filter.parentProject = null;
  }

  return filter;
};

const createProject = async (projectData) => {
  const slug = projectData?.general?.slug;

  const existingProject = await Project.findOne({
    "general.slug": slug,
  });

  if (existingProject) {
    throw new ApiError(409, "A project with this slug already exists");
  }

  // Sanitize Portfolio Tours
  if (projectData.projectCategory === "portfolio") {
    if (projectData.contact) {
      delete projectData.contact.email;
      delete projectData.contact.whatsapp;
      delete projectData.contact.youtube;
      delete projectData.contact.linkedin;
    }
    if (projectData.location) {
      delete projectData.location.city;
      delete projectData.location.state;
      delete projectData.location.pincode;
    }
    projectData.specifications = [];
    projectData.filters = {};
    projectData.videos = [];
    projectData.brochures = [];
    projectData.legalDocuments = [];
    projectData.floorPlans = [];
    projectData.seo = {};
    if (projectData.media) {
      projectData.media.gallery = [];
    }
  }

  // Normalize parentProject
  if (
    projectData.projectCategory === "portfolio" ||
    !projectData.parentProject
  ) {
    projectData.parentProject = null;
  }

  // Generate Project Tag (P0001, P0002, ...)
  const lastProject = await Project.findOne()
    .sort({ projectTag: -1 })
    .select("projectTag");

  let nextNumber = 1;

  if (lastProject?.projectTag) {
    nextNumber = parseInt(lastProject.projectTag.replace("P", ""), 10) + 1;
  }

  projectData.projectTag = `P${String(nextNumber).padStart(4, "0")}`;

  const project = await Project.create(projectData);

  // Sync autocomplete values
  await syncProjectFilters(project);

  // Backup database locally
  await backupProjects();

  return project;
};

/**
 * Fetches a paginated, searchable, filterable, sortable list of projects.
 * Soft-deleted projects (status.isDeleted = true) are always excluded.
 *
 * @param {object} queryParams - Raw query params from the request
 * @returns {Promise<{ items: object[], totalItems: number, totalPages: number, currentPage: number }>}
 */
/**
 * Builds the MongoDB filter used across project listing APIs.
 */

/**
 * Builds Mongo sort object.
 */
const buildProjectSort = (sort = "newest") => {
  switch (sort) {
    case "oldest":
      return {
        createdAt: 1,
      };

    case "name-asc":
      return {
        "general.projectName": 1,
      };

    case "name-desc":
      return {
        "general.projectName": -1,
      };

    default:
      return {
        createdAt: -1,
      };
  }
};

const buildProjectOverview = (project) => {
  const galleryAlbums = project.media?.gallery?.length ?? 0;

  const galleryImages =
    project.media?.gallery?.reduce(
      (total, album) => total + (album.images?.length ?? 0),
      0,
    ) ?? 0;

  const videoCount = project.videos?.length ?? 0;

  const brochureCount = project.brochures?.length ?? 0;

  const floorPlanCount = project.floorPlans?.length ?? 0;

  const legalDocumentCount = project.legalDocuments?.length ?? 0;

  const hasCover = !!project.media?.coverImage?.url;

  const hasSEO = !!project.seo?.metaTitle;

  const hasContact = !!project.contact?.email;

  const hasLocation = !!project.location?.city;

  const stats = {
    cover: hasCover,

    gallery: {
      albums: galleryAlbums,
      images: galleryImages,
    },

    videos: videoCount,

    brochures: brochureCount,

    floorPlans: floorPlanCount,

    legalDocuments: legalDocumentCount,

    seo: hasSEO,

    contact: hasContact,

    location: hasLocation,
  };

  stats.completion = calculateCompletion(stats);

  stats.missing = buildMissingItems(stats);

  return {
    _id: project._id,

    projectTag: project.projectTag,

    projectName: project.general.projectName,

    builderName: project.general.builderName,

    category: project.projectCategory,

    city: project.location?.city || "",

    status: project.status.status,

    featured: project.status.featured,

    updatedAt: project.updatedAt,

    stats,
  };
};

const calculateCompletion = (stats) => {
  const checks = [
    stats.cover,
    stats.gallery.images > 0,
    stats.videos > 0,
    stats.brochures > 0,
    stats.floorPlans > 0,
    stats.legalDocuments > 0,
    stats.seo,
    stats.contact,
    stats.location,
  ];

  const completed = checks.filter(Boolean).length;

  return Math.round((completed / checks.length) * 100);
};

const buildMissingItems = (stats) => {
  const missing = [];

  if (!stats.cover) missing.push("Cover Image");

  if (stats.gallery.images === 0) missing.push("Gallery");

  if (stats.videos === 0) missing.push("Videos");

  if (stats.brochures === 0) missing.push("Brochures");

  if (stats.floorPlans === 0) missing.push("Floor Plans");

  if (stats.legalDocuments === 0) missing.push("Legal Documents");

  if (!stats.seo) missing.push("SEO");

  if (!stats.contact) missing.push("Contact");

  if (!stats.location) missing.push("Location");

  return missing;
};

/**
 * Fetches a paginated, searchable, filterable, sortable list of projects.
 */
const getProjects = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    featured,
    projectCategory,
    parentProject,
    sort,
  } = queryParams;

  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const pageSize = Math.max(parseInt(limit, 10) || 10, 1);

  const filter = buildProjectFilter({
    search,
    status,
    featured,
    projectCategory,
    parentProject,
  });

  const sortOption = buildProjectSort(sort);

  const totalItems = await Project.countDocuments(filter);

  const totalPages = Math.ceil(totalItems / pageSize) || 0;

  const items = await Project.find(filter)
    .sort(sortOption)
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize);

  return {
    items,
    totalItems,
    totalPages,
    currentPage,
  };
};

/**
 * Returns dashboard-friendly project overview data.
 */
const getProjectOverview = async (queryParams) => {
  const {
    // page = 1,
    // limit = 25,
    search,
    status,
    featured,
    projectCategory,
    sort,
  } = queryParams;

  // const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  // const pageSize = Math.max(parseInt(limit, 10) || 25, 1);

  const filter = buildProjectFilter({
    search,
    status,
    featured,
    projectCategory,
  });

  const sortOption = buildProjectSort(sort);

  const totalItems = await Project.countDocuments(filter);

  // const totalPages = Math.ceil(totalItems / pageSize) || 0;

  const projects = await Project.find(filter).sort(sortOption).lean();

  const items = projects.map(buildProjectOverview);

  return {
    items,
    totalItems,
    // totalPages,
    // currentPage,
  };
};

/**
 * Fetches a single project by id, excluding soft-deleted projects.
 *
 * @param {string} id - Project ObjectId
 * @returns {Promise<object>} The project document
 */
const getProjectById = async (id) => {
  const project = await Project.findOne({
    _id: id,
    "status.isDeleted": { $ne: true },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

/**
 * Partially updates a project, confirming the project exists and, if a new
 * slug is provided, that it does not collide with a different project's slug.
 *
 * @param {string} id - Project ObjectId
 * @param {object} updateData - Validated partial update payload
 * @returns {Promise<object>} The updated project document
 */
const updateProject = async (id, updateData) => {
  // Normalize parentProject
  if (
    updateData.projectCategory === "portfolio" ||
    updateData.parentProject === ""
  ) {
    updateData.parentProject = null;
  }

  const project = await Project.findOne({
    _id: id,
    "status.isDeleted": { $ne: true },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const newSlug = updateData?.general?.slug;

  if (newSlug) {
    const slugOwner = await Project.findOne({
      "general.slug": newSlug,
      _id: { $ne: id },
    });

    if (slugOwner) {
      throw new ApiError(409, "A project with this slug already exists");
    }
  }

  // Merge each provided top-level section into the existing document rather
  // than replacing the whole document, so partial updates don't wipe out
  // sibling fields within the same nested object (e.g. updating only
  // general.projectName should not clear general.builderName).
  Object.keys(updateData).forEach((key) => {
    const value = updateData[key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const existingValue = project[key]
        ? JSON.parse(JSON.stringify(project[key]))
        : {};
      project[key] = { ...existingValue, ...value };
    } else {
      project[key] = value;
    }
  });

  // Sanitize Portfolio Tours before saving
  if (project.projectCategory === "portfolio") {
    if (project.contact) {
      project.contact.email = undefined;
      project.contact.whatsapp = undefined;
      project.contact.youtube = undefined;
      project.contact.linkedin = undefined;
    }
    if (project.location) {
      project.location.city = undefined;
      project.location.state = undefined;
      project.location.pincode = undefined;
    }
    project.specifications = [];
    project.filters = {};
    project.videos = [];
    project.brochures = [];
    project.legalDocuments = [];
    project.floorPlans = [];
    project.seo = {};
    if (project.media) {
      project.media.gallery = [];
    }
  }

  await project.save();

  // Sync autocomplete values
  await syncProjectFilters(project);

  return project;
};

/**
 * Soft-deletes a project by setting status.isDeleted to true.
 * The document is never actually removed from the database.
 *
 * @param {string} id - Project ObjectId
 * @returns {Promise<object>} The soft-deleted project document
 */
const deleteProject = async (id) => {
  const project = await Project.findOne({
    _id: id,
    "status.isDeleted": { $ne: true },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  project.status.isDeleted = true;
  await project.save();

  return project;
};

export const uploadProjectFloorPlan = async (projectId, title, floorPlanFile) => {
  if (!floorPlanFile) {
    throw new ApiError(400, "Floor plan file is required.");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  // Process uploaded file (move, convert if PDF, etc.)
  const processedFloorPlan = await floorPlanService.processFloorPlan(
    project._id.toString(),
    floorPlanFile.path,
    floorPlanFile.mimetype,
    floorPlanFile.originalname
  );

  project.floorPlans.push({
    title: title?.trim() || "Untitled Floor Plan",

    originalPdf: path.relative(process.cwd(), processedFloorPlan.originalPdf),

    thumbnail: path.relative(process.cwd(), processedFloorPlan.thumbnail),

    pageCount: processedFloorPlan.pageCount,

    pages: processedFloorPlan.pages.map((page) => ({
      pageNumber: page.pageNumber,
      dziPath: page.dziPath ? path.relative(process.cwd(), page.dziPath) : null,
    })),

    displayOrder: project.floorPlans.length,
  });

  await project.save();

  return project;
};

export const deleteProjectFloorPlan = async (projectId, floorPlanId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const floorPlan = project.floorPlans.id(floorPlanId);

  if (!floorPlan) {
    throw new ApiError(404, "Floor plan not found.");
  }

  // Delete all files from disk
  await deleteFloorPlanFiles(floorPlan.originalPdf);

  // Remove from MongoDB document
  floorPlan.deleteOne();

  // Recalculate display order
  project.floorPlans.forEach((item, index) => {
    item.displayOrder = index;
  });

  await project.save();

  return project;
};

export const replaceProjectFloorPlan = async (
  projectId,
  floorPlanId,
  title,
  floorPlanFile,
) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const floorPlan = project.floorPlans.id(floorPlanId);

  if (!floorPlan) {
    throw new ApiError(404, "Floor plan not found.");
  }

  // If no new file is uploaded, update only the title.
  if (!floorPlanFile) {
    if (typeof title === "string" && title.trim()) {
      floorPlan.title = title.trim();
    }

    await project.save();

    return project;
  }
  // Replace the existing floor plan with the new file.
  const newFloorPlan = await floorPlanService.replaceFloorPlan(
    project._id.toString(),
    floorPlanFile.path,
    floorPlan.originalPdf,
    floorPlanFile.mimetype,
    floorPlanFile.originalname
  );

  // Update metadata.
  floorPlan.title = title?.trim() || floorPlan.title;
  floorPlan.originalPdf = path.relative(
    process.cwd(),
    newFloorPlan.originalPdf,
  );
  floorPlan.thumbnail = path.relative(process.cwd(), newFloorPlan.thumbnail);
  floorPlan.pageCount = newFloorPlan.pageCount;
  floorPlan.pages = newFloorPlan.pages.map((page) => ({
    pageNumber: page.pageNumber,
    dziPath: page.dziPath ? path.relative(process.cwd(), page.dziPath) : null,
  }));

  await project.save();

  return project;

  return project;
};

export {
  createProject,
  getProjects,
  getProjectOverview,
  getProjectById,
  updateProject,
  deleteProject,
};
