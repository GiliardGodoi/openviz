export default class ClusterForce {
    constructor(){
        this._data_;

        this.width = 850;
        this.height = 500;
        this.margin = {top: 10, right: 10, bottom: 10, left: 10};
        this.clusterPadding = 5;
        this.circlesPadding = 1;
        this.maxRadius = 50;

        this.colorSchema = ["#2ecc71", "#2980b9", "#8e44ad", "#f1c40f", "#e67e22", "#e74c3c"];
        this.svg;
    }

    data(data){
        this._data_ = data;
    }

    init(){
        this.svg = d3.select("#chart")
                    .append("svg")
                    .attr("width",this.width)
                    .attr("height", this.height)
                    .append("g")
                    .attr("class", "group-chart")
    }

    draw(){

    }
    // https://bl.ocks.org/shancarter/f621ac5d93498aa1223d8d20e5d3a0f4
}