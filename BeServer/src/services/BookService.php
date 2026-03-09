<?php

require_once __DIR__ . "/../config/database.php";

class BookService {

    // getAllBooks func, Returns all books and their basic info 
    public function getAllBooks($sortBy = 'title', $order = 'asc') {

        $pdo = getConnection();

        $allowedSortColumns = [
            'title' => 'title',
            'author' => 'author',
            'releaseDate' => 'release_date',
            'rating' => 'rating'
        ];

        $allowedOrder = ['asc', 'desc'];

        // Validate sorting column
        $sortColumn = $allowedSortColumns[$sortBy] ?? 'title';

        // Validate order
        $sortOrder = in_array(strtolower($order), $allowedOrder)
            ? strtoupper($order)
            : 'ASC';

        //DB search
        $sql = "
            SELECT 
                id, 
                title, 
                author, 
                release_date, 
                rating, 
                imgPath
            FROM books
            ORDER BY $sortColumn $sortOrder
        ";

        $stmt = $pdo->query($sql);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // getBookById func, Returns single book and all its info
    public function getBookById($id) {
        $pdo = getConnection();

        // DB search
        $sql = "
            SELECT 
                id,
                title,
                author,
                genre,
                release_date,
                rating,
                annotation,
                description,
                imgPath
            FROM books
            WHERE id = :id
        ";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // importBooks func, Imports JSON list of books into DB
    public function importBooks(array $books): array {
        $pdo = getConnection();
        $imported = [];
        $errors = [];

        foreach ($books as $index => $book) {
            
            // Validate required fields
            if (empty($book['title']) || empty($book['author']) || empty($book['genre'])) {
                $errors[] = [
                    "index" => $index,
                    "error" => "Required fields missing",
                    "message" => "Missing title, author, or genre"
                ];
                continue;
            }

            // Validate rating (Must be number between 0-10)
            if (isset($book['rating'])) {
                if (!is_numeric($book['rating']) || $book['rating'] < 0 || $book['rating'] > 10) {
                    $errors[] = [
                        "index" => $index,
                        "error" => "Invalid rating field",
                        "message" => "Rating must be a number between 0-10, included"
                    ];
                    continue;
                }
                $rating = $book['rating'];
            } else {
                //Rating = 0 if missing
                $rating = 0;
            }
            
            //DB insertion
            try {
                $sql = "
                    INSERT INTO books (title, author, genre, release_date, rating, annotation, description, imgPath)
                    VALUES (:title, :author, :genre, :release_date, :rating, :annotation, :description, :imgPath)
                ";

                $stmt = $pdo->prepare($sql);

                $stmt->execute([
                    'title' => $book['title'],
                    'author' => $book['author'],
                    'genre' => $book['genre'],
                    'release_date' => $book['release_date'] ?? null,
                    'rating' => $rating,
                    'annotation' => $book['annotation'] ?? null,
                    'description' => $book['description'] ?? null,
                    'imgPath' => $book['imgPath'] ?? null
                ]);

                $imported[] = [
                    'index' => $index,
                    'id' => $pdo->lastInsertId(),
                    'title' => $book['title']
                ];
            } catch (PDOException $e) {
                $errors[] = [
                    'index' => $index,
                    'message' => 'Database error: ' . $e->getMessage()
                ];
            }
        }

        return ['imported' => $imported, 'errors' => $errors];
    }

    // addBook func, Adds single book into DB
    public function addBook(array $book): array {
        $pdo = getConnection();

        // Validate required fields
        if (empty($book['title']) || empty($book['author']) || empty($book['genre'])) {
            return [
                "success" => false,
                "error" => "Required fields missing",
                "message" => "Missing title, author, or genre"
            ];
        }

        // Validate rating (Must be number between 0-10)
        if (isset($book['rating'])) {
            if (!is_numeric($book['rating']) || $book['rating'] < 0 || $book['rating'] > 10) {
                return [
                    "success" => false,
                    "error" => "Invalid rating field",
                    "message" => "Rating must be a number between 0-10, included"
                ];
            }
            $rating = $book['rating'];
        } else {
            // Rating = 0 if missing
            $rating = 0;
        }

        // DB insertion
        try {
            $sql = "
                INSERT INTO books 
                (title, author, genre, release_date, rating, annotation, description, imgPath)
                VALUES (:title, :author, :genre, :release_date, :rating, :annotation, :description, :imgPath)
            ";

            $stmt = $pdo->prepare($sql);

            $stmt->execute([
                'title' => $book['title'],
                'author' => $book['author'],
                'genre' => $book['genre'],
                'release_date' => $book['release_date'] ?? null,
                'rating' => $rating,
                'annotation' => $book['annotation'] ?? null,
                'description' => $book['description'] ?? null,
                'imgPath' => $book['imgPath'] ?? null
            ]);

            return [
                "success" => true,
                "id" => $pdo->lastInsertId(),
                "title" => $book['title']
            ];

        } catch (PDOException $e) {
            return [
                "success" => false,
                "error" => "Database error",
                "message" => $e->getMessage()
            ];
        }
    }

    public function updateBook($id, $data) {
        $pdo = getConnection();
        
        // Check if ID is number
        if (!is_numeric($id)) {
            return ["error" => "Invalid ID"];
        }

        // DB search
        $stmt = $pdo->prepare("SELECT * FROM books WHERE id = ?");
        $stmt->execute([$id]);
        $book = $stmt->fetch(PDO::FETCH_ASSOC);

        // Check if book with this ID exists
        if (!$book) {
            return [
                "error" => "Book not found",
                "Book Id" => $id
            ];
        }

        // Change provided fields
        $title = $data['title'] ?? $book['title'];
        $author = $data['author'] ?? $book['author'];
        $genre = $data['genre'] ?? $book['genre'];
        $rating = $data['rating'] ?? $book['rating'];
        $releaseDate = $data['release_date'] ?? $book['release_date'];
        $annotation = $data['annotation'] ?? $book['annotation'];
        $description = $data['description'] ?? $book['description'];

        $imgPath = $data['imgPath'] ?? $book['imgPath'];

        // Validate rating (must be between 0–10)
        if (!is_numeric($rating) || $rating < 0 || $rating > 10) {
            return [
                "success" => false,
                "error" => "Invalid rating field",
                "message" => "Rating must be a number between 0 and 10, included"
            ];
        }

        // DB update
        $sql = "UPDATE books
                SET title=?, author=?, genre=?, rating=?, release_date=?, annotation=?, description=?, imgPath=?
                WHERE id=?";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            $title,
            $author,
            $genre,
            $rating,
            $releaseDate,
            $annotation,
            $description,
            $imgPath,
            $id
        ]);

        return [
            "success" => true,
            "id" => $id
        ];
    }

}