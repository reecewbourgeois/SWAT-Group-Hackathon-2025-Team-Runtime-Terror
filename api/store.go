package main

import (
	"sync"
	"time"
)

// TODO: Actual database implementation

// Fully created user
type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"-"`
}

// Holds the code sent to the user's email
type VerificationCode struct {
	Code      string
	Email     string
	ExpiresAt time.Time
}

// InMemoryStore holds our data.
// In a real application, this would be a database.
type InMemoryStore struct {
	mu                sync.RWMutex
	users             map[string]User             // key: user email
	verificationCodes map[string]VerificationCode // key: user email
}

// NewInMemoryStore creates a new in-memory store
func NewInMemoryStore() *InMemoryStore {
	return &InMemoryStore{
		users:             make(map[string]User),
		verificationCodes: make(map[string]VerificationCode),
	}
}
