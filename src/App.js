import {
  GetShoppingCart,
  SetShoppingCart,
} from "./utils/LocalStorageController";
import { useState, useEffect } from "react";
import axios from "axios";
import NavbarComponent from "./components/NavBarComponent";
import "./App.css";
import Swal from "sweetalert2"; 

function App() {
  const [stocks, setStocks] = useState([]);

  function fetchStocks() {
    axios
      .get(`http://localhost:46219/api/stocks`)
      .then((response) => {
        setStocks(response.data);
      })
      .catch((err) => alert(err));
  }

  useEffect(() => {
    fetchStocks();
  }, []);

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-right",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  const AddToCart = (productId) => {
    const cart = GetShoppingCart();

    let stockRemain = stocks.find((x) => x.productId === productId);
    if (stockRemain) {
      let total = cart.filter((x) => x == productId);
      if (stockRemain.stockQty - total.length >= 1) {
        cart.push(productId);
        Toast.fire({ icon: "success", title: "เพิ่มสินค้าลงในตะกร้า" });
      } else {
        Swal.fire("", "จำนวนสินค้าไม่เพียงพอ", "warning");
      }

      SetShoppingCart(cart);
    }
    fetchStocks();
  };

  const tableRows = stocks.map((item) => {
    const cart = GetShoppingCart();
    const inCart = cart.filter((x) => x == item.productId).length;
    return (
      <tr key={item.productId}>
        <td>{item.productName}</td>
        <td>{item.pricePerUnit}</td>
        <td>{item.stockQty - inCart}</td>
        <td>
          <a
            className="btn btn-sm btn-outline-success"
            onClick={() => AddToCart(item.productId)}
          >
            เพิ่มลงในตะกร้า
          </a>
        </td>
      </tr>
    );
  });
  return (
    <div className="container p-5">
      <h2>รายการสินค้า</h2>
      <NavbarComponent />
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ชื่อสินค้า</th>
            <th>ราคาต่อหน่วย</th>
            <th>จำนวนคงเหลือ</th>
            <th>เพิ่มลงตะกร้า</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
}

export default App;
