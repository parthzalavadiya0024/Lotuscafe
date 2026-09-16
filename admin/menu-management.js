// ===== Admin Authentication =====
if (localStorage.getItem("adminLoggedIn") !== "true") {

    history.pushState(null, null, location.href);

    window.addEventListener("popstate", function () {

        history.pushState(null, null, location.href);
        window.location.replace("admin-login.html");

    });

    window.location.replace("admin-login.html");

}

// Elements
const popup = document.getElementById("popup");
const addBtn = document.querySelector(".add-btn");
const closeBtn = document.getElementById("closeBtn");
const saveBtn = document.getElementById("saveBtn");
const menuTable = document.getElementById("menuTable");
const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");

const categorySelect = document.getElementById("category");

const sizeGroups = document.querySelectorAll(".size-group");

const smlGroups = document.querySelectorAll(".sml-group");
const dessertGroups = document.querySelectorAll(".dessert-group");
const garlicGroups = document.querySelectorAll(".garlic-group");

function updatePriceFields() {

    // Hide all groups
    sizeGroups.forEach(group => {
        group.style.display = "none";
    });

    const category = categorySelect.value;

    if (category === "Coffee" || category === "Pizza" || category === "Snacks") {

        smlGroups.forEach(group => {
            group.style.display = "block";
        });

    }

    else if (category === "Dessert") {

        dessertGroups.forEach(group => {
            group.style.display = "block";
        });

    }

    else if (category === "Garlic Bread") {

        garlicGroups.forEach(group => {
            group.style.display = "block";
        });

        // Garlic Bread ma 4 Pcs pan dekhadavo
        document.getElementById("fourPcPrice").closest(".size-group").style.display = "block";

    }

}

let editRow = null;
let editId = null;

async function loadMenuItems() {

    try {

        const res = await fetch("https://lotuscafe.onrender.com/api/menu");

        const data = await res.json();

        if (!data.success) return;

        menuTable.innerHTML = "";

        data.menuItems.forEach(item => {

            menuTable.innerHTML += `
                <tr data-id="${item._id}">

                    <td>
                        <img src="../images/${item.image}" width="60">
                    </td>

                    <td>${item.name}</td>

                    <td>${item.category}</td>

                    <td>₹${item.price}</td>

                    <td>
                        <span class="${item.available ? "available" : "out"}">
                            ${item.available ? "Available" : "Out of Stock"}
                        </span>
                    </td>

                    <td>

                        <button class="edit">
                            <i class="fa-solid fa-pen"></i>
                        </button>

                        <button class="delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </td>

                </tr>
            `;

        });

    } catch (err) {

        console.log(err);

    }

}

// Open Popup
addBtn.addEventListener("click", () => {

    updatePriceFields();

    popup.style.display = "flex";
});

// Close Popup
closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
});

