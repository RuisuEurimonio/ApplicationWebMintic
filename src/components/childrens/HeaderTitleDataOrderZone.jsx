import react from 'react';


export default class HaveDataOrderZone extends react.Component {
    render() {
        return (
                <thead>
                    <tr>
                        <th> Identificación. </th>
                        <th> Nombre. </th>
                        <th> E-mail. </th>   
                        <th> Fecha. </th>   
                        <th> No. Pedido. </th>
                        <th> Estado. </th>
                        <th> Detalle. </th>
                    </tr>
                </thead>    
        )
    }
}