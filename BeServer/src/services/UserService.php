<?php

class UserService {
    public function login(string $username, string $password): array {
        $pdo = getConnection();

        //echo password_hash("admin", PASSWORD_DEFAULT);

        // DB search
        $sql = "SELECT id, username, password FROM users WHERE username = :username";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // CHeck if user exists
        if (!$user) {
            return [
                "success" => false,
                "error" => "User not found",
                "message" => "User with this username:".$username." does not exists"
            ];
        }

        // Verify password
        if (!password_verify($password, $user['password'])) {
            return [
                "success" => false,
                "error" => "Invalid password"
            ];
        }

        return [
            "success" => true,
            "user_id" => $user['id'],
            "username" => $user['username']
        ];
    }

}