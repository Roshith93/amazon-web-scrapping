const express = require('express')
const axios = require('axios')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const PORT = 8800
const getProductURL = (productId) => `https://www.amazon.in/dp/${productId}`
const productDetails = []

async function getPrices(productID) {
  const productURL = getProductURL(productID)
  const { data } = await axios.get(productURL, {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      Host: 'www.amazon.in',
      'User-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36',
      'upgrade-insecure-requests': 1,
    },
  })
  const dom = new JSDOM(data)
  const $ = (element) => dom.window.document.querySelector(element)
  let title = $('h1#title > span#productTitle').textContent.trim()
  let price = $('.a-price .a-offscreen').textContent
  let merchantInfo = $('div#merchant-info a.a-link-normal').textContent
  let features = $('#feature-bullets').getElementsByTagName("span")
  let itemDetails = []
  for(let i=0; i< features.length; i++) {
    itemDetails.push(features[i].textContent.trim())
  }
  let offerRootElement = $('#moreBuyingChoices_feature_div')
  let offersElements = offerRootElement.querySelectorAll('.mbc-offer-row')

  let pinnedOffers = offersElements.forEach((el,index) => {
    console.log(index)
      let price = el.querySelector('.a-size-medium').textContent
      // let qty = el.querySelector('.a-size-small').textContent
      // let deliveryCharge = el.querySelector('#mbc-delivery-3 span').textContent
      return {
        price, 
      }
  })
  console.log(pinnedOffers)
  productDetails.push({
    title,
    price,
    'merchant-info': merchantInfo,
    features: itemDetails
  })
}

getPrices('B003D7PSVS')

const app = express()
app.get('/productdetails', (req, res) => {
  res.json(productDetails)
})
app.listen(PORT, (req, res) => console.log(PORT))
