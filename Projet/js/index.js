import { sendNotification } from "./utils/notif.js";
import { initTheme } from "./utils/theme.js";

initTheme();


const testBtn = document.getElementById("test");
if (testBtn) {
  testBtn.addEventListener("click", () => {
    console.log("Test button clicked");
    sendNotification("Test notification: UI working", true);
  });
}



