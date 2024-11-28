const DayLog = require("../Models/DayStartAndCloseModel");
const Order = require("../Models/OrderSchema");

// Start Day
const startDay = async (req, res) => {
  const { restId } = req.body;

  try {
    const existingDay = await DayLog.findOne({
      restId,
      isClosed: false,
    });

    if (existingDay) {
      return res
        .status(400)
        .json({ message: "Day is already started for this restaurant." });
    }

    const newDay = new DayLog({
      restId,
      dayStart: new Date(),
    });

    await newDay.save();
    res
      .status(200)
      .json({ message: "Day started successfully!", data: newDay });
  } catch (error) {
    res.status(500).json({ message: "Error starting day.", error });
  }
};

// Close Day
const closeDay = async (req, res) => {
  const { restId } = req.body;

  try {
    const dayLog = await DayLog.findOne({
      restId,
      isClosed: false,
    });

    if (!dayLog) {
      return res
        .status(400)
        .json({ message: "No active day found for this restaurant." });
    }

    dayLog.dayClose = new Date();
    dayLog.isClosed = true;

    await dayLog.save();
    res.status(200).json({ message: "Day closed successfully!", data: dayLog });
  } catch (error) {
    res.status(500).json({ message: "Error closing day.", error });
  }
};

// Get Sales by Day
const getSalesByDay = async (req, res) => {
  const { restId } = req.query;

  try {
    const dayLog = await DayLog.findOne({
      restId,
      isClosed: false,
    });

    if (!dayLog) {
      return res
        .status(400)
        .json({ message: "No active day found for this restaurant." });
    }

    const { dayStart, dayClose } = dayLog;

    const sales = await Order.find({
      restId,
      createdAt: { $gte: dayStart, $lte: dayClose || new Date() },
    });

    const totalSales = sales.reduce((acc, order) => acc + order.totalAmount, 0);

    res.status(200).json({ sales, totalSales });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales.", error });
  }
};

// Get Sales by Date
const getSalesByDate = async (req, res) => {
  const { restId, date } = req.query;

  try {
    const startOfDate = new Date(date);
    const endOfDate = new Date(startOfDate);
    endOfDate.setHours(23, 59, 59, 999);

    const sales = await Order.find({
      restId,
      createdAt: { $gte: startOfDate, $lte: endOfDate },
    });

    const totalSales = sales.reduce((acc, order) => acc + order.totalAmount, 0);

    res.status(200).json({ sales, totalSales });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales.", error });
  }
};

module.exports = { startDay, closeDay, getSalesByDay, getSalesByDate };
