package service

import (
	"context"

	"github.com/Nivl/eista-api/services/user"
)

// Context represents the context needed by all the requests
type Context struct {
	User *user.User
	ctx  context.Context
}
