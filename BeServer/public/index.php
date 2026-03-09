<?php

require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;

$app = AppFactory::create();

$app->setBasePath('/BookListApp/public');
$app->addBodyParsingMiddleware();

$app->get('/hello', function ($request, $response, $args) {
    $response->getBody()->write("Hello from Slim!");
    return $response;
});

require_once __DIR__ . '/../src/Controllers/BookController.php';
$bookController = new BookController();

$app->get('/books', [$bookController, 'getBooks']);
$app->get('/books/{id}', [$bookController, 'getBook']);

$app->post('/books/import', [$bookController, 'importBooks']);
$app->post('/books', [$bookController, 'addBook']);

$app->put('/books/{id}', [$bookController, 'updateBook']);

$app->delete('/books/{id}', [$bookController, 'deleteBook']);


$app->run();