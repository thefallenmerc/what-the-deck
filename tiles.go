package main

import (
	"encoding/json"
	"fmt"
	"os"
)

// Config represents the configuration for certain items
type Config struct {
	Title        string  `json:"title"`
	AppLocation  *string `json:"appLocation,omitempty"`
	AppArguments *string `json:"appArguments,omitempty"`
	LaunchUrl    *string `json:"launchUrl,omitempty"`
	Action       *string `json:"action,omitempty"`
	ConfirmFirst *bool   `json:"confirmFirst,omitempty"`
}

// Item represents a non-null item in the array
type Item struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	Category string  `json:"category"`
	Config   *Config `json:"config,omitempty"`
}

// ItemArray represents the array that contains Item or null
type ItemArray []*Item

// ReadItems reads the JSON data from a file and returns the ItemArray
func ReadItems() (ItemArray, error) {
	file, err := os.ReadFile("tiles.json")
	if err != nil {
		return nil, err
	}

	var items ItemArray
	if err := json.Unmarshal(file, &items); err != nil {
		return nil, err
	}

	return items, nil
}

// GetItemByIndex retrieves the item at the specified index
func GetItemByIndex(items ItemArray, index int) (*Item, error) {
	if index < 0 || index >= len(items) {
		return nil, fmt.Errorf("index out of bounds")
	}
	return items[index], nil
}
