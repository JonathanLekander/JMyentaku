import { addFavorite } from "../storage/favoriteStorage.js";
import { showToast } from "../UI/notifications.js";

let pendingItem = null;

function createModalIfNotExists() {
    if (document.getElementById("fav-modal")) return;

    const modal = document.createElement("div");
    modal.id = "fav-modal";
    modal.className = "modal hidden";

    modal.innerHTML = `
    <div class="modal-content">
        <h2>Save to Favorites</h2>

        <input type="text" id="fullName" placeholder="Full name *" autocomplete="name">
        <input type="email" id="email" placeholder="Email *" autocomplete="email">
        <textarea id="message" maxlength="200" placeholder="Message (optional, max 200 chars)"></textarea>

        <div class="modal-actions">
            <button id="cancelFav">Cancel</button>
            <button id="confirmFav">Confirm</button>
        </div>
    </div>
`;

    document.body.appendChild(modal);

    attachModalEvents();
}

function attachModalEvents() {
    const modal = document.getElementById("fav-modal");

    const cancelBtn = document.getElementById("cancelFav");
    const confirmBtn = document.getElementById("confirmFav");

    cancelBtn.addEventListener("click", closeModal);

    confirmBtn.addEventListener("click", () => {
        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email) {
            alert("Name and email are required");
            return;
        }

        if (!isValidEmail(email)) {
            alert("Invalid email format");
            return;
        }

        if (message.length > 200) {
            alert("Message too long (max 200)");
            return;
        }

        if (!pendingItem) return;

        addFavorite({
            id: pendingItem.id,
            type: pendingItem.type,
            title: pendingItem.title,
            image: pendingItem.image,
            user: {
                fullName: name,
                email,
                message
            },
            createdAt: new Date().toISOString()
        });

        showToast("Added successfully!");

        closeModal();
    });
}

export function openFavoriteModal(item) {

    console.log("OPEN MODAL", item); // DEBUG

    createModalIfNotExists();

    const modal = document.getElementById("fav-modal");

    console.log("MODAL EN DOM:", modal); // 👈 DEBUG

    if (!modal) return;

    pendingItem = item;

    modal.classList.remove("hidden");
}

function closeModal() {
    const modal = document.getElementById("fav-modal");

    if (!modal) return;

    modal.classList.add("hidden");

    document.getElementById("fullName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";

    pendingItem = null;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}