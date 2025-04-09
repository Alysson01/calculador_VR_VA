import Label from './Label.js'

const DiasTrabalho = ({diasSelecionados, onChangeDias}) => {

  const handleChange = (e) => {
    const value = e.target.value;

    onChangeDias((prev) => ({
      ...prev,
      [value]: e.target.checked
    }));
  };

  return (
    <div className="dias-trabalho">
      <h2>Dias de Trabalho</h2>
      <Label checked={diasSelecionados[1]} onChange={handleChange} value={1} diaSemana="Segunda" />
      <Label checked={diasSelecionados[2]} onChange={handleChange} value={2} diaSemana="Terça" />
      <Label checked={diasSelecionados[3]} onChange={handleChange} value={3} diaSemana="Quarta" />
      <Label checked={diasSelecionados[4]} onChange={handleChange} value={4} diaSemana="Quinta" />
      <Label checked={diasSelecionados[5]} onChange={handleChange} value={5} diaSemana="Sexta" />
      <Label checked={diasSelecionados[6]} onChange={handleChange} value={6} diaSemana="Sábado" />
    </div>
  );
};

export default DiasTrabalho
