module.exports = r =>
  'archon-xx-4xx-yxx'.replace(/[xy]/g, c => 
    (r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8))
    .toString(16))