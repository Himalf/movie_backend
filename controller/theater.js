const THEATER = require("../model/theater");

exports.createTheaterController = async (req, res) => {
  try {
    const { theater_name, theater_location } = req.body;

    const theater = new THEATER(theater_name, theater_location);
    const result = await theater.create();

    return res.status(201).json({
      result,
      msg: "Theater created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateTheaterController = async (req, res) => {
  try {
    const { id } = req.params;
    const { theater_name, theater_location } = req.body;

    const theater = new THEATER(theater_name, theater_location);
    const result = await theater.update(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Theater not found" });
    }

    return res.status(200).json({
      result,
      msg: "Theater updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteTheaterController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await THEATER.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Theater not found" });
    }

    return res.status(200).json({
      result,
      msg: "Theater deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllTheatersController = async (req, res) => {
  try {
    const result = await THEATER.getAll();
    return res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getTheaterByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await THEATER.getById(id);

    if (result[0].length === 0) {
      return res.status(404).json({ error: "Theater not found" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
