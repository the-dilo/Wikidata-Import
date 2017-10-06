const LineByLineReader = require('line-by-line')

module.exports = function (fn, file, start, end) {
  if (typeof file !== 'string') throw new Error('Missing file name.')

  if (start != null) start = parseInt(start)
  if (end != null) end = parseInt(end)

  start = start != null ? parseInt(start) : 0
  end = end != null ? parseInt(end) : Infinity

  const lr = new LineByLineReader(file, { skipEmptyLines: true })
  lr.on('error', console.error)
  lr.on('line', handleLine(fn, lr, start, end))
  lr.on('end', console.log.bind(console, 'done!'))
}

var counter = -1
const handleLine = (fn, lr, start, end) => (line) => {
  counter += 1
  if (counter < start) return
  if (counter > end) return lr.close()
  if (line.trim() === '[' || line.trim() === ']') return
  lr.pause()
  // Handle lines sequentially
  // Pro: gives time to DB to diggest all those lines
  // Con: slower than parallelizing
  fn(line).then(() => {
    if (counter < 1000 || counter % 1000 == 0) {
      console.log(counter);
    }
    lr.resume()
  })
}