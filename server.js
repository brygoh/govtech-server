const cors = require('cors')
const express = require('express')

const app = express()
const port = 5000
const urlShortener = require('./routes/url_shortener')

app.use(cors())
app.use(express.json({ extended: false }));

app.use('/urlShortener', urlShortener);

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})