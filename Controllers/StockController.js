const stockSchema = require("../Models/StockItemsModal");
const Restaurant = require("../Models/RestaurentModel");

//this is for get all stock items
const forGetAllStockItems = async (req, res) => {
  try {
    const { id } = req.params;
    const restStockITems = await stockSchema
      .find({ "restaurent.id": id })
      .sort({ createdAt: -1 });
    if (!restStockITems || restStockITems.length === 0) {
      return res
        .status(404)
        .json({ message: "No Items found for this Restaurent." });
    }

    res.status(200).json({ restStockITems });
  } catch (err) {
    console.log("err data", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for add the stock item to the database
const forAddStockItemToDataBase = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, stock, alertQty, qtyType } = req.body;

    const myRestaurent = await Restaurant.findById(id);
    let restaurent = {
      id: myRestaurent._id,
    };

    const newStock = new stockSchema({
      restaurent: restaurent,
      name,
      stock,
      alertQty,
      qtyType,
    });
    await newStock.save();

    res.status(201).json({ msg: "Stock Item Add SuccessFully ", newStock });
  } catch (err) {
    console.log(
      "there is error in the add stock item to database function",
      err
    );
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for add quantity to the item
const forAddQuantityToItem = async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  const myItem = await stockSchema.findById(id);
  try {
    if (!myItem) {
      res.status(400).json({ msg: "Item Not Exist" });
    } else {
      myItem.stock = Number(myItem.stock) + Number(stock);

      await myItem.save();
      res.status(200).json({ msg: "Quantity Added Succssfully to item" });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting data for edit the item
const forGettingDataForEditItem = async (req, res) => {
  const { id } = req.params;
  try {
    const prevItemData = await stockSchema.findById(id);
    res.status(200).json(prevItemData);
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for edit the stock item
const forEditTheStockItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, stock, alertQty, qtyType } = req.body;

    const stcokData = {
      name,
      stock,
      alertQty,
      qtyType,
    };

    const updatedItem = await stockSchema.findByIdAndUpdate(id, stcokData);

    res.status(201).json({ msg: "Stock Item edit SuccessFully ", updatedItem });
  } catch (err) {
    console.log(
      "there is error in the add stock item to database function",
      err
    );
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for delete the stock item
const forDeleteTheStockItem = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await stockSchema.findByIdAndDelete(id);

    res.status(200).json({ msg: "Item Deleted Succssfully", deletedItem });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for exporting
module.exports = {
  forGetAllStockItems,
  forAddStockItemToDataBase,
  forAddQuantityToItem,
  forEditTheStockItem,
  forGettingDataForEditItem,
  forDeleteTheStockItem,
};
