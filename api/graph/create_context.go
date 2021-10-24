package graph

import (
	"context"
	"encoding/base64"

	"github.com/Nivl/eista-api/services"
)

func CreateContext(ctx context.Context, r *Resolver) (*services.Context, error) {
	c := &services.Context{
		Ctx: ctx,
		DB:  r.DB,
	}

	k, ok := ctx.Value(ctxKeyHTTPAuth).(string)
	if ok {
		// the token has the following format:
		// base64("userID:sessionToken")
		sDec, err := base64.StdEncoding.DecodeString(sEnc)
		if err != nil {
			
		}
		var u *user.User
		query := "SELECT"
		r.DB.GetContext(ctx, &u, query, args ...interface{})
	}
	return c, nil
}
