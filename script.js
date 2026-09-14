let slides = document.querySelectorAll(".slide");

let index = 0;

function slider() {

    slides[index].classList.remove("active");

    index++;

    if (index == slides.length) {

        index = 0;

    }

    slides[index].classList.add("active");

}

setInterval(slider, 5000);

const stars = document.querySelectorAll(".rating i");

stars.forEach((star, index) => {

    star.addEventListener("click", () => {

        stars.forEach((s, i) => {

            if (i <= index) {

                s.style.color = "#d7a25b";

            } else {

                s.style.color = "#555";

            }

        });

    });

});

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");



/* ================= SEARCH POPUP ================= */

const searchPopup = document.querySelector(".search-popup");

const searchIcon = document.querySelector(".fa-magnifying-glass");

const closeSearch = document.getElementById("closeSearch");

searchIcon.addEventListener("click", () => {

    searchPopup.classList.add("active");

});

closeSearch.addEventListener("click", () => {

    searchPopup.classList.remove("active");

});

window.addEventListener("scroll", () => {

    const scrollPos = window.scrollY + (window.innerHeight / 3);

    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop - 100;
        const bottom = top + section.offsetHeight;

        if (scrollPos >= top && scrollPos < bottom) {
            current = section.id;
        }

    });

    navLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + current
        );
    });

});

/* ================= SEARCH FOOD ================= */

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const menuCards = document.querySelectorAll(".menu-card");

function getMenuCards() {
    return document.querySelectorAll(".menu-card");
}

searchBtn.addEventListener("click", searchFood);

searchInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
        searchFood();
    }

});

function searchFood() {

    const value = searchInput.value.trim().toLowerCase();

    if (value === "") {
        showToast("Please enter food name.", "warning");
        return;
    }

    let found = false;

    getMenuCards().forEach(card => {

        const name = card.querySelector("h3").innerText.toLowerCase();
        const category = card.dataset.category.toLowerCase();

        if (name.includes(value) || category.includes(value)) {

            found = true;

            card.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            card.classList.add("search-highlight");

            setTimeout(() => {
                card.classList.remove("search-highlight");
            }, 2500);

        }

    });

    searchPopup.classList.remove("active");

    if (!found) {
        showToast("Item not found!", "warning");
    }

}

/*================ CART COUNT =================*/

let cartCount = 0;
const cartBadge = document.getElementById("cart-count");

/*================ CART SIDEBAR =================*/

const cartIcon = document.querySelector(".cart-icon");
const cartSidebar = document.querySelector(".cart-sidebar");
const closeCart = document.getElementById("closeCart");

cartIcon.addEventListener("click", () => {

    cartSidebar.classList.add("active");

});

closeCart.addEventListener("click", () => {
    cartSidebar.classList.remove("active");
});

/*================ CART FUNCTIONALITY =================*/

let cart = JSON.parse(localStorage.getItem("lotusCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("lotusWishlist")) || [];
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.getElementById("cart-total");
const emptyCart = document.querySelector(".empty-cart");

getMenuCards().forEach(card => {

    const btn = card.querySelector("a");

    btn.addEventListener("click", (e) => {

        e.preventDefault();

        const name = card.querySelector("h3").innerText;

        const price = parseInt(
            card.querySelector(".price").innerText.replace("₹", "")
        );

        const img = card.querySelector("img").src;

        const activeBtn = card.querySelector(".size-btn.active");

        let size = activeBtn
            ? activeBtn.innerText
            : card.querySelector(".size-btn").innerText;

        addToCart(name, price, size, img);

    });

});

function addToCart(name, price, size, img) {

    const item = cart.find(product =>
        product.name === name &&
        product.size === size
    );

    if (item) {

        item.qty++;

    } else {

        cart.push({

            name,
            price,
            size,
            img,
            qty: 1

        });

    }

    updateCart();

    showToast(name + " added to cart!", "success");

}

function updateCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';

        cartTotal.innerText = 0;
        cartBadge.innerText = 0;
        cartCount = 0;
        localStorage.removeItem("lotusCart");

        updateCartButtons();

        return;

    }

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.qty;

        cartItems.innerHTML += `

<div class="cart-item">

    <img src="${item.img}" class="cart-img">

    <div class="cart-details">

        <h4>${item.name}</h4>

        <small>${item.size}</small>

        <p>₹${item.price} × ${item.qty}</p>

    </div>

    <div class="cart-actions">

        <button class="qty-btn" onclick="decreaseQty(${index})">−</button>

        <span>${item.qty}</span>

        <button class="qty-btn" onclick="increaseQty(${index})">+</button>

        <button class="delete-btn" onclick="removeCartItem(${index})">
            <i class="fa-solid fa-trash"></i>
        </button>

    </div>

</div>

`;

    });

    cartCount = cart.reduce((total, item) => total + item.qty, 0);
    cartBadge.innerText = cartCount;

    const subtotal = total;
    const gst = Math.round(subtotal * 0.05);
    let delivery = 0;

    if (deliveryBtn.classList.contains("active") && subtotal > 0) {
        delivery = 40;
    }

    document.getElementById("cart-subtotal").innerText = subtotal;
    document.getElementById("cart-gst").innerText = gst;
    document.getElementById("delivery-charge").innerText = delivery;

    const finalTotal = subtotal - discount + gst + delivery;

    if (couponApplied) {

        discount = Math.round(subtotal * 0.10);

    } else {

        discount = 0;

    }



    document.getElementById("discount-price").innerText = discount;

    cartTotal.innerText = finalTotal;

    cartTotal.innerText = finalTotal;

    localStorage.setItem("lotusCart", JSON.stringify(cart));

    updateCartButtons();

}

function updateCartButtons() {

    document.querySelectorAll(".menu-card").forEach(card => {

        const button = card.querySelector("a");

        if (!button) return;

        // Out of stock item ne touch na karo
        if (button.classList.contains("out-of-stock")) {
            button.innerText = "Out of Stock";
            button.classList.remove("go-to-cart");
            return;
        }

        const name = card.querySelector("h3").innerText.trim();

        const itemInCart = cart.some(item =>
            item.name.trim() === name
        );

        if (itemInCart) {

            button.innerText = "Go to Cart";
            button.classList.add("go-to-cart");

        } else {

            button.innerText = "Add to Cart";
            button.classList.remove("go-to-cart");

        }

    });

}

