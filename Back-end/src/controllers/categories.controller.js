const express = require("express")
const router = express.Router()
const { asyncHandler } = require("../middleware/error.middleware")
const categorieModel = require("../models/categorie.model")

router.get("/", asyncHandler(async (req, res) => {
    const categories = await categorieModel.getcategories()

    return res.status(200).json({
        status: "success",
        data: {
            categories: categories
        }
    })
}))

router.post("/", asyncHandler(async (req, res) => {
    const name = req.body?.name?.trim()
    if (!name || typeof name !== "string") {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "categorie name is required"
            }
        })
    }
    const existCtegorie = await categorieModel.existCtegorieByName(name)
    if (existCtegorie) {
        return res.status(409).json({
            status: "fail",
            data: {
                message: "the categorie is already exist"
            }
        })
    }
    const categorie = await categorieModel.addcategorie(name)
    if (categorie.length === 0) {
        return res.status(500).json({
            status: "fail",
            data: {
                message: "something went wrong, please try again later"
            }
        })
    }
    return res.status(200).json({
        status: "success",
        data: {
            message: "categorie added successfuly",
            categorie
        }
    })
}))

router.delete("/:id", asyncHandler(async (req, res) => {
    const categorieId = parseInt(req.params.id);

    if (!Number.isFinite(categorieId)) {
        return res.status(400).json({
            status: "fail",
            data: { message: "Invalid request ID" }
        });
    }
    const existCtegorie = await categorieModel.existCtegorieById(categorieId)
    if (!existCtegorie) {
        return res.status(409).json({
            status: "fail",
            data: {
                message: "the categorie is not exist"
            }
        })
    }

    const deleteCategorie = await categorieModel.deleteCategorie(categorieId)
    if (!deleteCategorie) {
        return res.status(500).json({
            status: "fail",
            data: {
                message: "something went wrong, please try again later"
            }
        })
    }
    return res.status(200).json({
        status: "success",
        data:{
            message: "categorie deleted successfuly"
        }
    })

}))

module.exports = router