package mutations

import (
	"fmt"

	"github.com/Nivl/eista-api/services"
	payload "github.com/Nivl/eista-api/services/banking/payloads"
	"github.com/plaid/plaid-go/plaid"
)

// GenerateLinkToken generates a new link token for the user to link
// banking accounts
func GenerateLinkToken(c *services.Context) (*payload.LinkToken, error) {
	if c.User != nil {
		return nil, services.NewAuthenticationError("user must be logged in")
	}

	request := plaid.NewLinkTokenCreateRequest("Eista", "en", []plaid.CountryCode{"US"}, plaid.LinkTokenCreateRequestUser{
		ClientUserId: c.User.ID,
	})

	request.SetAccountFilters(plaid.LinkTokenAccountFilters{
		Depository: &plaid.DepositoryFilter{
			AccountSubtypes: []plaid.AccountSubtype{plaid.ACCOUNTSUBTYPE_CHECKING, plaid.ACCOUNTSUBTYPE_SAVINGS},
		},
	})
	resp, _, err := c.Plaid.PlaidApi.
		LinkTokenCreate(c.Ctx).
		LinkTokenCreateRequest(*request).
		Execute()
	if err != nil {
		return nil, fmt.Errorf("failed requesting plaid link from : %w", err)
	}

	return &payload.LinkToken{
		PlaidLinkToken: resp.LinkToken,
	}, nil
}
