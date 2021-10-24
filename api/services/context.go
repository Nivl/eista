package services

import (
	"context"

	"github.com/Nivl/eista-api/services/user"
)

// Context represents the context needed by all the requests
type Context struct {
	DB   DB
	User *user.User
	Ctx  context.Context
}
