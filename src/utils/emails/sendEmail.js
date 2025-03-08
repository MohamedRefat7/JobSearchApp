import nodemailer from 'nodemailer';

const sendEmails = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const info = await transporter.sendMail({
            from: `"Job Search App" <${process.env.EMAIL}>`,
            to,
            subject,
            html,
        })
        return info.rejected.length == 0 ? true : false
    } catch (error) {
        console.log(error.message);
    }
}

export default sendEmails