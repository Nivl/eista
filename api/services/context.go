package services

import (
	"context"

	"github.com/Nivl/eista-api/services/user/models"
)

// Context represents the context needed by all the requests
type Context struct {
	DB           DB
	User         *models.User
	Ctx          context.Context
	SessionToken string
}
