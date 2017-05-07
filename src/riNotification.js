(function (angular) {
    'use strict';
    /**
     * @ngdoc overview
     * @name  ri.notify
     * @description
     *  ri.notify module providing the NotificationProvider for simple notifications.
     * @example
     *  <pre>
     *     angular.module('myApp', ['ri.notify']);
     *  </pre>   
     */
    angular.module('ri.notify', [])
    /**
     * @ngdoc service
     * @name  ri.notify.NotificationProvider
     * @description
     *  Simply inject this Notification on the controller    
     */
    .provider('Notification', function () {
        this.config = {
            delay: 2000,
            category: 'info',
            onClose: undefined,
            autoClose: false,
            max: 5,
            priority: 0
        };
        /**
         * @ngdoc method
         * @name configure
         * @methodOf ri.notify.NotificationProvider
         * @param {object}
         *          config object for customization the notification 
         * @description 
         *  It allows you to configure the notification service.
         * @example
         *  <pre> 
         *      angular.module('myApp', ['ri.notify'])
         *      .config(function (NotificationProvider) {
         *            var options = {  
         *                 delay: 90000, //after 90 seconds "info" notification will close.
         *                 category: 'warning', // default notification type is "info". 
         *                 onClose: true //callback will be available for all notification when it close.  
         *             };
         *            NotificationProvider.configure(options);
         *      });
         * </pre>
         */
        this.configure = function (config) {
            if(!angular.isObject(config)) {
                throw new Error('config should be an object!');
            };
            this.config = angular.extend({}, this.config, config);
        };

        this.$get = ['$timeout', '$compile', '$templateCache', '$rootScope', '$injector', '$sce', '$q', '$window',
        function (
            $timeout,
            $compile,
            $templateCache,
            $rootScope,
            $injector,
            $sce,
            $q,
            $window
            ) {
            var delay = this.config.delay;
            var type = this.config.category;
            var onClose = this.config.onClose;
            var autoClose = this.config.autoClose;
            var max = this.config.max;
            var priority = this.config.priority;
            var elements = [];

            /**
             * @ngdoc constructor
             * @name Notification
             * @methodOf ri.notify.NotificationProvider
             * @param {object}
             *          params that you want to pass to the notification
             * @param {string}
             *          category is the type of the notification that you want to pass.
             * @example
             *  <pre>
             *      angular.module('myApp', ['ri.notify'])
             *      .controller('mainCtrl', function ($scope, Notification) {
             *          Notification('I am information', 'Info');
             *       });
             *  </pre>
             *
             *
             */
            var notify = function (args, category) {
                var deferred = $q.defer();
                if (typeof args !== 'object' || args === null) {
                    args = {message: args, title: category || 'Info'};
                }
                args.scope = args.scope ? args.scope : $rootScope;
                args.delay = !angular.isUndefined(args.delay) ? args.delay : delay;
                args.category = category || args.category || type || 'info';
                args.onClose = args.onClose ? args.onClose : onClose;
                args.autoClose = args.autoClose ? args.autoClose : autoClose;
                args.max = args.max ? args.max : max;
                args.priority = args.priority ? args.priority : priority;

                var processTemplate = function () {
                    var template = $templateCache.get('notification.html');
                    var scope = args.scope.$new();
                    scope.message = $sce.trustAsHtml(args.message);
                    scope.title = $sce.trustAsHtml(args.title);
                    scope.type = args.category.toLowerCase();
                    scope.delay = args.delay;
                    scope.onClose = args.onClose;

                    var element = $compile(template)(scope);
                    element.priority = args.priority;
                    var closeEvent = function (event) {
                        event = event.originalEvent || event;
                        if(event.type === 'click' && event.target.id === "closeBtn") {
                            if(scope.onClose) {
                                scope.$apply(scope.onClose(element));
                            }
                            element.remove();
                            elements.splice(elements.indexOf(element), 1);
                            position();
                            scope.$destroy();
                        }
                    };
                    element.bind('click', closeEvent);

                    if(!angular.isUndefined(args.onClose)) {
                        args.onClose = closeEvent;
                    }

                    if(args.autoClose && args.delay > 0) {
                        if(args.category === 'info') {
                            $timeout(function () {
                                angular.forEach(elements, function (val, index) {
                                    if(angular.element(val).attr('class').split(" ")[1] === args.category) {
                                        val.triggerHandler('click');
                                    }
                                });
                            }, args.delay);
                        }    
                    }
                    
                    //elements positions.
                    var position = function () { 
                        elements.sort(function (a,b) {
                            return b.priority - a.priority;
                        });
                        var elem,elemHeight,lastElemPos = 10;
                        for(var i = 0; i < elements.length; i++) {
                            elem = elements[i];
                            elemHeight = parseInt(elem[0].offsetHeight);
                            if( i > 0) {
                                var pos = elemHeight + lastElemPos;
                                lastElemPos = pos;
                                elem.css({'top': pos + 'px'});
                            }else {
                                elem.css({'top': 10 + 'px'});
                            }
                        }
                    };
                    element.addClass(args.category);
                    angular.element(document.querySelector('body')).append(element);
                    elements.push(element);
                    deferred.resolve(scope);
                    $timeout(position, 0);
                };
                processTemplate();
                return deferred.promise;
            };

            /**
             * @ngdoc method
             * @name info
             * @methodOf ri.notify.NotificationProvider
             * @param {object}
             *          params contains message, title, delay, callback. 
             *           Alos, It is must to have message and title propery. 
             * @description
             *  it will invoke info notification from anywhere inside your application
             * @example
             *  <pre>
             *    angular.module('myApp', ['ri.notify'])
             *    .controller('mainCtrl', function($scope, Notification) {
             *          $scope.showNotification = function () { 
             *            Notification.info({
             *              message: 'My notification',
             *              title: 'Info' 
             *            });
             *          };
             *     });
             *  </pre>  
             */
            notify.info = function (args) {
                if(angular.isUndefined(args.title)) {
                    throw new Error('required title');
                    return;
                }else if(angular.isUndefined(args.message)) {
                    throw new Error('required message');
                    return;
                }
                return this(args, 'info');
            };
            /**
             * @ngdoc method
             * @name warning
             * @methodOf ri.notify.NotificationProvider
             * @param {object}
             *          params contains message, title, delay, callback. 
             *           Alos, It is must to have message and title propery. 
             * @description
             *  it will invoke warning notification from anywhere inside your application
             * @example
             *  <pre>
             *    angular.module('myApp', ['ri.notify'])
             *    .controller('mainCtrl', function($scope, Notification) {
             *          $scope.showNotification = function () { 
             *            Notification.warning({
             *              message: 'My warning',
             *              title: 'Hey,
             *              onClose: function (e) { 
             *                  //handle after you close the notification.
             *                }
             *            });
             *          };
             *     });
             *  </pre>  
             */
            notify.warning = function (args) {
                if(angular.isUndefined(args.title)) {
                    throw new Error('required title');
                    return;
                }else if(angular.isUndefined(args.message)) {
                    throw new Error('required message');
                    return;
                }
                return this(args, 'warning');
            };
            /**
             * @ngdoc method
             * @name error
             * @methodOf ri.notify.NotificationProvider
             * @param {object}
             *          params contains message, title, delay, callback. 
             *           Alos, It is must to have message and title propery. 
             * @description
             *  it will invoke error notification from anywhere inside your application
             * @example
             *  <pre>
             *    angular.module('myApp', ['ri.notify'])
             *    .controller('mainCtrl', function($scope, Notification) {
             *          $scope.showNotification = function () { 
             *            Notification.error({
             *              message: 'Session expired',
             *              title: 'Alert' 
             *            });
             *          };
             *     });
             *  </pre>  
             */
            notify.error = function (args) {
                if(angular.isUndefined(args.title)) {
                    throw new Error('required title');
                    return;
                }else if(angular.isUndefined(args.message)) {
                    throw new Error('required message');
                    return;
                }
                return this(args, 'error');
            };
            return notify;
        }];
    })
    .run(['$templateCache', function ($templateCache) {
        var template = '<section class="notification {{type}}">';
        template += '<header class="notifyHeader"><h3 class="notifyTitle"> {{title}} </h3>';
        template += '<button class="delete" id="closeBtn">x</button>';
        template += '</header>';
        template += '<div class="message"> {{message}} </div>';
        template += '</section>';         
        $templateCache.put('notification.html', template);
    }]);

})(angular);
