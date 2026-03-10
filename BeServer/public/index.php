<?php

require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;

$app = AppFactory::create();

$app->setBasePath('/BookListApp/public');
$app->addBodyParsingMiddleware();

// CORS Middleware
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);

    return $response
        ->withHeader('Access-Control-Allow-Origin', '*') // allow all origins
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

$app->get('/hello', function ($request, $response, $args) {
    $response->getBody()->write("Hello from Slim!");
    return $response;
});

require_once __DIR__ . '/../src/Controllers/BookController.php';
require_once __DIR__ . '/../src/Controllers/UserController.php';
$bookController = new BookController();
$userController = new UserController();

// Books calls
$app->get('/books', [$bookController, 'getBooks']);
$app->get('/books/{id}', [$bookController, 'getBook']);

$app->post('/books/import', [$bookController, 'importBooks']);
$app->post('/books', [$bookController, 'addBook']);

$app->put('/books/{id}', [$bookController, 'updateBook']);

$app->delete('/books/{id}', [$bookController, 'deleteBook']);

// Users calls
$app->post('/auth/login', [$userController, 'login']);

$app->run();