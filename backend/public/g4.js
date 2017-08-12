const svg = d3.select("#container-chart");
const margin = {top: 30, right: 20, bottom: 30, left: 40};
let width = +svg.attr('width') - margin.left - margin.right;
let height = +svg.attr("height") - margin.top - margin.bottom;
const flatSchemeColor = ["#f39c12", "#d35400", "#c0392b", "#2980b9", "#9b59b6"]
const color = d3.scaleOrdinal().range(d3.schemeCategory20c)
