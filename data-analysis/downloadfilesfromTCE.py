from urllib.request import urlretrieve
import os
import zipfile

def _download_file(url,dest):
    urlretrieve(url, dest)

def _validate_cdIBGE(cdIBGE):
    return cdIBGE[:6]

def _validate_year(year):
    years = ['2013', '2014', '2015', '2016', '2017']
    if(year in years):
        return year
    else :
        raise TypeError("O parâmetro ano não é válido\nvalor atribuido\t"+year)
        
def _validate_filetype(file_type):
    available_files = {'licitacao': 'Licitacao',
                        'contratos': 'Contrato',
                        'convenios': 'Convenio',
                        'obras': 'Obra',
                        'despesas' : 'Despesa', 
                        'combustivel' : 'Combustivel',
                        'diarias' : 'Diarias',
                        'relacionamentos' : 'Relacionamentos'};
    if file_type in available_files.keys() : 
        return available_files[file_type]
    else :
        raise TypeError("Tipo de arquivo nao é valido! ")

def _formatte_url(cdIBGE, year, file_type):
    baseURL = 'http://servicos.tce.pr.gov.br/TCEPR/Tribunal/Relacon/Arquivos/{year}/{year}_{cod}_{type}.zip'
    return baseURL.format(cod=cdIBGE,year=year,type=file_type)

def _formatte_dest_file_name(cdIBGE, year, file_type):
    file_name = "tmp/{type}_{year}_{cod}.zip"
    return file_name.format(cod=cdIBGE,year=year,type=file_type)

def get_file(cdIBGE, year, file_type):
    cdIBGE = _validate_cdIBGE(cdIBGE)
    year = _validate_year(year)
    file_type = _validate_filetype(file_type)
    url = _formatte_url(cdIBGE, year, file_type)
    dest = _formatte_dest_file_name(cdIBGE, year, file_type)
    _download_file(url,dest)

def extract_zip_to(file_type,diretory='data/',tmp='tmp/'):
    files = os.listdir(tmp)
    for f in files:
        if zipfile.is_zipfile(tmp+f):
            print("extracting... "+f)
            ZipFile = zipfile.ZipFile(tmp+f)
            ZipFile.extractall(diretory+file_type)
