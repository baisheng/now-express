const express = require("express");
const app = express();
const Pageres = require('pageres');
const captureWebsite  = require('capture-website')
const port = 5000;

// Body parser
app.use(express.urlencoded({ extended: false }));

// Home route
app.get("/", async (req, res) => {
  // const screenshot = await captureWebsite.buffer('https://zcool.com.cn', 'screenshot.png', {
  //   emulateDevice: 'iPhone X'
  // });
  const mysceenshot = await new Pageres({ delay: 2 })
  .src('http://baidu.com', ['1024x768'])
  .run()
  // const screenshot = await new Pageres({ delay: 2 })
  // .src('http://baidu.com', [ '480x320', '1024x768', 'iphone 5s' ], { crop: true })
  // // .src('https://sindresorhus.com', [ '1280x1024', '1920x1080' ])
  // // .src('data:text/html,<h1>Awesome!</h1>', [ '1024x768' ])
  // // .dest(__dirname)
  // .run();
  // console.log(mysceenshot)
  res.contentType('image/jpeg');
  res.send(mysceenshot[0]);
  // res.send("Welcome to a basic express App");
});

// Mock API
app.get("/users", (req, res) => {
  res.json([
    { name: "William", location: "Abu Dhabi" },
    { name: "Chris", location: "Vegas" }
  ]);
});

app.post("/user", (req, res) => {
  const { name, location } = req.body;

  res.send({ status: "User created", name, location });
});

// Listen on port 5000
app.listen(port, () => {
  console.log(`Server is booming on port 5000
Visit http://localhost:5000`);
});
