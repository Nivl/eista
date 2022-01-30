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
	"github.com/plaid/plaid-go/plaid"
	"github.com/rs/cors"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	// Set up database
	postgresURL := os.Getenv("EISTA_POSTGRES_URL")
	if postgresURL == "" {
		log.Fatalln("EISTA_POSTGRES_URL not set")
	}
	db, err := sqlx.Connect("pgx", postgresURL)
	if err != nil {
		log.Fatalln(err)
	}

	// set up pliad
	plaidClientID := os.Getenv("EISTA_PLAID_CLIENT_ID")
	if plaidClientID == "" {
		log.Fatalln("EISTA_PLAID_CLIENT_ID not set")
	}
	plaidSecret := os.Getenv("EISTA_PLAID_SECRET")
	if plaidSecret == "" {
		log.Fatalln("EISTA_PLAID_SECRET not set")
	}
	plaidEnv := os.Getenv("EISTA_PLAID_ENV")
	configuration := plaid.NewConfiguration()
	switch plaidEnv {
	case "prod", "production":
		configuration.UseEnvironment(plaid.Production)
	case "dev", "development":
		configuration.UseEnvironment(plaid.Development)
	default:
		configuration.UseEnvironment(plaid.Sandbox)

	}

	resolvers := &graph.Resolver{
		// Unsafe allows us to have models that don't contain all the fields
		// that are in the database
		DB:    db.Unsafe(),
		Plaid: plaid.NewAPIClient(configuration),
	}

	router := chi.NewRouter()
	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:5000"},
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
