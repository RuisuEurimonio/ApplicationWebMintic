

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/fathers/Home';
import Login from './components/fathers/Login';
import User from './components/fathers/User';
import Register from './components/fathers/Register'
import Products from './components/fathers/Products'
import Orders from './components/fathers/Orders'
import OrdersZone from './components/fathers/OrderZone'
import OrdersAll from './components/GrandChilds/OrdersAll';
import OrdersDate from './components/GrandChilds/OrdersDate';
import OrdersSalesMan from './components/GrandChilds/OrdersSalesMan';
import OrderStatus from './components/GrandChilds/OrderStatus'
import { Routes, Route } from 'react-router';
import { Link } from 'react-router-dom';


function App() {

  return (
    <div className="container-body-total container-login">
      <Routes className="container-routes">
        <Route path="/" element={<Login />  } />
        <Route path="/Home" element={<Home />  } />
        <Route path="/User" element={<User />  } />
        <Route path="/Register" element={<Register />  } />
        <Route path="/Products" element={<Products /> } />
        <Route path="/Orders" element={<Orders /> } />
        <Route path="/Orders/zone/*" element={<OrdersZone /> }> 
          <Route path="all" element={<OrdersAll />} />
          <Route path="date" element={<OrdersDate />} />
          <Route path="salesMan" element={<OrdersSalesMan />} />
          <Route path="status" element={<OrderStatus />} />
        </Route>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <h1> ¿Como llegaste aqui? </h1>
              <h2> Retoma tu camino </h2>
              <Link to="/"> <button type="button" className="btn btn-primary"> Iniciar sesión </button></Link>
            </main>
          }/>
      </Routes>
    </div>
  )
  
}

export default App;

