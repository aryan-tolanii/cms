import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { processPdf } from "../utils/pdfToDzi.js";

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

    const result = await processPdf(originalPdf, outputDir);

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


  normalize(filePath) {
    return filePath.replace(/\\/g, "/");
  }
}

export default new FloorPlanService();