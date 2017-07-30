var MongoClient = require('mongodb').MongoClient;
var errorMsg = require('./utils/errorsMessagens')

function DB(){
    this.db = null;

    this.query = function(collname, pipeline = [{}]){
        let _this = this;
        return new Promise( (resolve, reject) => {
            _this.db.collection(collname,  {strict:true}, (err, collection) => {
                if(err){
                    reject(err);
                }

                let cursor = collection.aggregate(pipeline);

                cursor.toArray( (err, docs) =>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(docs);
                    }
                })
            });
        });
    }
}

DB.prototype.connect = function(uri){
    let _this = this;

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

DB.prototype.querySinopseLicitacao = function({cdIBGE,nrAno,skip, limit, sort}){
    let _this = this;
    let coll_name = 'sinopseLicitacao';
    let query = {"cdIBGE" : cdIBGE, "nrAnoLicitacao" : nrAno};

    return new Promise( (resolve, reject) => {
        _this.db.collection(coll_name, {strict : true}, (err, collection) => {
            if(err){
                log('erro ao definir collection em querySinopseLicitacao');
                reject(err);
            }
            let cursor = collection.find(query);
            cursor.toArray((err, docs) => {
                if(err){
                    log('erro em cursor.toArray em querySinopseLicitacao');
                    reject(err);
                }
                resolve(docs);
            });
        });
    });
}

DB.prototype.querySinopseCriterioAvaliacaoPorModalidade = function({cdIBGE, nrAno}){
    if(!cdIBGE & !nrAno){
        throw TypeError(errorMsg.PARAMETROS_DEVEM_SER_DEFINIDOS('cdIBGE','nrAno'));
    }
    let pipeline = [{ "$match" : {"cdIBGE" : cdIBGE, "nrAno" : nrAno}}];
    let coll_name = "sinopseCriterioAvaliacaoPorModalidade";

    return this.query(coll_name,pipeline);
}

DB.prototype.queryRankingFornecedor = function({cdIBGE,nrAno,skip, limit, sort}){
    let coll_name = "rankingFornecedor";
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

DB.prototype.queryItensLicitacao = function({cdIBGE, nrAno,skip, limit, sort}){
    let coll_name = "rawLicitacaoVencedor"
    let pipeline = []

    if(cdIBGE & nrAno){
        pipeline[pipeline.length] = { "$match" : {"cdIBGE" : cdIBGE, "nrAnoLicitacao" : nrAno}};
    }else{
        throw TypeError(errorMsg.PARAMETROS_DEVEM_SER_DEFINIDOS('cdIBGE','nrAno'));
    }

    if(limit) pipeline[pipeline.length] = { "$limit" : +limit};
    if(skip) pipeline[pipeline.length] = {"$skip" : +skip};


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

module.exports = new DB;