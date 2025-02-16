const express = require("express");
const trouter = express.Router();
const controllers = require("../Controllers/TablesController");
const userAuth = require("../MiddleWares/UserAuth");

//All Routes

//All get Routes

trouter.route("/get/alltables").get(controllers.forGettingAllRestAllTables);

trouter.route("/getall/:id/tables").get(userAuth, controllers.forGetAllTables);
trouter
  .route("/forget/all/tables/:restid")
  .get(controllers.forGetAllRestaurentTables);
trouter.route("/getdata/:id/table").get(controllers.forGetDataForEditTable);
trouter.route("/getall/orders").get(controllers.forGettingAllOrders);
trouter.route("/getall/restaurent/:id/kots").get(controllers.forGettingAllKots);
trouter
  .route("/getall/:id/itemsofcurrorder")
  .get(controllers.forGettingAllItemsOfOrder);
trouter
  .route("/get/:id/kotdataforedit/:kotid")
  .get(controllers.forGettingKotdataForEdit);
trouter
  .route("/get/:id/restaurent/all/orders")
  .get(controllers.forGetRestaurentAllOrders);
trouter
  .route("/get/:id/restaurent/all/running/kots")
  .get(controllers.forGettingAllRunningKotsOfTheRestaurent);
trouter
  .route("/get/:id/restaurent/all/delivered/kots")
  .get(controllers.forGettingAllDeliveredKots);

trouter
  .route("/get/running/day/:id/all/orders")
  .get(controllers.forGettingRunningDayOrder);

trouter
  .route("/get/running/day/:id/all/kots")
  .get(controllers.forGettingAllKotsOfRunningDay);

//All Post ROutes
trouter.route("/add/:id/table").post(controllers.forAddTables);
trouter.route("/add/:id/order").post(userAuth, controllers.forAddOrderToTable);
trouter
  .route("/add/:id/kot/:restId")
  .post(userAuth, controllers.forAddKotToOrder);
trouter.route("/add/:id/parcel/:restId").post(controllers.forParcelCharges);
trouter.route("/add/:id/invoice").post(controllers.forOrderInvoice);
trouter
  .route("/add/:id/removeaddservicecharges/:restId")
  .post(controllers.forRemoveAndAddServiceCharges);
trouter
  .route("/add/:id/removeaddgsttex/:restId")
  .post(controllers.forAddAndRemoveGstTex);
trouter.route("/add/:id/discount/:restId").post(controllers.forDiscount);
trouter.route("/add/:id/nocharge").post(userAuth, controllers.forNoChargeOrder);

trouter
  .route("/add/:id/saveorder")
  .post(userAuth, controllers.currentOrderSaveAsOrderToTable);
trouter
  .route("/add/:id/savepaymentmethod")
  .post(userAuth, controllers.forAddPaymentMethodToTheOrder);

trouter.route("/add/:id/guesttoorder").post(controllers.forAddGuestToOrder);
trouter
  .route("/transfar/:kotid/:prevtableid/:targettableid/save")
  .post(userAuth, controllers.forTransfarKotOrItemsToTable);
trouter
  .route("/transfar/table/:prevtableid/:targettableid/save/table")
  .post(userAuth, controllers.forTransfarTable);
trouter
  .route("/transfar/merg/table/:prevtableid/:targettableid/save/anothertable")
  .post(userAuth, controllers.forMergTableToAnotherTable);

trouter
  .route("/add/table/:id/take-away")
  .post(userAuth, controllers.forAddTakeAwayTable);

//All Edit Routes
trouter.route("/edit/:id/table").patch(controllers.forEditTable);
trouter
  .route("/edit/:id/kotitems/:kotid")
  .patch(controllers.forVoidAndAddKotItems);
trouter
  .route("/edit/:kotid/kotitems/status/:itemid")
  .patch(controllers.forUpdateTheStatusOfTheItems);
trouter
  .route("/add/kot/:id/statustrue")
  .patch(userAuth, controllers.forSetKotIsDeliveredTrue);

//All Delete Routes
trouter.route("/delete/:id/table").delete(controllers.forDeleteTable);
trouter.route("/delete/allorders").delete(controllers.forDeleteAllOrders);

//exporting
module.exports = trouter;
