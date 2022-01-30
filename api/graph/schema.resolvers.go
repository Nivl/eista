package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/Nivl/eista-api/graph/generated"
	"github.com/Nivl/eista-api/graph/model"
	bankingMutations "github.com/Nivl/eista-api/services/banking/mutations"
	bankingPayloads "github.com/Nivl/eista-api/services/banking/payloads"
	"github.com/Nivl/eista-api/services/user/mutations"
	"github.com/Nivl/eista-api/services/user/payload"
	"github.com/Nivl/eista-api/services/user/queries"
)

func (r *mutationResolver) CreateUser(ctx context.Context, newUser mutations.CreateUserInput) (bool, error) {
	c, err := CreateContext(ctx, r.Resolver)
	if err != nil {
		return false, err
	}
	err = mutations.CreateUser(c, &newUser)
	if err != nil {
		return false, fmt.Errorf("could not create new user: %w", err)
	}
	return true, nil
}

func (r *mutationResolver) SkipOnboarding(ctx context.Context) (*payload.Me, error) {
	c, err := CreateContext(ctx, r.Resolver)
	if err != nil {
		return nil, err
	}
	me, err := mutations.SkipOnboarding(c)
	if err != nil {
		return nil, fmt.Errorf("could skip onboarding: %w", err)
	}
	return me, nil
}

func (r *mutationResolver) SignIn(ctx context.Context, credentials mutations.SignInInput) (*payload.SignedInUser, error) {
	c, err := CreateContext(ctx, r.Resolver)
	if err != nil {
		return nil, err
	}
	resp, err := mutations.SignIn(c, &credentials)
	if err != nil {
		return nil, fmt.Errorf("could not sign user in: %w", err)
	}
	return resp, nil
}

func (r *mutationResolver) PersistBankingPublicToken(ctx context.Context, publicToken bankingMutations.PersistPublicTokenInput) (bool, error) {
	c, err := CreateContext(ctx, r.Resolver)
	if err != nil {
		return false, err
	}
	err = bankingMutations.PersistPublicToken(c, &publicToken)
	if err != nil {
		return false, fmt.Errorf("could not persist public token: %w", err)
	}
	return true, nil
}

func (r *mutationResolver) SignOut(ctx context.Context) (bool, error) {
	c, err := CreateContext(ctx, r.Resolver)
	if err != nil {
		return false, err
	}
	err = mutations.SignOut(c)
	if err != nil {
		return false, fmt.Errorf("could not sign user out: %w", err)
	}
	return true, nil
}

func (r *mutationResolver) GenerateBankingLinkToken(ctx context.Context) (*bankingPayloads.LinkToken, error) {
	c, err := CreateContext(ctx, r.Resolver)
	if err != nil {
		return nil, err
	}
	resp, err := bankingMutations.GenerateLinkToken(c)
	if err != nil {
		return nil, fmt.Errorf("could not generate link token: %w", err)
	}
	return resp, nil
}

func (r *queryResolver) Health(ctx context.Context) (*model.Health, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Me(ctx context.Context) (*payload.Me, error) {
	c, err := CreateContext(ctx, r.Resolver)
	if err != nil {
		return nil, err
	}
	pld, err := queries.Me(c)
	if err != nil {
		return nil, fmt.Errorf("could not get current user: %w", err)
	}
	return pld, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
