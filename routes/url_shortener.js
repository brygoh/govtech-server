const db = require('../config/database');
const router = require('express').Router();
const shortid = require("shortid");

const dbQuery = async (query, connection) => {
  return new Promise((resolve, reject) => { 
    connection.query(query, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })  
}

router.route('/:code').get(async (req, res) => {
  db.getConnection(async (err, connection) => {
    if (err) return res.status(400).jsonp({ message: err });
    const shortURL = req.protocol + '://' + req.get('host') + req.originalUrl;
    const checkQuery = `SELECT * FROM url WHERE shortURL = "${shortURL}"`
    const checkResp = await dbQuery(checkQuery, connection);
    console.log(checkResp)
    if (checkResp[0]) {
      console.log('here')
      connection.release()
      return res.redirect('https://' + checkResp[0].actualURL);
    } else {
      connection.release()
      return res.redirect('http://localhost:3000/');
    }
  });
})

router.route('/publish').post(async (req, res) => {
  if (!req.body || req.body.actualURL === '') {
    return res.status(204).jsonp({ message: "Empty body, please go ahead to fill up form" })
  }
  db.getConnection(async (err, connection) => {
    if (err) return res.status(400).jsonp({ message: err });

    const checkQuery = `SELECT * FROM url WHERE actualURL = "${req.body.actualURL}"`;
    const checkResp = await dbQuery(checkQuery, connection);

    if (checkResp[0]) {
      connection.release()
      return res.status(200).jsonp({shortURL: checkResp[0].shortURL});
    } else {
      const shortCode = shortid.generate();
      const shortURL = 'http://localhost:5000/urlShortener/' + shortCode;
      const addQuery = `INSERT INTO url (actualURL, shortURL) VALUES ("${req.body.actualURL}", "${shortURL}")`;
      await dbQuery(addQuery, connection);
      connection.release()
      return res.status(200).jsonp({shortURL: shortURL});
    }
  })
})

module.exports = router;