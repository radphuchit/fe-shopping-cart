const GetShoppingCart = () => {
  let shoppingCart = localStorage.getItem("cart");
  if (shoppingCart == null) {
    localStorage.setItem("cart", JSON.stringify([]));
    shoppingCart = [];
  } else {
    shoppingCart = JSON.parse(shoppingCart);
  }

  return shoppingCart;
};

const SetShoppingCart = (item) => {
  localStorage.setItem("cart", JSON.stringify(item));
};

const ClearItemInCart = () => {
  SetShoppingCart([]);
};

const RemoveItemInCart = (productId) => {
  let cart = GetShoppingCart();
  let index = cart.indexOf(productId);
  if (index != -1) {
    cart.splice(index, 1);
  }
  SetShoppingCart(cart);
};

export { SetShoppingCart, GetShoppingCart,ClearItemInCart,RemoveItemInCart };
