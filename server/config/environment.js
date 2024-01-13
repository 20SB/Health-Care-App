const development = {
    name: "development",
    port: process.env.PORT_DEV,
    db: process.env.MONGO_URL_DEV,  
    jwtSecret: 'HCS',
    smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.MAILER_ID_DEV,
            pass: process.env.MAILER_PASS_DEV,
        },
    },
    mailFrom: process.env.MAIL_FROM_DEV,
};

module.exports = development;