import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ROOT_UPLOAD_DIR = path.join(process.cwd(), "uploads", "floorplans");

class FloorPlanService {
  async processFloorPlan(projectId, tempPdfPath) {
    // unique folder for this floorplan
    const floorPlanId = randomUUID();

    const outputDir = path.join(
      ROOT_UPLOAD_DIR,
      projectId.toString(),
      floorPlanId,
    );

    await fs.mkdir(outputDir, { recursive: true });

    // move uploaded pdf
    const originalPdf = path.join(outputDir, "original.pdf");

    await fs.rename(tempPdfPath, originalPdf);

    const pythonScript = path.join(process.cwd(), "python", "pdf_to_dzi.py");

    const result = await this.runPython(pythonScript, originalPdf, outputDir);

    return {
      floorPlanId,

      originalPdf: this.normalize(originalPdf),

      thumbnail: this.normalize(path.join(outputDir, result.thumbnail)),

      pageCount: result.pageCount,

      pages: result.pages.map((page) => ({
        pageNumber: page.pageNumber,
        dziPath: this.normalize(path.join(outputDir, page.dziPath)),
      })),
    };
  }

  /**
   * Replaces an existing floor plan with a newly uploaded PDF.
   */
  async replaceFloorPlan(projectId, tempPdfPath, oldOriginalPdf) {
    // Generate the new floor plan first.
    const newFloorPlan = await this.processFloorPlan(projectId, tempPdfPath);

    // Only delete the old files after successful processing.
    await deleteFloorPlanFiles(oldOriginalPdf);

    return newFloorPlan;
  }

  runPython(script, pdf, output) {
    return new Promise((resolve, reject) => {
      const process = spawn("python", [script, pdf, output]);

      let stdout = "";
      let stderr = "";

      process.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      process.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      process.on("close", (code) => {
        if (code !== 0) {
          return reject(new Error(stderr || stdout));
        }

        try {
          const json = JSON.parse(stdout);

          if (!json.success) {
            return reject(new Error(json.error));
          }

          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  normalize(filePath) {
    return filePath.replace(/\\/g, "/");
  }
}

export default new FloorPlanService();