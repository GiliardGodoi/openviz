import database from '../database/db.js'
import handlerError from '../utils/apiErrorHandling'

module.exports = (app) => {
    let config = app.src.libs.config;

    app.get('/', (req, res) => {
        res.json({
            name : 'OpenViz API',
            version : "v1",
            status : 'ok!'
        });
    });

    app.get('/licitacoes/:cdIBGE/:nrAno', (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : []
        };
        console.log(`\tGET ${req.path}`)
        let parametrosPesquisa = {...req.params,...req.query}
        
        database.connect(config.db.uri).then( () => {
            database.queryLicitacoesMunicipio(parametrosPesquisa)
                .then( (data) => {
                    if(Array.isArray(data) && data.length > 0){
                        resposta.data = data;
                        resposta.success = true;
                    }else{
                        resposta.message = "Nenhum resultado para os parâmetros";
                    }
                    res.json(resposta);
                })
                .catch( err => {
                    handlerError(err);        
                    res.status(500).end();
                });
        }).catch( err => {
            handlerError(err);
            res.status(500).end();
        });
    });
    /*
        /licitacoes/:cdIBGE/:nrAno/count
    */
    app.get('/licitacoes/:cdIBGE/:nrAno/itens', (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : []
        };
        
        let parametrosPesquisa = {...req.params,...req.query}
        
        console.log(`\tGET ${req.path}`)

        database.connect(config.db.uri).then( () =>{
            database.queryItensLicitacao(parametrosPesquisa)
                .then( data => {
                    if(Array.isArray(data) && data.length > 0){
                        resposta.data = data;
                        resposta.success = true;
                    }else{
                        resposta.message = "Nenhum resultado para os parâmetros";
                    }
                    res.json(resposta);
                })
                .catch( err => {
                    handlerError(err);
                    res.status(500).end();
                })
        }).catch(err =>{
            handlerError(err);
            res.status(500).end();
        });
    });

    app.get('/licitacoes/anos', (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : null
        };
        console.log(`\tGET ${req.path}`);

        let anos = [2016, 2015, 2014, 2013];
        resposta.data = anos;
        resposta.success = true;
        res.send(anos);
    });

    app.get("/licitacoes/municipios", (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : null
        };

        console.log(`\tGET ${req.path}`);

        database.connect(config.db.uri).then( () =>{
            database.queryMunicipioFromLicitacao()
                .then( doc => {
                    if(doc){
                        resposta.data = doc;
                        resposta.success = true;
                    }
                    res.json(resposta);;
                }).catch(err => {
                    res.status(500).end();
                });
        }).catch( err => {
            res.status(500).end();
        })
    });

    app.get('/licitacao/:idLicitacao', (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : null
        };
        let parametrosPesquisa = {...req.params,...req.query}
        console.log(`\tGET ${req.path}`)
        database.connect(config.db.uri).then( () => {
            database.queryLicitacao(parametrosPesquisa)
                .then( (doc) => {
                    if(doc){
                        resposta.data = doc;
                        resposta.success = true;
                    }
                    res.json(resposta);
                })
                .catch( err => {
                    res.status(500).end();
                });
        }).catch( err => {
            res.status(500).end();
        });
        
    });

    /* 
        /licitacao/:idLicitacao/itens
        /licitacao/:idLicitacao/fornecedores    
    */

    app.get('/fornecedores/:cdIBGE/:nrAno', (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : null
        };

        let parametrosPesquisa = {...req.params,...req.query};
        console.log(`\tGET ${req.path}`)
        database.connect(config.db.uri).then( () => {
            database.queryRankingFornecedor(parametrosPesquisa)
                .then( (data) => {
                    if(Array.isArray(data) && data.length > 0){
                        resposta.data = data;
                        resposta.success = true;
                    }else{
                        resposta.message = "Nenhum resultado para os parâmetros";
                    }
                    res.json(resposta);
                })
                .catch( err => {
                    handlerError(err);
                    res.status(500).end();
                })
        }).catch( (err) => {
            handlerError(err);
            res.status(500).end();
        })

    });

    app.get('/sinopses/licitacoes/:cdIBGE/:nrAno', (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : null
        };
        let parametrosPesquisa = {...req.params,...req.query};

        console.log(`\tGET ${req.path}`)

        database.connect(config.db.uri).then( () => {
            database.querySinopseLicitacao(parametrosPesquisa)
                .then( (data) =>{
                    if(Array.isArray(data) && data.length > 0){
                        resposta.data = data;
                        resposta.success = true;
                    }else{
                        resposta.message = "Nenhum resultado para os parâmetros";
                    }
                    res.json(resposta);
                })
                .catch( (err) => {
                    handlerError(err);
                    res.status(500).end();
                });
        }).catch((err) => {
            handlerError(err);
            res.status(500).end();
        });
     
    });

    app.get('/sinopses/modalidades/:cdIBGE/:nrAno', (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : null
        };

        let parametrosPesquisa = {...req.params,...req.query};
        console.log(`\tGET ${req.path}`)
        database.connect(config.db.uri).then( () => {
            database.querySinopseCriterioAvaliacaoPorModalidade(parametrosPesquisa)
                .then ( (data) => {
                    if(data){
                        resposta.data = data;
                        resposta.success = true;
                    }else{
                        resposta.message = "Nenhum resultado para os parâmetros";
                    }
                    res.json(resposta);
                })
                .catch( err => {
                    handlerError(err);
                    res.status(500).end();
                });
        }).catch( err => {
            handlerError(err);
            res.status(500).end();
        });

    });

    app.get('/municipios/:cdEstado',(req, res)=>{
        let resposta = {
            success : false,
            message : '',
            data : []
        };

        let parametrosPesquisa = {'cdEstado' : req.params.cdEstado }
        console.log(`\tGET ${req.path}`)
        database.connect(config.db.uri)
            .then( () => {
                database.queryMunicipio(parametrosPesquisa)
                    .then( (data) => {
                        if(Array.isArray(data) && data.length > 0){
                            resposta.data = data;
                            resposta.success = true;
                        }else{
                            resposta.message = "Nenhum resultado para os parâmetros";
                        }
                        res.json(resposta);
                    })
                    .catch( err => {
                        handlerError(err);        
                        res.status(500).end();
                    });
            })
            .catch( () => {

            });
    });

    app.get('/maps/:cdEstado', (req, res) =>{
        let resposta = {
            success : false,
            message : '',
            data : []
        };

        let parametrosPesquisa = {'cdEstado' : req.params.cdEstado }
        console.log(`\tGET ${req.path}`)
        database.connect(config.db.uri).then( () => {
            database.queryGeojson(parametrosPesquisa)
                .then( (data) => {
                    if(Array.isArray(data) && data.length > 0){
                        resposta.data = data;
                        resposta.success = true;
                    }else{
                        resposta.message = "Nenhum resultado para os parâmetros";
                    }
                    res.json(resposta);
                })
                .catch( err => {
                    handlerError(err);        
                    res.status(500).end();
                });
        }).catch( err => {
            handlerError(err);
            res.status(500).end();
        });
    })

}