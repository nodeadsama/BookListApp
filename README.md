# BookList App
## Requirements

- **PHP 8+**
- **MySQL/MariaDB** (via XAMPP or similar)
- **Composer** (for PHP dependencies)
- Modern web browser for frontend (HTML/JS/CSS)

---
## Installation & Setup

### 1. Install XAMPP
- Download from [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html)

### 2. Install Composer
- Download from [https://getcomposer.org/download/](https://getcomposer.org/download/)
- Verify installation by running in Terminal:
```bash
composer --version
```
### 3. Clone the repository
```bash
git clone https://github.com/nodeadsama/BookListApp.git
```
### 4. Install PHP dependencies
```bash
// Navigate to BeServer folder
cd booklistapp/BeServer
// Install dependencies
composer install
```
### 5. Set up the database
- Open XAMPP control panel, start Apache and MySQL
- Open phpMyAdmin via XAMPP.
- Create a new database named: `booklistdb`
```bash
//DB Credentials if needed
$host = "localhost";
$db = "booklistdb";
$user = "root";
$pass = "";

```
### 6. Place BeServer in XAMPP
- Create new folder `BookListApp` inside `htdocs`
```bash
/Applications/XAMPP/htdocs/booklistapp
```
- Move all files from cloned git repo folder `BookListApp/BeServer/` to `htdocs/BookListApp/`
- Now BeServer runs on Apache
- It should look something like this:
 ```bash
../htdocs/BookListApp/----public/
                      /
                      /----src/
                      /
                      /----vendor/
                      /... 
```

### 7.Start the app
- Keep FeApp outside `htdocs`, maybe in some project folder,
- Now using some extension like `Live Server` for `VSCode`, we can open `index.html` throught `VSCode` explore with right click -> open with live server
```bash
../Projects/BookListApp/public/index.html
```
- Your browser will automatically open mainpage of the App

## Using App for the first time
- When opening App for the first time, there are no data in DB, so the page is nearly blank, for that purpose, there is `books.json` file inside `CookBookApp` folder.
- At the top of the screen, there is login buton, login as `admin:admin`, and mainpage admin version will be opened.
- There u should see, import books button, clicking it will open file explorer, where you choose path to `books.json`, which will polute DB with sample entries.
 

