const express = require("express");
const Vraag = require("../models/vraag.model");

module.exports = express
    .Router()

    // List ALL members
    .get("/", async (req, res, next) => {
        try {
            res.json(await Vraag.getAll(req.query.page));
        } catch (err) {
            console.error("Error while getting vragen: ", err.message);
            next(err);
        }
    });
