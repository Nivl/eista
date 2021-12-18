package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/Nivl/eista-api/graph"
	"github.com/Nivl/eista-api/graph/generated"
	"github.com/plaid/plaid-go/plaid"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	configuration := plaid.NewConfiguration()
	client := plaid.NewAPIClient(configuration)

	resolver := &graph.Resolver{
		Plaid: client,
	}

	srv := handler.NewDefaultServer(
		generated.NewExecutableSchema(
			generated.Config{Resolvers: resolver},
		),
	)

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
