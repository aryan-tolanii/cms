import fs from "fs/promises";
import path from "path";
import Project from "../models/Project.js";

const BACKUP_DIR = path.join(process.cwd(), "Local-Backup");
const BACKUP_FILE = path.join(BACKUP_DIR, "projects.json");

/**
 * Backs up all non-deleted projects to a local JSON file.
 */
export const backupProjects = async () => {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    const projects = await Project.find({ "status.isDeleted": { $ne: true } }).lean();
    await fs.writeFile(BACKUP_FILE, JSON.stringify(projects, null, 2));
    console.log(`Successfully backed up ${projects.length} projects to ${BACKUP_FILE}`);
  } catch (error) {
    console.error("Error creating local project backup:", error);
  }
};