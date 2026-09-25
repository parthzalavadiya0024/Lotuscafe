// ===== Admin Authentication =====
if (localStorage.getItem("adminLoggedIn") !== "true") {

    history.pushState(null, null, location.href);

    window.addEventListener("popstate", function () {

        history.pushState(null, null, location.href);
        window.location.replace("admin-login.html");

    });

    window.location.replace("admin-login.html");

}

closeView.addEventListener("click", () => {

    viewPopup.style.display = "none";

}); 

let selectedRow = null;

noDelete.addEventListener("click", () => {

    deletePopup.style.display = "none";

});

yesDelete.addEventListener("click", async () => {

    if (!selectedRow) return;

    try {

        const id = selectedRow.dataset.id;

        const res = await fetch(
            `https://lotuscafe.onrender.com/api/orders/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await res.json();

        if (data.success) {

            loadOrders();

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.log(err);

    }

    deletePopup.style.display = "none";

    selectedRow = null;

});

const tableBody = document.getElementById("ordersTable");

let currentPage = 1;
const rowsPerPage = 10;
let allOrders = [];

async function loadOrders() {

    try {

        const res = await fetch("https://lotuscafe.onrender.com/api/orders/all");

        const data = await res.json();

        if (!data.success) return;

        tableBody.innerHTML = "";

        allOrders = data.orders;

const start = (currentPage - 1) * rowsPerPage;
const end = start + rowsPerPage;

        // ===== Dashboard Cards =====

document.getElementById("totalOrders").innerText = data.orders.length;

const pending = data.orders.filter(order =>
    order.status === "Pending"
).length;

document.getElementById("pendingOrders").innerText = pending;

const delivered = data.orders.filter(order =>
    order.status === "Delivered"
).length;

document.getElementById("deliveredOrders").innerText = delivered;

const today = new Date().toDateString();

let revenue = 0;

allOrders.slice(start, end).forEach(order => {

    if (
        order.status === "Delivered" &&
        new Date(order.createdAt).toDateString() === today
    ) {
        revenue += order.total;
    }

});

document.getElementById("todayRevenue").innerText = "₹" + revenue;

        allOrders.slice(start, end).forEach(order => {

            tableBody.innerHTML += `
                <tr
    data-id="${order._id}"
    data-orderid="${order.orderId}"
    data-name="${order.customerName}"
    data-phone="${order.phone}"
    data-ordertype="${order.orderType}"
    data-table="${order.tableNumber || "-"}"
    data-address="${order.deliveryAddress || "-"}"
    data-items='${JSON.stringify(order.items)}'
    data-payment="${order.paymentMethod}"
    data-total="${order.total}"
    data-status="${order.status}"
    data-subtotal="${order.subtotal}"
    data-gst="${order.gst}"
    data-discount="${order.discount}"
    data-delivery="${order.deliveryCharge}"
>

                    <td>${order.orderId}</td>

                    <td>${order.customerName}</td>

                    <td>
    ${order.items.map(item =>
        `${item.name} (${item.quantity})`
    ).join(", ")}
</td>

                    <td>₹${order.total}</td>

                    <td>${order.paymentMethod}</td>

                    <td>
    <select class="status-select" data-id="${order._id}">
        <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
        <option value="Preparing" ${order.status === "Preparing" ? "selected" : ""}>Preparing</option>
        <option value="Ready" ${order.status === "Ready" ? "selected" : ""}>Ready</option>
        <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
        <option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
    </select>
</td>

                    <td>

                        <button class="edit view-btn">
                            <i class="fa-solid fa-eye"></i>
                        </button>

                        <button class="delete delete-btn">
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </td>

                </tr>
            `;

        });

        updatePagination();

    } catch (err) {

        console.log(err);

    }

}

loadOrders();

tableBody.addEventListener("change", async (e) => {

    if (!e.target.classList.contains("status-select")) return;

    const id = e.target.dataset.id;
    const status = e.target.value;

    try {

        const res = await fetch(
            `https://lotuscafe.onrender.com/api/orders/status/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            }
        );

        const data = await res.json();

        if (!data.success) {
            alert("Status update failed!");
        }

    } catch (err) {
        console.log(err);
    }

});

