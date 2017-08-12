
const svg = d3.select("#container-chart");
const margin = {top: 30, right: 20, bottom: 30, left: 40};
let width = +svg.attr('width') - margin.left - margin.right;
let height = +svg.attr("height") - margin.top - margin.bottom;
const flatSchemeColor = ["#f39c12", "#d35400", "#c0392b", "#2980b9", "#9b59b6"]
const color = d3.scaleOrdinal().range(flatSchemeColor)
const treemap = d3.treemap().size([width,height]).paddingOuter(10).paddingRight(5).tile(d3.treemapSquarify);

const groupChart = svg.append('g').attr('class','chart').attr('transform','translate('+[margin.left, margin.top]+')');

function draw(err, data){
    if(err){
        console.error(err);
        throw err;
    }
    
    const root = d3.hierarchy(data.data[1], d => d.sinopse )
                    .sum( d => d.vlAnualTotalAdquirido )
                    // .sort( (a,b) => (a.nrQuantidadeProcedimento - b.nrQuantidadeProcedimento ) );
    const tree = treemap(root);
    
    const nodes = groupChart.selectAll("g")
                            .data(tree.leaves())
                            .enter()
                            .append("g")
                            .attr("transform", d => "translate("+[d.x0, d.y0]+")")
    nodes.append("rect")
        .attr("width", d => 0)
        .attr("height", d => 0 )
        .on('click', d => console.log(d))
        .transition()
        .duration(3000)
        .delay(1000)
        .attr("width", d => Math.max(0, d.x1 - d.x0 - 1 ))
        .attr("height", d => Math.max(0, d.y1 - d.y0 - 1 ))
        .attr("fill", d => color(d.data['dsModalidadeLicitacao']))
        

    // groupChart.selectAll(".node")
    //         .data(tree.leaves())
    //         .enter()
    //         .append("rect")
    //         .attr("class","node")
    //         .attr("x", d => d.x0 )
    //         .attr("y", d => d.y0 )
    //         .attr("width", d => Math.max(0, d.x1 - d.x0 - 1 ))
    //         .attr("height", d => Math.max(0, d.y1 - d.y0 - 1 ))
    //         .attr("fill", d => color(d.data['dsModalidadeLicitacao']))
    //         .on('click', d => console.log(d))
    // debugger;
    nodes
    .append('text')
    .transition()
    .duration(1000)
    .delay(4000)
    .attr('dx', 4).attr('dy', 14).text( d => d.data['dsModalidadeLicitacao'] );

}

d3.json("/sinopses/licitacoes/412410/2015",draw)