// Save Item
saveBtn.addEventListener("click", async () => {

    const foodName = document.getElementById("foodName").value.trim();
    const category = document.getElementById("category").value.trim();
    const price = document.getElementById("price").value.trim();
    const status = document.getElementById("status").value;
    const image = preview.src;
    const imageFile = imageInput.files[0];

    if (foodName === "" || category === "" || price === "") {
        alert("Please fill all fields.");
        return;
    }

    const statusClass = status === "Available" ? "available" : "out";

    const row = `
        <tr>
            <td><img src="${image}" width="60"></td>
            <td>${foodName}</td>
            <td>${category}</td>
            <td>₹${price}</td>
            <td><span class="${statusClass}">${status}</span></td>
            <td>
                <button class="edit">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button class="delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `;

    if (editRow) {

        try {

            console.log({
                small: document.getElementById("smallPrice").value,
                medium: document.getElementById("mediumPrice").value,
                large: document.getElementById("largePrice").value
            });

            

            const res = await fetch(`https://lotuscafe.onrender.com/api/menu/${editId}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: foodName,
                    category: category,
                    price: Number(price),

                    smallPrice: Number(document.getElementById("smallPrice")?.value || 0),
                    mediumPrice: Number(document.getElementById("mediumPrice")?.value || 0),
                    largePrice: Number(document.getElementById("largePrice")?.value || 0),

                    onePcPrice: Number(document.getElementById("onePcPrice")?.value || 0),
                    twoPcPrice: Number(document.getElementById("twoPcPrice")?.value || 0),
                    fourPcPrice: Number(document.getElementById("fourPcPrice")?.value || 0),

                    eightPcPrice: Number(document.getElementById("eightPcPrice")?.value || 0),
                    twelvePcPrice: Number(document.getElementById("twelvePcPrice")?.value || 0),

                    image: image.split("/").pop(),
                    available: status === "Available"

                })

            });

            const data = await res.json();

            if (data.success) {

                alert("Menu Item Updated Successfully");

                editRow = null;
                editId = null;

                loadMenuItems();

            } else {

                alert(data.message);

            }

        } catch (err) {

            console.log(err);

        }

    } else {

        try {

            const formData = new FormData();

            formData.append("name", foodName);
            formData.append("category", category);
            formData.append("price", Number(price));

            formData.append("smallPrice", Number(document.getElementById("smallPrice")?.value || 0));
            formData.append("mediumPrice", Number(document.getElementById("mediumPrice")?.value || 0));
            formData.append("largePrice", Number(document.getElementById("largePrice")?.value || 0));

            formData.append("onePcPrice", Number(document.getElementById("onePcPrice")?.value || 0));
            formData.append("twoPcPrice", Number(document.getElementById("twoPcPrice")?.value || 0));
            formData.append("fourPcPrice", Number(document.getElementById("fourPcPrice")?.value || 0));

            formData.append("eightPcPrice", Number(document.getElementById("eightPcPrice")?.value || 0));
            formData.append("twelvePcPrice", Number(document.getElementById("twelvePcPrice")?.value || 0));

            formData.append("available", status === "Available");

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await fetch("https://lotuscafe.onrender.com/api/menu/add", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data.success) {

                alert("Menu Item Added Successfully");

                loadMenuItems();

            } else {

                alert(data.message);

            }

        } catch (err) {

            console.log(err);

        }

    }

    // Clear Inputs
    document.getElementById("foodName").value = "";
    document.getElementById("category").value = "";
    document.getElementById("price").value = "";
    document.getElementById("status").value = "Available";
    imageInput.value = "";
    preview.src = "";
    preview.style.display = "none";

    popup.style.display = "none";
});

// Delete Item
menuTable.addEventListener("click", async (e) => {

    if (!e.target.closest(".delete")) return;

    const row = e.target.closest("tr");
    const id = row.dataset.id;

    if (!confirm("Delete this item?")) return;

    try {

        const res = await fetch(`https://lotuscafe.onrender.com/api/menu/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (data.success) {

            row.remove();
            alert("Menu Item Deleted Successfully");

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.log(err);

    }

});

// Edit Item
menuTable.addEventListener("click", async (e) => {

    if (e.target.closest(".edit")) {

        editRow = e.target.closest("tr");
        editId = editRow.dataset.id;

        document.getElementById("foodName").value =
            editRow.cells[1].innerText;

        document.getElementById("category").value =
            editRow.cells[2].innerText;

        document.getElementById("category").dispatchEvent(new Event("change"));

        document.getElementById("price").value =
            editRow.cells[3].innerText.replace("₹", "");

        document.getElementById("status").value =
            editRow.cells[4].innerText.trim();

        preview.src = editRow.cells[0].querySelector("img").src;
        preview.style.display = "block";

        // File input clear karo
        document.getElementById("image").value = "";

        const res = await fetch(`https://lotuscafe.onrender.com/api/menu/${editId}`);
        const data = await res.json();

        if (data.success) {

            const item = data.menuItem;

            document.getElementById("smallPrice").value = item.smallPrice || "";
            document.getElementById("mediumPrice").value = item.mediumPrice || "";
            document.getElementById("largePrice").value = item.largePrice || "";

            document.getElementById("onePcPrice").value = item.onePcPrice || "";
            document.getElementById("twoPcPrice").value = item.twoPcPrice || "";
            document.getElementById("fourPcPrice").value = item.fourPcPrice || "";

            document.getElementById("eightPcPrice").value = item.eightPcPrice || "";
            document.getElementById("twelvePcPrice").value = item.twelvePcPrice || "";

            updatePriceFields();
        }

        popup.style.display = "flex";

    }

});

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (file) {

        const reader = new FileReader();

        reader.onload = function (e) {

            preview.src = e.target.result;
            preview.style.display = "block";

        }

        reader.readAsDataURL(file);

    }

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

categorySelect.addEventListener("change", updatePriceFields);

updatePriceFields();

loadMenuItems();