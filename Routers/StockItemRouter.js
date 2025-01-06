const express = require("express");
const stockRouter = express.Router();
const controllers = require("../Controllers/StockController");

//all getting routes
stockRouter
  .route("/restaurent/:id/all/stock/items")
  .get(controllers.forGetAllStockItems);

stockRouter
  .route("/restaurent/getdata/edit/:id/stock/items")
  .get(controllers.forGettingDataForEditItem);

//all post
stockRouter
  .route("/restuarent/:id/add/stock/item")
  .post(controllers.forAddStockItemToDataBase);

stockRouter
  .route("/restaurent/item/:id/add/quantity")
  .post(controllers.forAddQuantityToItem);

//all edit routes
stockRouter
  .route("/restaurent/item/:id/edit/stock")
  .patch(controllers.forEditTheStockItem);

//all delete routes
stockRouter.route("/restaurent/item/:id/delete/stock").delete(controllers.forDeleteTheStockItem)

//exporting
module.exports = stockRouter;
