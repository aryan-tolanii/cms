import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Project from "../models/project.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_DIR = path.join(__dirname, "..", "Local-Backup");
const BACKUP_FILE = path.join(BACKUP_DIR, "projects.json");

export const backupProjects = async () => {
  try {
    const projects = await Project.find().lean();

    await fs.mkdir(BACKUP_DIR, { recursive: true });

    await fs.writeFile(BACKUP_FILE, JSON.stringify(projects, null, 2), "utf8");

    console.log(`✅ Local backup updated (${projects.length} projects)`);
  } catch (error) {
    console.error("❌ Failed to create local backup");
    console.error(error);
  }
};
