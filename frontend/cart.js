
/* =========================================
   QUIET BATTLES™ — CART FUNCTIONALITY
   ========================================= */


// CART STORAGE KEY
const CART_KEY = "quietBattlesCart";


// HTML ELEMENTS
const cartItemsContainer = document.getElementById("cartItems");
const emptyCartMessage = document.getElementById("emptyCart");
const cartItemCount = document.getElementById("cartItemCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTotal = document.getElementById("cartTotal");


// CURRENCY FORMATTER
function formatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);
}


// GET CART DATA
function getCart() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(CART_KEY));

        return Array.isArray(savedCart) ? savedCart : [];
    } catch (error) {
        console.error("Unable to read cart:", error);
        return [];
    }
}


// SAVE CART DATA
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}


// UPDATE NAVIGATION CART COUNT
function updateCartCount() {
    const cart = getCart();

    const totalItems = cart.reduce(function (total, item) {
        return total + Number(item.quantity || 0);
    }, 0);

    const cartLinks = document.querySelectorAll(
        ".cart-button, .nav-right a[href='cart.html']"
    );

    cartLinks.forEach(function (link) {
        link.textContent = `CART (${totalItems}) ↗`;
    });
}


// CREATE A CART ITEM
function createCartItem(item, index) {

    const cartItem = document.createElement("article");
    cartItem.className = "cart-item";

    // PRODUCT IMAGE
    const imageContainer = document.createElement("div");
    imageContainer.className = "cart-item-image";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name || "Cart product";
    image.loading = "lazy";

    imageContainer.appendChild(image);


    // PRODUCT DETAILS
    const details = document.createElement("div");
    details.className = "cart-item-details";

    const name = document.createElement("h3");
    name.textContent = item.name;

    const collection = document.createElement("p");
    collection.className = "cart-item-collection";
    collection.textContent = item.collection;

    const size = document.createElement("p");
    size.className = "cart-item-size";
    size.textContent = `SIZE: ${item.size}`;

    const price = document.createElement("p");
    price.className = "cart-item-price";
    price.textContent = formatPrice(item.price);

    details.append(name, collection, size, price);


    // PRODUCT CONTROLS
    const controls = document.createElement("div");
    controls.className = "cart-item-controls";

    const quantityControls = document.createElement("div");
    quantityControls.className = "cart-item-quantity";

    // DECREASE BUTTON
    const decreaseButton = document.createElement("button");
    decreaseButton.type = "button";
    decreaseButton.textContent = "−";
    decreaseButton.setAttribute("aria-label", "Decrease quantity");
    decreaseButton.dataset.action = "decrease";
    decreaseButton.dataset.index = index;

    // QUANTITY
    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    // INCREASE BUTTON
    const increaseButton = document.createElement("button");
    increaseButton.type = "button";
    increaseButton.textContent = "+";
    increaseButton.setAttribute("aria-label", "Increase quantity");
    increaseButton.dataset.action = "increase";
    increaseButton.dataset.index = index;

    quantityControls.append(
        decreaseButton,
        quantity,
        increaseButton
    );


    // TOTAL PRICE
    const itemTotal = document.createElement("span");
    itemTotal.className = "cart-item-total";

    itemTotal.textContent = formatPrice(
        Number(item.price) * Number(item.quantity)
    );


    // REMOVE BUTTON
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-item";
    removeButton.textContent = "REMOVE";
    removeButton.dataset.action = "remove";
    removeButton.dataset.index = index;


    controls.append(
        quantityControls,
        itemTotal,
        removeButton
    );


    cartItem.append(
        imageContainer,
        details,
        controls
    );

    return cartItem;
}


// DISPLAY CART ITEMS
function displayCart() {

    const cart = getCart();

    cartItemsContainer.innerHTML = "";

    let subtotal = 0;
    let totalItems = 0;


    // EMPTY CART CHECK
    if (cart.length === 0) {

        cartItemsContainer.style.display = "none";
        emptyCartMessage.style.display = "flex";

    } else {

        cartItemsContainer.style.display = "block";
        emptyCartMessage.style.display = "none";

        cart.forEach(function (item, index) {

            const price = Number(item.price);
            const quantity = Number(item.quantity);

            if (
                !Number.isFinite(price) ||
                !Number.isInteger(quantity) ||
                price < 0 ||
                quantity < 1
            ) {
                return;
            }

            const cartItem = createCartItem(item, index);

            cartItemsContainer.appendChild(cartItem);

            subtotal += price * quantity;
            totalItems += quantity;

        });

    }


    // UPDATE ITEM COUNT
    cartItemCount.textContent =
        `${totalItems} ${totalItems === 1 ? "ITEM" : "ITEMS"}`;


    // UPDATE PRICE SUMMARY
    cartSubtotal.textContent = formatPrice(subtotal);
    cartTotal.textContent = formatPrice(subtotal);


    // UPDATE NAVIGATION
    updateCartCount();

}


// HANDLE QUANTITY AND REMOVE BUTTONS
cartItemsContainer.addEventListener("click", function (event) {

    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const action = button.dataset.action;
    const index = Number(button.dataset.index);

    const cart = getCart();

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= cart.length
    ) {
        return;
    }


    // INCREASE QUANTITY
    if (action === "increase") {

        if (cart[index].quantity < 10) {
            cart[index].quantity++;
        } else {
            alert("Maximum quantity allowed is 10.");
            return;
        }

    }


    // DECREASE QUANTITY
    else if (action === "decrease") {

        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            return;
        }

    }


    // REMOVE PRODUCT
    else if (action === "remove") {

        cart.splice(index, 1);

    }


    // SAVE AND REFRESH CART
    saveCart(cart);
    displayCart();

});


// INITIALIZE CART PAGE
displayCart();