function increaseQty(index) {

    cart[index].qty++;

    updateCart();

}

function decreaseQty(index) {

    cart[index].qty--;

    if (cart[index].qty <= 0) {

        cart.splice(index, 1);

    }

    updateCart();

}

function removeCartItem(index) {

    cart.splice(index, 1);

    updateCart();

}

/*================ LOGIN POPUP =================*/

const userIcon = document.querySelector(".fa-user");
const loginPopup = document.querySelector(".login-popup");
const closeLogin = document.getElementById("closeLogin");
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

userIcon.addEventListener("click", () => {

    loginPopup.classList.add("active");

});

closeLogin.addEventListener("click", () => {

    loginPopup.classList.remove("active");

});

showRegister.addEventListener("click", () => {

    loginForm.style.display = "none";

    registerForm.style.display = "block";

});

showLogin.addEventListener("click", () => {

    registerForm.style.display = "none";

    loginForm.style.display = "block";

});

/*================ REAL LOGIN & REGISTER =================*/

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

registerBtn.addEventListener("click", () => {

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const phone = document.getElementById("regPhone").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regConfirm").value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showToast("Please enter a valid email address.", "warning");
        return;
    }

    if (!name || !email || !phone || !password || !confirm) {
        showToast("Please fill all fields.", "warning");
        return;
    }

    if (password.length < 8) {
        showToast("Password must be at least 8 characters.", "warning");
        return;
    }

    if (password !== confirm) {
        showToast("Passwords do not match.", "warning");
        return;
    }

    fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fullName: name,
            email,
            phone,
            password
        })
    })
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                showToast("Registration Successful", "success");

                registerForm.style.display = "none";
                loginForm.style.display = "block";

            } else {

                showToast(data.message, "warning");

            }

        })
        .catch(err => {

            console.log(err);

            showToast("Server Error", "warning");

        });
});

loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        showToast("Please fill all fields.", "warning");
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (data.success) {

            localStorage.setItem("token", data.token);

            showToast("Login Successful", "success");

            loginPopup.classList.remove("active");

            createUserMenu({
                name: data.user.fullName,
                email: data.user.email,
                phone: data.user.phone
            });

        } else {

            showToast(data.message, "warning");

        }

    } catch (err) {

        console.error(err);

        showToast("Server Error", "warning");

    }

});

const forgotPasswordLink = document.getElementById("forgotPasswordLink");

// ================= USER FORGOT PASSWORD =================

const emailPopup = document.getElementById("emailPopup");
const otpPopup = document.getElementById("otpPopup");
const resetPopup = document.getElementById("resetPopup");

const closeEmailPopup = document.getElementById("closeEmailPopup");
const closeOtpPopup = document.getElementById("closeOtpPopup");
const closeResetPopup = document.getElementById("closeResetPopup");

// Forgot Password
forgotPasswordLink.addEventListener("click", (e) => {

    e.preventDefault();

    loginPopup.classList.remove("active");

    emailPopup.style.display = "flex";

});

// Close Email Popup
closeEmailPopup.onclick = () => {

    emailPopup.style.display = "none";

    loginPopup.classList.add("active");

};

// Close OTP Popup
closeOtpPopup.onclick = () => {

    otpPopup.style.display = "none";

    loginPopup.classList.add("active");

};

// Close Reset Popup
closeResetPopup.onclick = () => {

    resetPopup.style.display = "none";

    loginPopup.classList.add("active");

};

// ================= SEND OTP =================

document.getElementById("sendOtpBtn").addEventListener("click", async () => {

    const email = document.getElementById("forgotEmail").value.trim();

    if (!email) {

        showToast("Please enter your email.", "warning");

        return;

    }

    try {

        const res = await fetch("http://localhost:5000/api/auth/send-otp", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ email })

        });

        const data = await res.json();

        if (data.success) {

            showToast("OTP sent successfully.", "success");

            emailPopup.style.display = "none";

            otpPopup.style.display = "flex";

        } else {

            showToast(data.message, "error");

        }

    } catch (err) {

        console.log(err);

        showToast("Server Error", "error");

    }

});

// ================= VERIFY OTP =================

document.getElementById("verifyOtpBtn").addEventListener("click", async () => {

    const email = document.getElementById("forgotEmail").value.trim();
    const otp = document.getElementById("forgotOtp").value.trim();

    if (!otp) {
        showToast("Please enter OTP.", "warning");
        return;
    }

    try {

        const res = await fetch("http://localhost:5000/api/auth/verify-otp", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                otp
            })

        });

        const data = await res.json();

        if (data.success) {

            showToast("OTP Verified Successfully.", "success");

            otpPopup.style.display = "none";

            resetPopup.style.display = "flex";

        } else {

            showToast(data.message, "error");

        }

    } catch (err) {

        console.log(err);

        showToast("Server Error", "error");

    }

});

// ================= RESET PASSWORD =================

document.getElementById("resetPasswordBtn").addEventListener("click", async () => {

    const email = document.getElementById("forgotEmail").value.trim();

    const password = document.getElementById("forgotNewPassword").value;

    const confirmPassword = document.getElementById("forgotConfirmPassword").value;

    if (!password || !confirmPassword) {

        showToast("Please enter password.", "warning");

        return;

    }

    if (password !== confirmPassword) {

        showToast("Passwords do not match.", "warning");

        return;

    }

    try {

        const res = await fetch("http://localhost:5000/api/auth/reset-password", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email,

                password

            })

        });

        const data = await res.json();

        if (data.success) {

            showToast("Password Reset Successfully", "success");

            resetPopup.style.display = "none";

            loginPopup.classList.add("active");

            document.getElementById("forgotEmail").value = "";
            document.getElementById("forgotOtp").value = "";
            document.getElementById("forgotNewPassword").value = "";
            document.getElementById("forgotConfirmPassword").value = "";

        } else {

            showToast(data.message, "error");

        }

    } catch (err) {

        console.log(err);

        showToast("Server Error", "error");

    }

});


