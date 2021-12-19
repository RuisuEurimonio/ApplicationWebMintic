import react from 'react';

export default class HaveData extends react.Component {
    render() {
        return (
                <thead>
                    <tr>
                        <th> Identificación </th>   
                        <th> Nombre </th>
                        <th> Cumpleaños </th>
                        <th> Mes cumple </th>
                        <th> Correo </th>
                        <th> Zona </th>
                        <th> Tipo </th>
                        <th> Opciones </th>
                    </tr>
                </thead>    
        )
    }
}