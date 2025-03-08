import cron from "node-cron";
import OTP from "../../DB/models/otp.schema.js";
import { asyncHandler } from './../errorHandeling/asyncHandler.js';


asyncHandler(cron.schedule("0 */6 * * *", async () => {

    const result = await OTP.deleteMany({ expiresIn: { $lt: new Date() } });
}, {
    scheduled: true,
    timezone: "UTC"
}));

