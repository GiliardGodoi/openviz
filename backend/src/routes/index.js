import { check, validationResult } from 'express-validator/check'
import { matchedData, sanitize } from 'express-validator/filter'
import {timeParse} from 'd3-time-format'
import DB from '../database/db.js'
import handlerError from '../utils/apiErrorHandling'
import { error } from 'util';

const parseDate = timeParse('%d/%m/%Y')
const parseNumber = value => {
    value = value.replace(/\./g,'').replace(',','.')
    return Number(value) || 0
}

module.exports = (app) => {
    const config = app.src.libs.config;
    const database = new DB(config.db.uri)
    let count = 0
    const ANOS_DISPONIVEIS = ['2013', '2014', '2015', '2016', '2017']
    const VALORES_DESCRICAO_MODALIDADE_DISPONIVEL = [
      'blank',
      'Processo Dispensa',
      'Processo Inexigibilidade',
      'Pregão', 'Tomada de Preços',
      'Convite',
      'Concorrência',
      'Leilão', 'Concurso',
      'Regime Diferenciado de Contratações - RDC',
    ]

    app.get('/', (req, res) => {
        res.json({
            name : 'OpenViz API',
            version : "v1",
            status : 'ok!',
            count : count
        });
        count += 1
    });

    app.route('/licitacoes/:cdIBGE/:nrAno')
    .all((req, res, next) => {
        if (req.query.dtEditalMin) {
            req.query.dtEditalMin = parseDate(req.query.dtEditalMin)
        }
        if (req.query.dtEditalMax) {
            req.query.dtEditalMax = parseDate(req.query.dtEditalMax)
        }
        if (req.query.dtAberturaMin) {
            req.query.dtAberturaMin = parseDate(req.query.dtAberturaMin)
        }
        if (req.query.dtAberturaMax) {
            req.query.dtAberturaMax = parseDate(req.query.dtAberturaMax)
        }
        if (req.query.vlLicitacaoMin){
            req.query.vlLicitacaoMin = parseNumber(req.query.vlLicitacaoMin)
            console.log(req.query.vlLicitacaoMin)
        }
        if (req.query.vlLicitacaoMax){
            req.query.vlLicitacaoMax = parseNumber(req.query.vlLicitacaoMax)
            console.log(req.query.vlLicitacaoMax)
        }
        next()
    })
    .get([
        check('nrAno').isIn(ANOS_DISPONIVEIS).withMessage('Pesquisar entre os anos 2013~2016'),
        check('cdIBGE').isLength({ min : 6}),
        check('cdIBGE').isNumeric().withMessage('cdIBGE deve conter apenas digitos numéricos'),
        check('nmMunicipio').trim(),
        check('dsModalidade').optional().isIn(VALORES_DESCRICAO_MODALIDADE_DISPONIVEL),
        check('dsObjeto').optional().not().matches(/[\{\[\($%&*\\/\)\]\}]/g).withMessage('Descrição do objeto não pode conter caracteres especiais'),
        check('vlLicitacaoMin').optional().isDecimal(),
        check('vlLicitacaoMax').optional().isDecimal()
    ],
     (req, res) => {
        let resposta = {
            success : false,
            message : '',
        };
        console.log(`\tGET ${req.path}`)
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            resposta['errors'] = errors.mapped()
            res.status(400);
            res.json(resposta)
        } else {
            let parametrosPesquisa = {...req.params,...req.query}
            console.log(JSON.stringify(parametrosPesquisa,4))
            database.connect().then( () => {
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
        }
    });
    /*
        /licitacoes/:cdIBGE/:nrAno/count
    */
    app.get('/licitacoes/:cdIBGE/:nrAno/itens', [
        check('nrAno').isIn(ANOS_DISPONIVEIS).withMessage('Pesquisar entre os anos 2013~2016'),
        check('cdIBGE').isLength({ min : 6}),
        check('cdIBGE').isNumeric().withMessage('cdIBGE deve conter apenas digitos numéricos'),
    ], (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : []
        };

        let parametrosPesquisa = {...req.params,...req.query}

        console.log(`\tGET ${req.path}`)

        database.connect().then( () =>{
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

    app.get('/licitacao/anos', (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : null
        };
        console.log(`\tGET ${req.path}`);

        resposta.data = ANOS_DISPONIVEIS;
        resposta.success = true;
        res.send(anos);
    });

    app.get('/licitacao/municipios/:nrAno',[
        check('nrAno').isIn(ANOS_DISPONIVEIS).withMessage('Pesquisar entre os anos 2013~2016'),
    ], (req, res) => {
        let resposta = {
            success : false,
        };
        const {nrAno} = req.params
        console.log(`\tGET ${req.path}\n\t\tnrAno: ${nrAno}`)
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            resposta['error'] = errors.mapped()
            res.status(400).json(resposta)
        } else {
            database.connect().then( () =>{
                database.queryMunicipioFromLicitacao({nrAno})
                    .then( doc => {
                        if(Array.isArray(doc)){
                            resposta.data = doc.length == 1 ? doc[0] : doc;
                            resposta.success = true;
                        }
                        res.json(resposta);;
                    }).catch(err => {
                        res.status(500).end();
                    });
            }).catch( err => {
                res.status(500).end();
            })
        }
    });

    app.get('/licitacao/:idLicitacao', (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : null
        };
        let parametrosPesquisa = {...req.params,...req.query}
        console.log(`\tGET ${req.path}`)
        database.connect().then( () => {
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

    app.get('/licitacao/fornecedores/:cdIBGE/:nrAno', [
        check('nrAno').isIn(ANOS_DISPONIVEIS).withMessage('Pesquisar entre os anos 2013~2016'),
        check('cdIBGE').isLength({ min : 6}),
        check('cdIBGE').isNumeric().withMessage('cdIBGE deve conter apenas digitos numéricos'),
    ], (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : null
        };

        let parametrosPesquisa = {...req.params,...req.query};
        console.log(`\tGET ${req.path}`)
        database.connect().then( () => {
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

    app.get('/licitacao/sinopse/:cdIBGE/:nrAno', [
        check('nrAno').isIn(ANOS_DISPONIVEIS).withMessage('Pesquisar entre os anos 2013~2016'),
        check('cdIBGE').isLength({ min : 6}),
        check('cdIBGE').isNumeric().withMessage('cdIBGE deve conter apenas digitos numéricos'),
    ], (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : null
        };
        let parametrosPesquisa = {...req.params,...req.query};

        console.log(`\tGET ${req.path}`)

        database.connect().then( () => {
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

    app.get('/licitacao/sinopse/modalidades/:cdIBGE/:nrAno', [
        check('nrAno').isIn(ANOS_DISPONIVEIS).withMessage('Pesquisar entre os anos 2013~2016'),
        check('cdIBGE').isLength({ min : 6}),
        check('cdIBGE').isNumeric().withMessage('cdIBGE deve conter apenas digitos numéricos'),
    ], (req, res) => {
        let resposta = {
            success : false,
            message : '',
            data : null
        };

        let parametrosPesquisa = {...req.params,...req.query};
        console.log(`\tGET ${req.path}`)
        database.connect().then( () => {
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
        database.connect()
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

    app.get('/mapa/:cdEstado', (req, res) =>{
        let resposta = {
            success : false,
            message : '',
            data : []
        };

        let parametrosPesquisa = {'cdEstado' : req.params.cdEstado }
        console.log(`\tGET ${req.path}`)
        database.connect().then( () => {
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
