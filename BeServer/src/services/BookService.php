<?php

require_once __DIR__ . "/../config/database.php";

class BookService {

    //getAllBooks func, Returns all books and their basic info 
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

        $sql = "
            SELECT id, title, author, release_date, rating
            FROM books
            ORDER BY $sortColumn $sortOrder
        ";

        $stmt = $pdo->query($sql);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
