const express = require('express')
const axios = require('axios')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const PORT = 8800
const getProductURL = (productId) => `https://www.amazon.com/dp/${productId}`
const productDetails = []

async function getPrices(productID) {
  const productURL = getProductURL(productID)
  const { data } = await axios.get(productURL, {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      Host: 'www.amazon.com',
      'User-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36',
      'upgrade-insecure-requests': 1,
    },
  })
  const dom = new JSDOM(data)
  productDetails.push({
   title: dom.window.document.querySelector("h1#title > span#productTitle").textContent,
   price: dom.window.document.querySelector(".a-price .a-offscreen").textContent
  })
  console.log(dom.window.document.querySelector("h1#title > span#productTitle").textContent)
}

getPrices('B073H4GPLQ')


const app = express()
app.get('/productdetails', (req, res) => {
 res.json(productDetails)
})
app.listen(PORT, (req, res) => console.log(PORT))