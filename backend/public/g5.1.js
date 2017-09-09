// const colors = ["#f39c12", "#d35400", "#c0392b", "#2980b9", "#9b59b6"]
// const colors = d3.scaleOrdinal().range(d3.schemeCategory20c)
const colors = ["#2ecc71", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c"]

var margin,
    xScale,
    yScale,
    colorScale,
    rScale,
    xAxis,
    yAxis,
    xDomain,
    yDomain,
    zDomain,
    svg,
    chartGroup,
    circleGroup,
    width,
    height,
    DATA,
    brush,
    idleDelay = 350,
    idleTimeout = null,
    idle = function(){ idleTimeout = null;},
    myFormat,
    radioDistanceFromPoint = 20,
    defaultOpacityCircle = 0.5,
    isLogScale = false;

// ACESSORS FUNCTIONS
function x(d){
    return d['dtEdital'];
}

function y(d){
    return d["vlLicitacao"] ;
}

function z(d){
    return d['dsModalidadeLicitacao'];
}

function key(d){
    return d["idLicitacao"];
}
// INIT FUNCTIONS
function init(){
    initFormatLocale();
    initMargin();
    initSVGGroupsElements();
    initScales();
    initAxis();
    initBrushArea();
}

function initFormatLocale(){
    myFormat = d3.formatLocale({
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
    margin = {top: 20, right: 20, bottom: 60, left: 60};
    width = 960 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;
}

function initSVGGroupsElements(){
    svg = d3.select("#container-chart").append("svg").attr("width", (width + margin.left + margin.right)).attr("height",(height + margin.top + margin.bottom));
    chartGroup = svg.append("g").attr("class", "group-chart").attr("transform", "translate("+[margin.left,margin.top]+")");

    clip = svg.append("defs").append("svg:clipPath")
                            .attr("id","clip")
                            .append("svg:rect")
                            .attr("width", width)
                            .attr("height", height+5)
                            .attr("x",0)
                            .attr("y",0);
    
    circleGroup = chartGroup.append("g")
                            .attr("clip-path", "url(#clip)")
                            .style("clip-path", "url(#clip)")
                            .attr("class","circleGroup");

    //inicializa diagrama de voroni para interaçao do tooltip com os gráficos
    svg._tooltipped = svg._diagram = null;
}

function initScales(){
    colorScale = d3.scaleOrdinal().range(colors);
    xScale = d3.scaleTime().range([0, width]);
    defineYScale();
    rScale = function(d){ return 4; };
}

function initAxis(){
    xAxis = d3.axisBottom().scale(xScale);
    yAxis = d3.axisLeft().scale(yScale);//.tickFormat( myFormat.format("$.2f"));
}

function initBrushArea(){
    brush = d3.brush().extent([[0, 0], [width, height]]).on("end", brushEnded);
    circleGroup.append("g").attr("class","brush").call(brush);
}

function update(){
    defineYScale();
    // devemos primeiramente alternar entre as escalas pois defineYScale cria uma nova escala para o gráfico
    // e devemos atribuir o dominio posteriormente, para não correr o risco de perdermos essa informação
    defineYDomain();
    updateAxis();
    drawBubbles();
    svg._diagram = null;
    circleGroup.select(".brush").call(brush.move,null);
}

function updateAxis(){
    let t = circleGroup.transition().duration(750);
    // chartGroup.select(".axis-x").transition(t).call(xAxis);
    chartGroup.select(".axis.axis-y").transition(t).call(yAxis);
}

function defineYScale(){
    if(isLogScale){
        yScale = d3.scaleLog().range([height,0]);
    }else{
        yScale = d3.scaleLinear().range([height,0]);
    }
    
}

function defineYDomain(){
    if(isLogScale){
        yDomain = [1,d3.max(DATA, d => y(d) )];
    }else{
        yDomain = [0,d3.max(DATA, d => y(d) )];
    }
    yScale.domain(yDomain);
}

// DRAW FUNCTIONS
function draw(d){
    if(!d){
        return null;
    }
    DATA = d.map(convertDate);

    //calcular os dominios para as dimensões x, y, z
    calculateDomains();
    drawAxis();
    drawBubbles();

    svg.on("mousemove",mousemoveOnSVG);
}

function drawAxis(){
    chartGroup.append("g")
            .attr("class","axis axis-x")
            .attr("transform", "translate("+[0, (height + 4)]+")")
            .call(xAxis);

    chartGroup.append("g")
            .attr("class", "axis axis-y")
            .attr("transform","translate("+[0,0]+")")
            .call(yAxis);
}

function drawBubbles(){
    let bubbles = circleGroup.selectAll(".bubbles").data(DATA, d => key(d) );
    
    // UPDATE
    bubbles.transition()
            .ease(d3.easeSinInOut)
            .duration(750)
            .attr("cx", d => xScale(x(d)) )
            .attr("cy", d => yScale(y(d)) );
    
    //ENTER
    bubbles.enter()
            .append("circle")
            .attr("class", d => ("bubbles "+mapCodeToLetter(key(d)) ))
            .attr("cx", d => xScale(x(d)) )
            .attr("cy", height )
            .attr("r", 0 )
            .style("fill", d => colorScale(z(d)))
            .transition()
            .duration(750)
            .attr("cx", d => xScale(x(d)) )
            .attr("cy", d => yScale(y(d)) )
            .attr("r", d => rScale(d) )
            .style("fill", d => colorScale(z(d)))
            .style("opacity", defaultOpacityCircle );
    
    // EXIT
    bubbles.exit().remove();
}

function calculateDomains(){
    zDomain = DATA.map( d => z(d) )
                .filter( (item, pos, array) => {
                    return array.indexOf(item) == pos;
                });
    
    xDomain = d3.extent(DATA, d => x(d) );
    defineYDomain();
    xScale.domain(xDomain);
    colorScale.domain(zDomain);
}

function calculateVoronoiDiagram(){
    console.log("calculando diagrama de voroni");
    svg._diagram = d3.voronoi().x(d => xScale(x(d)) ).y(d => yScale(y(d)) ).extent([[0,0],[width,height]])(DATA);
    
    // svg.selectAll("g.polygons").remove()

    // svg.append("g").attr("class","polygons").attr("transform", "translate("+[margin.left,margin.top]+")")
    //     .selectAll("path")
    //         .data(svg._diagram.polygons())
    //         .enter()
    //         .append("path")
    //         .call(redrawPolygon); 
}

function brushEnded(){
    let s = d3.event.selection;
    
    if(!s){
        if(!idleTimeout) return idleTimeout = setTimeout(idle,idleDelay);
        xScale.domain(xDomain);
        yScale.domain(yDomain);
        console.log('not s')
    }else{
        console.log('with s')
        xScale.domain([s[0][0],s[1][0]].map(xScale.invert,xScale));
        yScale.domain([s[1][1],s[0][1]].map(yScale.invert,yScale));
        circleGroup.select(".brush").call(brush.move,null);
    }
    zoom();
}

function zoom(){
    let t = circleGroup.transition().duration(750);
    chartGroup.select(".axis-x").transition(t).call(xAxis);
    chartGroup.select(".axis-y").transition(t).call(yAxis);
    circleGroup.selectAll(".bubbles").transition(t)
                .attr("cx", d => xScale(x(d)) )
                .attr("cy", d => yScale(y(d)) );
    svg._diagram = null
}

function mousemoveOnSVG(){
    if(!svg._diagram){
        calculateVoronoiDiagram();
    }
    let site = null;
    let position = d3.mouse(this);
    position[0] -= margin.left;
    position[1] -= margin.top;
    
    if(position[0] > 9000 || position[1] > 9000 ){
        site = null;
    }else{
        site = svg._diagram.find(position[0],position[1],radioDistanceFromPoint)
    }
    if(site !== svg._tooltipped ){
        if(svg._tooltipped){
            removeTooltip(svg._tooltipped.data)
        }
        if(site){
            showTooltip(site.data);
        }
        svg._tooltipped = site;
    }
}

function showTooltip(d,i){
    const element = d3.select(".bubbles."+mapCodeToLetter(key(d)));
    element.style("opacity", 1);
    var el = element._groups[0];

    $(el).popover({
        placement: 'auto top',
        container: '#container-chart',
        trigger: 'manual',
        html : true,
        content: function() { 
            return "<span style='font-size: 11px; text-align: center;'>" +
                        "<span> Modalidade: "+d["dsModalidadeLicitacao"]+"</span> </br>" +
                        "<span>Valor da Licitação R$" + d["vlLicitacao"]+ "</span> </br>" +
                        "<span></span>"+
                    "</span>"; 
        }
    });
    $(el).popover('show');
}

function removeTooltip(d, i){
    const element = d3.select(".bubbles."+mapCodeToLetter(key(d)))
    element.style("opacity", defaultOpacityCircle)
    $('.popover').each(function() {
        $(this).remove();
    }); 
}

function changeYScale(){
    isLogScale = !isLogScale;
    console.log("isLogScale: ", isLogScale);
    update();
}

function redrawPolygon(polygon) {
    polygon.attr("d", function(d) { 
            if(d){
                d = d.filter(d => d);
                return "M" + d.join("L") + "Z"
            }else{
                return null;
            }
            // return d ? "M" + d.join("L") + "Z" : null
        });
}

// HELPED FUNCTIONS
function convertDate(d){
    d["dtEdital"] = new Date(d["dtEdital"])
    d["dtAbertura"] = new Date(d["dtAbertura"])

    return d;
}

function mapCodeToLetter(codigo){
    const letter = ['A','B','C','D','E','F','G','H','I','J'];
    let number
    let word = '';
    for(let i = 0; i < codigo.length; i++) word += letter[+codigo[i]]
    return word;
}

// start function
function start(err, received) {
    if(!received.data){
        return null;
    }
    init();
    draw(received.data);
}

d3.json("/licitacoes/412410/2016", start);