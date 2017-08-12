
const svg = d3.select("#container-chart");
const margin = {top: 30, right: 20, bottom: 30, left: 40};
let width = +svg.attr('width') - margin.left - margin.right;
let height = +svg.attr("height") - margin.top - margin.bottom;
const flatSchemeColor = ["#f39c12", "#d35400", "#c0392b", "#2980b9", "#9b59b6"]
const color = d3.scaleOrdinal().range(d3.schemeCategory20c)

const packLayout = d3.pack().size([width,height]).padding(1.5);

function draw(err, response) {
    if(err){
        throw err;
    }
    
    const root = d3.hierarchy(response, d => d.data )
                    .sum( d => d.vlContratado );

    const pack = packLayout(root);
    // debugger;
    let nodes = svg.selectAll(".node")
                    .data(pack.leaves())
                    .enter()
                    .append("g")
                    .attr("class", "node")
                    .attr("transform", d => "translate("+[d.x , d.y]+")");
    nodes.append("circle")
        .attr("id" , d => d.data._id )
        .attr("fill", "steelblue" )
        .attr("r", d => 0 )
        .transition()
        .duration(3000)
        .delay(1000)
        .attr("r", d => d.r );
}

d3.json("/fornecedores/412410/2015",draw)
