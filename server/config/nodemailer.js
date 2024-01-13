const nodemailer = require('nodemailer');
const ejs = require('ejs');
const env = require("./environment");
const path = require('path');

// Create a nodemailer transporter configuration object
let transporter = nodemailer.createTransport(env.smtp);

// Define a function to render an email template
let renderTemplate = (data, relativePath) => {
    let mailHTML;

    // Render the ejs template using the provided data
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath), // Path to the template
        data, // Data to be injected into the template
        function(err, template) {
            if (err) {
                console.log('error in rendering template', err);
                return;
            }
            mailHTML = template;
        }
    );

    return mailHTML; // Return the rendered template as HTML
};

// Export the transporter configuration and renderTemplate function
module.exports = {
    transporter: transporter, // Export the transporter configuration
    renderTemplate: renderTemplate // Export the renderTemplate function
};