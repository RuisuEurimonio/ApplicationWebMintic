import swal from 'sweetalert2'
import react from 'react';
import Arrow from '../childrens/Arrow';
import Nav from '../childrens/Nav';
import Footer from '../childrens/Footer';
import Profile from '../childrens/Profile'
import { Outlet } from 'react-router-dom'

export default class Product extends react.Component{
    constructor(props){
        super(props)
        this.state={
            items: [],
            data: [],
            text: '',
            price: "",
            word: "",
            wordBoolean: false,
            referenceBoolean: false,
            priceBoolean: false,
            categoryBoolean: false,
            inputs:{
                price: "",
                word: "",
                reference: "",
                category: "",
            }
        }
    }

    searchWord=()=>{
        if(this.state.inputs.word.length === 0){
            swal.fire({
                title:"Ups!!!",
                text:"Se te olvido ingresar los datos, vuelve a intentarlo.",
                icon:"info",
                timer:"2000"
            })
        }else{
            sessionStorage.setItem("word", this.state.inputs.word)
            document.location.pathname = "Products/description";
        }
    }

    searchReference=()=>{
        if(this.state.inputs.reference.length === 0){
            swal.fire({
                title:"Ups!!!",
                text:"Se te olvido ingresar los datos, vuelve a intentarlo.",
                icon:"info",
                timer:"2000"
            })
        }else{
            sessionStorage.setItem("reference", this.state.inputs.reference)
            document.location.pathname = "Products/reference";
        }
    }

    searchPrice=()=>{
        if(this.state.inputs.price.length === 0){
            swal.fire({
                title:"Ups!!!",
                text:"Se te olvido ingresar los datos, vuelve a intentarlo.",
                icon:"info",
                timer:"2000"
            })
        }else if(this.state.inputs.price < 0){
            swal.fire({
                title:"Ups!!!",
                text:"El valor no puede ser negativo",
                icon:"info",
                timer:"2000"
            })
        }else{
            sessionStorage.setItem("price", this.state.inputs.price)
            document.location.pathname = "Products/price";
        }
    }

    searchCategory=()=>{
        console.log(this.state)
        if(this.state.inputs.category.length === 0){
            swal.fire({
                title:"Ups!!!",
                text:"El valor no puede ser negativo",
                icon:"info",
                timer:"2000"
            })
        }else{
            sessionStorage.setItem("category", this.state.inputs.category);
            document.location.pathname = "Products/category";
        }
    }

    priceIsClicked=()=>{
        this.setState({priceBoolean: !this.state.priceBoolean});
        this.setState({wordBoolean: false,})
        this.setState({referenceBoolean: false,})
        this.setState({categoryBoolean: false,})
        this.cleanInput();
    }

    allIsClicked=()=>{
        this.setState({priceBoolean: false,wordBoolean: false,categoryBoolean: false})
        document.location.pathname = "/Products/all"
        this.cleanInput();
    }

    wordIsClicked=()=>{
        this.setState({wordBoolean: !this.state.wordBoolean});
        this.setState({priceBoolean: false})
        this.setState({referenceBoolean: false,})
        this.setState({categoryBoolean: false,})
        this.cleanInput();
    }

    referenceIsClicked=()=>{
        this.setState({referenceBoolean: !this.state.referenceBoolean});
        this.setState({priceBoolean: false})
        this.setState({wordBoolean: false})
        this.setState({categoryBoolean: false})
        this.cleanInput();
    }

    categoryIsClicked=()=>{
        this.setState({categoryBoolean: !this.state.categoryBoolean});
        this.setState({priceBoolean: false})
        this.setState({wordBoolean: false,})
        this.setState({referenceBoolean: false,})
        this.cleanInput();
    }

    cleanInput=()=>{
        this.setState({
            inputs:{
                price: "",
                reference: "",
                word: "",
                category: "",
            }
        })
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
        console.log(this.state)
    }

