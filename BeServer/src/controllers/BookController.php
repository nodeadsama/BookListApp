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

    public function getBook($request, $response, $args) {
        $id = (int)$args['id'];

        $book = $this->service->getBookById($id);

        //Check if book exists
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

    public function importBooks($request, $response) {
        $data = $request->getParsedBody(); // JSON expected (list of books)

        //Validate books (list of books expected)
        if (!isset($data['books']) || !is_array($data['books'])) {
            $response->getBody()->write(
                json_encode([
                    "error" => "Wrong request",
                    "Message" => "JSON with list of books expected"
                ])
            );
            return $response
                ->withStatus(400)
                ->withHeader('Content-Type', 'application/json');
        }

        $result = $this->service->importBooks($data['books']);

        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }
}