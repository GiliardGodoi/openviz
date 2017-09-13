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
    initFormatLocale()
    initMargin()
    initGroupsSVGElements();
    initScales();
    initAxis();
    initBrushArea();
    console.log('initialize elements');
}

function initFormatLocale(){
    chart.brFormat = d3.formatLocale({
        "decimal": ",",
        "thousands": ".",
        "grouping": [3],
        "currency": ["R$", ""],
        "dateTime": "%a %b %e %X %Y",
        "date": "%m/%d/%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
        "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      });
}

function initMargin(){
    gMain.margin = {top: 10, right: 10, bottom: 30, left: 300};
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

    chart.MainGroup = chart.svg.append("g")
                            .attr("class","mainGroupWrapper")
                            .attr("transform","translate("+[gMain.margin.left,gMain.margin.top]+")")
                            .append("g")
                            .attr("clip-path","url(#clip)")
                            .style("clip-path","url(#clip)")
                            .attr("class","mainGroup");

    let translateXMini = gMain.margin.left+gMain.margin.right+gMain.width+gMini.margin.left;
    let translateYMini = gMini.margin.top;
    chart.MiniGroup = chart.svg.append("g")
                            .attr("class","miniGroup")
                            .attr("transform","translate("+[translateXMini,translateYMini]+")");
    chart.brushGroup = chart.svg.append("g")
                            .attr("class","brushGroup")
                            .attr("transform","translate("+[translateXMini,translateYMini]+")");
    
    chart.defs = chart.svg.append("defs")
                            .append("clipPath")
                            .attr("id","clip")
                            .append("rect")
                            .attr("x", -gMain.margin.left)
                            .attr("width",gMain.margin.left + gMain.width)
                            .attr("height",gMain.height);
}

function initScales(){
    gMain.xScale = d3.scaleLinear().range([0,gMain.width]);
    gMini.xScale = d3.scaleLinear().range([0,gMini.width]);

    gMain.yScale = d3.scaleBand().range([0, gMain.height]).padding(0.4).paddingOuter(0);
    gMini.yScale = d3.scaleBand().range([0, gMini.height]).padding(0.4).paddingOuter(0);

    gMain.yZoom = d3.scaleLinear().range([0, gMain.height]).domain([0, gMain.height]);
}

function initAxis(){
    gMain.xAxis = d3.axisBottom().scale(gMain.xScale).ticks(10).tickFormat(chart.brFormat.format("$.0s"));
    //add group for the x axis
    d3.select(".mainGroupWrapper").append("g").attr("class","axis x-axis").attr("transform", "translate("+[0,gMain.height]+")");
    
    gMain.yAxis = d3.axisLeft().scale(gMain.yScale).tickSize(0).tickSizeOuter(0);
    chart.MainGroup.append("g").attr("class","axis y-axis").attr("transform","translate(-5,0)");
}

function initBrushArea(){
    chart.brush = d3.brushY().extent([[0,0],[gMini.width,gMini.height]]).on("brush",brushmove);
    chart.gBrush = d3.select(".brushGroup").append("g").attr("class","brush").call(chart.brush).call(chart.brush.move,null);
    chart.gBrush.selectAll("rect").attr("width",gMini.width);
}

function draw(_){
    if(!_){
        return
    }
    DATA = _;
    xDomain = [0, d3.max(DATA, d => x(d) )];
    yDomain = DATA.map( d => y(d) );
    gMain.xScale.domain(xDomain);
    gMini.xScale.domain(xDomain);
    gMain.yScale.domain(yDomain);
    gMini.yScale.domain(yDomain);

    drawAxis();

    //mini bar chart
    //DATA JOIN
    var mini_bar = d3.select(".miniGroup").selectAll(".bar").data(DATA, d => key(d) );
    //UPDATE
    mini_bar.attr("width", d => gMini.xScale(x(d)))
            .attr("y", d => gMini.yScale(y(d)))
            .attr("height", gMini.yScale.bandwidth() );
    //ENTER
    mini_bar.enter().append("rect").attr("class","bar")
            .attr("x", 0)
            .attr("width", d => gMini.xScale(x(d)))
            .attr("y", d => gMini.yScale(y(d)))
            .attr("height", gMini.yScale.bandwidth())
            .attr("fill","#0080ff");
    //EXIT
    mini_bar.exit().remove();

    chart.gBrush.call(chart.brush.move,[0,20]);

    update();
}

function drawAxis(){
    d3.select(".mainGroupWrapper").select(".axis.x-axis").call(gMain.xAxis);
    d3.select(".mainGroup").select(".axis.y-axis").call(gMain.yAxis);
}

function update(){
    var bar = d3.select(".mainGroup").selectAll(".bar").data(DATA,d => key(d));
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
    // update y axis at Main Group
    d3.select(".mainGroup").select(".axis.y-axis").call(gMain.yAxis);
    update();
}

function start(err, response) {
    if(!response.data){
        return null;
    }
    var data = response.data;
    init();
    draw(response.data);
}

d3.json("/fornecedores/412410/2015?limit=100",start)
