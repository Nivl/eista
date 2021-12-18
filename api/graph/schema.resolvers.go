package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/Nivl/eista-api/graph/generated"
	"github.com/Nivl/eista-api/graph/model"
	"github.com/plaid/plaid-go/plaid"
)

func (r *mutationResolver) CreatePlaidLinkToken(ctx context.Context) (*model.PlaidLinkToken, error) {
	plaiResp, _, err := r.Plaid.PlaidApi.LinkTokenCreate(ctx).Execute()
	if err != nil {
		return nil, err
	}
	return &model.PlaidLinkToken{
		Token: plaiResp.LinkToken,
	}, nil
}

func (r *mutationResolver) PersistPlaidPublicToken(ctx context.Context, input model.PlaidPublicToken) (bool, error) {
	req := r.Plaid.PlaidApi.ItemPublicTokenExchange(ctx)
	req.ItemPublicTokenExchangeRequest(plaid.ItemPublicTokenExchangeRequest{})
}

func (r *queryResolver) Health(ctx context.Context) (*model.Health, error) {
	return &model.Health{
		Status: "healthy",
	}, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type (
	mutationResolver struct{ *Resolver }
	queryResolver    struct{ *Resolver }
)
