var MongoClient = require('mongodb').MongoClient;
var errorMsg = require('../utils/errorsMessagens')

function DB(uri = null){
    if (!uri) {
        throw TypeError('Parâmetro URI deve ser informado')
    }
    this.db = null;
    this.URI = uri

    this.query = function(collname, pipeline = [{}]){
        let _this = this;
        return new Promise( (resolve, reject) => {
            _this.db.collection(collname,  {strict:true}, (err, collection) => {
                if(err){
                    reject(err);
                }
                if (!collection) {
                    reject({error: "Objeto collection is null"})
                } else {
                    const cursor = collection.aggregate(pipeline);
                    cursor.toArray( (err, docs) =>{
                        if(err){
                            reject(err);
                        }else{
                            resolve(docs);
                        }
                    })
                }
            });
        });
    }
}

DB.prototype.connect = function(){
    let _this = this;
    const uri = this.URI
    return new Promise( (resolve, reject) => {
        if(_this.db){
            resolve();
        }else{
            let __this = _this;

            MongoClient.connect(uri).then( (database)=>{
                __this.db = database;
                resolve();
            },
            error => {
                log(`nao foi possivel se conectar a\n${uri}`);
                reject(error);
            })
        }
    });
}

DB.prototype.close = function(){
    if(this.db){
        this.db.close().then(
            function(){},
            function(error){
                log(`erro ao fechar conexão com banco \n${error.message}`);
            } )
    }
}

DB.prototype.queryMunicipio = function({cdIBGE, nmMunicipio}){
    let coll_name = 'municipio'
    let pipeline = []

    if(cdIBGE){
        pipeline[pipeline.length] = { '$match' : {'cdIBGE' : cdIBGE}}
    }else if(nmMunicipio){
        pipeline[pipeline.length] = { '$match' : {'municipio' : nmMunicipio}}
    }
    return this.query(coll_name,pipeline)
}

DB.prototype.queryGeojson = function({cdEstado, nmEstado}){
    let coll_name = 'geojson'
    let pipeline = []

    if(cdEstado){
        pipeline[pipeline.length] = { '$match' : {'properties.id' : cdEstado}}
    }else if(nmEstado){
        pipeline[pipeline.length] = { '$match' : {'properties.name' : nmEstado}}
    }
    
    return this.query(coll_name,pipeline)
}

DB.prototype.querySinopseLicitacao = function({cdIBGE,nrAno,skip, limit, sort}){
    let coll_name = 'sinopseLicitacao';
    let pipeline = []

    let match = { '$match' : {"cdIBGE" : cdIBGE, "nrAnoLicitacao" : nrAno}};
    let sort_stage = { '$sort' : {'dsModalidadeLicitacao' : 1 }}

    return this.query(coll_name,[match]);
    
}

DB.prototype.querySinopseCriterioAvaliacaoPorModalidade = function({cdIBGE, nrAno}){
    if(!cdIBGE & !nrAno){
        throw TypeError(errorMsg.PARAMETROS_DEVEM_SER_DEFINIDOS('cdIBGE','nrAno'));
    }
    let _this = this;
    let match = {"cdIBGE" : cdIBGE, "nrAno" : nrAno};
    let coll_name = "sinopseCriterioAvaliacaoPorModalidade";
  		  
     return this.query(coll_name,[match])
}

DB.prototype.queryRankingFornecedor = function({cdIBGE,nrAno,skip, limit, sort}){
    let coll_name = "listaFornecedores";
    let pipeline = [];
    if(cdIBGE & nrAno){
        pipeline[pipeline.length] = { "$match" : {"cdIBGE" : cdIBGE, "nrAno" : nrAno}}; // match stage
    }else{
        throw TypeError(errorMsg.PARAMETROS_DEVEM_SER_DEFINIDOS('cdIBGE','nrAno'));
    }

    if(limit) pipeline[pipeline.length] = { "$limit" : +limit};
    if(skip) pipeline[pipeline.length] = {"$skip" : +skip};
    //asc = 1 desc = -1
    let sort_stage = {"$sort" : {"vlContratado" : 0 } };
    if(sort){
        if(sort == "asc"){
            sort_stage.$sort.vlContratado = 1;
        }else if(sort == "desc"){
            sort_stage.$sort.vlContratado = -1;
        }
        pipeline[pipeline.length] = sort_stage;
    }
    
    return this.query(coll_name,pipeline);
}

