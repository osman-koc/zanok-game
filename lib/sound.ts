import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { getSettings } from './storage';

class SoundManager {
  private backgroundMusic: Audio.Sound | null = null;
  private correctSound: Audio.Sound | null = null;
  private wrongSound: Audio.Sound | null = null;
  private spinSound: Audio.Sound | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Disable background music for now to avoid notification-like sounds
      // if (Platform.OS !== 'web') {
      //   this.backgroundMusic = new Audio.Sound();
      //   await this.backgroundMusic.loadAsync({
      //     uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      //   }, { shouldPlay: false, isLooping: true, volume: 0.1 });
      // }

      // Load sound effects with simple, pleasant sounds
      this.correctSound = new Audio.Sound();
      await this.correctSound.loadAsync({
        uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      }, { shouldPlay: false, volume: 0.3 });

      this.wrongSound = new Audio.Sound();
      await this.wrongSound.loadAsync({
        uri: 'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav',
      }, { shouldPlay: false, volume: 0.2 });

      this.spinSound = new Audio.Sound();
      await this.spinSound.loadAsync({
        uri: 'https://www.soundjay.com/misc/sounds/click-03.wav',
      }, { shouldPlay: false, volume: 0.2 });

      this.isInitialized = true;
    } catch (error) {
      console.log('Sound initialization failed:', error);
    }
  }

  async playBackgroundMusic() {
    const settings = await getSettings();
    if (!settings.soundEnabled || !this.backgroundMusic || Platform.OS === 'web') return;

    try {
      const status = await this.backgroundMusic.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await this.backgroundMusic.playAsync();
      }
    } catch (error) {
      console.log('Background music play failed:', error);
    }
  }

  async stopBackgroundMusic() {
    if (!this.backgroundMusic || Platform.OS === 'web') return;

    try {
      const status = await this.backgroundMusic.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await this.backgroundMusic.stopAsync();
      }
    } catch (error) {
      console.log('Background music stop failed:', error);
    }
  }

  async playCorrectSound() {
    const settings = await getSettings();
    if (!settings.soundEnabled || !this.correctSound) return;

    try {
      await this.correctSound.replayAsync();
    } catch (error) {
      console.log('Correct sound play failed:', error);
    }
  }

  async playWrongSound() {
    const settings = await getSettings();
    if (!settings.soundEnabled || !this.wrongSound) return;

    try {
      await this.wrongSound.replayAsync();
    } catch (error) {
      console.log('Wrong sound play failed:', error);
    }
  }

  async playSpinSound() {
    const settings = await getSettings();
    if (!settings.soundEnabled || !this.spinSound) return;

    try {
      await this.spinSound.replayAsync();
    } catch (error) {
      console.log('Spin sound play failed:', error);
    }
  }

  async cleanup() {
    try {
      if (this.backgroundMusic) {
        await this.backgroundMusic.unloadAsync();
        this.backgroundMusic = null;
      }
      if (this.correctSound) {
        await this.correctSound.unloadAsync();
        this.correctSound = null;
      }
      if (this.wrongSound) {
        await this.wrongSound.unloadAsync();
        this.wrongSound = null;
      }
      if (this.spinSound) {
        await this.spinSound.unloadAsync();
        this.spinSound = null;
      }
      this.isInitialized = false;
    } catch (error) {
      console.log('Sound cleanup failed:', error);
    }
  }
}

export const soundManager = new SoundManager();