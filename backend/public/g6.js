const flatSchemeColor = ["#f39c12", "#d35400", "#c0392b", "#2980b9", "#9b59b6"]
const color = d3.scaleOrdinal().range(d3.schemeCategory20c);

const gMain = {};
const gMini = {};
const chart = {};
let data = [];

function x(d){
    return d["vlContratado"];
}

function y(d){
    return d["nmFornecedor"];
}

function key(d){
    return d["_id"]
}

function init(){
    initMargin()
    initGroupsSVGElements();
    initScales();
    initAxis();
    initBrush();
    console.log('initialize elements');
}

function initMargin(){
    gMain.margin = {top: 10, right: 10, bottom: 30, left: 100};
    gMain.width = 860 - gMain.margin.left - gMain.margin.right;
    gMain.height = 500 - gMain.margin.top - gMain.margin.bottom;

    gMini.margin = {top: 10, right: 10, bottom: 30, left: 10};
    gMini.width = 100 - gMini.margin.right - gMini.margin.left;
    gMini.height = 500 - gMini.margin.top - gMini.margin.bottom;
}

function initGroupsSVGElements(){
    let width = gMini.width+gMini.margin.left+gMini.margin.right+gMain.width+gMain.margin.right+ gMain.margin.left;
    let height = gMain.height+gMain.margin.top+gMain.margin.bottom;
    chart.svg = d3.select("#container-chart")
                .append("svg")
                .attr("class","svgWrapper")
                .attr("width",width)
                .attr("height",height);

    chart.defs = chart.svg.append("defs")
                        .append("clipPath")
                        .attr("id","clip")
                        .attr("x", -gMain.margin.left)
                        .attr("width",gMain.margin.left + gMain.width)
                        .attr("height",gMain.height);

    chart.MainGroup = chart.svg.append("g")
                            .attr("class","mainGroup")
                            .attr("transform","translate("+[gMain.margin.left,gMain.margin.top]+")")
                            .append("g")
                            .attr("clip-path","url(#clip)")
                            .style("clip-path","url(#clip)");

    let translateXMini = gMain.margin.left+gMain.margin.right+gMain.width+gMini.margin.left;
    let translateYMini = gMini.margin.top;
    chart.MiniGroup = chart.svg.append("g")
                            .attr("class","miniGroup")
                            .attr("transform","translate("+[translateXMini,translateYMini]+")");
    chart.brushGroup = chart.svg.append("g")
                            .attr("class","brushGroup")
                            .attr("transform","translate("+[translateXMini,translateYMini]+")");                 
}

function initScales(){
    gMain.xScale = d3.scaleLinear().range([0,gMain.width]);
    gMini.xScale = d3.scaleLinear().range([0,gMini.width]);

    gMain.yScale = d3.scaleBand().range([0, gMain.height]).padding(0.4).paddingOuter(0);
    gMini.yScale = d3.scaleBand().range([0, gMini.height]).padding(0.4).paddingOuter(0);

    gMain.yZoom = d3.scaleLinear().range([0, gMain.height]).domain([0, gMain.height]);
}

function initAxis(){
    gMain.xAxis = d3.axisBottom().scale(gMain.xScale).ticks(5);
    //add group for the x axis
    d3.select(".mainGroupWrapper").append("g").attr("class","axis x-axis").attr("transform", "translate("+[0,gMain.height]+")");
    
    gMain.yAxis = d3.axisLeft().scale(gMain.yScale).tickSize(0).tickSizeOuter(0);
    chart.MainGroup.append("g").attr("class","axis y-axis").attr("transform","translate(-5,0)");
}

function initBrush(){
    chart.brush = d3.brushY().extent([[0,0],[gMini.width,gMini.height]]).on("brush",brushmove);
    chart.gBrush = d3.select(".brushGroup").append("g").attr("class","brush").call(chart.brush).call(chart.brush.move,null);
    chart.gBrush.selectAll("rect").attr("width",gMini.width);
}

function draw(_){
    if(!_){
        return
    }
    data = _;
    xDomain = [0, d3.max(data, d => x(d) )];
    yDomain = data.map( d => y(d) );
    gMain.xScale.domain(xDomain);
    gMini.xScale.domain(xDomain);
    gMain.yScale.domain(yDomain);
    gMini.yScale.domain(yDomain);

    drawAxis();

    //mini bar chart
    //DATA JOIN
    var mini_bar = d3.select(".miniGroup").selectAll(".bar").data(data, d => key(d) );
    //UPDATE
    mini_bar.attr("width", d => gMini.xScale(x(d)))
            .attr("y", d => gMini.yScale(y(d)))
            .attr("height", gMini.yScale.bandwidth() );
    //ENTER
    mini_bar.enter().append("rect").attr("class","rect").attr("x", 0)
            .attr("width", d => gMini.xScale(x(d)))
            .attr("y", d => gMini.yScale(y(d)))
            .attr("height", gMini.yScale.bandwidth())
            .attr("fill","#0080ff");
    //EXIT
    mini_bar.exit().remove();

    chart.gBrush.call(chart.brush.move,[0,50]);

    update(data);
}

function drawAxis(){
    d3.select(".mainGroupWrapper").select(".axis.x-axis").call(gMain.xAxis);
    d3.select(".mainGroup").select(".axis.y-axis").call(gMain.yAxis);
}

function update(){
    var bar = d3.select(".mainGroup").selectAll(".bar").data(data,d => key(d));
    //UPDATE
    bar.attr("width", d => gMain.xScale(x(d)))
        .attr("y", d => gMain.yScale(y(d) ))
        .attr("height", gMain.yScale.bandwidth() )
        .attr("fill","#0080ff");
    //ENTER
    bar.enter().append("rect")
        .attr("class", "bar")
        .attr("x",0)
        .attr("y", d => gMain.yScale(y(d) ))
        .attr("width", d => gMain.xScale(x(d)))
        .attr("height", gMain.yScale.bandwidth() )
        .attr("fill","#0080ff");
    //EXIT
    bar.exit().remove();

}

function brushmove(){
    if(!d3.event.selection){
        console.log('empty');
        return;
    }
    const selection = d3.event.selection;
    const originalRange = gMain.yZoom.range();
    gMain.yZoom.domain(selection);
    let newRange = [gMain.yZoom(originalRange[0]), gMain.yZoom(originalRange[1])];
    gMain.yScale.range(newRange).padding(0.4).paddingOuter(0);
    update();
}

function callback(err, response) {
    if(!response.data){
        return null;
    }
    var data = response.data;
    init();
    draw(response.data);

}

d3.json("/fornecedores/412410/2015",callback)

