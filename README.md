# angular-geolocator

#### geolocator service
angular geolocationsercie based on https://github.com/arunisrael/angularjs-geolocation

---
#Extra modules

#### google maps module 
It comes with a directive, a controller and a lazyload service

#### observer service
This is a resuable service used to check if the directive (multiple) attr are available (compiled).


---
## How to use it


***Add the files to your project***


`<script src="js/observer-all.srv.js"> </script>`

`<script src="js/geolocation.srv.js"> </script>`

`<script src="js/google-maps.mdl.js"> </script>`



***Add the directive to you html***

 `<div google-map marks="{{your_marks_data}}" inipos="{{The_initial_map_coord}}" id="map"></div>`

***Use it in your code***


*  Add 'geolocation' and 'googleMaps' as dependencies of your module.
*  Add 'geolocationSrv' as dependecy of your controller


***Map data customization via directive attributes***

<u>Default</u>

* zoom = 11
* longtude and latitude are the  property names
* title and desc are property names for the popup window when click on markers

<ul>you can customize it via directive attributes</ul>

`<div google-map marks="{{your_marks_data}}" inipos="{{The_initial_map_coord}}" id="map" infowinconfig="{{your object}}"></div>`