function createUserMenu(savedUser) {

    document.querySelector(".fa-user").style.display = "none";

    const icons = document.querySelector(".icons");

    if (document.getElementById("userName")) return;

    const span = document.createElement("span");
    span.id = "userName";
    span.innerText = "Hi, " + savedUser.name;

    span.style.color = "#d6a354";
    span.style.marginLeft = "15px";
    span.style.fontWeight = "600";
    span.style.cursor = "pointer";

    icons.appendChild(span);

    const userMenu = document.createElement("div");
    userMenu.id = "userMenu";

    userMenu.innerHTML = `
<div class="user-menu-item" id="profileBtn">
    <i class="fa-solid fa-user"></i> My Profile
</div>

<div class="user-menu-item" id="historyBtn">
    <i class="fa-solid fa-box"></i> Order History
</div>

<div class="user-menu-item" id="wishlistBtnMenu">
    <i class="fa-solid fa-heart"></i> Wishlist
</div>

<div class="user-menu-item logout" id="logoutBtn">
    <i class="fa-solid fa-right-from-bracket"></i> Logout
</div>
`;

    icons.appendChild(userMenu);

    span.onclick = () => {
        userMenu.style.display =
            userMenu.style.display === "block" ? "none" : "block";
    };

    document.getElementById("logoutBtn").onclick = () => {

        localStorage.removeItem("token");

        location.reload();

    };

    document.getElementById("wishlistBtnMenu").onclick = () => {
        wishlistSidebar.classList.add("active");
        userMenu.style.display = "none";
    };

    const orderHistoryPopup = document.getElementById("orderHistoryPopup");
    const closeOrderHistory = document.getElementById("closeOrderHistory");

    document.getElementById("historyBtn").onclick = () => {

        userMenu.style.display = "none";

        orderHistoryPopup.classList.add("active");

        loadOrderHistory();

    };

    closeOrderHistory.onclick = () => {

        orderHistoryPopup.classList.remove("active");

    };

    const profilePopup = document.querySelector(".profile-popup");
    const closeProfile = document.getElementById("closeProfile");

    document.getElementById("profileBtn").onclick = async () => {

        const token = localStorage.getItem("token");

        try {

            const response = await fetch("http://localhost:5000/api/auth/me", {
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            const data = await response.json();

            if (data.success) {

                document.getElementById("profileName").value = data.user.fullName;
                document.getElementById("profileEmail").value = data.user.email;
                document.getElementById("profilePhone").value = data.user.phone || "";

                profilePopup.classList.add("active");
                userMenu.style.display = "none";

            } else {

                showToast("Please login again.", "warning");

            }

        } catch (err) {

            console.log(err);

        }

    };

    closeProfile.onclick = () => {

        profilePopup.classList.remove("active");

        document.getElementById("changePasswordBox").style.display = "none";

    };

    document.getElementById("saveProfileBtn").onclick = async () => {

        const token = localStorage.getItem("token");

        const fullName = document.getElementById("profileName").value.trim();
        const email = document.getElementById("profileEmail").value.trim();

        if (!fullName || !email) {
            showToast("Please fill all fields.", "warning");
            return;
        }

        try {

            const response = await fetch("http://localhost:5000/api/auth/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    phone: document.getElementById("profilePhone")
                        ? document.getElementById("profilePhone").value.trim()
                        : ""
                })
            });

            const data = await response.json();

            if (data.success) {

                // Navbar update
                document.getElementById("userName").innerText =
                    "Hi, " + data.user.fullName;

                // LocalStorage update
                const currentUser = JSON.parse(localStorage.getItem("user")) || {};

                currentUser.fullName = data.user.fullName;
                currentUser.email = data.user.email;
                currentUser.phone = data.user.phone;

                localStorage.setItem("user", JSON.stringify(currentUser));

                // Input fields refresh
                document.getElementById("profileName").value = data.user.fullName;
                document.getElementById("profileEmail").value = data.user.email;

                if (document.getElementById("profilePhone")) {
                    document.getElementById("profilePhone").value = data.user.phone || "";
                }

                showToast("Profile Updated Successfully", "success");

                profilePopup.classList.remove("active");

            } else {

                showToast(data.message, "warning");

            }

        } catch (err) {

            console.log(err);
            showToast("Server Error", "warning");

        }

    };

    document.getElementById("changePasswordBtn").onclick = () => {

        const box =
            document.getElementById("changePasswordBox");

        if (box.style.display === "block") {

            box.style.display = "none";

        } else {

            box.style.display = "block";

        }

    };

    document.getElementById("updatePasswordBtn").onclick = async () => {

        const token = localStorage.getItem("token");

        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmNewPassword").value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast("Please fill all fields.", "warning");
            return;
        }

        if (newPassword.length < 8) {
            showToast("Password must be at least 8 characters.", "warning");
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match.", "warning");
            return;
        }

        try {

            const response = await fetch("http://localhost:5000/api/auth/change-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (data.success) {

                document.getElementById("currentPassword").value = "";
                document.getElementById("newPassword").value = "";
                document.getElementById("confirmNewPassword").value = "";

                document.getElementById("changePasswordBox").style.display = "none";

                showToast("Password Updated Successfully", "success");

            } else {

                showToast(data.message, "warning");

            }

        } catch (err) {

            console.error(err);
            showToast("Server Error", "warning");

        }

    };

    window.addEventListener("click", (e) => {
        if (e.target === profilePopup) {
            profilePopup.classList.remove("active");
        }
    });

    document.addEventListener("click", (e) => {
        if (!span.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.style.display = "none";
        }
    });

}

/*================ TOAST FUNCTION ================*/

