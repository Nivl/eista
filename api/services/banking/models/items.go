package models

// Items represents a user banking item as stored in the database.
type Items struct {
	ItemID      string `db:"plaid_item_id"`
	UserID      string `db:"user_id"`
	AccessToken string `db:"plaid_access_token"`
}