tableBody.addEventListener("click", (e) => {

    if (e.target.closest(".view-btn")) {

        const row = e.target.closest("tr");

        document.getElementById("popupOrderId").innerText =
    row.dataset.orderid;

        document.getElementById("popupCustomer").innerText =
            row.dataset.name;

        document.getElementById("popupPhone").innerText =
            row.dataset.phone;

        if (row.dataset.ordertype === "Delivery") {

            document.getElementById("popupAddress").innerText =
                row.dataset.address;

        } else {

            document.getElementById("popupAddress").innerText =
                "Table No : " + row.dataset.table;

        }

        const items = JSON.parse(row.dataset.items);

        document.getElementById("popupItems").innerHTML =
            items.map(item =>
                `${item.name} (${item.size}) × ${item.quantity}`
            ).join("<br>");

        document.getElementById("popupSubtotal").innerText =
            row.dataset.subtotal;

        document.getElementById("popupGST").innerText =
            row.dataset.gst;

        document.getElementById("popupDiscount").innerText =
            row.dataset.discount;    

        document.getElementById("popupTotal").innerText =
            "₹" + row.dataset.total;

        document.getElementById("popupPayment").innerText =
            row.dataset.payment;

        document.getElementById("popupStatus").innerText =
            row.dataset.status;

        viewPopup.style.display = "flex";

    }

});

tableBody.addEventListener("click", (e) => {

    if (e.target.closest(".delete-btn")) {

        selectedRow = e.target.closest("tr");

        deletePopup.style.display = "flex";

    }

});

const searchInput = document.getElementById("searchOrder");


searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    const rows = document.querySelectorAll("#ordersTable tr");

    rows.forEach(row => {

        const text = row.innerText.toLowerCase();

        row.style.display = text.includes(value) ? "" : "none";

    });

});

const filter = document.getElementById("statusFilter");

filter.addEventListener("change", () => {

    const selected = filter.value;

    const rows = document.querySelectorAll("#ordersTable tr");

    rows.forEach(row => {

        if (selected === "all") {
            row.style.display = "";
            return;
        }

        const statusSelect = row.querySelector(".status-select");

        if (!statusSelect) return;

        if (statusSelect.value === selected) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

});

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function (e) {

        e.preventDefault();

        if (!confirm("Are you sure you want to logout?")) return;

        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("adminToken");
        sessionStorage.clear();

        window.location.replace("admin-login.html");

    });

}

const pageInfo = document.getElementById("pageInfo");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");

function updatePagination() {

    const totalPages = Math.ceil(allOrders.length / rowsPerPage);

    pageInfo.innerText = `Page ${currentPage} of ${totalPages || 1}`;

    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages || totalPages === 0;
}

prevPage.addEventListener("click", () => {

    if (currentPage > 1) {
        currentPage--;
        loadOrders();
    }

});

nextPage.addEventListener("click", () => {

    const totalPages = Math.ceil(allOrders.length / rowsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        loadOrders();
    }

});

/* =========================================
   ORDER POPUP - BACKGROUND SCROLL LOCK
   ========================================= */

let orderPopupScrollY = 0;

function lockOrderPopupScroll() {

    orderPopupScrollY = window.scrollY;

    document.documentElement.classList.add("order-popup-open");
    document.body.classList.add("order-popup-open");

    document.body.style.top = `-${orderPopupScrollY}px`;
}

function unlockOrderPopupScroll() {

    document.documentElement.classList.remove("order-popup-open");
    document.body.classList.remove("order-popup-open");

    document.body.style.top = "";

    window.scrollTo(0, orderPopupScrollY);
}


/* Watch Order Details Popup */
const orderViewPopup = document.getElementById("viewPopup");

if (orderViewPopup) {

    const orderPopupObserver = new MutationObserver(() => {

        const isOpen =
            getComputedStyle(orderViewPopup).display !== "none";

        if (isOpen) {
            lockOrderPopupScroll();
        } else {
            unlockOrderPopupScroll();
        }

    });

    orderPopupObserver.observe(orderViewPopup, {
        attributes: true,
        attributeFilter: ["style", "class"]
    });
}