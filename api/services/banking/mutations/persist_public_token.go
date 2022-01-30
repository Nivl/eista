package mutations

import (
	"fmt"

	"github.com/Nivl/eista-api/services"
	"github.com/plaid/plaid-go/plaid"
)

// PersistPublicTokenInput represents the data needed to create a new user
type PersistPublicTokenInput struct {
	PlaidPublicToken string `json:"plaidPublicToken"`
}

// Validate validates the input data
func (input *PersistPublicTokenInput) Validate() error {
	if input.PlaidPublicToken == "" {
		return services.NewValidationError("plaidPublicToken", "token is required")
	}
	return nil
}

// PersistPublicToken persists a banking public token to the system
// for fetching banking information
func PersistPublicToken(c *services.Context, input *PersistPublicTokenInput) error {
	if c.User == nil {
		return services.NewAuthenticationError("user must be logged in")
	}
	if err := input.Validate(); err != nil {
		return err
	}

	// Get the item and access token from plaid
	req := plaid.NewItemPublicTokenExchangeRequest(input.PlaidPublicToken)
	resp, _, err := c.Plaid.PlaidApi.
		ItemPublicTokenExchange(c.Ctx).
		ItemPublicTokenExchangeRequest(*req).
		Execute()
	if err != nil {
		return fmt.Errorf("failed requesting plaid access token : %w", err)
	}

	// Store token to DB
	query := `
		INSERT INTO user_banking_items
			(plaid_item_id, user_id, plaid_access_token)
		VALUES
			(:plaid_item_id, :user_id, :plaid_access_token)`

	_, err = c.DB.NamedExecContext(c.Ctx, query, map[string]interface{}{
		"plaid_item_id":      resp.ItemId,
		"user_id":            c.User.ID,
		"plaid_access_token": resp.AccessToken,
	})
	if err != nil {
		return fmt.Errorf("couldn't create new user: %w", err)
	}

	return nil
}
