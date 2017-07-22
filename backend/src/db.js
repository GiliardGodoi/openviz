var MongoClient = require('mongodb').MongoClient;

function DB(){
    this.db = null;
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

DB.prototype.query = function(collname, pipeline = []){
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

DB.prototype.querySinopseLicitacao = function(cdIBGE = null, nrAno = null){
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

DB.prototype.querySinopseCriterioAvaliacaoPorModalidade = function(cdIBGE = null, nrAno = null){
    
    let query = { "$match" : {"cdIBGE" : cdIBGE, "nrAnoLicitacao" : nrAno}};
    let coll_name = "sinopseCriterioAvaliacaoPorModalidade";

    return DB.query(coll_name,[query]);
}

DB.prototype.queryRankingFornecedor = function(cdIBGE = null, nrAno = null){
    
    let query = { "$match" : {"cdIBGE" : cdIBGE, "nrAnoLicitacao" : nrAno}};
    let coll_name = "rankingFornecedor";

    return DB.query(coll_name,[query]);
}


DB.prototype.queryLicitacao = function(idLicitacao = null){
    let query = { "$match" : {"idLicitacao" : idLicitacao}};
    let coll_name = "rawLicitacao";

    return DB.query(coll_name,[query]);
}

DB.prototype.queryLicitacoesMunicipio = function(cdIBGE = null, nrAno = null){
    
    let query = { "$match" : {"cdIBGE" : cdIBGE, "nrAnoLicitacao" : nrAno}};
    let project = {};
    let coll_name = coll_name = "rawLicitacao";

    return DB.query(coll_name,[query]);
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