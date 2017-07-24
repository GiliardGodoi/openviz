import DB from '../db.js'

const database = new DB;

module.exports = (app) => {
    let config = app.src.libs.config;

    app.get('/', (req, res) => {
        res.json({
            name : 'OpenViz API',
            version : "v1",
            status : 'ok!'
        });
    });

    app.get('/licitacoesMunicipio', (req, res) => {
        let resposta = {
            success : false,
            message : 'teste',
            data : []
        };
        let {cdIBGE, nrAno} = req.query;

        console.log(`\tGET /licitacoesMunicipio cdIBGE : ${cdIBGE} nrAno : ${nrAno}`);

        database.connect(config.db.uri).then( () => {

            database.queryLicitacoesMunicipio(cdIBGE, nrAno)
                .then( (data) => {
                    if(data){
                        resposta.data = data;
                        resposta.success = true;
                    }
                    res.json(resposta);
                })
                .catch( (err) => {
                    res.status(500).end();
                });
        }).catch( err => {
            res.status(500).end();
        });
    });

    app.get('/licitacao', (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : null
        };

        let {idLicitacao} = req.query;

        console.log(`\tGET for idLicitacao ${idLicitacao}`);

        database.connect(config.db.uri).then( () => {
            database.queryLicitacao(idLicitacao)
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

    app.get('/rankingFornecedor', (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : null
        };

        let {cdIBGE, nrAno} = req.query;

        console.log(`\tGET /rankingFornecedor cdIBGE : ${cdIBGE} nrAno : ${nrAno}`);

        database.connect(config.db.uri).then( () => {
            database.queryRankingFornecedor(cdIBGE, nrAno)
                .then( (data) => {
                    if(data){
                        resposta.data = data;
                        resposta.success = true;
                    }
                    res.json(resposta);
                })
                .catch( err => {
                    res.status(500).end();
                })
        }).catch( (err) => {
            console.log(err.message);
            res.status(500).end();
        })

    });

    app.get('/sinopseLicitacao', (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : null
        };
        let {cdIBGE, nrAno } = req.query;

        console.log(`\tGET /sinopseLicitacao cdIBGE : ${cdIBGE} nrAno ${nrAno}`);

        database.connect(config.db.uri).then( () => {
            database.querySinopseLicitacao(cdIBGE, nrAno)
                .then( (data) =>{
                    if(data){
                        resposta.data = data;
                        resposta.success = true;
                    }
                    res.json(resposta);
                })
                .catch( (err) => {
                    console.error(err.message);
                    res.status(500).end();
                });
        }).catch((err) => {
            console.error(err.message);
            res.status(500).end();
        });
     
    });

    app.get('/criterioAvaliacaoPorModalidade', (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : null
        };

        let {cdIBGE, nrAno} = req.query;

        console.log(`\tGET /criterioAvaliacao cdIBGE : ${cdIBGE} nrAno ${nrAno}`);

        database.connect(config.db.uri).then( () => {
            database.querySinopseCriterioAvaliacaoPorModalidade(cdIBGE, nrAno)
                .then ( (data) => {
                    if(data){
                        resposta.data = data;
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
}