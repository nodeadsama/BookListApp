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

    public function getBook($request, $response, $args)
    {
        $id = (int)$args['id'];

        $book = $this->service->getBookById($id);

        if (!$book) {
            $response->getBody()->write(
                json_encode([
                    "error" => "Book not found",
                    "Book Id" => $id  
                ])
            );

            return $response
                ->withStatus(404)
                ->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(
            json_encode($book)
        );

        return $response->withHeader('Content-Type', 'application/json');
    }
}