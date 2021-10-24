package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/Nivl/eista-api/graph/generated"
	"github.com/Nivl/eista-api/graph/model"
	usermutations "github.com/Nivl/eista-api/services/user/mutations"
)

func (r *mutationResolver) CreateUser(ctx context.Context, userData *model.NewUser) (*model.Me, error) {
	r.
	return usermutations.CreateUser()
}

func (r *queryResolver) Health(ctx context.Context) (*model.Health, error) {
	return &model.Health{
		Status: "healthy",
	}, nil
}

func (r *queryResolver) Me(ctx context.Context) (*model.Me, error) {
	panic(fmt.Errorf("not implemented"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type (
	mutationResolver struct{ *Resolver }
	queryResolver    struct{ *Resolver }
)
