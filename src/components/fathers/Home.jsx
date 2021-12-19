



import React from 'react';
import Img from '../../sources/logopng.png'
import Nav from "../childrens/Nav"
import Footer from '../childrens/Footer';
import Profile from '../childrens/Profile'
import swal from 'sweetalert2'
import '../../css/normalize.css'
import '../../css/home.css'

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            items: [], 
            text: '',
        };
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

    render(){
        
        return (
            <div className="container-all">

                <div className="p-5 text-white text-center welcome">
                    <h1 className="title fs-1"> Bienvenido a Contra corriente LTDA. </h1>
                </div>

                <Nav value={"home"}/>
                    
                <Profile />

                    <div className="container mt-5">
                        <div className="row">
                        <div className="col-sm-4 info">
                            <h2 className="subtitle fs-2">Sobre nosotros:</h2>
                            <h3 className="subtitle fs-2">Logo:</h3>
                            <img className="img-logo" src={Img} alt="logo peripherals" title="logo peripherals" />
                            <h3 className="subtitle fs-2">Ubicación:</h3>
                            <p className="text fs-4">Barranquilla - Atlantico - Colombia.</p>
                            <h3 className="subtitle">Correo:</h3>
                            <p className="text fs-4 text-break">ConCorrLTDA@correo.com</p>
                            <hr className="d-sm-none" />
                        </div>
                        <div className="col-sm-8">
                            <h2 className="subtitle fs-2">Contra corriente LDTA.</h2>
                            <h5 className="text fs-3">Empresa Barranquillera, Enero, 2009.</h5>
                            <p className="text fs-4">Contra Corriente LTDA. es una empresa con más de 10 años de trayectoria en la distribución de periféricos mediante el servicio de venta directa por catálogo, se ubica en el CENTRO HISTÓRICO de la ciudad, actualmente cuenta con más de 50 empleados entre directos y fuerza de ventas independiente.</p>
                    
                            <h2 className="mt-5 subtitle fs-2">Misión:</h2>
                            <p className="text fs-4">Nuetra misión durante estos diez años con lugar en el mercado es hacernos diferencia de otras empresas, brindando productos de alta calidad garantizando lo mejor para nuestros clientes.</p>
                            <h2 className="mt-5 subtitle fs-2">Visión:</h2>
                            <p className="text fs-4">Nuesta visión a corto plazo es lograr crecer de manera exponencial tanto de forma nacional como de forma internacional, logrando brindar perifericos capaces de cumplir con la espectativas de una gran variedad de clientes, centrandonos en el campo de oficina e innovando con lo "Gamer".</p>
                        </div>
                        </div>
                    </div>
                    
                    <Footer />

            </div>
        )
    }
}

export default Home;