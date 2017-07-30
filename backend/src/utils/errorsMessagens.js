
//Erros para modulo db.js
module.exports.PARAMETROS_DEVEM_SER_DEFINIDOS = function(...params){
    return `Erro: parâmetros não definidos: ${params}`;
}