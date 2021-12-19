import react from 'react';
import Arrow from '../childrens/Arrow';
import Nav from '../childrens/Nav';
import HaveData from '../childrens/HeaderTitleDataProductsList'
import NotData from '../childrens/HeaderTitleNotData';
import Footer from '../childrens/Footer'
import swal from 'sweetalert2'
import axios from 'axios'

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

function cleanTable(){
    let checks = document.querySelectorAll(".checkbox");
    let inputs = document.querySelectorAll(`.input-request`)
    let num2 = inputs.length
    let num = checks.length;
    for( let i = 0 ; i < num ; i++){
        checks[i].checked = false;
    }
    for(let i = 0 ; i < num2 ; i++){
        inputs[i].value = "";
        inputs[i].disabled = "true";
    }
}

function inputTrue(id) {
    let input = document.getElementById(id);
    input.disabled = false;
}

function inputFalse(id){
    let input = document.getElementById(id);
    input.disabled = true;
    input.value = "";
}

let date = new Date();
let dateNow = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

export default class Orders extends react.Component{
    constructor(props){
        super(props)
        this.state={
            items: [],
            data: [],
            checkbox: {},
            form: {
                "id": "",
                "registerDay": "",
                "status": "",
                "salesMan": {
                    "id": "",
                    "identification": "",
                    "name": "",
                    "birthtDay": "",
                    "monthBirthtDay": "",
                    "address": "",
                    "cellPhone": "",
                    "email": "",
                    "password": "",
                    "zone": "",
                    "type": ""
                },
                "products": {},
                "quantities": {}
            },
            salesMan: {
                id:"",
                identification: "",
                name: "",
                birthtDay: "",
                monthBirthtDay: "",
                address: "",
                cellPhone: "",
                email: "",
                password: "",
                zone: "",
                type: "",
            },
            id: ""
        }
    }

    postOrder = (dateNow, products, quantities)=>{
        let body ={
            id: this.state.id,
            registerDay: dateNow,
            status: "Pendiente",
            salesMan: this.state.salesMan,
            products: products,
            quantities: quantities
        }
        axios.post(urlBase+"order/new", body).then(res =>{
            cleanTable();
            setTimeout(() => {
                this.goodRequest(this.state.id - 1);
            },2000);
            this.getIdOrder();
        })
    }

    goodRequest = (idOrder) =>{
        swal.fire({
            title: "Confirmado.",
            text: "Orden cargada con el id "+ idOrder +"!",
            timer: "2000"
        })
    }

    handleCheckChange = (event)=>{
        let target= event.target;
        let ref = target.id
        let reference = ref.slice(6)
        if(target.checked){
            inputTrue(reference)
        }else{
            inputFalse(reference)
        }
    }

    getUser=()=>{
        let id = sessionStorage.getItem("id");
        axios.get(urlBase+"user/"+id).then(res=>{
            this.setState({
                salesMan: {
                    id:res.data.id,
                    identification: res.data.identification,
                    name: res.data.name,
                    birthtDay: res.data.birthtDay,
                    monthBirthtDay: res.data.monthBirthtDay,
                    address: res.data.address,
                    cellPhone: res.data.cellPhone,
                    email: res.data.email,
                    password: res.data.password,
                    zone: res.data.zone,
                    type: res.data.type
                }
            })
        }).catch(error=>{
            console.log("Error: "+error)
        })
    }

    getIdOrder = ()=>{
        axios.get(urlBase+"order/all").then(res=>{
            let idOrder = res.data.length + 1;
            this.setState({id: idOrder});
        }).catch(error=>{
            console.log("Error: "+error)
        })
    }

    seeOrders=()=>{
        let type = sessionStorage.getItem("type");
        let zone = sessionStorage.getItem("zone");
        if(type === "Administrador" || type === "Coordinador de zona" || type === "Asesor comercial"){
            swal.fire({
                title:"Consultando. . .",
                text: "Estamos buscando las ordenes de la zona "+zone,
                icon: "info",
                timer: "2000"
            })
            setTimeout(() => {
                document.location.pathname = "/Orders/zone/all"
            }, 2100);
        }else{
            swal.fire({
                title: "Lo sentimos",
                text: "No tienes los permisos suficientes (Admin/Coord)",
                icon: "error",
                timer: "2000"
            })
        }
    }


