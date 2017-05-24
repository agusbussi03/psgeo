import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { HTTP } from '@ionic-native/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
selector: 'page-home',
templateUrl: 'home.html',
providers: [[Camera], [Geolocation], [HTTP], [SQLite]]
})
export class HomePage {
public base64Image: string;
public lat: number;
public lon: number;
public candidatos: Array<{ candidato: string }>;
public candidatoelegido: string;
private db: SQLiteObject;

constructor(public navCtrl: NavController, private camera: Camera,
private geolocation: Geolocation, private http: HTTP, private sqlite: SQLite) {

this.sqlite.create({
name: 'ionic.offline',
location: 'default'
}).then((db: SQLiteObject) => {
db.executeSql('create table if not exists fotos(fecha CHAR(5),lat CHAR(40),lon CHAR(30),foto TEXT,candidato TEXT,enviado CHAR(1))', {});
this.db = db;
});


this.candidatoelegido="";
this.base64Image="";

this.candidatos = [];
this.candidatos.push({
candidato: 'Bussi Pablo'
});
this.candidatos.push({
candidato: 'Biuoussi Pablo'
});
this.candidatos.push({
candidato: 'Buiuoiussi Pablo'
});
let watch = this.geolocation.watchPosition();
watch.subscribe((data) => {
this.lat = data.coords.latitude;
this.lon = data.coords.longitude;
});
}

takePicture() {
this.camera.getPicture({
destinationType: this.camera.DestinationType.DATA_URL,
targetWidth: 1000,
targetHeight: 1000,
correctOrientation: true
}).then((imageData) => {
this.base64Image = "data:image/jpeg;base64," + imageData;
}, (err) => {
console.log(err);
});
}

enviar() {
    
//alert(this.candidatoelegido);
//alert(this.base64Image);
      
if (this.candidatoelegido == "" ) {
alert('Elija candidato');
return;
}       
if (this.base64Image == "") {
alert('Tome una foto');
return;
}
let postParams = {
lat: this.lat,
lon: this.lon,
imagen: this.base64Image,
candidato: this.candidatoelegido
}
this.http.post("http://pbussi.000webhostapp.com/ps_geo/rest.php", postParams, {})
.then(data => {
alert('Imagen subida');
}, error => {
alert(error);
});
let fecha=new Date();
let mes=fecha.getMonth() + 1;
let minutos=fecha.getMinutes().toString();
if (minutos.length==1) minutos='0'+minutos;
let segundos=fecha.getSeconds().toString();
if (segundos.length==1) segundos='0'+segundos;
let fecha_formateada=fecha.getDate()+"/"+mes +"/"+fecha.getFullYear()+" "+fecha.getHours()+":"+minutos+":"+segundos;
    
let query = "INSERT OR REPLACE INTO fotos VALUES (?, ?, ?, ?, ?,?)";
this.db.executeSql(query, [fecha_formateada, this.lat, this.lon, this.base64Image, this.candidatoelegido,'1']);


}
}
