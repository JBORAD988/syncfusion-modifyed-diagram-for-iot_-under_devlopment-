import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {


  private audio: HTMLAudioElement;

  isStop: boolean = true

  constructor() {
    this.audio = new Audio();
  }


  loadAudio(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.audio.src = filePath;
      this.audio.load();
      this.audio.oncanplaythrough = () => resolve();
      this.audio.onerror = (error) => reject(error);
      this.playAudio().catch(error => console.error('Audio play failed:', error));
      this.isStop = false
    });
  }



  playAudio(): Promise<void> {
    console.log("playAudio")
    this.audio.loop = true;
    return this.audio.play();

  }



  stopAudio() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isStop = true
  }
}
