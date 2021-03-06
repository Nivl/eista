package queries

import (
	"github.com/Nivl/eista-api/services"
	"github.com/Nivl/eista-api/services/user/payload"
)

// Me returns the current user
func Me(c *services.Context) (*payload.Me, error) {
	if c.User == nil {
		return nil, services.NewAuthenticationError("user not authenticated")
	}
	return &payload.Me{
		ID:    c.User.ID,
		Name:  c.User.Name,
		Email: c.User.Email,
	}, nil
}
