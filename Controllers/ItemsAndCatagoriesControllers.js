//requiring
const path = require("path");
const fs = require("fs");
const Restaurant = require("../Models/RestaurentModel");
const Catagories = require("../Models/CatagoryModel");
const menuItems = require("../Models/MenuItemModel");
const Combo = require("../models/ComboItemModel");

//this is for images url
const imageUrl = "http://localhost:8000/items-images/";
const comboImageUrl = "http://localhost:8000/deals-images/";

//this is for get all catagories of restaurent
const forGetallCatagories = async (req, res) => {
  const id = req.params.id.trim();
  const catagories = await Catagories.find({
    "restaurent.id": id,
  });

  res.status(200).json({ catagories });
};

//this is for get all items of the restauretn
const forGetAllMenuItems = async (req, res) => {
  const id = req.params.id.trim();
  const restMenuItems = await menuItems
    .find({
      "restaurent.id": id,
    })
    .sort({ createdAt: -1 });

  try {
    // Update the image URL for each restaurant
    const allItems = restMenuItems.map((item) => {
      if (item.image) {
        item.image = imageUrl + item.image;
      }
      return item;
    });

    res.status(200).json({ allItems });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for get catagory data for edit
const forGetCatagoryDataForUpdate = async (req, res) => {
  const { id } = req.params;
  try {
    const catagory = await Catagories.findById(id);
    res.status(200).json({ catagory });
  } catch (err) {
    res.status(500).json({ msg: "server error ", err });
  }
};

//this is for getting data for update menu item
const getDataForUpdateItem = async (req, res) => {
  const { id } = req.params;

  try {
    const myItem = await menuItems.findById(id);
    if (myItem.image !== "") {
      myItem.image = imageUrl + myItem.image;
    } else {
      myItem.image = "";
    }

    res.status(200).json({ myItem });
  } catch (err) {
    res.status(500).json({ msg: "server error ", err });
  }
};

//this is for adding counter
const forAddCatagory = async (req, res) => {
  const id = req.params.id;
  const { name, maincatagory } = req.body;
  const myRestaurent = await Restaurant.findById(id);

  let restaurent = {
    id: myRestaurent._id,
  };

  try {
    const newCatagory = new Catagories({
      restaurent: restaurent,
      name,
      maincatagory,
    });

    const savedCatagory = await newCatagory.save();

    myRestaurent.catagories.push({
      id: savedCatagory._id,
      name: savedCatagory.name,
    });

    await myRestaurent.save();

    res.status(201).json({ msg: "Catagory Added Successfully", savedCatagory });
  } catch (err) {
    res.status(500).json({ msg: "server error ", err });
  }
};

//this is for add menu item
const forAddMenuItem = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, catagory, desc, stockItems } = req.body;
    const itemImage = req.file ? req.file.filename : "";

    const parsedStockItems = JSON.parse(stockItems);

    const myRestaurent = await Restaurant.findById(id);
    let restaurent = {
      id: myRestaurent._id,
    };

    const forStockItems = parsedStockItems.map((item) => ({
      id: item.id,
      qty: item.qty,
      qtyType: item.qtyType,
    }));

    const newMenuItem = new menuItems({
      restaurent: restaurent,
      name,
      price,
      catagory,
      desc,
      stockItems: forStockItems,
      image: itemImage,
    });

    const savedMenuItem = await newMenuItem.save();

    myRestaurent.MenuItems.push({
      id: savedMenuItem._id,
      name: savedMenuItem.name,
    });

    await myRestaurent.save();

    res
      .status(201)
      .json({ msg: "Menu item Added Successfully", savedMenuItem });
  } catch (err) {
    console.log("there is error in add counter function", err);
    res.status(500).json({ msg: "server error ", err });
  }
};

//this is for update catagory
const forUpdateCatagory = async (req, res) => {
  const id = req.params.id;
  const { name, maincatagory } = req.body;
  const catagoryData = {
    name: name,
    maincatagory,
  };

  try {
    const newCatagory = await Catagories.findByIdAndUpdate(id, catagoryData);
    res.status(200).json({ msg: "catagory updated succesfully", newCatagory });
  } catch (err) {
    console.log("there is error in the update catagory function", err);
    res.status(500).json({ msg: "server 0error ", err });
  }
};

//this is for update the itme
const forUpdateMenuItem = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, desc, catagory, stockItems } = req.body;

    const parsedStockItems = JSON.parse(stockItems);
    const forStockItems = parsedStockItems.map((item) => ({
      id: item.id,
      qty: item.qty,
      qtyType: item.qtyType,
    }));

    const updatedItem = {
      name,
      price,
      desc,
      catagory,
      stockItems: forStockItems,
    };
    if (req.file) {
      updatedItem.image = req.file.filename;
      const existingItem = await menuItems.findById(id);

      const existImage = path.join(
        __dirname,
        "..",
        "menuItemImages",
        existingItem.image
      );

      fs.unlink(existImage, (err) => {
        if (err) {
          console.log("there is error in  delete image", err);
        } else {
          console.log("image deleted successfully");
        }
      });
    }
    const newItem = await menuItems.findByIdAndUpdate(id, updatedItem);

    res.status(200).json({ msg: "user Updated Successfully", newItem });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
    console.log("there is error in update owner user function", err);
  }
};

