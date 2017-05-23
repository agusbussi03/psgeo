import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { HTTP } from '@ionic-native/http';
import { SQLite,SQLiteObject } from '@ionic-native/sqlite';

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
    //  public storage: SQLite;

    constructor(public navCtrl: NavController, private camera: Camera,
        private geolocation: Geolocation, private http: HTTP, private sqlite: SQLite) {

        //this.sqlite = new SQLite();

       this.sqlite.create({
            name: 'ionic.offline',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('create table if not exists fotos(fecha CHAR(5),lat CHAR(40),lon CHAR(30),foto TEXT,candidato TEXT)', {});
        });



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
            //this.lat = data.coords.latitude;
            //  this.lon = data.coords.longitude;
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
        if (this.candidatoelegido == "") {
            alert('Elija candidato');
            return;
        }
        let postParams = {
            lat: this.lat,
            lon: this.lon,
            imagen: this.base64Image,
            candidato: 1
        }
        this.http.post("http://pbussi.000webhostapp.com/ps_geo/rest.php", postParams, {})
            .then(data => {
                alert('Imagen subida');
            }, error => {
                alert(error);
            });
    //    let query = "INSERT OR REPLACE INTO fotos VALUES (?, ?, ?, ?, ?, ?)";

      /*  this.sqliteobject.open({
            name: 'ionic.offline',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql(query, [
                'safas',
                this.lat,
                this.lon,
                this.base64Image,
                this.candidatoelegido
            ]);
        });*/

    }
}