    makeBody=()=>{
        let type = sessionStorage.getItem("type");
        if(type === "Administrador" || type === "Asesor comercial"){
            
            let products = {};
            let quantities = {};
            
            let adds = document.querySelectorAll(".checkbox");
            let num = adds.length;
            
            let accept = false;
            let validate = false;
                
            for(let i = 0 ; i < num ; i++) {
                var presionado = adds[i].checked;
                if(presionado){
                    accept = true;
                    let xd = adds[i].value;
                    let data = xd.split(',');
                    let reference = data[0];
                    let brand = data[1];
                    let category = data[2];
                    let description = data[3];
                    let price = data[4];
                    let availability = data[5];
                    let quantity = data[6];
                    let photography = data[7];
                    let body = {
                        reference: reference,
                        brand: brand,
                        category: category,
                        description: description,
                        price: price,
                        availability: availability,
                        quantity: quantity,
                        photography: photography
                    }
                    
                    products[`${data[0]}`] = body;
                    let count = document.getElementById(`${reference}`).value
                    if(count === ""){
                        this.alertValidate("Hay campos vacíos!")
                        validate = false;
                        break;
                    } else {
                        if(parseInt(count) <= parseInt(data[6])){
                            quantities[`${data[0]}`]= count;
                            validate = true;
                        } else {
                            this.alertValidate("Cantidad maxima superada!")
                            validate = false;
                            break;
                        }
                    }
                }
            }
            if(!accept){
                this.alertValidate("No hay productos seleccionados.")
            } else if (!validate){    
            } else {
                swal.fire({
                    title: "Hecho!",
                    text:"Enviando datos . . .",
                    icon:"success",
                    timer: "2000"
                })
                this.postOrder(dateNow, products, quantities);
            }
        }else{
            swal.fire({
                title: "Lo sentimos",
                text: "No tienes los permisos suficientes (Admin/Ase)",
                icon: "error",
                timer: "2000"
            })
        }
        
    }

    alertValidate=(text)=>{
        Toast.fire({icon: "error", text: text});
    }

    getProducts = ()=>{
        axios.get(urlBase+"peripherals/all").then(response=>{
            this.setState({data: response.data});
            if(response.data.length === 0){
                this.setState({haveData: false});
            } else{
                this.setState({haveData: true});
            }
        }).catch(error=>{
            console.log("Error: "+error)
        })
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
        this.getProducts();
        this.getUser();
        this.getIdOrder();
    }

    render(){
        return(
            <div className="container-body-total">
                <Arrow />            
                <Nav value={"order"}/>

                <div className="container-content">
                    <div className="content">
                        <h1 className="title fs-1"> Carrito. </h1>
                            <div id="productTable" className="productTable table-responsive">

                                <table border="1" className="table table-dark table-striped">
                                    {this.state.haveData ? <HaveData/> : <NotData value={"productos registrados."}/>}
                                        <tbody>
                                            {this.state.data.map(product=>{
                                                 let productArray = [];
                                                 productArray.push(product.reference)
                                                 productArray.push(product.brand)
                                                 productArray.push(product.category)
                                                 productArray.push(product.description)
                                                 productArray.push(product.price)
                                                 productArray.push(product.availability)
                                                 productArray.push(product.quantity)
                                                 productArray.push(product.photography)
                                                return(
                                                    <tr key={product.reference}>
                                                        <td>{product.availability? <input className="form-check-input mt-0 checkbox" id={"input-"+product.reference} type="checkbox" value={productArray} onChange={this.handleCheckChange}/> : <p> No disponible </p>}</td>
                                                        <td> <img src={product.photography} alt={product.reference} /></td>
                                                        <td>{product.reference}</td>
                                                        <td>{product.brand}</td>
                                                        <td>{product.category}</td>
                                                        <td>{product.description}</td>
                                                        <td>{product.price}</td>
                                                        <td> <input className="input-group-text input-request" id={product.reference} type="number" min="1" max={product.quantity} placeholder={"max "+product.quantity} disabled/> </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                </table>
                            </div>
                            <div className="button-add" id="button_add-container">
                                <div className="container_button-add">
                                    <button className="btn btn-primary text button_Add" type="button" style={{margin: ".1rem"}} onClick={()=>{this.seeOrders()}}>ver Ordenes.</button>
                                    <button className="btn btn-primary text button_Add" type="button" style={{margin: ".1rem"}} onClick={()=>{this.makeBody()}}>Enviar orden.</button>
                                </div>
                            </div>
                    </div>
                </div>

                <Footer/>

            </div>
        )
    }
}
