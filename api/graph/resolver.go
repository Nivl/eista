package graph

import "github.com/plaid/plaid-go/plaid"

//go:generate go run github.com/99designs/gqlgen

type Resolver struct {
	Plaid *plaid.APIClient
}
