const express = require("express");
const Gebruiker = require("../models/gebruiker.model");

module.exports = express
    .Router()

    // List ALL members
    .get("/", async (req, res, next) => {
        try {
            res.json(await Gebruiker.getAll(req.query.page));
        } catch (err) {
            console.error("Error while getting gebruikers: ", err.message);
            next(err);
        }
    })

    .get("/:id", async (req, res, next) => {
        try {
            const response = await Gebruiker.findById(req.params.id);
            console.log(response);
            if (response.data.length > 0) {
                res.json(response);
            } else {
                res.json({ message: "no user found" });
            }
        } catch (err) {
            console.error("Error finding gebruiker by id: ", err.message);
            next(err);
        }
    })

    .post("/", async (req, res, next) => {
        try {
            res.json(await Gebruiker.create(new Gebruiker(req.body)));
        } catch (err) {
            console.error("Error while adding gebruiker: ", err.message);
            next(err);
        }
    })

    .patch("/:id", async (req, res, next) => {
        console.log(req.body);
        try {
            const response = await Gebruiker.update(new Gebruiker(req.body));
            if (response.meta.affectedRows > 0) {
                res.json({ message: "Succesfully updated entry" });
            } else {
                res.json({ message: "No entry was updated" });
            }
        } catch (err) {
            console.error("Error while updating gebruiker: ", err.message);
            next(err);
        }
    })

    .delete("/:id", async (req, res, next) => {
        try {
            const response = await Gebruiker.remove(req.params.id);
            if (response.meta.affectedRows > 0) {
                res.json({ message: "Succesfully deleted entry" });
            } else {
                res.json({ message: "No entry was deleted" });
            }
        } catch (err) {
            console.error("Error while deleting gebruiker: ", err.message);
            next(err);
        }
    });
