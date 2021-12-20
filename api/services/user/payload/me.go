package payload

import "github.com/Nivl/eista-api/services/user/models"

// Me is a type representing the current user, that is safe to return
// to the client.
type Me struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

// NewMe creates a new Me payload from a user DB model
func NewMe(u *models.User) *Me {
	return &Me{
		ID:    u.ID,
		Name:  u.Name,
		Email: u.Email,
	}
}
