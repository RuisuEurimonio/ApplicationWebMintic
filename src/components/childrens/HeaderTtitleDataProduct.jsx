import react from 'react';


export default class HaveDataProduct extends react.Component {
    render() {
        return (
                <thead>
                    <tr>
                        <th> Foto. </th>
                        <th> Nombre. </th>   
                        <th> Modelo. </th>   
                        <th> Categoria. </th>
                        <th> Descripción. </th>
                        <th> Precio. </th>
                        <th> Disponibilidad </th>
                        <th> Cantidad </th>
                        <th> Opciones </th>
                    </tr>
                </thead>    
        )
    }
}