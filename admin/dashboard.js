// ===== Admin Authentication =====
if (localStorage.getItem("adminLoggedIn") !== "true") {

    history.pushState(null, null, location.href);

    window.addEventListener("popstate", function () {

        history.pushState(null, null, location.href);
        window.location.replace("admin-login.html");

    }); 

    window.location.replace("admin-login.html");

}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function (e) {

        e.preventDefault();

        if (!confirm("Are you sure you want to logout?")) return;

        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("adminToken");
        sessionStorage.clear();

        history.replaceState(null, null, "admin-login.html");

        window.location.replace("admin-login.html");

    });

}

async function loadDashboardStats() {

    try {

        const res = await fetch("https://lotuscafe.onrender.com/api/dashboard/stats");

        const data = await res.json();

        if (!data.success) return;

        document.getElementById("totalOrders").innerText =
            data.totalOrders;

        document.getElementById("totalRevenue").innerText =
            "₹" + data.totalRevenue;

        document.getElementById("totalCustomers").innerText =
            data.totalUsers;

        document.getElementById("totalMenu").innerText =
            data.totalMenu;

        document.getElementById("totalContacts").innerText =
            data.totalContacts;

    } catch (err) {

        console.log(err);

    }

}

loadDashboardStats();

