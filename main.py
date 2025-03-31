import requests
from datetime import datetime, timedelta
import numpy as np

# Função para obter os feriados do Brasil (excluindo facultativos)
def obter_feriados(cidade, estado, ano):
    url = "https://feriados-brasileiros1.p.rapidapi.com/read"
    querystring = {"cidade": cidade, "estado": estado, "ano": ano}
    headers = {
        "x-rapidapi-key": "8bdd60dae6msha5b0b9d3ed4226ap199049jsn692441fc6c60",
        "x-rapidapi-host": "feriados-brasileiros1.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)

    try:
        feriados = response.json()
        if not isinstance(feriados, list):
            print("Erro: A resposta da API não contém uma lista de feriados.")
            return []
        
        feriados_filtrados = [feriado for feriado in feriados if feriado.get("tipo", "").lower() != "facultativo"]
        return feriados_filtrados
    except requests.exceptions.JSONDecodeError:
        print("Erro ao decodificar a resposta JSON.")
        return []
    
def obter_feriados_proximo_ano(estado, ano):
    url = "https://feriados-brasileiros1.p.rapidapi.com/read_uf"
    querystring = {"estado": estado, "ano": ano}
    headers = {
        "x-rapidapi-key": "8bdd60dae6msha5b0b9d3ed4226ap199049jsn692441fc6c60",
        "x-rapidapi-host": "feriados-brasileiros1.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)

    try:
        feriados = response.json()
        if not isinstance(feriados, list):
            print("Erro: A resposta da API não contém uma lista de feriados.")
            return []
        
        feriados_filtrados = [feriado for feriado in feriados if feriado.get("tipo", "").lower() != "facultativo"]
        return feriados_filtrados
    except requests.exceptions.JSONDecodeError:
        print("Erro ao decodificar a resposta JSON.")
        return []

# Função para calcular os dias úteis
def dias_uteis(data_inicio, data_fim, feriados):
    data_inicio = datetime.strptime(data_inicio, '%d/%m/%Y')
    data_fim = datetime.strptime(data_fim, '%d/%m/%Y')

    if feriados:
        feriados_data = [
            datetime.strptime(feriado['data'], '%d/%m/%Y').strftime('%Y-%m-%d') 
            for feriado in feriados 
            if 'data' in feriado
        ]
    else:
        feriados_data = []

    try:
        weekmask = "1111100"  # Exclui terça-feira

        dias_uteis = np.busday_count(
            data_inicio.strftime('%Y-%m-%d'),
            data_fim.strftime('%Y-%m-%d'),
            holidays=feriados_data,
            weekmask=weekmask
        )
        return dias_uteis
    except ValueError as e:
        print(f"Erro ao calcular dias úteis: {e}")
        return 0

# Entrada do usuário
hoje = datetime.today().strftime('%d/%m/%Y')
mes = datetime.today().month
ano = datetime.today().year

estado = "RJ"  # Estado padrão (pode ser alterado)
cidade = "rio_de_janeiro"  # Cidade padrão

# Obter feriados do ano atual e do próximo ano (se necessário)
feriados_ano_atual = obter_feriados(cidade, estado, ano)
feriados_proximo_ano = obter_feriados_proximo_ano(estado, ano + 1)
feriados_completos = feriados_ano_atual + feriados_proximo_ano

# Determinar o último dia útil antes do dia 20 do próximo mês
if mes == 12:
    data_fim = datetime(ano + 1, 1, 19).strftime('%d/%m/%Y')
else:
    data_fim = datetime(ano, mes + 1, 19).strftime('%d/%m/%Y')

# Calcular dias úteis no intervalo
resultado = dias_uteis(hoje, data_fim, feriados_completos)

print(f"\nIntervalo: {hoje} a {data_fim}")
print(f"Quantidade de dias úteis (sem terças-feiras): {resultado}")
