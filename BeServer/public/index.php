<?php

require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;

$app = AppFactory::create();

$app->setBasePath('/BookListApp/public');

$app->get('/hello', function ($request, $response, $args) {
    $response->getBody()->write("Hello from Slim!");
    return $response;
});

require_once __DIR__ . '/../src/Controllers/BookController.php';
$bookController = new BookController();

$app->get('/books', [$bookController, 'getBooks']);
$app->get('/books/{id}', [$bookController, 'getBook']);

$app->run();