function showToast(message, type) {

    const toast = document.getElementById("toast");

    toast.innerText = message;

    toast.className = "";

    toast.classList.add("show");

    toast.classList.add(type);

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

/*================ MENU FILTER =================*/

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Active button change
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;

        getMenuCards().forEach(card => {

            if (filter === "all" || card.dataset.category === filter) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

});

/*================ ORDER TYPE =================*/

const dineInBtn = document.getElementById("dineInBtn");
const takeAwayBtn = document.getElementById("takeAwayBtn");
const deliveryBtn = document.getElementById("deliveryBtn");

const tableSection = document.querySelector(".table-section");
const takeawayTime = document.querySelector(".takeaway-time");
const deliverySection = document.querySelector(".delivery-section");

function resetOrderType() {

    dineInBtn.classList.remove("active");
    takeAwayBtn.classList.remove("active");
    deliveryBtn.classList.remove("active");

    tableSection.style.display = "none";
    takeawayTime.style.display = "none";
    deliverySection.style.display = "none";
}

dineInBtn.addEventListener("click", () => {

    resetOrderType();

    dineInBtn.classList.add("active");

    tableSection.style.display = "block";

    updateCart();

});

takeAwayBtn.addEventListener("click", () => {

    resetOrderType();

    takeAwayBtn.classList.add("active");

    takeawayTime.style.display = "flex";

    updateCart();

});

deliveryBtn.addEventListener("click", () => {

    resetOrderType();

    deliveryBtn.classList.add("active");

    deliverySection.style.display = "block";

    updateCart();

});

const tableBtns = document.querySelectorAll(".table-btn");

tableBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        tableBtns.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

    });

});



/*================ CHECKOUT =================*/

const checkoutPopup = document.querySelector(".checkout-popup");

const checkoutBtn = document.querySelector(".checkout-btn");

const closeCheckout = document.getElementById("closeCheckout");

checkoutBtn.addEventListener("click", () => {

    checkoutPopup.classList.add("active");

});

closeCheckout.addEventListener("click", () => {

    checkoutPopup.classList.remove("active");

});

/*================ COUPON =================*/

let discount = 0;
let couponApplied = false;

document
    .getElementById("applyCoupon")
    .addEventListener("click", () => {

        if (couponApplied) {

            showToast("Coupon already applied.", "warning");

            return;

        }

        const code = document
            .getElementById("couponCode")
            .value
            .trim()
            .toUpperCase();

        if (code === "LOTUS10") {

            couponApplied = true;

            updateCart();

            couponApplied = true;

            document
                .getElementById("couponMessage")
                .innerText = "Coupon Applied (10% OFF)";

            updateCart();

            showToast("Coupon Applied", "success");

        }

        else {

            showToast("Invalid Coupon", "warning");

        }

    });

const invoicePopup = document.querySelector(".invoice-popup");
const closeInvoice = document.getElementById("closeInvoice");
const invoiceItems = document.getElementById("invoiceItems");
const invoiceOrderId = document.getElementById("invoiceOrderId");
const invoiceSubtotal = document.getElementById("invoiceSubtotal");
const invoiceGST = document.getElementById("invoiceGST");
const invoiceDelivery = document.getElementById("invoiceDelivery");
const invoiceDiscount = document.getElementById("invoiceDiscount");
const invoiceTotal = document.getElementById("invoiceTotal");
const invoicePayment = document.getElementById("invoicePayment");

/*================ PLACE ORDER =================*/

const placeOrderBtn = document.getElementById("placeOrderBtn");

placeOrderBtn.addEventListener("click", () => {

    let orderType = "";

    if (deliveryBtn.classList.contains("active")) {

        orderType = "deliveryBtn";

    }
    else if (takeAwayBtn.classList.contains("active")) {

        orderType = "takeAwayBtn";

    }
    else if (dineInBtn.classList.contains("active")) {

        orderType = "dineInBtn";

    }
    else {

        showToast("Please select order type.", "warning");

        return;

    }

    if (orderType === "deliveryBtn") {

        const deliveryAddress =
            document.getElementById("deliveryLocation").value.trim();

        if (deliveryAddress === "") {

            showToast("Please enter delivery address.", "warning");

            return;

        }

    }

    if (orderType === "dineInBtn") {

        const table = document.querySelector(".table-btn.active");

        if (!table) {

            showToast("Please select a table.", "warning");

            return;

        }

    }

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();

    if (!name || !phone) {
        showToast("Please fill all checkout details.", "warning");
        return;
    }

    // Delivery હોય તો Cart નું Address ફરજિયાત
    if (orderType === "deliveryBtn") {

        const deliveryAddress =
            document.getElementById("deliveryLocation").value.trim();

        if (deliveryAddress === "") {
            showToast("Please enter delivery address.", "warning");
            return;
        }

    }
    // Dine In / Take Away માટે Checkout popup નું Address ફરજિયાત નથી
    else {

        if (address === "") {
            document.getElementById("customerAddress").value = "N/A";
        }

    }

    if (cart.length === 0) {

        showToast("Your cart is empty.", "warning");
        return;
    }

    const paymentMethod =
        document.querySelector('input[name="payment"]:checked').value;

    const activeTable = document.querySelector(".table-btn.active");

    const tableNumber = activeTable
        ? activeTable.innerText
        : "";

    const deliveryAddress =
        document.getElementById("deliveryLocation").value.trim();

    // ================= RAZORPAY PAYMENT =================

    if (
        (paymentMethod === "Card" || paymentMethod === "UPI") &&
        !razorpayPaymentSuccess
    ) {

        const subtotalForPayment = cart.reduce(
            (sum, item) => sum + (item.price * item.qty),
            0
        );

        const gstForPayment =
            Math.round(subtotalForPayment * 0.05);

        let deliveryForPayment = 0;

        if (orderType === "deliveryBtn") {
            deliveryForPayment = 40;
        }

        const totalForPayment =
            subtotalForPayment -
            discount +
            gstForPayment +
            deliveryForPayment;


        startRazorpayPayment(
            totalForPayment,
            name,
            phone,
            paymentMethod
        );

        return;
    }

    showToast(
        "Payment : " + paymentMethod,
        "success"
    );

    const successPopup = document.querySelector(".success-popup");

    const orderId = document.getElementById("orderId");

    const continueShopping = document.getElementById("continueShopping");

    checkoutPopup.classList.remove("active");

    invoicePopup.classList.add("active");

    /*=========== CREATE INVOICE ===========*/

    invoiceItems.innerHTML = "";

    let subtotal = 0;

    cart.forEach(item => {

        subtotal += item.price * item.qty;

        invoiceItems.innerHTML += `

<div class="invoice-item">

    <span>

        ${item.name}
        (${item.size}) × ${item.qty}

    </span>

    <span>

        ₹${item.price * item.qty}

    </span>

</div>

`;

    });

    const gst = Math.round(subtotal * 0.05);

    let delivery = 0;

    if (orderType === "deliveryBtn") {

        delivery = 40;

    }

    let total = subtotal - discount + gst + delivery;

    fetch("http://localhost:5000/api/orders/place", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            customerName: name,

            phone: phone,

            orderType:
                orderType === "dineInBtn"
                    ? "Dine In"
                    : orderType === "takeAwayBtn"
                        ? "Take Away"
                        : "Delivery",

            tableNumber,

            deliveryAddress,

            items: cart.map(item => ({

                name: item.name,
                size: item.size,
                quantity: item.qty,
                price: item.price

            })),

            subtotal,

            gst,

            deliveryCharge: delivery,

            discount,

            total,

            paymentMethod

        })

    })
        .then(res => res.json())
        .then(data => {

            console.log("Order Saved:", data);

            // Backend thi avto Order ID
            orderId.innerText = "Order ID : " + data.order.orderId;

            invoiceOrderId.innerText = data.order.orderId;

        })
        .catch(err => {

            console.log(err);

        });

    invoiceSubtotal.innerText = "₹" + subtotal;

    invoiceGST.innerText = "₹" + gst;

    invoiceDelivery.innerText = "₹" + delivery;

    invoiceDiscount.innerText = "-₹" + discount;

    invoiceTotal.innerText = "₹" + total;

    invoicePayment.innerText =
        "Payment : " + paymentMethod;

    cartSidebar.classList.remove("active");

    cart = [];
    cartCount = 0;
    cartBadge.innerText = 0;
    updateCart();

    checkoutPopup.classList.remove("active");
    cartSidebar.classList.remove("active");

    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerAddress").value = "";

});

