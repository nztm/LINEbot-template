const express = require('express')
const line = require('@line/bot-sdk')
const app = express()

const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 3000

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

app.get('/', (req, res) => {
  res.send('ok')
})

app.post('/webhook', line.middleware(config), (req, res) => {
  res.status(200).end()

  const events = req.body.events
  const promises = []
  for (let i = 0; i < events.length; i++) {
    const ev = events[i]
    promises.push(echoman(ev))
  }
  Promise.all(promises).catch(err => {
    console.log(err)
  })
})

const client = new line.Client(config)

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null)
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  })
}

app.listen(PORT)
console.log(`Server running at ${PORT}`)
