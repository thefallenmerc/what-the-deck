package actions

import (
	"syscall"
	"time"
)

var (
	user32              = syscall.NewLazyDLL("user32.dll")
	procKeybdEvent      = user32.NewProc("keybd_event")
	VK_MEDIA_PLAY_PAUSE = 0xB3 // Virtual key code for Play/Pause media key
	VK_VOLUME_UP        = 0xAF // Virtual key code for Volume Up
	VK_VOLUME_DOWN      = 0xAE // Virtual key code for Volume Down
	VK_VOLUME_MUTE      = 0xAD // Virtual key code for Volume Down
	VK_MEDIA_NEXT_TRACK = 0xB0 // Virtual key code for Next Track
	VK_MEDIA_PREV_TRACK = 0xB1 // Virtual key code for Previous Track

	KEYEVENTF_KEYUP = 0x0002 // Key-up event flag
)

func PlayPauseMedia() {
	// Simulate key down event
	procKeybdEvent.Call(uintptr(VK_MEDIA_PLAY_PAUSE), 0, 0, 0)

	// Small delay to simulate key press
	time.Sleep(100 * time.Millisecond)

	// Simulate key up event
	procKeybdEvent.Call(uintptr(VK_MEDIA_PLAY_PAUSE), 0, uintptr(KEYEVENTF_KEYUP), 0)
}

// Simulate the Volume Up key press
func IncreaseVolume() {
	// Simulate key down event for Volume Up
	procKeybdEvent.Call(uintptr(VK_VOLUME_UP), 0, 0, 0)

	// Small delay to simulate key press
	time.Sleep(100 * time.Millisecond)

	// Simulate key up event for Volume Up
	procKeybdEvent.Call(uintptr(VK_VOLUME_UP), 0, uintptr(KEYEVENTF_KEYUP), 0)
}

// Simulate the Volume Down key press
func DecreaseVolume() {
	// Simulate key down event for Volume Down
	procKeybdEvent.Call(uintptr(VK_VOLUME_DOWN), 0, 0, 0)

	// Small delay to simulate key press
	time.Sleep(100 * time.Millisecond)

	// Simulate key up event for Volume Down
	procKeybdEvent.Call(uintptr(VK_VOLUME_DOWN), 0, uintptr(KEYEVENTF_KEYUP), 0)
}

// Simulate the Volume Down key press
func MuteVolume() {
	// Simulate key down event for Volume Down
	procKeybdEvent.Call(uintptr(VK_VOLUME_MUTE), 0, 0, 0)

	// Small delay to simulate key press
	time.Sleep(100 * time.Millisecond)

	// Simulate key up event for Volume Down
	procKeybdEvent.Call(uintptr(VK_VOLUME_MUTE), 0, uintptr(KEYEVENTF_KEYUP), 0)
}

// Simulate the Next Track key press
func NextTrack() {
	// Simulate key down event for Next Track
	procKeybdEvent.Call(uintptr(VK_MEDIA_NEXT_TRACK), 0, 0, 0)

	// Small delay to simulate key press
	time.Sleep(100 * time.Millisecond)

	// Simulate key up event for Next Track
	procKeybdEvent.Call(uintptr(VK_MEDIA_NEXT_TRACK), 0, uintptr(KEYEVENTF_KEYUP), 0)
}

// Simulate the Previous Track key press
func PreviousTrack() {
	// Simulate key down event for Previous Track
	procKeybdEvent.Call(uintptr(VK_MEDIA_PREV_TRACK), 0, 0, 0)

	// Small delay to simulate key press
	time.Sleep(100 * time.Millisecond)

	// Simulate key up event for Previous Track
	procKeybdEvent.Call(uintptr(VK_MEDIA_PREV_TRACK), 0, uintptr(KEYEVENTF_KEYUP), 0)
}
