package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

// Handler to return file content as JSON
func fetchTilesHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	filePath := "tiles.json" // Replace with the path to your file

	// Open the file
	file, err := os.Open(filePath)
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}
	defer file.Close()

	// Read the file content
	fileContent, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "Error reading file", http.StatusInternalServerError)
		return
	}

	// Convert file content into a map to return as JSON
	var content interface{}
	if err := json.Unmarshal(fileContent, &content); err != nil {
		http.Error(w, "Error parsing JSON", http.StatusInternalServerError)
		return
	}

	// return response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(content)
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func StartServer(isDev bool) {

	// Define the directory to serve
	staticDir := "./frontend/dist"
	if isDev {
		staticDir = "./frontend/dist"
	}

	// Create a file server handler
	fileServer := http.FileServer(http.Dir(staticDir))
	// Use StripPrefix to serve files from the specified directory
	http.Handle("/", http.StripPrefix("/", fileServer))

	// api routes
	http.HandleFunc("/api/tiles", fetchTilesHandler) // New route to serve file content
	http.HandleFunc("/api/action/", ActionHandler)

	// Wait for 2 seconds before starting the server
	time.Sleep(2 * time.Second)

	// Start server on port 8080
	log.Println("Starting server on :23296")
	if err := http.ListenAndServe(":23296", nil); err != nil {
		log.Fatalf("Server failed: %s", err)
	}
}
