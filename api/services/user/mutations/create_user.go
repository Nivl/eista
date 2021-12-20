package mutations

import (
	"errors"
	"fmt"
	"strings"

	"github.com/Nivl/eista-api/services"
	"github.com/google/uuid"
	"github.com/jackc/pgconn"
	"github.com/jackc/pgerrcode"
	"golang.org/x/crypto/bcrypt"
)

// CreateUserInput represents the data needed to create a new user
type CreateUserInput struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Validate validates the input data
func (input *CreateUserInput) Validate() error {
	if input.Name == "" {
		return services.NewValidationError("name", "name is required")
	}

	if input.Email == "" {
		return services.NewValidationError("email", "email is required")
	}
	// we only go with the simplest check possible because that's enough
	// and it won't discriminate.
	if len(input.Email) < 3 || !strings.Contains(input.Email, "@") {
		return services.NewValidationError("email", "not a valid email address")
	}

	if input.Password == "" {
		return services.NewValidationError("password", "password is required")
	}
	return nil
}

// CreateUser creates a new user
// The current user must be logged out
func CreateUser(c *services.Context, input *CreateUserInput) error {
	if c.User != nil {
		return services.NewForbiddenError("user is already logged in")
	}
	if err := input.Validate(); err != nil {
		return err
	}

	// for sanity reasons, we store the emails lowercase, that'll be much
	// easier to deal with users that never types their email address the same way
	email := strings.ToLower(input.Email)
	password, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("could not get a bcrypt hash from the password: %w", err)
	}

	query := `
		INSERT INTO users
			(id, email, password, password_crypto, name)
		VALUES
			(:id, :email, :password, :password_crypto, :name)`

	_, err = c.DB.NamedExecContext(c.Ctx, query, map[string]interface{}{
		"id":              uuid.NewString(),
		"name":            input.Name,
		"email":           email,
		"password":        password,
		"password_crypto": "bcrypt",
	})
	if err != nil {
		var dbErr *pgconn.PgError
		if errors.As(err, &dbErr) {
			switch dbErr.Code {
			case pgerrcode.UniqueViolation:
				return services.NewConflictError(dbErr.ColumnName, "already in use")
			case pgerrcode.CheckViolation:
				return services.NewValidationError(dbErr.ColumnName, "either too short or too long")
			}
		}
		return fmt.Errorf("couldn't create new user: %w", err)
	}

	return nil
}
