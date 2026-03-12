import { getBook, addBook, updateBook } from "../api.js";
import { renderNavbar } from "../components/navbar.js";

// Example genre list
const GENRES = ["Fikce", "Fantasy", "Román", "Báseň", "Sci-fi", "Drama"];

export async function renderBookFormPage() {
    renderNavbar();

    const mainpage = document.getElementById("mainpage");
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("editBook");

    let bookData = {
        title: "",
        author: "",
        rating: 0,
        genre: GENRES[0],
        annotation: "",
        description: "",
        imgPath: "",
        releaseDate: ""
    };

    if (bookId) {
        try {
            const book = await getBook(bookId);
            bookData = { ...bookData, ...book };
        } catch (err) {
            console.error("Failed to fetch book data:", err);
        }
    }

    mainpage.innerHTML = `
    <div class="book-form-container">
        <h1>${bookId ? "Upravit knihu" : "Vytvořit novou knihu"}</h1>

        <form id="book-form">

            <div class="form-flex">

                <!-- IMAGE PREVIEW + DROP -->
                <div class="image-container">
                    <!-- CURRENT IMAGE PREVIEW -->
                    <img src="${bookData.imgPath || 'placeholder.jpg'}" alt="Cover Image" id="cover-preview"/>

                    <!-- NEW IMAGE DROP/SELECT CARD -->
                    <div class="image-drop-card" id="image-drop-card">
                        <input type="file" name="imgFile" id="imgFile" accept="image/*" />
                        <span>Přesuňte obrázek sem, nebo klikněte pro vybrání</span>
                    </div>
                </div>

                <!-- INPUTS -->
                <div class="inputs-card">
                    <label>Název</label>
                    <input type="text" name="title" maxlength="35" value="${bookData.title}" required />
                    <div class="char-counter" data-for="title"></div>

                    <label>Autor</label>
                    <input type="text" name="author" maxlength="35" value="${bookData.author}" required />
                    <div class="char-counter" data-for="author"></div>

                    <label>Žánr</label>
                    <select name="genre">
                        ${GENRES.map(g => `<option value="${g}" ${g === bookData.genre ? "selected" : ""}>${g}</option>`).join("")}
                    </select>

                    <label>Hodnocení</label>
                    <input type="number" name="rating" min="0" max="10" value="${bookData.rating}" required />

                    <label>Datum vydání</label>
                    <input type="text" name="releaseDate" value="${bookData.releaseDate}" placeholder="dd-mm-yyyy" />

                    <label>Anotace</label>
                    <textarea name="annotation" maxlength="255">${bookData.annotation}</textarea>
                    <div class="char-counter" data-for="annotation"></div>

                    <label>Popis</label>
                    <textarea name="description" maxlength="1000">${bookData.description}</textarea>
                    <div class="char-counter" data-for="description"></div>

                    <button type="submit">${bookId ? "Uložit změny" : "Vytvořit knihu"}</button>
                </div>
            </div>

        </form>
    </div>
    `;

    const form = document.getElementById("book-form");

    // LIVE IMAGE PREVIEW
    const coverPreview = document.getElementById("cover-preview");
    const imgInput = document.getElementById("imgFile");
    const imageDropCard = document.getElementById("image-drop-card");

    imgInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                //coverPreview.src = ev.target.result;
                imageDropCard.style.backgroundImage = `url(${ev.target.result})`;
                imageDropCard.querySelector("span").style.display = "none";
            };
            reader.readAsDataURL(file);
        }
    });

    /*
    CHARACTER LIMIT HANDLING
    */
    const limits = { title: 35, author: 35, annotation: 255, description: 1000 };
    Object.entries(limits).forEach(([name, max]) => {
        const field = form[name];
        const counter = form.querySelector(`.char-counter[data-for="${name}"]`);
        const updateCounter = () => {
            if (field.value.length > max) field.value = field.value.slice(0, max);
            counter.textContent = `${field.value.length}/${max}`;
            if (field.value.length === max) {
                field.classList.add("input-max");
                counter.classList.add("counter-max");
            } else {
                field.classList.remove("input-max");
                counter.classList.remove("counter-max");
            }
        };
        updateCounter();
        field.addEventListener("input", updateCounter);
    });

    /*
    RELEASE DATE VALIDATION
    */
    const releaseInput = form.releaseDate;
    releaseInput.addEventListener("input", () => {
        let val = releaseInput.value.replace(/[^0-9]/g, "");
        let newVal = "";
        if (val.length > 0) newVal += Math.min(parseInt(val[0]), 3);
        if (val.length > 1) newVal += newVal[0]==="3"?Math.min(parseInt(val[1]),1):val[1];
        if (val.length > 2) newVal += Math.min(parseInt(val[2]),1);
        if (val.length > 3) newVal += newVal[2]==="1"?Math.min(parseInt(val[3]),2):val[3];
        if (val.length > 4) newVal += val.slice(4,8);
        if (newVal.length > 2) newVal = newVal.slice(0,2)+"-"+newVal.slice(2);
        if (newVal.length > 5) newVal = newVal.slice(0,5)+"-"+newVal.slice(5);
        releaseInput.value = newVal;
    });

    /*
    RATING VALIDATION (0-10 only)
    */
    const ratingInput = form.rating;
    ratingInput.addEventListener("input", () => {
        ratingInput.value = ratingInput.value.replace(/[^0-9]/g, "");
        let val = ratingInput.value;
        if (val.length > 1 && val.startsWith("0")) val = val.slice(1);
        if (parseInt(val) > 10) val = "10";
        ratingInput.value = val;
    });

    /*
    FORM SUBMIT
    */
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const releaseDate = form.releaseDate.value.trim();

        formData.append("title", form.title.value.trim());
        formData.append("author", form.author.value.trim());
        formData.append("rating", parseInt(form.rating.value));
        formData.append("genre", form.genre.value);
        formData.append("annotation", form.annotation.value.trim());
        formData.append("description", form.description.value.trim());
        formData.append("release_date", releaseDate);

        if (imgInput.files[0]) formData.append("image", imgInput.files[0]);

        // Validate release date
        if (releaseDate && !/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/.test(releaseDate)) {
            alert("Release Date must be in format dd-mm-yyyy");
            return;
        }

        try {
            if (bookId) {
                await updateBook(bookId, formData);
                alert("Book updated successfully!");
            } else {
                await addBook(formData);
                alert("Book created successfully!");
            }
            window.location.href = "index.html";
        } catch (err) {
            console.error(err);
            alert("Failed to save book.");
        }
    });
}

renderBookFormPage();