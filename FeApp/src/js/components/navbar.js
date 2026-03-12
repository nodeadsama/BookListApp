import { isAdmin, setAdminMode } from "../utils/admin.js";
import { loginUser } from "../api.js";

export function renderNavbar() {
    const navbar = document.getElementById("navbar");
    navbar.innerHTML = `
        <div class="navbar-left">
            <img id="home-btn" class="home-icon" src="images/homeIcon.png" alt="Home">
        </div>
        <div class="navbar-center">
            <h2>BookList App</h2>
        </div>
        <div class="navbar-right">
            <button 
                id="login-btn" 
                class="login-btn ${isAdmin() ? "logout" : ""}">
                ${isAdmin() ? "Logout" : "Login"}
            </button>
        </div>

        <!-- Login Modal -->
        <div id="login-modal" class="modal hidden">
            <div class="modal-content">
                <h2>Přihlášení do admin sekce</h2>
                <h3>
                    Pro přihlášení použijte:<br>
                    Username: "admin"<br>
                    Password: "admin"

                </h3>
                <input type="text" id="login-username" placeholder="Username">
                <input type="password" id="login-password" placeholder="Password">
                <div class="modal-buttons">
                    <button id="modal-login-btn">Login</button>
                    <button id="modal-cancel-btn">Cancel</button>
                </div>
                <p id="login-error" style="color:red; display:none;"></p>
            </div>
        </div>
    `;

    // Home button
    document.getElementById("home-btn").addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // Login button
    const loginBtn = document.getElementById("login-btn");
    const modal = document.getElementById("login-modal");
    const cancelBtn = document.getElementById("modal-cancel-btn");
    const modalLoginBtn = document.getElementById("modal-login-btn");
    const errorP = document.getElementById("login-error");

    // Login/logout button click
    loginBtn.addEventListener("click", () => {

        // If admin -> logout
        if (isAdmin()) {
            setAdminMode(false);
            window.location.reload();
            return;
        }
        // Else open modal
        modal.classList.remove("hidden");
        errorP.style.display = "none";
    });

    // Login modal, cancel button click
    cancelBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Login modal, login button click
    modalLoginBtn.addEventListener("click", async () => {
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        const result = await loginUser(username, password);

        if (result.success) {
            setAdminMode(true);
            modal.classList.add("hidden");
            loginBtn.textContent = "Admin";
            
            //Reload changes
            window.location.reload();
        } else {
            errorP.textContent = result.message || "Login failed";
            errorP.style.display = "block";
        }
    });
}