DB.prototype.queryMunicipioFromLicitacao = function(params){
    const coll_name = "rawLicitacao";
    const nrAno = params.nrAno || '0'
    const query = { '$match': {
        'nrAnoLicitacao': nrAno
    }}
    const project = { "$project" : {
        "_id" : false,
        "cdIBGE" : true,
        "nmMunicipio" : true,
        "nrAnoLicitacao" : true
    }}
    const group = { "$group" : {
        "_id" : "$nrAnoLicitacao",
        "municipios" : { "$addToSet": {
            "nmMunicipio" : "$nmMunicipio",
            "cdIBGE" : "$cdIBGE"
        } } } };
    const pipe = [];
    pipe[0] = query;
    pipe[1] = project;
    pipe[2] = group;
    return this.query(coll_name,pipe);
}

DB.prototype.queryItensLicitacao = function({cdIBGE, nrAno,skip, limit, sort}){
    let coll_name = "rawLicitacaoVencedor"
    let pipeline = []
    let project = {
        $project : {
            idlicitacao : 1,
            dsItem : 1,
            nrQuantidade : 1,
            vlMinimoUnitarioItem :  1,
            vlMinimoTotal : 1,
            vlMaximoUnitarioItem : 1,
            vlMaximoTotal : 1,
            nrQuantidadeVencedor : "$nrQuantidadeVencedorLicitacao",
            vlUnitarioVencedor : "$vlLicitacaoVencedorLicitacao",
            vlTotalVencedor : "$vlTotalVencedorLicitacao"
        }
    }

    if(cdIBGE & nrAno){
        pipeline[pipeline.length] = { "$match" : {"cdIBGE" : cdIBGE, "nrAnoLicitacao" : nrAno}};
        pipeline[pipeline.length] = project;
    }else{
        throw TypeError(errorMsg.PARAMETROS_DEVEM_SER_DEFINIDOS('cdIBGE','nrAno'));
    }

    if(limit) pipeline[pipeline.length] = { "$limit" : +limit};
    if(skip) pipeline[pipeline.length] = {"$skip" : +skip};
    
    let sort_stage = {"$sort" : {vlTotalVencedor : 0 } };
    if(sort){
        if(sort == "asc"){
            sort_stage.$sort.vlTotalVencedor = 1;
        }else if(sort == "desc"){
            sort_stage.$sort.vlTotalVencedor = -1;
        }
        pipeline[pipeline.length] = sort_stage;
    }

    return this.query(coll_name,pipeline);
}

DB.prototype.queryLicitacao = function({idLicitacao}){
    let pipeline = [{ "$match" : {"idLicitacao" : idLicitacao}}];
    let coll_name = "rawLicitacao";

    return this.query(coll_name,pipeline);
}

DB.prototype.queryLicitacoesMunicipio = function({cdIBGE, nrAno,skip, limit, sort}){
    let coll_name = coll_name = "rawLicitacao";
    let pipeline = [];
    console.log(typeof cdIBGE);
    console.log(typeof nrAno );
    console.log(typeof skip );
    console.log(typeof limit );

    let project = { $project : { cdIBGE : 1,
                     nmMunicipio: 1,
                     nmEntidade : 1,
                     idLicitacao : 1,
                     nrLicitacao : 1,
                     dsModalidadeLicitacao : 1,
                     nrAnoLicitacao : 1,
                     vlLicitacao : 1,
                     vlTotalAdquiridoLicitacao : 1,
                     dsObjeto : 1,
                     dtEdital : 1,
                     dtAbertura : 1
                    }};
    

    if(cdIBGE & nrAno){
        pipeline[pipeline.length] = { $match : {"cdIBGE" : cdIBGE, "nrAnoLicitacao" : nrAno}}
        pipeline[pipeline.length] = project
    }else{
        throw TypeError(errorMsg.PARAMETROS_DEVEM_SER_DEFINIDOS('cdIBGE','nrAno'));
    }

    if(skip) pipeline[pipeline.length] = {$skip : +skip};
    if(limit) pipeline[pipeline.length] = { $limit : +limit};

    let sort_stage = {"$sort" : {"vlContratado" : 0 } };
    if(sort){
        if(sort == "asc"){
            sort_stage.$sort.vlContratado = 1;
        }else if(sort == "desc"){
            sort_stage.$sort.vlContratado = -1;
        }
        pipeline[pipeline.length] = sort_stage;
    }
    
    return this.query(coll_name,pipeline);
}

function log(mensagem, tipo = 0){
    switch(tipo){
        case 0:
            console.error(mensagem);
            break;
        case 1:
            console.log(mensagem);
            break;
    }
}

module.exports = DB;