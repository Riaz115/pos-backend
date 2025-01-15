const tables = require("../Models/TableModel");
const counterAreas = require("../Models/CounterArea");
const orders = require("../Models/OrderSchema");
const kots = require("../Models/KotSchema");
const Restaurents = require("../Models/RestaurentModel");
const allCounters = require("../Models/CounterModel");
const { v4: uuidv4 } = require("uuid");
const guests = require("../Models/RestGuestsModel");
const daysModel = require("../Models/DayStartAndCloseModel");
const allExpenses = require("../Models/ExpensesModel");
const allMenuItems = require("../Models/MenuItemModel");
const allStockItems = require("../Models/StockItemsModal");
const comboModel = require("../Models/ComboItemModel");
const voidedItemsModel = require("../Models/VoidedItemsModal");

//this is for add tables
const forAddTables = async (req, res) => {
  const { id } = req.params;
  const { tableNo, tableType } = req.body;
  try {
    let myArea = await counterAreas.findById(id).populate({
      path: "counter.id",
      populate: {
        path: "restaurent.id",
      },
    });

    const restData = myArea.counter?.id?.restaurent?.id || "N/A";
    const counterData = myArea?.counter?.id;

    const restaurent = {
      id: restData?.id,
      name: restData?.restName,
    };

    const Counter = {
      id: counterData?._id,
      name: counterData?.counterName,
    };

    let newCounterArea = {
      id: myArea._id,
      name: myArea.areaName,
    };

    const newTable = new tables({
      restaurent,
      Counter,
      counterArea: newCounterArea,
      tableNo,
      tableType,
    });

    const savedTable = await newTable.save();

    myArea.tables.push({
      id: savedTable._id,
    });

    await myArea.save();
    res.status(201).json({ msg: "Table Added Successfully", savedTable });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for get all tables
const forGetAllTables = async (req, res) => {
  const { id } = req.params;
  try {
    const allTables = await tables.find({ "counterArea.id": id });
    res.status(200).json({ allTables });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting total tables
const forGettingAllRestAllTables = async (req, res) => {
  try {
    const allTables = await tables.find();
    res.status(200).json({ allTables });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting over all all tables
const forGetAllRestaurentTables = async (req, res) => {
  const { restid } = req.params;

  try {
    const allTables = await tables.find({ "restaurent.id": restid });
    res.status(200).json({ allTables });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for get data for edit table
const forGetDataForEditTable = async (req, res) => {
  const { id } = req.params;
  try {
    const tableData = await tables.findById(id);
    res.status(200).json({ tableData });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for edit the table
const forEditTable = async (req, res) => {
  const { id } = req.params;
  const { tableNo } = req.body;
  try {
    const forNewTable = {
      tableNo,
    };
    const newTable = await tables.findByIdAndUpdate(id, forNewTable);
    res.status(200).json({ msg: "Table Updated Successfully", newTable });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for delete table
const forDeleteTable = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTable = await tables.findByIdAndDelete(id);
    res.status(200).json({ msg: "Table Deleted Successfully", deletedTable });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for add order function
const forAddOrderToTable = async (req, res) => {
  const { id } = req.params;
  const { persons } = req.body;
  const orderId = uuidv4();
  const orderNo = Math.floor(1000 + Math.random() * 9000);

  try {
    let forTable = await tables.findById(id);
    forTable.currentOrder.persons = persons;
    forTable.currentOrder.id = orderId;
    forTable.currentOrder.status = "running";
    forTable.currentOrder.orderType = forTable.tableType;
    forTable.currentOrder.orderNo = orderNo;
    await forTable.save();

    res.status(201).json({ msg: "order Added Successfully" });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for add takeAway Order
const forAddTakeAwayTable = async (req, res) => {
  const { id } = req.params;
  const { tableType } = req.body;
  const orderId = uuidv4();
  const tableNo = Math.floor(1000 + Math.random() * 9000);
  const orderNo = Math.floor(1000 + Math.random() * 9000);

  try {
    let myCounter = await allCounters.findById(id).populate({
      path: "restaurent.id",
    });

    if (!myCounter) {
      return res.status(404).json({ msg: "Counter not found" });
    }

    const restData = myCounter?.restaurent?.id || "N/A";

    const restaurent = {
      id: restData?.id,
      name: restData?.restName,
    };

    let newCounter = {
      id: myCounter._id,
      name: myCounter.counterName,
    };

    const newTable = new tables({
      restaurent,
      Counter: newCounter,
      tableNo,
      tableType,
    });

    const savedTable = await newTable.save();
    await myCounter.save();

    let forTable = await tables.findById(savedTable?._id);
    forTable.currentOrder.id = orderId;
    forTable.currentOrder.status = "running";
    forTable.currentOrder.orderType = forTable.tableType;
    forTable.currentOrder.orderNo = orderNo;
    await forTable.save();

    res.status(201).json({ msg: "Table Added Successfully", savedTable });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for the add kot to the order
let myNewKOT = {};
const forAddKotToOrder = async (req, res) => {
  const { id, restId } = req.params;
  const { orderItems, guestData, paymentMethod, amount, frontEndType, detail } =
    req.body;

  // Fetch all menu items
  const myAllMenuItems = await allMenuItems.find();
  const myAllStockItems = await allStockItems.find();

  const openDay = await daysModel.findOne({
    "restaurant.id": restId,
    isClosed: false,
  });

  let dayId;
  if (!openDay) {
    // res.status(400).json({ msg: "Please open the restaurent" });
  } else {
    dayId = openDay._id;
  }

  const table = await tables.findById(id).populate({
    path: "Counter.id",
    populate: {
      path: "restaurent.id",
    },
  });
  let restData = await Restaurents.findById(restId);
  let number = table.currentOrder.kots.length + 1;
  const kotNo = Math.floor(1000 + Math.random() * 9000);
  const newRestData = table?.Counter?.id?.restaurent?.id || "N/A";
  const counterData = table?.Counter?.id || "N/A";

  const restaurent = {
    id: restData?.id,
    name: restData?.restName,
  };

  const Counter = {
    id: counterData?._id,
    name: counterData?.counterName,
  };
  const forTableData = {
    id: table?._id,
    name: table?.tableNo,
  };

  if (restData?.payemtPreOrPost === "pre") {
    let deliverChargesForRemainingAmount = 0;
    let serviceChargeForRemainingAmount = 0;
    let forGstTexAmountOfRemaingAmount = 0;
    try {
      let newGuest = {};
      if (guestData) {
        newGuest = {
          id: guestData.id,
          name: guestData.name,
          email: guestData.email,
          phone: guestData.phone,
          gender: guestData.gender,
          address: guestData.address,
          age: guestData.age,
        };
      }

      let totalAmount = 0;

      if (orderItems) {
        //this is for manage stock

        if (restData?.stockManage === "yes") {
          for (const order of orderItems) {
            const { items, quantity: orderQuantity } = order;

            if (items && items.length > 0) {
              for (const subItem of items) {
                subItem.qty = subItem.qty * orderQuantity;

                const menuItem = myAllMenuItems.find(
                  (menu) => menu._id.toString() === subItem.id.toString()
                );

                if (menuItem) {
                  for (const stockItem of menuItem.stockItems) {
                    stockItem.qty = stockItem.qty * subItem.qty;

                    const filteredStockItem = myAllStockItems.find(
                      (stock) =>
                        stock._id.toString() === stockItem.id.toString()
                    );

                    if (filteredStockItem) {
                      if (
                        filteredStockItem.qtyType.toString() ===
                        stockItem.qtyType.toString()
                      ) {
                        filteredStockItem.stock -= stockItem.qty;
                      } else if (
                        filteredStockItem.qtyType === "kilogram" &&
                        stockItem.qtyType === "gram"
                      ) {
                        const withGram =
                          filteredStockItem.stock * 1000 - stockItem.qty;
                        filteredStockItem.stock = withGram / 1000;
                      } else if (
                        filteredStockItem.qtyType === "kilogram" &&
                        stockItem.qtyType === "milligram"
                      ) {
                        const withMilligram =
                          filteredStockItem.stock * 1000000 - stockItem.qty;
                        filteredStockItem.stock = withMilligram / 1000000;
                      } else if (
                        filteredStockItem.qtyType === "gram" &&
                        stockItem.qtyType === "milligram"
                      ) {
                        const withMilligram =
                          filteredStockItem.stock * 1000 - stockItem.qty;
                        filteredStockItem.stock = withMilligram / 1000;
                      } else if (
                        filteredStockItem.qtyType === "liter" &&
                        stockItem.qtyType === "milliliter"
                      ) {
                        const withMilliliter =
                          filteredStockItem.stock * 1000 - stockItem.qty;
                        filteredStockItem.stock = withMilliliter / 1000;
                      }

                      // Save the stock item synchronously
                      await filteredStockItem.save();
                    }
                  }
                }
              }
            } else {
              const orderedItemsDetails = myAllMenuItems.filter((menu) =>
                orderItems.some(
                  (order) => order.id.toString() === menu._id.toString()
                )
              );

              for (const item of orderedItemsDetails) {
                const orderItem = orderItems.find(
                  (order) => order.id.toString() === item._id.toString()
                );

                if (orderItem) {
                  for (const stockItem of item.stockItems) {
                    stockItem.qty = stockItem.qty * orderItem.quantity;

                    const filteredStockItem = myAllStockItems.find(
                      (stock) =>
                        stock._id.toString() === stockItem.id.toString()
                    );

                    if (filteredStockItem) {
                      if (
                        filteredStockItem.qtyType.toString() ===
                        stockItem.qtyType.toString()
                      ) {
                        filteredStockItem.stock -= stockItem.qty;
                      } else if (
                        filteredStockItem.qtyType === "kilogram" &&
                        stockItem.qtyType === "gram"
                      ) {
                        const withGram =
                          filteredStockItem.stock * 1000 - stockItem.qty;
                        filteredStockItem.stock = withGram / 1000;
                      } else if (
                        filteredStockItem.qtyType === "kilogram" &&
                        stockItem.qtyType === "milligram"
                      ) {
                        const withMilligram =
                          filteredStockItem.stock * 1000000 - stockItem.qty;
                        filteredStockItem.stock = withMilligram / 1000000;
                      } else if (
                        filteredStockItem.qtyType === "gram" &&
                        stockItem.qtyType === "milligram"
                      ) {
                        const withMilligram =
                          filteredStockItem.stock * 1000 - stockItem.qty;
                        filteredStockItem.stock = withMilligram / 1000;
                      } else if (
                        filteredStockItem.qtyType === "liter" &&
                        stockItem.qtyType === "milliliter"
                      ) {
                        const withMilliliter =
                          filteredStockItem.stock * 1000 - stockItem.qty;
                        filteredStockItem.stock = withMilliliter / 1000;
                      }

                      // Save the stock item synchronously
                      await filteredStockItem.save();
                    }
                  }
                }
              }
            }
          }
        } else {
          orderItems.map((item) => {
            if (item.items.length > 0) {
              item.items.map((dealItem) => {
                dealItem.qty = dealItem.qty * item.quantity;
              });
            }
          });
        }

        //this is end of the manage stock

        totalAmount = orderItems.reduce(
          (acc, item) => acc + item.totalPrice,
          0
        );

        table.currentOrder.subTotal =
          (table.currentOrder.subTotal || 0) + totalAmount;
        table.currentOrder.foodAmount =
          (table.currentOrder.foodAmount || 0) + totalAmount;

        if (table.currentOrder.discountType === "percentage") {
          let forDiscount =
            (table.currentOrder.subTotal *
              table?.currentOrder?.discountAmount) /
            100;
          table.currentOrder.discount = forDiscount;
          table.currentOrder.subTotal =
            table.currentOrder.subTotal - forDiscount;
        }

        //this is for service charges
        if (table.tableType === "dine-in") {
          let serviceCharge = 0;
          if (restData.typeOfServiceCharges === "percentage") {
            serviceCharge =
              (table.currentOrder.subTotal * restData.serviceChargesAmount) /
              100;
            serviceChargeForRemainingAmount =
              (totalAmount * restData.serviceChargesAmount) / 100;
          } else if (restData.typeOfServiceCharges === "number") {
            serviceCharge = restData.serviceChargesAmount;
            if (!table.currentOrder.serviceCharges) {
              serviceChargeForRemainingAmount = restData.serviceChargesAmount;
            }
          }
          table.currentOrder.serviceCharges = serviceCharge;
        }

        //this is for delivery charges
        if (table.tableType === "delivery") {
          let deliveryCharges = 0;
          if (restData.typeOfDeliveryCharges === "percentage") {
            deliveryCharges =
              (table.currentOrder.subTotal * restData.deliveryChargesAmount) /
              100;

            deliverChargesForRemainingAmount =
              (totalAmount * restData.deliveryChargesAmount) / 100;
          } else if (restData.typeOfDeliveryCharges === "number") {
            deliveryCharges = restData.deliveryChargesAmount;
            if (!table.currentOrder.deliveryCharges) {
              deliverChargesForRemainingAmount = restData.deliveryChargesAmount;
            }
          }
          table.currentOrder.deliveryCharges = deliveryCharges;
        }

        //this is for tex charges
        let foodTex = 0;
        if (restData.gstTexType === "percentage") {
          foodTex = (table.currentOrder.subTotal * restData.gstTexAmount) / 100;
          forGstTexAmountOfRemaingAmount =
            (totalAmount * restData.gstTexAmount) / 100;
        } else if (restData.gstTexType === "number") {
          foodTex = restData.gstTexAmount;
          if (!table.currentOrder.gstTex) {
            forGstTexAmountOfRemaingAmount = restData.gstTexAmount;
          }
        }
        table.currentOrder.gstTex = foodTex;

        //this is for total of all tables
        if (table.tableType === "dine-in") {
          table.currentOrder.totalAmount =
            table.currentOrder.subTotal +
            table.currentOrder.serviceCharges +
            table.currentOrder.gstTex;
          table.currentOrder.remainAmount =
            serviceChargeForRemainingAmount +
            forGstTexAmountOfRemaingAmount +
            totalAmount;
        } else if (table.tableType === "take-away") {
          table.currentOrder.totalAmount =
            table.currentOrder.subTotal + table.currentOrder.gstTex;
          table.currentOrder.remainAmount =
            forGstTexAmountOfRemaingAmount + totalAmount;
        } else if (table.tableType === "delivery") {
          table.currentOrder.totalAmount =
            table.currentOrder.subTotal +
            table.currentOrder.gstTex +
            table.currentOrder.deliveryCharges;
          table.currentOrder.remainAmount =
            deliverChargesForRemainingAmount +
            forGstTexAmountOfRemaingAmount +
            totalAmount;
        }

        //this is for add kot
        const newKOT = new kots({
          order: { id: table.currentOrder.id },
          table: table.tableNo,
          restaurent,
          Counter,
          number,
          totalItem: orderItems.length,
          tableData: forTableData,
          orderItems,
          orderTaker: req.user.name,
          grandTotal: totalAmount,
          guest: newGuest,
          orderType: table.tableType,
          kotNo: kotNo,
          kotOrderNo: table.currentOrder.orderNo,
          dayId,
        });

        table.currentOrder.guest = newGuest;
        await newKOT.save();
        myNewKOT = newKOT;
        table.currentOrder.kots.push(newKOT._id);
        await table.save();
      }

      if (isNaN(totalAmount)) {
        console.error("Invalid totalAmount value:", totalAmount);
        totalAmount = 0;
      }

      try {
        if (frontEndType === "multi") {
          if (!Array.isArray(table.currentOrder.paymentMethod)) {
            table.currentOrder.paymentMethod = [];
          }
          if (typeof paymentMethod === "string" && !isNaN(amount)) {
            if (paymentMethod === "credit") {
              if (table.currentOrder.guest) {
                table.currentOrder.credit =
                  table.currentOrder.remainAmount > amount
                    ? (table.currentOrder.credit || 0) + parseFloat(amount)
                    : (table.currentOrder.credit || 0) +
                      table.currentOrder.remainAmount;
              } else {
                res
                  .status(400)
                  .json({ msg: "please select guest for this credit amount" });
              }
            }

            table.currentOrder.paymentMethod.push({
              payMethod: paymentMethod,
              amount:
                table.currentOrder.remainAmount > amount
                  ? parseFloat(amount)
                  : table.currentOrder.remainAmount,
              payDetail: detail,
            });

            if (
              table.currentOrder.paidAmount !== undefined ||
              table.currentOrder.paidAmount !== 0
            ) {
              table.currentOrder.paidAmount =
                table.currentOrder.totalAmount -
                table.currentOrder.remainAmount;
            } else {
              table.currentOrder.paidAmount = parseFloat(amount);
            }

            table.currentOrder.remainAmount -= parseFloat(amount);
            if (
              table.currentOrder.remainAmount <= 0 &&
              amount > table.currentOrder.remainAmount
            ) {
              table.currentOrder.remainAmount = 0;
            }

            table.currentOrder.paidAmount =
              table.currentOrder.totalAmount - table.currentOrder.remainAmount;
            await table.save();
          } else {
            return res
              .status(400)
              .json({ msg: "Invalid payment method or amount", table });
          }
        } else {
          // Single payment handling
          if (!Array.isArray(table.currentOrder.paymentMethod)) {
            table.currentOrder.paymentMethod = [];
          }

          if (typeof paymentMethod === "string") {
            table.currentOrder.paymentMethod.push({
              payMethod: paymentMethod,
              amount: table.currentOrder.remainAmount,
            });
            table.currentOrder.status = "running";
            table.currentOrder.paidAmount =
              (table.currentOrder.paidAmount || 0) +
              table.currentOrder.remainAmount;
            table.currentOrder.remainAmount = 0;
            await table.save();
          } else {
            return res
              .status(400)
              .json({ msg: "Invalid payment method", table });
          }
        }

        //this is for checking if ramin amount is greater than 0
        if (table.currentOrder.remainAmount > 0) {
          return res
            .status(400)
            .json({ msg: "please enter total amount", table });
        }

        res
          .status(201)
          .json({ msg: "Payment method added successfully", table, myNewKOT });
      } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error", error: err.message });
      }
    } catch (err) {
      console.log("err", err);
      res.status(500).json({ msg: "Server Error", err });
    }
  } else if (restData?.payemtPreOrPost === "post") {
    try {
      //this is for manage stock
      if (restData?.stockManage === "yes") {
        for (const order of orderItems) {
          const { items, quantity: orderQuantity } = order;

          if (items && items.length > 0) {
            for (const subItem of items) {
              subItem.qty = subItem.qty * orderQuantity;

              const menuItem = myAllMenuItems.find(
                (menu) => menu._id.toString() === subItem.id.toString()
              );

              if (menuItem) {
                for (const stockItem of menuItem.stockItems) {
                  stockItem.qty = stockItem.qty * subItem.qty;

                  const filteredStockItem = myAllStockItems.find(
                    (stock) => stock._id.toString() === stockItem.id.toString()
                  );

                  if (filteredStockItem) {
                    if (
                      filteredStockItem.qtyType.toString() ===
                      stockItem.qtyType.toString()
                    ) {
                      filteredStockItem.stock -= stockItem.qty;
                    } else if (
                      filteredStockItem.qtyType === "kilogram" &&
                      stockItem.qtyType === "gram"
                    ) {
                      const withGram =
                        filteredStockItem.stock * 1000 - stockItem.qty;
                      filteredStockItem.stock = withGram / 1000;
                    } else if (
                      filteredStockItem.qtyType === "kilogram" &&
                      stockItem.qtyType === "milligram"
                    ) {
                      const withMilligram =
                        filteredStockItem.stock * 1000000 - stockItem.qty;
                      filteredStockItem.stock = withMilligram / 1000000;
                    } else if (
                      filteredStockItem.qtyType === "gram" &&
                      stockItem.qtyType === "milligram"
                    ) {
                      const withMilligram =
                        filteredStockItem.stock * 1000 - stockItem.qty;
                      filteredStockItem.stock = withMilligram / 1000;
                    } else if (
                      filteredStockItem.qtyType === "liter" &&
                      stockItem.qtyType === "milliliter"
                    ) {
                      const withMilliliter =
                        filteredStockItem.stock * 1000 - stockItem.qty;
                      filteredStockItem.stock = withMilliliter / 1000;
                    }

                    // Save the stock item synchronously
                    await filteredStockItem.save();
                  }
                }
              }
            }
          } else {
            const orderedItemsDetails = myAllMenuItems.filter((menu) =>
              orderItems.some(
                (order) => order.id.toString() === menu._id.toString()
              )
            );

            for (const item of orderedItemsDetails) {
              const orderItem = orderItems.find(
                (order) => order.id.toString() === item._id.toString()
              );

              if (orderItem) {
                for (const stockItem of item.stockItems) {
                  stockItem.qty = stockItem.qty * orderItem.quantity;

                  const filteredStockItem = myAllStockItems.find(
                    (stock) => stock._id.toString() === stockItem.id.toString()
                  );

                  if (filteredStockItem) {
                    if (
                      filteredStockItem.qtyType.toString() ===
                      stockItem.qtyType.toString()
                    ) {
                      filteredStockItem.stock -= stockItem.qty;
                    } else if (
                      filteredStockItem.qtyType === "kilogram" &&
                      stockItem.qtyType === "gram"
                    ) {
                      const withGram =
                        filteredStockItem.stock * 1000 - stockItem.qty;
                      filteredStockItem.stock = withGram / 1000;
                    } else if (
                      filteredStockItem.qtyType === "kilogram" &&
                      stockItem.qtyType === "milligram"
                    ) {
                      const withMilligram =
                        filteredStockItem.stock * 1000000 - stockItem.qty;
                      filteredStockItem.stock = withMilligram / 1000000;
                    } else if (
                      filteredStockItem.qtyType === "gram" &&
                      stockItem.qtyType === "milligram"
                    ) {
                      const withMilligram =
                        filteredStockItem.stock * 1000 - stockItem.qty;
                      filteredStockItem.stock = withMilligram / 1000;
                    } else if (
                      filteredStockItem.qtyType === "liter" &&
                      stockItem.qtyType === "milliliter"
                    ) {
                      const withMilliliter =
                        filteredStockItem.stock * 1000 - stockItem.qty;
                      filteredStockItem.stock = withMilliliter / 1000;
                    }

                    // Save the stock item synchronously
                    await filteredStockItem.save();
                  }
                }
              }
            }
          }
        }
      } else {
        orderItems.map((item) => {
          if (item.items.length > 0) {
            item.items.map((dealItem) => {
              dealItem.qty = dealItem.qty * item.quantity;
            });
          }
        });
      }

      //this is the end of the manage stock function
      let newGuest = {};
      if (guestData) {
        newGuest = {
          id: guestData.id,
          name: guestData.name,
          email: guestData.email,
          phone: guestData.phone,
          gender: guestData.gender,
          address: guestData.address,
          age: guestData.age,
        };
      }

      const totalAmount = orderItems.reduce(
        (acc, item) => acc + item.totalPrice,
        0
      );
      if (isNaN(totalAmount)) {
        console.error("Invalid totalAmount value:", totalAmount);
        totalAmount = 0;
      }
      table.currentOrder.subTotal =
        (table.currentOrder.subTotal || 0) + totalAmount;
      table.currentOrder.foodAmount =
        (table.currentOrder.foodAmount || 0) + totalAmount;

      if (table.currentOrder.discountType === "percentage") {
        let forDiscount =
          (table.currentOrder.subTotal * table?.currentOrder?.discountAmount) /
          100;
        table.currentOrder.discount = forDiscount;
        table.currentOrder.subTotal = table.currentOrder.subTotal - forDiscount;
      }

      const newKOT = new kots({
        order: { id: table.currentOrder.id },
        table: table.tableNo,
        number,
        restaurent,
        Counter,
        totalItem: orderItems.length,
        tableData: forTableData,
        orderItems,
        orderTaker: req.user.name,
        guest: newGuest,
        grandTotal: totalAmount,
        orderType: table.tableType,
        kotNo: kotNo,
        kotOrderNo: table.currentOrder.orderNo,
        dayId,
      });
      table.currentOrder.status = "running";
      table.currentOrder.guest = newGuest;
      await table.save();
      await newKOT.save();

      //this is for service charges
      if (table.tableType === "dine-in") {
        let serviceCharge = 0;
        if (restData.typeOfServiceCharges === "percentage") {
          serviceCharge =
            (table.currentOrder.subTotal * restData.serviceChargesAmount) / 100;
        } else if (restData.typeOfServiceCharges === "number") {
          serviceCharge = restData.serviceChargesAmount;
        }
        table.currentOrder.serviceCharges = serviceCharge;
      }
      //this is for delivery charges
      if (table.tableType === "delivery") {
        let deliveryCharges = 0;
        if (restData.typeOfDeliveryCharges === "percentage") {
          deliveryCharges =
            (table.currentOrder.subTotal * restData.deliveryChargesAmount) /
            100;
        } else if (restData.typeOfDeliveryCharges === "number") {
          deliveryCharges = restData.deliveryChargesAmount;
        }
        table.currentOrder.deliveryCharges = deliveryCharges;
      }
      //this is for tex charges
      let foodTex = 0;
      if (restData.gstTexType === "percentage") {
        foodTex = (table.currentOrder.subTotal * restData.gstTexAmount) / 100;
      } else if (restData.gstTexType === "number") {
        foodTex = restData.gstTexAmount;
      }
      table.currentOrder.gstTex = foodTex;
      //this is for total of all tables
      if (table.tableType === "dine-in") {
        table.currentOrder.totalAmount =
          table.currentOrder.subTotal +
          table.currentOrder.serviceCharges +
          table.currentOrder.gstTex;
      } else if (table.tableType === "take-away") {
        table.currentOrder.totalAmount =
          table.currentOrder.subTotal + table.currentOrder.gstTex;
      } else if (table.tableType === "delivery") {
        table.currentOrder.totalAmount =
          table.currentOrder.subTotal +
          table.currentOrder.gstTex +
          table.currentOrder.deliveryCharges;
      }
      table.currentOrder.remainAmount = table.currentOrder.totalAmount;
      await table.save();
      // Add KOT to current order
      table.currentOrder.kots.push(newKOT._id);

      await table.save();
      res
        .status(201)
        .json({ message: "KOT added to current order", newKOT, table });
    } catch (err) {
      console.log("err", err);
      res.status(500).json({ msg: "Server Error", err });
    }
  }
};

//this is for gettting all orders
const forGettingAllOrders = async (req, res) => {
  try {
    const allOrders = await orders.find();
    res.status(200).json({ allOrders });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting restaurent all ordes
const forGetRestaurentAllOrders = async (req, res) => {
  const { id } = req.params;
  const allOrders = await orders.find();

  try {
    const myFilterOrders = allOrders
      .filter((order) => order.restaurent.id === id)
      .sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({ msg: "success data", myFilterOrders });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting all items of current order
const forGettingAllItemsOfOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const table = await tables.findById(id).populate({
      path: "currentOrder.kots",
      populate: { path: "orderItems" },
    });

    let allItems = [];

    for (const kot of table.currentOrder.kots) {
      if (Array.isArray(kot.orderItems)) {
        for (const item of kot.orderItems) {
          const existingItemIndex = allItems.findIndex(
            (existingItem) =>
              existingItem.id &&
              item.id &&
              existingItem.id.toString() === item.id.toString()
          );

          if (existingItemIndex > -1) {
            allItems[existingItemIndex].quantity += item.quantity;
            allItems[existingItemIndex].totalPrice += item.totalPrice;
          } else {
            allItems.push(item);
          }
        }
      } else {
        console.warn(
          `KOT with ID ${kot._id} has no orderItems or is not an array.`
        );
      }
    }

    res.status(200).json({ allItems });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting all kots
// const forGettingAllKots = async (req, res) => {
//   try {
//     const allKots = await kots.find();
//     res.status(200).json({ allKots });
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error", err });
//   }
// };

const forGettingAllKots = async (req, res) => {
  try {
    const { id } = req.params;
    const allKots = await kots.find({ "restaurent.id": id });
    res.status(200).json({ allKots });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for adding parcel charges
const forParcelCharges = async (req, res) => {
  const { id, restId } = req.params;
  const { parcel } = req.body;
  const table = await tables.findById(id);
  let restData = await Restaurents.findById(restId);

  try {
    if (table.currentOrder.parcel === 0) {
      const parcelAmount = Number(parcel);
      const currentTotalAmount = Number(table.currentOrder.totalAmount);
      table.currentOrder.parcel = parcelAmount;
      table.currentOrder.subTotal = currentTotalAmount + parcelAmount;
    } else {
      table.currentOrder.subTotal =
        table.currentOrder.subTotal - table.currentOrder.parcel;
      const parcelAmount = Number(parcel);
      const currentTotalAmount = Number(table.currentOrder.subTotal);
      table.currentOrder.parcel = parcelAmount;
      table.currentOrder.subTotal = currentTotalAmount + parcelAmount;
    }

    //this is for service charges
    if (table?.tableType === "dine-in") {
      if (table.currentOrder.isServiceCharges !== "no") {
        let serviceCharge = 0;
        if (restData.typeOfServiceCharges === "percentage") {
          serviceCharge =
            (table.currentOrder.subTotal * restData.serviceChargesAmount) / 100;
        } else if (restData.typeOfServiceCharges === "number") {
          serviceCharge = restData.serviceChargesAmount;
        }
        table.currentOrder.serviceCharges = serviceCharge;
      }
    }

    //this is for delivery charges
    if (table.tableType === "delivery") {
      let deliveryCharges = 0;
      if (restData.typeOfDeliveryCharges === "percentage") {
        deliveryCharges =
          (table.currentOrder.subTotal * restData.deliveryChargesAmount) / 100;
      } else if (restData.typeOfDeliveryCharges === "number") {
        deliveryCharges = restData.deliveryChargesAmount;
      }
      table.currentOrder.deliveryCharges = deliveryCharges;
    }

    //this is for tex charges
    if (table.currentOrder.isGstTex !== "no") {
      let foodTex = 0;
      if (restData.gstTexType === "percentage") {
        foodTex = (table.currentOrder.subTotal * restData.gstTexAmount) / 100;
      } else if (restData.gstTexType === "number") {
        foodTex = restData.gstTexAmount;
      }
      table.currentOrder.gstTex = foodTex;
    }

    //this is for total of all tables
    if (table.tableType === "dine-in") {
      table.currentOrder.totalAmount =
        table.currentOrder.subTotal +
        table.currentOrder.serviceCharges +
        table.currentOrder.gstTex;
    } else if (table.tableType === "take-away") {
      table.currentOrder.totalAmount =
        table.currentOrder.subTotal + table.currentOrder.gstTex;
    } else if (table.tableType === "delivery") {
      table.currentOrder.totalAmount =
        table.currentOrder.subTotal +
        table.currentOrder.gstTex +
        table.currentOrder.deliveryCharges;
    }
    table.currentOrder.remainAmount = table.currentOrder.totalAmount;
    await table.save();
    res.status(200).json({ msg: "Parcel Added successfully" });
  } catch (err) {
    console.log("there is error in the add parcel charges funcion", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for order invocie
const forOrderInvoice = async (req, res) => {
  const { id } = req.params;
  const { guestData } = req.body;
  const table = await tables.findById(id);

  try {
    if (guestData) {
      let newGuest = {
        id: guestData.id,
        name: guestData.name,
        email: guestData.email,
        phone: guestData.phone,
        gender: guestData.gender,
        address: guestData.address,
        age: guestData.age,
      };

      table.currentOrder.guest = newGuest;
    }

    table.currentOrder.status = "invoiced";
    table.save();
    res.status(200).json({ msg: "Invoiced successfully" });
  } catch (err) {
    console.log("servererror", err);
    res.status(500).json({ msg: "Server err", err });
  }
};

//this is for discount
const forDiscount = async (req, res) => {
  const { id, restId } = req.params;
  const { discountType, discount } = req.body;
  let table = await tables.findById(id);
  let restData = await Restaurents.findById(restId);

  try {
    let forDiscount = 0;
    table.currentOrder.discountAmount = discount;
    if (table.currentOrder.discount === 0) {
      table.currentOrder.discountType = discountType;
      if (discountType === "number") {
        table.currentOrder.discount = discount;
        if (table.currentOrder.subTotal > discount) {
          table.currentOrder.subTotal = table.currentOrder.subTotal - discount;
        } else {
          res
            .status(400)
            .json({ msg: "Please Enter Discount Less than total amount" });
          return;
        }
      } else if (discountType === "percentage") {
        if (discount < 0 || discount > 100) {
          res.status(400).json({
            msg: "Please Enter Discount Percentage between 0 to 100 ",
          });
          return;
        } else {
          forDiscount = (table.currentOrder.subTotal * discount) / 100;
          table.currentOrder.discount = forDiscount;
          table.currentOrder.subTotal =
            table.currentOrder.subTotal - forDiscount;
        }
      }
    } else {
      if (table.currentOrder.subTotal > discount) {
        table.currentOrder.subTotal =
          table.currentOrder.subTotal + table.currentOrder.discount;
        table.currentOrder.discountType = discountType;
      } else {
        res.status(400).json({
          msg: "Please Enter Discount Amount Less Than Total Amount",
        });
        return;
      }

      if (discountType === "number") {
        if (table.currentOrder.subTotal > discount) {
          table.currentOrder.discount = discount;
          table.currentOrder.subTotal = table.currentOrder.subTotal - discount;
        } else {
          res.status(400).json({
            msg: "Please Enter Discount Amount Less Than Total Amount",
          });
          return;
        }
      } else if (discountType === "percentage") {
        if (discount < 0 || discount > 100) {
          res.status(400).json({
            msg: "Please Enter Discount Percentage between 0 to 100 ",
          });
          return;
        } else {
          forDiscount = (table.currentOrder.subTotal * discount) / 100;
          table.currentOrder.discount = forDiscount;
          table.currentOrder.subTotal =
            table.currentOrder.subTotal - forDiscount;
        }
      }
    }

    //this is for service charges
    if (table?.tableType === "dine-in") {
      if (table.currentOrder.isServiceCharges !== "no") {
        let serviceCharge = 0;
        if (restData.typeOfServiceCharges === "percentage") {
          serviceCharge =
            (table.currentOrder.subTotal * restData.serviceChargesAmount) / 100;
        } else if (restData.typeOfServiceCharges === "number") {
          serviceCharge = restData.serviceChargesAmount;
        }
        table.currentOrder.serviceCharges = serviceCharge;
      }
    }

    //this is for delivery charges
    if (table.tableType === "delivery") {
      let deliveryCharges = 0;
      if (restData.typeOfDeliveryCharges === "percentage") {
        deliveryCharges =
          (table.currentOrder.subTotal * restData.deliveryChargesAmount) / 100;
      } else if (restData.typeOfDeliveryCharges === "number") {
        deliveryCharges = restData.deliveryChargesAmount;
      }
      table.currentOrder.deliveryCharges = deliveryCharges;
    }

    //this is for tex charges
    if (table.currentOrder.isGstTex !== "no") {
      let foodTex = 0;
      if (restData.gstTexType === "percentage") {
        foodTex = (table.currentOrder.subTotal * restData.gstTexAmount) / 100;
      } else if (restData.gstTexType === "number") {
        foodTex = restData.gstTexAmount;
      }
      table.currentOrder.gstTex = foodTex;
    }

    //this is for total of all tables
    if (table.tableType === "dine-in") {
      table.currentOrder.totalAmount =
        table.currentOrder.subTotal +
        table.currentOrder.serviceCharges +
        table.currentOrder.gstTex;
    } else if (table.tableType === "take-away") {
      table.currentOrder.totalAmount =
        table.currentOrder.subTotal + table.currentOrder.gstTex;
    } else if (table.tableType === "delivery") {
      table.currentOrder.totalAmount =
        table.currentOrder.subTotal +
        table.currentOrder.gstTex +
        table.currentOrder.deliveryCharges;
    }
    table.currentOrder.remainAmount = table.currentOrder.totalAmount;
    await table.save();

    res.status(200).json({ msg: "discount successfully" });
  } catch (err) {
    console.log("err ", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for removing and adding deliver charges
const forRemoveAndAddServiceCharges = async (req, res) => {
  const { id, restId } = req.params;
  const { isServiceCharges } = req.body;
  let table = await tables.findById(id);
  let restData = await Restaurents.findById(restId);

  try {
    if (table.tableType === "dine-in") {
      table.currentOrder.isServiceCharges = isServiceCharges;

      if (isServiceCharges === "no") {
        table.currentOrder.totalAmount =
          table.currentOrder.totalAmount - table.currentOrder.serviceCharges;
        table.currentOrder.serviceCharges = 0;
      } else if (isServiceCharges === "yes") {
        let serviceCharge = 0;
        if (restData.typeOfServiceCharges === "percentage") {
          serviceCharge =
            (table.currentOrder.subTotal * restData.serviceChargesAmount) / 100;
          table.currentOrder.totalAmount =
            table.currentOrder.totalAmount + serviceCharge;
        } else if (restData.typeOfServiceCharges === "number") {
          serviceCharge = restData.serviceChargesAmount;
          table.currentOrder.serviceCharges = serviceCharge;
          table.currentOrder.totalAmount =
            table.currentOrder.totalAmount + table.currentOrder.serviceCharges;
        }
      }

      table.currentOrder.totalAmount =
        table.currentOrder.totalAmount + table.currentOrder.serviceCharges;
      table.currentOrder.remainAmount = table.currentOrder.totalAmount;
      await table.save();

      res.status(200).json({ msg: "service charges  successfully" });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for gst tex add and remove
const forAddAndRemoveGstTex = async (req, res) => {
  const { id, restId } = req.params;
  const { isGstTex } = req.body;

  try {
    const table = await tables.findById(id);
    const restData = await Restaurents.findById(restId);

    if (!table || !restData) {
      return res.status(404).json({ msg: "Table or Restaurant not found" });
    }

    const { currentOrder } = table;
    currentOrder.subTotal = currentOrder.subTotal || 0;
    currentOrder.serviceCharges = currentOrder.serviceCharges || 0;
    currentOrder.gstTex = currentOrder.gstTex || 0;

    currentOrder.isGstTex = isGstTex;

    if (isGstTex === "no") {
      currentOrder.totalAmount -= currentOrder.gstTex;
      currentOrder.gstTex = 0;
    } else {
      let foodTex = 0;
      if (restData.gstTexType === "percentage") {
        foodTex = (currentOrder.subTotal * restData.gstTexAmount) / 100;
      } else if (restData.gstTexType === "number") {
        foodTex = restData.gstTexAmount;
      }

      currentOrder.gstTex = foodTex;
      currentOrder.totalAmount = currentOrder.totalAmount + currentOrder.gstTex;
    }

    if (isNaN(currentOrder.totalAmount)) {
      throw new Error("Invalid totalAmount calculation: result is NaN");
    }
    table.currentOrder.remainAmount = table.currentOrder.totalAmount;
    await table.save();

    res.status(200).json({ msg: "Service charges updated successfully" });
  } catch (err) {
    console.error("Error in forAddAndRemoveGstTex:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

//this is for save current order to table order
const currentOrderSaveAsOrderToTable = async (req, res) => {
  const { id } = req.params;
  const { paymentMethod, amount, frontEndType, detail } = req.body;
  let allOrders = await orders.find();
  const myNewTable = await tables.findById(id);

  // Populate based on tableType
  const table = await tables.findById(id).populate(
    myNewTable.tableType === "dine-in"
      ? {
          path: "counterArea.id",
          populate: {
            path: "counter.id",
            populate: {
              path: "restaurent.id",
            },
          },
        }
      : {
          path: "Counter.id",
          populate: {
            path: "restaurent.id",
          },
        }
  );

  if (!table) {
    return res.status(404).json({ msg: "Table not found" });
  }

  const myGuest = await guests.findById(table?.currentOrder?.guest?.id);

  let restData = "N/A";
  let counterData = "N/A";
  let areaData = "N/A";

  if (myNewTable.tableType === "dine-in") {
    restData = table?.counterArea?.id?.counter?.id?.restaurent?.id || "N/A";
    counterData = table?.counterArea?.id?.counter?.id || "N/A";
    areaData = table?.counterArea?.id || "N/A";
  } else {
    restData = table?.Counter?.id?.restaurent?.id || "N/A";
    counterData = table?.Counter?.id || "N/A";
  }

  const openDay = await daysModel.findOne({
    "restaurant.id": restData?.id,
    isClosed: false,
  });

  let dayId;
  if (!openDay) {
    res.status(400).json({ msg: "Please open the restaurent" });
  } else {
    dayId = openDay._id;
  }

  const restaurent = {
    id: restData?.id,
    name: restData?.restName,
  };

  const counter = {
    id: counterData?._id,
    name: counterData?.counterName,
  };

  const counterArea = {
    id: areaData?.id,
    name: areaData?.areaName,
  };

  try {
    if (restData?.payemtPreOrPost === "pre") {
      table.currentOrder.status = "completed";
      table.currentOrder.guest.credit = table.currentOrder.credit;

      await table.save();

      const newOrder = new orders({
        table: {
          id: table._id,
          name: table?.tableNo,
        },
        dayId,
        id: table.currentOrder.id,
        persons: table.currentOrder.persons,
        kots: table.currentOrder.kots,
        status: table.currentOrder.status,
        discountType: table.currentOrder.discountType,
        discount: table.currentOrder.discount,
        isServiceCharges: table.currentOrder.isServiceCharges,
        isGstTex: table.currentOrder.isGstTex,
        serviceCharges: table.currentOrder.serviceCharges,
        gstTex: table.currentOrder.gstTex,
        parcel: table.currentOrder.parcel,
        subTotal: table.currentOrder.subTotal,
        totalAmount: table.currentOrder.totalAmount,
        paymentMethod: JSON.stringify(table.currentOrder.paymentMethod),
        foodAmount: table.currentOrder.foodAmount,
        date: table.currentOrder.date,
        orderTaker: req.user.name,
        restaurent,
        counter,
        counterArea,
        invoiceNo: table.currentOrder.orderNo,
        guest: table.currentOrder.guest,
        orderType: table.tableType,
        deliveryCharges: table.currentOrder.deliveryCharges,
        credit: table.currentOrder.credit,
      });

      await newOrder.save();
      if (myGuest && table.currentOrder.credit) {
        const detailForGuestCredit = {
          orderNo: newOrder.invoiceNo,
          totalAmount: newOrder.totalAmount,
          orderid: newOrder._id,
          paidAmount:
            table?.currentOrder?.totalAmount > table?.currentOrder?.credit
              ? table?.currentOrder?.totalAmount - table?.currentOrder?.credit
              : 0,
          creditAmount: table?.currentOrder?.credit,
        };

        myGuest.totalCredit = myGuest.totalCredit + table.currentOrder.credit;
        myGuest.creditOrdersDetail.push(detailForGuestCredit);

        await myGuest.save();
      }

      table.orders.push({ id: newOrder._id });

      table.currentOrder = {
        id: null,
        persons: null,
        kots: [],
        status: "empty",
        gstTex: 0,
        guest: {},
        serviceCharges: 0,
        discountType: null,
        discount: null,
        parcel: null,
        subTotal: 0,
        totalAmount: 0,
        paymentMethod: [],
        remainAmount: 0,
        date: Date.now(),
      };
      await table.save();

      res.status(201).json({ msg: "Order Added Successfuuly" });
    } else {
      if (frontEndType === "multi") {
        if (!Array.isArray(table.currentOrder.paymentMethod)) {
          table.currentOrder.paymentMethod = [];
        }
        if (typeof paymentMethod === "string" && !isNaN(amount)) {
          if (paymentMethod === "credit") {
            if (table.currentOrder.guest) {
              table.currentOrder.credit =
                table.currentOrder.remainAmount > amount
                  ? (table.currentOrder.credit || 0) + parseFloat(amount)
                  : (table.currentOrder.credit || 0) +
                    table.currentOrder.remainAmount;

              table.currentOrder.paymentMethod.push({
                payMethod: paymentMethod,
                amount:
                  table.currentOrder.remainAmount > parseFloat(amount)
                    ? parseFloat(amount)
                    : table.currentOrder.remainAmount,
                payDetail: detail,
              });
            } else {
              res.status(400).json({
                msg: "Please select guest for this testing and checking debit amount",
              });
            }
          } else {
            table.currentOrder.paymentMethod.push({
              payMethod: paymentMethod,
              amount:
                table.currentOrder.remainAmount > parseFloat(amount)
                  ? parseFloat(amount)
                  : table.currentOrder.remainAmount,
              payDetail: detail,
            });
          }

          if (
            table.currentOrder.paidAmount !== undefined ||
            table.currentOrder.paidAmount !== 0
          ) {
            table.currentOrder.paidAmount =
              table.currentOrder.totalAmount - table.currentOrder.remainAmount;
          } else {
            table.currentOrder.paidAmount = parseFloat(amount);
          }

          table.currentOrder.remainAmount -= parseFloat(amount);
          if (table.currentOrder.remainAmount <= 0) {
            table.currentOrder.remainAmount = 0;
          }

          table.currentOrder.paidAmount =
            table.currentOrder.totalAmount - table.currentOrder.remainAmount;
        } else {
          return res
            .status(400)
            .json({ msg: "Invalid payment method or amount", table });
        }
      } else {
        if (!Array.isArray(table.currentOrder.paymentMethod)) {
          table.currentOrder.paymentMethod = [];
        }

        if (typeof paymentMethod === "string") {
          table.currentOrder.paymentMethod.push({
            payMethod: paymentMethod,
            amount: table.currentOrder.remainAmount,
          });
          table.currentOrder.remainAmount = 0;
        }
      }

      await table.save();

      if (table?.currentOrder?.remainAmount === 0) {
        table.currentOrder.status = "completed";
        table.currentOrder.guest.credit = table.currentOrder.credit;
        await table.save();

        const newOrder = new orders({
          table: {
            id: table._id,
            name: table?.tableNo,
          },
          dayId,
          id: table.currentOrder.id,
          persons: table.currentOrder.persons,
          kots: table.currentOrder.kots,
          status: table.currentOrder.status,
          discountType: table.currentOrder.discountType,
          discount: table.currentOrder.discount,
          isServiceCharges: table.currentOrder.isServiceCharges,
          isGstTex: table.currentOrder.isGstTex,
          serviceCharges: table.currentOrder.serviceCharges,
          gstTex: table.currentOrder.gstTex,
          parcel: table.currentOrder.parcel,
          subTotal: table.currentOrder.subTotal,
          totalAmount: table.currentOrder.totalAmount,
          paymentMethod: JSON.stringify(table.currentOrder.paymentMethod),
          foodAmount: table.currentOrder.foodAmount,
          date: table.currentOrder.date,
          orderTaker: req.user.name,
          restaurent,
          counter,
          counterArea,
          invoiceNo: table.currentOrder.orderNo,
          guest: table.currentOrder.guest,
          orderType: table.tableType,
          deliveryCharges: table.currentOrder.deliveryCharges,
          credit: table.currentOrder.credit,
        });

        if (table?.currentOrder?.guest && table.currentOrder.credit) {
          const detailForGuestCredit = {
            orderNo: newOrder.invoiceNo,
            totalAmount: newOrder.totalAmount,
            orderid: newOrder._id,
            paidAmount:
              table?.currentOrder?.totalAmount > table?.currentOrder?.credit
                ? table?.currentOrder?.totalAmount - table?.currentOrder?.credit
                : 0,
            creditAmount: table?.currentOrder?.credit,
          };

          myGuest.totalCredit = myGuest.totalCredit + table.currentOrder.credit;
          myGuest.creditOrdersDetail.push(detailForGuestCredit);

          await myGuest.save();
        }

        await newOrder.save();
        table.orders.push({ id: newOrder._id });

        table.currentOrder = {
          id: null,
          persons: null,
          kots: [],
          status: "empty",
          gstTex: 0,
          guest: {},
          serviceCharges: 0,
          discountType: null,
          discount: null,
          parcel: null,
          subTotal: 0,
          totalAmount: 0,
          paymentMethod: [],
          remainAmount: 0,
          date: Date.now(),
        };
        await table.save();

        res.status(201).json({ msg: "Order Added Successfuuly", table });
      } else {
        res.status(400).json({ msg: "Order Already Exist", table });
      }
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for add payment method to the order
let myIndex = 0;
const forAddPaymentMethodToTheOrder = async (req, res) => {
  const { id } = req.params;
  const { paymentMethod, amount, frontEndType, detail } = req.body;

  try {
    const table = await tables.findById(id);

    if (!table) {
      return res.status(404).json({ msg: "Table not found" });
    }

    if (frontEndType === "multi") {
      myIndex = myIndex + 1;
      if (myIndex === 1) {
        table.currentOrder.paymentMethod = [];
        table.currentOrder.paidAmount = 0;
        table.currentOrder.credit = 0;
      }
      if (!Array.isArray(table.currentOrder.paymentMethod)) {
        table.currentOrder.paymentMethod = [];
      }
      if (typeof paymentMethod === "string" && !isNaN(amount)) {
        if (paymentMethod === "credit") {
          if (table.currentOrder.guest) {
            table.currentOrder.credit =
              table.currentOrder.remainAmount > amount
                ? (table.currentOrder.credit || 0) + parseFloat(amount)
                : (table.currentOrder.credit || 0) +
                  table.currentOrder.remainAmount;
          } else {
            res
              .status(400)
              .json({ msg: "please select guest for this credit amount" });
          }
        }

        table.currentOrder.paymentMethod.push({
          payMethod: paymentMethod,
          amount:
            table.currentOrder.remainAmount > parseFloat(amount)
              ? parseFloat(amount)
              : table.currentOrder.remainAmount,
          payDetail: detail,
        });

        if (
          table.currentOrder.paidAmount !== undefined ||
          table.currentOrder.paidAmount !== 0
        ) {
          table.currentOrder.paidAmount =
            table.currentOrder.totalAmount - table.currentOrder.remainAmount;
        } else {
          table.currentOrder.paidAmount = parseFloat(amount);
        }

        table.currentOrder.remainAmount -= parseFloat(amount);
        if (table.currentOrder.remainAmount <= 0) {
          table.currentOrder.remainAmount = 0;
          myIndex = 0;
        }

        table.currentOrder.paidAmount =
          table.currentOrder.totalAmount - table.currentOrder.remainAmount;
      } else {
        return res
          .status(400)
          .json({ msg: "Invalid payment method or amount" });
      }
    } else {
      table.currentOrder.paymentMethod = [];
      table.currentOrder.paidAmount = 0;

      if (!Array.isArray(table.currentOrder.paymentMethod)) {
        table.currentOrder.paymentMethod = [];
      }

      if (typeof paymentMethod === "string") {
        table.currentOrder.paymentMethod.push({
          payMethod: paymentMethod,
          amount: table.currentOrder.remainAmount,
        });
        table.currentOrder.paidAmount = table.currentOrder.totalAmount;
        table.currentOrder.remainAmount = 0;
      } else {
        return res.status(400).json({ msg: "Invalid payment method" });
      }
    }

    await table.save();
    // console.log("table data", table.currentOrder);
    res.status(201).json({ msg: "Payment method added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

//this is for add guest
const forAddGuestToOrder = async (req, res) => {
  const { id } = req.params;
  const { guestData } = req.body;

  try {
    const table = await tables.findById(id);
    if (guestData) {
      let newGuest = {
        id: guestData._id,
        name: guestData.name,
        email: guestData.email,
        phone: guestData.phone,
        gender: guestData.gender,
        address: guestData.address,
        age: guestData.age,
      };

      table.currentOrder.guest = newGuest;
    } else {
      table.currentOrder.guest = {};
    }
    await table.save();
    res.status(201).json({ msg: "Guest added successfully to order" });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for nocharge order
const forNoChargeOrder = async (req, res) => {
  const { id } = req.params;
  const { noChargeReason } = req.body;
  let allOrders = await orders.find();

  let invocieNO = allOrders.length + 1;
  // Populate based on tableType
  const myNewTable = await tables.findById(id);
  const table = await tables.findById(id).populate(
    myNewTable.tableType === "dine-in"
      ? {
          path: "counterArea.id",
          populate: {
            path: "counter.id",
            populate: {
              path: "restaurent.id",
            },
          },
        }
      : {
          path: "Counter.id",
          populate: {
            path: "restaurent.id",
          },
        }
  );

  const restData =
    myNewTable.tableType === "dine-in"
      ? table?.counterArea?.id?.counter?.id?.restaurent?.id
      : table?.Counter?.id?.restaurent?.id;

  if (!table) {
    return res.status(404).json({ msg: "Table not found" });
  }

  try {
    // Update the current order status
    table.currentOrder.status = "completed";
    table.currentOrder.isNoCharge = "yes";
    table.currentOrder.noChargeReason = noChargeReason;
    await table.save();

    let restData = "N/A";
    let counterData = "N/A";
    let areaData = "N/A";

    if (myNewTable.tableType === "dine-in") {
      restData = table?.counterArea?.id?.counter?.id?.restaurent?.id || "N/A";
      counterData = table?.counterArea?.id?.counter?.id || "N/A";
      areaData = table?.counterArea?.id || "N/A";
    } else {
      restData = table?.Counter?.id?.restaurent?.id || "N/A";
      counterData = table?.Counter?.id || "N/A";
    }

    const openDay = await daysModel.findOne({
      "restaurant.id": restData?.id,
      isClosed: false,
    });

    let dayId;
    if (!openDay) {
      res.status(400).json({ msg: "Please open the restaurent" });
    } else {
      dayId = openDay._id;
    }

    const restaurent = {
      id: restData?.id,
      name: restData?.restName,
    };

    const counter = {
      id: counterData?._id,
      name: counterData?.counterName,
    };

    const counterArea = {
      id: areaData?.id,
      name: areaData?.areaName,
    };

    //this is new order
    const newOrder = new orders({
      table: {
        id: table._id,
      },
      dayId,
      id: table.currentOrder.id,
      persons: table.currentOrder.persons,
      kots: table.currentOrder.kots,
      status: table.currentOrder.status,
      discountType: table.currentOrder.discountType,
      discount: table.currentOrder.discount,
      isServiceCharges: table.currentOrder.isServiceCharges,
      isGstTex: table.currentOrder.isGstTex,
      serviceCharges: table.currentOrder.serviceCharges,
      gstTex: table.currentOrder.gstTex,
      parcel: table.currentOrder.parcel,
      subTotal: table.currentOrder.subTotal,
      totalAmount: table.currentOrder.totalAmount,
      foodAmount: table.currentOrder.foodAmount,
      date: table.currentOrder.date,
      orderTaker: req.user.name,
      restaurent,
      counter,
      counterArea,
      deliveryCharges: table.currentOrder.deliveryCharges,
      invoiceNo: invocieNO,
      guest: table.currentOrder.guest,
      isNoCharge: table.currentOrder.isNoCharge,
      noChargeReason: table.currentOrder.noChargeReason,
      orderType: table.tableType,
      deliveryCharges: table.currentOrder.deliveryCharges,
    });

    await newOrder.save();

    table.orders.push({ id: newOrder._id });

    table.currentOrder = {
      id: null,
      persons: null,
      kots: [],
      status: "empty",
      guest: {},
      gstTex: 0,
      serviceCharges: 0,
      discountType: null,
      discount: null,
      parcel: null,
      subTotal: 0,
      totalAmount: 0,
      paymentMethod: null,
      isNoCharge: "",
      noChargeReason: "",
      date: Date.now(),
    };
    await table.save();

    res.status(201).json({ msg: "Order Added Successfuuly" });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting kot data for edit
const forGettingKotdataForEdit = async (req, res) => {
  const { kotid } = req.params;

  try {
    const kot = await kots.findById(kotid);
    res.status(200).json({ msg: "this is Kot Data", kot });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for void item from the kot and order
const forVoidAndAddKotItems = async (req, res) => {
  const { id, kotid } = req.params;
  const { orderItems } = req.body;
  const allStockIteminStock = await allStockItems.find();
  const TotalMenuItems = await allMenuItems.find();
  const allComboItems = await comboModel.find();

  try {
    const kot = await kots.findById(kotid);
    const myNewTable = await tables.findById(id);

    // Populate based on tableType
    const table = await tables.findById(id).populate(
      myNewTable.tableType === "dine-in"
        ? {
            path: "counterArea.id",
            populate: {
              path: "counter.id",
              populate: {
                path: "restaurent.id",
              },
            },
          }
        : {
            path: "Counter.id",
            populate: {
              path: "restaurent.id",
            },
          }
    );

    const restData =
      myNewTable.tableType === "dine-in"
        ? table?.counterArea?.id?.counter?.id?.restaurent?.id
        : table?.Counter?.id?.restaurent?.id;

    const voidedItems = [];
    const dataForVoidItems = [];

    // Compare frontend items with KOT items
    kot.orderItems.forEach((kotItem) => {
      const frontendItem = orderItems.find(
        (item) => item.id === kotItem.id.toString()
      );

      if (frontendItem) {
        const quantityDiff = kotItem.quantity - frontendItem.quantity;

        if (quantityDiff > 0) {
          voidedItems.push({
            id: kotItem.id,
            name: kotItem.name,
            voidedQuantity: quantityDiff,
          });

          dataForVoidItems.push({
            restId: kot?.restaurent?.id,
            invoiceNumber: kot?.kotOrderNo,
            counterId: kot?.Counter?.id,
            kotNumber: kot?.kotNo,
            itemId: kotItem.id,
            name: kotItem.name,
            quantity: quantityDiff,
            reason: frontendItem.reason,
          });
        }
      } else {
        // Item completely voided
        voidedItems.push({
          id: kotItem.id,
          name: kotItem.name,
          voidedQuantity: kotItem.quantity,
        });

        dataForVoidItems.push({
          restId: kot?.restaurent?.id,
          invoiceNumber: kot?.kotOrderNo,
          counterId: kot?.Counter?.id,
          kotNumber: kot?.kotNo,
          itemId: kotItem.id,
          name: kotItem.name,
          quantity: kotItem.quantity,
          reason: kotItem.reason,
        });
      }
    });

    //this is for save voided items to the model
    const saveVoidedItemsToDB = async () => {
      try {
        for (const item of dataForVoidItems) {
          const newVoidedItem = new voidedItemsModel(item);
          await newVoidedItem.save();
        }
        console.log("All voided items saved successfully!");
      } catch (error) {
        console.error("Error saving voided items:", error.message);
      }
    };

    // Call the function to save the data
    saveVoidedItemsToDB();

    // Update KOT with new items from the frontend
    kot.orderItems = orderItems;
    kot.totalItem = orderItems.length;
    await kot.save();

    // Total calculation logic
    let totalAmount = 0;
    for (const kotId of table.currentOrder.kots) {
      const kotData = await kots.findById(kotId);
      if (kotData?.orderItems) {
        totalAmount += kotData.orderItems.reduce((acc, item) => {
          return acc + (item.totalPrice || 0);
        }, 0);
      }
    }

    if (isNaN(totalAmount)) totalAmount = 0;
    kot.grandTotal = totalAmount;

    table.currentOrder.subTotal = totalAmount || 0;
    table.currentOrder.foodAmount = totalAmount || 0;

    if (table.currentOrder.discountType === "percentage") {
      let forDiscount =
        (table.currentOrder.subTotal * table?.currentOrder?.discountAmount) /
        100;
      table.currentOrder.discount = forDiscount;
      table.currentOrder.subTotal = table.currentOrder.subTotal - forDiscount;
    } else {
      table.currentOrder.discount = 0;
    }

    const parcel = table.currentOrder.parcel || 0;
    table.currentOrder.subTotal = table.currentOrder.subTotal + parcel;

    if (table?.tableType === "dine-in") {
      if (table.currentOrder.isServiceCharges !== "no") {
        let serviceCharge = 0;
        if (restData?.typeOfServiceCharges === "percentage") {
          serviceCharge =
            (table.currentOrder.subTotal * restData.serviceChargesAmount) / 100;
        } else if (restData?.typeOfServiceCharges === "number") {
          serviceCharge = restData.serviceChargesAmount;
        }
        table.currentOrder.serviceCharges = serviceCharge || 0;
      }
    }

    if (table.tableType === "delivery") {
      let deliveryCharges = 0;
      if (restData?.typeOfDeliveryCharges === "percentage") {
        deliveryCharges =
          (table.currentOrder.subTotal * restData.deliveryChargesAmount) / 100;
      } else if (restData?.typeOfDeliveryCharges === "number") {
        deliveryCharges = restData.deliveryChargesAmount;
      }
      table.currentOrder.deliveryCharges = deliveryCharges || 0;
    }

    if (table.currentOrder.isGstTex !== "no") {
      let foodTex = 0;
      if (restData?.gstTexType === "percentage") {
        foodTex = (table.currentOrder.subTotal * restData.gstTexAmount) / 100;
      } else if (restData?.gstTexType === "number") {
        foodTex = restData.gstTexAmount;
      }
      table.currentOrder.gstTex = foodTex || 0;
    }

    if (table.tableType === "dine-in") {
      table.currentOrder.totalAmount =
        table.currentOrder.subTotal +
        table.currentOrder.serviceCharges +
        table.currentOrder.gstTex;
    } else if (table.tableType === "take-away") {
      table.currentOrder.totalAmount =
        table.currentOrder.subTotal + table.currentOrder.gstTex;
    } else if (table.tableType === "delivery") {
      table.currentOrder.totalAmount =
        table.currentOrder.subTotal +
        table.currentOrder.gstTex +
        table.currentOrder.deliveryCharges;
    }
    table.currentOrder.remainAmount = table.currentOrder.totalAmount;
    await table.save();

    // Handling voided items - adjusting stock
    for (const voidedItem of voidedItems) {
      const itemInMenu = TotalMenuItems.find(
        (menuItem) => menuItem._id.toString() === voidedItem.id.toString()
      );

      const itemInCombo = allComboItems.find(
        (comboItem) => comboItem._id.toString() === voidedItem.id.toString()
      );

      if (itemInMenu) {
        for (const stockItem of itemInMenu.stockItems) {
          const stockInDb = allStockIteminStock.find(
            (stock) => stock._id.toString() === stockItem.id.toString()
          );

          if (stockInDb) {
            const voidQty = stockItem.qty * voidedItem.voidedQuantity;

            if (stockInDb.qtyType === stockItem.qtyType) {
              stockInDb.stock += voidQty;
            } else if (
              stockInDb.qtyType === "kilogram" &&
              stockItem.qtyType === "gram"
            ) {
              stockInDb.stock += voidQty / 1000;
            } else if (
              stockInDb.qtyType === "kilogram" &&
              stockItem.qtyType === "milligram"
            ) {
              stockInDb.stock += voidQty / 1000000;
            } else if (
              stockInDb.qtyType === "gram" &&
              stockItem.qtyType === "milligram"
            ) {
              stockInDb.stock += voidQty / 1000;
            } else if (
              stockInDb.qtyType === "liter" &&
              stockItem.qtyType === "milliliter"
            ) {
              stockInDb.stock += voidQty / 1000;
            }

            await stockInDb.save();
          }
        }
      }

      if (itemInCombo) {
        for (const subMenuItem of itemInCombo.items) {
          const menuItem = TotalMenuItems.find(
            (menu) => menu._id.toString() === subMenuItem.id.toString()
          );

          if (menuItem) {
            for (const stockItem of menuItem.stockItems) {
              const stockInDb = allStockIteminStock.find(
                (stock) => stock._id.toString() === stockItem.id.toString()
              );

              if (stockInDb) {
                const voidQty =
                  stockItem.qty * subMenuItem.qty * voidedItem.voidedQuantity;

                if (stockInDb.qtyType === stockItem.qtyType) {
                  stockInDb.stock += voidQty;
                } else if (
                  stockInDb.qtyType === "kilogram" &&
                  stockItem.qtyType === "gram"
                ) {
                  stockInDb.stock += voidQty / 1000;
                } else if (
                  stockInDb.qtyType === "kilogram" &&
                  stockItem.qtyType === "milligram"
                ) {
                  stockInDb.stock += voidQty / 1000000;
                } else if (
                  stockInDb.qtyType === "gram" &&
                  stockItem.qtyType === "milligram"
                ) {
                  stockInDb.stock += voidQty / 1000;
                } else if (
                  stockInDb.qtyType === "liter" &&
                  stockItem.qtyType === "milliliter"
                ) {
                  stockInDb.stock += voidQty / 1000;
                }

                await stockInDb.save();
              }
            }
          }
        }
      }
    }

    res
      .status(201)
      .json({ message: "KOT updated and stock adjusted", kotId: kot._id });
  } catch (err) {
    console.error("Error updating KOT:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// this is for tranfar items
const forTransfarKotOrItemsToTable = async (req, res) => {
  const { prevtableid, targettableid, kotid } = req.params;
  const { orderItems, person } = req.body;
  const orderId = uuidv4();
  const kotNo = Math.floor(1000 + Math.random() * 9000);

  let prevTable = await tables.findById(prevtableid).populate({
    path: "counterArea.id",
    populate: {
      path: "counter.id",
      populate: {
        path: "restaurent.id",
      },
    },
  });

  const targetTable = await tables.findById(targettableid).populate({
    path: "counterArea.id",
    populate: {
      path: "counter.id",
      populate: {
        path: "restaurent.id",
      },
    },
  });

  orderItems?.map((item) => {
    item?.items?.map((newitems) => {
      newitems.qty = newitems.qty * item.quantity;
    });
  });
  const kotData = await kots.findById(kotid);
  let number = targetTable.currentOrder.kots.length + 1;
  let restData = prevTable?.counterArea?.id?.counter?.id?.restaurent?.id;
  let counterData = targetTable?.counterArea?.id?.counter?.id;

  const Counter = {
    id: counterData?._id,
    name: counterData?.counterName,
  };
  const forTableData = {
    id: targetTable?._id,
    name: targetTable?.tableNo,
  };

  try {
    // Handling the transfer to the target table
    if (targetTable?.currentOrder?.status === "empty") {
      if (person) {
        targetTable.currentOrder.id = orderId;
        targetTable.currentOrder.status = "running";
        targetTable.currentOrder.persons = person;
      }

      await targetTable.save();
    }

    const restaurent = {
      id: restData?.id,
      name: restData?.restName,
    };

    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    if (isNaN(totalAmount)) {
      console.error("Invalid totalAmount value:", totalAmount);
      totalAmount = 0;
    }

    targetTable.currentOrder.subTotal =
      (targetTable.currentOrder.subTotal || 0) + totalAmount;
    targetTable.currentOrder.foodAmount =
      (targetTable.currentOrder.foodAmount || 0) + totalAmount;

    const newKOT = new kots({
      order: { id: targetTable.currentOrder.id },
      table: targetTable.tableNo,
      number,
      orderItems,
      orderTaker: req.user.name,
      restaurent,
      Counter,
      number,
      totalItem: orderItems.length,
      tableData: forTableData,
      grandTotal: totalAmount,
      orderType: targetTable.tableType,
      kotNo: kotNo,
    });

    await targetTable.save();
    await newKOT.save();

    // Handling service charges for the target table
    let serviceCharge = 0;
    if (restData?.typeOfServiceCharges === "percentage") {
      serviceCharge =
        (targetTable.currentOrder.subTotal * restData.serviceChargesAmount) /
        100;
    } else if (restData.typeOfServiceCharges === "number") {
      serviceCharge = restData.serviceChargesAmount;
    }
    targetTable.currentOrder.serviceCharges = serviceCharge;

    // Handling GST for the target table
    let foodTex = 0;
    if (restData.gstTexType === "percentage") {
      foodTex =
        (targetTable.currentOrder.subTotal * restData.gstTexAmount) / 100;
    } else if (restData.gstTexType === "number") {
      foodTex = restData.gstTexAmount;
    }
    targetTable.currentOrder.gstTex = foodTex;

    targetTable.currentOrder.totalAmount =
      targetTable.currentOrder.subTotal +
      targetTable.currentOrder.serviceCharges +
      targetTable.currentOrder.gstTex;

    targetTable.currentOrder.remainAmount =
      targetTable.currentOrder.totalAmount;
    await targetTable.save();

    targetTable.currentOrder.kots.push(newKOT._id);
    await targetTable.save();

    const itemsToRemove = orderItems.map((item) => item.id);

    kotData.orderItems = kotData.orderItems.filter(
      (item) => !itemsToRemove.includes(item._id.toString())
    );

    kotData.totalAmount = kotData.orderItems.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    // Save the updated KOT
    await kotData.save();

    const prevTotalAmount = orderItems.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    if (!isNaN(prevTotalAmount)) {
      prevTable.currentOrder.subTotal -= prevTotalAmount;
      prevTable.currentOrder.foodAmount -= prevTotalAmount;
      prevTable.currentOrder.subTotal =
        prevTable.currentOrder.subTotal + prevTable.currentOrder.discount;
    }

    if (restData?.typeOfServiceCharges === "percentage") {
      prevTable.currentOrder.serviceCharges =
        (prevTable.currentOrder.subTotal * restData.serviceChargesAmount) / 100;
    } else if (restData.typeOfServiceCharges === "number") {
      prevTable.currentOrder.serviceCharges = restData.serviceChargesAmount;
    }

    if (restData.gstTexType === "percentage") {
      prevTable.currentOrder.gstTex =
        (prevTable.currentOrder.subTotal * restData.gstTexAmount) / 100;
    } else if (restData.gstTexType === "number") {
      prevTable.currentOrder.gstTex = restData.gstTexAmount;
    }

    // Recalculate the total amount for the previous table after item removal
    prevTable.currentOrder.totalAmount =
      prevTable.currentOrder.subTotal +
      prevTable.currentOrder.serviceCharges +
      prevTable.currentOrder.gstTex;
    prevTable.currentOrder.remainAmount = prevTable.currentOrder.totalAmount;

    if (prevTable.currentOrder.discountType === "percentage") {
      let forDiscount =
        (prevTable.currentOrder.subTotal *
          prevTable?.currentOrder?.discountAmount) /
        100;
      prevTable.currentOrder.discount = forDiscount;
      prevTable.currentOrder.subTotal =
        prevTable.currentOrder.subTotal - forDiscount;
    }

    await prevTable.save();

    res.json({ msg: "ok" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for transfar table
const forTransfarTable = async (req, res) => {
  const { prevtableid, targettableid } = req.params;
  const prevTableData = await tables.findById(prevtableid);
  const targetTableData = await tables.findById(targettableid);

  try {
    const forKots = prevTableData.currentOrder.kots;
    await kots.updateMany(
      { _id: { $in: forKots } },
      { $set: { table: targetTableData.tableNo } }
    );

    targetTableData.currentOrder = prevTableData.currentOrder;
    prevTableData.currentOrder = {
      id: null,
      persons: null,
      kots: [],
      status: "empty",
      gstTex: 0,
      serviceCharges: 0,
      discountType: null,
      discount: null,
      parcel: null,
      subTotal: 0,
      totalAmount: 0,
      paymentMethod: null,
      date: Date.now(),
    };

    await prevTableData.save();
    await targetTableData.save();
    res.status(200).json({ msg: "Table transfared successfullly" });
  } catch (err) {
    console.log("err ", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for merg table
const forMergTableToAnotherTable = async (req, res) => {
  const { prevtableid, targettableid } = req.params;

  try {
    const prevTableData = await tables.findById(prevtableid);
    const targetTableData = await tables.findById(targettableid);

    if (!prevTableData || !targetTableData) {
      return res.status(404).json({ msg: "Table not found" });
    }

    // Merge KOTs
    const mergedKots = [
      ...targetTableData.currentOrder.kots,
      ...prevTableData.currentOrder.kots,
    ];

    // Merge other properties
    targetTableData.currentOrder.persons +=
      prevTableData.currentOrder.persons || 0;
    targetTableData.currentOrder.foodAmount +=
      prevTableData.currentOrder.foodAmount || 0;
    targetTableData.currentOrder.subTotal +=
      prevTableData.currentOrder.subTotal || 0;

    // Merge parcel charges
    targetTableData.currentOrder.parcel =
      (targetTableData.currentOrder.parcel || 0) +
      (prevTableData.currentOrder.parcel || 0);

    // Merge discount
    const targetDiscount = targetTableData.currentOrder.discount || 0;
    const prevDiscount = prevTableData.currentOrder.discount || 0;

    if (targetTableData.currentOrder.discountType === "percentage") {
      targetTableData.currentOrder.discount =
        (targetTableData.currentOrder.subTotal *
          targetTableData.currentOrder.discountType) /
          100 +
        targetDiscount;
    } else {
      targetTableData.currentOrder.discount = targetDiscount + prevDiscount;
    }

    targetTableData.currentOrder.subTotal -=
      targetTableData.currentOrder.discount;

    // Merge GST and service charges
    targetTableData.currentOrder.gstTex +=
      prevTableData.currentOrder.gstTex || 0;
    targetTableData.currentOrder.serviceCharges +=
      prevTableData.currentOrder.serviceCharges || 0;

    // Recalculate total amount
    targetTableData.currentOrder.totalAmount =
      targetTableData.currentOrder.subTotal +
      targetTableData.currentOrder.gstTex +
      targetTableData.currentOrder.serviceCharges +
      (targetTableData.currentOrder.parcel || 0);

    targetTableData.currentOrder.remainAmount =
      targetTableData.currentOrder.totalAmount;

    // Update KOTs table numbers
    await kots.updateMany(
      { _id: { $in: prevTableData.currentOrder.kots } },
      { $set: { table: targetTableData.tableNo } }
    );

    // Update target table KOTs and save
    targetTableData.currentOrder.kots = mergedKots;

    // Clear previous table current order
    prevTableData.currentOrder = {
      id: null,
      persons: null,
      kots: [],
      status: "empty",
      gstTex: 0,
      serviceCharges: 0,
      discountType: null,
      discount: null,
      parcel: null,
      subTotal: 0,
      totalAmount: 0,
      paymentMethod: null,
      date: Date.now(),
    };

    // Save changes
    await targetTableData.save();
    await prevTableData.save();

    res.status(200).json({ msg: "Tables merged successfully" });
  } catch (err) {
    console.log("Error in merging tables:", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting all kots of the restaurent
const forGettingAllRunningKotsOfTheRestaurent = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurents.findById(id);
    const myAllKots = await kots.find();

    const allRunningKots = myAllKots
      .filter(
        (kot) =>
          kot.restaurent.id == restaurant._id && kot.isDelivered === false
      )
      .sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json({ msg: "all kots", allRunningKots });
  } catch (err) {
    console.log("err ", err);
    res.status(500).json({ msg: "server error", err });
  }
};

//this is for getting all delivered kots of the restuarent for ordes
const forGettingAllDeliveredKots = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurents.findById(id);
    const myAllKots = await kots.find();

    const allKots = myAllKots
      .filter(
        (kot) => kot.restaurent.id == restaurant._id && kot.isDelivered === true
      )
      .sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json({ msg: "all kots", allKots });
  } catch (err) {
    console.log("err ", err);
    res.status(500).json({ msg: "server error", err });
  }
};

//this is for changing status of the item of the kot
const forUpdateTheStatusOfTheItems = async (req, res) => {
  const { kotid, itemid } = req.params;
  const { status } = req.body;

  try {
    const kot = await kots.findById(kotid);
    const item = kot.orderItems.id(itemid);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    } else {
      if (status) {
        item.status = status;
      }
      await kot.save();
      res.json({ message: "Item status updated", item });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

//this is for set the kot status isdelivered
const forSetKotIsDeliveredTrue = async (req, res) => {
  const { id } = req.params;
  try {
    const kot = await kots.findById(id);
    const allDelivered = kot.orderItems.every(
      (item) => item.status === "Delivered"
    );
    if (!allDelivered) {
      return res.status(400).json({ msg: "Please Delivered All Items" });
    } else {
      kot.isDelivered = true;
      await kot.save();
      res.status(200).json({ msg: "Kot Items Delivered Successfully", kot });
    }
  } catch (error) {
    console.log("err", error);
    res.status(500).json({ message: "Failed to mark KOT as delivered", error });
  }
};

//this is for delete all order
const forDeleteAllOrders = async (req, res) => {
  try {
    // const allDeletedOrders = await kots.deleteMany();
    res.send({ msg: "all order deleted successfully" });
  } catch (err) {
    console.log("there is err", err);
  }
};

//exporting
module.exports = {
  forAddTables,
  forGetAllTables,
  forGetDataForEditTable,
  forEditTable,
  forDeleteTable,
  forAddOrderToTable,
  forAddKotToOrder,
  forGettingAllOrders,
  forDeleteAllOrders,
  forGettingAllItemsOfOrder,
  forGettingAllKots,
  forParcelCharges,
  forOrderInvoice,
  forDiscount,
  currentOrderSaveAsOrderToTable,
  forRemoveAndAddServiceCharges,
  forAddAndRemoveGstTex,
  forNoChargeOrder,
  forAddGuestToOrder,
  forVoidAndAddKotItems,
  forGettingKotdataForEdit,
  forGetAllRestaurentTables,
  forTransfarKotOrItemsToTable,
  forTransfarTable,
  forMergTableToAnotherTable,
  forAddTakeAwayTable,
  forAddPaymentMethodToTheOrder,
  forGetRestaurentAllOrders,
  forGettingAllRestAllTables,
  forGettingAllRunningKotsOfTheRestaurent,
  forUpdateTheStatusOfTheItems,
  forSetKotIsDeliveredTrue,
  forGettingAllDeliveredKots,
};
