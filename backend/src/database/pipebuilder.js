/**
 *  The Text Search in the aggregarion pipeline has the following restrictions:
 *   - The $match stage that includes a $text must be the first stage in the pipeline.
 *   - A text operator can only occur once in the stage.
 *   - The text operator expression cannot appear in $or or $not expressions.
 *   - The text search, by default, does not return the matching documents in order of matching scores.
 *     Use the $meta aggregation expression in the $sort stage.
 */

function buildMatchStageForQuerysParams (params) {
  const {
    cdIBGE,
    nrAno,
    dsModalidade,
    dtEditalMin,
    dtEditalMax,
    dtAberturaMin,
    dtAberturaMax,
    vlLicitacaoMin,
    vlLicitacaoMax,
  } = params

  const matchStage = {
    '$match' : {
      '$and' : []
    }
  }

  if (cdIBGE && nrAno) {
    const cdIBGEExpression = {'cdIBGE' : cdIBGE}
    const nrAnoExpression = {'nrAnoLicitacao': nrAno}
    matchStage['$match']['$and'].push(cdIBGEExpression)
    matchStage['$match']['$and'].push(nrAnoExpression)
  } else {
    throw TypeError('Parâmetros cdIBGE e nrAno obrigatorios')
  }

  if (dsModalidade) {
    const dsModalidadeExpression = {'dsModalidade': dsModalidade}
    matchStage['$match']['$and'].push(dsModalidadeExpression)
  }
  if (dtEditalMin) {
    const dtEditalMinExpression = {'dtEdital': {'$gte': dtEditalMin}}
    matchStage['$match']['$and'].push(dtEditalMinExpression)
  }
  if (dtEditalMax) {
    const dtEditalMaxExpression = {'dtEdital': {'$lte': dtEditalMax}}
    matchStage['$match']['$and'].push(dtEditalMaxExpression)
  }
  if (dtAberturaMin) {
    const dtAberturaMinExpression = {'dtAbertura': {'$gte': dtAberturaMin}}
    matchStage['$match']['$and'].push(dtAberturaMinExpression)
  }
  if (dtAberturaMax) {
    const dtAberturaMaxExpression = {'dtAbertura': {'$lte': dtAberturaMax}}
    matchStage['$match']['$and'].push(dtAberturaMaxExpression)
  }

  if (vlLicitacaoMin) {
    const vlLicitacaoMinExpression = {'vlLicitacao': {'$gte': vlLicitacaoMin}}
    matchStage['$match']['$and'].push(vlLicitacaoMinExpression)
  }
  if (vlLicitacaoMax) {
    const vlLicitacaoMaxExpression = {'vlLicitacao': {'$lte': vlLicitacaoMax}}
    matchStage['$match']['$and'].push(vlLicitacaoMaxExpression)
  }

  return matchStage
}

module.exports.buildPipeForLicitacaoMunicipio = function buildPipeForQueryLicitacaoMunicipio (params) {
  const {cdIBGE, nrAno, dsObjeto, skip, limit, sort} = params
  
  const pipe = []
  if (dsObjeto) {
    const textSearch = {
      '$match': {
        '$text' : {'$search': dsObjeto, '$language': 'pt'}
      }
    }
    console.log('\t> dsObjeto', dsObjeto)
    pipe.push(textSearch)
  }

  const match = buildMatchStageForQuerysParams(params)
  pipe.push(match)
  
  const project = { $project : { cdIBGE : 1,
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
   pipe.push(project)

   if (skip) {
    pipe.push({$skip : +skip})
   }
   if (limit) {
     pipe.push({ $limit : +limit})
   }
   if (sort) {
     if (sort === 'asc') {
      pipe.push({ '$sort' : {'vlLicitacao': 1}})
     }
     if (sort === 'desc') {
      pipe.push({ '$sort' : {'vlLicitacao': -1}})
     }
   }
   return pipe
}

module.exports.builPipeForRankingFornecedor = function rankingFornecedor (params) {
  const {cdIBGE, nrAno,skip, limit, sort} = params
  const pipe = []
  if(cdIBGE & nrAno){
    pipe.push({ "$match" : {"cdIBGE" : cdIBGE, "nrAno" : nrAno}}) // match stage
  }else{
    throw TypeError('Parâmetros cdIBGE e nrAno obrigatorios')
  }

  if (skip) {
    pipe.push({$skip : +skip})
   }
   if (limit) {
     pipe.push({ $limit : +limit})
   }
   if (sort) {
     if (sort === 'asc') {
      pipe.push({ '$sort' : {'vlLicitacao': 1}})
     }
     if (sort === 'desc') {
      pipe.push({ '$sort' : {'vlLicitacao': -1}})
     }
   }

   return pipe
}

module.exports.buildPipeForMunicipioFromLicitacao = function buildPipeForMunicipioFromLicitacao (params) {
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

    return pipe
}