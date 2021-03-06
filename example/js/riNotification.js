(function (angular) {
    'use strict';
    /**
     * @ngdoc overview
     * @name  ri.notify
     * @description
     *  ri.notify is a service providing simple notifications using it own css styles.
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
        this.$get = [
         '$timeout',
         '$compile', 
         '$templateCache',
         '$rootScope',
         '$injector',
         '$q',
         '$window',
        function (
            $timeout,
            $compile,
            $templateCache,
            $rootScope,
            $injector,
            $q,
            $window
            ) {
            var delay = this.config.delay;
            var type = this.config.category;
            var onClose = this.config.onClose;
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
             *          Notification({messgae: "I am notification msg", title: 'Hey'});
             *       });
             *  </pre>
             */
            var notify = function (args, category) {
                var deferred = $q.defer();
                if (typeof args !== 'object' || args === null) {
                    throw new Error('required parameters expected as an object');
                }
                args.scope = args.scope ? args.scope : $rootScope;
                args.delay = !angular.isUndefined(args.delay) ? args.delay : delay;
                args.category = category || args.category || type || 'info';
                args.onClose = args.onClose ? args.onClose : onClose;
                args.priority = args.priority ? args.priority : priority;

                var processTemplate = function () {
                    var template = $templateCache.get('notification.html');
                    var scope = args.scope.$new();
                    scope.message = args.message;
                    scope.title = args.title;
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
                    if(args.delay > 0 && args.category === 'info') {
                        $timeout(function () {
                            var infoEle;
                            for(var i=0; i<elements.length; i++) {
                                infoEle = elements[i];
                                if(angular.element(infoEle).attr('class').split(" ")[1] === args.category) {
                                    if(scope.onClose) {
                                        scope.$apply(scope.onClose(infoEle));
                                    }
                                    infoEle.remove();
                                    elements.splice(elements.indexOf(infoEle), 1);
                                    position();
                                    scope.$destroy();
                                }
                            }
                        }, args.delay);    
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
             *           Also, It is must to have message and title propery.
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
                }else if(angular.isUndefined(args.message)) {
                    throw new Error('required message');
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
                }else if(angular.isUndefined(args.message)) {
                    throw new Error('required message');
                }
                return this(args, 'warning');
            };
            /**
             * @ngdoc method
             * @name error
             * @methodOf ri.notify.NotificationProvider
             * @param {object}
             *          params contains message, title, delay, callback.
             *           Also, It is must to have message and title propery.
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
                }else if(angular.isUndefined(args.message)) {
                    throw new Error('required message');
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