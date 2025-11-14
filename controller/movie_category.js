const AppDataSource = require("../config/data-source");

exports.createMovieCategoryController = async (req, res, err) => {
  try {
    const { categoryname } = req.body;

    const categoryRepository = AppDataSource.getRepository("MovieCategory");
    const newCategory = categoryRepository.create({ categoryname });
    const savedCategory = await categoryRepository.save(newCategory);

    return res.status(200).json({
      createRecord: savedCategory,
      msg: "Movie category created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMovieCategoriesController = async (req, res, err) => {
  try {
    const categoryRepository = AppDataSource.getRepository("MovieCategory");
    const categories = await categoryRepository.find();
    return res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateMovieCategoryController = async (req, res, err) => {
  try {
    const { id } = req.params;
    const { categoryname } = req.body;

    const categoryRepository = AppDataSource.getRepository("MovieCategory");
    const category = await categoryRepository.findOne({
      where: { categoryid: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    categoryRepository.merge(category, { categoryname });
    const updatedCategory = await categoryRepository.save(category);

    return res.status(200).json({
      updateRecord: updatedCategory,
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
    const categoryRepository = AppDataSource.getRepository("MovieCategory");
    const category = await categoryRepository.findOne({
      where: { categoryid: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await categoryRepository.remove(category);
    return res.status(200).json({
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
    const categoryRepository = AppDataSource.getRepository("MovieCategory");
    const category = await categoryRepository.findOne({
      where: { categoryid: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
