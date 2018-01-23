# Coleta e Tratamento dos Dados

Este diretório reúne os *scripts* utilizados para coleta e tratamento dos dados a serem utilizados no projeto.

## Configuração do Banco

Após instalado o suite Anaconda (Versão 5.0.1) com Python 3.6, instale o módulo pymongo no ambiente criado pelo Anaconda. Digite o seguinte comando no prompt do Anaconda:

´´´ conda install -c anaconda pymongo  ´´´

Execute os Notebooks:

  01-ObtendoInformacoesSobreMunicípiosPR.ipynb
  02-ObtendoOsArquivos.ipynb
  03-ExtraindoDadosDoXMLeSalvandoNoMongoDB.ipynb

Configure para a lista de municípios que desejar.

Agora vc tem os dados utilizados pela aplicação.


## Nota

Esta não é a primeira tentativa para definir um procedimento responsável pela coleta e tratamento deste dados. Tentativas anteriores - que refletem a pouca experiência sobre o assunto - podem ser encontratas nos seguintes repositórios: [cse-tce](https://github.com/GiliardGodoi/cse-tce); [engine-data-node](https://github.com/GiliardGodoi/engine_data_node); [tce-handler-file](https://github.com/GiliardGodoi/tce-handler-files). Este último, realiza operações de *parse* dos arquivos xml para documentos *json* e a conversão para os tipos de dado apropriados -- operações são realizadas com maior facilidade com o auxílio da biblioteca *pandas*.

A utilização da biblioteca *pandas* e do *Jupyter Notebook* representa uma significativa evolução desta solução. O *Jupyter Notebook* permite que todo o processo seja melhor documentado, facilitando o entendimento e a reprodução deste procedimento por outras pessoas.
