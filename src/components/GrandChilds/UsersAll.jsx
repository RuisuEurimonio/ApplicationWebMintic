import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
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

const Toast = swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 6000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', swal.stopTimer)
        toast.addEventListener('mouseleave', swal.resumeTimer)
      }
})

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
        axios.get(urlBase+"user/all").then(response=>{
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
                text: `Mostrando todos los usuarios. `,
                icon: "info"
            })
        }).catch(error=>{
            console.log("Error: "+error)
        })

    }

    postUser=async ()=>{
        await axios.post(urlBase+"user/new", this.state.form).then(response=>{
            this.modalOpen();
            this.getUsers();
            this.cleanUser();
             this.goodRequest();
            this.setState({nullForm: false})
            console.log(response.data)
        }).catch(error=>{
            console.log("Error: "+error)
        })
    }

    putUser=()=>{
        axios.put(urlBase+"user/update", this.state.form).then(response=>{
            this.modalOpen();
            this.getUsers();
            this.cleanUser();
            this.goodRequest();
            console.log(response.data);
            sessionStorage.removeItem("zone")
            sessionStorage.setItem("zone", response.data.zone);
        }).catch(error=>{
            console.log("Error: "+error)
        })
    }

    deleteUser=()=>{
        axios.delete(urlBase+"user/"+this.state.form.id).then(response=>{
            this.setState({modalAlert: false});
            this.getUsers();
            this.cleanUser();
        }).catch(error=>{
            console.log("Error: "+error)
        })
    }

    acceptDelete = (nombre,email) => {
        swal.fire({
            title: "Eliminar usuario",
            text: "¿Esta seguro de eliminar a " + nombre+"?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'cancelar!',
        }).then(respuesta=>{
            if(respuesta.isConfirmed){
                let id = sessionStorage.getItem("id")
                axios.get(urlBase+"user/"+id).then(response=>{
                    console.log(response.data.email)
                    if(email !== response.data.email){
                        this.deleteUser();
                        swal.fire({
                            title: "Usuario eliminado!",
                            text: nombre+" ha sido eliminado.",
                            icon: "success",
                            timer: "2000"
                        })
                    }else{
                        this.cleanUser()
                        swal.fire({
                            title: "Cancelado!",
                            text: "No puedes eliminar tu usuario.",
                            icon: "error",
                            timer: "2000"
                        })
                    }
                }).catch(error => {
                    console.log("Error: "+error);
                })
            }else{
                swal.fire({
                    title: "Cancelado!",
                    text: nombre +" no ha sido eliminado.",
                    icon: "info",
                    timer: "2000"
                })
            }
        })
    }

    validateInputs = () =>{
        let form = this.state.form;
        console.log(this.state.nullForm)
        console.log(form.type.length)
        if(form.identification.length === 0 || form.birthtDay.length === 0 
            || form.monthBirthtDay.length === 0 || form.name.length === 0 
            || form.address.length === 0 || form.cellPhone.length === 0 
            || form.email.length === 0 || form.password.length === 0 
            || form.zone.length === 0){
            this.alertValidate("Existen campos vacíos");
        } else if(this.state.updateModal === false && form.type.length === 0){
            this.alertValidate("Existen campos vacíos");
        } else if (form.identification.length < 4 || form.identification.length > 14) {
            this.alertValidate("La identicación debe tener mínimo 4 caracteres y maximo 14");
            this.setState((prevState) => ({form: {...prevState.form,identification: ""}}));
        } else if (form.name.length < 3  || form.name.length > 80 ) {
            this.alertValidate("El nombre debe tener minimo 3 caracteres y maximo 80.");
            this.setState((prevState) => ({form: {...prevState.form,name: ""}}));
        } else if (form.monthBirthtDay < 1 || form.monthBirthtDay > 12){
            this.alertValidate("El mes corresponde al numero de mes, donde enero es 1 y diciembre 12");
            this.setState((prevState) => ({form: {...prevState.form,monthBirthtDay: ""}}));
        } else if (form.address.length < 4){
            this.alertValidate("La direccion debe tener minimo 4 caracteres.");
            this.setState((prevState) => ({form: {...prevState.form,address: ""}}));
        } else if (form.cellPhone.length < 8){
            this.alertValidate("El telefono debe tener minimo 8 caracteres numericos.");
            this.setState((prevState) => ({form: {...prevState.form,cellPhone: ""}}));
        } else if(form.password.length < 4){
            this.alertValidate("La contrasela debe tener minimo 4 caracteres.");
            this.setState((prevState) => ({form: {...prevState.form,password: ""}}));
        } else {
            if(this.validateEmailOk(form.email)){
                let id = this.state.data.length;
                this.emailExist(form.email,id);
            } else{
                this.alertValidate("El correo no es valido!");
                this.setState((prevState) => ({form: {...prevState.form,email: ""}}));
            }
        }
    }

    validateEmailOk = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    emailExist = (email) => {
        axios.get(urlBase+"user/emailexist/"+email).then(res =>{
            this.validateEmail(res.data)
        }).catch(error => {
            console.log("Error: "+error);
        })
    }

    validateEmail = (data) => {
        if(!this.state.updateModal){
            if(data){
                this.alertValidate("El correo ya esta en uso!");
                this.setState((prevState) => ({form: {...prevState.form, email: ""}}));
            }else{
                this.postUser();
            }
        }else{
            let id = this.state.form.id;
            axios.get(urlBase+"user/"+id).then(res2 =>{
                if(res2.data.email !== this.state.form.email){
                    if(data){
                        this.alertValidate("El correo ya esta en uso!");
                        this.setState((prevState) => ({form: {...prevState.form, email: ""}}));
                    }else{
                        this.putUser();
                    }
                }else{
                    this.putUser();
                }
            }).catch(error => {
                console.log("Error: "+error);
            })
        }
    }

    alertValidate = (text) =>{
        Toast.fire({icon: "error", text: text})
    }

    goodRequest = () =>{
        swal.fire({
            title: "Confirmado.",
            text: "Datos cargados!",
            timer: "2000"
        })
    }

    userSelected=(user)=>{
        let identification = user.identification;
        let birthtDay = user.birthtDay;
        let monthBirthtDay = user.monthBirthtDay;
        let address = user.address;
        let cellPhone = user.cellPhone;
        let zone = user.zone;
        let type = user.type;
        if(user.birthtDay !== null){
            birthtDay = user.birthtDay.substring(0,10);
        }else{
            birthtDay = "";
        }
        if(identification === null){
            identification = "";
        }
        if(monthBirthtDay === null){
            monthBirthtDay = "";
        }
        if(address === null){
            address = "";
        }
        if(cellPhone === null){
            cellPhone = "";
        }
        if(zone === null){
            zone = "";
        }
        if(type === null){
            type = "";
        }

        this.setState({
            updateModal: true,
            form: {
                id: user.id,
                identification: identification,
                name: user.name,
                birthtDay: birthtDay,
                monthBirthtDay: monthBirthtDay,
                address: address,
                cellPhone: cellPhone,
                email: user.email,
                password: user.password,
                zone: zone,
                type: type,
            }
        })
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

    modalOpen=()=>{
        this.setState({modalOpen: !this.state.modalOpen});
    }

    handleSubmit = e => {
        e.preventDefault();
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
        const {form} = this.state;
        let birthtDay = form.birthtDay
        if(birthtDay !== null){
            birthtDay = form.birthtDay.substring(0,10);
        }
        let input = "mb-3 div_container-input center"
        if(this.state.updateModal){
            input="mb-3 div_container-input center invisible"
        }
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
                                                    <td>
                                                        <div className="buttons-table">
                                                            <button className="btn btn-danger text" type="button" onClick={()=>{this.userSelected(user); this.acceptDelete(user.name, user.email)}}> Eliminar </button> 
                                                            {"   "}
                                                            <button className="btn btn-primary text" type="button" onClick={()=>{this.userSelected(user); this.modalOpen(); this.setState({nullForm: true})}}> Actualizar </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                <Modal className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg" isOpen={this.state.modalOpen}>
                                    <ModalHeader style={{display: 'block'}}>
                                        <div>
                                            <h2> Guardar Usuario. </h2>
                                        </div>
                                    </ModalHeader>
                                    <ModalBody>
                                        <form className="was-validated formulario modal-body" style={{width: '100%'}} onSubmit={this.handleSubmit}>
                                            <div className="mb-3 div_container-input invisible">
                                                <label htmlFor="id" className="form-label subtitle fs-4">ID.</label>
                                                <input 
                                                    readOnly 
                                                    required
                                                    className="form-control" 
                                                    type="number" 
                                                    name="id" 
                                                    id="id" 
                                                    placheholder="id"
                                                    disabled 
                                                    onChange={this.handleChange} 
                                                    value={this.state.nullForm? form.id : this.state.data.length+1}
                                                />
                                            </div>
                                            <div className="mb-3 div_container-input">
                                                <label htmlFor="identification" className="form-label subtitle fs-4">Identificación.</label>
                                                <input 
                                                    required
                                                    className="form-control" 
                                                    type="text" 
                                                    name="identification" 
                                                    id="identification" 
                                                    placheholder="Ej: 20023664567"
                                                    onChange={this.handleChange} 
                                                    value={form.identification}
                                                />
                                            </div>
                                            <div className="mb-3 div_container-input">
                                                <label htmlFor="name" className="form-label subtitle fs-4">Nombre.</label>
                                                <input
                                                    required 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="name" 
                                                    id="name"
                                                    placheholder="Ej: Alfredo"
                                                    onChange={this.handleChange} 
                                                    value={form.name}
                                                />
                                            </div>
                                            <div className="mb-3 div_container-input">
                                                <label htmlFor="birthtDay" className="form-label subtitle fs-4">Cumpleaños.</label>
                                                <input
                                                    required 
                                                    className="form-control" 
                                                    type="date" 
                                                    name="birthtDay" 
                                                    id="birthtDay"
                                                    onChange={this.handleChange} 
                                                    value={birthtDay}
                                                />
                                            </div>
                                            <div className="mb-3 div_container-input">
                                                <label htmlFor="monthBirthtDay" className="form-label subtitle fs-4">Mes cumpleaños.</label>
                                                <input
                                                    required 
                                                    className="form-control" 
                                                    type="number" 
                                                    name="monthBirthtDay" 
                                                    id="monthBirthtDay" 
                                                    placheholder="Ej: 10"
                                                    onChange={this.handleChange} 
                                                    value={form.monthBirthtDay}
                                                />
                                            </div>
                                            <div className="mb-3 div_container-input">
                                                <label htmlFor="address" className="form-label subtitle fs-4">Direccion.</label>
                                                <input
                                                    required 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="address" 
                                                    id="address" 
                                                    placheholder="Ej: Ej: Cr 7"
                                                    onChange={this.handleChange} 
                                                    value={form.address}
                                                />
                                            </div>
                                            <div className="mb-3 div_container-input">
                                                <label htmlFor="cellPhone" className="form-label subtitle fs-4">Telefono.</label>
                                                <input
                                                    required 
                                                    className="form-control" 
                                                    type="text" 
                                                    name="cellPhone" 
                                                    id="cellPhone" 
                                                    placheholder="Ej: 3114567845"
                                                    onChange={this.handleChange} 
                                                    value={form.cellPhone}
                                                />
                                            </div>
                                            <div className="mb-3 div_container-input">
                                                <label htmlFor="email" className="form-label subtitle fs-4">Correo.</label>
                                                <input
                                                    required 
                                                    className="form-control" 
                                                    type="email" 
                                                    name="email" 
                                                    id="email" 
                                                    placheholder="Ej: Ej: Correo@correo.com"
                                                    onChange={this.handleChange} 
                                                    value={form.email}
                                                />
                                            </div>
                                            <div className="mb-3 div_container-input">
                                                <label htmlFor="password" className="form-label subtitle fs-4">Contraseña.</label>
                                                <input
                                                    required 
                                                    className="form-control" 
                                                    type="password" 
                                                    name="password" 
                                                    id="password" 
                                                    onChange={this.handleChange} 
                                                    value={form.password}
                                                />
                                            </div>
                                            <div className="mb-3 div_container-input center">
                                                <div className="selected" style={{width: '100%'}}>
                                                    <label htmlFor="zone" className="form-label subtitle fs-4">Zona:</label>
                                                    <select className="form-select" id="zone" name="zone" required onChange={this.handleChange} defaultValue={ form.zone}>
                                                        <option disabled="disabled" value={""}>Selecciona una zona.</option>
                                                        <option value="Suroccidente">Suroccidente.</option>
                                                        <option value="Suroriente">Suroriente.</option>
                                                        <option value="Norte - Centro histórico">Norte - Centro histórico.</option>
                                                        <option value="Metropolitana">Metropolitana.</option>
                                                        <option value="Riomar">Riomar.</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className={input}  id="select-input">
                                                <div className="select" style={{width: '100%'}}>
                                                    <label htmlFor="type" className="form-label subtitle fs-4">Tipo usuario:</label>
                                                    <select className="form-select" id="type" name="type" required={this.updateModal? false : true} onChange={this.handleChange}  defaultValue={form.type}>
                                                        <option disabled="disabled" value="">Selecciona un tipo</option>
                                                        <option value="Coordinador de zona">Coordinador de zona.</option>
                                                        <option value="Asesor comercial">Asesor comercial.</option>
                                                        <option value="Administrador">Administrador.</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <ModalFooter style={{width: '100%', justifyContent: 'center'}}>
                                                <div className="container_footer-modal">
                                                    {this.state.updateModal ?
                                                        <button className="btn btn-primary footer_button" type="button" onClick={()=>this.validateInputs()}>Actualizar.</button> :
                                                        <button className="btn btn-primary footer_button" type="button" onClick={()=>this.validateInputs()}>Agregar.</button> 
                                                    }                               
                                                    <button className="btn btn-danger footer_button" type="button" style={{margin: ".1rem"}} onClick={()=>{this.modalOpen(); this.setState({nullForm: false}); this.cleanUser()}}>Cancelar.</button>
                                                </div>
                                            </ModalFooter>
                                        </form>
                                    </ModalBody>
                                </Modal>
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