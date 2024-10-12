package actions

import (
	"fmt"
	"os/exec"
	"strings"
	"syscall"
	"unsafe"

	"golang.org/x/sys/windows"
)

// Declare types for Windows API functions
var (
	procEnumWindows     = user32.NewProc("EnumWindows")
	procGetWindowTextW  = user32.NewProc("GetWindowTextW")
	procIsWindowVisible = user32.NewProc("IsWindowVisible")
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

func DetectIfAppRunningByProcessName(processName string) bool {

	snapshot, err := windows.CreateToolhelp32Snapshot(windows.TH32CS_SNAPPROCESS, 0)
	if err != nil {
		fmt.Printf("Failed to take process snapshot: %v\n", err)
		return false
	}
	defer windows.CloseHandle(snapshot)

	var entry windows.ProcessEntry32
	entry.Size = uint32(unsafe.Sizeof(entry))

	if err = windows.Process32First(snapshot, &entry); err != nil {
		fmt.Printf("Failed to retrieve first process: %v\n", err)
		return false
	}

	for {
		process := windows.UTF16ToString(entry.ExeFile[:])
		if process == processName {
			return true
		}
		if err = windows.Process32Next(snapshot, &entry); err != nil {
			break
		}
	}

	return false
}
func DetectIfAppRunningByTitle(appTitle string) bool {
	var found bool
	enumWindows := func(hwnd syscall.Handle, lParam uintptr) uintptr {
		title := getWindowTitle(hwnd)
		if len(title) > 0 && isWindowVisible(hwnd) && contains(appTitle, title) {
			found = true
			return 0 // Stop enumeration
		}
		return 1 // Continue enumeration
	}

	// Enumerate all windows
	procEnumWindows.Call(syscall.NewCallback(enumWindows), 0)

	return found
}

// getWindowTitle retrieves the window title for a given window handle.
func getWindowTitle(hwnd syscall.Handle) string {
	buf := make([]uint16, 256)
	procGetWindowTextW.Call(uintptr(hwnd), uintptr(unsafe.Pointer(&buf[0])), uintptr(len(buf)))
	return syscall.UTF16ToString(buf)
}

// isWindowVisible checks if a window is visible.
func isWindowVisible(hwnd syscall.Handle) bool {
	ret, _, _ := procIsWindowVisible.Call(uintptr(hwnd))
	return ret != 0
}

// contains checks if the window title contains "Discord".
func contains(appTitle string, title string) bool {
	return strings.Contains(title, appTitle)
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
