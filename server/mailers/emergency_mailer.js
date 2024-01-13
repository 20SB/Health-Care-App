// Import the nodemailer configuration
const nodeMailer = require("../config/nodemailer");
const env = require("../config/environment");

// Exported function to send new emergency email notifications
exports.newEmergency = (users,patient,location) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Iterate through each user in the array
            for (const user of users) {
                // Render the email content using the provided user data and template
                let htmlString = nodeMailer.renderTemplate(
                    { user: user, patient: patient, location },
                    "emergency_mail.ejs"
                );

                // Use the transporter to send the email
                await nodeMailer.transporter.sendMail({
                    from: env.mailFrom, // Sender's name or email
                    to: user.email, // Recipient's email
                    subject: "Alert!!! Someone Needs Your Help...", // Email subject
                    html: htmlString,
                });

                console.log(`Emergency Message sent to ${user.email}`);
            }

            resolve("Emergency Emails sent successfully");
        } catch (error) {
            console.log("Error in sending Emergency mails", error);
            reject(error); // Reject the promise if there's an error
        }
    });
};
