package mutations

import (
	"fmt"

	"github.com/Nivl/eista-api/services"
)

// SignOut soft-removes the current session of the user
func SignOut(c *services.Context) error {
	if c.User == nil {
		return nil
	}
	query := `
		UPDATE user_sessions
			SET deleted_at = NOW()
		WHERE
			token=:token
	`
	_, err := c.DB.NamedExecContext(c.Ctx, query, map[string]interface{}{
		"token": c.SessionToken,
	})
	if err != nil {
		return fmt.Errorf("could not soft-delete session: %w", err)
	}

	return nil
}
