require("dotenv").config();
const express = require("express");
const cors = require("cors");

const vragenRoute = require("./routes/vraag");
const vragenlijstenRoute = require("./routes/vragenlijst");
const gebruikersRoute = require("./routes/gebruiker");

module.exports = express()
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cors())

    .use("/vragen", vragenRoute)
    .use("/vragenlijsten", vragenlijstenRoute)
    .use("/gebruikers", gebruikersRoute);
