const express = require("express");
const router = express.Router();
const movieCategoryController = require("../controller/movie_category");

router.post("/", movieCategoryController.createMovieCategoryController);
router.get("/", movieCategoryController.getMovieCategoriesController);
router.put("/:id", movieCategoryController.updateMovieCategoryController);
router.delete("/:id", movieCategoryController.deleteMovieCategoryController);
router.get("/:id", movieCategoryController.getMovieCategoryByIdController);

module.exports = router;
