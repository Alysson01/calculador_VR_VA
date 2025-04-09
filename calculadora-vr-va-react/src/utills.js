
export const obterFeriados = async (estado, ano) => {
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

export const calcularDiasUteis = (inicio, fim, feriados, diasSelecionados) => {
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

        console.log(count)
    }

    return count;
}