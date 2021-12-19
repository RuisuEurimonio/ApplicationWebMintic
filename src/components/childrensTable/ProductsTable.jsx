import react from 'react';

function orderProducts(data){
    console.log(data)
    let products = data.products
    let list = [];

    for(let product in products) {
        list.push(product);
    }
    
    let num = list.length
    console.log(num);

    let tableProducts= "";

    for(let i = 0 ; i < num ; i++){
        let dis;
        if(products[list[i]].availability===true){
            dis = "Si.";
        } else {
            dis = "No."
        }

        let cant;
        if(data.quantities[list[i]] === undefined){
            cant = "No hay datos."
        } else {
            cant = data.quantities[list[i]];
        }
        console.log("la wea")
        tableProducts += `<tr>
                            <td> <img src="${products[list[i]].photography}" </td>
                            <td> ${products[list[i]].reference} </td>
                            <td> ${products[list[i]].brand} </td>
                            <td> ${products[list[i]].category} </td>
                            <td> ${products[list[i]].description} </td>
                            <td> ${dis} </td>
                            <td> ${products[list[i]].price} </td>
                            <td> ${products[list[i]].quantity} </td>
                            <td> ${cant} </td>
                            </tr>`
    }
    console.log(tableProducts)
    document.getElementById("content_table-products").innerHTML = tableProducts;
}

export default class ProductsTable extends react.Component{
    constructor(props){
        super(props);
        this.state={
            data: this.props.data.products,
            items: [],
            text: ""
        }
    }

    componentDidMount(){
        orderProducts(this.props.data);
    }

    render(){
        return(
            <tbody id="content_table-products"></tbody>
        )
    }
}