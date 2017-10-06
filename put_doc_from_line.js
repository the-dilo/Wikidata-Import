
//const handleConflict = require('./handle_conflict')
const sql = require('mssql')
let pool = null;
sql.connect('mssql://username:password@localhost/Wikidata').then(p => { pool = p; });
module.exports = function (line) {
  // Remove the comma at the end of the line
  line = line.replace(/,$/, '');
  // Will throw if it isnt valid JSON
  const json = JSON.parse(line)
  const { id, type, labels } = json
  //console.log(line + "\n");
  return new Promise(async (resolve, reject) => {
    // console.log(`insert into [Documents](Id, [Type], Labels, [Document]) Values('${id}','${type}','${JSON.stringify(labels)}', '${line.replace(/'/gi,"\\'")}')`);
    // resolve();
    try {

      const request = new sql.Request();
      request.input('id', sql.NVarChar, id);
      request.input('type', sql.NVarChar, JSON.stringify(type));
      request.input('labels', sql.NVarChar, JSON.stringify(labels));
      request.input('document', sql.NVarChar, JSON.stringify(json));
      const insert = `Insert into [Documents](Id, [Type], Labels, [Document]) Values(@id, @type, @labels, @document)`;
      await request.query(insert);
      // console.dir(result)
      //sql.close();
      resolve(id);
    } catch (err) {
      console.error(err.message);
    }
  })

}