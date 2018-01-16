
module.exports.buildPipeForLicitacaoMunicipio = function buildPipeForQueryLicitacaoMunicipio (params) {
  const {cdIBGE, nrAno,skip, limit, sort} = params
  
  const pipe = []
  
  if (cdIBGE && nrAno) {
    const match = { '$match' : { 
      'cdIBGE' : cdIBGE,
      'nrAnoLicitacao': nrAno
    }}
    pipe.push(match)
  } else {
    throw TypeError('Parâmetros cdIBGE e nrAno obrigatorios')
  }
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