import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import path from "path";
import { fileURLToPath } from "url";

import routes from "./routes/index.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);
app.use(
  cors({
    origin: "https://cms-frontnd.onrender.com/",
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(
  "/projects",
  express.static(path.join(__dirname, "uploads", "projects")),
);


app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
