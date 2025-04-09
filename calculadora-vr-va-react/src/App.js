import React from 'react';
import { useState } from 'react';
import './App.css';
import DiasTrabalho from './components/DiasTrabalho.js'
import ValoresBeneficios from './components/ValoresBeneficios.js';
import {obterFeriados, calcularDiasUteis} from './utills.js'

function App() {

  const [beneficios, setBeneficios] = useState({va:'', vr:''})
  const [gastoDia, setGastoDia] = useState(null)
  const [datas, setDatas] = useState(null)

  const [diasSelecionados, setDiasSelecionados] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(beneficios)
    console.log(diasSelecionados)

    const hoje = new Date();
    const mes = hoje.getMonth() + 1;
    const ano = hoje.getFullYear();
    const dataInicio = hoje.toISOString().split("T")[0].split("-").reverse().join("/");
    
    const dataFim = mes === 12 
    ? `19/01/${ano + 1}` 
    : `19/${String(mes + 1).padStart(2, '0')}/${ano}`;

    
    const feriadosAnoAtual = await obterFeriados("RJ", ano);
    const feriadosProximoAno = await obterFeriados("RJ", ano + 1);
    const feriadosCompletos = [...feriadosAnoAtual, ...feriadosProximoAno];
    
    const selectedDays = []
    
    for(let chave in diasSelecionados){
      if(diasSelecionados[chave] === true) selectedDays.push(Number(chave))
      }
    
    const diasUteis = calcularDiasUteis(hoje, new Date(dataFim.split("/").reverse().join("-")), feriadosCompletos, selectedDays);


    const vrTotal = parseFloat(beneficios.vr) || 0;
    const vaTotal = parseFloat(beneficios.va) || 0;
    
    const vrDiario = diasUteis > 0 ? (vrTotal / diasUteis).toFixed(2) : "0.00";
    const vaDiario = diasUteis > 0 ? (vaTotal / diasUteis).toFixed(2) : "0.00";
    
    setGastoDia({vr:vrDiario, va:vaDiario})
    setDatas({dataInicio, dataFim, diasUteis})

    console.log(vrDiario, vaDiario, diasUteis)
    console.log(gastoDia, vrTotal, vaTotal)
  }

  return (
    <div className="App">
      <h1>Calculadora de Benefícios</h1>
      <form onSubmit={handleSubmit} className='content'>

        <div className='container'>
          <DiasTrabalho onChangeDias = {setDiasSelecionados} diasSelecionados={diasSelecionados}/>
          <ValoresBeneficios onChangeBeneficios={setBeneficios}/>
        </div>
        <button onSubmit={handleSubmit}>ENVIAR</button>
      </form>
      {gastoDia && 
              <div className='resultado'>
                <div>
                  <div>Intervalo: <strong>{datas.dataInicio} a {datas.dataFim}</strong></div>
                  <div>Quantidade de dias úteis: <strong>{datas.diasUteis}</strong></div>
                </div>
                <div>
                  <div>Gasto diário com VR: <strong>R$ {gastoDia.vr}</strong></div>
                  <div>Gasto diário com VA: <strong>R$ {gastoDia.va}</strong></div>
                </div>
              </div>
            }
    </div>
  );
}

export default App;
