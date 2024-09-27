package actions

import (
	"fmt"
	"os/exec"
	"strings"
)

func LaunchWebAddress(webAddress *string) {
	// Command to LaunchWebAddress
	cmd := exec.Command("rundll32", "url.dll,FileProtocolHandler", *webAddress)

	output, err := cmd.Output()
	fmt.Println(output, cmd)
	if err != nil {
		fmt.Println("failed to start: %w", err)
	}
}

func DetectIfAppRunning(appPath *string, appArguments *string) bool {
	isChromeApp := strings.Contains(*appPath, "chrome_proxy")
	if isChromeApp {
		// PowerShell command to get the process and check for the specific app ID
		psCommand := "Get-WmiObject Win32_Process | Where-Object { $_.CommandLine -like '*" + *appArguments + "*' }"
		cmd := exec.Command("powershell", "-Command", psCommand)
		output, err := cmd.Output()
		fmt.Println(string(output))
		if err != nil {
			fmt.Printf("Error executing PowerShell command: %v\n", err)
			return false
		}
		return len(output) > 0 // If output is not empty, the app is running
	}

	return false
}

// FocusDiscord brings the Discord window to focus.
func FocusAppByTitle(title string) {
	// Command to focus the Discord window
	cmd := exec.Command("./nircmd.exe", "win", "activate", "ititle", title)

	output, err := cmd.Output()
	fmt.Println(output, cmd)
	if err != nil {
		fmt.Println("failed to focus: %w", err)
	}
}

func MaximizeActiveWindow() {
	// Command to maximize
	cmd := exec.Command("./nircmd.exe", "win", "togglemax", "foreground")

	output, err := cmd.Output()
	fmt.Println(output)
	if err != nil {
		fmt.Println("failed to maximize: %w", err)
	}
}

func CloseActiveWindow() {
	// Command to maximize
	cmd := exec.Command("./nircmd.exe", "win", "close", "foreground")

	output, err := cmd.Output()
	fmt.Println(output)
	if err != nil {
		fmt.Println("failed to maximize: %w", err)
	}
}
