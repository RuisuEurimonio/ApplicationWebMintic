import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import swal from 'sweetalert2'
import react from 'react';
import HaveDataProduct from '../childrens/HeaderTtitleDataProduct';
import NotData from '../childrens/HeaderTitleNotData';
import axios from 'axios';

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

export default class ProductAlls extends react.Component{
    constructor(props){
        super(props)
        this.state={
            items: [],
            data: [],
            text: '',
            nullForm: false,
            haveData: false,
            modalOpen: false,
            updateModal: false,
            modalAlert: false,
            emailExist: false,
            form:{
                "reference": "",
                "brand": "",
                "category": "",
                "description": "",
                "price": "",
                "availability": "",
                "quantity": "",
                "photography": ""
            }
        }
    }

    getProducts = () =>{
        axios.get(urlBase+"peripherals/all").then(response=>{
            this.setState({data: response.data});
            if(response.data.length === 0){
                this.setState({haveData: false});
            } else{
                this.setState({haveData: true});
            }
            swal.fire({
                title: "Consultado!",
                text: `Mostrando todos los productos.`,
                icon: "info"
            })
        }).catch(error=>{
            console.log("Error: "+error)
        })
    }

    postProduct=async()=>{
        await axios.post(urlBase+"peripherals/new", this.state.form).then(response=>{
            this.modalOpen();
            this.getProducts();
            this.cleanProduct();
            this.goodRequest();
            this.setState({nullForm: false});
            console.log(response.data);
        }).catch(error=>{
            console.log("Error: "+error)
        })
    }

    putProduct=()=>{
        axios.put(urlBase+"peripherals/update", this.state.form).then(response=>{
            this.modalOpen();
            this.getProducts();
            this.cleanProduct();
            this.goodRequest();
        }).catch(error=>{
            console.log("Error: "+error)
        })
    }

    deleteProduct=()=>{
        console.log(this.state)
        axios.delete(urlBase+"peripherals/"+this.state.form.reference).then(res =>{
            this.setState({modalAlert: false});
            this.getProducts();
            this.cleanProduct();
        }).catch(error=>{
            console.log("Error: "+error)
        })
    }

    validateInputs=()=>{
        let form = this.state.form;
        if(form.reference.length === 0 || form.brand.length === 0 
            || form.category.length === 0 || form.description.length === 0 
            || form.price.length === 0 || form.availability.length === 0 
            || form.quantity.length === 0 || form.photography.length ===0){
            this.alertValidate("Hay campos vacios")
        }else if(form.reference.length < 3){
            this.alertValidate("La referencia es muy corta, min 3 caracteres");
            this.setState((prevState) => ({form: {...prevState.form,reference: ""}}));
        }else if(form.brand.length < 3){
            this.alertValidate("El modelo es muy corto, min 3 caracteres");
            this.setState((prevState) => ({form: {...prevState.form,brand: ""}}));
        }else if(form.category.length < 4){
            this.alertValidate("La categoria es muy corta, min 4 caracteres");
            this.setState((prevState) => ({form: {...prevState.form,category: ""}}));
        }else if(form.description.length < 4 || form.description.length > 80){
            this.alertValidate("la descripción debe tener minimo 5 caracteres y maximo 80");
            this.setState((prevState) => ({form: {...prevState.form,category: ""}}));
        }else if(form.price < 1){
            this.alertValidate("No se acceptan precios negativos!");
            this.setState((prevState) => ({form: {...prevState.form,price: ""}}));
        }else if(form.quantity < 1){
            this.alertValidate("No se acceptan cantidades negativos!");
            this.setState((prevState) => ({form: {...prevState.form,quantity: ""}}));
        }else {
            if(this.state.updateModal){
                this.putProduct();
            }else{
                this.postProduct();
            }
        }
    }

    alertValidate=(text)=>{
        Toast.fire({icon: "error", text: text});
    }

    goodRequest = () =>{
        swal.fire({
            title: "Confirmado.",
            text: "Datos cargados!",
            timer: "2000"
        })
    }

    productSelected=(product)=>{
        this.setState({
            updateModal: true,
            form:{
                reference: product.reference,
                brand: product.brand,
                category: product.category,
                description: product.description,
                price: product.price,
                availability: product.availability,
                quantity: product.quantity,
                photography: product.photography,
        }
        })
    }

