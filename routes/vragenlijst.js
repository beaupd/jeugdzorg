const express = require("express");
const Vragenlijst = require("../models/vragenlijst.model");

module.exports = express
    .Router()

    // List ALL members
    .get("/", async (req, res, next) => {
        try {
            res.json(await Vragenlijst.getAll(req.query.page));
        } catch (err) {
            console.error("Error while getting vragenlijst: ", err.message);
            next(err);
        }
    });
