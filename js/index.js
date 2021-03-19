/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * @author Alex Twomey
 *
 * @date 8/12/20
 *
 * @version 1
 *
 */



//Variables
 var myLat;
 var myLng;
 var myLatlng;
 var map;
 var lng1;
 var lat1;
 var marker;
 var selectedStateName;
 var thislatlng;
 var stateCords = [
                  [myLat,myLng],
                  [32.361,-86.27],
                  [58.301,-134.419],
                  [33.448,-112.073],
                  [34.736,-92.331],
                  [38.555,-121.468],
                  [39.739,-104.984],
                  [41.767,-72.677],
                  [39.161,-75.526],
                  [30.451,-84.272],
                  [33.76,-84.39],
                  [21.308,-157.826],
                  [43.613,-116.237],
                  [39.783,-89.650],
                  [39.790,-86.147],
                  [41.5909,-93.620866],
                  [39.04,-95.69],
                  [38.197274,-84.86311],
                  [30.45809,-91.140229],
                  [44.323535,-69.765261],
                  [38.972945,-76.501157],
                  [42.2352,-71.0275],
                  [42.7335,-84.5467],
                  [44.95,-93.094],
                  [32.320,-90.207],
                  [38.572954,-92.189283],
                  [46.595805,-112.027031],
                  [40.809868,-96.675345],
                  [39.160949,-119.753877],
                  [43.220093,-71.549127],
                  [40.221741,-74.756138],
                  [35.667231,-105.964575],
                  [42.659829,-73.781339],
                  [35.771,-78.638],
                  [48.813343,-100.779004],
                  [39.962245,-83.000647],
                  [35.482309,-97.534994],
                  [44.931109,-123.029159],
                  [40.269789,-76.875613],
                  [41.82355,-71.422132],
                  [34.000,-81.035],
                  [44.367966,-100.336378],
                  [36.165,-86.784],
                  [30.266667,-97.75],
                  [40.7547,-111.892622],
                  [44.26639,-72.57194],
                  [37.54,-77.46],
                  [47.042418,-122.893077],
                  [38.349497,-81.633294],
                  [43.074722,-89.384444],
                  [41.145548,-104.802042]
               ];
 var stateIndex;
 var stateChildren;
 var currentState;
 const geocoder = new google.maps.Geocoder();
 const infowindow = new google.maps.InfoWindow();

 function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
 }

 //This function calls the arcgis covid database API and updates the
 //JSON object, then it displays this information
 function buildQueryString(){
   let stateString = selectedStateName;
   console.log(stateString);
   console.log(selectedStateName);
   let url = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases2_v1/FeatureServer/3/query?where=Country_Region%20%3D%20%27US%27%20AND%20Province_State%20%3D%20%27'+stateString+'%27&outFields=Province_State,Country_Region,Lat,Long_,Confirmed,Deaths,Recovered,Active&outSR=4326&f=json';
   console.log(url);
   (async () => {
      let response = await fetch(url);
      let jsonData = await response.json();
      document.getElementById("data").innerHTML =
      `
         <p>Updating data...</p>
      `;

      await sleep(1000);

      document.getElementById("data").innerHTML =
      `
         <button onClick="buildQueryString()" id="confirmed"><h2>Confirmed cases:<br> ${JSON.stringify(jsonData.features[0].attributes.Confirmed)}     </h2></button>
         <button onClick="buildQueryString()" id="deaths"><h2 style="padding-left:5%;">Deaths:<br> ${JSON.stringify(jsonData.features[0].attributes.Deaths)}     </h2></button>
         <button onClick="buildQueryString()" id="active"><h2 style="padding-left:5%;">Active Cases: ${JSON.stringify(jsonData.features[0].attributes.Active)}</h2></button>


      `;
   })();
 }
//This function matches the state you have selected with a
//preconstructed list of every states latitude and longtitude
//It then updates the position of the map, and updates the marker
 function updatePosition(){
    if(stateIndex == 0){
      lat1 = myLat;
      lng1 = myLng;
      selectedStateName = currentState;
   }else{
    lat1 = stateCords[stateIndex][0];
    lng1 = stateCords[stateIndex][1];
   }
    myLatlng = new google.maps.LatLng(lat1,lng1);
    marker.setPosition(myLatlng);
    map.setCenter(myLatlng);
    console.log(myLatlng);
    buildQueryString();
 }

//This function loads map into the frame.
 function loadMap(){
    navigator.geolocation.getCurrentPosition( onSuccess, onError, { timeout: 30000 } );

    function onSuccess( position ) {
      if ( position.coords ) {
            lat1 = position.coords.latitude,
            lng1 = position.coords.longitude,
            myLat = position.coords.latitude,
            myLng = position.coords.longitude,
          //Google Maps
            myLatlng = new google.maps.LatLng( lat1, lng1 ),
            mapOptions = {
               zoom: 6,
               center: myLatlng,
               rotateControl: false,
               streetViewControl: false,
             },
            map = new google.maps.Map( document.getElementById( 'map-canvas' ), mapOptions ),
            marker = new google.maps.Marker( { position: myLatlng, map: map } );

            geocodeLatLng(geocoder, map, infowindow);

            console.log(myLatlng);
      }
    }


    function onError(error) {
      alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    }

    google.maps.event.addDomListener( window, 'load', onSuccess );

 }
 //This function uses the geocode API from google to find the name
 //of the state of the current location you are in by inputting
 //your current latitude and longtitude
 function geocodeLatLng(geocoder, map, infowindow){
   thislatlng = {lat: lat1,lng: lng1};
   geocoder.geocode({'location': thislatlng }, (results, status) => {
    if (status === "OK") {
      if (results[0]) {
         console.log(results[0]);
        //infowindow.setContent(results[0].formatted_address);
        currentAddress= results[0].formatted_address;
        selectedStateName = results[0].address_components[4].long_name;
        currentState = results[0].address_components[4].long_name;
        //lat1= results[0].
        //lng1= results[0].
        console.log(selectedStateName);
        console.log(currentAddress);
        //infowindow.open(map, marker);
        buildQueryString();
      } else {
        window.alert("No results found");
      }
    } else {
      window.alert("Geocoder failed due to: " + status);
    }
  });
}
//This function changes the currently selected state
 function updateState(){
      stateIndex = document.getElementById("statesSelect").selectedIndex;
      stateChildren = document.getElementById("statesSelect").getElementsByTagName("option");
      for(var i = 0; i < stateChildren.length; i++){
         if(i == stateIndex){
            selectedStateName = stateChildren[i].text;
            console.log(selectedStateName);
         }
      }
      console.log(stateCords[stateIndex][0]);

      updatePosition();
}
//kicks everything off with a deviceready listener call
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },


    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //document.getElementById("cameraTakePicture").addEventListener("click",this.cameraTakePicture);

        loadMap();

    },
};

app.initialize();
