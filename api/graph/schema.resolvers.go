package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/Nivl/eista-api/graph/generated"
	"github.com/Nivl/eista-api/graph/model"
	"github.com/Nivl/eista-api/services/user/mutations"
	"github.com/Nivl/eista-api/services/user/payload"
)

func (r *mutationResolver) CreateUser(ctx context.Context, userData mutations.CreateUserInput) (bool, error) {
	c, err := CreateContext(ctx, r.Resolver)
	if err != nil {
		return false, err
	}
	err = mutations.CreateUser(c, &userData)
	if err != nil {
		return false, fmt.Errorf("could not create new user: %w", err)
	}
	return true, nil
}

func (r *queryResolver) Health(ctx context.Context) (*model.Health, error) {
	return &model.Health{
		Status: "healthy",
	}, nil
}

func (r *queryResolver) Me(ctx context.Context) (*payload.Me, error) {
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
