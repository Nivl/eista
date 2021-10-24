package mutations

import (
	"fmt"

	"github.com/Nivl/eista-api/services"
	"github.com/Nivl/eista-api/services/user/payload"
)

// CreateUserInput represents the data needed to create a new user
type CreateUserInput struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// CreateUserResponse represents the response of the operation
type CreateUserResponse interface{}

// CreateUser creates a new user
// The current user must be logged out
func CreateUser(c *services.Context, input CreateUserInput) (*payload.Me, error) {
	panic(fmt.Errorf("not implemented"))
}
