import { renderMainPage } from "./pages/mainpage.js";
import { renderBookDetailPage } from "./pages/bookDetailPage.js";
import { renderBookFormPage } from "./pages/bookFormPage.js";


// Page/route navigation helper funcs
// Navigate bookDetail
export function goToBookDetail(bookId) {
    window.location.href = `index.html?book=${bookId}`;
}

// Navigate book create/edit
export function goToBookForm(bookId = null) {
    if (bookId) {
        window.location.href = `index.html?editBook=${bookId}`;
    } else {
        window.location.href = `index.html?createBook=true`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Fe App started");

    // Check URL params
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("book");
    const editBookId = params.get("editBook");
    const createBook = params.get("createBook");

    // Check if bookId exists -> render bookDetail
    if (bookId) {
        renderBookDetailPage(bookId);
    // Elif editBookId exists -> render bookFormPage (edit mode)    
    } else if (editBookId) {
        renderBookFormPage(editBookId);
    // Elif editBookId does not exists -> render bookFormPage (create mode)    
    } else if (createBook) {
        renderBookFormPage(); // Create mode
    // Else no params -> render mainpage    
    } else {
        renderMainPage();
    }
});