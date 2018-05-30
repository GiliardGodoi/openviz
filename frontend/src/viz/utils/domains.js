
function calculateDomain (data, acessor) {
  if (Array.isArray(data)) {
    const domain = d3.extent(data, acessor)
    return domain
  }
  throw TypeError('Data must to be an Array')
}

function calculateZeroToMaxDomain (data, acessor) {
  const domain = [
    0,
    d3.max(data, acessor),
  ]
  return domain
}

function calculateCategoricalDomain (data, acessor) {
  const domain = d3.set(data, acessor)
    .values()
    .sort((a, b) => a - b)
  return domain
}

function calculateLogDomain (data, acessor) {
  const logDomain = [1, d3.max(data, acessor)]
  return logDomain
}

module.exports.calculateDomain = calculateDomain
module.exports.zeroToMaxDomain = calculateZeroToMaxDomain
module.exports.calculateCategoricalDomain = calculateCategoricalDomain
module.exports.calculateLogDomain = calculateLogDomain
