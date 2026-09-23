const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (to, subject, html) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: [to],
            subject: subject,
            html: html
        });

        if (error) {
            console.error("❌ Resend Email Error:", error);
            throw new Error(error.message || "Email sending failed");
        }

        console.log("✅ Email sent successfully:", data);
        return data;

    } catch (error) {
        console.error("❌ Email sending failed:", error.message);
        throw error;
    }
};

module.exports = sendMail;