const MOVIECATEGORY = require("../model/movie_category");

exports.createMovieCategoryController = async (req, res, err) => {
  try {
    const { categoryname } = req.body;

    const categoryModel = new MOVIECATEGORY(categoryname);
    const createRecord = await categoryModel.create();
    return res.status(200).json({
      createRecord,
      msg: "Movie category created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMovieCategoriesController = async (req, res, err) => {
  try {
    const categories = await MOVIECATEGORY.getMovieCategory();
    return res.status(200).json(categories[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateMovieCategoryController = async (req, res, err) => {
  try {
    const { id } = req.params;
    const { categoryname } = req.body;

    const categoryModel = new MOVIECATEGORY(categoryname);
    const updateRecord = await categoryModel.updateMovieCategory(id);
    return res.status(200).json({
      updateRecord,
      msg: "Movie category updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteMovieCategoryController = async (req, res, err) => {
  try {
    const { id } = req.params;
    const deleteRecord = await MOVIECATEGORY.deleteMovieCategory(id);
    return res.status(200).json({
      deleteRecord,
      msg: "Movie category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMovieCategoryByIdController = async (req, res, err) => {
  try {
    const { id } = req.params;
    const category = await MOVIECATEGORY.getMovieCategoryById(id);
    return res.status(200).json(category[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
