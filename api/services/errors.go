package services

// ErrorType represents the type of an error that the
// service may return.
type ErrorType string

const (
	// ValidationError indicates that the error is a user-provided data
	// validation error.
	ValidationError ErrorType = "ValidationError"
	// ConflictError indicates that the error has been caused by a data
	// conflicting together.
	ConflictError ErrorType = "ConflictError"
	// AuthenticationError indicates that the error has been caused by a
	// user not being authenticated.
	AuthenticationError ErrorType = "AuthenticationError"
	// ForbiddenError indicates that the error has been caused by a
	// user having access to a specific resource.
	ForbiddenError ErrorType = "ForbiddenError"
)

// Error represents an error that the service may return.
type Error struct {
	extra   map[string]string
	typ     ErrorType
	message string
}

// NewValidationError returns a error representing a data validation error.
func NewValidationError(field, message string) *Error {
	return &Error{
		typ:     ValidationError,
		message: message,
		extra: map[string]string{
			"field": field,
		},
	}
}

// NewConflictError returns a error representing a data conflict.
func NewConflictError(field, message string) *Error {
	return &Error{
		typ:     ConflictError,
		message: message,
		extra: map[string]string{
			"field": field,
		},
	}
}

// NewAuthenticationError returns a error representing an authentication error.
func NewAuthenticationError(message string) *Error {
	return &Error{
		typ:     AuthenticationError,
		message: message,
	}
}

// NewForbiddenError returns a error representing a permission error.
func NewForbiddenError(message string) *Error {
	return &Error{
		typ:     ForbiddenError,
		message: message,
	}
}

// Error returns the error message.
func (err *Error) Error() string {
	return err.message
}

// Type returns the type of the error.
func (err *Error) Type() ErrorType {
	return err.typ
}

// Extra returns the extra data of the error.
func (err *Error) Extra() map[string]string {
	return err.extra
}
