import { EventEmitter } from "events";
import sendEmails from "./sendEmail.js";
import { signup } from "./HTMLTemp.js";

export const eventEmitter = new EventEmitter();
eventEmitter.on('sendEmail', async (email, otp, subject) => {
    const isSent = await sendEmails({ to: email, subject, html: signup(otp) });
    if (!isSent) {
        return next(new Error("Failed to send activation email", { cause: 500 }));
    }
})

