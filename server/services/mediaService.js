import path from "path";
import Project from "../models/Project.js";
import ApiError from "../utils/ApiError.js";
import {
  PROJECTS_DIR,
  moveUploadedFile,
  deleteFile,
} from "../utils/fileHelpers.js";

/**
 * Converts an absolute file path under uploads/projects/ into the relative
 * path format stored in MongoDB, e.g.
 *   /home/.../uploads/projects/64f.../gallery/front.webp
 *   -> /projects/64f.../gallery/front.webp
 *
 * @param {string} absolutePath - Absolute path to a file inside PROJECTS_DIR
 * @returns {string} Relative path suitable for storing in the database
 */
const toRelativePath = (absolutePath) => {
  const relativeToProjectsDir = path.relative(PROJECTS_DIR, absolutePath);
  return `/projects/${relativeToProjectsDir.split(path.sep).join("/")}`;
};

/**
 * Converts a relative path stored in MongoDB back into an absolute path
 * on disk, so the corresponding file can be deleted.
 *
 * @param {string} relativePath - e.g. "/projects/64f.../cover/old.jpg"
 * @returns {string} Absolute path on disk
 */
const toAbsolutePath = (relativePath) => {
  // Strip the leading "/projects/" segment, since PROJECTS_DIR already
  // points at the "projects" folder.
  const withoutPrefix = relativePath.replace(/^\/projects\//, "");
  return path.join(PROJECTS_DIR, ...withoutPrefix.split("/"));
};

/**
 * Fetches a project by id, excluding soft-deleted projects.
 * Shared by every media upload operation to confirm the project exists
 * before touching the filesystem or database.
 *
 * If the project cannot be found, the given temp file (already saved to
 * disk by Multer before this check runs) is deleted so it doesn't linger
 * as an orphaned file in uploads/temp/.
 *
 * @param {string} projectId
 * @param {object} [file] - Multer file object to clean up on failure
 * @returns {Promise<object>} The project document
 */
const getProjectOrThrow = async (projectId, file) => {
  const project = await Project.findOne({ _id: projectId, "status.isDeleted": { $ne: true } });

  if (!project) {
    if (file?.path) {
      await deleteFile(file.path);
    }
    throw new ApiError(404, "Project not found");
  }

  return project;
};

/**
 * Uploads (and replaces) a project's cover image.
 * The previous cover image file, if any, is deleted from disk.
 *
 * @param {string} projectId
 * @param {object} file - Multer file object (from uploads/temp/)
 * @param {string} [alt] - Optional alt text for the cover image
 * @returns {Promise<object>} The updated project document
 */
const uploadCoverImage = async (projectId, file, alt) => {
  if (!file) {
    throw new ApiError(400, "No file was uploaded");
  }

  const project = await getProjectOrThrow(projectId, file);

  const destinationFolder = path.join(PROJECTS_DIR, String(projectId), "cover");
  const movedPath = await moveUploadedFile(file.path, destinationFolder);
  const relativePath = toRelativePath(movedPath);

  const previousCoverUrl = project.media?.coverImage?.url;

  project.media.coverImage = { url: relativePath, alt: alt || "" };
  await project.save();

  if (previousCoverUrl) {
    await deleteFile(toAbsolutePath(previousCoverUrl));
  }

  return project;
};

/**
 * Uploads a new gallery image and appends it to the project's existing
 * gallery array. Existing gallery images are never overwritten or removed.
 *
 * @param {string} projectId
 * @param {object} file - Multer file object (from uploads/temp/)
 * @param {object} [meta] - Optional { alt, caption, displayOrder }
 * @returns {Promise<object>} The updated project document
 */
const uploadGalleryImage = async (projectId, file, meta = {}) => {
  if (!file) {
    throw new ApiError(400, "No file was uploaded");
  }

  const project = await getProjectOrThrow(projectId, file);

  const destinationFolder = path.join(
    PROJECTS_DIR,
    String(projectId),
    "gallery"
  );

  const movedPath = await moveUploadedFile(file.path, destinationFolder);
  const relativePath = toRelativePath(movedPath);

  // Find existing album
  let album = project.media.gallery.find(
    (a) => a.albumName === meta.albumName
  );

  // Create album if it doesn't exist
  if (!album) {
    album = {
      albumName: meta.albumName,
      displayOrder: project.media.gallery.length,
      images: [],
    };

    project.media.gallery.push(album);

    // Re-fetch the newly added album as a Mongoose subdocument
    album = project.media.gallery.find(
      (a) => a.albumName === meta.albumName
    );
  }

  album.images.push({
    url: relativePath,
    alt: meta.alt || "",
    caption: meta.caption || "",
    displayOrder:
      meta.displayOrder !== undefined
        ? Number(meta.displayOrder)
        : album.images.length,
  });

  await project.save();

  return project;
};

/**
 * Uploads a new video and appends it to the project's existing videos
 * array. Existing videos are never overwritten or removed.
 *
 * @param {string} projectId
 * @param {object} file - Multer file object (from uploads/temp/)
 * @param {object} [meta] - Optional { title, displayOrder }
 * @returns {Promise<object>} The updated project document
 */
const uploadVideo = async (projectId, file, meta = {}) => {
  if (!file) {
    throw new ApiError(400, "No file was uploaded");
  }

  const project = await getProjectOrThrow(projectId, file);

  const destinationFolder = path.join(PROJECTS_DIR, String(projectId), "videos");
  const movedPath = await moveUploadedFile(file.path, destinationFolder);
  const relativePath = toRelativePath(movedPath);

  project.videos.push({
    title: meta.title || "",
    type: "upload",
    url: relativePath,
    displayOrder: meta.displayOrder !== undefined ? Number(meta.displayOrder) : project.videos.length,
  });

  await project.save();

  return project;
};

/**
 * Uploads a new floor plan image and appends it to the project's existing
 * floorPlans array. Existing floor plans are never overwritten or removed.
 *
 * @param {string} projectId
 * @param {object} file - Multer file object (from uploads/temp/)
 * @param {object} [meta] - Optional { title, displayOrder }
 * @returns {Promise<object>} The updated project document
 */
const uploadFloorPlan = async (projectId, file, meta = {}) => {
  if (!file) {
    throw new ApiError(400, "No file was uploaded");
  }

  const project = await getProjectOrThrow(projectId, file);

  const destinationFolder = path.join(PROJECTS_DIR, String(projectId), "floorplans");
  const movedPath = await moveUploadedFile(file.path, destinationFolder);
  const relativePath = toRelativePath(movedPath);

  project.floorPlans.push({
    title: meta.title || "",
    url: relativePath,
    displayOrder: meta.displayOrder !== undefined ? Number(meta.displayOrder) : project.floorPlans.length,
  });

  await project.save();

  return project;
};

/**
 * Uploads (and replaces) a project's brochure.
 * The previous brochure file, if any, is deleted from disk.
 *
 * @param {string} projectId
 * @param {object} file - Multer file object (from uploads/temp/)
 * @param {string} [title] - Optional brochure title
 * @returns {Promise<object>} The updated project document
 */
const uploadBrochure = async (projectId, file, title) => {
  if (!file) {
    throw new ApiError(400, "No file was uploaded");
  }

  const project = await getProjectOrThrow(projectId, file);

  const destinationFolder = path.join(
    PROJECTS_DIR,
    String(projectId),
    "brochures"
  );

  const movedPath = await moveUploadedFile(
    file.path,
    destinationFolder
  );

  const relativePath = toRelativePath(movedPath);

  project.brochures.push({
    title: title || "",
    url: relativePath,
  });

  await project.save();

  return project;
};

/**
 * Uploads a new legal document and appends it to the project's existing
 * legalDocuments array.
 *
 * @param {string} projectId
 * @param {object} file - Multer file object
 * @param {string} [title]
 * @returns {Promise<object>}
 */
const uploadLegalDocument = async (projectId, file, title) => {
  if (!file) {
    throw new ApiError(400, "No file was uploaded");
  }

  const project = await getProjectOrThrow(projectId, file);

  const destinationFolder = path.join(
    PROJECTS_DIR,
    String(projectId),
    "legal"
  );

  const movedPath = await moveUploadedFile(file.path, destinationFolder);
  const relativePath = toRelativePath(movedPath);

  project.legalDocuments.push({
    title: title || "",
    url: relativePath,
  });

  await project.save();

  return project;
};

export {
  uploadCoverImage,
  uploadGalleryImage,
  uploadVideo,
  uploadFloorPlan,
  uploadBrochure,
  uploadLegalDocument,
};