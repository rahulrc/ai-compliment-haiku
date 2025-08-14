# Sound Assets

This directory contains the sound effects used in the AI Compliment Generator app.

## Required Sound Files

### Core Sounds
- `ui_pop.mp3` - Button click sound (≤1.2s)
- `sparkle_chime.mp3` - Favorite/copy success sound (≤1.2s)
- `result_sparkle.mp3` - Result reveal sound, subtle (≤1.2s)
- `error_bloop.mp3` - Error notification sound (≤1.2s)

### Format Requirements
- **Primary**: MP3 format for best compatibility
- **Fallback**: WAV or OGG formats for older browsers
- **Duration**: All sounds should be ≤1.2 seconds
- **Quality**: 128kbps MP3 or equivalent
- **Volume**: Normalized to -16dB LUFS for consistent levels

### Usage
Sounds are automatically disabled when:
- User has muted sounds globally
- User has enabled reduced motion preferences
- Browser doesn't support audio playback

### Implementation Notes
- Sounds are loaded lazily to improve initial page load
- Volume is set to 50% by default for user comfort
- All sounds respect the global sound toggle in settings
- Fallback to silent operation if sound files are missing

## Creating Custom Sounds

If you want to create your own sound effects:

1. **Keep them short** - Under 1.2 seconds
2. **Use positive tones** - Match the app's cheerful vibe
3. **Test on mobile** - Ensure they work well on all devices
4. **Provide alternatives** - Include multiple formats for compatibility

## Sound Design Philosophy

The app uses sounds to enhance the user experience without being intrusive:
- **Subtle feedback** for interactions
- **Celebratory sounds** for achievements
- **Gentle notifications** for errors
- **Respectful of user preferences**

Remember: Good sound design should feel like a natural part of the interface, not an afterthought.
