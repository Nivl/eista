package graph

import "github.com/Nivl/eista-api/services"

//go:generate go run github.com/99designs/gqlgen

// Resolver serves as DI for the operations
type Resolver struct {
	DB services.DB
}
