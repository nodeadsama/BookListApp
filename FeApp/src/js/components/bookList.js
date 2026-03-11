import { renderRatingStars } from "./ratingStars.js";
import { getBooks } from "../api.js";

// Keep track of sort and order
let currentSort = "title";
let currentOrder = "desc";

export function renderBookList(books, sortColumn = currentSort, sortOrder = currentOrder) {

    let html = `
        <table class="book-table">
            <thead>
                <tr>
                    <th>Cover</th>
                    <th data-sort="title" class="${sortColumn === "title" ? "active-sort" : ""}">
                        Title ${sortColumn === "title" ? (sortOrder === "asc" ? '▲' : '▼') : ''}
                    </th>
                    <th data-sort="author" class="${sortColumn === "author" ? "active-sort" : ""}">
                        Author ${sortColumn === "author" ? (sortOrder === "asc" ? '▲' : '▼') : ''}
                    </th>
                    <th data-sort="releaseDate" class="${sortColumn === "releaseDate" ? "active-sort" : ""}">
                        Release Date ${sortColumn === "releaseDate" ? (sortOrder === "asc" ? '▲' : '▼') : ''}
                    </th>
                    <th data-sort="rating" class="${sortColumn === "rating" ? "active-sort" : ""}">
                        Rating ${sortColumn === "rating" ? (sortOrder === "asc" ? '▲' : '▼') : ''}
                    </th>
                </tr>
            </thead>
            <tbody>
    `;

    books.forEach(book => {
        html += `
            <tr>
                <td><img src="${book.imgPath}" class="book-table__img"></td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.release_date}</td>
                <td>${renderRatingStars(book.rating)}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    return html;
}

export function enableBookSorting() {
    const bookListDiv = document.getElementById("book-list");
    if (!bookListDiv) return;

    const headers = bookListDiv.querySelectorAll(".book-table th[data-sort]");

    headers.forEach(header => {
        header.addEventListener("click", () => {
            const sortColumn = header.dataset.sort;

            // If same column, toggle order; else reset to 'asc'
            // Current sort clicked again -> toggle order
            if (currentSort === sortColumn) {
                currentOrder = currentOrder === "asc" ? "desc" : "asc";
            //Different sort clicked -> Change current sort    
            } else {
                currentSort = sortColumn;
                currentOrder = "asc";
            }

            // Fetch books with new sorting
            getBooks(currentSort, currentOrder).then(books => {
                bookListDiv.innerHTML = renderBookList(books, currentSort, currentOrder);
                // Reattach sorting after rerender
                enableBookSorting();
            });
        });
    });
}