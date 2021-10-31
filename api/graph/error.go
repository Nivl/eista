package graph

import (
	"context"
	"errors"
	"runtime/debug"
	"strings"

	"github.com/99designs/gqlgen/graphql"
	"github.com/Nivl/eista-api/services"
	"github.com/vektah/gqlparser/v2/ast"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

// OnError is called when an error is returned from the resolver and
// parses the raw error to return the appropriate user-facing message.
// All non user-facing errors are returned as internal server errors.
func OnError(ctx context.Context, e error) *gqlerror.Error {
	err := graphql.DefaultErrorPresenter(ctx, e)

	var serviceError *services.Error
	if errors.As(e, &serviceError) {
		err.Message = serviceError.Error()
		if err.Extensions == nil {
			err.Extensions = map[string]interface{}{}
		}

		// We set an err code based on the type of the error. The codes are
		// taken from
		// https://www.apollographql.com/docs/apollo-server/data/errors/#error-codes
		switch serviceError.Type() {
		case services.ValidationError, services.ConflictError:
			err.Extensions["code"] = "BAD_USER_INPUT"
		case services.AuthenticationError:
			err.Extensions["code"] = "UNAUTHENTICATED"
		case services.ForbiddenError:
			err.Extensions["code"] = "FORBIDDEN"
		}

		// We're adding the impacted field to the path if there's
		// one. This is to allow the FE to be able to treat the error
		if field, ok := serviceError.Extra()["field"]; ok {
			err.Path = append(err.Path, ast.PathName(field))
		}

		// We throw whatever extra we have in the Extension part of
		// the error, so it's being sent back to the FE
		for k, v := range serviceError.Extra() {
			err.Extensions[k] = v
		}

		return err
	}
	// TODO(melvin): Have de DEBUG mode and only return err
	// when DEBUG = true. Otherwise a default "Internal Server Error"
	// should be returned
	return err
}

// OnPanic is called when panic happens from the resolver.
// TODO(melvin): have de DEBUG mode and only return an error
// when DEBUG = true. Otherwise a default "Internal Server Error"
// should be returned
func OnPanic(ctx context.Context, err interface{}) error {
	e := gqlerror.Errorf("panic: %v", err)
	e.Extensions = map[string]interface{}{
		"stacktrace": strings.Split(string(debug.Stack()), "\n"),
	}
	return e
}
