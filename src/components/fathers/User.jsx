import React, {Component} from 'react';
import Nav from '../childrens/Nav';
import Arrow from '../childrens/Arrow';
import Profile from '../childrens/Profile'
import Footer from '../childrens/Footer';
import swal from 'sweetalert2';
import { Outlet } from 'react-router-dom';
import '../../css/normalize.css';
import '../../css/form.css';

export default class UserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [], 
            data:[],
            text: '',
            haveData: false,
            birthDayBoolean: false,
            input:{
                birthDay: ""
            }
        };
    }

    allIsClicked=()=>{
        this.setState({birthDayBoolean: false});
        document.location.pathname = "/user/all"
        this.cleanInput();
    }

    birthDayIsClicked=()=>{
        this.setState({birthDayBoolean: !this.state.birthDayBoolean});
        this.cleanInput();
        console.log(this.state)
    }

    searchBirthDay=()=>{
        if(this.state.input.birthDay < 0 || this.state.input.birthDay > 12){
            swal.fire({
                title: "Upss!!",
                text: "No se puede ingresar numeros negativos.",
                icon: "error",
                timer: "2000"
            })
        }else{
            sessionStorage.setItem("birthDay", this.state.input.birthDay)
            document.location.pathname = "User/birthDay"
        }
    }

    cleanInput=()=>{
        this.setState({
            input:{
                birthDay: "",
            }
        })
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
         this.setState((prevState) => ({
            input: {
                ...prevState.form,
                [name]: value
            }
        }));
    };
    
    componentDidMount(){
        let token = sessionStorage.getItem("token");
        if(!token){
            swal.fire({
                title: "Lo lamentamos!",
                icon: "error",
                text: "Necesita iniciar sesión para poder ingresar",
                showConfirmButton: true,
            }).then((result)=>{
                if(result.isConfirmed){
                    document.location.pathname = "/";
                }else{
                    document.location.pathname = "/";
                }
            })
        }
    }
    
    render(){
        
        return(
            <div className="container-body-total">
                <Arrow />            
                <Nav value={"user"}/>
                <Profile/>

                <div className="container-content">
                    <div className="content">
                        <h1 className="title fs-1"> Opciones de consulta. </h1>
                            <div id="productTable" className="productTable table-responsive">  
                            </div>
                            <div id="button_add-container" style={{justifyContent: 'center'}}>
                                <div className="container_button-add" style={{display: 'flex', alignItems: "center", justifyContent: "center", flexWrap: "wrap"}}>
                                    <button className="btn btn-primary text button_Add" type="button" style={{margin: ".1rem"}} onClick={()=>{this.allIsClicked()}}>Todos los usuarios.</button>
                                    <button className="btn btn-primary text button_Add" type="button" style={{margin: ".1rem"}} onClick={()=>{this.birthDayIsClicked()}}>Por mes de cumpleaños.</button>
                                </div>
                               {this.state.birthDayBoolean && (
                                    <div style={{display: 'flex', width: "70%", margin: "auto", alignItems: "flex-end"}}>
                                        <div style={{width: "80%", margin: "auto"}}>
                                                <label htmlFor="birthDay" className="form-label subtitle fs-4">Mes de cumpleaños.</label>
                                                    <input
                                                        required 
                                                        className="form-control" 
                                                        type="number" 
                                                        name="birthDay" 
                                                        id="birthDay"
                                                        onChange={this.handleChange} 
                                                        value={this.state.input.birthDay}
                                                    />
                                        </div>
                                        <button className="btn btn-primary text button_Add btn-sm" type="button" style={{margin: ".1rem", height: "fit-content", padding: ".7rem"}} onClick={()=>{this.searchBirthDay()}}>Buscar.</button>
                                    </div>
                                )}
                            </div>
                    </div>
                </div>

                <Outlet/>
                
                <Footer />
            </div>
        )
    }
}
