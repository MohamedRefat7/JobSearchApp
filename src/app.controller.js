import connectDB from "./DB/connection.js";
import globalErrorHandler from "./utils/errorHandeling/globalErrorHandler.js";
import notFoundHandler from "./utils/errorHandeling/notFoundHandler.js";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import adminController from "./modules/admin/admin.controller.js";
import companyController from "./modules/company/company.controller.js";
import jobController from "./modules/job/job.controller.js";
import chatController from "./modules/chat/chat.controller.js";
import { createHandler } from "graphql-http/lib/use/express";
import schema from "./app.schema.js";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const bootstrap = async (app, express) => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
    legacyHeaders: false,
    standardHeaders: true,
  });
  app.use(limiter);
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.get("/", (req, res) => res.send("Hello World🚀!"));
  await connectDB();
  app.use("/auth", authController);
  app.use("/user", userController);
  app.use(
    "/graphql",
    createHandler({
      schema,
      context: (req) => {
        const { authorization } = req.headers;
        return { authorization };
      },
      formatError: (err) => {
        return {
          success: false,
          message: err.originalError.message,
          statusCode: err.originalError?.cause || 500,
        };
      },
    })
  );
  app.use("/admin", adminController);
  app.use("/company", companyController);
  app.use("/job", jobController);
  app.use("/chat", chatController);
  app.all("*", notFoundHandler);
  app.use(globalErrorHandler);
};
export default bootstrap;
