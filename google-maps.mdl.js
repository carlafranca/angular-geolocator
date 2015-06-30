/* global angular:false, google:false */
/*jshint unused:false */
/* jshint latedef:nofunc */

(function(){
	'use strict';

	angular.module('googleMaps',['utils.observeAll'])
		.directive('googleMap',googleMap)
		.service('lazyLoadApi', lazyLoadApi)
		.controller('MapCtrl', MapCtrl);


		//Lazy load google maps, this will avoid blocking the page if google doesnt load
		lazyLoadApi.$inject = ['$window', '$q'];
		function lazyLoadApi($window, $q){
			 var deferred = $q.defer();

	        // Load Google map API script
	        function loadScript() {  
	            // Use global document since Angular's $document is weak
	            var script = document.createElement('script');
	            script.src = '//maps.googleapis.com/maps/api/js?sensor=false&language=en&callback=initMap';

	            document.body.appendChild(script);
	        }

	        // Script loaded callback, send resolve
	        $window.initMap = function () {
	            deferred.resolve();
	        }

	        loadScript();

	        return deferred.promise;
		}


		//google directive
		googleMap.$inject = ['$compile', '$timeout', 'observeAll', 'lazyLoadApi'];
		function googleMap($compile, $timeout, observeAll, lazyLoadApi){

			var gmdrv = {
				restrict: 'EA',
				scope:{
					marks: "@",
					inipos: "@",
					infowinconfig: "@",
					zoom: "@"
				},
				link: link,
				controller: MapCtrl,
				controllerAs: 'gm',
				bindToController: true //because the scope is isolated

			};
			return gmdrv;


			function link(scope, el, attr, ctrl){

				scope.map;
				var infoWindow;
				var markers = [];
				var action = {
					settings: settings,
					init: initialize
				};

				//The observeAll() will check if the directive attr are available (compiled)
		        //and will start the map setings with the initial position(inipos) and marks attr
		        //inipos inipos = initial position
		        //marks contain all the markers information (it needs to include altitude and longtude)
		        observeAll(attr, action.settings, 'inipos', 'marks');
		        
		        function settings(){

		        	//convert data in object
					var position = JSON.parse(attr.inipos);
					var mark = JSON.parse(attr.marks);

					//Check if data exist before initializing map
					if(!position.lat || mark.length <= 0){ return; }
				

					// Loads google map script
                    lazyLoadApi.then(function () {
                        // Promised resolved
                        //Clear marks if exists and re-initiate the map with new center
						//based on geolocation coords or postcode coords
						action.init(position);

						//Clear the markers array if populated
						//Create the markers "addMarker()"
						//Save all the merkers info to markers array and set the markers in the map
						workOutMarks(mark);


                    }, function () {
                        // Promise rejected add error message
                    });

					

		        }
				
		        //set initial localtion and add the map
				function initialize(pos) {

					//Set initial location
					var mapOptions = {
					    zoom: parseFloat(attr.zoom) || 11,
					    center: new google.maps.LatLng(pos.lat, pos.long),
					    mapTypeId: google.maps.MapTypeId.TERRAIN,
					    scrollwheel: false
					};

					//Add the map
				  	scope.map = new google.maps.Map(document.getElementById('map'),
				      mapOptions);

				  	//Create the info window on the marks
			        infoWindow = new google.maps.InfoWindow();

			        $('#map').addClass('show');

				}


				// Add a marker to the map and push reference to the array.
				function addMarker(marks) {

					//MarksConfig will check if there is a attr infowinconfig in the directive tag and if is populated
					//with this you can personalize the properties names to match the marks data properties
					//there is a default in place in case there is no infowinconfig 
					var marksConfig = {
						longitude:  marks[(attr.infowinconfig !== undefined && JSON.parse(attr.infowinconfig).longitude) ? JSON.parse(attr.infowinconfig).longitude : 'longitude'],
						latitude:  marks[(attr.infowinconfig !== undefined && JSON.parse(attr.infowinconfig).latitude) ? JSON.parse(attr.infowinconfig).latitude : 'latitude'],
						title:  marks[(attr.infowinconfig !== undefined && JSON.parse(attr.infowinconfig).title) ? JSON.parse(attr.infowinconfig).title : 'name'],
						desc:  marks[(attr.infowinconfig !== undefined && JSON.parse(attr.infowinconfig).desc) ? JSON.parse(attr.infowinconfig).desc : 'address1']
					}

				  	var marker = new google.maps.Marker({
				    	position: new google.maps.LatLng(marksConfig.latitude, marksConfig.longitude),
				    	map: scope.map,
				    	title: marksConfig.title
				  	});

				  	//create the makers content
				  	marker.content = '<div class="infoWindowContent">' + marksConfig.desc + '</div>';
				    
				    //add the click event to the markers to show popup window  
			        google.maps.event.addListener(marker, 'click', function(){
			            infoWindow.setContent('<h2>' + marksConfig.title + '</h2>' + marker.content);
			            infoWindow.open(scope.map, marker);
			        });

			        //add the markers create to the markers array
			        //This will be used to populate the map
			        //see workOutMarks() last for loop
				  	markers.push(marker);

				}



				function workOutMarks(data){

					//Clean the markers array if populated
					if(markers.length > 0){ markers = []; }

					//First create the marks
				  	for (var i = 0; i < data.length; i++) {
				  		addMarker(data[i]);
				  	}

				  	//Second Add the marks created in the addMarker 
				  	//to the markers array and set the map markers
				  	for (var i = 0; i < markers.length; i++) {
				  		markers[i].setMap(scope.map);
				  	}
				}

			}		
		}

		//Controller
		MapCtrl.$inject = ['$scope'];
		function MapCtrl(){
			var gm = this;

		}
	
})();