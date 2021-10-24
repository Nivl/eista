CREATE TABLE IF NOT EXISTS users {
    `id` UUID PRIMARY KEY,
    `email` TEXT NOT NULL UNIQUE CHECK (char_length(`email`) <= 255),
    `password` TEXT NOT NULL CHECK (char_length(`password`) <= 255),
    `name` TEXT NOT NULL CHECK (char_length(`name`) <= 50),
};

CREATE TABLE IF NOT EXISTS user_sessions {
    `token` UUID PRIMARY KEY,
    `user_id` UUID NOT NULL REFERENCES users(id)),
};
