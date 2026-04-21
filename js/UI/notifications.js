export function showToast(message, type = "success") {
    const toast = document.createElement("div");

    toast.classList.add("toast", `toast-${type}`);

    const icon = type === "success" ? "✔" : "⚠";

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    document.body.appendChild(toast);

    // animación de entrada
    setTimeout(() => {
        toast.classList.add("show");
    }, 50);

    // auto remove
    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2500);
}