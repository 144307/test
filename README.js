// $list | foreach-object { MP4Box -dash 1000 -rap -frag-rap $_ }
// MP4Box -dash 1000 -rap -frag-rap test.mp4
// dir ./ | foreach-object { MP4Box -dash 1000 -rap -frag-rap $_ }

const express = require("express");
const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// var formidable = require("formidable");
var fs = require("fs");
var path = require("path");
var MyBD = require("./db");

// var MyBD = require("./read");
var cors = require("cors");
// const { v4: uuidv4 } = require("uuid");

// const sessions = require("express-session");

const hostname = "127.0.0.1";
const port = 8000;

const app = express();

app.use(express.static(__dirname + "/public/"));
app.use(
  cors({
    allowedHeaders: ["Content-Type"],
    origin: "*",
    preflightContinue: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser("1687412654125"));

app.get("/", (req, res) => {
  console.log("/");
  // res.sendFile("./login.html", { root: :"/public/" });
  res.sendFile("index.html", { root: __dirname });
});
app.get("/editor", (req, res) => {
  console.log("/");
  // res.sendFile("./login.html", { root: :"/public/" });
  res.sendFile("editor.html", { root: __dirname });
});

app.get("/getVideos", (req, res) => {
  console.log("/fetchtest");
  // res.sendFile("./login.html", { root: :"/public/" });

  let videos = {};
  fs.readdir("./public/videos", (err, files) => {
    files.forEach((file) => {
      console.log(file);
      videos[file.split(".")[0]] = file;
    });
    console.log("videos", videos);
    res.send(videos);
  });
});

app.get("/fetchtest", (req, res) => {
  console.log("/fetchtest");
  // res.sendFile("./login.html", { root: :"/public/" });
  // res.sendFile("index.html", { root: __dirname });
  res.send("test message");
});

app.get("/getImages", (req, res) => {
  // getInfo
  console.log("/fetchtest");
  let images = {};
  MyBD.getInfo().then((result) => {
    // console.log("getThumbnails result", result)
    res.send(result);
  });
  // fs.readdir("./public/images/thubmbnails", (err, files) => {
  //   files.forEach((file) => {
  //     // console.log(file);
  //     images[file.split(".")[0]] = file;
  //   });
  //   res.send(images);
  // });
});

app.post("/requestimages", (req, res) => {
  console.log("/requestImages");
  console.log("request:", req.body.tags);
  // res.sendFile("./login.html", { root: :"/public/" });
  // return new Promise((resolve, reject) => {
  MyBD.getImagesWithTags(req.body.tags).then((result) => {
    console.log("result images", result);
    res.setHeader("Content-Type", "application/json");
    // res.status(200).json({ authorised: "", value: result });
    // res.send(JSON.stringify(result));
    res.json(result);
  });
  // res.status(500);
  // });
});

app.get("/getTags", (req, res) => {
  console.log("/getTags");
  MyBD.getTags().then((result) => {
    console.log("getTags result", result);
    res.send(result);
  });
});

app.get("/getAssignments", (req, res) => {
  console.log("/getAssignments");
});

app.get("/testRequest", (req, res) => {
  console.log("/testRequest");
  let newAssignments = [
    { object_reference: 2, tag_reference: 4 },
    { object_reference: 2, tag_reference: 3 },
    { object_reference: 2, tag_reference: 2 },
    { object_reference: 2, tag_reference: 5 },
    { object_reference: 2, tag_reference: 6 },
  ];
  MyBD.insertAssignments(newAssignments).then((result) => {
    console.log("testRequest result", result);
  });
});

app.get("/getObjectsWithTags", (req, res) => {
  MyBD.getObjectsWithTags().then((result) => {
    console.log("getObjectsWithTags result", result);
    res.send(result);
  });
});

function checkCodecs() {}

process.on("SIGINT", function () {
  console.log("Got SIGINT.  Going to exit.");
  // MyBD.closeApp();
  process.kill(process.pid);
});

app.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}`);
  // console.log(MyBD.checkLoginData("user", "pass"));
});
