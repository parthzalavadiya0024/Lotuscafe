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
const searchInput = document.getElementById("searchReview");
const ratingFilter = document.getElementById("ratingFilter");

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

        const res = await fetch(`https://lotuscafe.onrender.com/api/reviews/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (data.success) {

    loadReviews();

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

    document.querySelectorAll("#reviewTable tr").forEach(row => {

        const customer =
            row.cells[0].innerText.toLowerCase();

        row.style.display =
            customer.includes(value) ? "" : "none";

    });

});

// ===== Rating Filter =====
ratingFilter.addEventListener("change", () => {

    const value = ratingFilter.value;

    document.querySelectorAll("#reviewTable tr").forEach(row => {

        if (value === "all") {

            row.style.display = "";

        } else {

            row.style.display =
                row.dataset.rating === value ? "" : "none";

        }

    });

});

// ===== Close Popup Outside =====
window.onclick = function (e) {

    if (e.target === viewPopup) {

        viewPopup.style.display = "none";

    }

    if (e.target === deletePopup) {

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

const tableBody = document.getElementById("reviewTable");

let currentPage = 1;
const rowsPerPage = 10;
let allReviews = [];

async function loadReviews() {

    try {

        const res = await fetch("https://lotuscafe.onrender.com/api/reviews/all");

        const data = await res.json();

        if (!data.success) return;

        tableBody.innerHTML = "";
        allReviews = data.reviews;

const start = (currentPage - 1) * rowsPerPage;
const end = start + rowsPerPage;

        let totalReviews = data.reviews.length;
        let totalRating = 0;
        let fiveStarReviews = 0;

        allReviews.slice(start, end).forEach(review => {

            totalRating += review.rating;

            if (review.rating === 5) {
               fiveStarReviews++;
            }

            let stars = "";

            for (let i = 0; i < review.rating; i++) {
                stars += "⭐";
            }

            tableBody.innerHTML += `

                <tr
                    data-id="${review._id}"
                    data-customer="${review.name}"
                    data-rating="${stars}"
                    data-review="${review.review}"
                    data-date="${new Date(review.createdAt).toLocaleDateString()}"
                >

                    <td>${review.name}</td>

                    <td>${stars}</td>

                    <td>${review.review}</td>

                    <td>${new Date(review.createdAt).toLocaleDateString()}</td>

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

        const average =
    totalReviews > 0
        ? (totalRating / totalReviews).toFixed(1)
        : 0;

document.getElementById("totalReviews").innerText = totalReviews;

document.getElementById("averageRating").innerText = average;

document.getElementById("fiveStarReviews").innerText = fiveStarReviews;

updatePagination();

    } catch (err) {

        console.log(err);

    }

}

loadReviews();

// ===== Dynamic View & Delete =====

tableBody.addEventListener("click", (e) => {

    // VIEW
    if (e.target.closest(".view-btn")) {

        const row = e.target.closest("tr");

        document.getElementById("popupCustomer").innerText = row.dataset.customer;
        document.getElementById("popupRating").innerText = row.dataset.rating;
        document.getElementById("popupDate").innerText = row.dataset.date;
        document.getElementById("popupReview").innerText = row.dataset.review;

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

    const totalPages = Math.ceil(allReviews.length / rowsPerPage);

    pageInfo.innerText = `Page ${currentPage} of ${totalPages || 1}`;

    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages || totalPages === 0;
}

prevPage.addEventListener("click", () => {

    if (currentPage > 1) {
        currentPage--;
        loadReviews();
    }

});

nextPage.addEventListener("click", () => {

    const totalPages = Math.ceil(allReviews.length / rowsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        loadReviews();
    }

});

