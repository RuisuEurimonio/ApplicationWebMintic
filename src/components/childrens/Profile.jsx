import axios from 'axios';
import react from 'react';

const url = "localhost";
//150.136.51.44

const urlBase = `http://${url}:8080/api/`;

export default class Profile extends react.Component{
    constructor(props){
        super(props);
        this.state = {
            items: [],
            data: [],
            haveData: ""
        }
    }

    componentDidMount(){
        this.getDatas()
    }

    getDatas = () => {
        let id = sessionStorage.getItem("id");
        axios.get(urlBase+"user/"+id).then(response=>{
            this.setState({data: response.data});
            if(response.data.length === 0){
                this.setState({haveData: false})
            } else {
                this.setState({haveData: true})
            }
        }).catch(error => {
            console.log("Error: "+error);
        })
    }

    render(){
        let state = this.state.data;
        let identification = state.identification;
        let perfil = state.type;
        let zone = state.zone;
        let name = state.name;
        let email = state.email
            if(identification == null){
                identification = "No hay datos";
            }
            if(perfil == null || perfil === undefined || perfil === ""){
                perfil = "Invitado";
            }
            if(zone == null){
                zone = "No hay datos";
            }
            if(name == null){
                name = "No hay datos";
            }
            if(email == null){
                email = "No hay datos";
            }
        return(
            <header className="header-container"> 
                <div className="sub-container">
                    <h3 className="title js-5"> Mi perfil. </h3>
                    <div className="table-container table-responsive" id="profile">
                        <table border="1" className="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th> Identificación </th>   
                                    <th> Nombre </th>
                                    <th> Correo </th>
                                    <th> Zona </th>
                                    <th> Tipo </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td> {identification} </td>
                                    <td> {name} </td>
                                    <td> {email} </td>
                                    <td> {zone} </td>
                                    <td> {perfil} </td>
                                </tr>                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </header>
        )
    }
}