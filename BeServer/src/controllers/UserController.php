<?php

require_once __DIR__ . '/../services/UserService.php';

class UserController {
    public function login($request, $response, $args) {
        $parsedBody = $request->getParsedBody(); // JSON expected (user details)

        $username = $parsedBody['username'] ?? '';
        $password = $parsedBody['password'] ?? '';

        $service = new UserService();
        $result = $service->login($username, $password);

        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }

}