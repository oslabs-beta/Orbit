const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const CryptoJS = require('crypto-js');

const secretKey = require('../secretKey');
/* Example db URI */
const EX_PG_URI =
  'postgres://zhocexop:Ipv9EKas6bU6z9ehDXZQRorjITIXijGv@ziggy.db.elephantsql.com:5432/zhocexop';

const sqlFilePath = path.resolve(__dirname, '../../public/tableQuery.sql');
console.log('Attempting to read SQL file from:', sqlFilePath);

const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

const SQLController = {};

// function to decrypt incoming PSQL URLs
const decryptedURI = (encryptedURL) => {
  const bytes = CryptoJS.AES.decrypt(encryptedURL, secretKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
};

SQLController.getSQLSchema = (req, res, next) => {
  let PSQL_URI;

  // if user sent URI, call decryptedURI to decrypt the link
  req.body.link
    ? (PSQL_URI = decryptedURI(req.body.link))
    : (PSQL_URI = EX_PG_URI);

  const db = new Pool({ connectionString: PSQL_URI });
  db.query(sqlQuery)
    .then((data) => {
      res.locals.SQLSchema = data.rows[0].tables;
      return next();
    })
    .catch((err) => {
      const errObj = {
        log: `Error in getSQLSchema: ${err}`,
        status: 400,
        message: {
          err: 'Unable to connect to SQL database, please confirm URI',
        },
      };
      return next(errObj);
    });
};

/* Format the SQL Schema for visualizer */
SQLController.formatGraphData = (req, res, next) => {
  try {
    const sqlSchema = res.locals.SQLSchema;
    let graphData = [];
    for (const tableName of Object.keys(sqlSchema)) {
      const tableObject = {};
      tableObject[tableName] = sqlSchema[tableName];
      if (sqlSchema[tableName].foreignKeys) {
        const foreignKeysArray = [];
        for (const fk of Object.keys(sqlSchema[tableName].foreignKeys)) {
          const foreignKeyObject = {};
          foreignKeyObject[fk] = sqlSchema[tableName].foreignKeys[fk];
          foreignKeysArray.push(foreignKeyObject);
        }
        sqlSchema[tableName].foreignKeys = foreignKeysArray;
      }

      if (sqlSchema[tableName].referencedBy) {
        const referencedByArray = [];
        for (const refBy of Object.keys(sqlSchema[tableName].referencedBy)) {
          const referencedByObject = {};
          referencedByObject[refBy] = sqlSchema[tableName].referencedBy[refBy];
          referencedByArray.push(referencedByObject);
        }
        sqlSchema[tableName].referencedBy = referencedByArray;
      }

      if (sqlSchema[tableName].columns) {
        const columnsArray = [];
        for (const columnName of Object.keys(sqlSchema[tableName].columns)) {
          const columnsObject = {};
          columnsObject[columnName] = sqlSchema[tableName].columns[columnName];
          columnsArray.push(columnsObject);
        }
        sqlSchema[tableName].columns = columnsArray;
      }

      graphData.push(tableObject);
    }
    res.locals.SQLSchema = graphData;
    return next();
  } catch (err) {
    const errObject = {
      log: `Error in formatGraphData: ${err}`,
      status: 400,
      message: { err: `Format graph data failed` },
    };
    return next(errObject);
  }
};
module.exports = SQLController;
