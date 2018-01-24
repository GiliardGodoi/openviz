# -*- coding: utf-8 -*-
from pymongo import MongoClient
from functools import reduce
import pprint

class ProcessData():
    '''
        ROTINA PARA PREPARANÇÃO DOS DADOS
        ROTA:
        licitacao/:idLicitacao

        OBJETIVO: Acrescenta o campo item nos documentos da coleção licitacao, a partir dos dados 
        da coleção licitacaoVencedor.

        MODELO DE DADOS:
        {
            cdIBGE : <string>,
            nmMunicipio : <string>,
            nmEntidade : <string>,
            idEntidade : <string>,
            idLicitacao :<string>,
            dsModalidade : <string>,
            nrLicitacao : <string>,
            nrAnoLicitacao : <string>,
            dtEdital : <string>,
            dtAbertura : <string>,
            vlLicitacao : <string>,
            dsNaturezaLicitacao : <string>,
            dsAvaliacaoLicitacao : <string>,
            dsClassificacaoObjeto : <string>,
            dsRegimeExecucao : <string>,
            dsObjeto : <string>,
            dsClausulaProrrogacao : <string>,
            item : <array>,
            vlTotalAdquiridoLicitacao : <double>
        }

        item : [
            {
                'nmFornecedor' : <string>,
                'nrDocumentoFornecedor' : <string>,
                'nrLote' : <string>,
                'nrItem' : <string>,
                'nrQuantidade' : <double>,
                'dsUnidadeMedida' : <string>,
                'vlMinimoUnitario' : <double>,
                'vlMinimoTotal' : <double>,
                'vlMaximoUnitario': <double>,
                'vlMaximoTotal' : <double>,
                'dsItem' : <string>,
                'dsFormaPagamento' : <string>,
                'dsTipoEntregaProduto': <string>,
                'nrQuantidadePropostaLicitacao' : 
                'vlPropostaItem' : <double>,
                'dtValidadeProposta' : <string>,
                'dtPrazoEntregaPropostaLicitacao' : <string>,
                'nrClassificacao' : <string>,
                'dtHomologacao' : <string>,
                'nrQuantidadeVencedor' : <double>,
                'vlUnitarioVencedor' : <double>,
                'vlTotalVencedor' : <double>
            }
        ]
    '''
    def __init__(self):
        self._db = None

    def get_db(self):
        if not self._db:
            client = MongoClient("mongodb://localhost:27017")
            self._db = client['dbOpenviz']
        return self._db

    def process(self):
        db = self.get_db()
        lstidEntidade = db['licitacao'].distinct('idEntidade')
        # lstidEntidade = self.determinar_idPessoa_para_processamento()
        
        print("Processamento ocorrendo para:\n",lstidEntidade)
        for cod in lstidEntidade:
            cursor = self.process_item_licitacao(cod)
            docs_updated = self.update_field(cursor)
            print('idEntidade: ', cod, 'Documentos atualizados: ',docs_updated)
        
    def determinar_idPessoa_para_processamento(self):
        db = self.get_db()
        match = { "$match" : {'item' : {'$exists' : True }} }
        project = {"$project" : {'_id' : 0, 'idPessoa' : 1} }
        group = { "$group" :{ "_id" : "$idPessoa" } }
        pipeline = [match, project, group]

        cursor = db.licitacao.aggregate(pipeline)
        idPessoaJaProcessados = reduce(lambda a,x : a + [x['_id']] , list(cursor),[])

        idPessoaFromlicitacao = db.licitacao.distinct('idPessoa')

        conjunto = set(idPessoaFromlicitacao) - set(idPessoaJaProcessados)

        return list(conjunto)
        
    def process_item_licitacao(self, idEntidade):
        match = { '$match' : { 'idEntidade' : idEntidade } }
        project = { '$project' : {'cdIBGE' : 0, 'idEntidade' : 0, 'nmEntidade' : 0,'nrAnoLicitacao' : 0, 'nrLicitacao': 0, 'dsModalidadeLicitacao': 0,'idUnidadeMedida' : 0 ,'idTipoEntregaProduto': 0,'DataReferencia' : 0, 'ultimoEnvioSIMAMNesteExercicio' : 0 }}
        group = { '$group' : {
            '_id' : '$idlicitacao',
            'item' : { '$push' : {
                'nmFornecedor' : '$nmFornecedor',
                'nrDocumentoFornecedor' : '$nrDocumento',
                'nrLote' :'$nrLote',
                'nrItem' : '$nrItem',
                'nrQuantidade' : '$nrQuantidade',
                'dsUnidadeMedida' : '$dsUnidadeMedida',
                'vlMinimoUnitario' : '$vlMinimoUnitarioItem',
                'vlMinimoTotal' : '$vlMinimoTotal',
                'vlMaximoUnitario': '$vlMaximoUnitarioitem',
                'vlMaximoTotal' : '$vlMaximoTotal',
                'dsItem' : '$dsItem',
                'dsFormaPagamento' : '$dsFormaPagamento',
                'dsTipoEntregaProduto': '$dsTipoEntregaProduto',
                'nrQuantidadePropostaLicitacao' : '$nrQuantidadePropostaLicitacao',
                'vlPropostaItem' : '$vlPropostaItem',
                'dtValidadeProposta' : '$dtValidadeProposta',
                'dtPrazoEntregaPropostaLicitacao' : '$dtPrazoEntregaPropostaLicitacao',
                'nrClassificacao' : '$nrClassificacao',
                'dtHomologacao' : '$dtHomologacao',
                'nrQuantidadeVencedor' : '$nrQuantidadeVencedorLicitacao',
                'vlUnitarioVencedor' : '$vlLicitacaoVencedorLicitacao',
                'vlTotalVencedor' : '$vlTotalVencedorLicitacao'
            }},
            'vlTotalAdquiridoLicitacao' : {
                '$sum' : '$vlTotalVencedorLicitacao'
            }
        }}
        pipeline = [match, project, group]
        db = self.get_db()
        cursor =  db.licitacaoVencedor.aggregate(pipeline,allowDiskUse=True)
        return cursor

    def update_field(self, cursor = None):
        if not cursor:
            raise AttributeError('parametro invalido em update_field')
        db = self.get_db()
        count = 0
        docs_updated = []
        for doc in cursor:
            result = db.licitacao.update_one({'idLicitacao' : doc['_id']}, { '$set' : {'item' : doc['item'], 'vlTotalAdquiridoLicitacao': doc['vlTotalAdquiridoLicitacao']} })
            count += 1
            # docs_updated.append(result.raw_result)
        # return count, docs_updated
        return count

        
    

if __name__ == "__main__":
    p = ProcessData()
    p.process()
    