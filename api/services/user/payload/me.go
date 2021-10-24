package payload

// Me is a type representing the current user, that is safe to return
// to the client.
type Me struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}
