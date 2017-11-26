import ScatterPlot from "./chart/scatterplot.js"
import BubblePack from "./chart/bubblepack.js"
import Treemap from "./chart/treemap.js"
import Bubbleforce from "./chart/bubbleforce.js"
import ClusterForce from "./chart/clusterforce.js"
import Barchart from './chart/barchartmultiple.js'


var drawChart = function start(){
    const grafico = new Treemap();
    d3.json("http://localhost:8080/licitacoes/412850/2016", function (err, received) {
        // grafico.setData(received.data).draw();
        grafico.data(received.data)
        grafico.init();
        grafico.draw();
        $.fn.fullpage.moveSectionDown();
    } );
    console.log("chart is done...");
    
}

window.onload = function inicialization(){
    $('#fullpage').fullpage({
        scrollBar: true
    });
    
    $("#btnSearch").click( function() {
        $("#visualizacao").fadeIn(300,drawChart)
    })
}