<?php

require_once __DIR__ . "/../Services/BookService.php";

class BookController {

    private BookService $service;

    public function __construct() {
        $this->service = new BookService();
    }

    public function getBooks($request, $response) {

        $queryParams = $request->getQueryParams();

        $sortBy = $queryParams['sort'] ?? 'title';
        $order = $queryParams['order'] ?? 'asc';

        $books = $this->service->getAllBooks($sortBy, $order);

        $response->getBody()->write(
            json_encode($books)
        );

        return $response->withHeader('Content-Type', 'application/json');
    }
}