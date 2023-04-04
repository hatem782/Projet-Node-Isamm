const EventModel = require("../models/event.model");
const { filt_year_parser } = require("../functions/FiltYearParser");

const CreateEvent = async (req, res) => {
  try {
    const { eventDateDebut, eventDateFin, eventType } = req.body;

    const existEvent = await EventModel.findOne({
      eventDateDebut,
      eventType,
    });
    if (existEvent)
      return res.status(409).json({
        Message: "Event already exist",
        Success: false,
      });
    const newEvent = new EventModel(req.body);
    const createdEvent = await newEvent.save();
    return res.status(200).json({
      Message: "Event created suucessfully",
      Success: true,
      data: createdEvent,
    });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const UpdateEvent = async (req, res) => {
  try {
    const { _id } = req.params;
    const { eventDateDebut, eventDateFin, eventType, description, eventName } =
      req.body;

    const updateEvent = await EventModel.findOneAndUpdate(
      { _id },
      {
        $set: {
          eventDateDebut,
          eventDateFin,
          eventType,
          description,
          eventName,
        },
      },
      { new: true } // return new Event with update
    );
    if (!updateEvent) {
      return res.status(400).json({
        Message: "Failed to update Event",
        Success: false,
        data: updateEvent,
      });
    }
    return res
      .status(200)
      .json({ Message: "event updated successfully", data: updateEvent });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const DeleteEvent = async (req, res) => {
  try {
    const { _id } = req.params;
    const removeEvent = await EventModel.deleteOne({ _id });

    if (!removeEvent) {
      return res.status(400).json({ Message: "Failed to delete Event" });
    }
    return res.status(200).json({ Message: "Event deleted successfully" });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const GetAllEvents = async (req, res) => {
  const { saison } = req.query;
  let filter = await filt_year_parser({}, saison);
  try {
    const Events = await EventModel.find(filter);
    return res
      .status(200)
      .json({ Message: "Events found successfully ", data: Events });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

const GetOneEvent = async (req, res) => {
  try {
    const { _id } = req.params;

    const Event = await EventModel.findOne({ _id });
    return res
      .status(200)
      .json({ Message: "Event found successfully ", data: Event });
  } catch (error) {
    console.log("##########:", error);
    res.status(500).send({ Message: "Server Error", Error: error.message });
  }
};

module.exports = {
  CreateEvent,
  UpdateEvent,
  DeleteEvent,
  GetAllEvents,
  GetOneEvent,
};
