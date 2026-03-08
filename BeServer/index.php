<?php

require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;

$app = AppFactory::create();

$app->setBasePath('/BookListApp/public');

$app->get('/hello', function ($request, $response, $args) {
    $response->getBody()->write("Hello from Slim!");
    return $response;
});


$app->run();