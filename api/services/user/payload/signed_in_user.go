package payload

import "github.com/Nivl/eista-api/services/user/models"

// SignedInUser represents a signed in user.
// This payload is returned after a successful sign in.
type SignedInUser struct {
	Me      Me      `json:"me"`
	Session Session `json:"session"`
}

// NewSignedInUser creates a new SignedInUser payload
func NewSignedInUser(u *models.User, token string) *SignedInUser {
	me := NewMe(u)
	sess := NewSession(token)

	siu := &SignedInUser{
		Me:      *me,
		Session: *sess,
	}

	return siu
}
