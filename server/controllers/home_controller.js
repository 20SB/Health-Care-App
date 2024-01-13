const env = require("../config/environment");

// Controller function for rendering the home page
module.exports.home = async function (req, res) {

    res.send(`<h1>You are on the Home Page of ${env.name} Server HCS</h1>`);
};