    render(){
        return(
            <div className="container-body-total">
                <Nav value={"product"}/>
                <Arrow />
                <Profile />
                <div className="container-content">
                    <div className="content">
                        <h1 className="title fs-1"> Opciones de consulta. </h1>
                            <div id="productTable" className="productTable table-responsive">  
                            </div>
                            <div id="button_add-container" style={{justifyContent: 'center'}}>
                                <div className="container_button-add" style={{display: 'flex', alignItems: "center", justifyContent: "center", flexWrap: "wrap"}}>
                                    <button className="btn btn-primary text button_Add" type="button" style={{margin: ".1rem"}} onClick={()=>{this.allIsClicked()}}>Todas los productos.</button>
                                    <button className="btn btn-primary text button_Add" type="button" style={{margin: ".1rem"}} onClick={()=>{this.priceIsClicked()}}>Por precio.</button>
                                    <button className="btn btn-primary text button_Add" type="button" style={{margin: ".1rem"}} onClick={()=>{this.wordIsClicked()}}>Por palabra.</button>
                                    <button className="btn btn-primary text button_Add" type="button" style={{margin: ".1rem"}} onClick={()=>{this.referenceIsClicked()}}>Por nombre.</button>
                                    <button className="btn btn-primary text button_Add" type="button" style={{margin: ".1rem"}} onClick={()=>{this.categoryIsClicked()}}>Por categoria.</button>
                                </div>
                               {this.state.priceBoolean && (
                                    <div style={{display: 'flex', width: "70%", margin: "auto", alignItems: "flex-end"}}>
                                        <div style={{width: "80%", margin: "auto"}}>
                                                <label htmlFor="price" className="form-label subtitle fs-4">Precio.</label>
                                                    <input
                                                        required 
                                                        className="form-control" 
                                                        type="number" 
                                                        name="price" 
                                                        id="price"
                                                        onChange={this.handleChange} 
                                                        value={this.state.inputs.price}
                                                    />
                                        </div>
                                        <button className="btn btn-primary text button_Add btn-sm" type="button" style={{margin: ".1rem", height: "fit-content", padding: ".7rem"}} onClick={()=>{this.searchPrice()}}>Buscar.</button>
                                    </div>
                                )}
                                {this.state.wordBoolean && (
                                    <div style={{display: 'flex', width: "70%", margin: "auto", alignItems: "flex-end"}}>
                                        <div style={{width: "80%", margin: "auto"}}>
                                                <label htmlFor="word" className="form-label subtitle fs-4">Palabra.</label>
                                                    <input
                                                        required 
                                                        className="form-control" 
                                                        type="text" 
                                                        name="word" 
                                                        id="word"
                                                        onChange={this.handleChange} 
                                                        value={this.state.inputs.word}
                                                    />
                                        </div>
                                        <button className="btn btn-primary text button_Add btn-sm" type="button" style={{margin: ".1rem", height: "fit-content", padding: ".7rem"}} onClick={()=>{this.searchWord()}}>Buscar.</button>
                                    </div>
                                )}
                                {this.state.referenceBoolean && (
                                    <div style={{display: 'flex', width: "70%", margin: "auto", alignItems: "flex-end"}}>
                                        <div style={{width: "80%", margin: "auto"}}>
                                                <label htmlFor="reference" className="form-label subtitle fs-4">Referencia.</label>
                                                    <input
                                                        required 
                                                        className="form-control" 
                                                        type="text" 
                                                        name="reference" 
                                                        id="reference"
                                                        onChange={this.handleChange} 
                                                        value={this.state.inputs.reference}
                                                    />
                                        </div>
                                        <button className="btn btn-primary text button_Add btn-sm" type="button" style={{margin: ".1rem", height: "fit-content", padding: ".7rem"}} onClick={()=>{this.searchReference()}}>Buscar.</button>
                                    </div>
                                )}
                                {this.state.categoryBoolean && (
                                    <div style={{display: 'flex', width: "70%", margin: "auto", alignItems: "flex-end"}}>
                                        <div style={{width: "80%", margin: "auto"}}>
                                                <label htmlFor="category" className="form-label subtitle fs-4">Categoria.</label>
                                                    <input
                                                        required 
                                                        className="form-control" 
                                                        type="text" 
                                                        name="category" 
                                                        id="category"
                                                        onChange={this.handleChange} 
                                                        value={this.state.inputs.category}
                                                    />
                                        </div>
                                        <button className="btn btn-primary text button_Add btn-sm" type="button" style={{margin: ".1rem", height: "fit-content", padding: ".7rem"}} onClick={()=>{this.searchCategory()}}>Buscar.</button>
                                    </div>
                                )}
                            </div>
                    </div>
                </div>
                <Outlet/>
                <Footer/>
            </div>
        )
    }
}