describe('Simply Notification module ri.notify', function () {
    var Notification,
    notify,compile,scope,timeout,
    template,document;

    var mockConfig = {
        delay: 90000,
        category: 'info',
        onClose: undefined,
        autoClose: true,
        priority: 0
    };

    beforeEach(function () {
        module('ri.notify');
    });

    beforeEach(function () {
        module(['NotificationProvider', function (_NotificationProvider) {
            notify = _NotificationProvider;
            notify.configure(mockConfig);
        }]);
    });

    beforeEach(inject(function (_Notification_, _$compile_, _$rootScope_, _$templateCache_, _$document_, _$timeout_) {
        Notification = _Notification_;
        compile = _$compile_;
        scope = _$rootScope_.$new();
        template = _$templateCache_;
        document = _$document_;
        timeout = _$timeout_;
    }));

    it('should have configure method', function () {
        expect(notify.configure).toBeTruthy();
    });

    it('should configure method throw an error', function () {
       var configError = notify.configure.bind(notify.configure, 'hey how you doing');
        expect(configError).toThrowError();
    });

    describe('Notification methods', function () {

        it('should have constructor function', function () {
            expect(typeof Notification).toBe('function');
        });

        it('should have category method info', function () {
            expect(Notification.info).toBeTruthy();
        });

        it('should have category method warning', function () {
            expect(Notification.warning).toBeTruthy();
        });

        it('should have category method error', function () {
            expect(Notification.error).toBeTruthy();
        });
    });

    describe('Notification behaviour', function () {
        var close,autoCloseNotify;
        beforeEach(function () {
            close = jasmine.createSpy('closeNotification');
            autoCloseNotify = jasmine.createSpy('autoCloseNotification');
        });

        it('should notification constructor throw an error', function () {
            var constructFunc = Notification.bind(Notification, 'Hey, how you doing');
            expect(constructFunc).toThrowError();
        });

        it('should info method throw an error', function () {
            var infoTitleError = Notification.info.bind(Notification.info, {message: 'I am information'});
            var infoMessageError = Notification.info.bind(Notification.info, {title: 'I am title'});
            expect(infoTitleError).toThrowError();
            expect(infoMessageError).toThrowError();
        });

        it('should warning method throw an error', function () {
            var warningTitleError = Notification.warning.bind(Notification.warning, {message: 'I am warning'});
            var warningMessageError = Notification.warning.bind(Notification.warning, {title: 'I am title'});
            expect(warningTitleError).toThrowError();
            expect(warningMessageError).toThrowError();
        });

        it('should error method throw an error', function () {
            var errorTitle = Notification.error.bind(Notification.error, {message: 'I am error'});
            var errorMessage = Notification.error.bind(Notification.error, {title: 'I am title'});
            expect(errorTitle).toThrowError();
            expect(errorMessage).toThrowError();
        });

        it('should close notification when user click on close button', function () {
            Notification.warning({message:'I am message',title:'I am title',onClose: close});
            document.find('button')[0].click();
            expect(close).toHaveBeenCalled();
        });

        it('should info notification close after 90 seconds delay', function () {
            Notification.info({message:'I am info and I will close myself after 90seconds', 
                title:'Info auto close', onClose: autoCloseNotify, delay: 90000});
            timeout(function () {
                expect(autoCloseNotify).toHaveBeenCalled();
            }, notify.config.delay)
            expect(notify.config.delay).toEqual(mockConfig.delay);
            timeout.flush();
        });
    });
});