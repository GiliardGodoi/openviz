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
    colorDomain,
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
    myFormat, localeTimeFormat,
    radioDistanceFromPoint = 20,
    defaultOpacityCircle = 0.5,
    isLogScale = true;

var formatMillisecond,
    formatSecond,
    formatMinute,
    formatHour,
    formatDay,
    formatWeek,
    formatMonth,
    formatYear;

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
    localeTimeFormat = d3.timeFormatLocale({
        "dateTime" : "%a %b %e %X %Y",
        "date" : "%d/%m/%Y",
        "time" : "%H : %M : %S",
        "periods" : ["AM", "PM"],
        "days" : ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
        "shortDays" : ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
        "months" : ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
        "shortMonths": ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    });
    formatMillisecond = localeTimeFormat.format(".%L"),
    formatSecond = localeTimeFormat.format(":%S"),
    formatMinute = localeTimeFormat.format("%I:%M"),
    formatHour = localeTimeFormat.format("%I %p"),
    formatDay = localeTimeFormat.format("%a %d"),
    formatWeek = localeTimeFormat.format("%b %d"),
    formatMonth = localeTimeFormat.format("%B"),
    formatYear = localeTimeFormat.format("%Y");
}

function initMargin(){
    margin = {top: 20, right: 20, bottom: 60, left: 60};
    width = 850 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;
}

function initSVGGroupsElements(){
    svg = d3.select("#chart").append("svg").attr("width", (width + margin.left + margin.right)).attr("height",(height + margin.top + margin.bottom));
    chartGroup = svg.append("g").attr("class", "group-chart").attr("transform", "translate("+[margin.left,margin.top]+")");

    clip = svg.append("defs").append("svg:clipPath")
                            .attr("id","clip")
                            .append("svg:rect")
                            .attr("width", width+10)
                            .attr("height", height+10)
                            .attr("x",-5)
                            .attr("y",-5);
    
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
    xAxis = d3.axisBottom().scale(xScale).tickFormat( multiFormat );
    // yAxis = d3.axisLeft().scale(yScale).tickFormat( myFormat.format("$.2f"));
    defineYAxis();
}
// localized times axis pattener by Mike Bostock at < https://bl.ocks.org/mbostock/805115ebaa574e771db1875a6d828949 > special thanks.
function multiFormat(date){
    return (d3.timeSecond(date) < date ? formatMillisecond
    : d3.timeMinute(date) < date ? formatSecond
    : d3.timeHour(date) < date ? formatMinute
    : d3.timeDay(date) < date ? formatHour
    : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
    : d3.timeYear(date) < date ? formatMonth
    : formatYear)(date);
}

function initBrushArea(){
    brush = d3.brush().extent([[0, 0], [width, height]]).on("end", brushEnded);
    circleGroup.append("g").attr("class","brush").call(brush);
}

function update(){
    defineYScale();   // devemos primeiramente alternar entre as escalas. Quando defineYScale cria uma nova escala para o gráfico
    defineYDomain(); // e devemos atribuir o dominio posteriormente, para não correr o risco de perdermos essa informação
    defineYAxis();
    updateAxis();
    drawBubbles(DATA);
    svg._diagram = null;
    circleGroup.select(".brush").call(brush.move,null);
}

function updateAxis(){
    let t = circleGroup.transition().duration(750);
    chartGroup.select(".axis.axis-y").transition(t).call(yAxis);
}

function defineYAxis(){
    if(isLogScale){
        yAxis = d3.axisLeft().scale(yScale).ticks(5).tickFormat(myFormat.format("$.2f"));
    }else{
        yAxis = d3.axisLeft().scale(yScale).tickFormat( myFormat.format("$.2f"));
    }
}

function defineYScale(){
    if(isLogScale){
        yScale = d3.scaleLog().range([height,0]);
    }else{
        yScale = d3.scaleLinear().range([height,0]);
    }
    yScale.clamp(true);    
}

function defineYDomain(){
    if(isLogScale){
        yDomain = [0.1,d3.max(DATA, d => y(d) )];
    }else{
        yDomain = [0,d3.max(DATA, d => y(d) )];
    }
    yScale.domain(yDomain);
}

