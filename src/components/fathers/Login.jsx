import swal from 'sweetalert2';
import React from 'react';
import axios from "axios";
import Img from '../../sources/welcome.png';
import '../../css/normalize.css';
import '../../css/access.css';

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

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            items: [], 
            text: '',
            form: {
                id: "",
                identification: "",
                name: "",
                email: "",
                zone: "",
                type: "",
                password: "",
                repeatPassword: "",
                login: ""
            }
        };
    }

    validateInputs = () => {
        let form = this.state.form;
        if(form.email.length === 0 || form.password.length === 0){
            this.alertValidate("Existen campos vacíos.")
        } else {
            axios.get(urlBase+"user/emailexist/"+form.email).then(res=>{
                if(!res.data){
                    this.informationPopup("Ups!, ha sucedido un error.",`No se ha encontrado este correo registrado`, "error", "5000")
                    this.setState((prevState) => ({form: {...prevState.form,email: ""}}));
                    this.setState((prevState) => ({form: {...prevState.form,password: ""}}));
                } else {   
                    let email = form.email;
                    let password = form.password;
                    axios.get(urlBase+"user/"+email+"/"+password).then(response=>{
                        if(response.data.id === null || response.data.id === "undefined"){
                            this.informationPopup("Incorrecto!",`La contraseña es incorrecta`, "error", "2000")
                            this.setState((prevState) => ({form: {...prevState.form,password: ""}}));
                        } else{
                            this.informationPopup("Correcto!",`Has iniciado sesion ${response.data.name}`, "success", "1500")
                            this.saveUser(response);
                            console.log(response)
                            let login = sessionStorage.getItem("token");
                            if (login){
                                setInterval(() => {swal.fire("Iniciando sesión. . .")}, 1600)
                                setInterval(() => {document.location.pathname = "/Home"}, 3000)
                            } else {
                                swal.fire("Ha sucedido un error")
                            }
                        }
                    }).catch(error=>{
                        console.log("Error: "+error)
                    })
                }
            }).catch(error=>{
                console.log("Error: "+error)
            })
        }
    }

    saveUser = (response)=>{
        sessionStorage.setItem("id", response.data.id)
        sessionStorage.setItem("type", response.data.type)
        sessionStorage.setItem("zone", response.data.zone)
        sessionStorage.setItem("token", true)
    }

    informationPopup = (title, text, icon, timer) =>{
        swal.fire({
            title: title,
            text: text,
            icon: icon,
            timer: timer
        })  
    }

    alertValidate = (text) => {
        Toast.fire({icon: "error", text: text});
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState((prevState)=>({
            form: {
                ...prevState.form,
                [name]: value
            }
        }));
    }

    handleSubmit = (event) => {
        event.preventDefault();
    }

    clearSession = ( ) => {
        sessionStorage.clear();
    }

    render() {
        this.clearSession();
        let form = this.state.form;
        return (
            <div className="login">
                <div className="card">
                    <img src={Img} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h1 className="card-title title"> - Login - </h1>
                        <div>
                            <form className="was-validated formulario" onSubmit={this.handleSubmit}>
                                <div className="mb-3 div_container-input">
                                    <label htmlFor="email" className="form-label subtitle fs-4">Email.</label>
                                    <input
                                        required 
                                        className="form-control" 
                                        type="email" 
                                        name="email" 
                                        id="email"
                                        placheholder="Ej: Alfredo"
                                        onChange={this.handleChange} 
                                        value={form.email}
                                    />
                                </div>
                                 <div className="mb-3 div_container-input">
                                    <label htmlFor="password" className="form-label subtitle fs-4">Password.</label>
                                    <input
                                        required 
                                        className="form-control" 
                                        type="password" 
                                        name="password" 
                                        id="password"
                                        placheholder="Ej: Alfredo"
                                        onChange={this.handleChange} 
                                        value={form.password}
                                    />
                                </div>
                                <div className="button-container">
                                    <button type="submit" className="btn btn-primary text" onClick={()=>this.validateInputs()}>Enter</button>
                                </div>
                            </form>
                        </div>
                        <hr className="separator"/>
                        <div className="register">
                            <p className="text"> ¿No tienes una cuenta? </p>
                            <div >
                                <a href="register" className="btn btn-primary text"> Crear cuenta.</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;
