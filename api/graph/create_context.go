package graph

import (
	"context"
	"encoding/base64"
	"errors"
	"strings"

	"github.com/Nivl/eista-api/services"
	"github.com/Nivl/eista-api/services/user/models"
)

func CreateContext(ctx context.Context, r *Resolver) (*services.Context, error) {
	c := &services.Context{
		Ctx: ctx,
		DB:  r.DB,
	}

	authHeader, ok := ctx.Value(ctxKeyHTTPAuth).(string)
	if ok && authHeader != "" {
		// the token has the following format:
		// base64("userID:sessionToken")
		// we need to decode it and split it so we can check the data in
		// the database to see if the user is using	the right token
		rawUIDAndToken, err := base64.StdEncoding.DecodeString(authHeader)
		if err != nil {
			// TODO(melvin): return custom error to user and log real error
			return nil, err
		}
		uidAndToken := strings.Split(string(rawUIDAndToken), ":")
		if len(uidAndToken) != 2 {
			return nil, errors.New("Invalid format")
		}
		var user models.User
		query := `
			SELECT u.*
			FROM users u
			LEFT JOIN user_sessions us
				ON u.id = us.user_id
			WHERE u.id=$1
				AND us.token=$2
				AND us.deleted_at IS NULL
				AND u.deleted_at IS NULL`
		err = r.DB.GetContext(ctx, &user, query, uidAndToken[0], uidAndToken[1])
		if err != nil {
			// TODO(melvin): return custom error to user and log real error
			// We probably always want to return a "invalid token" error
			return nil, err
		}
		c.User = &user
		c.SessionToken = uidAndToken[1]
	}
	return c, nil
}
