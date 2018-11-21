export class Notification {
  constructor(name: string, picture: string, progress: number) {
    this.name = name;
    this.picture = picture;
    this.progress = progress;
  }
  
  name: string;
  picture: string;
  progress: number;
}
