import React from "react"

const Label = ({ checked, onChange, value, diaSemana }) => {

    return (
        <React.Fragment>

            <input  
                type="checkbox"
                value={value}
                checked={checked}
                onChange={onChange} 
            /> <label> {diaSemana}</label>
            <br></br>
        </React.Fragment>
    )
}

export default Label