package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/Nivl/eista-api/graph"
	"github.com/Nivl/eista-api/graph/generated"
	"github.com/go-chi/chi"
	_ "github.com/jackc/pgx/v4/stdlib"
	"github.com/jmoiron/sqlx"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	postgresURL := os.Getenv("EISTA_POSTGRES_URL")
	if postgresURL == "" {
		log.Fatalln("EISTA_POSTGRES_URL not set")
	}

	fmt.Println(postgresURL)
	db, err := sqlx.Connect("pgx", postgresURL)
	if err != nil {
		log.Fatalln(err)
	}

	resolvers := &graph.Resolver{
		DB: db,
	}

	router := chi.NewRouter()
	router.Use(graph.UserTokenMiddleware())
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: resolvers}))

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
