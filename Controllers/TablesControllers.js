//requiring
const tables = require("../Models/TablesModel");
const counterAreas = require("../Models/CounterArea");

//this is for get all tables
const forGetAllTables = async (req, res) => {
  try {
    const tablesData = await tables.find();
    res.status(200).json({ tablesData });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for add table
const forAddTable = async (req, res) => {
  const { id } = req.params;
  const { tableNo } = req.body;
  try {
    const CounterArea = await counterAreas.findById(id);
    const counterAreaData = {
      id: CounterArea._id,
      name: CounterArea.areaName,
    };

    const myTable = new tables({
      CounterArea: counterAreaData,
      tableNo,
    });

    const newTable = await myTable.save();

    CounterArea.tables.push({
      id: newTable._id,
      name: newTable.tableNo,
    });

    await CounterArea.save();
    res.status(201).json({ msg: "Table Added Successfully", newTable });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for edit table
const forEditTable = async (req, res) => {
  const { id } = req.params;
  const { tableNo } = req.body;
  try {
    let newTableData = {
      tableNo,
    };
    const newTable = await tables.findByIdAndUpdate(id, newTableData);
    res.status(200).json({ msg: "Table Updated Successfully", newTable });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for delete the table
const forDeleteTable = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTable = await tables.findByIdAndDelete(id);
    res.status(200).json({ msg: "Table Deleted Successfully", deletedTable });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//exporting
module.exports = { forAddTable, forEditTable, forGetAllTables, forDeleteTable };
