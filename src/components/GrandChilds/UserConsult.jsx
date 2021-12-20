import React, {Component} from 'react';
import axios from 'axios';
import HaveData from '../childrens/HeaderTitleData'
import NotData from '../childrens/HeaderTitleNotData';
import swal from 'sweetalert2';
import '../../css/normalize.css';
import '../../css/form.css';

const url = "localhost";
//150.136.51.44

const urlBase = `http://${url}:8080/api/`;


export default class UserAll extends Component{
    constructor(props) {
        super(props)
        this.state={
            items: [], 
            data:[],
            text: '',
            nullForm: false,
            haveData: false,
            modalOpen: false,
            updateModal: false,
            modalAlert: false,
            emailExist: false,
            form:{
                "id": '',
                "identification": '',
                "name": '',
                "birthtDay": '',
                "monthBirthtDay": '',
                "address": '',
                "cellPhone": '',
                "email": '',
                "password": '',
                "zone": '',
                "type": ''
            },
        }
    }

    getUsers=()=>{
        let mounth = sessionStorage.getItem("birthDay")
        axios.get(urlBase+"user/birthday/"+mounth).then(response=>{
            this.setState({data: response.data});
            if(response.data.length === 0){
                this.setState({haveData: false})
            } else {
                this.setState({haveData: true})
            }
            console.log(response.data)
            console.log(this.state.form)
            swal.fire({
                title: "Consultado!",
                text: `Se ha realizado la busqueda de los usuarios que cumplen el mes ${mounth}`,
                icon: "info"
            })
        }).catch(error=>{
            console.log("Error: "+error)
        })
        sessionStorage.removeItem("birthDay")
    }
    
    cleanUser=()=>{
        this.setState({
            form:{
                id: '',
                identification: '',
                name: '',
                birthtDay: '',
                monthBirthtDay: '',
                address: '',
                cellPhone: '',
                email: '',
                password: '',
                zone: '',
                type: ''
            }
        })
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
         this.setState((prevState) => ({
            form: {
                ...prevState.form,
                [name]: value
            }
        }));
    };

    componentDidMount(){
        this.getUsers();
    }

    render(){
        return(
            <div className="container-content">
                    <div className="content">
                        <h1 className="title fs-1"> Usuarios. </h1>
                            <div id="userTable" className="userTable table-responsive">
                                <table border="1" className="table table-dark table-striped">
                                    {this.state.haveData ? <HaveData/> : <NotData value={"usuarios registrados."}/>}
                                    <tbody>
                                        {this.state.data.map(user=>{
                                            let birthtDay;
                                            let identification = user.identification;
                                            let zone = user.zone;
                                            let monthBirthtDay = user.monthBirthtDay;
                                            let type = user.type;
                                            if(user.birthtDay == null){
                                                birthtDay = "No hay datos.";
                                            } else {
                                                birthtDay = user.birthtDay.substring(0,10);
                                            }
                                            if(user.monthBirthtDay == null){
                                                monthBirthtDay = "No hay datos.";
                                            }
                                            if(user.identification == null){
                                                identification = "No hay datos";
                                            }
                                            if(user.zone == null){
                                                zone = "No hay datos";
                                            }
                                            if(user.type == null || user.type === undefined || user.type === "" ){
                                                type = "Invitado";
                                            }
                                            return(
                                                <tr key={user.id}>
                                                    <td>{identification}</td>
                                                    <td>{user.name}</td>
                                                    <td>{birthtDay}</td>
                                                    <td>{monthBirthtDay}</td>
                                                    <td>{user.email}</td>
                                                    <td>{zone}</td>
                                                    <td>{type}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>

                                
                            </div>
                            <div className="button-add" id="button_add-container">
                                <div className="container_button-add">
                                    <button className="btn btn-primary text button_Add" type="button" onClick={()=>{this.setState({nullForm: true}); this.setState({updateModal: false}); this.modalOpen()}}>Agregar usuarios.</button>
                                </div>
                            </div>
                        </div>
                </div>
        )
    }

}