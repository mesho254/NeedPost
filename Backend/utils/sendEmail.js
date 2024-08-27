const nodemailer = require("nodemailer");
const dotenv = require('dotenv');

dotenv.config();



module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			service: process.env.EMAIL_SERVICE,
			secure: Boolean(process.env.EMAIL_SECURE),
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});

		await transporter.sendMail({
			from: process.env.EMAIL_FROM,
			to: email,
			subject: subject,
			text: text,
		});

		console.log("Email sent successfully");
	} catch (error) {
		console.log("Email not sent!");
		console.error(error);
		throw new Error("Email not sent");
	}
};
