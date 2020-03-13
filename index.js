const express = require("express");
const app = express();
// const Pageres = require('pageres');
// const captureWebsite  = require('capture-website')
const port = 5000;
const parse = require('url');
const { getScreenshot } = require('./chromium');
const { getInt, getUrlFromPath, isValidUrl } = require('./validator');
// const got = require('got');
const cheerio = require('cheerio')
// Body parser
app.use(express.urlencoded({ extended: false }));
// const Readability = require('readability')
// const JSDOM = require("jsdom").JSDOM;
// const requestPromise = require("request-promise-native");
const read = require('read-art')
// import htmlMetadata from 'html-metadata';
// const parseDublinCore = require('html-metadata').parseDublinCore;
// const htmlMetadata = require('html-metadata')
/**
 * Gets the self full URL from the request
 *
 * @param {object} req Request
 * @returns {string} URL
 */
const getFullUrl = (req) => `${req.protocol}://${req.headers.host}${req.originalUrl}`;

function fullUrl(req) {
  return parse.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  });
}
app.get("*", async (req, res) => {
  try{
   // const targetUrl = 'http://www.bloomberg.com/news/articles/2016-05-24/as-zenefits-stumbles-gusto-goes-head-on-by-selling-insurance'
   //  console.log(req.url)
    // const { pathname = '/', query = {} } = parse(req.url, true);
    // const {pathname = '/', query = {}} = fullUrl(req)
    // console.log(fullUrl(req))
    // console.log('ss-s-s-s-s-s--s-')
    // const {pathname} = fullUrl(req)
    // const { type = 'png', quality, fullPage } = query;
    // const targetUrl = getUrlFromPath(pathname);
    // console.log(targetUrl)
    // const qual = getInt(quality);
    console.log('targeturl .......')
    const targetUrl = getUrlFromPath(req.originalUrl)
    console.log(targetUrl)
    console.log('targeturl .......')
    if (!isValidUrl(targetUrl)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/html');
      res.end(`<h1>Bad Request</h1><p>The url <em>${targetUrl}</em> is not valid.</p>`);
    }

    else {

      const metascraper = require('metascraper')([
        require('metascraper-author')(),
        require('metascraper-date')(),
        require('metascraper-description')(),
        require('metascraper-image')(),
        require('metascraper-logo')(),
        require('metascraper-clearbit')(),
        require('metascraper-publisher')(),
        require('metascraper-title')(),
        require('metascraper-url')(),
        // require('metascraper-readability')()
      ])
      const got = require('got')
      // const targetUrl = 'http://open.163.com/newview/movie/courseintro?newurl=/special/opencourse/englishs1.html'
      // const { body: html, url } = await got(targetUrl, {rejectUnauthorized: false})
      const { body: html, url } = await got(targetUrl, {
        retry: 10
      })
      const metadata = await metascraper({ html, url })
      // console.log(metadata)
      // console.log(    metascraper.readability)
      // const Readability = require('readability')
      // const jsdom = require('jsdom')
      //
      // const { JSDOM, VirtualConsole } = jsdom
      //
      // // const readability = memoizeOne(($, url) => {
      // const $ = cheerio.load(html)
      // const dom = new JSDOM($.html(), { url, virtualConsole: new VirtualConsole() })
      // const reader = new Readability(dom.window.document)
      // const content = await reader.parse()
      // })
      const json = {
        ...metadata,
        // readability: {
        //   ...content
        // }
      }
      res.setHeader('Content-Type', 'text/json');
      res.end(JSON.stringify(json))
    }
  } catch (error) {
    console.log(error)
    // console.log(error.response.body);
    //=> 'Internal server error ...'
  }
})
// Home route
app.get("/aabbcc", async (req, res) => {
  // const screenshot = await captureWebsite.buffer('https://zcool.com.cn', 'screenshot.png', {
  //   emulateDevice: 'iPhone X'
  // });
  // const mysceenshot = await new Pageres({ delay: 2 })
  // .src('http://baidu.com', ['1024x768'])
  // .run()
  // const screenshot = await new Pageres({ delay: 2 })
  // .src('http://baidu.com', [ '480x320', '1024x768', 'iphone 5s' ], { crop: true })
  // // .src('https://sindresorhus.com', [ '1280x1024', '1920x1080' ])
  // // .src('data:text/html,<h1>Awesome!</h1>', [ '1024x768' ])
  // // .dest(__dirname)
  // .run();
  // console.log(mysceenshot)
  // res.contentType('image/jpeg');
  // res.send(mysceenshot[0]);
  // res.send("Welcome to a basic express App");
  try {
    const { pathname = '/', query = {} } = parse(req.url, true);
    const { type = 'png', quality, fullPage } = query;
    const url = getUrlFromPath(pathname);
    const qual = getInt(quality);
    if (!isValidUrl(url)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/html');
      res.end(`<h1>Bad Request</h1><p>The url <em>${url}</em> is not valid.</p>`);
    } else {
      const file = await getScreenshot(url, type, qual, fullPage);
      res.statusCode = 200;
      res.setHeader('Content-Type', `image/${type}`);
      res.end(file);
    }
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>');
    console.error(e.message);
  }
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
