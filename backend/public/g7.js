window.onload = function(){
    function initFormData(err, res){
        if(err){
            return;
        }
    
        let anos = res.data.map( d => d["_id"]).sort();
        console.log(anos);
        $('#nrAnoLicitacaoInput').autocomplete({
            source : anos,
            select : changeEventHandler
        });
    }
    
    function changeEventHandler(event, ui){
        console.log(event.target.value);
    }
    
    d3.json('/licitacoes/municipios', initFormData);
};

 


