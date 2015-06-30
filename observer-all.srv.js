/* global angular:false, google:false */
/*jshint unused:false */
/* jshint latedef:nofunc */

(function(){
    'use strict';

    angular.module('utils.observeAll', [])
        .factory('observeAll', observeAll);

        observeAll.$inject = ['$rootScope'];
        
        function observeAll($rootScope){
            return function($attrs, callback) {
                var o = {}, 
                    callQueued = false, 
                    args = arguments;

                var observe = function(attr) {
                    $attrs.$observe(attr, function(value) {
                        o[attr] = value;
                        if (!callQueued) {
                            callQueued = true;
                            $rootScope.$evalAsync(function() {
                                var argArr = [];
                                for(var i = 2, max = args.length; i < max; i++) {
                                    var attr = args[i];
                                    argArr.push(o[attr]);
                                }
                                callback.apply(null, argArr);
                                callQueued = false;
                            });
                        }
                    });
                };

                for(var i = 2, max = args.length; i < max; i++) {
                    var attr = args[i];
                    if ($attrs.$attr[attr]){
                        observe(attr);
                    }      
                }
            };
        }
            

})();