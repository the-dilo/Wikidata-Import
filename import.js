const reader = require('./reader')
const putDocFromLine = require('./put_doc_from_line')

const [ file, start, end ] = process.argv.slice(2)
reader(putDocFromLine, file, start, end)