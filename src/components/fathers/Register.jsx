import axios from 'axios';
import swal from 'sweetalert2'
import react from 'react';
import Img from '../../sources/welcome.png'

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


export default class Register extends react.Component{
    constructor(props){
        super(props);
        this.state={
            items: [],
            data: [],
            form: {
                email: "",
                name: "",
                password: "",
                repPassword: ""
            }
        }
    }

    postUser =()=>{
        axios.post(urlBase+"user/new",this.state.form).then(response=>{
            swal.fire({
                title: "Correcto!",
                text: "El usuario se ha registrado con exito",
                timer: "2400"
            })
            setInterval(() => {swal.fire("Redireccionando. . .")}, 2500);
            setInterval(() => {document.location.pathname = "/";}, 5000);
        }).catch(error=>{
            console.log("Error: "+error)
        })
    }

    validateInputs =()=>{
        let form=this.state.form;
        if(form.name.length === 0 || form.email.length === 0 || form.password.length === 0 || form.repPassword.length === 0){
            this.alertValidate("Hay campos vacios.")
        } else if (form.name.length < 3 || form.name.length > 80){
            this.alertValidate("El nombre debe tener minimo 3 caracteres y maximo 80");
            this.setState((prevState) => ({form: {...prevState.form,name: ""}}));
        } else if (form.password.length < 4) {
            this.alertValidate("La contraseña debe tener minimo 4 caracteres.");
            this.setState((prevState) => ({form: {...prevState.form,password: ""}}));
        } else if (form.password !== form.repPassword){
            this.alertValidate("Las contraseñas no son iguales.");
            this.setState((prevState) => ({form: {...prevState.form,repPassword: ""}}));
        } else {
            this.validateEmailOk(form.email);
        }
    }

    validateEmailOk=(email)=>{
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let confirm = re.test(String(email).toLowerCase());
        console.log(email)
        console.log(re.test(String(email).toLowerCase()))
        console.log(confirm)
        if(confirm){
        axios.get(urlBase+"user/emailexist/"+email).then(response=>{
            if(!response.data){
                this.postUser();
            } else {
                this.alertValidate("El correo ya esta en uso.")
                this.setState((prevState) => ({form: {...prevState.form, email: ""}}));
            }
        }).catch(error=>{
            console.log("Error: "+error)
        })
    }else{
            this.alertValidate("El correo tiene una estructura no valida.")
            this.setState((prevState)=> ({form: {...prevState.form, email: ""}}));
        }
    }
 
    alertValidate = (text) =>{
        Toast.fire({icon: "error", text: text})
    }

    handleChange = (event) =>{
        let name = event.target.name;
        let value = event.target.value;
        this.setState((prevState)=>({
            form: {
                ...prevState.form,
                [name]: value
            }
        }))
    }

    handleSubmit = (event) => {
        event.preventDefault();
    }

    render(){
        let form = this.state.form;
        return(
            <div className="login align-middle ">
            <div className="card">
                <div style={{textAlign: 'center'}}>
                    <img src={Img} className="card-img-top " alt="..."/>
                </div>
                <div className="card-body">
                    <h5 className="card-title title title-register h2"> - Register - </h5>
                    <div>
                        <form onSubmit={this.handleSubmit} className="was-validated formulario">
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
                                <label htmlFor="password" className="form-label subtitle fs-4">Contraseña.</label>
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
                            <div className="mb-3 div_container-input">
                                <label htmlFor="repPassword" className="form-label subtitle fs-4">Rep. contraseña.</label>
                                <input
                                    required 
                                    className="form-control" 
                                    type="password" 
                                    name="repPassword" 
                                    id="repPassword"
                                    placheholder="Ej: Alfredo"
                                    onChange={this.handleChange} 
                                    value={form.repPassword}
                                />
                            </div>
                            <div className="button-container">
                                <button type="submit" className="btn btn-primary text fs-6" onClick={this.validateInputs}>Enviar.</button>
                            </div>
                        </form>
                    </div>
                    <hr className="separator"/>
                    <div className="login-container">
                        <p className="text fs-6"> ¿Ya tiene una cuenta? </p>
                        <a href="/" className="btn btn-primary text fs-6"> Iniciar sesión. </a>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}