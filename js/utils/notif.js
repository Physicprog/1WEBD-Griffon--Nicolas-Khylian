export function sendNotification(message, color = true, duration = 3500) {
  const notification = document.getElementById("notification");
  const theNotification = document.getElementById("theNotification");
  if (color) {
    notification.style.borderTop = "5px solid #7CFC00";
    notification.style.boxShadow = "0 0 8px rgba(124, 252, 0, 0.2)";
  } else {
    notification.style.borderTop = "5px solid #FF4500";
    notification.style.boxShadow = "0 0 8px rgba(255, 69, 0, 0.2)";
  }

  theNotification.textContent = message;
  notification.classList.add("show");
  setTimeout(() => notification.classList.remove("show"), duration);
}