document.getElementById("printBill").addEventListener("click", () => {

    window.print();

});

document.getElementById("continueShoppingInvoice").addEventListener("click", () => {

    invoicePopup.classList.remove("active");

});

closeInvoice.addEventListener("click", () => {

    invoicePopup.classList.remove("active");

});

/*================ INVOICE =================*/



const wishlistBtns = document.querySelectorAll(".wishlist");

wishlistBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        const card = btn.closest(".menu-card");

        const name = card.querySelector("h3").innerText;

        const price = card.querySelector(".price").innerText;

        const img = card.querySelector("img").src;

        if (btn.classList.contains("active")) {

            btn.classList.remove("active");

            btn.querySelector("i").classList.replace("fa-solid", "fa-regular");

            wishlist = wishlist.filter(item => item.name !== name);

        } else {

            btn.classList.add("active");

            btn.querySelector("i").classList.replace("fa-regular", "fa-solid");

            const activeBtn = card.querySelector(".size-btn.active");

            const size = activeBtn
                ? activeBtn.innerText
                : card.querySelector(".size-btn").innerText;

            wishlist.push({
                name,
                price,
                img,
                size
            });

            showToast(name + " added to wishlist!", "success");

        }

        updateWishlist();

    });

});

function updateWishlist() {

    const wishlistItems = document.getElementById("wishlist-items");

    const wishlistCount = document.getElementById("wishlist-count");

    wishlistItems.innerHTML = "";

    wishlistCount.innerText = wishlist.length;

    if (wishlist.length === 0) {

        wishlistItems.innerHTML = "<p class='empty-text'>Wishlist is Empty</p>";

        return;

    }

    wishlist.forEach(item => {

        wishlistItems.innerHTML += `

<div class="wishlist-card">

    <img src="${item.img}">

    <div class="wishlist-info">
        <h4>${item.name}</h4>
        <p>${item.price}</p>

        <button class="wishlist-cart-btn"
onclick="wishlistToCart(this,'${item.name}',${parseInt(item.price.replace('₹', ''))},'${item.size}')">

Add to Cart

</button>

<button class="wishlist-remove-btn"
onclick="removeWishlist('${item.name}','${item.size}')">

Remove

</button>

    </div>

</div>

`;

    });

    localStorage.setItem("lotusWishlist", JSON.stringify(wishlist));

}

const wishlistIcon = document.querySelector(".wishlist-icon");

const wishlistSidebar = document.querySelector(".wishlist-sidebar");

wishlistIcon.addEventListener("click", () => {

    wishlistSidebar.classList.add("active");

});

const closeWishlist = document.querySelector(".close-wishlist");

closeWishlist.addEventListener("click", () => {

    wishlistSidebar.classList.remove("active");

});

function wishlistToCart(button, name, price, size) {

    const item = wishlist.find(w =>
        w.name === name && w.size === size
    );

    if (!item) return;

    // Add to Cart
    addToCart(name, price, size, item.img);

    // Remove immediately from Wishlist
    wishlist = wishlist.filter(w =>
        !(w.name === name && w.size === size)
    );

    // Save instantly
    localStorage.setItem("lotusWishlist", JSON.stringify(wishlist));

    // Update Wishlist UI
    updateWishlist();

    // Reset Heart Icon
    getMenuCards().forEach(card => {
        if (card.querySelector("h3").innerText === name) {
            const heart = card.querySelector(".wishlist");

            heart.classList.remove("active");
            heart.querySelector("i").classList.remove("fa-solid");
            heart.querySelector("i").classList.add("fa-regular");
        }
    });

    cartSidebar.classList.add("active");
    wishlistSidebar.classList.remove("active");

    showToast("Item Added Successfully", "success");
}

