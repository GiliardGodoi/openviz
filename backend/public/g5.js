const margin = {top: 20, right: 20, bottom: 60, left: 60};
let width = 960 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

const svg = d3.select("#container-chart").append("svg").attr("width", (width + margin.left + margin.right)).attr("height",(height + margin.top + margin.bottom));
const group_chart = svg.append("g").attr("class", "group-chart").attr("transform", "translate("+[margin.left,margin.top]+")")

const colors = ["#f39c12", "#d35400", "#c0392b", "#2980b9", "#9b59b6"]
//const color = d3.scaleOrdinal().range(d3.schemeCategory20c)
// const colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]; // alternatively colorbrewer.YlGnBu[9]
// const colors = ["#EFB605", "#E58903", "#E01A25", "#C20049", "#991C71", "#66489F", "#2074A0", "#10A66E", "#7EB852"]

function type(d){
    d["dtEdital"] = new Date(d["dtEdital"])
    d["dtAbertura"] = new Date(d["dtAbertura"])

    return d;
}

function mapCodigo2Letter(codigo){
    const letter = ['A','B','C','D','E','F','G','H','I','J'];
    let number
    let word = '';
    for(let i = 0; i < codigo.length; i++) word += letter[+codigo[i]]
    return word;
}

function draw(err, received) {
    const data = received.data.map(type);
    const lstModalidades = data.map( d => d['dsModalidadeLicitacao'] )
                            .filter( (item, pos, array) => {
                                return array.indexOf(item) == pos;
                            });

    // Inicializando scalas
    let raioDistanciaCirculos = 50, opacidadeCirculos = 0.5;

    const color = d3.scaleOrdinal().range(colors).domain(lstModalidades);
    const xExtent = d3.extent(data, d => d['dtEdital']);
    const yExtent = [0,d3.max(data, d => d["vlLicitacao"] )];
    // Por que d3.extent(data, d => d["vlLicitacao"] )
    const xScale = d3.scaleTime().range([0, width]).domain(xExtent);
    const yScale = d3.scaleLinear().range([height,0]).domain(yExtent);
    const rScale = function(d){ return 4; };
    // Inicializando Eixos
    const xAxis = d3.axisBottom(xScale)

    group_chart.append("g")
                .attr("class","axis axis-x")
                .attr("transform", "translate("+[0, height + 1]+")")
                .call(xAxis);

    
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format("s"));
    group_chart.append("g")
                .attr("class", "axis axis-y")
                .attr("transform","translate("+[0,0]+")")
                .call(yAxis);

    // inicializando bubblegroups
    const circleGroup = group_chart.append("g").attr("class","circleGroup");

    circleGroup.selectAll("bubbles")
                .data(data, d => d["idLicitacao"])
                .enter()
                .append("circle")
                .attr("class", d => ("bubbles "+mapCodigo2Letter(d["idLicitacao"]) ))
                .attr("cx", d => xScale(d["dtEdital"]) )
                .attr("cy", d => yScale(d["vlLicitacao"]) )
                .attr("r", d => rScale(d) )
                .style("fill", d => color(d["dsModalidadeLicitacao"]))
                .style("opacity", opacidadeCirculos );
    
    const brush = d3.brush().extent([[0, 0], [width, height]]).on("end", brushEnded);
    const idleDelay = 350;
    let idleTimeout = null; // tempo de ociosidade;
    let idle = function(){
        idleTimeout = null;
    }

    circleGroup.append("g").attr("class","brush").call(brush);

    function brushEnded(){
        let s = d3.event.selection;
        console.log(s);
        if(!s){
            if(!idleTimeout) return idleTimeout = setTimeout(idle,idleDelay);
            xScale.domain(xExtent);
            yScale.domain(yExtent);
        }else{
            xScale.domain([s[0][0],s[1][0]].map(xScale.invert,xScale));
            yScale.domain([s[1][1],s[0][1]].map(yScale.invert,yScale));
            circleGroup.select(".brush").call(brush.move,null);
        }
        zoom();
    }

    function zoom(){
        let t = circleGroup.transition().duration(750);
        group_chart.select(".axis-x").transition(t).call(xAxis);
        group_chart.select(".axis-y").transition(t).call(yAxis);
        circleGroup.selectAll(".bubbles").transition(t)
                    .attr("cx", d => xScale(d["dtEdital"]) )
                    .attr("cy", d => yScale(d["vlLicitacao"]) );
            
    }
    
    function removeTooltip(d, i){
        const element = d3.select(".bubbles."+mapCodigo2Letter(d["idLicitacao"]))
        element.style("opacity", opacidadeCirculos)
    }

    function showTooltip(d,i){
        const element = d3.select(".bubbles."+mapCodigo2Letter(d["idLicitacao"]))
        element.style("opacity", 1)
    }

    function redrawPolygon(polygon) {
        polygon
            .attr("d", function(d) { 
                if(d){
                    d = d.filter(d => d);
                    return "M" + d.join("L") + "Z"
                }else{
                    return null;
                }
                // return d ? "M" + d.join("L") + "Z" : null
            });
    }

    //inicializa diagrama de voroni para interaçao do tooltip com os gráficos
    svg._tooltipped = svg._diagram = null;
    svg.on("mousemove",function(){
        if(!svg._diagram){
            console.log("calculando diagrama de voroni");
            svg._diagram = d3.voronoi().x(d => xScale(d["dtEdital"]) ).y(d => yScale(d["vlLicitacao"]) )(data);
            // svg.append("g").attr("class","polygons")
            //     .attr("transform", "translate("+[margin.left,margin.top]+")")
            //     .selectAll("path")
            //     .data(svg._diagram.polygons())
            //     .enter()
            //     .append("path")
            //     .call(redrawPolygon);
        }
        let site = null;
        let posicao = d3.mouse(this);
        posicao[0] -= margin.left;
        posicao[1] -= margin.top;
        // console.log(posicao);
        if(posicao[0] > 9000 || posicao[1] > 9000 ){
            site = null;
        }else{
            site = svg._diagram.find(posicao[0],posicao[1],raioDistanciaCirculos)
        }
        if(site !== svg._tooltipped ){
            if(svg._tooltipped){
                removeTooltip(svg._tooltipped.data)
            }
            if(site){
                showTooltip(site.data);
            }
            svg._tooltipped = site;
            console.log(site);
        }
    })


}

d3.json("/licitacoes/412410/2016", draw);