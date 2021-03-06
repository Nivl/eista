package main

import (
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
	"github.com/rs/cors"
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

	db, err := sqlx.Connect("pgx", postgresURL)
	if err != nil {
		log.Fatalln(err)
	}

	resolvers := &graph.Resolver{
		// Unsafe allows us to have models that don't contain all the fields
		// that are in the database
		DB: db.Unsafe(),
	}

	router := chi.NewRouter()
	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedHeaders:   []string{"Origin", "Accept", "Content-Type", "X-Requested-With", "Authorization"},
		AllowedMethods:   []string{"POST", "GET"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler)
	router.Use(graph.UserTokenMiddleware())
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: resolvers}))
	srv.SetErrorPresenter(graph.OnError)
	srv.SetRecoverFunc(graph.OnPanic)

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
