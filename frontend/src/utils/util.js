function tickValuesByPow (domain) {
  const max = d3.max(domain)
  const range = d3.range(0, 11)
  const values = range.map(i => 10 ** i)
    .filter(item => item < max)
  values.push(max)
  return values
}

function tickValuesByInterpolationRound (domain) {
  const a = d3.min(domain)
  const b = d3.max(domain)
  const iter = d3.interpolateRound(a, b)
  const array = d3.range(0, 1.1, 0.1)
  const values = array.map(item => iter(item))
  return values
}

module.exports.tickValuesByPow = tickValuesByPow
module.exports.tickValuesByInterpolationRound = tickValuesByInterpolationRound
