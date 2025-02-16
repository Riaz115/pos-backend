const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const storage = multer.memoryStorage();
const upload = (fieldName) => multer({ storage }).single(fieldName);

const deleteFromCloudinary = async (imageUrl) => {
  try {
    const publicId = imageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`restaurant-pos-images/${publicId}`);
  } catch (err) {
    console.error("Error deleting image from Cloudinary:", err);
  }
};

// Image upload karne ka middleware
const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    if (req.body.oldImageUrl) {
      await deleteFromCloudinary(req.body.oldImageUrl);
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "restaurant-pos-images" },
      (error, result) => {
        if (error) {
          console.log("error", error);
          return res
            .status(500)
            .json({ msg: "Cloudinary upload failed", error });
        }
        req.file.url = result.secure_url;
        req.file.publicId = result.public_id;
        next();
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary };
