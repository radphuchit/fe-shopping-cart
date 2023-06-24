import { useEffect, useState } from "react";
import axios from "axios";
import NavbarComponent from "./NavBarComponent";
import Swal from "sweetalert2";
import {
  GetShoppingCart,
  RemoveItemInCart,
  ClearItemInCart,
} from "../utils/LocalStorageController";

const CartComponent = () => {
  const [stocks, setStocks] = useState([]);

  function fetchStocks() {
    axios
      .get(`http://localhost:46219/api/stocks`)
      .then((response) => {
        let dataStock = response.data;
        let list = [];
        const itemInCart = GetShoppingCart();
        const items = [...new Set(itemInCart)];
        for (let i = 0; i < items.length; i++) {
          const find = dataStock.find((x) => x.productId == items[i]);
          if (find) {
            let totalQtyInCart = itemInCart.filter(
              (x) => x == find.productId
            ).length;
            list.push({
              productId: find.productId,
              productName: find.productName,
              pricePerUnit: find.pricePerUnit,
              qty: totalQtyInCart,
              amount: totalQtyInCart * find.pricePerUnit,
            });
          }
        }

        list.sort((a, b) => a.productId - b.productId);

        console.log(list);
        setStocks(list);
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

  function RemoveFromCart(productId) {
    RemoveItemInCart(productId);
    fetchStocks();
    Toast.fire({ icon: "success", title: "ลบสินค้าลงในตะกร้า" });
  }

  function ClearCart() {
    Swal.fire({
      icon: "warning",
      text: "คุณต้องการลบรายการทั้งหมดในตะกร้าหรือไม่ ?",
      showCancelButton: true,
    }).then((result) => {
      //กดปุ่ม ok หรือตกลง
      if (result.isConfirmed) {
        ClearItemInCart();
        fetchStocks();
      }
    });
  }

  const tableRows = stocks.map((item) => {
    return (
      <tr key={item.productId}>
        <td>{item.productName}</td>
        <td>{item.pricePerUnit}</td>
        <td>{item.qty}</td>
        <td>{item.amount}</td>
        <td>
          <a
            className="btn btn-sm btn-outline-danger"
            onClick={() => RemoveFromCart(item.productId)}
          >
            ลบ
          </a>
        </td>
      </tr>
    );
  });

  function Checkout() {
    let items = [];
    let amout = 0;
    for (let i = 0; i < stocks.length; i++) {
      amout += stocks[i].amount;
      for (let j = 0; j < stocks[i].qty; j++) {
        items.push({
          productId: stocks[i].productId,
        });
      }
    } 
    
    Swal.fire({
      icon: "warning",
      title: 'ยืนยันการชำระเงิน',
      text: `ยอดที่ต้องชำระคือ ${amout} ยืนยันการชำระ ?`,
      showCancelButton: true,
    }).then((result) => {
      //กดปุ่ม ok หรือตกลง
      if (result.isConfirmed) {
        axios
          .post(`http://localhost:46219/api/stocks`, items)
          .then((response) => {
            Swal.fire("แจ้งเตือน", "บันทึกข้อมูลบทความเรียบร้อย", "success");
            ClearItemInCart();
            fetchStocks();
          })
          .catch((err) => {
            Swal.fire("แจ้งเตือน", err.response.data.error, "error");
          });
      }
    });

  }

  return (
    <div className="container p-5">
      <h2>ตะกร้าสินค้า</h2>
      <NavbarComponent />
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ชื่อสินค้า</th>
            <th>ราคาต่อหน่วย</th>
            <th>จำนวน</th>
            <th>รวมเป็นเงิน</th>
            <th>ลบสินค้า</th>
          </tr>
        </thead>
        {stocks.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={5} className="text-center">
                ไม่มีสินค้าในตะกร้า
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>{tableRows}</tbody>
        )}
      </table>
      {stocks.length > 0 && (
        <div>
          <a className="btn btn-success" onClick={() => Checkout()}>
            ชำระเงิน
          </a>
          <a className="btn btn-danger m-3" onClick={() => ClearCart()}>
            ลบรายการทั้งหมดในตะกร้า
          </a>
        </div>
      )}
    </div>
  );
};

export default CartComponent;
