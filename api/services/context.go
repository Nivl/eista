package services

import (
	"context"

	"github.com/Nivl/eista-api/services/user/models"
	"github.com/plaid/plaid-go/plaid"
)

// Context represents the context needed by all the requests
type Context struct {
	DB           DB
	Plaid        *plaid.APIClient
	User         *models.User
	Ctx          context.Context
	SessionToken string
}
