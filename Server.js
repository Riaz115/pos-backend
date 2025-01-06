//Requiring
const express = require("express");
const app = express();
const router = require("./Routers/MyRouters");
const restRouter = require("./Routers/RestaurentRouter");
const counterUser = require("./Routers/CounterUserRouter");
const tableRouter = require("./Routers/TableRouter");
const daysRouter = require("./Routers/DayCloseOpenRouter");
const stockRouter = require("./Routers/StockItemRouter");
const DbConn = require("./DB/DBConn");
const cors = require("cors");

//Variables
const port = process.env.PORT || 8000;

//cors options
const Options = {
  origin: "http://localhost:3000",
  methods: "POST,GET,PUT ,DELETE,PATCH,HEAD,UPDATE",
  credentials: true,
};

//middlewaresa
app.use(express.json());
app.use(cors(Options));

app.use("/images", express.static("UserImages"));
app.use("/restImages", express.static("RestaurentImages"));
app.use("/user-images", express.static("CounterUserImages"));
app.use("/items-images", express.static("menuItemImages"));
app.use("/deals-images", express.static("comboItemImages"));
app.use("/api", router);
app.use("/api", restRouter);
app.use("/api", counterUser);
app.use("/api", tableRouter);
app.use("/api", daysRouter);
app.use("/api", stockRouter);

//listening the app
DbConn()
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        console.log("there is eror", err);
      } else {
        console.log("app is listening at port no ", port);
      }
    });
  })
  .catch((err) => {
    console.log("there is error in app runing or database", err);
  });
