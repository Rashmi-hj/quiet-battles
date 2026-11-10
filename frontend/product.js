
// =========================================
// QUIET BATTLES™ — PRODUCT FUNCTIONALITY
// SPRING BOOT + MYSQL INTEGRATION
// =========================================

const API_BASE_URL = "http://localhost:8080/api/products";

const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85";

const CART_KEY = "quietBattlesCart";

let product = null;


// =========================================
// HTML ELEMENTS
// =========================================

const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");
const productCollection = document.getElementById("productCollection");
const productPrice = document.getElementById("productPrice");
const productDescription = document.getElementById("productDescription");

const productCode = document.getElementById("productCode");

const productImageCollection =
    document.getElementById("productImageCollection");

const productExtraCollection =
    document.getElementById("productExtraCollection");

const sizeSelect = document.getElementById("productSize");
const quantityInput = document.getElementById("productQuantity");
const addToCartButton = document.getElementById("addToCart");
const productMessage = document.getElementById("productMessage");


// =========================================
// GET PRODUCT ID FROM URL
// =========================================

function getProductId() {

    const params = new URLSearchParams(window.location.search);

    const productId = params.get("id");

    if (productId && /^\d+$/.test(productId)) {
        return productId;
    }

    // Default product for direct visits to product.html
    return "2";
}


// =========================================
// GET CART
// =========================================

function getCart() {

    try {

        const savedCart = JSON.parse(localStorage.getItem(CART_KEY));

        return Array.isArray(savedCart) ? savedCart : [];

    } catch (error) {

        console.error("Unable to read cart:", error);

        return [];

    }

}


// =========================================
// SAVE CART
// =========================================

function saveCart(cart) {

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

}


// =========================================
// UPDATE CART COUNT
// =========================================

function updateCartCount() {

    const cart = getCart();

    const totalItems = cart.reduce(function (total, item) {

        return total + Number(item.quantity || 0);

    }, 0);

    const cartLinks = document.querySelectorAll(
        '.cart-button, .nav-right a[href="cart.html"]'
    );

    cartLinks.forEach(function (link) {

        link.textContent = `CART (${totalItems}) ↗`;

    });

}


// =========================================
// FETCH PRODUCT FROM BACKEND
// =========================================

async function loadProduct() {

    if (addToCartButton) {
        addToCartButton.disabled = true;
    }

    if (productMessage) {
        productMessage.textContent = "Loading product...";
    }

    try {

        const productId = getProductId();

        const response = await fetch(
            `${API_BASE_URL}/${productId}`
        );

        if (!response.ok) {

            throw new Error(
                "Unable to fetch product. HTTP status: " +
                response.status
            );

        }

        product = await response.json();

        displayProduct(product);

        if (addToCartButton) {
            addToCartButton.disabled = false;
        }

        if (productMessage) {
            productMessage.textContent = "";
        }

        document.title =
            `${product.name} | QUIET BATTLES™`;

    } catch (error) {

        console.error("Product loading error:", error);

        if (productMessage) {
            productMessage.textContent =
                "Unable to load product. Please try again later.";

            productMessage.style.color = "red";
        }

    }

}


// =========================================
// DISPLAY PRODUCT
// =========================================

function displayProduct(data) {

    productName.textContent = data.name || "Product";

    const collection = data.seriesTitle || "QUIET BATTLES™";

    productCollection.textContent = collection;

    productImageCollection.textContent = collection;

    productExtraCollection.textContent = collection;


    // PRICE

    const price = Number(data.price);

    productPrice.textContent = Number.isFinite(price)
        ? new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(price)
        : "Price unavailable";


    // DESCRIPTION

    productDescription.textContent =
        data.description || "WEAR YOUR BATTLES.";


    // IMAGE

    const imageUrl = data.image || "";

    productImage.src =
        imageUrl && !imageUrl.includes("example.com")
            ? imageUrl
            : DEFAULT_IMAGE;

    productImage.onerror = function () {
        productImage.src = DEFAULT_IMAGE;
    };


    // PRODUCT CODE

    productCode.textContent =
        "QB-" + String(data.id).padStart(3, "0");


    // SIZES

    sizeSelect.innerHTML =
        '<option value="">Choose your size</option>';

    if (Array.isArray(data.sizes)) {

        data.sizes.forEach(function (size) {

            const option = document.createElement("option");

            option.value = size;
            option.textContent = size;

            sizeSelect.appendChild(option);

        });

    }


    // STOCK

    const availableStock = Number(data.stock);

    quantityInput.max = Math.min(
        10,
        Number.isFinite(availableStock) ? availableStock : 10
    );

    quantityInput.min = 1;
    quantityInput.value = 1;

    if (availableStock <= 0) {

        addToCartButton.disabled = true;

        productMessage.textContent = "Currently out of stock.";

    }

}


// =========================================
// ADD PRODUCT TO CART
// =========================================

function addProductToCart() {

    if (!product) {

        productMessage.textContent = "Product is not available.";

        return;

    }

    const selectedSize = sizeSelect.value;

    const quantity = Number(quantityInput.value);


    // SIZE VALIDATION

    if (selectedSize === "") {

        productMessage.textContent =
            "Please select a size before adding to cart.";

        sizeSelect.focus();

        return;

    }


    // QUANTITY VALIDATION

    if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 10
    ) {

        productMessage.textContent =
            "Please enter a quantity between 1 and 10.";

        quantityInput.focus();

        return;

    }


    // STOCK VALIDATION

    if (quantity > Number(product.stock)) {

        productMessage.textContent =
            "Requested quantity exceeds available stock.";

        return;

    }


    const cart = getCart();


    // CHECK EXISTING PRODUCT

    const existingProduct = cart.find(function (item) {

        return (
            String(item.id) === String(product.id) &&
            item.size === selectedSize
        );

    });


    if (existingProduct) {

        if (
            existingProduct.quantity + quantity > 10 ||
            existingProduct.quantity + quantity > Number(product.stock)
        ) {

            productMessage.textContent =
                "Maximum available quantity reached for this size.";

            return;

        }

        existingProduct.quantity += quantity;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            collection: product.seriesTitle,

            price: Number(product.price),

            image: product.image &&
                !product.image.includes("example.com")
                ? product.image
                : DEFAULT_IMAGE,

            size: selectedSize,

            quantity: quantity

        });

    }


    saveCart(cart);

    updateCartCount();

    productMessage.style.color = "green";

    productMessage.textContent =
        `${product.name} added to your cart successfully!`;

    quantityInput.value = 1;

}


// =========================================
// BUTTON EVENT
// =========================================

if (addToCartButton) {

    addToCartButton.addEventListener(
        "click",
        addProductToCart
    );

}


// =========================================
// INITIALIZE
// =========================================

updateCartCount();

loadProduct();
