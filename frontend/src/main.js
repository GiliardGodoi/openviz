import ScatterPlot from "./chart/scatterplot.js"
import BubblePack from "./chart/bubblepack.js"
import Treemap from "./chart/treemap.js"
import Bubbleforce from "./chart/bubbleforce.js"
import ClusterForce from "./chart/clusterforce.js"
import Barchart from './chart/barchartmultiple.js'

window.onload = function(){
    function start(){
        const grafico = new Barchart();
        d3.json("http://localhost:8080/licitacoes/410640/2016", function (err, received) {
            
            grafico.setData(received.data).draw(); 
        } );
    }
    start();
}