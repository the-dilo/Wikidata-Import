var fs = require('fs');
var english = JSON.parse(fs.readFileSync('props.en.json', 'utf8'));
var dutch = JSON.parse(fs.readFileSync('props.nl.json', 'utf8'));
// merge them
var result = {};
for (let id in english) {
    result[id] = {
        "en": english[id],
        "nl": null
    }
}

for (let id in dutch) {
    if (result[id]) {
        result[id].nl = dutch[id];
    } else {
        result[id] = {
            "en": null,
            "nl": dutch[id]
        }
    }
}

const sql = require('mssql')

new sql.ConnectionPool('mssql://username:passwerd@localhost/Wikidata').connect().then(pool => {

    for (let id in result) {
        const request = new sql.Request(pool);
        request.input('id', sql.NVarChar, id);
        request.input('en', sql.NVarChar, result[id].en);
        request.input('nl', sql.NVarChar, result[id].nl);

        const insert = `Insert into [Properties](Id, EN, NL) Values(@id, @en, @nl)`;
        request.query(insert);
    }




});