function removeWishlist(name, size) {

    wishlist = wishlist.filter(item =>
        !(item.name === name && item.size === size)
    );

    localStorage.setItem("lotusWishlist", JSON.stringify(wishlist));

    // Heart icon reset
    document.querySelectorAll(".menu-card").forEach(card => {

        if (card.querySelector("h3").innerText === name) {

            const heart = card.querySelector(".wishlist");

            heart.classList.remove("active");

            heart.querySelector("i").classList.remove("fa-solid");
            heart.querySelector("i").classList.add("fa-regular");
        }

    });
    wishlist.forEach(item => {

        document.querySelectorAll(".menu-card").forEach(card => {

            if (card.querySelector("h3").innerText === item.name) {

                const heart = card.querySelector(".wishlist");

                heart.classList.add("active");

                heart.querySelector("i").classList.remove("fa-regular");
                heart.querySelector("i").classList.add("fa-solid");

            }

        });

    });

    updateWishlist();

    showToast("Removed from Wishlist", "warning");

}

updateWishlist();

/*================ CUSTOMER REVIEW =================*/

const reviewForm = document.querySelector(".review-box");

const reviewName = reviewForm.querySelector("input");
const reviewText = reviewForm.querySelector("textarea");
const reviewSubmit = reviewForm.querySelector("button");
const reviewContainer = document.getElementById("customerReviews");
const reviewPagination = document.getElementById("reviewPagination");

const reviewsPerPage = 5;
let currentReviewPage = 1;

let selectedRating = 0;

stars.forEach((star, index) => {

    star.addEventListener("click", () => {

        selectedRating = index + 1;

    });

});

let reviews = [];

loadReviews();

reviewSubmit.addEventListener("click", async function (e) {

    e.preventDefault();

    const name = reviewName.value.trim();
    const text = reviewText.value.trim();

    if (name === "") {
        showToast("Please enter your name.", "warning");
        return;
    }

    if (selectedRating === 0) {
        showToast("Please select a rating.", "warning");
        return;
    }

    if (text === "") {
        showToast("Please write your review.", "warning");
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/api/reviews/add", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name,
                rating: selectedRating,
                review: text

            })

        });

        const data = await response.json();

        if (data.success) {

            showToast("Review Submitted Successfully", "success");

            reviewName.value = "";
            reviewText.value = "";

            selectedRating = 0;

            stars.forEach(s => s.style.color = "#555");

            loadReviews();

        } else {

            showToast(data.message, "warning");

        }

    } catch (err) {

        console.log(err);

        showToast("Server Error", "warning");

    }

});

async function loadReviews() {

    try {

        const response = await fetch("http://localhost:5000/api/reviews/all");

        const data = await response.json();

        if (data.success) {

            reviews = data.reviews.map(item => ({
                name: item.name,
                text: item.review,
                rating: item.rating,
                date: new Date(item.createdAt).toLocaleDateString()
            }));

            currentReviewPage = 1;

            displayReviews();
            updateReviewSummary();

        }

    } catch (err) {

        console.log(err);

    }

}

function displayReviews() {

    reviewContainer.innerHTML = "";

    const start = (currentReviewPage - 1) * reviewsPerPage;
    const end = start + reviewsPerPage;

    const currentReviews = reviews.slice(start, end);

    currentReviews.forEach(review => {

        let starHTML = "";

        for (let i = 1; i <= 5; i++) {
            starHTML += i <= review.rating ? "★" : "☆";
        }

        reviewContainer.innerHTML += `

        <div class="customer-review-card">

            <h4>${review.name}</h4>

            <div class="stars">${starHTML}</div>

            <p>${review.text}</p>

            <small>${review.date}</small>

        </div>

        `;

    });

    createReviewPagination();
}

function createReviewPagination() {

    reviewPagination.innerHTML = "";

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    if (totalPages <= 1) return;

    // Previous

    const prev = document.createElement("button");
    prev.innerHTML = "&laquo;";
    prev.disabled = currentReviewPage === 1;

    prev.onclick = () => {
        currentReviewPage--;
        displayReviews();
    };

    reviewPagination.appendChild(prev);

    // Page Numbers

    for (let i = 1; i <= totalPages; i++) {

        const btn = document.createElement("button");

        btn.textContent = i;

        if (i === currentReviewPage) {
            btn.classList.add("active");
        }

        btn.onclick = () => {
            currentReviewPage = i;
            displayReviews();
        };

        reviewPagination.appendChild(btn);

    }

    // Next

    const next = document.createElement("button");
    next.innerHTML = "&raquo;";
    next.disabled = currentReviewPage === totalPages;

    next.onclick = () => {
        currentReviewPage++;
        displayReviews();
    };

    reviewPagination.appendChild(next);

}

updateReviewSummary();

function updateReviewSummary() {

    if (reviews.length === 0) {

        document.getElementById("averageRating").innerText = "0.0";
        document.getElementById("reviewNumber").innerText = "0";
        document.getElementById("averageStars").innerHTML = "☆☆☆☆☆";

        return;
    }

    let total = 0;

    reviews.forEach(review => {

        total += review.rating;

    });

    let avg = (total / reviews.length).toFixed(1);

    document.getElementById("averageRating").innerText = avg;

    document.getElementById("reviewNumber").innerText = reviews.length;

    let stars = "";

    for (let i = 1; i <= 5; i++) {

        stars += i <= Math.round(avg) ? "★" : "☆";

    }

    document.getElementById("averageStars").innerHTML = stars;

}

/* ================= CONTACT FORM VALIDATION ================= */

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === "") {
        showToast("Please enter your name.", "warning");
        return;
    }

    if (email === "") {
        showToast("Please enter your email address.", "warning");
        return;
    }

    if (!emailPattern.test(email)) {
        showToast("Please enter a valid email address.", "warning");
        return;
    }

    if (phone === "") {
        showToast("Please enter your phone number.", "warning");
        return;
    }

    if (message === "") {
        showToast("Please enter your message.", "warning");
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/api/contact/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                message
            })
        });

        const data = await response.json();

        if (data.success) {

            showToast("Message sent successfully!", "success");
            contactForm.reset();

        } else {

            showToast(data.message, "warning");

        }

    } catch (err) {

        console.error(err);
        showToast("Server Error", "warning");

    }
});

/*================ PAYMENT METHOD =================*/

const paymentOptions =
    document.querySelectorAll('input[name="payment"]');

const cashPayment =
    document.getElementById("cashPayment");

const onlinePayment =
    document.getElementById("onlinePayment");

let razorpayPaymentSuccess = false;
let razorpayPaymentId = "";
let razorpayOrderId = "";


