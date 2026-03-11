const STAR_PATH = "/public/images/"

export function renderRatingStars(rating) {

    // Convert value
    const starsValue = rating / 2;

    // Number of full stars = rating / 2 without remainder
    let fullStars = Math.floor(starsValue);
    // If remainder exists -> halfStar exists
    let halfStar = starsValue % 1 >= 0.5 ? 1 : 0;
    // Remaining stars = empty stars
    let emptyStars = 5 - fullStars - halfStar;

    let starsHTML = `<div class="rating-stars">`;

    for (let i = 0; i < fullStars; i++) {
        starsHTML += `<img src="${STAR_PATH}fullStar.png" class="star">`;
    }

    if (halfStar) {
        starsHTML += `<img src="${STAR_PATH}halfStar.png" class="star">`;
    }

    for (let i = 0; i < emptyStars; i++) {
        starsHTML += `<img src="${STAR_PATH}blankStar.png" class="star">`;
    }

    starsHTML += `</div>`;

    return starsHTML;
}