package models

// Session represents a user session as stored in the database.
type Session struct {
	Token  string `db:"token"`
	UserID string `db:"user_id"`
}
