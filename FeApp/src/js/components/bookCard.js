import { renderRatingStars } from "./ratingStars.js";

export function renderBookCard(book) {
    return `
        <div class="book-card">
            <img src="${book.imgPath}" class="book-card__img" data-id="${book.id}">
            <h3 class="book-card__title">${book.title}</h3>
            <p class="book-card__author">${book.author}</p>
            <div class="book-card__rating">
                ${renderRatingStars(book.rating)}
            </div>
        </div>
    `;
}