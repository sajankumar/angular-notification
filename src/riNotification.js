(function (angular) {
    'use strict';
    /**
     * @ngdoc overview
     * @name  ri.notify
     * @description
     *  ri.notify module providing the NotificationProvider for simple notifications.
     * @example
        <pre>
            angular.module('myApp', ['ri.notify']);
        </pre>   
     */
    angular.module('ri.notify', [])
    /**
     * @ngdoc service
     * @name  ri.notify.NotificationProvider
     * @description
     *  Simply inject this Notification on the controller
     * @example
        <pre>
            angular.module('myApp', ['ri.notify'])
            .controller('mainCtrl', function (Notification) {
                //do you stuff    
            });
        </pre>    
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
         *  This is a public method and allows you to configure the notification    
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
             * @name notify
             * @methodOf ri.notify.NotificationProvider
             * @param {object}
             *          args that you want to pass to the notification
             * @param {string}
             *          category is the type of the notification that you want to pass.
             */
            var notify = function (args, category) {
                console.log('constructor', typeof args);
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
                    var lastElemTopPos = 0;
                    console.log('template', template);
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
                            lastElemTopPos = parseInt(element[0].offsetTop);
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
            notify.info = function (args) {
                return this(args, 'info');
            };
            notify.warning = function (args) {
                return this(args, 'warning');
            };
            notify.error = function (args) {
                return this(args, 'error');
            };

            return notify;
        }]
    })
    .run(['$templateCache', function ($templateCache) {
        var template = '<section class="notification {{type}}">';
        template += '<header class="notifyHeader"><h3 class="notifyTitle" ng-bind-html="title"></h3>';
        template += '<button class="delete" id="closeBtn">x</button>';
        template += '</header>';
        template += '<div class="message" ng-bind-html="message"> </div>';
        template += '</section>';         
        $templateCache.put('notification.html', template);
    }]);

})(angular);
