import { Injectable } from '@angular/core';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { Observable } from 'rxjs/Observable';

declare var google: any;

@Injectable()
export class GeocodingService {

    geocoder: any;
    mapLoaded:boolean = false;

    constructor(private __loader: MapsAPILoader) {

        try {
            //at this point the variable google may be still undefined (google maps scripts still loading)
            //so load all the scripts, then...
            this.__loader.load().then(() => {
                this.geocoder = new google.maps.Geocoder();
                this.mapLoaded = true;

            });
        } catch (error) {
            console.log("error loaing geocoder/maps may not show markers")
        }

    }


    getAddr = function(addr, f, org, service,router,save:boolean,orgProjects){
        if(typeof addr != 'undefined' && addr != null) {
            this.geocoder.geocode( { address: addr, }, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  //console.log('This is the geocoder status for getLatLan if ok ');
                const place = results[0].geometry.location;

                f('ok', place, org, service,router,save,orgProjects);
              } else {
                f('error', null,org,service,router,save,orgProjects);
              }
            });
        } else {
          f('error', null);
        }
    }


    getProjAddr = function(addr, f, org, strsvc,db,router,save:boolean,parent){
        if(typeof addr != 'undefined' && addr != null) {
            this.geocoder.geocode( { address: addr, }, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  //console.log('This is the geocoder status for getLatLan if ok ');
                const place = results[0].geometry.location;

                f('ok', place, org, strsvc,db,router,save,parent);
              } else {
                f('error', null,org, strsvc,db,router,save,parent);
              }
            });
        } else {
          f('error', null);
        }
    }


    reverseGeocode(x){
        //alert('The positions are '+x.lat)
        var getAddressArray = [];
        var coordinateObj = {
            'lat':x.lat,
            'lng':x.lng
        }
        getAddressArray.push(coordinateObj)
        console.log('These are the coordinates from array '+JSON.stringify(getAddressArray))
        return Observable.create(observer => {
            try{
                console.log('This is the try block')
                this.__loader.load().then(() => {
                    let geocoder = new google.maps.Geocoder();
                    let latlng = new google.maps.LatLng(x.lat, x.lng);
                    let request = { latLng: latlng };
                    geocoder.geocode(request, (results, status) => {
                        if (status === 'OK'){
                            console.log('This is the geocoder status for address if ok ');
                            observer.next(results[0].formatted_address);
                            observer.complete();                            
                        }else{
                            console.log('This is the geocoder status for address if not ok')
                            observer.error(status);
                        }                        
                    })
                })                
            }catch(x){
                console.log('This is the catch block')
                observer.error('error getGeocoding from positions' + x);
                observer.complete();                
            }
        })   
    }

    getAddress(x) {
        //alert('The positions are '+x.lat)
        var getAddressArray = [];
        var coordinateObj = {
            'lat': x.lat,
            'lng': x.lng
        }
        getAddressArray.push(coordinateObj)
        console.log('These are the coordinates from array ' + JSON.stringify(getAddressArray))
        return Observable.create(observer => {
            try {
                console.log('This is the try block')
                    let latlng = new google.maps.LatLng(x.lat, x.lng);
                    let request = { latLng: latlng };
                    this.geocoder.geocode(request, (results, status) => {
                        if (status === 'OK') {
                            console.log('This is the geocoder status for address if ok ');
                            observer.next(results[0].formatted_address);
                            observer.complete();
                        } else {
                            console.log('This is the geocoder status for address if not ok')
                            observer.error(status);
                        }
                    })
            } catch (x) {
                console.log('This is the catch block')
                observer.error('error getGeocoding from positions' + x);
                observer.complete();
            }
        })
    }


    

}