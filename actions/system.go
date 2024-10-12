package actions

import (
	"fmt"
	"image"
	"image/draw"
	"image/png"
	"os"
	"time"

	"github.com/kbinani/screenshot"
)

// Not being used anymore
// SaveScreenShot saves a screenshot of each active display
func SaveScreenShot() {
	// Get the number of displays (monitors)
	n := screenshot.NumActiveDisplays()

	if n <= 0 {
		fmt.Println("No active displays found")
		return
	}

	// Iterate through all displays and capture each
	for i := 0; i < n; i++ {
		bounds := screenshot.GetDisplayBounds(i)
		img, err := screenshot.CaptureRect(bounds)
		if err != nil {
			fmt.Printf("Failed to capture screen: %v\n", err)
			return
		}

		// create screenshots directory if it doesn't exist
		if _, err := os.Stat("screenshots"); os.IsNotExist(err) {
			os.Mkdir("screenshots", 0755)
		}

		// get current timestamp in YYYY-MM-DD_HH-MM-SS format
		timestamp := time.Now().Format("2006-01-02_15-04-05")
		// save file
		fileName := fmt.Sprintf("screenshots/screenshot_%s_%d.png", timestamp, i)
		file, err := os.Create(fileName)
		if err != nil {
			fmt.Printf("Failed to create file: %v\n", err)
			return
		}
		defer file.Close()

		// Save the image to a file
		err = png.Encode(file, img)
		if err != nil {
			fmt.Printf("Failed to save image: %v\n", err)
			return
		}

		fmt.Printf("Screenshot saved as %s\n", fileName)
	}

}

// SaveCombinedScreenShot saves a screenshot of all active displays combined into a single image
func SaveCombinedScreenShot() {
	// Get the number of displays (monitors)
	numDisplays := screenshot.NumActiveDisplays()

	if numDisplays <= 0 {
		fmt.Println("No active displays found")
		return
	}

	// Calculate the total bounding box to fit all displays
	var allBounds image.Rectangle
	for i := 0; i < numDisplays; i++ {
		bounds := screenshot.GetDisplayBounds(i)
		allBounds = allBounds.Union(bounds)
	}

	// Create a blank RGBA image with the size of the total bounding box
	mergedImage := image.NewRGBA(allBounds)

	// Capture each display and paste it into the corresponding location in the merged image
	for i := 0; i < numDisplays; i++ {
		bounds := screenshot.GetDisplayBounds(i)
		img, err := screenshot.CaptureRect(bounds)
		if err != nil {
			fmt.Printf("Failed to capture screen %d: %v\n", i, err)
			return
		}

		// Calculate the position of the image in the merged image
		draw.Draw(mergedImage, bounds, img, image.Point{}, draw.Over)
	}

	// create screenshots directory if it doesn't exist
	if _, err := os.Stat("screenshots"); os.IsNotExist(err) {
		os.Mkdir("screenshots", 0755)
	}

	// get current timestamp in YYYY-MM-DD_HH-MM-SS format
	timestamp := time.Now().Format("2006-01-02_15-04-05")
	// save file
	fileName := fmt.Sprintf("screenshots/screenshot_%s.png", timestamp)
	// Save the merged image to a file
	file, err := os.Create(fileName)
	if err != nil {
		fmt.Printf("Failed to create file: %v\n", err)
		return
	}
	defer file.Close()

	// Save the merged image as PNG
	err = png.Encode(file, mergedImage)
	if err != nil {
		fmt.Printf("Failed to save image: %v\n", err)
		return
	}

	fmt.Printf("Merged screenshot saved as %s\n", fileName)
}