//this is for delete catagory
const forDeleteCatagory = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedCatagory = await Catagories.findByIdAndDelete(id);
    res
      .status(200)
      .json({ msg: "catagory deleted successfully", deletedCatagory });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for delete menu item
const forDeleteMenuItem = async (req, res) => {
  const id = req.params.id;
  try {
    const myItem = await menuItems.findById(id);
    const imagePath = path.join(
      __dirname,
      "..",
      "menuItemImages",
      myItem.image
    );
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.log("image not deleted", err);
      } else {
        console.log("image deleted sucessfully");
      }
    });

    const deleteItem = await menuItems.findByIdAndDelete(id);

    res.status(200).json({ msg: "deleted successfully", deleteItem });
  } catch (err) {
    console.log("there is error in the delete item function ", err);
  }
};

//this is for adding deal item
const forCreateComboItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, items, price, desc } = req.body;

    const myRestaurent = await Restaurant.findById(id);
    let restaurent = {
      name: myRestaurent.restName,
      email: myRestaurent.restEmail,
      id: myRestaurent._id,
    };

    const itemImage = req.file ? req.file.filename : "";
    const forItems = await menuItems.find({ _id: { $in: items } });
    const comboItems = forItems.map((item) => {
      const quantity = req.body.quantities[item._id];
      return {
        id: item._id,
        name: item.name,
        qty: quantity,
      };
    });

    // Create the combo deal
    const newCombo = new Combo({
      restaurent: restaurent,
      name,
      items: comboItems,
      price,
      desc,

      image: itemImage,
    });

    await newCombo.save();

    res.status(201).json({ msg: "Combo created successfully", newCombo });
  } catch (err) {
    console.log("there is error in the create combo item function ", err);
    res.status(500).json({ msg: "Failed to create combo", err });
  }
};

//this is for  getting all combos items data
const forGetAllComboItems = async (req, res) => {
  const id = req.params.id.trim();
  const comboMenuItems = await Combo.find({
    "restaurent.id": id,
  });

  try {
    if (!comboMenuItems || comboMenuItems.length === 0) {
      return res
        .status(404)
        .json({ msg: "No Items found for this restaurent." });
    }

    // Update the image URL for each comboaurant
    const updatedrestComboItems = comboMenuItems.map((item) => {
      if (item.image) {
        item.image = comboImageUrl + item.image;
      }
      return item;
    });

    res.status(200).json({ updatedrestComboItems });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting the data for edit the catagory
const getDataForEditComboItem = async (req, res) => {
  const { id } = req.params;

  try {
    const myItem = await Combo.findById(id);
    if (myItem.image !== "") {
      myItem.image = comboImageUrl + myItem.image;
    } else {
      myItem.image = "";
    }

    res.status(200).json({ myItem });
  } catch (err) {
    res.status(500).json({ msg: "server error ", err });
  }
};

//this is for edit combo item
const forEditComboItem = async (req, res) => {
  const id = req.params.id;
  const { name, items, price, desc, qty } = req.body;

  const forItems = await menuItems.find({ _id: { $in: items } });

  const comboItems = forItems.map((item) => {
    const quantity = req.body.quantities[item._id];
    return {
      id: item._id,
      name: item.name,
      qty: quantity,
    };
  });

  const updatedItem = {
    name,
    items: comboItems,
    price,
    desc,
  };

  if (req.file) {
    updatedItem.image = req.file.filename;
    const existingItem = await Combo.findById(id);

    if (existingItem) {
      const existImage = path.join(
        __dirname,
        "..",
        "comboItemImages",
        existingItem.image
      );
      fs.unlink(existImage, (err) => {
        if (err) {
          console.log("there is error in  delete image", err);
        } else {
          console.log("image deleted successfully");
        }
      });
    }
  }

  try {
    const newDeal = await Combo.findByIdAndUpdate(id, updatedItem);
    res.status(200).json({ msg: "user Updated Successfully", newDeal });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
    console.log("there is error in update owner user function", err);
  }
};

//this is for delete the combo item
const forDeleteComboItem = async (req, res) => {
  const id = req.params.id;
  try {
    const myItem = await Combo.findById(id);
    if (myItem.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        "comboItemImages",
        myItem.image
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.log("image not deleted", err);
        } else {
          console.log("image deleted sucessfully");
        }
      });
    }

    const deleteItem = await Combo.findByIdAndDelete(id);

    res.status(200).json({ msg: "deleted successfully", deleteItem });
  } catch (err) {
    console.log("there is error in the delete item function ", err);
  }
};

//exporting
module.exports = {
  forAddCatagory,
  forGetCatagoryDataForUpdate,
  forAddMenuItem,
  forGetallCatagories,
  forGetAllMenuItems,
  forUpdateCatagory,
  forDeleteCatagory,
  getDataForUpdateItem,
  forUpdateMenuItem,
  forDeleteMenuItem,
  forCreateComboItem,
  forGetAllComboItems,
  getDataForEditComboItem,
  forEditComboItem,
  forDeleteComboItem,
};
