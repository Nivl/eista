package payload

// LinkToken contains the data needed to link an institution using
// a third-party token.
type LinkToken struct {
	PlaidLinkToken string `json:"plaidLinkToken"`
}
