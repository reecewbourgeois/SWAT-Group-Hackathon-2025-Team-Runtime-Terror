package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// APIServer holds dependencies for our server
type APIServer struct {
	listenAddr string
	store      *InMemoryStore
}

// NewAPIServer creates a new APIServer instance
func NewAPIServer(listenAddr string, store *InMemoryStore) *APIServer {
	return &APIServer{
		listenAddr: listenAddr,
		store:      store,
	}
}

// Run starts the HTTP server
func (s *APIServer) Run() {
	router := mux.NewRouter()

	// Public routes (no authentication required)
	router.HandleFunc("/signup", s.handleSignUp).Methods("POST")
	router.HandleFunc("/verify", s.handleVerify).Methods("POST")

	// Protected routes (authentication required)
	apiRouter := router.PathPrefix("/api").Subrouter()
	apiRouter.Use(s.AuthMiddleware) // Apply middleware to all /api routes
	apiRouter.HandleFunc("/hello", s.handleHello).Methods("GET")

	log.Println("API server running on", s.listenAddr)
	log.Fatal(http.ListenAndServe(s.listenAddr, router))
}

func main() {
	store := NewInMemoryStore()
	server := NewAPIServer(":5000", store)
	server.Run()
}
