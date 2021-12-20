package payload

// Session represents a valid session for the user to use to login
type Session struct {
	Token string `json:"token"`
}

// NewSession creates a new Session payload
func NewSession(token string) *Session {
	return &Session{
		Token: token,
	}
}
