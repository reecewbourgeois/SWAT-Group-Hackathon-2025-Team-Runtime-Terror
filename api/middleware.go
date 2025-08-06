package main

import (
	"context"
	"fmt"
	"net/http"
	"strings"
)

// userContextKey is a custom type to use as a key for context values
type userContextKey string

const contextUserKey userContextKey = "user"

// AuthMiddleware protects routes that require authentication
func (s *APIServer) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// ** Validate Authorization Header Token ** //
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			writeJSON(w, http.StatusUnauthorized, Map{"error": "Authorization header required"})
			return
		}

		headerParts := strings.Split(authHeader, " ")
		if len(headerParts) != 2 || headerParts[0] != "Bearer" {
			writeJSON(w, http.StatusUnauthorized, Map{"error": "Invalid Authorization header format"})
			return
		}

		tokenString := headerParts[1]
		claims, err := ValidateToken(tokenString)
		if err != nil {
			writeJSON(w, http.StatusUnauthorized, Map{"error": "Invalid token: " + err.Error()})
			return
		}

		// Token is valid, find the user
		s.store.mu.RLock()
		user, ok := findUserByID(s.store.users, claims.UserID)
		s.store.mu.RUnlock()

		if !ok {
			writeJSON(w, http.StatusUnauthorized, Map{"error": "User not found"})
			return
		}

		// ** Token Refresh ** //
		newAccessToken, err := GenerateAccessToken(user)
		if err != nil {
			// TODO: Logger
			// Log the error but don't fail the request
			fmt.Println("Error refreshing token:", err)
		} else {
			// Set the new token in the response header
			w.Header().Set("X-Access-Token", newAccessToken)
		}

		// Add user to the request context
		ctx := context.WithValue(r.Context(), contextUserKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// Helper to find a user by ID from our map
func findUserByID(users map[string]User, id string) (User, bool) {
	for _, user := range users {
		if user.ID == id {
			return user, true
		}
	}
	return User{}, false
}
