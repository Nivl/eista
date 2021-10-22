package mutations

import (
	"context"
	"fmt"

	"github.com/Nivl/eista-api/graph/model"
)

// CreateUser creates a new user
// The current user must be logged out
func CreateUser(ctx context.Context, userData *model.NewUser) (*model.Me, error) {
	panic(fmt.Errorf("not implemented"))
}
