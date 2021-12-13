package mutations

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"github.com/Nivl/eista-api/services"
	"github.com/Nivl/eista-api/services/user/models"
	"github.com/Nivl/eista-api/services/user/payload"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// SignInInput represents the data needed to create a new user
type SignInInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Validate validates the input data
func (input *SignInInput) Validate() error {
	if input.Password == "" {
		return services.NewValidationError("password", "password is required")
	}

	// No need to validate if the email is valid, we'll check directly
	// with the database
	if input.Email == "" {
		return services.NewValidationError("email", "email is required")
	}
	return nil
}

// SignIn controls that the user credentials are valid then creates and
// persists a new user session
func SignIn(c *services.Context, input *SignInInput) (*payload.SignedInUser, error) {
	if c.User != nil {
		return nil, services.NewForbiddenError("User is already logged in")
	}
	if err := input.Validate(); err != nil {
		return nil, err
	}

	// emails are stored lowercase
	email := strings.ToLower(input.Email)

	// We first check if the email is valid, while retrieving the hashed
	// password
	var user models.User
	query := `
		SELECT *
		FROM users
		WHERE
			email=$1
			AND deleted_at IS NULL`
	err := c.DB.GetContext(c.Ctx, &user, query, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, services.NewValidationError("_", "Invalid email or password")
		}
		return nil, fmt.Errorf("could not get user: %w", err)
	}
	// With the hashed password we can now check if the provided one is valid
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		return nil, services.NewValidationError("_", "Invalid email or password")
	}

	// We can now create a new Session and return it to the user
	token := uuid.NewString()
	query = `
		INSERT INTO user_sessions
			(token, user_id)
		VALUES
			(:token, :user_id)
	`
	_, err = c.DB.NamedExecContext(c.Ctx, query, map[string]interface{}{
		"token":   token,
		"user_id": user.ID,
	})
	if err != nil {
		return nil, fmt.Errorf("could not create session: %w", err)
	}

	return payload.NewSignedInUser(&user, token), nil
}
