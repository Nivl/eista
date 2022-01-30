package graph

import (
	"context"
	"database/sql"
	"errors"
	"strings"

	"github.com/Nivl/eista-api/services"
	"github.com/Nivl/eista-api/services/user/models"
	"github.com/google/uuid"
)

// CreateContext creates a Context used to interact with the
// services
func CreateContext(ctx context.Context, r *Resolver) (*services.Context, error) {
	c := &services.Context{
		Ctx:   ctx,
		DB:    r.DB,
		Plaid: r.Plaid,
	}

	authHeader, ok := ctx.Value(ctxKeyHTTPAuth{}).(string)
	if ok && authHeader != "" {
		// the token has the following format:
		// Bearer sessionToken
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return nil, services.NewAuthenticationError("Invalid authorization format")
		}
		sessionToken := strings.TrimPrefix(authHeader, "Bearer ")
		if _, err := uuid.Parse(sessionToken); err != nil {
			return nil, services.NewAuthenticationError("Invalid authorization format")
		}
		var user models.User
		query := `
			SELECT u.*
			FROM users u
			LEFT JOIN user_sessions us
				ON u.id = us.user_id
			WHERE us.token=$1
				AND us.deleted_at IS NULL
				AND u.deleted_at IS NULL`
		err := r.DB.GetContext(ctx, &user, query, sessionToken)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return nil, services.NewAuthenticationError("token invalid or expired")
			}
			// TODO(melvin): return custom error to user and log real error
			// We probably always want to return a "invalid token" error
			return nil, err
		}
		c.User = &user
		c.SessionToken = sessionToken
	}
	return c, nil
}
