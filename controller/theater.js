const AppDataSource = require("../config/data-source");

exports.createTheaterController = async (req, res) => {
  try {
    const { theater_name, theater_location } = req.body;

    const theaterRepository = AppDataSource.getRepository("Theater");
    const newTheater = theaterRepository.create({
      theater_name,
      theater_location,
    });
    const savedTheater = await theaterRepository.save(newTheater);

    return res.status(201).json({
      result: savedTheater,
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

    const theaterRepository = AppDataSource.getRepository("Theater");
    const theater = await theaterRepository.findOne({
      where: { theaterid: parseInt(id) },
    });

    if (!theater) {
      return res.status(404).json({ error: "Theater not found" });
    }

    theaterRepository.merge(theater, { theater_name, theater_location });
    const updatedTheater = await theaterRepository.save(theater);

    return res.status(200).json({
      result: updatedTheater,
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
    const theaterRepository = AppDataSource.getRepository("Theater");
    const theater = await theaterRepository.findOne({
      where: { theaterid: parseInt(id) },
    });

    if (!theater) {
      return res.status(404).json({ error: "Theater not found" });
    }

    await theaterRepository.remove(theater);
    return res.status(200).json({
      msg: "Theater deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllTheatersController = async (req, res) => {
  try {
    const theaterRepository = AppDataSource.getRepository("Theater");
    const theaters = await theaterRepository.find();
    return res.status(200).json(theaters);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getTheaterByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const theaterRepository = AppDataSource.getRepository("Theater");
    const theater = await theaterRepository.findOne({
      where: { theaterid: parseInt(id) },
    });

    if (!theater) {
      return res.status(404).json({ error: "Theater not found" });
    }

    return res.status(200).json(theater);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
