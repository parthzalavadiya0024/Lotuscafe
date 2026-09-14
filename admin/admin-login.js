const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

togglePassword.addEventListener("click", () => {

    if(password.type==="password"){
        password.type="text";
        togglePassword.innerHTML='<i class="fa-solid fa-eye"></i>';
    }

    else{
        password.type="password";
        togglePassword.innerHTML='<i class="fa-solid fa-eye-slash"></i>';
    }
});

const form=document.getElementById("loginForm");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    try {

        const res = await fetch("http://localhost:5000/api/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password: pass
            })
        });

        const data = await res.json();

        if (data.success) {

            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("adminLoggedIn", "true");

            window.location.replace("dashboard.html");

        } else {

            document.getElementById("error").innerHTML = data.message;

        }

    } catch (err) {

        console.log(err);
        document.getElementById("error").innerHTML = "Server Error";

    }
});

const forgotLink = document.getElementById("forgotLink");
const forgotPopup = document.getElementById("forgotPopup");
const closeForgot = document.getElementById("closeForgot");

forgotLink.addEventListener("click", function(e){
    e.preventDefault();
    alert("Forgot Password Clicked");
    forgotPopup.style.display = "flex";
});

closeForgot.onclick = () => {
    forgotPopup.style.display = "none";
};

window.onclick = (e) => {
    if (e.target === forgotPopup) {
        forgotPopup.style.display = "none";
    }
};

const sendOtpBtn = document.getElementById("sendOtpBtn");

const forgotEmail = document.getElementById("forgotEmail");

const otpSection = document.getElementById("otpSection");

sendOtpBtn.addEventListener("click", async function () {

    const email = forgotEmail.value.trim();

    if (email === "") {
        alert("Please Enter Registered Email");
        return;
    }

    try {

        const res = await fetch("http://localhost:5000/api/admin/send-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (data.success) {

            alert("OTP Sent Successfully");

            forgotEmail.style.display = "none";
            sendOtpBtn.style.display = "none";
            otpSection.style.display = "block";

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.log(err);
        alert("Server Error");

    }

});

const verifyOtpBtn = document.getElementById("verifyOtpBtn");

const otpInput = document.getElementById("otpInput");

const resetSection = document.getElementById("resetSection");

verifyOtpBtn.addEventListener("click", async function () {

    const email = forgotEmail.value.trim();
    const otp = otpInput.value.trim();

    if (otp === "") {
        alert("Enter OTP");
        return;
    }

    try {

        const res = await fetch("http://localhost:5000/api/admin/verify-otp", {
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

            alert("OTP Verified");

            otpSection.style.display = "none";
            resetSection.style.display = "block";

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.log(err);

        alert("Server Error");

    }

});

const resetPasswordBtn = document.getElementById("resetPasswordBtn");

resetPasswordBtn.addEventListener("click", async function () {

    const email = forgotEmail.value.trim();

    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (newPassword === "") {
        alert("Enter New Password");
        return;
    }

    if (confirmPassword === "") {
        alert("Confirm Your Password");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Passwords Do Not Match");
        return;
    }

    try {

        const res = await fetch("http://localhost:5000/api/admin/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password: newPassword
            })
        });

        const data = await res.json();

        if (data.success) {

            alert("Password Reset Successfully");

            resetSection.style.display = "none";
            forgotPopup.style.display = "none";

            forgotEmail.value = "";
            otpInput.value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("confirmPassword").value = "";

            forgotEmail.style.display = "block";
            sendOtpBtn.style.display = "block";

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.log(err);
        alert("Server Error");

    }

});

// ================= ADMIN FORGOT PASSWORD EYE =================

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("admin-toggle-password")) return;

    const input = e.target.previousElementSibling;

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