(function(){
  'use strict';

    angular.module('geolocation',[])
      .constant('geolocation_msgs', geolocation_msgs)
      .factory('geolocationSrv', geolocationSrv);

      
      /** Error Handler & Msg **/
      function geolocation_msgs(){
          return {
            'errors.location.unsupportedBrowser':'Browser does not support location services. Please enter your postcode.',
            'errors.location.permissionDenied':'You have rejected access to your location. Please enter your postcode.',
            'errors.location.positionUnavailable':'Unable to determine your location. Please enter your postcode.',
            'errors.location.timeout':'Service timeout has been reached. Please enter your post code.'
          };
      }


      /** Get geolocation factory to be used in controller **/
      geolocationSrv.$inject = ['$q','$rootScope','$window','geolocation_msgs'];
      function geolocationSrv($q,$rootScope,$window,geolocation_msgs){

          return {
            getLocation: getLocation
          }

          function getLocation(opts) {
             
              var deferred = $q.defer();
              

              if ($window.navigator && $window.navigator.geolocation) {

                $window.navigator.geolocation.getCurrentPosition(success, error, opts);

              }else{

                $rootScope.$broadcast('error',geolocation_msgs()['errors.location.unsupportedBrowser']);
                $rootScope.$apply(unsupportedBrowser());

              }


              function success(position){
                $rootScope.$apply( function(){ deferred.resolve(position); } );
              }

              function error(error){
                switch (error.code) {
                    case 1:
                      $rootScope.$broadcast('error',geolocation_msgs()['errors.location.permissionDenied']);
                      $rootScope.$apply(function() {
                        deferred.reject(geolocation_msgs()['errors.location.permissionDenied']);
                      });
                      break;
                    case 2:
                      $rootScope.$broadcast('error',geolocation_msgs()['errors.location.positionUnavailable']);
                      $rootScope.$apply(function() {
                        deferred.reject(geolocation_msgs()['errors.location.positionUnavailable']);
                      });
                      break;
                    case 3:
                      $rootScope.$broadcast('error',geolocation_msgs()['errors.location.timeout']);
                      $rootScope.$apply(function() {
                        deferred.reject(geolocation_msgs()['errors.location.timeout']);
                      });
                      break;
                  }
              }

              function unsupportedBrowser(){
                deferred.reject(geolocation_msgs()['errors.location.unsupportedBrowser']);
              }


              return deferred.promise;
          }
          
      }

})();
