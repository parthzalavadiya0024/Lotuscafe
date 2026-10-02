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

// ===== Order Analytics =====

async function loadOrderAnalytics() {

    try {

        const res = await fetch(
            "http://localhost:5000/api/dashboard/order-analytics"
        );

        const data = await res.json();

        if (!data.success) {
            console.error("Failed to load order analytics");
            return;
        }

        const monthlyOrders = data.monthlyOrders || [];

const filledMonthlyOrders = [];

const today = new Date();

for (let i = 11; i >= 0; i--) {

    const date = new Date(
        today.getFullYear(),
        today.getMonth() - i,
        1
    );

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const found = monthlyOrders.find(item =>
        item._id.year === year &&
        item._id.month === month
    );

    filledMonthlyOrders.push({
        _id: {
            year: year,
            month: month
        },
        orders: found ? found.orders : 0
    });
}

monthlyOrders.length = 0;
monthlyOrders.push(...filledMonthlyOrders);

        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // -----------------------------
        // Prepare monthly analysis
        // -----------------------------

        const analysis = monthlyOrders.map((item, index) => {

            const currentOrders = item.orders;

            const previousOrders =
                index > 0
                    ? monthlyOrders[index - 1].orders
                    : null;

            const difference =
                previousOrders !== null
                    ? currentOrders - previousOrders
                    : null;

            let growth = null;

            if (previousOrders !== null && previousOrders !== 0) {

                growth =
                    ((currentOrders - previousOrders) / previousOrders) * 100;

            }

            return {

                label: `${monthNames[item._id.month - 1]} ${item._id.year}`,

                orders: currentOrders,

                difference: difference,

                growth: growth

            };

        });


        // -----------------------------
        // Current / Previous month
        // -----------------------------

        if (analysis.length > 0) {

            const current = analysis[analysis.length - 1];

            document.getElementById("currentMonthOrders").textContent =
                current.orders;

            if (analysis.length > 1) {

                const previous = analysis[analysis.length - 2];

                document.getElementById("previousMonthOrders").textContent =
                    previous.orders;

                const difference =
                    current.orders - previous.orders;

                const differenceElement =
                    document.getElementById("orderDifference");

                if (difference > 0) {

    differenceElement.textContent = `↑ +${difference}`;
    differenceElement.style.color = "green";

} else if (difference < 0) {

    differenceElement.textContent = `↓ ${difference}`;
    differenceElement.style.color = "red";

} else {

    differenceElement.textContent = "→ 0";
    differenceElement.style.color = "#777";

}

                const growthElement =
                    document.getElementById("monthlyGrowth");

                if (previous.orders !== 0) {

                    const growth =
                        ((current.orders - previous.orders) /
                            previous.orders) * 100;

                    if (growth > 0) {

    growthElement.textContent =
        `↑ ${growth.toFixed(2)}%`;

    growthElement.style.color = "green";

} else if (growth < 0) {

    growthElement.textContent =
        `↓ ${growth.toFixed(2)}%`;

    growthElement.style.color = "red";

} else {

    growthElement.textContent = "→ 0%";
    growthElement.style.color = "#777";

}

                } else {

                    growthElement.textContent = "N/A";

                }

            }

        }


        // -----------------------------
        // Chart
        // -----------------------------

        const labels = analysis.map(item => item.label);

        const orderValues = analysis.map(item => item.orders);

        const chartCanvas =
            document.getElementById("monthlyOrdersChart");

        if (!chartCanvas) {

            console.error(
                "Monthly orders chart element not found"
            );

            return;

        }


        new Chart(chartCanvas, {

            type: "line",

            data: {

                labels: labels,

                datasets: [{

                    label: "Orders",

                    data: orderValues,

                    borderWidth: 3,

                    tension: 0.3,

                    fill: false,

                    pointRadius: 5,

                    pointHoverRadius: 7

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: true
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {
                            precision: 0
                        }

                    }

                }

            }

        });


        // -----------------------------
        // Month-wise Analysis Table
        // -----------------------------

        const tableBody =
            document.getElementById("monthlyAnalysisBody");

        if (tableBody) {

            tableBody.innerHTML = "";

            analysis.forEach(item => {

                const row =
                    document.createElement("tr");

                let differenceText = "-";
                let growthText = "-";

                if (item.difference !== null) {

                    differenceText =
                        item.difference > 0
                            ? `+${item.difference}`
                            : item.difference;

                }

                if (item.growth !== null) {

                    growthText =
                        `${item.growth.toFixed(2)}%`;

                }

                let differenceClass = "";
let growthClass = "";

if (item.difference > 0) {
    differenceClass = "growth-positive";
} else if (item.difference < 0) {
    differenceClass = "growth-negative";
}

if (item.growth > 0) {
    growthClass = "growth-positive";
} else if (item.growth < 0) {
    growthClass = "growth-negative";
}

row.innerHTML = `

    <td>${item.label}</td>

    <td>${item.orders}</td>

    <td class="${differenceClass}">
        ${differenceText}
    </td>

    <td class="${growthClass}">
        ${growthText}
    </td>

`;

                tableBody.appendChild(row);

            });

        }


        console.log(
            "Monthly Order Analysis:",
            analysis
        );


    } catch (err) {

        console.error(
            "Order Analytics Error:",
            err
        );

    }

}

loadOrderAnalytics();