ri.notify
=======================


ri.notify is a service providing simple notifications using it own css styles.

## Features
* No dependencies except of angular.js.
* Small size.
* 3 message types.
* Configure options globally
* Use custom options such as pirority/callback/delay
* Specify auto close for 'info' notification 

## Install

To setup and run this project you must have install nodejs (https://nodejs.org/en/)
After you installed nodejs you must install couple of executable files: 
```bash
npm install -g gulp-cli karma-cli 
npm install (this will install all the development on your project directory)
```  
## Run unit test case
```bash
npm test 
```

## Run demo
```bash
npm start
```
## Development
```bash
gulp dev
```
## Development Build
```bash
gulp dev:build
```

## Production build
```bash
gulp production
```

## Documentation
  link: http://localhost:3000/docs/#/api/ri.notify.NotificationProvider

## Coverage
  you can find it inside coverage folder.

## Usage
 [Heres a demo](http://localhost:3000/example/)

## Design
  you can find it inside design folder.
  
In your html/template add 
```html
...
  <link rel="stylesheet" href="riNotification.min.css">
...
  <script src="riNotification.min.js"></script>
...

```

In your application, declare dependency injection like so..

```javascript
  angular.module('myApp', ['ri.notify']);
...
```

You can configure module by the provider
```javascript
angular.module('myApp', ['ri.notify'])
    .config(function(NotificationProvider) {
        NotificationProvider.configure({
            title: 'Hey!', //default title
            message: 'How are you doing?', //default message
            delay: 90000, //by default
            onClose: false,//by default
            priority: 90000 //by default it is 90seconds
        });
    });
...
```

And when you need to show notifications, inject service and call it!

```javascript
angular.module('myApp').controller('notificationController', function($scope, Notification) {
 
  Notification.info({title:'I am title header', message: 'I am a info message body'});
  // or simply..
  Notification({message:'awesome', title:'I am cool'}, 'warning');
  Notification({message:'information ', title:'I am info'}, 'info');
  Notification({message:'I am a bug', title:'ALERT!'}, 'error');

  // warning with pirority
  Notification.warning({title:'I am warning header', message:' I am warning message body', pirority: 1});

  // error with callback
  Notification.error({title:'I am error header', message:' I am error message body', pirority: 1, onClose: function (e) {
        alert('hey i gonna go close myself.');
  }});
    
  // Message with custom delay for info type it will automatically close after 10seconds.
  Notification.info({message: 'Error notification 1s', title: 'Auto close', delay: 10000});
}
```

## Service

Module name: "ri.notify"

Service: "Notification"

Configuration provider: "NotificationProvider"

## Methods

#### Notification service methods

|              Method name               |                   Description                   |
|----------------------------------------|-------------------------------------------------|
| Notification(options, category)        | Show the message with category                  |
| Notification.info(options)             | Show the message with info category             |
| Notification.warning(options)          | Show the message with warning category          |
| Notification.error(options)            | Show the message with danger category           |