    cleanProduct=()=>{
        this.setState({
            form:{
                reference: "",
                brand: "",
                category: "",
                description: "",
                price: "",
                availability: "",
                quantity: "",
                photography: "",
            }
        }) 
    }

    modalOpen=()=>{
        let type = sessionStorage.getItem("type");
        console.log(type !== "Coordinador de zona")
        console.log(type !== "Administrador")
        if(type === "Administrador" || type === "Coordinador de zona" || type === "Asesor comercial"){
            this.setState({modalOpen: !this.state.modalOpen})
        }else{
            swal.fire({
                title: "Lo sentimos",
                text: "No tienes los permisos suficientes (Admin/Coord/Ase)",
                icon: "error",
                timer: "2000"
            })
        }
    }

    handleSubmit=(e)=>{
        e.preventDefault()
    }

    handleChange=(event)=>{
        let {name, value} = event.target
        this.setState((prevState)=>({
            form: {
                ...prevState.form,
                [name]: value
            }
        }))
        console.log(this.state.form)
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
    }


    acceptDelete=(reference)=>{
        let type = sessionStorage.getItem("type");
        if(type === "Administrador" || type === "Coordinador de zona" || type === "Asesor comercial"){
            swal.fire({
                title: "Eliminar producto",
                text: "¿Esta seguro de eliminar el producto " + reference+"?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'cancelar!',
            }).then(respuesta=>{
                if(respuesta.isConfirmed){
                    this.deleteProduct();
                    swal.fire({
                        title: "Usuario eliminado!",
                        text: reference+" ha sido eliminado.",
                        icon: "success",
                        timer: "2000"
                    })
                }else{
                    swal.fire({
                        title: "Cancelado!",
                        text: reference+" no se ha eliminado.",
                        icon: "info",
                        timer: "2000"
                    })
                }
            })
        }else{
            swal.fire({
                title: "Lo sentimos",
                text: "No tienes los permisos suficientes (Admin/Coord/Ase)",
                icon: "error",
                timer: "2000"
            })
        }
    }

