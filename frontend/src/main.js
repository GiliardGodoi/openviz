import ScatterPlot from "./chart/scatterplot.js"
import BubblePack from "./chart/bubblepack.js"
import Treemap from "./chart/treemap.js"
import Bubbleforce from "./chart/bubbleforce.js"

window.onload = function(){
    const grafico = new Bubbleforce();

    d3.json("http://localhost:8080/licitacoes/412410/2015", start);

    function start(err, received) {
        if(!received.data){
            return null;
        }

        grafico.data(received.data);
        grafico.init();
        grafico.draw();
    }

}

