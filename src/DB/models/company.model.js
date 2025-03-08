import { model, Schema, Types } from "mongoose";


const companySchema = new Schema({

    companyName: {
        type: String,
        required: true,
        unique: [true, "Company name already exists"],
    },
    description: {
        type: String,
    },
    industry: {
        type: String,
    },
    address: {
        type: String,
    },
    numberOfEmployees: {
        type: String,
        required: true,
        match: /^[0-9]+-[0-9]+$/
    },
    companyEmail: {
        type: String,
        required: true,
        unique: [true, "Email already exists"],
        match: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/,
        lowercase: true
    },
    CreatedBy: {
        type: Types.ObjectId,
        ref: "User"
    },
    Logo: {
        secure_url: {
            type: String,
        },
        public_id: {
            type: String,
        }
    },
    coverPic: {
        secure_url: {
            type: String,
        },
        public_id: {
            type: String,
        }
    },
    HRs: [{
        type: Types.ObjectId,
        ref: "User"
    }],
    isBanned: {
        type: Boolean,
        default: false
    },
    bannedAt: {
        type: Date,
        default: null
    },
    isFreezed: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    legalAttachment: {
        secure_url: {
            type: String,
        },
        public_id: {
            type: String,
        }
    },
    approvedByAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

companySchema.virtual('jobs', {
    ref: 'Job',
    localField: '_id',
    foreignField: 'companyId'
})


const Company = model("Company", companySchema);
export default Company