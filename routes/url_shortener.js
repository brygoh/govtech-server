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

const regexCheck = (value) => {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  if (value.match(expression)) return true
  return false
}

router.route('/:code').get(async (req, res) => {
  db.getConnection(async (err, connection) => {
    if (err) return res.status(400).jsonp({ message: err });
    // const shortURL = req.protocol + '://' + req.get('host') + req.originalUrl;
    const checkQuery = `SELECT * FROM url WHERE shortId = "${req.params.code}"`
    const checkResp = await dbQuery(checkQuery, connection);
    if (checkResp[0]) {
      connection.release()
      return res.redirect(checkResp[0].actualURL);
    } else {
      connection.release()
      return res.status(400).jsonp({ message: "Invalid record please try again" });
    }
  });
})

router.route('/delete').post(async (req, res) => {
  const actualURL = req.body.actualURL

  if (!req.body || actualURL === '') {
    return res.status(204).jsonp({ message: "Empty body, please go ahead to fill up form" })
  }

  db.getConnection(async (err, connection) => {
    if (err) return res.status(400).jsonp({ message: err });
    if (!regexCheck(actualURL)) return res.status(400).jsonp({ message: "URL is wrongly formatted" });

    const checkQuery = `SELECT * FROM url WHERE actualURL = "${actualURL}"`;
    const checkResp = await dbQuery(checkQuery, connection);

    if (checkResp[0]) {
      const deleteQuery = `DELETE FROM url WHERE actualURL = "${actualURL}"`;
      await dbQuery(deleteQuery, connection);

      connection.release()
      return res.status(200).jsonp({message: 'Delete has been successful'});
    } else {
      connection.release()
      return res.status(400).jsonp({message: 'URL does not exist within the database'});
    }
  })
})

router.route('/publish').post(async (req, res) => {
  const actualURL = req.body.actualURL

  if (!req.body || actualURL === '') {
    return res.status(204).jsonp({ message: "Empty body, please go ahead to fill up form" })
  }

  db.getConnection(async (err, connection) => {
    if (err) return res.status(400).jsonp({ message: err });
    if (!regexCheck(actualURL)) return res.status(400).jsonp({ message: "URL is wrongly formatted" });

    const checkQuery = `SELECT * FROM url WHERE actualURL = "${actualURL}"`;
    const checkResp = await dbQuery(checkQuery, connection);

    if (checkResp[0]) {
      connection.release()
      return res.status(200).jsonp({shortId: checkResp[0].shortId});
    } else {
      var shortId = shortid.generate();
      const existQuery = `SELECT * FROM url WHERE shortId = "${shortId}"`;
      const existResp = await dbQuery(existQuery, connection);
      if (existResp[0]) {
        shortId = shortid.generate()
      }

      const addQuery = `INSERT INTO url (actualURL, shortId) VALUES ("${actualURL}", "${shortId}")`;
      await dbQuery(addQuery, connection);
      connection.release()
      return res.status(200).jsonp({shortURL: shortURL});
    }
  })
})

module.exports = router;