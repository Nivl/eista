package graph

import (
	"context"
	"net/http"
)

type ctxKeyHTTPAuth = struct{}

// UserTokenMiddleware adds the HTTP Request to the context
func UserTokenMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := context.WithValue(r.Context(), ctxKeyHTTPAuth{}, r.Header.Get("Authorization"))
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}
