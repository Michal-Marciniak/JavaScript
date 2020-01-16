// variables
const cartButton = document.querySelector(".navbar__cart-button");
const closeCartButton = document.querySelector(".close-cart-button");
const clearCartButton = document.querySelector(".clear-cart-button");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart__overlay");
const navbar__cartItems = document.querySelector(".navbar__cart-items"); // Count shows on trolley icon in navbar
const cartTotal = document.querySelector(".cart--total");
const cartItems = document.querySelector(".cart__items"); // items shows in cart panel
const productsDOM = document.querySelector(".products--center");
const chevronUP = document.querySelector("fa-chevron-up");
const chevronDOWN = document.querySelector("fa-chevron-down");
const removeCartItemSpan = document.querySelector(".cart__item--remove"); // remove indicated Cart item

// cart
let cart = [];
// product__buttons_DOM
let product__buttonsDOM = [];

// getting all products
class Products {
  async getProducts() {
    try {
      let fetchedProducts = await fetch("./products.json");
      let data = await fetchedProducts.json();
      let products = data.items;
      products = products.map(product => {
        const title = product.fields.title;
        const price = product.fields.price;
        const id = product.sys.id;
        const image = product.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// UI
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach(product => {
      result += `<article class="product">
          <div class="img-container">
            <img
              src=${product.image}
              alt="product"
              class="product__img"
            />
            <button class="product__button" data-id=${product.id}>
              <i class="fa fa-shopping-cart"></i>
              add to cart
            </button>
          </div>
          <h3 class="product__description">${product.title}</h3>
          <h4 class="product__price">$ ${product.price}</h4>
        </article>`;
    });
    productsDOM.innerHTML = result;
  }
  getProduct__buttons() {
    let product__buttons = [...document.querySelectorAll(".product__button")];
    // add selected buttons to aray of name product__buttonsDOM
    product__buttonsDOM = product__buttons;
    product__buttons.forEach(product__button => {
      let product__button__id = product__button.dataset.id;
      let inCart = cart.find(item => item.id === product__button__id);

      if (inCart) {
        product__button.innerText = "In Cart";
        product__button.disabled = true;
      }
      product__button.addEventListener("click", event => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // get product from products
        let cartItem = {
          ...Storage.getProduct(product__button__id),
          amount: 1
        };
        // add product to cart
        cart = [...cart, cartItem];
        // save cart in local Storage
        Storage.saveCart(cart);
        // set cart values
        this.setCartValues(cart);
        // display cart items
        this.addCartItem(cartItem);
        // show cart
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart = cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    navbar__cartItems.innerText = itemsTotal;
  }
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart__item");

    div.innerHTML = `<img
    src=${cartItem.image}
    alt="product img"
    class="cart__item__img"/>
  <div class="cart__item__content">
    <h3 class="cart__item__description">${cartItem.title}</h3>
    <h4 class="cart__item__price">$ ${cartItem.price}</h4>
    <span class="cart__item--remove" data-id=${cartItem.id}>remove</span>
  </div>
  <div class="cart__icons">
    <i class="fa fa-chevron-up" data-id=${cartItem.id}></i>
    <p class="cart__item--amount">${cartItem.amount}</p>
    <i class="fa fa-chevron-down" data-id=${cartItem.id}></i>
  </div>`;

    cartItems.appendChild(div);
    Storage.saveCart(cart);
  }
  showCart() {
    cartOverlay.classList.add("show-cart-overlay");
    cartDOM.classList.add("show-cart");
    cartDOM.classList.add("close-cart-smoothy");
  }
  closeCart() {
    cartOverlay.classList.remove("show-cart-overlay");
    cartDOM.classList.remove("show-cart");
    cartDOM.classList.add("close-cart-smoothy");
  }
  setupAPP() {
    let local_storage_cart = Storage.getCart();
    this.setCartValues(local_storage_cart);
    local_storage_cart.forEach(item => {
      this.addCartItem(item);
    });
  }
  clearCart() {
    // cartItems are id's of every item in cart
    let Cart_Items_IDs = cart.map(item => item.id);
    Cart_Items_IDs.forEach(id => {
      this.removeCartItem(id);
    });
    while (cartItems.children.length > 0) {
      cartItems.removeChild(cartItems.children[0]);
    }
    this.closeCart();
  }
  removeCartItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);

    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fa fa-shopping-cart"></i> Add to Cart`;
  }
  getSingleButton(id) {
    return product__buttonsDOM.find(button => button.dataset.id === id);
  }
}

// Clear Cart
clearCartButton.addEventListener("click", () => {
  let ui = new UI();
  ui.clearCart();
});

// Remove indicated Cart Item
cartItems.addEventListener("click", event => {
  let ui = new UI();

  if (event.target.classList.contains("cart__item--remove")) {
    let IndicatedID = event.target.dataset.id;
    let IndicatedCartItem = event.target.parentElement.parentElement;

    ui.removeCartItem(IndicatedID);
    cartItems.removeChild(IndicatedCartItem);
    if (cartItems.children.length === 0) {
      ui.closeCart();
    }
  } else if (event.target.classList.contains("fa-chevron-up")) {
    let addAmount = event.target;
    let id = event.target.dataset.id;

    let tempItem = cart.find(item => item.id === id);
    tempItem.amount += 1;
    Storage.saveCart(cart);
    ui.setCartValues(cart);

    addAmount.nextElementSibling.innerText = tempItem.amount;
  } else if (event.target.classList.contains("fa-chevron-down")) {
    let addAmount = event.target;
    let id = event.target.dataset.id;

    let tempItem = cart.find(item => item.id === id);
    tempItem.amount -= 1;

    if (tempItem.amount >= 1) {
      Storage.saveCart(cart);
      ui.setCartValues(cart);
      addAmount.previousElementSibling.innerText = tempItem.amount;
    } else {
      ui.removeCartItem(id);
      Storage.saveCart(cart);
      ui.setCartValues(cart);
      cartItems.removeChild(addAmount.parentElement.parentElement);

      if (cartItems.children.length <= 0) {
        ui.closeCart();
      }
    }
  }
});

// Open Cart by clicking the trolley icon
cartButton.addEventListener("click", () => {
  ui = new UI();
  ui.showCart();
});

// Close Cart
cartDOM.querySelector(".close-cart-button").addEventListener("click", () => {
  ui = new UI();
  ui.closeCart();
});

// Our Storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let products = new Products();
  let ui = new UI();

  // setup Application
  ui.setupAPP();

  // get all products and display them
  products
    .getProducts()
    .then(data => {
      ui.displayProducts(data);
      Storage.saveProducts(data);
    })
    .then(() => {
      ui.getProduct__buttons();
    });
});
