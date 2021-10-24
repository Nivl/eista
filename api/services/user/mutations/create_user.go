package mutations

import (
	"fmt"

	"github.com/Nivl/eista-api/graph/model"
	"github.com/Nivl/eista-api/services"
)

// CreateUser creates a new user
// The current user must be logged out
func CreateUser(c *services.Context, userData *model.NewUser) (*model.Me, error) {
	panic(fmt.Errorf("not implemented"))
}
