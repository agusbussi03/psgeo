import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [[Camera], [Geolocation]]
})
export class HomePage {
  public base64Image: string;
  public lat: number;
  public lon: number;


  constructor(public navCtrl: NavController, private camera: Camera, private geolocation: Geolocation) {

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
    /*  if (data.code>0){
        console.log(data);
      }
  else{

        this.lat = data.coords.latitude;
        this.lon = data.coords.longitude;
      }*/
    });

  }
  takePicture() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }
}