paymentOptions.forEach(option => {

    option.addEventListener("change", () => {

        cashPayment.style.display = "none";
        onlinePayment.style.display = "none";

        if (option.value === "Cash") {

            cashPayment.style.display = "block";

        }

        if (
            option.value === "UPI" ||
            option.value === "Card"
        ) {

            onlinePayment.style.display = "block";

        }

    });

});


/*================ RAZORPAY PAYMENT =================*/

async function startRazorpayPayment(
    amount,
    customerName,
    customerPhone,
    paymentMethod
) {

    try {

        /* STEP 1: Create Razorpay Order */

        const response = await fetch(
            "http://localhost:5000/api/payment/create-order",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    amount: amount
                })
            }
        );


        const data = await response.json();


        if (!data.success) {

            showToast(
                data.message || "Unable to create payment order.",
                "warning"
            );

            return;

        }


        /* STEP 2: Razorpay Checkout */

        const options = {

            key: "rzp_test_TOMBHdgoH4v12d",

            amount: data.order.amount,

            currency: "INR",

            name: "Lotus Cafe",

            description: "Lotus Cafe Test Payment",

            order_id: data.order.id,


            prefill: {

                name: customerName,

                contact: customerPhone

            },


            theme: {

                color: "#d6a354"

            },


            handler: async function (paymentResponse) {

                console.log(
                    "Razorpay Payment Success:",
                    paymentResponse
                );

                try {

                    const verifyResponse = await fetch(
                        "http://localhost:5000/api/payment/verify-payment",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                razorpay_order_id:
                                    paymentResponse.razorpay_order_id,

                                razorpay_payment_id:
                                    paymentResponse.razorpay_payment_id,

                                razorpay_signature:
                                    paymentResponse.razorpay_signature
                            })
                        }
                    );


                    const verifyData =
                        await verifyResponse.json();


                    if (!verifyData.success) {

                        showToast(
                            "Payment verification failed.",
                            "warning"
                        );

                        return;
                    }


                    /* Payment successfully verified */

                    razorpayPaymentSuccess = true;

                    razorpayPaymentId =
                        paymentResponse.razorpay_payment_id;

                    razorpayOrderId =
                        paymentResponse.razorpay_order_id;


                    showToast(
                        "Payment Successful!",
                        "success"
                    );


                    /* Continue existing order flow */

                    document
                        .getElementById("placeOrderBtn")
                        .click();


                } catch (error) {

                    console.error(
                        "Payment Verification Error:",
                        error
                    );

                    showToast(
                        "Unable to verify payment.",
                        "warning"
                    );
                }

            },


            modal: {

                ondismiss: function () {

                    showToast(
                        "Payment Cancelled.",
                        "warning"
                    );

                }

            }

        };


        const razorpay =
            new Razorpay(options);


        razorpay.open();


    } catch (error) {

        console.error(
            "Razorpay Error:",
            error
        );

        showToast(
            "Payment system error.",
            "warning"
        );

    }

}

