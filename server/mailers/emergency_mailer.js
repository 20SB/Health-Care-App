// Import the nodemailer configuration
const nodeMailer = require("../config/nodemailer");
const env = require("../config/environment");

// Exported function to send a new emergency email notification
exports.newEmergency = (user) => {
    return new Promise((resolve, reject) => {

        // Render the email content using the provided user data and template
        let htmlString = nodeMailer.renderTemplate(
            { user: user },
            "emergency_mail.ejs"
        );

        // Use the transporter to send the email
        nodeMailer.transporter.sendMail(
            {
                from: env.mailFrom, // Sender's name or email
                to: user.email, // Recipient's email
                subject: "Alert!!! Someone Needs Your Help...", // Email subject
                html: htmlString,
            },
            (err, info) => {
                if (err) {
                    console.log("Error in sending Emergency mail", err);
                    reject(err); // Reject the promise if there's an error
                    return;
                }
                console.log("Emergency Message sent", info);
                resolve("Emergency Email sent successfully"); // Resolve the promise if the email is sent successfully
            }
        );
    });
};