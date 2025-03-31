document.addEventListener("DOMContentLoaded", async () => {
    const resultadoDiv = document.getElementById("resultado");
    const calcularBtn = document.getElementById("calcular");

    async function obterFeriados(estado, ano) {
        const url = `https://feriados-brasileiros1.p.rapidapi.com/read_uf?estado=${estado}&ano=${ano}`;
        const headers = {
            "x-rapidapi-key": "8bdd60dae6msha5b0b9d3ed4226ap199049jsn692441fc6c60",
            "x-rapidapi-host": "feriados-brasileiros1.p.rapidapi.com"
        };

        try {
            const response = await fetch(url, { headers });
            const feriados = await response.json();
            return Array.isArray(feriados) 
                ? feriados.filter(f => f.tipo.toLowerCase() !== "facultativo").map(f => f.data)
                : [];
        } catch (error) {
            console.error("Erro ao obter feriados:", error);
            return [];
        }
    }

    function calcularDiasUteis(inicio, fim, feriados, diasSelecionados) {
        let dataAtual = new Date(inicio);
        const dataFim = new Date(fim);
        let count = 0;

        while (dataAtual <= dataFim) {
            const diaSemana = dataAtual.getDay();
            const dataFormatada = dataAtual.toISOString().split("T")[0].split("-").reverse().join("/");

            if (diasSelecionados.includes(diaSemana) && !feriados.includes(dataFormatada)) {
                count++;
            }
            dataAtual.setDate(dataAtual.getDate() + 1);
        }

        return count;
    }

    calcularBtn.addEventListener("click", async () => {
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

        const diasSelecionados = Array.from(document.querySelectorAll("input[type='checkbox']:checked"))
            .map(checkbox => parseInt(checkbox.value));

        const diasUteis = calcularDiasUteis(hoje, new Date(dataFim.split("/").reverse().join("-")), feriadosCompletos, diasSelecionados);

        const vrTotal = parseFloat(document.getElementById("vr").value) || 0;
        const vaTotal = parseFloat(document.getElementById("va").value) || 0;

        const vrDiario = diasUteis > 0 ? (vrTotal / diasUteis).toFixed(2) : "0.00";
        const vaDiario = diasUteis > 0 ? (vaTotal / diasUteis).toFixed(2) : "0.00";

        resultadoDiv.innerHTML = `
            <div>
                <div>Intervalo: <strong>${dataInicio} a ${dataFim}</strong></div>
                <div>Quantidade de dias úteis: <strong>${diasUteis}</strong></div>
            </div>
            <div>
                <div>Gasto diário com VR: <strong>R$ ${vrDiario}</strong></div>
                <div>Gasto diário com VA: <strong>R$ ${vaDiario}</strong></div>
            </div>
        `;
    });
});
