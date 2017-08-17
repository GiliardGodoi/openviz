const svg = d3.select("#container-chart");
const margin = {top: 30, right: 20, bottom: 30, left: 100};
let width = +svg.attr('width') - margin.left - margin.right;
let height = +svg.attr("height") - margin.top - margin.bottom;
const flatSchemeColor = ["#f39c12", "#d35400", "#c0392b", "#2980b9", "#9b59b6"]
//const color = d3.scaleOrdinal().range(d3.schemeCategory20c)
const colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]; // alternatively colorbrewer.YlGnBu[9]

function draw(err, received) {
    if(err){
        throw err;
    }
    const data = received.data.sinopse || [];
    const lsModalidades = data.map( d => d['dsModalidade'] )
                            .filter( (item, pos, array) => {
                                return array.indexOf(item) == pos;
                            })
    const lsCriterioAvaliacao = data.map( d => d['dsCriterioAvaliacao'] )
                                    .filter( (item, pos, array) => {
                                        return array.indexOf(item) == pos;
                                    });
    
    const gridSize = Math.floor(width / lsCriterioAvaliacao.length ) ;

    const chart = svg.append('g').attr('transform', 'translate('+[margin.left, margin.top]+')');

    const yScale = d3.scaleBand().domain(lsModalidades).range([0,height]).paddingOuter(0.05).paddingInner(0.05);
    const xScale = d3.scaleBand().domain(lsCriterioAvaliacao).range([0,width]).paddingOuter(0.05).paddingInner(0.05);

    const gridBaseData = d3.cross(lsModalidades,lsCriterioAvaliacao);

    debugger;

    const xLabels = chart.append("g").attr("class","g-y-label")
                            .selectAll(".x-label")
                            .data(lsModalidades)
                            .enter()
                            .append("text")
                            .text(d => d)
                            .attr('x', 0)
                            .attr('y', (d, i) => yScale(d)  )
                            .style('text-anchor', "end")
                            .attr("transform", "translate(-6,0)")
                            .attr("class", 'label y-label');

    const yLabels = chart.append("g").attr("class","g-x-label")
                            .selectAll(".y-label")
                            .data(lsCriterioAvaliacao)
                            .enter()
                            .append("text")
                            .text( d => d)
                            .attr("x", (d, i) => xScale(d))
                            .attr("y", 0)
                            .style("text-anchor", "middle")
                            .attr("transform", "translate(0,-6)")
                            .attr("class", "label y-label");

    const cards = chart.append("g").attr("class","cards")
                        .selectAll("rect")
                        .data(gridBaseData, d => d.join(":") )
                        .enter()
                        .append("rect")
                        .attr("x", (d, i) => xScale(d[1]) )
                        .attr("y" , (d, i) => yScale(d[0]) )
                        .attr("rx", 4)
                        .attr("ry", 4)
                        .attr("width",  d => xScale.bandwidth() )
                        .attr("height", d => yScale.bandwidth() )
                        .attr("class","bordered")
                        .on("click", (d) => {
                            console.log(d.join(" : "));
                        })

    const existentes = chart.select("g.cards")
                    .selectAll("rect")
                    .data(data, d => [d['dsModalidade'],d['dsCriterioAvaliacao'] ].join(":") )
    const novos = existentes.enter()
                    .append("rect")
                    .attr("x", (d, i) => xScale(d['dsCriterioAvaliacao']) )
                    .attr("y" , (d, i) => yScale(d['dsModalidade']) )
                    .attr("rx", 4)
                    .attr("ry", 4)
                    .attr("width",  d => xScale.bandwidth() )
                    .attr("height", d => yScale.bandwidth() )
                    .attr("fill", "steelblue")
                    .classed("bordered",false)
                    .merge(existentes)
            
            // novos.exit().remove()
            console.log(novos)
    debugger;
}

d3.json("/sinopses/modalidades/412410/2014",draw);