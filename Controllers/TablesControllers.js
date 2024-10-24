//requiring
const tables = require("../Models/TablesModel");
const counterAreas = require("../Models/CounterArea");

//this is for tesitng and home
const forTesting = async (req, res) => {
  res.send("i am for testing");
};

//this is for add table
const forAddTable = async (req, res) => {
  const { id } = req.params;
  const { tableNo } = req.body;

  console.log("table", tableNo);

  const CounterArea = await counterAreas.findById(id);
  const counterAreaData = {
    id: CounterArea._id,
    name: CounterArea.areaName,
  };

  console.log("counter area data", counterAreaData);

  const myTable = new tables({
    CounterArea: counterAreaData,
    tableNo,
  });

  const newTable = await myTable.save();

  console.log("new table", newTable);

  CounterArea.tables.push({
    id: newTable._id,
    name: newTable.tableNo,
  });

  await CounterArea.save();

  res.send(newTable);
};

//this is for edit table
const forEditTable = async (req, res) => {
  const { id } = req.params;
  const { talbeName } = req.body;
};

//exporting
module.exports = { forTesting, forAddTable, forEditTable };
