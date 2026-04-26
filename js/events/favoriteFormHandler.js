import { addFavorite } from "../storage/favoriteStorage.js";
import { showToast } from "../UI/notifications.js";

let pendingItem = null;
let pendingButton = null;

function createModalIfNotExists() {
    if (document.getElementById("fav-modal")) return;

    const modal = document.createElement("div");
    modal.id = "fav-modal";
    modal.className = "modal hidden";

    modal.innerHTML = `
    <div class="modal-content">
        <h2><i class="fas fa-bookmark"></i> Add to Favorites</h2>
        
        <div class="item-title-preview">
            <strong id="modal-item-title"></strong>
        </div>

        <!-- Prioridad -->
        <div class="form-group">
            <label>
                <i class="fas fa-chart-line"></i> Priority 
                <span class="required-field">*</span>
            </label>
            <div class="priority-container">
                <input type="range" id="priority" min="1" max="5" value="3" step="1">
                <span class="priority-value" id="priority-value">3</span>
            </div>
            <div class="priority-labels">
                <span>1 = Low</span>
                <span>3 = Medium</span>
                <span>5 = High</span>
            </div>
        </div>

        <!-- Categoria -->
        <div class="form-group">
            <label>
                <i class="fas fa-tag"></i> Category / Tag 
                <span class="required-field">*</span>
            </label>
            <select id="category" class="category-select">
                <option value="">-- Select a category --</option>
                <option value="Plan to Watch">Plan to Watch</option>
                <option value="Watching">Watching</option>
                <option value="Completed">Completed</option>
                <option value="Rewatching">Rewatching</option>
            </select>
            <input type="text" id="custom-category" class="custom-category-input" 
                   placeholder="Or write your own tag (max 30 chars)" maxlength="30">
        </div>

        <!-- Nota -->
        <div class="form-group">
            <label>
                <i class="fas fa-pencil-alt"></i> Personal Note
            </label>
            <textarea id="note" class="note-textarea" rows="3" maxlength="200" 
                      placeholder="Why do you like this? Favorite moment? Recommendation for others?"></textarea>
            <div class="char-counter">
                <span id="char-count">0</span>/200
            </div>
        </div>

        <div class="modal-actions">
            <button id="cancelFav">Cancel</button>
            <button id="confirmFav">Save to Favorites</button>
        </div>
    </div>
`;

    document.body.appendChild(modal);
    attachModalEvents();
    attachCharCounter();
    attachCategorySync();
    attachPrioritySlider();
}

function attachPrioritySlider() {
    const slider = document.getElementById("priority");
    const valueSpan = document.getElementById("priority-value");
    
    if (slider && valueSpan) {
        slider.addEventListener("input", () => {
            valueSpan.textContent = slider.value;
        });
    }
}

function attachCharCounter() {
    const textarea = document.getElementById("note");
    if (!textarea) return;
    
    textarea.addEventListener("input", () => {
        const count = textarea.value.length;
        const counter = document.getElementById("char-count");
        if (counter) counter.textContent = count;
    });
}

function attachCategorySync() {
    const select = document.getElementById("category");
    const customInput = document.getElementById("custom-category");
    
    if (!select || !customInput) return;
    
    select.addEventListener("change", () => {
        if (select.value !== "") {
            customInput.value = "";
        }
    });
    
    customInput.addEventListener("input", () => {
        if (customInput.value.trim() !== "") {
            select.value = "";
        }
    });
}

function getSelectedCategory() {
    const select = document.getElementById("category");
    const customInput = document.getElementById("custom-category");
    
    if (customInput.value.trim() !== "") {
        return customInput.value.trim();
    }
    
    if (select.value !== "") {
        return select.value;
    }
    
    return null;
}

function validateForm() {
    
    const priorityInput = document.getElementById("priority");
    const priority = parseInt(priorityInput.value);
    
    if (isNaN(priority) || priority < 1 || priority > 5) {
        showToast("Priority must be between 1 and 5", "error");
        return false;
    }
    
    
    const category = getSelectedCategory();
    if (!category || category.trim() === "") {
        showToast("Category is required", "error");
        return false;
    }
    
    if (category.length > 30) {
        showToast("Category is too long (max 30 characters)", "error");
        return false;
    }
    
    return true;
}

function attachModalEvents() {
    const modal = document.getElementById("fav-modal");
    const cancelBtn = document.getElementById("cancelFav");
    const confirmBtn = document.getElementById("confirmFav");

    cancelBtn.addEventListener("click", closeModal);

    confirmBtn.addEventListener("click", () => {
        if (!validateForm()) return;
        if (!pendingItem) return;

        const priority = parseInt(document.getElementById("priority").value);
        const category = getSelectedCategory();
        const note = document.getElementById("note").value.trim() || null;

        addFavorite({
            id: pendingItem.id,
            type: pendingItem.type,
            title: pendingItem.title,
            image: pendingItem.image,
            preferences: {
                priority: priority,
                category: category,
                note: note
            },
            createdAt: new Date().toISOString()
        });

        showToast(`"${pendingItem.title}" added! Priority: ${priority}/5`, "success");

        if (pendingButton) {
            pendingButton.classList.add('active');
            const icon = pendingButton.querySelector('i');
            if (icon) icon.className = 'fas fa-bookmark';
        }

        closeModal();
    });
}

export function openFavoriteModal(item, buttonElement = null) {
    createModalIfNotExists();
    
    const modal = document.getElementById("fav-modal");
    if (!modal) return;
    
    pendingItem = item;
    pendingButton = buttonElement;
    
    const titleElement = document.getElementById("modal-item-title");
    if (titleElement) titleElement.textContent = item.title;
    
    document.getElementById("priority").value = "3";
    document.getElementById("priority-value").textContent = "3";
    document.getElementById("category").value = "";
    document.getElementById("custom-category").value = "";
    document.getElementById("note").value = "";
    
    const counter = document.getElementById("char-count");
    if (counter) counter.textContent = "0";
    
    modal.classList.remove("hidden");
}

function closeModal() {
    const modal = document.getElementById("fav-modal");
    if (!modal) return;
    
    modal.classList.add("hidden");
    pendingItem = null;
    pendingButton = null;
}