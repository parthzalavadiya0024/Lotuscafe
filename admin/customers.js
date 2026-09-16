// ===== Admin Authentication =====
if (localStorage.getItem("adminLoggedIn") !== "true") {

    history.pushState(null, null, location.href);

    window.addEventListener("popstate", function () {

        history.pushState(null, null, location.href);
        window.location.replace("admin-login.html");

    });

    window.location.replace("admin-login.html");

}

// ===== Elements =====
const searchInput = document.getElementById("searchCustomer");

const viewPopup = document.getElementById("viewPopup");
const closeView = document.getElementById("closeView");

const deletePopup = document.getElementById("deletePopup");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

let selectedRow = null;

// Close View
closeView.onclick = () => {
    viewPopup.style.display = "none";
};

// Cancel Delete
cancelDelete.onclick = () => {

    deletePopup.style.display = "none";

};

// Confirm Delete
confirmDelete.onclick = async () => {

    if (!selectedRow) return;

    try {

        const id = selectedRow.dataset.id;

        const res = await fetch(`https://lotuscafe.onrender.com/api/users/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (data.success) {

            selectedRow.remove();

        }

    } catch (err) {

        console.log(err);

    }

    deletePopup.style.display = "none";

    selectedRow = null;

};

// ===== Search =====
searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    document.querySelectorAll("#customerTable tr").forEach(row => {

        const name = row.cells[0].innerText.toLowerCase();

        row.style.display = name.includes(value) ? "" : "none";

    });

});

// ===== Close Popup Outside =====
window.onclick = function(e){

    if(e.target === viewPopup){
        viewPopup.style.display = "none";
    }

    if(e.target === deletePopup){
        deletePopup.style.display = "none";
    }

};

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

const tableBody = document.getElementById("customerTable");

let currentPage = 1;
const rowsPerPage = 10;
let allCustomers = [];

async function loadCustomers() {
    try {

        const [userRes, orderRes] = await Promise.all([
    fetch("https://lotuscafe.onrender.com/api/users"),
    fetch("https://lotuscafe.onrender.com/api/orders/all")
]);

const data = await userRes.json();
const orderData = await orderRes.json();

        if (!data.success) return;

        tableBody.innerHTML = "";

        allCustomers = data.users;

const start = (currentPage - 1) * rowsPerPage;
const end = start + rowsPerPage;

        allCustomers.slice(start, end).forEach(user => {

            const orderCount = orderData.orders.filter(order =>
    order.phone === user.phone
).length;

            tableBody.innerHTML += `
                <tr
                    data-id="${user._id}"
                    data-name="${user.fullName}"
                    data-email="${user.email}"
                    data-phone="${user.phone || "-"}"
                    data-date="${new Date(user.createdAt).toLocaleDateString()}"
                    data-orders="${orderCount}"
                >

                    <td>${user.fullName}</td>
                    <td>${user.email}</td>
                    <td>${user.phone || "-"}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>${orderCount}</td>

                    <td>

                        <button class="view-btn">
                            <i class="fas fa-eye"></i>
                        </button>

                        <button class="delete-btn">
                            <i class="fas fa-trash"></i>
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

loadCustomers();    

// ===== View & Delete (Dynamic Rows) =====

tableBody.addEventListener("click", async (e) => {

    // VIEW
    if (e.target.closest(".view-btn")) {

        const row = e.target.closest("tr");

        document.getElementById("popupName").innerText = row.dataset.name;
        document.getElementById("popupEmail").innerText = row.dataset.email;
        document.getElementById("popupPhone").innerText = row.dataset.phone;
        document.getElementById("popupDate").innerText = row.dataset.date;
        document.getElementById("popupOrders").innerText = row.dataset.orders;

        viewPopup.style.display = "flex";
    }

    // DELETE
    if (e.target.closest(".delete-btn")) {

        selectedRow = e.target.closest("tr");

        deletePopup.style.display = "flex";
    }

});

const pageInfo = document.getElementById("pageInfo");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");

function updatePagination() {

    const totalPages = Math.ceil(allCustomers.length / rowsPerPage);

    pageInfo.innerText = `Page ${currentPage} of ${totalPages || 1}`;

    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages || totalPages === 0;
}

prevPage.addEventListener("click", () => {

    if (currentPage > 1) {
        currentPage--;
        loadCustomers();
    }

});

nextPage.addEventListener("click", () => {

    const totalPages = Math.ceil(allCustomers.length / rowsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        loadCustomers();
    }

});