import {BrowserRouter , Switch,Route} from "react-router-dom"
import App from "./App"
import CartComponent from "./components/CartComponent" 

const MyRoute = () =>{
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={App}/> 
                <Route path="/cart"  component={CartComponent} exact/> 
            </Switch>
        </BrowserRouter>
    )
}

export default MyRoute;