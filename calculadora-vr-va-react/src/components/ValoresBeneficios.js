import { useEffect, useState } from "react"

const ValoresBeneficios = ({onChangeBeneficios}) => {
    const [va, setVA] = useState(null)
    const [vr, setVR] = useState(null)


    useEffect(() => {
        onChangeBeneficios({va, vr})
    }, [onChangeBeneficios, va, vr])

    return (
        <div className="beneficios">
            <h2>Valores dos Benefícios</h2>
                <label>Vale Refeição (VR): R$</label>
                <br/>
                <input type="number" step="0.01" min="0" onChange={(e) => setVR(e.target.value)}></input>
                <br/>

                <label>Vale Alimentação (VA): R$</label>
                <br/>
                <input type="number" step="0.01" min="0" onChange={(e) => setVA(e.target.value)}></input>
                <br/>
        </div>
    )
}

export default ValoresBeneficios