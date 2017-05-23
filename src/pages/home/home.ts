import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { HTTP } from '@ionic-native/http';

@Component({
selector: 'page-home',
templateUrl: 'home.html',
providers: [[Camera], [Geolocation],[HTTP]]
})
export class HomePage {
public base64Image: string;
public lat: number;
public lon: number;
public opcionescandidatos: string[];


constructor(public navCtrl: NavController, private camera: Camera, 
private geolocation: Geolocation, private http: HTTP) {

let watch = this.geolocation.watchPosition();
watch.subscribe((data) => {
   
this.lat = data.coords.latitude;
this.lon = data.coords.longitude;
this.opcionescandidatos=["Bussi Pablo","Perez Juan","Garcia Pedro"];    
});

}

takePicture() {
this.camera.getPicture({
destinationType: this.camera.DestinationType.DATA_URL,
targetWidth: 1000,
targetHeight: 1000,
correctOrientation: true
}).then((imageData) => {
// imageData is a base64 encoded string
this.base64Image = "data:image/jpeg;base64," + imageData;
}, (err) => {
console.log(err);
});
}

enviar() {
let postParams= { 
lat:this.lat,
lon:this.lon,
imagen:this.base64Image,
candidato:1
}



this.http.post("http://pbussi.000webhostapp.com/ps_geo/rest.php",postParams,{})
.then(data => {
alert('Imagen subida');
}, error => {
alert(error);
});

}
}
