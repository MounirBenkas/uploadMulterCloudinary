require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 8080;
const { cloudinary } = require("./cloudinary");
const { upload } = require("./multer");
const fs = require("fs-extra");

//Midleware
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.get("/", (req, res) => {
  res.render("index");
});

//Upload image
app.post("/", upload, async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path);
  console.log(result);
  const post_detail = {
    title: req.body.title,
    image: result.public_id,
    secure_url: result.url,
  };
  await fs.unlink(req.file.path);
  res.status(201).json(post_detail);
});
app.listen(port, () => {
  console.log(`running on port : ${port}`);
});
