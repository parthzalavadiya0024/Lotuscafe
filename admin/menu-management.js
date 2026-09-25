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

let menuPopupScrollY = 0;

function lockMenuPopupScroll() {
    menuPopupScrollY = window.scrollY;

    document.documentElement.classList.add("menu-popup-open");
    document.body.classList.add("menu-popup-open");

    document.body.style.top = `-${menuPopupScrollY}px`;
}

function unlockMenuPopupScroll() {
    document.documentElement.classList.remove("menu-popup-open");
    document.body.classList.remove("menu-popup-open");

    document.body.style.top = "";

    window.scrollTo(0, menuPopupScrollY);
}


// Open Popup
addBtn.addEventListener("click", () => {
    updatePriceFields();

    popup.style.display = "flex";

    lockMenuPopupScroll();
});


// Close Popup
closeBtn.addEventListener("click", () => {
    popup.style.display = "none";

    unlockMenuPopupScroll();
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
        lockMenuPopupScroll();

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

/* =========================================
   CUSTOM DROPDOWN FOR POPUP SELECTS
   ========================================= */

function createCustomDropdown(select) {

    if (select.dataset.customized === "true") {
        return;
    }

    select.dataset.customized = "true";

    const wrapper = document.createElement("div");
    wrapper.className = "custom-dropdown";

    const selected = document.createElement("div");
    selected.className = "custom-dropdown-selected";

    const optionsBox = document.createElement("div");
    optionsBox.className = "custom-dropdown-options";

    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(selected);
    wrapper.appendChild(optionsBox);

    wrapper.appendChild(select);

    /* Hide original select */
    select.style.display = "none";

    function refreshDropdown() {

        const selectedOption =
            select.options[select.selectedIndex];

        selected.textContent =
            selectedOption ? selectedOption.textContent : "";

        optionsBox.innerHTML = "";

        Array.from(select.options).forEach(option => {

            const optionDiv =
                document.createElement("div");

            optionDiv.className =
                "custom-dropdown-option";

            optionDiv.textContent =
                option.textContent;

            if (option.selected) {
                optionDiv.classList.add("active");
            }

            optionDiv.addEventListener("click", function (e) {

                e.stopPropagation();

                select.value = option.value;

                select.dispatchEvent(
                    new Event("change", { bubbles: true })
                );

                refreshDropdown();

                wrapper.classList.remove("open");
            });

            optionsBox.appendChild(optionDiv);
        });
    }

    selected.addEventListener("click", function (e) {

        e.stopPropagation();

        /* Close other dropdowns */
        document
            .querySelectorAll(".custom-dropdown.open")
            .forEach(dropdown => {

                if (dropdown !== wrapper) {
                    dropdown.classList.remove("open");
                }

            });

        wrapper.classList.toggle("open");
    });

    select.addEventListener("change", refreshDropdown);

    refreshDropdown();
}


/* Create custom dropdowns inside popup */
function initializeCustomDropdowns() {

    document
        .querySelectorAll(".popup-box select")
        .forEach(select => {
            createCustomDropdown(select);
        });
}


/* Close dropdown when clicking outside */
document.addEventListener("click", function () {

    document
        .querySelectorAll(".custom-dropdown.open")
        .forEach(dropdown => {
            dropdown.classList.remove("open");
        });

});


/* Initialize */
initializeCustomDropdowns();