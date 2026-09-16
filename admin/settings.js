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
const adminName = document.getElementById("adminName");
const adminEmail = document.getElementById("adminEmail");
const adminPhone = document.getElementById("adminPhone");
const adminHeaderName = document.getElementById("adminHeaderName");

// ===== Load Admin Profile =====
async function loadAdminProfile() {

    try {

        const res = await fetch("https://lotuscafe.onrender.com/api/admin/profile");
        const data = await res.json();

        if (!data.success) {
            alert("Admin profile not found");
            return;
        }

        adminName.value = data.admin.name || "";
        adminEmail.value = data.admin.email || "";
        adminPhone.value = data.admin.phone || "";

        adminHeaderName.innerText = data.admin.name || "Admin";

    } catch (err) {

        console.log(err);
        alert("Unable to load profile");

    }

}

// Page Load
loadAdminProfile();

// ===== Save Profile =====
const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click", async () => {

    try {

        const res = await fetch("https://lotuscafe.onrender.com/api/admin/profile", {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name: adminName.value.trim(),
                email: adminEmail.value.trim(),
                phone: adminPhone.value.trim()

            })

        });

        const data = await res.json();

        if (data.success) {

            alert("Profile Updated Successfully!");

            await loadAdminProfile();

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.log(err);
        alert("Something went wrong!");

    }

});

// ===== Change Password =====

const currentPassword = document.getElementById("currentPassword");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

saveBtn.addEventListener("click", async () => {

    // Password change only if any password field is filled
    if (
        currentPassword.value ||
        newPassword.value ||
        confirmPassword.value
    ) {

        if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {

            alert("Please fill all password fields.");
            return;

        }

        if (newPassword.value !== confirmPassword.value) {

            alert("New Password and Confirm Password do not match.");
            return;

        }

        const res = await fetch("https://lotuscafe.onrender.com/api/admin/change-password", {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                currentPassword: currentPassword.value,
                newPassword: newPassword.value

            })

        });

        const data = await res.json();

        if (!data.success) {

            alert(data.message);
            return;

        }

        alert("Password Changed Successfully!");

        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";

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