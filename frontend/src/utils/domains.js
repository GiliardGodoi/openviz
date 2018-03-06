
function calculateDomain (data, acessor) {
  if (Array.isArray(data)) {
    const domain = d3.extent(data, acessor)
    return domain
  }
  throw TypeError('Data must to be an Array')
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
module.exports.calculateCategoricalDomain = calculateCategoricalDomain
module.exports.calculateLogDomain = calculateLogDomain
