ri.Notify
=======================


ri.Notify is a service providing simple notifications using it own css styles.

## Features
* No dependencies except of angular.js.
* Small size.
* 3 message types.
* Configure options globally py the provider
* Use custom options such as pirority/callback/delay
* Specify auto close for 'info' notification 

## Install

To setup and run this project you must have install nodejs (https://nodejs.org/en/)
After you installed nodejs you must install couple of executable files: 
```bash
npm install -g gulp-cli karma-cli 
npm install (this will install all the development on your project directory)
```  
## Run test case
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
angular.module('notificationTest', ['ui-notification'])
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
angular.module('notificationTest').controller('notificationController', function($scope, Notification) {
 
  Notification.primary('Primary notification');
  // or simply..
  Notification('Primary notification');
  
  // Other Options
  // Success
  Notification.success('Success notification');
  
  // Message with custom type
  Notification({message: 'Warning notification'}, 'warning');

  // With Title
  Notification({message: 'Primary notification', title: 'Primary notification'});
  
  // Message with custom delay
  Notification.error({message: 'Error notification 1s', delay: 1000});
  
  // Embed HTML within your message.....
  Notification.success({message: 'Success notification<br>Some other <b>content</b><br><a href="https://github.com/alexcrack/angular-ui-notification">This is a link</a><br><img src="https://angularjs.org/img/AngularJS-small.png">', title: 'Html content'});

  // Change position notification
  Notification.error({message: 'Error Bottom Right', positionY: 'bottom', positionX: 'right'});
  
  // Replace message
  Notification.error({message: 'Error notification 1s', replaceMessage: true});
}
```

## Service

Module name: "ri.notify"

Service: "Notification"

Configuration provider: "NotificationProvider"


## Options

Options can be passed to configuration provider globally or used in the current message.

The options list:

|       Option      |      Possible values      |         Default value          |                               Description                                |
| ----------------- | ------------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| delay             | Any integer value         | 5000                           | The time in ms the message is showing before start fading out            |
| startTop          | Any integer value         | 10                             | Vertical padding between messages and vertical border of the browser     |
| startRight        | Any integer value         | 10                             | Horizontal padding between messages and horizontal border of the browser |
| verticalSpacing   | Any integer value         | 10                             | Vertical spacing between messages                                        |
| horizontalSpacing | Any integer value         | 10                             | Horizontal spacing between messages                                      |
| positionX         | "right", "left", "center" | "right"                        | Horizontal position of the message                                       |
| positionY         | "top", "bottom"           | "top"                          | Vertical position of the message                                         |
| replaceMessage    | true, false               | false                          | If true every next appearing message replace old messages                |
| templateUrl       | Any string                | "angular-ui-notification.html" | Custom template filename (URL)                                           |
| onClose           | Any function              | undefined                      | Callback to execute when a notification element is closed. Callback receives the element as its argument. |
| closeOnClick      | true, false               | true                           | If true, messages are closed on click                                    |
| maxCount          | Any integer               | 0                              | Show only [maxCount] last messages. Old messages will be killed. 0 - do not kill |
| priority          | Any integer               | 10                             | The highier the priority is, the higher the notification will be         |

Also you can pass the "scope" option. This is an angular scope option Notification scope will be inherited from. This option can be passed only in the methods. The default value is $rootScope

## Methods

#### Notification service methods

|              Method name               |                   Description                   |
|----------------------------------------|-------------------------------------------------|
| Notification(), Notification.primary() | Show the message with bootstrap's primary class |
| Notification.info()                    | Show the message with bootstrap's info class    |
| Notification.success()                 | Show the message with bootstrap's success class |
| Notification.warning()                 | Show the message with bootstrap's warn class    |
| Notification.error()                   | Show the message with bootstrap's danger class  |
| Notification.clearAll()                | Remove all shown messages                       |
