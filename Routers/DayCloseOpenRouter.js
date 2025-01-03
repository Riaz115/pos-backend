//requiring
const express = require("express");
const daysRouter = express.Router();
const controllers = require("../Controllers/RestaurentDayCloseController");
const userAuth = require("../MiddleWares/UserAuth");

//routing

//all gets routes
daysRouter
  .route("/restaurent/:id/get/all/head/accounts")
  .get(userAuth, controllers.forGettingAllHeadsOfTheRestaurent);

daysRouter
  .route("/restaurent/:id/get/data/account/head/edit")
  .get(userAuth, controllers.forGetDataForEditAccountHead);

daysRouter
  .route("/restaurent/:id/get/all/acount/names/cashbook")
  .get(userAuth, controllers.forGettingAllAccountNames);

daysRouter
  .route("/restaurent/:id/get/data/foredit/acc/name/cashbook")
  .get(userAuth, controllers.forGettingAccNameDataForEdit);

daysRouter
  .route("/restaurent/:id/get/all/expenes/cashbook")
  .get(userAuth, controllers.forGettingAllTransitionOfCashBookOfRestaurent);

daysRouter
  .route("/restaurent/:id/get/fotedit/one/expenes/cashbook")
  .get(userAuth, controllers.forGettingDataForEditTheTransitionToCashBook);

daysRouter
  .route("/restaurent/:restid/get/data/ofrunningday/:dayid/rest")
  .get(userAuth, controllers.forGettingRestRunningDayData);

//all posts routes
daysRouter
  .route("/restaurent/:id/open/day/start")
  .post(userAuth, controllers.forStartDayOfRestaurent);

daysRouter
  .route("/restaurent/:restid/close/day/:dayid/off")
  .post(userAuth, controllers.forCloseTheDayOfRestaurent);

daysRouter
  .route("/restaurent/:id/add/account/cashbook/head")
  .post(userAuth, controllers.forAddAcountHeadOfRestaurent);

daysRouter
  .route("/restaurent/:id/add/acc/head/name/cashbook")
  .post(userAuth, controllers.forAddCashBookAccName);

daysRouter
  .route("/restaurent/:id/add/transition/cashbook")
  .post(userAuth, controllers.forAddTransitionToCashBook);

//all updates routes

daysRouter
  .route("/restaurent/:id/edit/account/head/cashbook")
  .patch(userAuth, controllers.forEditAccountHead);

daysRouter
  .route("/restaurent/:id/for/edit/acc/name/cashbook")
  .patch(userAuth, controllers.forEditAccNameCashBook);

daysRouter
  .route("/restaurent/:restid/foredit/:id/transition/running/day")
  .patch(userAuth, controllers.forEditTheTransitionInRunningDay);

//all delete routes

daysRouter
  .route("/restaurent/:id/delete/head/cashbook/account")
  .delete(userAuth, controllers.forDeleteHead);

daysRouter
  .route("/restaurent/:id/delete/account/name/cashbook")
  .delete(userAuth, controllers.forDeleteAccName);

daysRouter
  .route("/restaurent/transition/:id/delete/expense/:dayid/fromday")
  .delete(userAuth, controllers.forDeletExpenseTranstion);

//exporting
module.exports = daysRouter;