function defineXDomain(){
    let extent = d3.extent(DATA, d => x(d) );
    let newYear =  d3.timeYear(extent[0]); 
    xDomain = [];
    xDomain[0] = newYear;
    xDomain[1] = d3.timeYear.offset(newYear);
    
    xScale.domain(xDomain);
}

function defineColorDomain(){
    colorDomain = DATA.map( d => z(d) )
    .filter( (item, pos, array) => {
        return array.indexOf(item) == pos;
    });
    colorScale.domain(colorDomain);
}

// DRAW FUNCTIONS
function draw(d){
    if(!d){
        return null;
    }
    DATA = d.map(convertDate);

    //calcular os dominios para as dimensões x, y, z
    defineYDomain();
    defineXDomain();
    defineColorDomain();
    
    drawAxis();
    drawBubbles(DATA);

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

function drawBubbles(dataToDraw = []){
    let bubbles = circleGroup.selectAll(".bubbles").data(dataToDraw, d => key(d) );
    
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
        yScale.clamp(true);
        console.log('not s')
    }else{
        console.log('with s')
        xScale.domain([s[0][0],s[1][0]].map(xScale.invert,xScale));
        yScale.domain([s[1][1],s[0][1]].map(yScale.invert,yScale));
        yScale.clamp(false);
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

    // console.log(d);

    // $(el).popover({
    //     placement: 'auto top',
    //     container: '#container-chart',
    //     trigger: 'manual',
    //     html : true,
    //     content: function() { 
    //         return "<span style='font-size: 11px; text-align: center;'>" +
    //                     "<span> "+d["dsModalidadeLicitacao"]+" n. "+d["nrLicitacao"]+"/"+d["nrAnoLicitacao"]+"</span> </br>" +
    //                     "<span>"+d["dsObjeto"]+"</span> </br>"+
    //                     "<span>Valor Edital R$" + d["vlLicitacao"]+ "</span> </br>" +
    //                     "<span>Valor Adquirido R$" + d["vlTotalAdquiridoLicitacao"]+ "</span> </br>" +
    //                     "<span></span>"+
    //                 "</span>"; 
    //     }
    // });
    // $(el).popover('show');
}

function removeTooltip(d, i){
    const element = d3.select(".bubbles."+mapCodeToLetter(key(d)))
    element.style("opacity", defaultOpacityCircle);
    // $('.popover').each(function() {
    //     $(this).remove();
    // }); 
}

function changeYScale(){
    isLogScale = !isLogScale;
    console.log("isLogScale: ", isLogScale);
    update();
}

function changeToLogScale(){
    if(isLogScale){
        return;
    }
    isLogScale = true;
    update();
}

function changeToLinearScale(){
    if(!isLogScale) return;
    isLogScale = false;
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

function buscaDescricaoObjeto(palavra, dados){
    let pattern = new RegExp(palavra,"im");
    return dados.filter( d => pattern.test(d["dsObjeto"]) )
}

// start function
function start(err, received) {
    if(!received.data){
        return null;
    }
    init();
    draw(received.data);
}

// d3.json("/licitacoes/412410/2016", start);

function lookingForData(){
    
}

// funções para o formulario

function addEventsListners(){
    addChooseScaleEventListeners();
}

function addChooseScaleEventListeners(){
    selectInput = $("#chooseScale")[0];
    // debugger;
    selectInput.onchange = function(event){
        console.log(this.value);
        if(this.value === "log-scale"){
            isLogScale = true;
            update();
        }else if( this.value === "linear-scale"){
            isLogScale = false;
            update();
        }
    }
}

function initFormInputs(){
    initAnosInputSelect();
    enableAutoCompleteInputForMunicipio();

    addEventsListners();
}


function initAnosInputSelect(){
    d3.json("/licitacoes/anos", (data) => {
        let selection = d3.select("#nrAnoLicitacao")
                        .selectAll("option")
                        .data(data, d => d)
                        .enter()
                        .append("option")
                        .attr("value", d => d)
                        .text(d => d);
    });
}

function enableAutoCompleteInputForMunicipio(){

}

initFormInputs();