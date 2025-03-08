import { model, Schema, Types } from "mongoose";
import {
  jobLocations,
  seniorityLevels,
  workingTimes,
} from "../../utils/enum/enum.js";

const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      enums: Object.values(jobLocations),
      required: true,
    },
    workingTime: {
      type: String,
      enums: Object.values(workingTimes),
      required: true,
    },
    seniorityLevel: {
      type: String,
      enums: Object.values(seniorityLevels),
      required: true,
    },
    jobDescription: {
      type: String,
    },
    technicalSkills: {
      type: [String],
    },
    softSkills: {
      type: [String],
    },
    addedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    closed: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

jobSchema.query.paginate = async function (page, limit = 4) {
  page = page ? page : 1;
  const skip = limit * (page - 1);

  const data = await this.skip(skip).limit(limit);
  const totalItems = await this.model.countDocuments();

  return {
    data,
    currentPage: Number(page),
    totalItems: totalItems,
    totalPages: Math.ceil(totalItems / limit),
    itemsPerPage: data.length,
  };
};

jobSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "jobId",
});

const Job = model("Job", jobSchema);
export default Job;
