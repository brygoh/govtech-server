const cors = require('cors')
const express = require('express')
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000

// const champion = require('./routes/champion')
const urlShortener = require('./routes/url_shortener')

app.use(cors())
app.use(express.json({ extended: false }));

app.use('/url', urlShortener);
// app.use('/champion', champion);

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})