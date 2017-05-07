!function(e){"use strict";e.module("ri.notify",[]).provider("Notification",function(){this.config={delay:2e3,category:"info",onClose:void 0,autoClose:!1,max:5,priority:0},this.configure=function(t){if(!e.isObject(t))throw new Error("config should be an object!");this.config=e.extend({},this.config,t)},this.$get=["$timeout","$compile","$templateCache","$rootScope","$injector","$sce","$q","$window",function(t,o,i,r,n,s,a,c){var l=this.config.delay,f=this.config.category,d=this.config.onClose,u=this.config.autoClose,g=this.config.max,y=this.config.priority,p=[],h=function(n,c){var h=a.defer();"object"==typeof n&&null!==n||(n={message:n,title:c||"Info"}),n.scope=n.scope?n.scope:r,n.delay=e.isUndefined(n.delay)?l:n.delay,n.category=c||n.category||f||"info",n.onClose=n.onClose?n.onClose:d,n.autoClose=n.autoClose?n.autoClose:u,n.max=n.max?n.max:g,n.priority=n.priority?n.priority:y;return function(){var r=i.get("notification.html"),a=n.scope.$new();a.message=s.trustAsHtml(n.message),a.title=s.trustAsHtml(n.title),a.type=n.category.toLowerCase(),a.delay=n.delay,a.onClose=n.onClose;var c=o(r)(a);c.priority=n.priority;var l=function(e){e=e.originalEvent||e,"click"===e.type&&"closeBtn"===e.target.id&&(a.onClose&&a.$apply(a.onClose(c)),c.remove(),p.splice(p.indexOf(c),1),f(),a.$destroy())};c.bind("click",l),e.isUndefined(n.onClose)||(n.onClose=l),n.autoClose&&n.delay>0&&"info"===n.category&&t(function(){e.forEach(p,function(t,o){e.element(t).attr("class").split(" ")[1]===n.category&&t.triggerHandler("click")})},n.delay);var f=function(){p.sort(function(e,t){return t.priority-e.priority});for(var e,t,o=10,i=0;i<p.length;i++)if(e=p[i],t=parseInt(e[0].offsetHeight),i>0){var r=t+o;o=r,e.css({top:r+"px"})}else e.css({top:"10px"})};c.addClass(n.category),e.element(document.querySelector("body")).append(c),p.push(c),h.resolve(a),t(f,0)}(),h.promise};return h.info=function(t){if(e.isUndefined(t.title))throw new Error("required title");if(e.isUndefined(t.message))throw new Error("required message");return this(t,"info")},h.warning=function(t){if(e.isUndefined(t.title))throw new Error("required title");if(e.isUndefined(t.message))throw new Error("required message");return this(t,"warning")},h.error=function(t){if(e.isUndefined(t.title))throw new Error("required title");if(e.isUndefined(t.message))throw new Error("required message");return this(t,"error")},h}]}).run(["$templateCache",function(e){var t='<section class="notification {{type}}">';t+='<header class="notifyHeader"><h3 class="notifyTitle"> {{title}} </h3>',t+='<button class="delete" id="closeBtn">x</button>',t+="</header>",t+='<div class="message"> {{message}} </div>',t+="</section>",e.put("notification.html",t)}])}(angular);