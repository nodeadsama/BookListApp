import { renderNavbar } from "../components/navbar.js";
import { renderRatingStars } from "../components/ratingStars.js";

import { getBook } from "../api.js";

export function renderBookDetailPage(bookId) {

    renderNavbar();

    const mainpage = document.getElementById("mainpage");

    getBook(bookId).then(book => {

        mainpage.innerHTML = `
            <div class="book-detail">
                <div class="book-detail__top">
                    <img src="${book.imgPath}" class="book-detail__img">

                    <div class="book-detail__info">
                        <h1>${book.title}</h1>
                        <h2>${book.author}</h2>

                        <p><b>Genre:</b> ${book.genre}</p>
                        <p><b>Release:</b> ${book.release_date}</p>
                        <p><b>Annotation:</b> ${book.annotation}</p>
                    </div>

                    <div class="book-detail__rating">
                        ${renderRatingStars(book.rating)}
                    </div>
                </div>

                <div class="book-detail__description">
                    ${book.description}
                </div>
            </div>
        `;

    });

}