async function loadOrderHistory() {

    const historyList = document.getElementById("orderHistoryList");

    historyList.innerHTML = "<p>Loading...</p>";

    const token = localStorage.getItem("token");

    if (!token) {
        historyList.innerHTML = "<p>Please login first.</p>";
        return;
    }

    try {

        // Logged in user
        const userRes = await fetch("http://localhost:5000/api/auth/me", {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        const userData = await userRes.json();

        if (!userData.success) {
            historyList.innerHTML = "<p>User not found.</p>";
            return;
        }

        // User orders
        const orderRes = await fetch(
            `http://localhost:5000/api/orders/user/${userData.user.phone}`
        );

        const orderData = await orderRes.json();

        historyList.innerHTML = "";

        if (
            !orderData.success ||
            orderData.orders.length === 0
        ) {

            historyList.innerHTML = "<p>No Orders Found.</p>";
            return;
        }

        orderData.orders.forEach(order => {

            let items = "";

            order.items.forEach(item => {

                items += `
                    <li>
                        ${item.name}
                        (${item.size})
                        ×
                        ${item.quantity}
                    </li>
                `;

            });

            historyList.innerHTML += `

                <div class="order-card">

                    <h4>${order.orderId}</h4>

                    <small>
                        ${new Date(order.createdAt).toLocaleString()}
                    </small>

                    <ul>${items}</ul>

                    <p>
                        <strong>Total :</strong>
                        ₹${order.total}
                    </p>

                    <p>
                        <strong>Payment :</strong>
                        ${order.paymentMethod}
                    </p>

                    <p>
                        <strong>Status :</strong>
                        ${order.status}
                    </p>

                </div>

            `;

        });

    }
    catch (err) {

        console.log(err);

        historyList.innerHTML =
            "<p>Unable to load order history.</p>";

    }

}

window.addEventListener("load", async () => {

    const token = localStorage.getItem("token");

    if (!token) return;

    try {

        const response = await fetch("http://localhost:5000/api/auth/me", {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        const data = await response.json();

        if (data.success) {

            document.querySelector(".fa-user").style.display = "none";

            createUserMenu({
                name: data.user.fullName,
                email: data.user.email,
                phone: data.user.phone
            });

        } else {

            localStorage.removeItem("token");

        }

    } catch (err) {

        console.log(err);

        localStorage.removeItem("token");

    }

});

async function syncMenuFromDatabase() {

    try {

        const res = await fetch("http://localhost:5000/api/menu");

        const data = await res.json();

        console.log("Database Items:", data.menuItems);

        const container = document.getElementById("menuContainer");

        container.innerHTML = "";

        data.menuItems.forEach(item => {
            container.innerHTML += createMenuCard(item);
        });

        updateCartButtons();

    } catch (err) {

        console.log(err);

    }

}

syncMenuFromDatabase();

document.addEventListener("click", function (e) {

    // ===== Size Button =====
    if (e.target.classList.contains("size-btn")) {

        const card = e.target.closest(".menu-card");

        card.querySelectorAll(".size-btn").forEach(btn =>
            btn.classList.remove("active")
        );

        e.target.classList.add("active");

        const price = card.querySelector(".price");

        let newPrice = "";

        switch (e.target.dataset.size) {

            case "small":
                newPrice = card.getAttribute("data-small");
                break;

            case "medium":
                newPrice = card.getAttribute("data-medium");
                break;

            case "large":
                newPrice = card.getAttribute("data-large");
                break;

            case "1pc":
                newPrice = card.getAttribute("data-1pc");
                break;

            case "2pcs":
                newPrice = card.getAttribute("data-2pcs");
                break;

            case "4pcs":
                newPrice = card.getAttribute("data-4pcs");
                break;

            case "8pcs":
                newPrice = card.getAttribute("data-8pcs");
                break;

            case "12pcs":
                newPrice = card.getAttribute("data-12pcs");
                break;
        }

        if (newPrice && newPrice !== "0") {
            price.innerText = "₹" + newPrice;
        }

        return;
    }

    // ===== Add To Cart =====
    // ===== Add To Cart / Go To Cart =====
if (e.target.matches(".menu-card a")) {

    e.preventDefault();

    const card = e.target.closest(".menu-card");
    const button = e.target;

    // Out of Stock item cannot be added to cart
if (button.classList.contains("out-of-stock")) {
    e.preventDefault();
    return;
}

    const name = card.querySelector("h3").innerText.trim();

    // If item is already in cart
    const itemInCart = cart.some(item =>
        item.name.trim() === name
    );

    if (itemInCart || button.classList.contains("go-to-cart")) {

        // Open Cart
        cartSidebar.classList.add("active");

        return;
    }

    // Add new item to cart
    const price = parseInt(
        card.querySelector(".price").innerText.replace("₹", "")
    );

    const img = card.querySelector("img").src;

    const active = card.querySelector(".size-btn.active");

    const size = active
        ? active.innerText
        : (card.querySelector(".size-btn")?.innerText || "");

    addToCart(name, price, size, img);

    return;
}

    // ===== Wishlist =====
    const heart = e.target.closest(".wishlist");

    if (heart) {

        const card = heart.closest(".menu-card");

        const name = card.querySelector("h3").innerText;
        const price = card.querySelector(".price").innerText;
        const img = card.querySelector("img").src;

        if (heart.classList.contains("active")) {

            heart.classList.remove("active");
            heart.querySelector("i").classList.replace("fa-solid", "fa-regular");

            wishlist = wishlist.filter(item => item.name !== name);

        } else {

            heart.classList.add("active");
            heart.querySelector("i").classList.replace("fa-regular", "fa-solid");

            const active = card.querySelector(".size-btn.active");

            const size = active
                ? active.innerText
                : (card.querySelector(".size-btn")?.innerText || "");

            wishlist.push({
                name,
                price,
                img,
                size
            });

            showToast(name + " added to wishlist!", "success");
        }

        updateWishlist();
    }

});

function createMenuCard(item) {
    const isAvailable = item.available !== false && item.available !== "false";
    let sizeButtons = "";
    let defaultPrice = item.price;

    if (["Coffee", "Pizza", "Snacks"].includes(item.category)) {

        defaultPrice = item.smallPrice || item.price;

        sizeButtons = `
            <button class="size-btn" data-size="small">Small</button>
            <button class="size-btn" data-size="medium">Medium</button>
            <button class="size-btn" data-size="large">Large</button>
        `;

    }

    else if (item.category === "Dessert") {

        defaultPrice = item.onePcPrice || item.price;

        sizeButtons = `
            <button class="size-btn" data-size="1pc">1 Pc</button>
            <button class="size-btn" data-size="2pcs">2 Pcs</button>
            <button class="size-btn" data-size="4pcs">4 Pcs</button>
        `;

    }

    else if (item.category === "Garlic Bread") {

        defaultPrice = item.fourPcPrice || item.price;

        sizeButtons = `
            <button class="size-btn" data-size="4pcs">4 Pcs</button>
            <button class="size-btn" data-size="8pcs">8 Pcs</button>
            <button class="size-btn" data-size="12pcs">12 Pcs</button>
        `;

    }

    return `
        <div class="menu-card"
     data-id="${item._id}"
     data-category="${item.category.toLowerCase()}"
     data-small="${item.smallPrice || ''}"
     data-medium="${item.mediumPrice || ''}"
     data-large="${item.largePrice || ''}"
     data-1pc="${item.onePcPrice || ''}"
     data-2pcs="${item.twoPcPrice || ''}"
     data-4pcs="${item.fourPcPrice || ''}"
     data-8pcs="${item.eightPcPrice || ''}"
     data-12pcs="${item.twelvePcPrice || ''}">

            <div class="wishlist">
                <i class="fa-regular fa-heart"></i>
            </div>

            <img src="images/${item.image}"
            onerror="this.src='images/default-food.png'">

            <h3>${item.name}</h3>

            <div class="sizes">
                ${sizeButtons}
            </div>

            <h4 class="price">₹${defaultPrice}</h4>

            <a href="#" class="${isAvailable ? '' : 'out-of-stock'}">
    ${isAvailable ? 'Add to Cart' : 'Out of Stock'}
</a>

        </div>
    `;

}

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("toggle-password")) return;

    const input = e.target.previousElementSibling;

    if (!input) return;

    if (input.type === "password") {
        input.type = "text";
        e.target.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        input.type = "password";
        e.target.classList.replace("fa-eye-slash", "fa-eye");
    }

});

// ================= SHOW / HIDE PASSWORD =================

document.querySelectorAll(".toggle-password").forEach(icon => {

    icon.addEventListener("click", () => {

        const input = icon.previousElementSibling;

        if (input.type === "password") {

            input.type = "text";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        } else {

            input.type = "password";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        }

    });

});

// ================= UNIVERSAL SHOW / HIDE PASSWORD =================

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("toggle-password")) return;

    const input = e.target.previousElementSibling;

    if (!input) return;

    if (input.type === "password") {

        input.type = "text";

        e.target.classList.remove("fa-eye");
        e.target.classList.add("fa-eye-slash");

    } else {

        input.type = "password";

        e.target.classList.remove("fa-eye-slash");
        e.target.classList.add("fa-eye");

    }

});