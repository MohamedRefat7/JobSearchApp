import { model, Schema, Types } from "mongoose";
import { allStatus } from "../../utils/enum/enum.js";

const applicationSchema = new Schema(
  {
    jobId: {
      type: Types.ObjectId,
      ref: "Job",
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    userCV: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    status: {
      type: String,
      enum: Object.values(allStatus),
      default: allStatus.pending,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

applicationSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
});

applicationSchema.query.paginate = async function (page = 1, limit = 4) {
  const skip = (page - 1) * limit;
  const data = await this.skip(skip).limit(limit);
  const totalItems = await this.model.countDocuments();

  return {
    data,
    currentPage: Number(page),
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    itemsPerPage: data.length,
  };
};

const Application = model("Application", applicationSchema);
export default Application;
