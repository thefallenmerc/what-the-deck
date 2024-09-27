package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"strconv"
	"strings"
	"what-the-deck/actions"
)

func ActionHandler(w http.ResponseWriter, r *http.Request) {
	// Extract the postid from the URL path
	// URL path should look like /post/{postid}
	urlPathSegments := strings.Split(r.URL.Path, "/")

	// Ensure the URL matches the expected format
	if len(urlPathSegments) != 5 || urlPathSegments[2] != "action" || urlPathSegments[4] != "execute" {
		http.Error(w, "Invalid URL path", http.StatusBadRequest)
		return
	}

	actionId, err := strconv.ParseInt(urlPathSegments[3], 10, 64)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Invalid action",
		})
		return
	}

	// read all tiles
	tiles, err := ReadItems()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Could not process",
		})
		return
	}

	action, err := GetItemByIndex(tiles, int(actionId))
	if err != nil || action == nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Could not process",
		})
		return
	}

	// process action
	ExecuteAction(action)

	// return response
	json.NewEncoder(w).Encode(map[string]any{
		"actionId": action,
	})
}

func ExecuteAction(item *Item) {
	switch item.ID {
	case "app":
		// run the app
		if item.Config != nil {
			appPath := item.Config.AppLocation
			args := strings.Split(*item.Config.AppArguments, " ")

			if actions.DetectIfAppRunning(appPath, item.Config.AppArguments) {
				fmt.Println("App running " + item.Config.Title)
				actions.FocusAppByTitle(item.Config.Title)
			} else {
				// Run the app
				cmd := exec.Command(*appPath, args...)
				if err := cmd.Start(); err != nil {
					fmt.Printf("Error starting YouTube Music app: %v\n", err)
				}
			}
		}
	case "web":
		actions.LaunchWebAddress(item.Config.LaunchUrl)
		// media
	case "play-pause":
		actions.PlayPauseMedia()
	case "volume-up":
		actions.IncreaseVolume()
	case "volume-down":
		actions.DecreaseVolume()
	case "mute":
		actions.MuteVolume()
	case "prev":
		actions.PreviousTrack()
	case "next":
		actions.NextTrack()
		// window
	case "maximize":
		actions.MaximizeActiveWindow()
	case "close":
		actions.CloseActiveWindow()
	}
}
