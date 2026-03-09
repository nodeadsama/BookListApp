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

    public function addBook($request, $response) {
        $parsedBody = $request->getParsedBody(); // JSON expected (book details)
        $uploadedFiles = $request->getUploadedFiles(); // Img expected (book picture)

        // Handle img
        $imgPath = null;
        if (!empty($uploadedFiles['image'])) {
            $image = $uploadedFiles['image'];
            if ($image->getError() === UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/../../public/images/';
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

                //Creates unique filename
                $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $image->getClientFilename());
                $image->moveTo($uploadDir . $filename);
                $imgPath = 'images/' . $filename;
            }
        }

        // Merge image path into parsedBody
        $parsedBody['imgPath'] = $imgPath;

        $result = $this->service->addBook($parsedBody);

        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function updateBook($request, $response, $args) {
        $id = $args['id'];

        $parsedBody = $request->getParsedBody(); // JSON expected (book details)
        $uploadedFiles = $request->getUploadedFiles(); // Img expected (book picture)

        // Handle img
        $imgPath = null;
        if (!empty($uploadedFiles['image'])) {
            $image = $uploadedFiles['image'];
            if ($image->getError() === UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/../../public/images/';
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

                //Creates unique filename
                $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $image->getClientFilename());
                $image->moveTo($uploadDir . $filename);
                $imgPath = 'images/' . $filename;
            }
        }

        // Merge image path into parsedBody
        $parsedBody['imgPath'] = $imgPath;

        $result = $this->service->updateBook($id, $parsedBody);

        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }
}