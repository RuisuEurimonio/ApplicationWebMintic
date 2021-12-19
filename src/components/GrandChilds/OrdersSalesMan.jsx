import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import react from 'react';
import HaveData from '../../components/childrens/HeaderTitleDataOrderZone'
import NotData from '../childrens/HeaderTitleNotData';
import ProductsTable from '../childrensTable/ProductsTable';
import axios from 'axios';
import swal from 'sweetalert2'

const url = "localhost";
//150.136.51.44

const urlBase = `http://${url}:8080/api/`;

export default class OrdersSalesMan extends react.Component{
    constructor(props){
        super(props)
        this.state={
            data:[],
            items:[],
            nowStatus: "",
            modalOpen: false,
            form:{},
            registerDay: "",
            body: ""
        }
    }

    updateOrder = (id, date, status)=>{
        let datas={
            id: id,
            registerDay: date,
            status: status
        }
        axios.put(urlBase+"order/update",datas).then(res=>{
            this.getOrdersZone();

            swal.fire({
                title: "Hecho!",
                text:"La orden " +id+" ha sido actualizada",
                icon:"success",
                timer: "2000"
            })
            this.openModal();
        }).catch(err=>{console.log("Error "+err)})
    }

    getOrdersZone=()=>{
        let id = sessionStorage.getItem("id");
        axios.get(urlBase+"order/salesman/"+id).then(res=>{
            this.setState({data: res.data});
            if(res.data.length === 0){
                this.setState({haveData: false})
            }else{
                this.setState({haveData: true});

            }
        })
        console.log(this.state)
    }

    consultOrder=(id)=>{
        axios.get(urlBase+"order/"+id).then(res=>{
            this.setState({nowStatus: res.data.status})
            this.setState({form: res.data})
            let date = res.data.registerDay
            let dateRes = date.substring(0,10)
            this.setState({registerDay: dateRes})
            this.statusNow();
            console.log(this.state);
            this.openModal();
        }).catch(err=>{console.log("Error "+err)})
    }

    openModal=()=>{
        this.setState({modalOpen: !this.state.modalOpen})
    }

    handleChange=(e)=>{
        let value = e.target.value;
        this.setState({body: value})
        console.log(value)
        console.log(this.state)
    }

    statusNow =()=>{
        let status = this.state.form.status;
        this.setState({body: status})
    }

    componentDidMount(){
        this.getOrdersZone();
    }

    render(){
        return(
            <div className="container-content">
                <div className="content">
                    <h1 className="title fs-1"> Ordenes de asesores comerciales. </h1>
                        <div id="productTable" className="productTable table-responsive">

                            <table border="1" className="table table-dark table-striped">
                                {this.state.haveData ? <HaveData/> : <NotData value={"ordenes registradas."}/>}
                                    <tbody>
                                        {this.state.data.map(Order=>{
                                            let date=Order.registerDay;
                                            if(date == null){
                                                date = " No hay datos."
                                            }else{
                                                date = Order.registerDay.substring(0,10)
                                            }

                                            return(
                                                <tr key={Order.id}>
                                                    <td>{Order.salesMan.identification} </td>
                                                    <td>{Order.salesMan.name}</td>
                                                    <td>{Order.salesMan.email}</td>
                                                    <td>{date}</td>
                                                    <td>{Order.id}</td>
                                                    <td>{Order.status}</td>
                                                    <td>
                                                    <button className="btn btn-primary text button_Add" type="button" style={{margin: ".1rem"}} onClick={()=>{this.consultOrder(Order.id)}}>ver pedido.</button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                            </table>

                        
                            <Modal className="modal-dialog modal-dialog-centered modal-dialog-scrollable" style={{justifyContent: 'center', maxWidth: "95%"}} isOpen={this.state.modalOpen}>
                                <div className="modal-content" style={{backgroundColor: "#DEE2E6"}}>

                                    <ModalHeader style={{display: 'block'}}>
                                        <div className="position-relative">
                                            <h2> Detalles del pedido. </h2>
                                            <button className="btn btn-danger position-absolute top-50 end-0 translate-middle-y" type="button" style={{margin: ".1rem"}} onClick={()=>{this.openModal()}}>X</button>
                                        </div>
                                    </ModalHeader>
                                    <ModalBody>
                                        <form className="formulario modal-body" style={{width: '100%', backgroundColor: "#6C757D", borderRadius: ".2rem"}} onSubmit={this.handleSubmit}>                                            

                                        <div style={{width: '100%'}}>
                                            <div>
                                                <h3 className="center subtitle"> Orden. </h3>
                                            </div>
                                            <table border="1" className="table table-dark table-striped">
                                                <thead>
                                                    <tr>
                                                        <th> Fecha. </th>
                                                        <th> No. Pedido. </th>
                                                        <th> Estado. </th>
                                                        <th> Cambiar estado. </th>
                                                        <th> Guardar. </th>
                                                    </tr>    
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{this.state.registerDay}</td>
                                                        <td>{this.state.form.id}</td>
                                                        <td>{this.state.form.status}</td>
                                                        <td>
                                                            <div className="mb-3 div_container-input center">
                                                                <div className="selected">
                                                                    <label htmlFor="status" className="form-label subtitle fs-4"/>
                                                                    <select className="form-select" id="status" name="status" required onChange={this.handleChange} defaultValue={ this.state.nowStatus}>
                                                                        <option value="Pendiente">Pendiente.</option>
                                                                        <option value="Aprobado">Aprobado.</option>
                                                                        <option value="Rechazado">Rechazado.</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-primary footer_button" type="button" onClick={()=>this.updateOrder(this.state.form.id, this.state.registerDay, this.state.body)}>Actualizar.</button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div style={{width: '100%'}}>
                                            <div>
                                                <h3 className="center subtitle"> Detalle de productos. </h3>
                                            </div>
                                            <div className="table-responsive">

                                                <table border="1" className="table table-dark table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th> Foto. </th>
                                                            <th> Referencia. </th>
                                                            <th> Marca. </th>
                                                            <th> Categoria. </th>
                                                            <th> Descripcion. </th>
                                                            <th> Disponibilidad. </th>
                                                            <th> Precio. </th>
                                                            <th> Cantidad. </th>
                                                            <th> Pedido. </th>
                                                        </tr>    
                                                    </thead>
                                                            <ProductsTable data={this.state.form} />
                                                </table>
                                            </div>
                                        </div>


                                            <ModalFooter style={{width: '100%'}}>
                                                <div className="container_footer-modal">
                                                    <button className="btn btn-danger footer_button" type="button" style={{margin: ".1rem"}} onClick={()=>{this.openModal()}}>Cancelar.</button>
                                                </div>
                                            </ModalFooter>
                                        </form>
                                    </ModalBody>
                                </div>
                                </Modal>

                        </div>
                </div>
            </div>
        )
    }
}