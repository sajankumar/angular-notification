describe('Simply Notification module ri.notify', function () {
    var Notification,
    notify,compile,scope,
    template,document;
    var mockConfig = {
        delay: 2000,
        category: 'info',
        onClose: undefined,
        autoClose: false,
        max: 5,
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

    beforeEach(inject(function (
    _Notification_,
    _$compile_,
    _$rootScope_,
    _$templateCache_, 
    _$document_
    ) {
        Notification = _Notification_;
        compile = _$compile_;
        scope = _$rootScope_;
        template = _$templateCache_;
        document = _$document_;
    }));

    it('should have configure method', function () {
        expect(notify.configure).toBeTruthy();
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
        var notifyClose;
        beforeEach(function () {
            notifyClose = jasmine.createSpy('closeNotification');
        });

        it('should throw an error', function () {
            var infoTitleError = Notification.info.bind(Notification.info, {message: 'I am information'});
            var infoMessageError = Notification.info.bind(Notification.info, {title: 'I am title'});
            expect(infoTitleError).toThrowError();
            expect(infoMessageError).toThrowError();
        });

        it('should close notification when user click on close button', function () {
            
            Notification.warning({message:'I am message',
                                    title:'I am title',
                                    onClose: notifyClose});
            document.find('button')[0].click();
            expect(notifyClose).toHaveBeenCalled();
        });
    });
});