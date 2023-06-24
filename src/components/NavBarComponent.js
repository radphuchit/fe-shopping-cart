const NavbarComponent=({history})=>{
    return(
        <nav className="mt-4">
            <ul className="nav nav-tabs">
                <li className="nav-item pr-3 pt-3 pb-3">
                    <a href="/" className="nav-link">รายการสินค้า</a>
                </li>
               
                <li className="nav-item pr-3 pt-3 pb-3"> 
                    <a href="/cart" className="nav-link">ตะกร้าสินค้า</a>
                </li> 
            </ul>
        </nav>
    )
}

export default (NavbarComponent);