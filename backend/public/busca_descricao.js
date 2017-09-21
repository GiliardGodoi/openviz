
function busca(palavra, dados){
    let pattern = new RegExp(palavra,"im");
    return dados.filter( d => pattern.test(d["dsObjeto"]) )
}