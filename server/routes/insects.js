// Instantiate router - DO NOT MODIFY
const express = require("express");
const router = express.Router();

/**
 * INTERMEDIATE BONUS PHASE 2 (OPTIONAL) - Code routes for the insects
 *   by mirroring the functionality of the trees
 */
// Your code here
const { Insect } = require("../db/models");

const { Op } = require("sequelize");

router.get("/", async (req, res, next) => {
    const insects = await Insect.findAll({
        attributes: ["id", "name", "millimeters"],
        order: [["millimeters", "ASC"]],
    });
    res.json(insects);
});

router.get("/:id", async (req, res, next) => {
    const id = req.params.id;

    try {
        const insect = await Insect.findByPk(id);

        if (insect) {
            res.json(insect);
        } else {
            next({
                status: "not-found",
                message: `Could not find insect ${id}`,
                details: "Insect not found",
            });
        }
    } catch (err) {
        next({
            status: "error",
            message: `Could not find insect ${id}`,
            details: err.errors
                ? err.errors.map((item) => item.message).join(", ")
                : err.message,
        });
    }
});

router.post("/", async (req, res, next) => {
    try {
        const { name, description, fact, territory, millimeters } = req.body;

        const newInsect = await Insect.create({
            name,
            description,
            fact,
            territory,
            millimeters,
        });
        res.json({
            status: "success",
            message: "Successfully created new insect",
            data: newInsect,
        });
    } catch (err) {
        next({
            status: "error",
            message: "Could not create new insect",
            details: err.errors
                ? err.errors.map((item) => item.message).join(", ")
                : err.message,
        });
    }
});

router.delete("/:id", async (req, res, next) => {
    const insectId = req.params.id;
    try {
        const deleteInsect = await Insect.findOne({
            where: {
                id: insectId,
            },
        });

        if (deleteInsect) {
            await deleteInsect.destroy();

            res.json({
                status: "Success",
                message: `Successfully removed tree ${insectId}`,
            });
        } else {
            next({
                status: "not-found",
                message: `Could not remove insect ${insectId}`,
                details: "Tree not found",
            });
        }
    } catch (err) {
        next({
            status: "error",
            message: `Could not remove insect ${insectId}`,
            details: err.errors
                ? err.errors.map((item) => item.message).join(", ")
                : err.message,
        });
    }
});

router.put("/:id", async (req, res, next) => {
    const insectId = req.params.id;
    const { id, name, description, fact, territory, millimeters } = req.body;

    try {
        let insect = await Insect.findByPk(insectId);
        if (!insect) {
            next({
                status: "not-found",
                message: `Could not update insect ${insectId}`,
                details: "Insect not found",
            });
        }
        if (parseInt(insectId) !== parseInt(id)) {
            return next({
                status: "error",
                message: "Could not update insect",
                details: `InsectId:${insectId} does not match InsectId:${id}`,
            });
        }

        await insect.update({
            id: insectId,
            name,
            description,
            fact,
            territory,
            millimeters,
        });

        res.json({
            status: "success",
            message: "Successfully updated insect",
            data: insect,
        });
    } catch (err) {
        next({
            status: "error",
            message: "Could not update insect",
            details: err.errors
                ? err.errors.map((item) => item.message).join(", ")
                : err.message,
        });
    }
});

router.get("/search/:value", async (req, res, next) => {
    const value = req.params.value;
    const insect = await Insect.findAll({
        attribures: ["id", "name", "millimeters"],
        where: {
            name: {
                [Op.like]: `%${value}%`,
            },
        },
        order: [["millimeters", "ASC"]],
    });

    res.json(insect);
});

// Export class - DO NOT MODIFY
module.exports = router;
