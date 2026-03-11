import { renderMainPage } from "./pages/mainpage.js";
import { renderBookDetailPage } from "./pages/bookDetailPage.js";

// Page/route navigation helper funcs
export function goToBookDetail(bookId) {
    window.location.href = `index.html?book=${bookId}`;
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Fe App started");

    // Check URL params
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("book");

    // Check if bookId exists -> render bookDetail
    if (bookId) {
        renderBookDetailPage(bookId);
    // If not -> render mainPage    
    } else {
        renderMainPage();
    }
});