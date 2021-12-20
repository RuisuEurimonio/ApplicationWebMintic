import React from 'react';
import Img from '../../sources/logopng.png'
import { NavLink } from 'react-router-dom';

class Nav extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            items: [], 
            text: {},
            pageActive: this.props.value,
            home: "nav-link subtitle",
            user: "nav-link subtitle",
            products: "nav-link subtitle",
            order: "nav-link subtitle",
        }
    }

    componentDidMount(){
        this.nav();
    }
  
    nav = () =>{
        if(this.state.pageActive === "home"){
            this.setState({home: "nav-link subtitle active"})
        } else if(this.state.pageActive === "user"){
            this.setState({user: "nav-link subtitle active"})
        } else if(this.state.pageActive === "product"){
            this.setState({products: "nav-link subtitle active"})
        } else if(this.state.pageActive === "order"){
            this.setState({order: "nav-link subtitle active"})
        }
    }
    
    render(){
        return (
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark container-nav">
                <div className="container-fluid">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink to="/Home" className={this.state.home}> Home. </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/User/all" className={this.state.user}> Users. </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/Products/all" className={this.state.products}> Products. </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/Orders" className={this.state.order}> Orders. </NavLink>
                    </li>
                    <li className="nav-item container-text">
                    <NavLink to="/Home" className="nav-link subtitle"> Contra Corriente LTDA. </NavLink>
                    </li>
                    <li className="nav-item container-img">
                        <NavLink to="/Home" className="nav-link">
                            <img className="img_logo-nav" src={Img} alt="logo peripherals" title="logo peripherals" />
                        </NavLink>
                    </li>
                    <li className="nav-item container-logaut">
                        <NavLink to="/" className="nav-link subtitle"> Salir. </NavLink>
                    </li>
                </ul>
                </div>
            </nav>
        )
    }
}

export default Nav;
