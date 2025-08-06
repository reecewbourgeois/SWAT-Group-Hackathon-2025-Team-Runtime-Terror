package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// Convenience type
type Map map[string]any

// Helper for writing JSON responses
func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

// Creates a random hex code of a given length
func generateSecureCode(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes)[:length], nil
}

// Mocks sending a verification code to the user's email
func (s *APIServer) handleSignUp(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, Map{"error": "Invalid request payload"})
		return
	}

	if req.Email == "" {
		writeJSON(w, http.StatusBadRequest, Map{"error": "Email is required"})
		return
	}

	code, err := generateSecureCode(6)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, Map{"error": "Failed to generate code"})
		return
	}

	s.store.mu.Lock()
	s.store.verificationCodes[req.Email] = VerificationCode{
		Code:      code,
		Email:     req.Email,
		ExpiresAt: time.Now().Add(10 * time.Minute), // Code is valid for 10 mins
	}
	s.store.mu.Unlock()

	// TODO: Actually send email
	fmt.Printf("Verification code for %s: %s\n", req.Email, code)

	writeJSON(w, http.StatusOK, Map{"message": "Verification code sent"})
}

// Creates an account or logs in a user after code verification
func (s *APIServer) handleVerify(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
		Code  string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, Map{"error": "Invalid request payload"})
		return
	}

	s.store.mu.Lock()
	defer s.store.mu.Unlock()

	vc, ok := s.store.verificationCodes[req.Email]
	if !ok || vc.Code != req.Code || time.Now().After(vc.ExpiresAt) {
		writeJSON(w, http.StatusUnauthorized, Map{"error": "Invalid or expired verification code"})
		return
	}

	// Code is valid, remove it so it can't be reused
	delete(s.store.verificationCodes, req.Email)

	// Check if user exists. If not, create one.
	user, exists := s.store.users[req.Email]
	if !exists {
		newID, _ := generateSecureCode(10)
		user = User{
			ID:        newID,
			Email:     req.Email,
			CreatedAt: time.Now(),
		}
		s.store.users[req.Email] = user
		fmt.Printf("New user created: %s\n", user.Email)
	}

	// Generate token
	accessToken, err := GenerateAccessToken(user)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, Map{"error": "Failed to generate token"})
		return
	}

	writeJSON(w, http.StatusOK, Map{"access_token": accessToken, "user": user})
}

// handleHello is our protected endpoint
func (s *APIServer) handleHello(w http.ResponseWriter, r *http.Request) {
	// Retrieve the user from the context
	user, ok := r.Context().Value(contextUserKey).(User)
	if !ok {
		// This should not happen if middleware is set up correctly
		writeJSON(w, http.StatusInternalServerError, Map{"error": "Could not retrieve user from context"})
		return
	}

	message := fmt.Sprintf("Hello, %s! This is a protected endpoint.", user.Email)
	writeJSON(w, http.StatusOK, Map{"message": message})
}
