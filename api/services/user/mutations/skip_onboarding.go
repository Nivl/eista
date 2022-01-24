package mutations

import (
	"fmt"

	"github.com/Nivl/eista-api/services"
	"github.com/Nivl/eista-api/services/user/payload"
)

// SkipOnboarding mark a user as being onboarded even if they didn't
// do the onboarding
func SkipOnboarding(c *services.Context) (*payload.Me, error) {
	if c.User == nil {
		return nil, services.NewAuthenticationError("user is mot logged in")
	}

	// No need to add load on the db if the user has already onboarded
	if c.User.HasOnboarded {
		return payload.NewMe(c.User), nil
	}

	query := `
		UPDATE users
		SET has_onboarded = true
		WHERE id = :id`

	_, err := c.DB.NamedExecContext(c.Ctx, query, map[string]interface{}{
		"id": c.User.ID,
	})
	if err != nil {
		return nil, fmt.Errorf("couldn't skip the onboarding: %w", err)
	}

	c.User.HasOnboarded = true
	return payload.NewMe(c.User), nil
}