    render(){
        let form = this.state.form;
        let input = "mb-3 div_container-input"
        if (this.state.updateModal){
            input = "mb-3 div_container-input invisible"
        }
        return(
                <div className="container-content">
                    <div className="content">
                        <h1 className="title fs-1"> Productos. </h1>
                            <div id="productTable" className="productTable table-responsive">

                                <table border="1" className="table table-dark table-striped">
                                    {this.state.haveData ? <HaveDataProduct/> : <NotData value={"productos registrados."}/>}
                                        <tbody>
                                            {this.state.data.map(product=>{
                                                let availability = product.availability;
                                                    if(availability === true){
                                                        availability = "Si";
                                                    } else if(availability === false) {
                                                        availability = "No";
                                                    }
                                                    return(
                                                        <tr key={product.reference}>
                                                            <td> <img src={product.photography} alt={product.reference} /></td>
                                                            <td>{product.reference}</td>
                                                            <td>{product.brand}</td>
                                                            <td>{product.category}</td>
                                                            <td>{product.description}</td>
                                                            <td>{product.price}</td>
                                                            <td>{availability}</td>
                                                            <td>{product.quantity}</td>
                                                            <td>
                                                                <div className="buttons-table">
                                                                    <button className="btn btn-danger text" type="button" onClick={()=>{this.productSelected(product); this.acceptDelete(product.reference,)}}> Eliminar </button> 
                                                                    <button className="btn btn-primary text" type="button" onClick={()=>{this.productSelected(product); this.modalOpen(); this.setState({nullForm: true})}}> Actualizar </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                            })}
                                        </tbody>
                                </table>
                            </div>    

                            <Modal className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg" isOpen={this.state.modalOpen}>
                                <ModalHeader style={{display: 'block'}}>
                                    <div>
                                        <h2> Guardar Producto. </h2>
                                    </div>
                                </ModalHeader>
                                <ModalBody>
                                    <form className="was-validated formulario modal-body" style={{width: '100%'}} onSubmit={this.handleSubmit}>
                                        <div className={input}>
                                            <label htmlFor="reference" className="form-label subtitle fs-4">Referencia.</label>
                                            <input 
                                                required
                                                className="form-control" 
                                                type="text" 
                                                name="reference" 
                                                id="reference" 
                                                onChange={this.handleChange} 
                                                value={form.reference}
                                            />
                                        </div>
                                        <div className="mb-3 div_container-input">
                                            <label htmlFor="brand" className="form-label subtitle fs-4">Modelo.</label>
                                            <input
                                                required 
                                                className="form-control" 
                                                type="text" 
                                                name="brand" 
                                                id="brand"
                                                onChange={this.handleChange} 
                                                value={form.brand}
                                            />
                                        </div>
                                        <div className="mb-3 div_container-input">
                                            <label htmlFor="category" className="form-label subtitle fs-4">Categoria.</label>
                                            <input
                                                required 
                                                className="form-control" 
                                                type="text" 
                                                name="category" 
                                                id="category"
                                                onChange={this.handleChange} 
                                                value={form.category}
                                            />
                                        </div>
                                        <div className="mb-3 div_container-input">
                                            <label htmlFor="description" className="form-label subtitle fs-4">Descripción</label>
                                            <input
                                                required 
                                                className="form-control" 
                                                type="text" 
                                                name="description" 
                                                id="description" 
                                                onChange={this.handleChange} 
                                                value={form.description}
                                            />
                                        </div>
                                        <div className="mb-3 div_container-input">
                                            <label htmlFor="price" className="form-label subtitle fs-4">Precio.</label>
                                            <input
                                                required 
                                                className="form-control" 
                                                type="number" 
                                                name="price" 
                                                id="price" 
                                                onChange={this.handleChange} 
                                                value={form.price}
                                            />
                                        </div>
                                        <div className="mb-3 div_container-input center">
                                            <div className="selected" style={{width: "100%"}}>
                                                <label htmlFor="availability" className="form-label subtitle fs-4">Disponibilidad:</label>
                                                <select className="form-select" id="availability" name="availability" required onChange={this.handleChange} defaultValue={ form.availability}>
                                                    <option disabled="disabled" value={""}>Selecciona la disponibilidad.</option>
                                                    <option value="true">Si.</option>
                                                    <option value="false">No.</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-3 div_container-input">
                                            <label htmlFor="quantity" className="form-label subtitle fs-4">Cantidad.</label>
                                            <input
                                                required 
                                                className="form-control" 
                                                type="number" 
                                                name="quantity" 
                                                id="quantity" 
                                                onChange={this.handleChange} 
                                                value={form.quantity}
                                            />
                                        </div>
                                        <div className="mb-3 div_container-input">
                                            <label htmlFor="photography" className="form-label subtitle fs-4">Foto.</label>
                                            <input
                                                required 
                                                className="form-control" 
                                                type="url" 
                                                name="photography" 
                                                id="photography" 
                                                onChange={this.handleChange} 
                                                value={form.photography}
                                            />
                                        </div>
                                        <ModalFooter style={{width: '100%',justifyContent: 'center'}}>
                                            <div className="container_footer-modal">
                                                {this.state.updateModal ?
                                                    <button className="btn btn-primary footer_button" type="submit" onClick={()=>this.validateInputs()}>Actualizar.</button> :
                                                    <button className="btn btn-primary footer_button" type="submit" onClick={()=>this.validateInputs()}>Agregar.</button> 
                                                }
                                                <button className="btn btn-danger footer_button" type="button" style={{margin: ".1rem"}} onClick={()=>{this.modalOpen(); this.setState({nullForm: false}); this.cleanProduct()}}>Cancelar.</button>
                                            </div>
                                        </ModalFooter>
                                    </form>
                                </ModalBody>
                            </Modal>

                            <div className="button-add" id="button_add-container">
                                <div className="container_button-add">
                                    <button className="btn btn-primary text button_Add" type="button" onClick={()=>{this.setState({nullForm: true}); this.setState({updateModal: false}); this.modalOpen()}}>Agregar productos.</button>
                                </div>
                            </div>
                    </div>
                </div>       
        )
    }

}

 