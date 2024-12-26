const DaysCloseAndOpen = require("../Models/DayStartAndCloseModel");
const restaurentModel = require("../Models/RestaurentModel");
const ExpensesModel = require("../Models/ExpensesModel");
const AcountsHeadsModel = require("../Models/CashBookAcountHead");
const AccountNameModel = require("../Models/CashBookAcountName");
const restModel = require("../Models/RestaurentModel");

//this is for start day of the restarent and open the restauren
const forStartDayOfRestaurent = async (req, res) => {
  const { id } = req.params;
  const restData = await restaurentModel.findById(id);
  const { restOpeningAmount } = req.body;

  try {
    const existingDay = await DaysCloseAndOpen.findOne({
      "restaurant.id": id,
      isClosed: false,
    });

    if (existingDay) {
      res.status(400).json({ msg: "Rest Is Alread Opend " });
    } else {
      const restaurent = {
        id: restData._id,
        name: restData.restName,
      };
      const startDay = new DaysCloseAndOpen({
        startDateTime: new Date().toISOString(),
        restaurant: restaurent,
        openingAmount: restOpeningAmount,
      });

      await startDay.save();
      res.status(201).json({ msg: "Day Started Successfully", startDay });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for  getting day data
const forGettingRestRunningDayData = async (req, res) => {
  const { restid, dayid } = req.params;
  const runningDay = await DaysCloseAndOpen.findOne({ _id: dayid });
  try {
    res.status(200).json({ runningDay });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for close the day of the restaurent
const forCloseTheDayOfRestaurent = async (req, res) => {
  const { restid, dayid } = req.params;

  try {
    // Fetch the running day data
    const runningDayData = await DaysCloseAndOpen.findOne({ _id: dayid });
    if (!runningDayData) {
      return res.status(404).json({ msg: "Day data not found" });
    }

    // Fetch the restaurant data
    const restData = await restModel.findById(restid);
    if (!restData) {
      return res.status(404).json({ msg: "Restaurant not found" });
    }

    // Check if the restaurant ID matches and the day is already closed
    if (String(runningDayData.restaurant.id) !== String(restData._id)) {
      return res.status(400).json({
        msg: "The provided restaurant does not match the day record.",
      });
    }

    if (runningDayData.isClosed === true) {
      return res.status(400).json({
        msg: "The day is already closed. Please open the restaurant before closing it again.",
      });
    }

    // Extract data from req.body and set default values
    const {
      paymentMethodsWithTotalAmount = [],
      noChargeAmount = 0,
      discounts = 0,
      parcelCharges = 0,
      creditGiven = 0,
      totalGivenExpense = 0,
      totalRemainSale = 0,
      totalSales = 0,
    } = req.body;

    // Update the running day's data
    runningDayData.paymentMethodsWithTotalAmount =
      paymentMethodsWithTotalAmount;
    runningDayData.noChargeAmount = noChargeAmount;
    runningDayData.discounts = discounts;
    runningDayData.parcelCharges = parcelCharges;
    runningDayData.creditGiven = creditGiven;
    runningDayData.totalGivenExpense = totalGivenExpense;
    runningDayData.totalRemainSale = totalRemainSale;
    runningDayData.totalSales = totalSales;
    runningDayData.endDateTime = new Date();
    runningDayData.isClosed = true;

    // Save the updated day data
    await runningDayData.save();

    // Send success response
    return res.status(200).json({
      msg: "Day closed successfully",
      data: runningDayData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

//this is for add account head of restaurent
const forAddAcountHeadOfRestaurent = async (req, res) => {
  const { id } = req.params;
  const { AccountHead } = req.body;
  try {
    const restId = {
      id,
    };

    const newHead = new AcountsHeadsModel({
      AccountHead,
      restaurent: restId,
    });

    await newHead.save();
    res.status(201).json({ msg: "Haed Created Successfully", newHead });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting all heads of the restaurent
const forGettingAllHeadsOfTheRestaurent = async (req, res) => {
  const { id } = req.params;

  try {
    const allHeadAccounts = await AcountsHeadsModel.find({
      "restaurent.id": id,
    });

    res.status(200).json(allHeadAccounts);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for get data for  edit account head
const forGetDataForEditAccountHead = async (req, res) => {
  const { id } = req.params;

  try {
    const myAccountHead = await AcountsHeadsModel.findById(id);
    console.log("new account head get ", myAccountHead);
    res.status(200).json(myAccountHead);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for edit the accout head
const forEditAccountHead = async (req, res) => {
  const { id } = req.params;
  const myAccountHead = await AcountsHeadsModel.findById(id);
  const { AccountHead } = req.body;
  try {
    myAccountHead.AccountHead = AccountHead;
    await myAccountHead.save();

    res.status(200).json(myAccountHead);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for delete the head
const forDeleteHead = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteHead = await AcountsHeadsModel.findByIdAndDelete(id);
    console.log("delete head", deleteHead);
    res
      .status(200)
      .json({ msg: "Account Head Deleted Successfully", deleteHead });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for add account name of cash book
const forAddCashBookAccName = async (req, res) => {
  const { id } = req.params;
  const { AccountName, AccountNameHead } = req.body;
  try {
    const restId = {
      id,
    };

    const newAccName = new AccountNameModel({
      AccountName,
      AccountNameHead,
      restaurent: restId,
    });

    await newAccName.save();
    res
      .status(201)
      .json({ msg: "Account Name Created Successfully", newAccName });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting all account names
const forGettingAllAccountNames = async (req, res) => {
  const { id } = req.params;

  try {
    const allAccountNames = await AccountNameModel.find({
      "restaurent.id": id,
    });

    res.status(200).json(allAccountNames);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting data for edit account name
const forGettingAccNameDataForEdit = async (req, res) => {
  const { id } = req.params;

  try {
    const myAccName = await AccountNameModel.findById(id);

    res.status(200).json(myAccName);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for edit account name
const forEditAccNameCashBook = async (req, res) => {
  const { id } = req.params;
  const myAccName = await AccountNameModel.findById(id);
  const { AccountName, AccountNameHead } = req.body;
  try {
    myAccName.AccountName = AccountName;
    myAccName.AccountNameHead = AccountNameHead;
    await myAccName.save();

    res.status(200).json(myAccName);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for delete the account name
const forDeleteAccName = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteAccName = await AccountNameModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ msg: "Account Name Deleted Successfully", deleteAccName });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for add transition to cash book
const forAddTransitionToCashBook = async (req, res) => {
  const { id } = req.params;
  const {
    headAcount,
    accountName,
    exprensType,
    paymentType,
    description,
    amount,
  } = req.body;

  try {
    const votureNumber = Math.floor(1000 + Math.random() * 9000);
    const openDay = await DaysCloseAndOpen.findOne({
      "restaurant.id": id,
      isClosed: false,
    });

    let dayId;
    if (!openDay) {
      res.status(400).json({ msg: "Please open the restaurent" });
      return;
    } else {
      dayId = openDay._id;
    }

    let forRestData = {
      id: id,
    };

    const forCreatedData = {
      id: req.user._id,
      name: req.user.name,
    };

    const newTransitionToCashBook = new ExpensesModel({
      restaurant: forRestData,
      dayId,
      headAcount,
      accountName,
      exprensType,
      paymentType,
      description,
      amount,
      createdBy: forCreatedData,
      votureNo: votureNumber,
    });

    const forExpenseOfDayModel = {
      id: newTransitionToCashBook._id,
      headAcount,
      accountName,
      exprensType,
      paymentType,
      description,
      amount,
      createdBy: forCreatedData,
      votureNo: votureNumber,
    };

    openDay.expenses.push(forExpenseOfDayModel);
    await openDay.save();
    await newTransitionToCashBook.save();

    res
      .status(201)
      .json({ msg: "Transition added Successfully", newTransitionToCashBook });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting all transition of cash book of the restuarent
const forGettingAllTransitionOfCashBookOfRestaurent = async (req, res) => {
  const { id } = req.params;

  try {
    const allExpensesOfRest = await ExpensesModel.find({
      "restaurant.id": id,
    }).sort({ createdAt: -1 });

    res.status(200).json(allExpensesOfRest);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for get data for  edit the transition in running day
const forGettingDataForEditTheTransitionToCashBook = async (req, res) => {
  const { id } = req.params;
  try {
    const transitionData = await ExpensesModel.findById(id);
    res.status(200).json(transitionData);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for edit the transition in the running day
const forEditTheTransitionInRunningDay = async (req, res) => {
  const { id, restid } = req.params;
  const expenseData = await ExpensesModel.findById(id);
  const restData = await restaurentModel.findById(restid);
  const {
    headAcount,
    accountName,
    exprensType,
    paymentType,
    description,
    amount,
  } = req.body;

  try {
    const openDay = await DaysCloseAndOpen.findOne({
      "restaurant.id": restid,
      isClosed: false,
    });

    const forCreatedData = {
      id: req.user._id,
      name: req.user.name,
    };

    if (openDay._id.toString() !== expenseData.dayId.toString()) {
      return res.status(400).json({
        msg: "You cannot edit the transaction for a closed day.",
      });
    } else {
      (expenseData.headAcount = headAcount),
        (expenseData.accountName = accountName),
        (expenseData.exprensType = exprensType),
        (expenseData.paymentType = paymentType),
        (expenseData.description = description),
        (expenseData.amount = amount);
      expenseData.createdBy = forCreatedData;

      const dayExpenseData = openDay.expenses.find(
        (item) => item.id && item.id.toString() === id
      );

      if (dayExpenseData) {
        (dayExpenseData.headAcount = headAcount),
          (dayExpenseData.accountName = accountName),
          (dayExpenseData.exprensType = exprensType),
          (dayExpenseData.paymentType = paymentType),
          (dayExpenseData.description = description),
          (dayExpenseData.amount = amount);
        expenseData.createdBy = forCreatedData;
      }

      await openDay.save();
      await expenseData.save();

      res.status(200).json({ msg: "Transition Updated sucessfully" });
    }
  } catch (err) {
    console.log("err ", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for delete the transition from the cash book
const forDeletExpenseTranstion = async (req, res) => {
  const { id, dayid } = req.params;

  try {
    const forDeleteExpense = await ExpensesModel.findByIdAndDelete(id);
    const result = await DaysCloseAndOpen.updateOne(
      { _id: dayid },
      { $pull: { expenses: { id: id } } }
    );

    res
      .status(200)
      .json({ msg: "Expense Deleted Successfully", forDeleteExpense });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//exporting
module.exports = {
  forStartDayOfRestaurent,
  forCloseTheDayOfRestaurent,
  forAddAcountHeadOfRestaurent,
  forGettingAllHeadsOfTheRestaurent,
  forGetDataForEditAccountHead,
  forEditAccountHead,
  forDeleteHead,
  forAddCashBookAccName,
  forGettingAllAccountNames,
  forGettingAccNameDataForEdit,
  forEditAccNameCashBook,
  forDeleteAccName,
  forAddTransitionToCashBook,
  forGettingAllTransitionOfCashBookOfRestaurent,
  forGettingDataForEditTheTransitionToCashBook,
  forEditTheTransitionInRunningDay,
  forDeletExpenseTranstion,
  forGettingRestRunningDayData,
};
