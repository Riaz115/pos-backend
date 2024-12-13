const DaysCloseAndOpen = require("../Models/DayStartAndCloseModel");
const restaurentModel = require("../Models/RestaurentModel");
const ExpensesModel = require("../Models/ExpensesModel");
const AcountsHeadsModel = require("../Models/CashBookAcountHead");
const AccountNameModel = require("../Models/CashBookAcountName");

//this is for start day of the restarent and open the restauren
const forStartDayOfRestaurent = async (req, res) => {
  const { id } = req.params;
  const restData = await restaurentModel.findById(id);
  const { restOpeningAmount } = req.body;

  try {
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
    console.log("start day data", startDay);
    res.status(201).json({ msg: "Day Started Successfully", startDay });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for close the day of the restaurent
const forCloseTheDayOfRestaurent = async (req, res) => {
  console.log("this is for testing");
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
    } else {
      dayId = openDay._id;
    }

    const forCreatedData = {
      id: req.user._id,
      name: req.user.name,
    };

    const newTransitionToCashBook = new ExpensesModel({
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
      amount,
      createdBy: forCreatedData,
      votureNo: votureNumber,
      description,
    };

    openDay.expenses.push(forExpenseOfDayModel);
    await openDay.save();
    await newTransitionToCashBook.save();
    console.log("transition", newTransitionToCashBook);
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
    }).sort({ createdAt: -1 }); // Sorting by createdAt in descending order

    console.log("all expenses of the rest", allExpensesOfRest);

    res.status(200).json(allExpensesOfRest);
  } catch (err) {
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
};
