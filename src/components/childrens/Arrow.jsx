




import react from 'react';
import arrow from "../../sources/flecha.png"

export default class Arrow extends react.Component{
    render() {
        return(
            <div className="button-bottom">
                    <a href="#button_add-container" id="img_container-link">
                        <img className="arrow-img" src={arrow} alt='arrow link' id="img-link" style={{zIndex: 99999}}/>
                    </a>
            </div>
        )
    }
}