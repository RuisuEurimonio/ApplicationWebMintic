import swal from 'sweetalert2'
import react from 'react';
import HaveDataProduct from '../childrens/HeaderTitleProductConsult';
import NotData from '../childrens/HeaderTitleNotData';
import axios from 'axios';

const url = "localhost";
//150.136.51.44

const urlBase = `http://${url}:8080/api/`;

export default class ProductPrice extends react.Component{
    constructor(props){
        super(props)
        this.state={
            items: [],
            data: [],
            text: '',
            haveData: false,
        }
    }

    getProducts = () =>{
        let price = sessionStorage.getItem("price");
        axios.get(urlBase+"peripherals/price/"+price).then(response=>{
            this.setState({data: response.data});
            if(response.data.length === 0){
                this.setState({haveData: false});
            } else{
                this.setState({haveData: true});
            }
            swal.fire({
                title: "Consultado!",
                text: `Se ha realizado la busqueda de los productos con el precio igual o menor a ${price}`,
                icon: "info"
            })
        }).catch(error=>{
            console.log("Error: "+error)
        })
        sessionStorage.removeItem("price")
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

    render(){
        return(
            <div className="container-content">
                <div className="content">
                    <h1 className="title fs-1"> Productos por precio. </h1>
                        <div id="productTable" className="productTable table-responsive">
                            <table border="1" className="table table-dark table-striped">
                                {this.state.haveData ? <HaveDataProduct/> : <NotData value={"productos registrados."}/>}
                                    <tbody>
                                        {this.state.data?
                                            this.state.data.map(product=>{
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
                                                    </tr>
                                                )
                                        }) :
                                        <tr>
                                            <td> No se encontraron productos. </td>
                                        </tr>
                                    }
                                    </tbody>
                            </table>
                        </div>    
                </div>
            </div>       
        )
    }
}

 