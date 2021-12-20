import react from 'react';
import Nav from '../../components/childrens/Nav'
import Footer from '../../components/childrens/Footer';
import Profile from '../../components/childrens/Profile';
import swal from 'sweetalert2'
import { Outlet } from 'react-router-dom';

export default class OrderZone extends react.Component{
    constructor(props){
        super(props);
        this.state={
            data: [],
            items:[],
            nowStatus: "",
            date: "",
            status: "",
            dateBoolean: false,
            statusBoolean: false,
            inputs:{
                date: "",
                status: "",
            }
        }
    }

    prueba=()=>{
        console.log(this.state)
    }

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

    searchStatus=()=>{
        console.log(this.state)
        if(this.state.inputs.status.length === 0){
            swal.fire({
                title:"Ups!!!",
                text:"Se te olvido ingresar los datos, vuelve a intentarlo.",
                icon:"info",
                timer:"2000"
            })
        }else{
            sessionStorage.setItem("status", this.state.inputs.status)
            document.location.pathname = "Orders/zone/status";
        }
    }

    searchDate=()=>{
        if(this.state.inputs.date.length === 0){
            swal.fire({
                title:"Ups!!!",
                text:"Se te olvido ingresar los datos, vuelve a intentarlo.",
                icon:"info",
                timer:"2000"
            })
        }else{
            sessionStorage.setItem("date", this.state.inputs.date)
            document.location.pathname = "Orders/zone/date";
        }
    }

    stateIsClicked=()=>{
        this.setState({statusBoolean: !this.state.statusBoolean});
        this.setState({dateBoolean: false,})
    }

    iIsClicked=()=>{
        this.setState({statusBoolean: false,dateBoolean: false,})
        document.location.pathname = "/Orders/zone/salesMan"
    }

    allIsClicked=()=>{
        this.setState({statusBoolean: false,dateBoolean: false,})
        document.location.pathname = "/Orders/zone/all"
    }

    dateIsClicked=()=>{
        this.setState({dateBoolean: !this.state.dateBoolean});
        this.setState({statusBoolean: false})
    }

    allOrders=()=>{
        document.location.pathname = "/Orders/zone/all";
    }

    handleChange=(event)=>{
        let button = event.target.name;
        let value = event.target.value;
        this.setState((prevState)=>({
            inputs: {
                ...prevState.inputs,
                [button]: value
            }   
        }))
        console.log(this.state)
    }

    render(){
        return(
            <div className="container-body-total">   
            <Nav />
            <Profile />
            <br/>
            <div className="container-content">
                    <div className="content">
                        <h1 className="title fs-1"> Opciones de consulta. </h1>
                            <div id="productTable" className="productTable table-responsive"></div>
                            <div id="button_add-container" style={{justifyContent: 'center'}}>
                                <div className="container_button-add" style={{display: 'flex', alignItems: "center", justifyContent: "center",  flexWrap: "wrap"}}>
                                    <button className="btn btn-primary text button_Add" type="button" style={{margin: ".1rem"}} onClick={()=>{this.allIsClicked()}}>Todas las ordenes.</button>
                                    <button className="btn btn-primary text button_Add" type="button" style={{margin: ".1rem"}} onClick={()=>{this.iIsClicked()}}>Mis ordenes.</button>
                                    <button className="btn btn-primary text button_Add" type="button" style={{margin: ".1rem"}} onClick={()=>{this.dateIsClicked()}}>Por fecha.</button>
                                    <button className="btn btn-primary text button_Add" type="button" style={{margin: ".1rem"}} onClick={()=>{this.stateIsClicked()}}>Por estado.</button>
                                </div>
                                {this.state.statusBoolean && (
                                    <div style={{display: 'flex', width: "70%", margin: "auto", alignItems: "flex-end"}}>
                                        <div style={{width: "80%", margin: "auto"}}>
                                            <label htmlFor="status" className="form-label subtitle fs-4"> Estado. </label>
                                            <select className="form-select" id="status" name="status" required onChange={this.handleChange} defaultValue={this.state.inputs.status}>
                                                <option value="" disabled>Seleccione un estado.</option>
                                                <option value="Pendiente">Pendiente.</option>
                                                <option value="Aprobado">Aprobado.</option>
                                                <option value="Rechazado">Rechazado.</option>
                                            </select>
                                        </div>
                                        <button className="btn btn-primary text button_Add btn-sm" type="button" style={{margin: ".1rem", height: "fit-content", padding: ".7rem"}} onClick={()=>{this.searchStatus()}}>Buscar.</button>
                                    </div>
                                    )
                                }
                                {this.state.dateBoolean && (
                                    <div style={{display: 'flex', width: "70%", margin: "auto", alignItems: "flex-end"}}>
                                        <div style={{width: "80%", margin: "auto"}}>
                                                <label htmlFor="date" className="form-label subtitle fs-4">Fecha.</label>
                                                    <input
                                                        required 
                                                        className="form-control" 
                                                        type="date" 
                                                        name="date" 
                                                        id="date"
                                                        onChange={this.handleChange} 
                                                        value={this.state.inputs.date}
                                                    />
                                        </div>
                                        <button className="btn btn-primary text button_Add btn-sm" type="button" style={{margin: ".1rem", height: "fit-content", padding: ".7rem"}} onClick={()=>{this.searchDate()}}>Buscar.</button>
                                    </div>
                                )}
                            </div>
                    </div>
                </div>
                <br/>
            <Outlet />
            <Footer/>
            </div>
        )
    }
}