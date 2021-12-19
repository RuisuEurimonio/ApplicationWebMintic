import react from 'react';;

export default class NotData extends react.Component {
    constructor(props){
        super(props);
        this.state={
            text: this.props.value,
        }
    }
    render(){
        return (
                <thead>
                    <tr>
                        <th> Sin datos </th>   
                    </tr>
                    <tr>
                        <td> No hay {this.state.text} </td>
                    </tr>
                </thead>    
        )
    }
}