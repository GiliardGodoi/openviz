
export default class Chart  {
    constructor(){
        this._data;
        this.root;

        this.packLayout;
    }

    init(){

    }

    _key(d){
        return d["dsModalidadeLicitacao"];
    }

    data(data){
        this._data = {}
        this._data.key = "total"
        this._data.value = d3.nest()
                        .key( d => this._key(d) )
                        .rollup( leaves => {
                            return {
                                    "total" : d3.sum(leaves, d => d["vlLicitacao"]),
                                    "count" : leaves.length,
                                    "key" : "pss",
                                    "value" : leaves
                            }
                        })
                        .entries(data);

        this.root = d3.hierarchy(this._data, d => {
            return d.value;
        } ).sum(d => {
            console.log(d);
            return d["value"]["count"];
        }).sort( (a,b) => (b["value"]["count"] - a["value"]["count"]) );

        this.root = d3.pack().size([500, 500]).padding(1)(this.root);
        
        console.log("data ::>> ", this._data);
        console.log("root ::>> ", this.root);
    }

    draw(){
        console.log("drawing something...")
    }
}