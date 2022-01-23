package models

// User represents a user as stored in the database.
type User struct {
	ID           string `db:"id"`
	Name         string `db:"name"`
	Email        string `db:"email"`
	Password     string `db:"password"`
	HasOnboarded bool   `db:"HasOnboarded"`
}
