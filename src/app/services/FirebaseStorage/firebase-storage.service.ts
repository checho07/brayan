import { Injectable, Output, EventEmitter } from "@angular/core";

import * as firebase from "firebase";
import { Dictionary } from "../../models/Dictionary";
import { Notification } from "../../models/Notification";

@Injectable({
  providedIn: "root"
})
export class FirebaseStorageService {
  @Output() songUploaded = new EventEmitter();
  @Output() songUpdated = new EventEmitter();

  notificationsByNameDictionary: Dictionary<Notification>;

  constructor() {
    this.notificationsByNameDictionary = new Dictionary<Notification>();
  }

  getNotifications(): Notification[] {
    const notifications = [];

    this.notificationsByNameDictionary.Keys().forEach(key => {
      const notification = this.notificationsByNameDictionary.Item(key);
      notifications.push(notification);
    });

    return notifications;
  }

  removeNotification(name: string) {
    this.notificationsByNameDictionary.Remove(name);
  }

  uploadVideo(
    uploadPath: string,
    name: string,
    picture: string,
    file: File
  ) {
    const promise = new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef.child(uploadPath).put(file);

      uploadTask.on(
        "state_changed",
        (snapshot: firebase.storage.UploadTaskSnapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          if (this.notificationsByNameDictionary.ContainsKey(name)) {
            this.notificationsByNameDictionary.Remove(name);
          }

          const notification = new Notification(
            name,
            picture,
            Math.round(progress)
          );
          
          this.notificationsByNameDictionary.Add(name, notification);
        },
        function(error) {
          // Handle unsuccessful uploads
          console.error(error);
        },
        function() {
          // Handle successful uploads on complete
          this.uploadMessage = "Uploaded successfully!";
        }
      );

      uploadTask.then(snapshot => {
        if (snapshot.state === "success") {
          this.notificationsByNameDictionary.Remove(name);
        }
      });

      resolve({ uploadTask: uploadTask });
    });

    return promise;
  }

  uploadPicture(uploadPath: string, file: File, callback: (n: number) => any) {
    const promise = new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef.child(uploadPath).put(file);

      uploadTask.on(
        "state_changed",
        (snapshot: firebase.storage.UploadTaskSnapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          callback(progress);

          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;

            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              // tslint:disable-next-line:radix
              // this.uploadMessage = 'Uploading: ' + parseInt(progress.toString()) + '% done';
              break;
          }
        },
        function(error) {
          // Handle unsuccessful uploads
          console.error(error);
        },
        function() {
          // Handle successful uploads on complete
          this.uploadMessage = "Uploaded successfully!";
        }
      );

      uploadTask.then(snapshot => {
        if (snapshot.state !== "success") {
          reject();
        }

        snapshot.ref.getDownloadURL().then(downloadURL => {
          resolve({ downloadURL: downloadURL });
        });
      });
    });

    return promise;
  }

  deleteFile(deletePath) {
    const promise = new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef
        .child(deletePath)
        .delete()
        .then(() => {
          // File deleted successfully
        })
        .catch(function(error) {
          // Uh-oh, an error occurred!
        });
    });

    return promise;
  }
}
