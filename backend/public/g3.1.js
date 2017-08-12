

const margin = {top: 30, right: 20, bottom: 30, left: 40};
const flatSchemeColor = ["#f39c12", "#d35400", "#c0392b", "#2980b9", "#9b59b6"]
const color = d3.scaleOrdinal().range(d3.schemeCategory20c)

const svg = d3.select("#container-chart")
                .append("g")
                .attr("transform","translate(480,480)")

let width = +svg.attr('width') - margin.left - margin.right;
let height = +svg.attr("height") - margin.top - margin.bottom;

function draw(err, response) {
    if(err){
        throw err;
    }
    let data = response.data;
    let maxv = d3.max(data, d => d.vlContratado )
    let minv = d3.min(data, d => d.vlContratado )
    console.log([minv,maxv])

    let radiusScale = d3.scaleSqrt().domain([minv,maxv]).range([5,70])

    const simulation = d3.forceSimulation()
        .force("x", d3.forceX(width ).strength(0.05))
        .force("y", d3.forceY(height).strength(0.05))
        .force("collide", d3.forceCollide( d => radiusScale(d.vlContratado) + 1 ))

    let circles = svg.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class","bubble")
                    .attr("r", d => radiusScale(d.vlContratado))
                    .attr("fill", "steelblue")
    
    simulation.nodes(data)
        .on("tick", ticked)

    function ticked() {
        circles.attr("cx", d => d.x ).attr("cy", d => d.y )    
    }   
}

d3.json("/fornecedores/412410/2015",draw)
