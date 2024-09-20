package main

import (
	"context"
	"fmt"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) SaveTiles(stringifiedTiles string) error {
	filePath := "tiles.txt"

	// Write to a file
	err := os.WriteFile(filePath, []byte(stringifiedTiles), 0644)
	if err != nil {
		return fmt.Errorf("failed to write to file: %v", err)
	}

	return nil
}

func (a *App) GetTiles() string {
	filePath := "tiles.txt"
	data, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Errorf("failed to write to file: %v", err)
		return "[]"
	}

	return string(data)
}

// OpenFileDialog opens a file dialog and returns the selected file
func (a *App) OpenFileDialog() (string, error) {
	// Using the Wails runtime to open a file dialog
	file, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select a file",
	})

	if err != nil {
		return "", err
	}

	return file, nil
}
