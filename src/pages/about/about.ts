import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite,SQLiteObject } from '@ionic-native/sqlite';

@Component({
selector: 'page-about',
templateUrl: 'about.html'
})
export class AboutPage {
private db: SQLiteObject;
private sqlite: SQLite;

public enviados: Array<{ fecha: string,candidato:string,foto:string,lat:string,lon:string,enviado:string }>;

constructor(public navCtrl: NavController) {
this.sqlite = new SQLite();
let query = "SELECT * FROM fotos";
this.sqlite.create({
name: 'ionic.offline',
location: 'default'
}).then((db: SQLiteObject) => {
db.executeSql(query, {}).then(
(res) => {
this.db=db;
}, 
(err) => { 
console.error('Unable to execute sql: ', err);
});
    
});


}
  
  
mostrar() {

let query = "SELECT * FROM fotos";
this.db.executeSql(query, {}).then(
(res) => {
console.log(JSON.stringify(res));
this.enviados = [];
for(var i=0;i<res.rows.length;i++){
	  console.log(res.rows.item(i).fecha);
          this.enviados.push({fecha: res.rows.item(i).fecha,
                candidato: res.rows.item(i).candidato,foto: res.rows.item(i).foto,
                lat: res.rows.item(i).lat,lon: res.rows.item(i).lon,enviado: res.rows.item(i).enviado,});
    }
	
}, 
(err) => { 
console.error('Unable to execute sql: ', err);
});
}
  
  
  

}
