(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,d=e.filter,g=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,j=i.bind,w=function(n){return n instanceof w?n:this instanceof w?(this._wrapped=n,void 0):new w(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=w),exports._=w):n._=w,w.VERSION="1.4.4";var A=w.each=w.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(w.has(n,a)&&t.call(e,n[a],a,n)===r)return};w.map=w.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e[e.length]=t.call(r,n,u,i)}),e)};var O="Reduce of empty array with no initial value";w.reduce=w.foldl=w.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=w.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},w.reduceRight=w.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=w.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=w.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},w.find=w.detect=function(n,t,r){var e;return E(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},w.filter=w.select=function(n,t,r){var e=[];return null==n?e:d&&n.filter===d?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&(e[e.length]=n)}),e)},w.reject=function(n,t,r){return w.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},w.every=w.all=function(n,t,e){t||(t=w.identity);var u=!0;return null==n?u:g&&n.every===g?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var E=w.some=w.any=function(n,t,e){t||(t=w.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};w.contains=w.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:E(n,function(n){return n===t})},w.invoke=function(n,t){var r=o.call(arguments,2),e=w.isFunction(t);return w.map(n,function(n){return(e?t:n[t]).apply(n,r)})},w.pluck=function(n,t){return w.map(n,function(n){return n[t]})},w.where=function(n,t,r){return w.isEmpty(t)?r?null:[]:w[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},w.findWhere=function(n,t){return w.where(n,t,!0)},w.max=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.max.apply(Math,n);if(!t&&w.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>=e.computed&&(e={value:n,computed:a})}),e.value},w.min=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.min.apply(Math,n);if(!t&&w.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;e.computed>a&&(e={value:n,computed:a})}),e.value},w.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=w.random(r++),e[r-1]=e[t],e[t]=n}),e};var k=function(n){return w.isFunction(n)?n:function(t){return t[n]}};w.sortBy=function(n,t,r){var e=k(t);return w.pluck(w.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index<t.index?-1:1}),"value")};var F=function(n,t,r,e){var u={},i=k(t||w.identity);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};w.groupBy=function(n,t,r){return F(n,t,r,function(n,t,r){(w.has(n,t)?n[t]:n[t]=[]).push(r)})},w.countBy=function(n,t,r){return F(n,t,r,function(n,t){w.has(n,t)||(n[t]=0),n[t]++})},w.sortedIndex=function(n,t,r,e){r=null==r?w.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;u>r.call(e,n[o])?i=o+1:a=o}return i},w.toArray=function(n){return n?w.isArray(n)?o.call(n):n.length===+n.length?w.map(n,w.identity):w.values(n):[]},w.size=function(n){return null==n?0:n.length===+n.length?n.length:w.keys(n).length},w.first=w.head=w.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},w.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},w.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},w.rest=w.tail=w.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},w.compact=function(n){return w.filter(n,w.identity)};var R=function(n,t,r){return A(n,function(n){w.isArray(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r};w.flatten=function(n,t){return R(n,t,[])},w.without=function(n){return w.difference(n,o.call(arguments,1))},w.uniq=w.unique=function(n,t,r,e){w.isFunction(t)&&(e=r,r=t,t=!1);var u=r?w.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:w.contains(a,r))||(a.push(r),i.push(n[e]))}),i},w.union=function(){return w.uniq(c.apply(e,arguments))},w.intersection=function(n){var t=o.call(arguments,1);return w.filter(w.uniq(n),function(n){return w.every(t,function(t){return w.indexOf(t,n)>=0})})},w.difference=function(n){var t=c.apply(e,o.call(arguments,1));return w.filter(n,function(n){return!w.contains(t,n)})},w.zip=function(){for(var n=o.call(arguments),t=w.max(w.pluck(n,"length")),r=Array(t),e=0;t>e;e++)r[e]=w.pluck(n,""+e);return r},w.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},w.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=w.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},w.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},w.range=function(n,t,r){1>=arguments.length&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=Array(e);e>u;)i[u++]=n,n+=r;return i},w.bind=function(n,t){if(n.bind===j&&j)return j.apply(n,o.call(arguments,1));var r=o.call(arguments,2);return function(){return n.apply(t,r.concat(o.call(arguments)))}},w.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},w.bindAll=function(n){var t=o.call(arguments,1);return 0===t.length&&(t=w.functions(n)),A(t,function(t){n[t]=w.bind(n[t],n)}),n},w.memoize=function(n,t){var r={};return t||(t=w.identity),function(){var e=t.apply(this,arguments);return w.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},w.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},w.defer=function(n){return w.delay.apply(w,[n,1].concat(o.call(arguments,1)))},w.throttle=function(n,t){var r,e,u,i,a=0,o=function(){a=new Date,u=null,i=n.apply(r,e)};return function(){var c=new Date,l=t-(c-a);return r=this,e=arguments,0>=l?(clearTimeout(u),u=null,a=c,i=n.apply(r,e)):u||(u=setTimeout(o,l)),i}},w.debounce=function(n,t,r){var e,u;return function(){var i=this,a=arguments,o=function(){e=null,r||(u=n.apply(i,a))},c=r&&!e;return clearTimeout(e),e=setTimeout(o,t),c&&(u=n.apply(i,a)),u}},w.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},w.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},w.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},w.after=function(n,t){return 0>=n?t():function(){return 1>--n?t.apply(this,arguments):void 0}},w.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)w.has(n,r)&&(t[t.length]=r);return t},w.values=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push(n[r]);return t},w.pairs=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push([r,n[r]]);return t},w.invert=function(n){var t={};for(var r in n)w.has(n,r)&&(t[n[r]]=r);return t},w.functions=w.methods=function(n){var t=[];for(var r in n)w.isFunction(n[r])&&t.push(r);return t.sort()},w.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},w.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},w.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)w.contains(r,u)||(t[u]=n[u]);return t},w.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)null==n[r]&&(n[r]=t[r])}),n},w.clone=function(n){return w.isObject(n)?w.isArray(n)?n.slice():w.extend({},n):n},w.tap=function(n,t){return t(n),n};var I=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof w&&(n=n._wrapped),t instanceof w&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==t+"";case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;r.push(n),e.push(t);var a=0,o=!0;if("[object Array]"==u){if(a=n.length,o=a==t.length)for(;a--&&(o=I(n[a],t[a],r,e)););}else{var c=n.constructor,f=t.constructor;if(c!==f&&!(w.isFunction(c)&&c instanceof c&&w.isFunction(f)&&f instanceof f))return!1;for(var s in n)if(w.has(n,s)&&(a++,!(o=w.has(t,s)&&I(n[s],t[s],r,e))))break;if(o){for(s in t)if(w.has(t,s)&&!a--)break;o=!a}}return r.pop(),e.pop(),o};w.isEqual=function(n,t){return I(n,t,[],[])},w.isEmpty=function(n){if(null==n)return!0;if(w.isArray(n)||w.isString(n))return 0===n.length;for(var t in n)if(w.has(n,t))return!1;return!0},w.isElement=function(n){return!(!n||1!==n.nodeType)},w.isArray=x||function(n){return"[object Array]"==l.call(n)},w.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){w["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),w.isArguments(arguments)||(w.isArguments=function(n){return!(!n||!w.has(n,"callee"))}),"function"!=typeof/./&&(w.isFunction=function(n){return"function"==typeof n}),w.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},w.isNaN=function(n){return w.isNumber(n)&&n!=+n},w.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},w.isNull=function(n){return null===n},w.isUndefined=function(n){return n===void 0},w.has=function(n,t){return f.call(n,t)},w.noConflict=function(){return n._=t,this},w.identity=function(n){return n},w.times=function(n,t,r){for(var e=Array(n),u=0;n>u;u++)e[u]=t.call(r,u);return e},w.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var M={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};M.unescape=w.invert(M.escape);var S={escape:RegExp("["+w.keys(M.escape).join("")+"]","g"),unescape:RegExp("("+w.keys(M.unescape).join("|")+")","g")};w.each(["escape","unescape"],function(n){w[n]=function(t){return null==t?"":(""+t).replace(S[n],function(t){return M[n][t]})}}),w.result=function(n,t){if(null==n)return null;var r=n[t];return w.isFunction(r)?r.call(n):r},w.mixin=function(n){A(w.functions(n),function(t){var r=w[t]=n[t];w.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),D.call(this,r.apply(w,n))}})};var N=0;w.uniqueId=function(n){var t=++N+"";return n?n+t:t},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var T=/(.)^/,q={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},B=/\\|'|\r|\n|\t|\u2028|\u2029/g;w.template=function(n,t,r){var e;r=w.defaults({},r,w.templateSettings);var u=RegExp([(r.escape||T).source,(r.interpolate||T).source,(r.evaluate||T).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(B,function(n){return"\\"+q[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,w);var c=function(n){return e.call(this,n,w)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},w.chain=function(n){return w(n).chain()};var D=function(n){return this._chain?w(n).chain():n};w.mixin(w),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];w.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],D.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];w.prototype[n]=function(){return D.call(this,t.apply(this._wrapped,arguments))}}),w.extend(w.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
define("underscore", (function (global) {
    return function () {
        var ret, fn;
        return ret || global._;
    };
}(this)));

(function(){var t=this;var e=t.Backbone;var i=[];var r=i.push;var s=i.slice;var n=i.splice;var a;if(typeof exports!=="undefined"){a=exports}else{a=t.Backbone={}}a.VERSION="1.0.0";var h=t._;if(!h&&typeof require!=="undefined")h=require("underscore");a.$=t.jQuery||t.Zepto||t.ender||t.$;a.noConflict=function(){t.Backbone=e;return this};a.emulateHTTP=false;a.emulateJSON=false;var o=a.Events={on:function(t,e,i){if(!l(this,"on",t,[e,i])||!e)return this;this._events||(this._events={});var r=this._events[t]||(this._events[t]=[]);r.push({callback:e,context:i,ctx:i||this});return this},once:function(t,e,i){if(!l(this,"once",t,[e,i])||!e)return this;var r=this;var s=h.once(function(){r.off(t,s);e.apply(this,arguments)});s._callback=e;return this.on(t,s,i)},off:function(t,e,i){var r,s,n,a,o,u,c,f;if(!this._events||!l(this,"off",t,[e,i]))return this;if(!t&&!e&&!i){this._events={};return this}a=t?[t]:h.keys(this._events);for(o=0,u=a.length;o<u;o++){t=a[o];if(n=this._events[t]){this._events[t]=r=[];if(e||i){for(c=0,f=n.length;c<f;c++){s=n[c];if(e&&e!==s.callback&&e!==s.callback._callback||i&&i!==s.context){r.push(s)}}}if(!r.length)delete this._events[t]}}return this},trigger:function(t){if(!this._events)return this;var e=s.call(arguments,1);if(!l(this,"trigger",t,e))return this;var i=this._events[t];var r=this._events.all;if(i)c(i,e);if(r)c(r,arguments);return this},stopListening:function(t,e,i){var r=this._listeners;if(!r)return this;var s=!e&&!i;if(typeof e==="object")i=this;if(t)(r={})[t._listenerId]=t;for(var n in r){r[n].off(e,i,this);if(s)delete this._listeners[n]}return this}};var u=/\s+/;var l=function(t,e,i,r){if(!i)return true;if(typeof i==="object"){for(var s in i){t[e].apply(t,[s,i[s]].concat(r))}return false}if(u.test(i)){var n=i.split(u);for(var a=0,h=n.length;a<h;a++){t[e].apply(t,[n[a]].concat(r))}return false}return true};var c=function(t,e){var i,r=-1,s=t.length,n=e[0],a=e[1],h=e[2];switch(e.length){case 0:while(++r<s)(i=t[r]).callback.call(i.ctx);return;case 1:while(++r<s)(i=t[r]).callback.call(i.ctx,n);return;case 2:while(++r<s)(i=t[r]).callback.call(i.ctx,n,a);return;case 3:while(++r<s)(i=t[r]).callback.call(i.ctx,n,a,h);return;default:while(++r<s)(i=t[r]).callback.apply(i.ctx,e)}};var f={listenTo:"on",listenToOnce:"once"};h.each(f,function(t,e){o[e]=function(e,i,r){var s=this._listeners||(this._listeners={});var n=e._listenerId||(e._listenerId=h.uniqueId("l"));s[n]=e;if(typeof i==="object")r=this;e[t](i,r,this);return this}});o.bind=o.on;o.unbind=o.off;h.extend(a,o);var d=a.Model=function(t,e){var i;var r=t||{};e||(e={});this.cid=h.uniqueId("c");this.attributes={};h.extend(this,h.pick(e,p));if(e.parse)r=this.parse(r,e)||{};if(i=h.result(this,"defaults")){r=h.defaults({},r,i)}this.set(r,e);this.changed={};this.initialize.apply(this,arguments)};var p=["url","urlRoot","collection"];h.extend(d.prototype,o,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(t){return h.clone(this.attributes)},sync:function(){return a.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return h.escape(this.get(t))},has:function(t){return this.get(t)!=null},set:function(t,e,i){var r,s,n,a,o,u,l,c;if(t==null)return this;if(typeof t==="object"){s=t;i=e}else{(s={})[t]=e}i||(i={});if(!this._validate(s,i))return false;n=i.unset;o=i.silent;a=[];u=this._changing;this._changing=true;if(!u){this._previousAttributes=h.clone(this.attributes);this.changed={}}c=this.attributes,l=this._previousAttributes;if(this.idAttribute in s)this.id=s[this.idAttribute];for(r in s){e=s[r];if(!h.isEqual(c[r],e))a.push(r);if(!h.isEqual(l[r],e)){this.changed[r]=e}else{delete this.changed[r]}n?delete c[r]:c[r]=e}if(!o){if(a.length)this._pending=true;for(var f=0,d=a.length;f<d;f++){this.trigger("change:"+a[f],this,c[a[f]],i)}}if(u)return this;if(!o){while(this._pending){this._pending=false;this.trigger("change",this,i)}}this._pending=false;this._changing=false;return this},unset:function(t,e){return this.set(t,void 0,h.extend({},e,{unset:true}))},clear:function(t){var e={};for(var i in this.attributes)e[i]=void 0;return this.set(e,h.extend({},t,{unset:true}))},hasChanged:function(t){if(t==null)return!h.isEmpty(this.changed);return h.has(this.changed,t)},changedAttributes:function(t){if(!t)return this.hasChanged()?h.clone(this.changed):false;var e,i=false;var r=this._changing?this._previousAttributes:this.attributes;for(var s in t){if(h.isEqual(r[s],e=t[s]))continue;(i||(i={}))[s]=e}return i},previous:function(t){if(t==null||!this._previousAttributes)return null;return this._previousAttributes[t]},previousAttributes:function(){return h.clone(this._previousAttributes)},fetch:function(t){t=t?h.clone(t):{};if(t.parse===void 0)t.parse=true;var e=this;var i=t.success;t.success=function(r){if(!e.set(e.parse(r,t),t))return false;if(i)i(e,r,t);e.trigger("sync",e,r,t)};R(this,t);return this.sync("read",this,t)},save:function(t,e,i){var r,s,n,a=this.attributes;if(t==null||typeof t==="object"){r=t;i=e}else{(r={})[t]=e}if(r&&(!i||!i.wait)&&!this.set(r,i))return false;i=h.extend({validate:true},i);if(!this._validate(r,i))return false;if(r&&i.wait){this.attributes=h.extend({},a,r)}if(i.parse===void 0)i.parse=true;var o=this;var u=i.success;i.success=function(t){o.attributes=a;var e=o.parse(t,i);if(i.wait)e=h.extend(r||{},e);if(h.isObject(e)&&!o.set(e,i)){return false}if(u)u(o,t,i);o.trigger("sync",o,t,i)};R(this,i);s=this.isNew()?"create":i.patch?"patch":"update";if(s==="patch")i.attrs=r;n=this.sync(s,this,i);if(r&&i.wait)this.attributes=a;return n},destroy:function(t){t=t?h.clone(t):{};var e=this;var i=t.success;var r=function(){e.trigger("destroy",e,e.collection,t)};t.success=function(s){if(t.wait||e.isNew())r();if(i)i(e,s,t);if(!e.isNew())e.trigger("sync",e,s,t)};if(this.isNew()){t.success();return false}R(this,t);var s=this.sync("delete",this,t);if(!t.wait)r();return s},url:function(){var t=h.result(this,"urlRoot")||h.result(this.collection,"url")||U();if(this.isNew())return t;return t+(t.charAt(t.length-1)==="/"?"":"/")+encodeURIComponent(this.id)},parse:function(t,e){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return this.id==null},isValid:function(t){return this._validate({},h.extend(t||{},{validate:true}))},_validate:function(t,e){if(!e.validate||!this.validate)return true;t=h.extend({},this.attributes,t);var i=this.validationError=this.validate(t,e)||null;if(!i)return true;this.trigger("invalid",this,i,h.extend(e||{},{validationError:i}));return false}});var v=["keys","values","pairs","invert","pick","omit"];h.each(v,function(t){d.prototype[t]=function(){var e=s.call(arguments);e.unshift(this.attributes);return h[t].apply(h,e)}});var g=a.Collection=function(t,e){e||(e={});if(e.url)this.url=e.url;if(e.model)this.model=e.model;if(e.comparator!==void 0)this.comparator=e.comparator;this._reset();this.initialize.apply(this,arguments);if(t)this.reset(t,h.extend({silent:true},e))};var m={add:true,remove:true,merge:true};var y={add:true,merge:false,remove:false};h.extend(g.prototype,o,{model:d,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},sync:function(){return a.sync.apply(this,arguments)},add:function(t,e){return this.set(t,h.defaults(e||{},y))},remove:function(t,e){t=h.isArray(t)?t.slice():[t];e||(e={});var i,r,s,n;for(i=0,r=t.length;i<r;i++){n=this.get(t[i]);if(!n)continue;delete this._byId[n.id];delete this._byId[n.cid];s=this.indexOf(n);this.models.splice(s,1);this.length--;if(!e.silent){e.index=s;n.trigger("remove",n,this,e)}this._removeReference(n)}return this},set:function(t,e){e=h.defaults(e||{},m);if(e.parse)t=this.parse(t,e);if(!h.isArray(t))t=t?[t]:[];var i,s,a,o,u,l;var c=e.at;var f=this.comparator&&c==null&&e.sort!==false;var d=h.isString(this.comparator)?this.comparator:null;var p=[],v=[],g={};for(i=0,s=t.length;i<s;i++){if(!(a=this._prepareModel(t[i],e)))continue;if(u=this.get(a)){if(e.remove)g[u.cid]=true;if(e.merge){u.set(a.attributes,e);if(f&&!l&&u.hasChanged(d))l=true}}else if(e.add){p.push(a);a.on("all",this._onModelEvent,this);this._byId[a.cid]=a;if(a.id!=null)this._byId[a.id]=a}}if(e.remove){for(i=0,s=this.length;i<s;++i){if(!g[(a=this.models[i]).cid])v.push(a)}if(v.length)this.remove(v,e)}if(p.length){if(f)l=true;this.length+=p.length;if(c!=null){n.apply(this.models,[c,0].concat(p))}else{r.apply(this.models,p)}}if(l)this.sort({silent:true});if(e.silent)return this;for(i=0,s=p.length;i<s;i++){(a=p[i]).trigger("add",a,this,e)}if(l)this.trigger("sort",this,e);return this},reset:function(t,e){e||(e={});for(var i=0,r=this.models.length;i<r;i++){this._removeReference(this.models[i])}e.previousModels=this.models;this._reset();this.add(t,h.extend({silent:true},e));if(!e.silent)this.trigger("reset",this,e);return this},push:function(t,e){t=this._prepareModel(t,e);this.add(t,h.extend({at:this.length},e));return t},pop:function(t){var e=this.at(this.length-1);this.remove(e,t);return e},unshift:function(t,e){t=this._prepareModel(t,e);this.add(t,h.extend({at:0},e));return t},shift:function(t){var e=this.at(0);this.remove(e,t);return e},slice:function(t,e){return this.models.slice(t,e)},get:function(t){if(t==null)return void 0;return this._byId[t.id!=null?t.id:t.cid||t]},at:function(t){return this.models[t]},where:function(t,e){if(h.isEmpty(t))return e?void 0:[];return this[e?"find":"filter"](function(e){for(var i in t){if(t[i]!==e.get(i))return false}return true})},findWhere:function(t){return this.where(t,true)},sort:function(t){if(!this.comparator)throw new Error("Cannot sort a set without a comparator");t||(t={});if(h.isString(this.comparator)||this.comparator.length===1){this.models=this.sortBy(this.comparator,this)}else{this.models.sort(h.bind(this.comparator,this))}if(!t.silent)this.trigger("sort",this,t);return this},sortedIndex:function(t,e,i){e||(e=this.comparator);var r=h.isFunction(e)?e:function(t){return t.get(e)};return h.sortedIndex(this.models,t,r,i)},pluck:function(t){return h.invoke(this.models,"get",t)},fetch:function(t){t=t?h.clone(t):{};if(t.parse===void 0)t.parse=true;var e=t.success;var i=this;t.success=function(r){var s=t.reset?"reset":"set";i[s](r,t);if(e)e(i,r,t);i.trigger("sync",i,r,t)};R(this,t);return this.sync("read",this,t)},create:function(t,e){e=e?h.clone(e):{};if(!(t=this._prepareModel(t,e)))return false;if(!e.wait)this.add(t,e);var i=this;var r=e.success;e.success=function(s){if(e.wait)i.add(t,e);if(r)r(t,s,e)};t.save(null,e);return t},parse:function(t,e){return t},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0;this.models=[];this._byId={}},_prepareModel:function(t,e){if(t instanceof d){if(!t.collection)t.collection=this;return t}e||(e={});e.collection=this;var i=new this.model(t,e);if(!i._validate(t,e)){this.trigger("invalid",this,t,e);return false}return i},_removeReference:function(t){if(this===t.collection)delete t.collection;t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,r){if((t==="add"||t==="remove")&&i!==this)return;if(t==="destroy")this.remove(e,r);if(e&&t==="change:"+e.idAttribute){delete this._byId[e.previous(e.idAttribute)];if(e.id!=null)this._byId[e.id]=e}this.trigger.apply(this,arguments)}});var _=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","indexOf","shuffle","lastIndexOf","isEmpty","chain"];h.each(_,function(t){g.prototype[t]=function(){var e=s.call(arguments);e.unshift(this.models);return h[t].apply(h,e)}});var w=["groupBy","countBy","sortBy"];h.each(w,function(t){g.prototype[t]=function(e,i){var r=h.isFunction(e)?e:function(t){return t.get(e)};return h[t](this.models,r,i)}});var b=a.View=function(t){this.cid=h.uniqueId("view");this._configure(t||{});this._ensureElement();this.initialize.apply(this,arguments);this.delegateEvents()};var x=/^(\S+)\s*(.*)$/;var E=["model","collection","el","id","attributes","className","tagName","events"];h.extend(b.prototype,o,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){this.$el.remove();this.stopListening();return this},setElement:function(t,e){if(this.$el)this.undelegateEvents();this.$el=t instanceof a.$?t:a.$(t);this.el=this.$el[0];if(e!==false)this.delegateEvents();return this},delegateEvents:function(t){if(!(t||(t=h.result(this,"events"))))return this;this.undelegateEvents();for(var e in t){var i=t[e];if(!h.isFunction(i))i=this[t[e]];if(!i)continue;var r=e.match(x);var s=r[1],n=r[2];i=h.bind(i,this);s+=".delegateEvents"+this.cid;if(n===""){this.$el.on(s,i)}else{this.$el.on(s,n,i)}}return this},undelegateEvents:function(){this.$el.off(".delegateEvents"+this.cid);return this},_configure:function(t){if(this.options)t=h.extend({},h.result(this,"options"),t);h.extend(this,h.pick(t,E));this.options=t},_ensureElement:function(){if(!this.el){var t=h.extend({},h.result(this,"attributes"));if(this.id)t.id=h.result(this,"id");if(this.className)t["class"]=h.result(this,"className");var e=a.$("<"+h.result(this,"tagName")+">").attr(t);this.setElement(e,false)}else{this.setElement(h.result(this,"el"),false)}}});a.sync=function(t,e,i){var r=k[t];h.defaults(i||(i={}),{emulateHTTP:a.emulateHTTP,emulateJSON:a.emulateJSON});var s={type:r,dataType:"json"};if(!i.url){s.url=h.result(e,"url")||U()}if(i.data==null&&e&&(t==="create"||t==="update"||t==="patch")){s.contentType="application/json";s.data=JSON.stringify(i.attrs||e.toJSON(i))}if(i.emulateJSON){s.contentType="application/x-www-form-urlencoded";s.data=s.data?{model:s.data}:{}}if(i.emulateHTTP&&(r==="PUT"||r==="DELETE"||r==="PATCH")){s.type="POST";if(i.emulateJSON)s.data._method=r;var n=i.beforeSend;i.beforeSend=function(t){t.setRequestHeader("X-HTTP-Method-Override",r);if(n)return n.apply(this,arguments)}}if(s.type!=="GET"&&!i.emulateJSON){s.processData=false}if(s.type==="PATCH"&&window.ActiveXObject&&!(window.external&&window.external.msActiveXFilteringEnabled)){s.xhr=function(){return new ActiveXObject("Microsoft.XMLHTTP")}}var o=i.xhr=a.ajax(h.extend(s,i));e.trigger("request",e,o,i);return o};var k={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};a.ajax=function(){return a.$.ajax.apply(a.$,arguments)};var S=a.Router=function(t){t||(t={});if(t.routes)this.routes=t.routes;this._bindRoutes();this.initialize.apply(this,arguments)};var $=/\((.*?)\)/g;var T=/(\(\?)?:\w+/g;var H=/\*\w+/g;var A=/[\-{}\[\]+?.,\\\^$|#\s]/g;h.extend(S.prototype,o,{initialize:function(){},route:function(t,e,i){if(!h.isRegExp(t))t=this._routeToRegExp(t);if(h.isFunction(e)){i=e;e=""}if(!i)i=this[e];var r=this;a.history.route(t,function(s){var n=r._extractParameters(t,s);i&&i.apply(r,n);r.trigger.apply(r,["route:"+e].concat(n));r.trigger("route",e,n);a.history.trigger("route",r,e,n)});return this},navigate:function(t,e){a.history.navigate(t,e);return this},_bindRoutes:function(){if(!this.routes)return;this.routes=h.result(this,"routes");var t,e=h.keys(this.routes);while((t=e.pop())!=null){this.route(t,this.routes[t])}},_routeToRegExp:function(t){t=t.replace(A,"\\$&").replace($,"(?:$1)?").replace(T,function(t,e){return e?t:"([^/]+)"}).replace(H,"(.*?)");return new RegExp("^"+t+"$")},_extractParameters:function(t,e){var i=t.exec(e).slice(1);return h.map(i,function(t){return t?decodeURIComponent(t):null})}});var I=a.History=function(){this.handlers=[];h.bindAll(this,"checkUrl");if(typeof window!=="undefined"){this.location=window.location;this.history=window.history}};var N=/^[#\/]|\s+$/g;var P=/^\/+|\/+$/g;var O=/msie [\w.]+/;var C=/\/$/;I.started=false;h.extend(I.prototype,o,{interval:50,getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getFragment:function(t,e){if(t==null){if(this._hasPushState||!this._wantsHashChange||e){t=this.location.pathname;var i=this.root.replace(C,"");if(!t.indexOf(i))t=t.substr(i.length)}else{t=this.getHash()}}return t.replace(N,"")},start:function(t){if(I.started)throw new Error("Backbone.history has already been started");I.started=true;this.options=h.extend({},{root:"/"},this.options,t);this.root=this.options.root;this._wantsHashChange=this.options.hashChange!==false;this._wantsPushState=!!this.options.pushState;this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);var e=this.getFragment();var i=document.documentMode;var r=O.exec(navigator.userAgent.toLowerCase())&&(!i||i<=7);this.root=("/"+this.root+"/").replace(P,"/");if(r&&this._wantsHashChange){this.iframe=a.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow;this.navigate(e)}if(this._hasPushState){a.$(window).on("popstate",this.checkUrl)}else if(this._wantsHashChange&&"onhashchange"in window&&!r){a.$(window).on("hashchange",this.checkUrl)}else if(this._wantsHashChange){this._checkUrlInterval=setInterval(this.checkUrl,this.interval)}this.fragment=e;var s=this.location;var n=s.pathname.replace(/[^\/]$/,"$&/")===this.root;if(this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!n){this.fragment=this.getFragment(null,true);this.location.replace(this.root+this.location.search+"#"+this.fragment);return true}else if(this._wantsPushState&&this._hasPushState&&n&&s.hash){this.fragment=this.getHash().replace(N,"");this.history.replaceState({},document.title,this.root+this.fragment+s.search)}if(!this.options.silent)return this.loadUrl()},stop:function(){a.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl);clearInterval(this._checkUrlInterval);I.started=false},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(t){var e=this.getFragment();if(e===this.fragment&&this.iframe){e=this.getFragment(this.getHash(this.iframe))}if(e===this.fragment)return false;if(this.iframe)this.navigate(e);this.loadUrl()||this.loadUrl(this.getHash())},loadUrl:function(t){var e=this.fragment=this.getFragment(t);var i=h.any(this.handlers,function(t){if(t.route.test(e)){t.callback(e);return true}});return i},navigate:function(t,e){if(!I.started)return false;if(!e||e===true)e={trigger:e};t=this.getFragment(t||"");if(this.fragment===t)return;this.fragment=t;var i=this.root+t;if(this._hasPushState){this.history[e.replace?"replaceState":"pushState"]({},document.title,i)}else if(this._wantsHashChange){this._updateHash(this.location,t,e.replace);if(this.iframe&&t!==this.getFragment(this.getHash(this.iframe))){if(!e.replace)this.iframe.document.open().close();this._updateHash(this.iframe.location,t,e.replace)}}else{return this.location.assign(i)}if(e.trigger)this.loadUrl(t)},_updateHash:function(t,e,i){if(i){var r=t.href.replace(/(javascript:|#).*$/,"");t.replace(r+"#"+e)}else{t.hash="#"+e}}});a.history=new I;var j=function(t,e){var i=this;var r;if(t&&h.has(t,"constructor")){r=t.constructor}else{r=function(){return i.apply(this,arguments)}}h.extend(r,i,e);var s=function(){this.constructor=r};s.prototype=i.prototype;r.prototype=new s;if(t)h.extend(r.prototype,t);r.__super__=i.prototype;return r};d.extend=g.extend=S.extend=b.extend=I.extend=j;var U=function(){throw new Error('A "url" property or function must be specified')};var R=function(t,e){var i=e.error;e.error=function(r){if(i)i(t,r,e);t.trigger("error",t,r,e)}}}).call(this);
/*
//@ sourceMappingURL=backbone-min.map
*/;
var sitesurn=[];
define("backbone", ["underscore"], (function (global) {
    return function () {
        var ret, fn;
        return ret || global.Backbone;
    };
}(this)));

define('js/Transition',['underscore', 'backbone'],
function (_, Backbone)
{
  

  function Transition(rootDom)
  {
    this.rootDom = rootDom;
    this.lastWaitText = null;
    this.pageHasFailed = false;
  }

  Transition.prototype.page = function (goFrom, goTo)
  {
    this.rootDom.find('button.logout').show();
/*
    if (!(goFrom.hasClass('hides')))
    {
      var item = goFrom;
      item.addClass('hides');
      item.one('transitionend', function() {
	item.addClass('afterHide');

	goTo.removeClass('afterHide');
	setTimeout(function() {
	  goTo.removeClass('hides');
	}, 20);
      });
    }
*/
    goFrom.hide();
    goTo.show();
    goTo.removeClass('hides');
    goTo.removeClass('afterHide');
  };

  Transition.prototype.startWaiting = function (oldNode, text)
  {
//    var shouldAppend = (this.lastWaitText === null);
    var shouldAppend = true;
    if (oldNode)
    {
      this.page(oldNode, this.rootDom.find('#waitContainer'));
    }
//    this.hideWait(this.lastWaitText);
    if (text)
    {
      this.lastWaitText = $('<h1>' + text + '</h1>');
      if (shouldAppend)
      {
	this.rootDom.find('#waitText').append(this.lastWaitText);
      }
    }
    else
    {
      this.rootDom.find('#waitText').html('');
    }
  };

  Transition.prototype.stopWaiting = function (newNode)
  {
    this.page(this.rootDom.find('#waitContainer'), newNode);
    this.rootDom.find('#waitText').html('');
//    this.hideWait(this.lastWaitText);
//    this.lastWaitText = null;
  };

  Transition.prototype.hideWait = function (node)
  {
    var that = this;
    if (node)
    {
      node.addClass('hides')
	.one('transitionend', function (event) {
	  node.remove();
	  if (that.lastWaitText)
	  {
	    that.rootDom.find('#waitText').append(that.lastWaitText);
	  }
	});
    }
  }


  Transition.prototype.startFail = function (node, message, error)
  {
    if (! this.pageHasFailed)
    {
      this.page(node, this.rootDom.find('#failContainer'));
      $('#failTitle').html(_.escape(message));
      if (error)
      {
	this.rootDom.find('#failMessage').html(_.escape(vkbeautify.json(JSON.stringify(error))));
      }
      this.pageHasFailed = true;
    }
  };

  Transition.prototype.switchNav = function (target)
  {
    this.rootDom.find('.navbar').each(function() {
      $(this).addClass('hidden');
    });
    target.removeClass('hidden');
  };

  return Transition;
});

define('js/cache',['underscore'],
function (_)
{
  

  var cache = {};

  var localStorageParams = {};
  var sessionStorageParams = {};

  var initialized = false;

  var sessionStorageItems = [
    "passphrase"
  ];

  var localStorageItems = [
    "userName",
    "userUrn",
    "userCert",
    "userKey",
    "userCredential",
    "provider",
    "cabundle",
    "salist",
    "amlist"
  ];

  function initializeCache()
  {
    initialized = true;
    try {
      sessionStorageParams = JSON.parse(window.sessionStorage.params);
      localStorageParams = JSON.parse(window.localStorage.params);
    } catch (e) { }
  }

  cache.get = function(cachedItem)
  {
    var result = null;
    if (!initialized)
    {
      initializeCache();
    }
    if (_.contains(sessionStorageItems, cachedItem))
    {
      try {
	result = sessionStorageParams[cachedItem];
      } catch (e) { }
    }
    else if (_.contains(localStorageItems, cachedItem))
    {
      try {
	result = localStorageParams[cachedItem];
      } catch (e) { }
    }
    return result;
  };

  cache.set = function(cacheName, cacheValue)
  {
    if (!initialized)
    {
      initializeCache();
    }
    if (_.contains(sessionStorageItems, cacheName))
    {
      try {
	sessionStorageParams[cacheName] = cacheValue;
	sessionStorage.params = JSON.stringify(sessionStorageParams);
      } catch (e) { }
    }
    else if (_.contains(localStorageItems, cacheName))
    {
      try {
	localStorageParams[cacheName] = cacheValue;
	localStorage.params = JSON.stringify(localStorageParams);
      } catch (e) { }
    }
  };

  cache.remove = function(cacheName)
  {
    if (!initialized)
    {
      initializeCache();
    }
    if (_.contains(sessionStorageItems, cacheName))
    {
      try {
	delete sessionStorageParams[cacheName];
	sessionStorage.params = JSON.stringify(sessionStorageParams);
      } catch (e) { }
    }
    if (_.contains(localStorageItems, cacheName))
    {
      try {
	delete localStorageParams[cacheName];
	localStorage.params = JSON.stringify(sessionStorageParams);
      } catch (e) { }
    }
  };

  return cache;
});

define('lib/PrettyXML',[],
function ()
{
  

  return {

    format: function (xml) {
      var formatted = '';
      var reg = /(>)\s*(<)(\/*)/g;
      xml = xml.toString().replace(reg, '$1\r\n$2$3');
      var pad = 0;
      var nodes = xml.split('\r\n');
      for(var n in nodes) {
	var node = nodes[n];
	var indent = 0;
	if (node.match(/.+<\/\w[^>]*>$/)) {
	  indent = 0;
	} else if (node.match(/^<\/\w/)) {
	  if (pad !== 0) {
            pad -= 1;
	  }
	} else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
	  indent = 1;
	} else {
	  indent = 0;
	}
	
	var padding = '';
	for (var i = 0; i < pad; i++) {
	  padding += '  ';
	}
  
	formatted += padding + node + '\r\n';
	pad += indent;
      }
      return formatted;
    }

  };
});

define('js/canvas/Constraints',['underscore'],
function (_)
{
  

  var types = {
    'aggregates': 'aggregates',
    'images': 'images',
    'types': 'types',
    'hardware': 'hardware',
    'linkTypes': 'linkTypes',
    'sharedvlans': 'sharedvlans',
    'linkNodes1': 'types',
    'linkNodes2': 'types'
  };

  var debug = false;

  function Constraints(context)
  {
    var that = this;
    that.groups = {};
    that.possible = {};
    _.each(_.keys(types), function (type) {
      var typeOption = types[type];
      that.possible[type] = [];
      _.each(context.canvasOptions[typeOption], function (value) {
	that.possible[type].push(value.id);
      });
    });
    this.allowAllSets(context.constraints);
  }

  Constraints.prototype.allowAllSets = function (list)
  {
    var that = this;
    _.each(list, function (set) {
      that.allowSet(set, true);
      if (set['node'] || set['node2'])
      {
	var swapped = _.clone(set);
	swapped['node'] = set['node2'];
	swapped['node2'] = set['node'];
	that.allowSet(swapped, false);
	if (set['node'] && set['link'] && ! set['node2'])
	{
	  swapped = _.clone(set);
	  swapped['node2'] = swapped['node'];
	  that.allowSet(swapped, false);
	}
	else if (set['node2'] && set['link'] && ! set['node'])
	{
	  swapped = _.clone(set);
	  swapped['node'] = swapped['node2'];
	  that.allowSet(swapped, false);
	}
      }
    });
  };

  Constraints.prototype.allowSet = function (set, shouldComplain)
  {
    var that = this;
    var groupKey = makeGroupKey(set);
    that.groups[groupKey] = that.groups[groupKey] || [];
    var isDuplicate = false;
    _.each(that.groups[groupKey], function (oldSet) {
      if (_.isEqual(set, oldSet))
      {
	isDuplicate = true;
	if (shouldComplain)
	{
	  console.log('Duplicate constraint', set);
	}
      }
    });
    if (! isDuplicate)
    {
      that.groups[groupKey].push(set);
    }
  };

  // Returns a list of valid ids of unboundType inside of the
  // unboundSubclause which are a valid match when combined with every
  // bound item in the boundList
  Constraints.prototype.getValidList = function (boundList,
						 unboundSubclause,
						 unboundType,
						 rejected)
  {
    if (debug) { console.log('List for: ', unboundSubclause, unboundType); }
    var that = this;
    var result = [];
    _.each(that.possible[unboundType], function (item) {
      var candidateList = [];
      _.each(boundList, function (item) {
	var clone = {};
	_.each(_.keys(item), function (key) {
	  clone[key] = _.clone(item[key]);
	});
	candidateList.push(clone);
      });
      _.each(candidateList, function (candidate) {
	if (debug) { console.log('-', unboundType, item); }
	if (! candidate[unboundSubclause])
	{
	  candidate[unboundSubclause] = {};
	}
	candidate[unboundSubclause][unboundType] = item;
      });
      if (that.allValid(candidateList))
      {
	result.push(item);
      }
      else if (rejected)
      {
	rejected.push(item);
      }
    });
    if (debug) { console.log('Overall result is', result); }
    return result;
  };

  // Returns true if all candidates in the candidate list match every
  // group.
  Constraints.prototype.allValid = function (candidateList)
  {
    var that = this;
    var result = true;
    _.each(candidateList, function (candidate) {
      result = result && that.isValid(candidate);
    });
    if (debug) { console.log('-', 'End Candidate List: ', candidateList); }
    return result;
  };

  // Check to see if a single candidate is valid. A candidate is valid
  // if it matches every group. Candidate subkeys contain strings
  // while clause subkeys contain lists of strings.
  Constraints.prototype.isValid = function (candidate)
  {
    var that = this;
    var result = true;
    _.each(_.keys(that.groups), function (groupKey) {
      result = result && that.isValidForGroup(candidate, that.groups[groupKey]);
    });
    if (debug) { console.log('--', 'Candidate: ', result, candidate); }
    return result;
  };

  // A group is a set of clauses which target identical keys. These
  // are not explicit in the input, but are implicitly grouped by
  // looking at the actual keys. A group is valid if any clause in the
  // group matches.
  Constraints.prototype.isValidForGroup = function (candidate, group)
  {
    var result = false;
    _.each(group, function (clause) {
      result = result || matchClause(candidate, clause, this.possible);
    }.bind(this));
    if (debug) { console.log('---', 'Group: ', result, candidate, group); }
    return result;
  };

  // A clause is the atomic unit of the whitelist. This is one item on
  // the list of constraints. If all the sub-keys match, the whole
  // thing matches.
  function matchClause(candidate, clause, possible)
  {
    var result = true;
    if (candidate['link'] || ! clause['link'])
    {
      _.each(_.keys(clause), function (key) {
	result = result && (! candidate[key] || ! clause[key] ||
			    matchSubkeys(candidate[key], clause[key],
					 possible));
      });
    }
    if (debug) { console.log('----', 'Clause: ', result, candidate, clause); }
    return result;
  };

  // Clauses are logically divided into three subkey components for
  // clarity. These are the 'node', 'link', and 'node2'
  // sub-clauses. All of the sub-clauses have to match in order for
  // the clause as a whole to match.
  function matchSubkeys(candidateSub, clauseSub, possible)
  {
    var result = true;
    _.each(_.keys(clauseSub), function (key) {
      result = result && (! candidateSub[key] || ! clauseSub[key] ||
			  possible[key].indexOf(candidateSub[key]) === -1 ||
			  _.contains(clauseSub[key], '*') ||
			  _.contains(clauseSub[key], candidateSub[key]));
    });
    if (debug) { console.log('-----', 'Subkeys: ', result, candidateSub, clauseSub); }
    return result;
  };

  function makeGroupKey(obj)
  {
    var result = '';
    var keyList = _.keys(obj);
    keyList.sort();
    _.each(keyList, function (outer) {
      if (obj[outer])
      {
	var innerKeys = _.keys(obj[outer]);
	innerKeys.sort();
	result += ':' + outer + ':' + innerKeys.join('~');
      }
    });
    return result;
  }

  return Constraints;
});

/*
 * rspecCommon.js
 *
 * Common constants and utility functions for dealing with rspecs
 *
 */

define('js/canvas/rspecCommon',['underscore', 'backbone'],
function (_, Backbone)
{
  

  var rspecCommon = {};

  rspecCommon.rspecNamespace = 'http://www.geni.net/resources/rspec/3';
  rspecCommon.emulabNamespace = 'http://www.protogeni.net/resources/rspec/ext/emulab/1';
  rspecCommon.jacksNamespace = 'http://www.protogeni.net/resources/rspec/ext/jacks/1';
  rspecCommon.openflow3Namespace = 'http://www.geni.net/resources/rspec/ext/openflow/3';
  rspecCommon.openflow4Namespace = 'http://www.geni.net/resources/rspec/ext/openflow/4';
  rspecCommon.vlanNamespace ='http://www.geni.net/resources/rspec/ext/shared-vlan/1';

  // Search for all elements called 'selector' in the namespace of the
  // dom object passed.
  rspecCommon.findSameNS = function (dom, selector)
  {
    var result = $();
    for (var i = 0; i < dom.length; i += 1)
    {
      var namespace = dom[i].namespaceURI;
      var list = dom[i].getElementsByTagNameNS(namespace, selector);
      for (var j = 0; j < list.length; j += 1)
      {
	result = result.add($(list[j]));
      }
    }
    return result;
  };

  // Search in the same namespace for a child matching selector and
  // return attribute inside that child if it exists
  rspecCommon.findChildAttribute = function (xml, selector, attribute)
  {
    var result = undefined;
    var child = rspecCommon.findSameNS(xml, selector);
    if (child)
    {
      result = child.attr(attribute);
    }
    return result;
  };

  rspecCommon.findOrMake = function (root, tagString)
  {
    var result = root.find(tagString);
    if (result.length === 0)
    {
      var namespace = root[0].namespaceURI;
      result = $($.parseXML('<' + tagString + ' xmlns="' + namespace + '"/>')).find(tagString);
      root.append(result);
    }
    return result;
  };

  rspecCommon.findOrMakeNS = function (root, tagString, namespace)
  {
    var result;
    var target = root[0].getElementsByTagNameNS(namespace, tagString);
    if (target.length === 0)
    {
      result = rspecCommon.makeNode(root, tagString, namespace);
    }
    else
    {
      result = $(target[0]);
    }
    return result;
  };

  rspecCommon.makeNode = function (root, tagString, namespace)
  {
    result = $($.parseXML('<' + tagString + ' xmlns="' + namespace + '"></' + tagString + '>')).find(tagString);
    root.append(result);
    return result;
  };

  rspecCommon.removeList = function (root, tag, namespace)
  {
    var oldList = root[0].getElementsByTagNameNS(namespace, tag);
    _.each(oldList, function (item) {
      $(item).remove();
    });
  };

  rspecCommon.replaceList = function (root, list, tag, keys, namespace)
  {
    _.each(list, function (item) {
      var newXml = item.rspec;
      if (! newXml)
      {
	newXml = $($.parseXML('<' + tag + ' xmlns="' + namespace + '"></' + tag + '>')).find(tag);
      }
      _.each(keys, function (key) {
	if (item[key])
	{
	  newXml.attr(key, item[key]);
	}
	else
	{
	  newXml.removeAttr(key)
	}
      });
      root.append(newXml);
    });
  };

  rspecCommon.removeNS = function (root, tagString, namespace)
  {
    var target = root[0].getElementsByTagNameNS(namespace, tagString);
    if (target.length > 0)
    {
      $(target[0]).remove();
    }
  };

  return rspecCommon;
});

/*
 * rspecParser.js
 *
 * Parse Requests, Manifests, and Advertisements
 *
 */

define('js/canvas/rspecParser',['underscore', 'backbone', 'js/canvas/rspecCommon'],
function (_, Backbone, rs)
{
  

  var testGroup = 0;
  var rspecParser = {};

  // arg {
  //  rspec: String to parse
  //  context: Overall Jacks context
  //  errorModal: Handle to error modal for error display
  // }
  rspecParser.parse = function (arg)
  {
    var xmlString = arg.rspec;
    var context = arg.context;
    var errorModal = arg.errorModal;
    var result = null;

    if (! result)
    {
      result = {
	namespace: null,
	remainder: [],
	nodes: [],
	links: [],
	interfaces: {},
	interfaceList: [],
	sites: {}
      };
    }
    var nodeCount = 0;
    var defaultSite = {
      urn: undefined,
      name: undefined,
      custom: {},
      id: _.uniqueId()
    };

    try
    {
      var findEncoding = RegExp('^\\s*<\\?[^?]*\\?>');
      var match = findEncoding.exec(xmlString);
      if (match)
      {
	xmlString = xmlString.slice(match[0].length);
      }
      var xml = $.parseXML(xmlString);
      var xmlRoot = $(xml.documentElement);
      result.namespace = xmlRoot.namespaceURI;
      rs.findSameNS(xmlRoot, 'node').each(function(){
	  parseNode($(this), result, nodeCount, defaultSite, context);
	  $(this).remove();
	  nodeCount += 1;
	});

      var linkCount = 0;
      rs.findSameNS(xmlRoot, 'link').each(function() {
	  parseLink($(this), result, linkCount, context);
	  $(this).remove();
	  linkCount += 1;
	});

      result.remainder = xmlRoot.children();

      _.each(result.interfaceList, function (iface) {
	  if (! iface.linkId) {
	    console.log('Failed to find link for interface:', iface);
	  }
	});

      _.each(result.links, function (link) {
	  _.each(link.nodeIndices, function (nodeIndex) {
	      link.endpoints.push(result.nodes[nodeIndex]);
	    });
	});
    }
    catch (e)
    {
      errorModal.update({
	verbatim: true,
	title: 'Cannot Parse Rspec',
	contents: 'Jacks cannot parse your rspec. Please send the rspec you tried to load and the following error message to jacks-support@protogeni.net <h1>Error:</h1><textarea class="form-control" rows="10">' + _.escape(e.toString()) + '</textarea><h1>Rspec:</h1><textarea class="form-control" rows="10">' + _.escape(xmlString) + '</textarea>'});
      console.log(e+"papaa");
    }

    if (nodeCount === 0)
    {
      result.sites[defaultSite.id] = defaultSite;
    }

    return result;
  };

  function parseNode(xml, result, count, defaultSite, context)
  {
    var node = {
      custom: {},
      warnings: {},
      execute: [],
      group: defaultSite.id,
      hardware: rs.findChildAttribute(xml, 'hardware_type', 'name'),
      hostport: undefined,
      icon: undefined,
      id: _.uniqueId(),
      image: rs.findChildAttribute(xml, 'disk_image', 'name'),
      imageVersion: rs.findChildAttribute(xml, 'disk_image', 'version'),
      index: count,
      install: [],
      interfaces: [],
      logins: undefined,
      name: xml.attr('client_id'),
      routable: false,
      sliverId: xml.attr('sliver_id'),
      sshurl: undefined,
      type: rs.findChildAttribute(xml, 'sliver_type', 'name'),
      xml: xml
    };

    var iconParent = $(xml[0].getElementsByTagNameNS(rs.jacksNamespace, 'icon'));
    if (iconParent.length > 0)
    {
      node.icon = iconParent.attr('url');
    }

    var nomacParent = $(xml[0].getElementsByTagNameNS(rs.jacksNamespace, 'nomac'));
    if (nomacParent.length > 0)
    {
      node.nomac = true;
    }

    var taggingParent = $(xml[0].getElementsByTagNameNS(rs.emulabNamespace, 'vlan_tagging'));
    if (taggingParent.length > 0)
    {
      node.nontrivial = (taggingParent.attr('enabled') === 'true');
    }

    var foundIcon = _.findWhere(context.canvasOptions.icons,
				{ id: node.icon });
    if (node.icon && ! foundIcon)
    {
      node.custom.icon = true;
    }

    var foundImage = _.findWhere(context.canvasOptions.images,
				 { id: node.image });
    if (node.image && ! foundImage)
    {
      node.custom.image = true;
    }

    var foundHardware = _.findWhere(context.canvasOptions.hardware,
				    { id: node.hardware });
    if (node.hardware && ! foundHardware)
    {
      node.custom.hardware = true;
    }

    var foundType = _.findWhere(context.canvasOptions.types,
				{ id: node.type });
    if (node.type && ! foundType)
    {
      node.custom.type = true;
    }

    var services = rs.findSameNS(xml, 'services');
    services.each(function () {
      var executeItems = rs.findSameNS($(this), 'execute');
      executeItems.each(function () {
	node.execute.push({
	  'rspec': $(this),
	  'command': $(this).attr('command'),
	  'shell': $(this).attr('shell')
	});
      });
      var installItems = rs.findSameNS($(this), 'install');
      installItems.each(function () {
	node.install.push({
	  'rspec': $(this),
	  'url': $(this).attr('url'),
	  'install_path': $(this).attr('install_path')
	});
      });
    });

    var routableItems = xml[0].getElementsByTagNameNS(rs.emulabNamespace, 'routable_control_ip');
    if (routableItems.length > 0)
    {
      node.routable = true;
    }
    var cmUrn = xml.attr('component_manager_id');
    var siteName = xml.find('site').attr('id');
    if (cmUrn || siteName)
    {
      node.group = findOrMakeSite(cmUrn, siteName, result.sites, context).id;
    }
    else if (! result.sites[defaultSite.id])
    {
      // This is already part of the default site. Make sure the
      // default site is in the sites list.
      result.sites[defaultSite.id] = defaultSite;
    }

    rs.findSameNS(xml, 'interface').each(function() {
      var iface = {
	name: $(this).attr('client_id'),
	nodeName: node.name,
	node_index: count,
	id: _.uniqueId(),
	node: node,
	nodeId: node.id,
	mac: $(this).attr('mac_address')
      };
      var ip = $(this.getElementsByTagNameNS(rs.rspecNamespace, 'ip'));
      if (ip.length > 0)
      {
	iface.ip = ip.attr('address');
	iface.ipType = ip.attr('type');
	iface.netmask = ip.attr('netmask');
      }
      node.interfaces.push(iface.id);
      result.interfaces[iface.id] = iface;
      result.interfaceList.push(iface);
    });

    if (services.length > 0)
    {
      var login  = rs.findSameNS(services, 'login');
      login.each(function () {
	var user   = $(this).attr('username');
	var host   = $(this).attr('hostname');
	var port   = $(this).attr('port');

	if (host !== undefined && port !== undefined)
	{
	  node.hostport  = host + ':' + port;
	  if (user !== undefined)
	  {
	    node.sshurl = 'ssh://' + user + '@' + host + ':' + port + '/';
	  }
	}
	if (user !== undefined &&
	    host !== undefined &&
	    port !== undefined)
	{
	  var newLogin = user + '@' + host + ':' + port;
	  if (node.logins)
	  {
	    node.logins += ', ' + newLogin;
	  }
	  else
	  {
	    node.logins = newLogin;
	  }
	}
      });
    }

    //mergeNode(node, result.nodes);
    result.nodes.push(node);
    return node;
  }
/*
  function mergeNode(node, nodeList)
  {
    var found = null;
    var clashes = _.where(nodeList, { name: node.name });
    var i = 0;
    var index = 0;
    for (var i = 0; i < clashes.length; i += 1)
    {
      if (clashes[i].group === node.group)
      {
	found = clashes[i];
	index = i;
	break;
      }
    }
  }
*/
  function parseLink(xml, result, count, context)
  {
    var link = {
      custom: {},
      warnings: {},
      index: count,
      interfaces: [],
      linkType: rs.findChildAttribute(xml, 'link_type', 'name'),
      name: xml.attr('client_id'),
      openflow: undefined,
      nodeIndices: [],
      endpoints: [],
      endpointNames: [],
      id: _.uniqueId(),
      sharedvlan: undefined,
      transitSites: {},
      xml: xml
    };
    var foundType = _.findWhere(context.canvasOptions.linkTypes,
				{ id: link.linkType });
    if (link.linkType && ! foundType)
    {
      link.custom.linkType = true;
    }

    var shared = $(xml[0].getElementsByTagNameNS(rs.vlanNamespace,
						 'link_shared_vlan'));
    if (shared.length > 0)
    {
      link.sharedvlan = shared.attr('name');
    }

    var foundShared = _.findWhere(context.canvasOptions.sharedvlans,
				  { id: link.sharedvlan });
    if (link.sharedvlan && ! foundShared)
    {
      link.custom.sharedvlan = true;
    }

    var openflow = parseOpenflow(xml);
    if (openflow)
    {
      link.openflow = openflow;
    }

    var ifacerefs = rs.findSameNS(xml, 'interface_ref');
    _.each(ifacerefs, function (ref) {
      var targetName = $(ref).attr('client_id');
      /*
       * First we have map the client_ids to the node by
       * searching all of the interfaces we put into the
       * list above.
       *
       */
      _.each(result.interfaceList, function (iface) {
      	if (iface.name == targetName)
	{
	  link.nodeIndices.push(iface.node_index);
	  link.endpointNames.push(iface.nodeName);
	  link.interfaces.push(iface.id);
	  iface.linkId = link.id;
	}
      });
    });

    var sites = $(xml[0].getElementsByTagNameNS(rs.rspecNamespace,
						'component_manager'));
    sites.each(function () {
      var name = $(this).attr('name');
      var found = false;
      _.each(link.nodeIndices, function (nodeId) {
	var node = result.nodes[nodeId];
	var currentSite = result.sites[node.group];
	if (currentSite.urn && currentSite.urn === name)
	{
	  found = true;
	}
      });
      if (! found)
      {
	link.transitSites[name] = 1;
      }
    });

    result.links.push(link);
  }

  function findOrMakeSite(cmUrn, name, sites, context)
  {
    var result;
    var siteList;
    // First try to match by Component Manager URN
    if (cmUrn)
    {
      siteList = _.where(_.values(sites), { urn: cmUrn });
      if (siteList.length > 0)
      {
	result = siteList[0];
	if (! result.name)
	{
	  result.name = name;
	}
      }
    }
    // If that doesn't work, try to match by Jacks site ID
    if (! result && name)
    {
      siteList = _.where(_.values(sites), { name: name });
      if (siteList.length > 0)
      {
	result = siteList[0];
	if (! result.urn)
	{
	  result.urn = cmUrn;
	}
      }
    }
    // If all else fails, just create a new one
    if (! result)
    {
      result = {
	custom: {},
	urn: cmUrn,
	id: _.uniqueId()
      };
      if (name)
      {
	result.name = name;
      }

      var foundUrn = _.findWhere(context.canvasOptions.aggregates,
				 { id: result.urn });
      if (result.urn && ! foundUrn)
      {
	result.custom.urn = true;
      }

      sites[result.id] = result;
    }
    return result;
  }

  function parseOpenflow(xml)
  {
    var result;
    var openflowList =
      $(xml[0].getElementsByTagNameNS(rs.emulabNamespace, 'openflow_controller'));
    if (openflowList.length > 0)
    {
      result = openflowList.attr('url');
    }

    if (! result)
    {
      openflowList = $(xml[0].getElementsByTagNameNS(rs.openflow3Namespace, 'controller'));
      if (openflowList.length > 0)
      {
	result = openflowList.attr('url');
      }
    }

    if (! result)
    {
      openflowList = $(xml[0].getElementsByTagNameNS(rs.openflow4Namespace, 'controller'));
      if (openflowList.length > 0)
      {
	result = openflowList.attr('url');
      }
    }

    return result;
  }

  return rspecParser;
});

/**
 * @license RequireJS text 2.0.3 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require: false, XMLHttpRequest: false, ActiveXObject: false,
  define: false, window: false, process: false, Packages: false,
  java: false, location: false */

define('text',['module'], function (module) {
    

    var text, fs,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = [],
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.3',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var strip = false, index = name.indexOf("."),
                modName = name.substring(0, index),
                ext = name.substring(index + 1, name.length);

            index = ext.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = ext.substring(index + 1, ext.length);
                strip = strip === "strip";
                ext = ext.substring(0, index);
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName + '.' + parsed.ext,
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                nonStripName = parsed.moduleName + '.' + parsed.ext,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + '.' +
                                     parsed.ext) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node)) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback) {
            var file = fs.readFileSync(url, 'utf8');
            //Remove BOM (Byte Mark Order) from utf8 files if it is there.
            if (file.indexOf('\uFEFF') === 0) {
                file = file.substring(1);
            }
            callback(file);
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback) {
            var xhr = text.createXhr();
            xhr.open('GET', url, true);

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        errback(err);
                    } else {
                        callback(xhr.responseText);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                stringBuffer.append(line);

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    }

    return text;
});


define('text!html/rspec.xml',[],function () { return '<rspec\r\n    xmlns="http://www.geni.net/resources/rspec/3"\r\n    xmlns:emulab="http://www.protogeni.net/resources/rspec/ext/emulab/1"\r\n    xmlns:tour="http://www.protogeni.net/resources/rspec/ext/apt-tour/1"\r\n    xmlns:jacks="http://www.protogeni.net/resources/rspec/ext/jacks/1"\r\n    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\r\n    xsi:schemaLocation="http://www.geni.net/resources/rspec/3\r\n\t\t\thttp://www.geni.net/resources/rspec/3/request.xsd">\r\n</rspec>\r\n';});

/*
 * rspecGenerator.js
 *
 * Generate an request rspec, maintaining original annotations
 *
 */

define ('js/canvas/rspecGenerator',['underscore', 'backbone', 'js/canvas/rspecCommon',
	'text!html/rspec.xml'],
function (_, Backbone, rs, requestString)
{
  

  var rspecGenerator = {};

  rspecGenerator.request = function(data, context)
  {
    var root = $($.parseXML(requestString)).find('rspec');
    root.attr('type', 'request');
    _.each(data.nodes, function (item) {
      var nodeXml;
      if (item.xml)
      {
	nodeXml = item.xml;
      }
      else
      {
	nodeXml = $($.parseXML('<node xmlns="http://www.geni.net/resources/rspec/3"/>')).find('node');
      }
      updateNode(item, data.interfaces, data.sites, data.lans, nodeXml,
		context);
      root.append(nodeXml);
    });
    _.each(data.lans, function (item) {
      var linkXml;
      if (item.xml)
      {
	linkXml = item.xml;
      }
      else
      {
	linkXml = $($.parseXML('<link xmlns="http://www.geni.net/resources/rspec/3"/>')).find('link');
      }
      updateLink(item, data.interfaces, data.sites, data.nodes, linkXml,
		 context);
      root.append(linkXml);
    });
    _.each(data.extraChildren, function (item) {
      root.append(item);
    });
    var s = new XMLSerializer();
    return s.serializeToString(root[0]);
  }

  function updateNode(node, interfaces, sites, links, xml, context)
  {
    xml.attr('client_id', node.name);
    if (node.sliverId)
    {
      xml.attr('sliver_id', node.sliverId);
    }
    else
    {
      xml.removeAttr('sliver_id');
    }

    if (node.icon)
    {
      var icon = rs.findOrMakeNS(xml, 'icon', rs.jacksNamespace);
      $(icon).attr('url', node.icon);
    }
    else
    {
      rs.removeNS(xml, 'icon', rs.jacksNamespace);
    }

    if (node.nomac)
    {
      rs.findOrMakeNS(xml, 'nomac', rs.jacksNamespace);
    }
    else
    {
      rs.removeNS(xml, 'nomac', rs.jacksNamespace);
    }

    updateNodeSite(node, sites, xml);

    var routable = rs.findOrMakeNS(xml, 'routable_control_ip',
				   rs.emulabNamespace);
    if (! node.routable)
    {
      routable.remove();
    }

    var tagged = rs.findOrMakeNS(xml, 'vlan_tagging',
				 rs.emulabNamespace);
    if (node.nontrivial)
    {
      tagged.attr('enabled', 'true');
    }
    else
    {
      tagged.remove();
    }

    if (node.type || node.image)
    {
      var sliver = rs.findOrMakeNS(xml, 'sliver_type', rs.rspecNamespace);
      if (node.type)
      {
	sliver.attr('name', node.type);
      }
      else
      {
	sliver.removeAttr('name');
      }
      if (node.image)
      {
	var image = rs.findOrMakeNS(sliver, 'disk_image', rs.rspecNamespace);
	image.attr('name', node.image);
	if (node.imageVersion)
	{
	  image.attr('version', node.imageVersion);
	}
	else
	{
	  image.removeAttr('version', node.imageVersion);
	}
      }
      else
      {
	rs.removeNS(sliver, 'disk_image', rs.rspecNamespace);
      }
    }
    if (node.hardware)
    {
      var hardware = rs.findOrMakeNS(xml, 'hardware_type', rs.rspecNamespace);
      hardware.attr('name', node.hardware);
    }
    else
    {
      rs.removeNS(xml, 'hardware_type', rs.rspecNamespace);
    }
    var services = rs.findOrMakeNS(xml, 'services', rs.rspecNamespace);
    rs.removeList(services, 'execute', rs.rspecNamespace);
    rs.removeList(services, 'install', rs.rspecNamespace);
    if (node.execute.length > 0 || node.install.length > 0)
    {
      rs.replaceList(services, node.execute, 'execute',
		     ['command', 'shell'], rs.rspecNamespace);
      rs.replaceList(services, node.install, 'install',
		     ['url', 'install_path'], rs.rspecNamespace);
    }
    var xmlIface = {};
    xml.find('interface').each(function () {
      var clientId = $(this).attr('client_id');
      xmlIface[clientId] = $(this);
    });
    var internalIface = {};
    _.each(node.interfaces, function (ifaceId) {
      var iface = interfaces[ifaceId];
      internalIface[iface.name] = iface;
      var ifaceDom = xmlIface[iface.name];
      if (! ifaceDom)
      {
	ifaceDom = $($.parseXML('<interface xmlns="http://www.geni.net/resources/rspec/3"/>')).find('interface');
	xml.append(ifaceDom);
	ifaceDom.attr('client_id', iface.name);
      }
      var ip = rs.findOrMakeNS(ifaceDom, 'ip', rs.rspecNamespace);
      var chosenIp = iface.ip;
      var chosenNetmask = iface.netmask;
      var ifaceLink = links[iface.linkId];
      var linkContext = _.findWhere(context.canvasOptions.linkTypes,
				    { id: ifaceLink.linkType });
      if (! chosenIp && linkContext && linkContext.ip === 'auto')
      {
	chosenIp = '10.';
	chosenIp += Math.floor(iface.linkId / 256) + '.';
	chosenIp += (iface.linkId % 256) + '.';
	chosenIp += (ifaceLink.interfaces.indexOf(iface.id) + 1);
	chosenNetmask = '255.255.255.0';
      }
      if (chosenIp)
      {
	ip.attr('address', chosenIp);
	if (iface.ipType)
	{
	  ip.attr('type', iface.ipType);
	}
	else
	{
	  ip.attr('type', 'ipv4');
	}
	if (chosenNetmask)
	{
	  ip.attr('netmask', chosenNetmask);
	}
	else
	{
	  ip.removeAttr('netmask');
	}
      }
      else
      {
	ip.remove();
      }
    });
    _.each(_.keys(xmlIface), function (iface) {
      var ifaceDom = xmlIface[iface];
      if (! internalIface[iface])
      {
	ifaceDom.remove();
      }
    });
  }

  function updateNodeSite(node, sites, xml)
  {
    if (node.group)
    {
      var nodeSite = sites[node.group];
      if (nodeSite.urn)
      {
	if (xml.attr('component_manager_id') !== nodeSite.urn)
	{
	  xml.attr('component_manager_id', nodeSite.urn);
	}
	rs.removeNS(xml, 'site', rs.jacksNamespace);
      }
      else
      {
	xml.removeAttr('component_manager_id');
	var group = rs.findOrMakeNS(xml, 'site', rs.jacksNamespace);
	$(group).attr('id', sites[node.group].id);
      }
    }
    else
    {
      xml.removeAttr('component_manager_id');
      rs.removeNS(xml, 'site', rs.jacksNamespace);
    }
  }

  //----------------------------------------------------------------------

  function updateLink(link, interfaces, sites, nodes, xml, context)
  {
    xml.attr('client_id', link.name);
    var type = link.linkType;
    if (type === 'vlan' || type === 'lan')
    {
      if (linkStitched(link))
      {
	type = 'vlan';
      }
      else
      {
	type = 'lan';
      }
    }
    var linkType = rs.findOrMakeNS(xml, 'link_type', rs.rspecNamespace);
    if (type)
    {
      linkType.attr('name', type);
    }
    else
    {
      linkType.remove();
    }

    updateOpenflow(xml, link.openflow);

    var sharedvlan = rs.findOrMakeNS(xml, 'link_shared_vlan',
				     rs.vlanNamespace);
    if (link.sharedvlan)
    {
      sharedvlan.attr('name', link.sharedvlan);
    }
    else
    {
      sharedvlan.remove();
    }

    var xmlIface = {};
    xml.find('interface_ref').each(function () {
      var clientId = $(this).attr('client_id');
      xmlIface[clientId] = $(this);
    });
    var internalIface = {};
    _.each(link.interfaces, function (ifaceId) {
      var iface = interfaces[ifaceId];
      internalIface[iface.name] = iface;
      if (! xmlIface[iface.name])
      {
	var ifaceDom = $($.parseXML('<interface_ref xmlns="http://www.geni.net/resources/rspec/3"/>')).find('interface_ref');
	xml.append(ifaceDom);
	ifaceDom.attr('client_id', iface.name);
      }
    });
    _.each(_.keys(xmlIface), function (iface) {
      var ifaceDom = xmlIface[iface];
      if (! internalIface[iface])
      {
	ifaceDom.remove();
      }
    });

    var linkSites = {};
    _.each(link.endpoints, function (endpoint) {
      var name = sites[endpoint.group].urn;
      var siteId = sites[endpoint.group].id;
      if (name)
      {
	linkSites[name] = 'bound';
      }
      else
      {
	linkSites[siteId] = 'unbound';
      }
    });
    var cmList = $(xml[0].getElementsByTagNameNS(rs.rspecNamespace,
						 'component_manager'));
    cmList.each(function () {
      var name = $(this).attr('name');
      if (linkSites[name] === 'bound')
      {
	delete linkSites[name];
      }
      else if (! link.transitSites[name])
      {
	$(this).remove();
      }
    });
    var cmList = $(xml[0].getElementsByTagNameNS(rs.jacksNamespace,
						 'site'));
    cmList.each(function () {
      var name = $(this).attr('id');
      if (linkSites[name] === 'unbound')
      {
	delete linkSites[name];
      }
      else if (! link.transitSites[name])
      {
	$(this).remove();
      }
    });
    _.each(_.keys(linkSites), function (newSite, value) {
      var siteXml;
      if (value === 'bound')
      {
	siteXml = rs.makeNode(xml, 'component_manager',
			      rs.rspecNamespace);
	siteXml.attr('name', newSite);
      }
      else
      {
	siteXml = rs.makeNode(xml, 'site',
			      rs.jacksNamespace);
	siteXml.attr('id', newSite);
      }
    });
    var isNomac = findNomac(link, interfaces, nodes, context);
    var nomac = rs.findOrMakeNS(xml, 'link_attribute',
				rs.emulabNamespace);
    if (isNomac)
    {
      nomac.attr('key', 'nomac_learning');
      nomac.attr('value', 'yep');
    }
    else
    {
      nomac.remove();
    }
  }

  function linkStitched(link)
  {
    var result = false;
    var found;
    _.each(link.endpoints, function (endpoint) {
      if (found === undefined)
      {
	found = endpoint.group;
      }
      else if (found !== endpoint.group)
      {
	result = true;
      }
    });
    return result;
  }

  function updateOpenflow(xml, openflow)
  {
    var openflowList = rs.findOrMakeNS(xml, 'openflow_controller', rs.emulabNamespace);
    if (openflow)
    {
      openflowList.attr('url', openflow);
      openflowList.attr('type', 'primary');
    }
    else
    {
      openflowList.remove();
    }

    openflowList = rs.findOrMakeNS(xml, 'controller', rs.openflow3Namespace);
    if (openflow)
    {
      openflowList.attr('url', openflow);
      openflowList.attr('type', 'primary');
    }
    else
    {
      openflowList.remove();
    }

    openflowList = rs.findOrMakeNS(xml, 'controller', rs.openflow4Namespace);
    if (openflow)
    {
      openflowList.attr('url', openflow);
      openflowList.attr('role', 'primary');
    }
    else
    {
      openflowList.remove();
    }
  }

  function findNomac(link, interfaces, nodes, context)
  {
    var result = false;
    _.each(link.interfaces, function (ifaceId) {
      var iface = interfaces[ifaceId];
      var node = nodes[iface.nodeId];
      var image = node.image;
      var imageContext = _.findWhere(context.canvasOptions.images,
				     { id: image });
      if (node.nomac || (imageContext && imageContext.nomac))
      {
	result = true;
      }
    });
    return result ||
      (link.openflow !== null && link.openflow !== undefined);
  }

  return rspecGenerator;
});

(function() {
  var _ref, _ref1, _ref2, _ref3,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.Tourist = window.Tourist || {};

  /*
  A model for the Tour. We'll only use the 'current_step' property.
  */


  Tourist.Model = (function(_super) {
    __extends(Model, _super);

    function Model() {
      _ref = Model.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Model.prototype._module = 'Tourist';

    return Model;

  })(Backbone.Model);

  window.Tourist.Tip = window.Tourist.Tip || {};

  /*
  The flyout showing the content of each step.
  
  This is the base class containing most of the logic. Can extend for different
  tooltip implementations.
  */


  Tourist.Tip.Base = (function() {
    Base.prototype._module = 'Tourist';

    _.extend(Base.prototype, Backbone.Events);

    Base.prototype.skipButtonTemplate = '<button class="btn btn-default btn-sm pull-right tour-next">Skip this step →</button>';

    Base.prototype.nextButtonTemplate = '<button class="btn btn-primary btn-sm pull-right tour-next">Next step →</button>';

    Base.prototype.finalButtonTemplate = '<button class="btn btn-primary btn-sm pull-right tour-next">Finish up</button>';

    Base.prototype.closeButtonTemplate = '<a class="btn btn-close tour-close" href="#"><i class="glyphicon glyphicon-remove"></i></a>';

    Base.prototype.okButtonTemplate = '<button class="btn btn-sm tour-close btn-primary">Okay</button>';

    Base.prototype.actionLabelTemplate = _.template('<h4 class="action-label"><%= label %></h4>');

    Base.prototype.actionLabels = ['Do this:', 'Then this:', 'Next this:'];

    Base.prototype.highlightClass = 'tour-highlight';

    Base.prototype.template = _.template('<div>\n  <div class="tour-container">\n    <%= close_button %>\n    <%= content %>\n    <p class="tour-counter <%= counter_class %>"><%= counter%></p>\n  </div>\n  <div class="tour-buttons">\n    <%= buttons %>\n  </div>\n</div>');

    function Base(options) {
      this.options = options != null ? options : {};
      this.onClickNext = __bind(this.onClickNext, this);
      this.onClickClose = __bind(this.onClickClose, this);
      this.el = $('<div/>');
      this.initialize(options);
      this._bindClickEvents();
      Tourist.Tip.Base._cacheTip(this);
    }

    Base.prototype.destroy = function() {
      return this.el.remove();
    };

    Base.prototype.render = function(step) {
      this.hide();
      if (step) {
        this._setTarget(step.target || false, step);
        this._setZIndex('');
        this._renderContent(step, this._buildContentElement(step));
        if (step.target) {
          this.show();
        }
        if (step.zIndex) {
          this._setZIndex(step.zIndex, step);
        }
      }
      return this;
    };

    Base.prototype.show = function() {};

    Base.prototype.hide = function() {};

    Base.prototype.setTarget = function(targetElement, step) {
      return this._setTarget(targetElement, step);
    };

    Base.prototype.cleanupCurrentTarget = function() {
      if (this.target && this.target.removeClass) {
        this.target.removeClass(this.highlightClass);
      }
      return this.target = null;
    };

    /*
    Event Handlers
    */


    Base.prototype.onClickClose = function(event) {
      this.trigger('click:close', this, event);
      return false;
    };

    Base.prototype.onClickNext = function(event) {
      this.trigger('click:next', this, event);
      return false;
    };

    /*
    Private
    */


    Base.prototype._getTipElement = function() {};

    Base.prototype._renderContent = function(step, contentElement) {};

    Base.prototype._bindClickEvents = function() {
      var el;
      el = this._getTipElement();
      el.delegate('.tour-close', 'click', this.onClickClose);
      return el.delegate('.tour-next', 'click', this.onClickNext);
    };

    Base.prototype._setTarget = function(target, step) {
      this.cleanupCurrentTarget();
      if (target && step && step.highlightTarget) {
        target.addClass(this.highlightClass);
      }
      return this.target = target;
    };

    Base.prototype._setZIndex = function(zIndex) {
      var el;
      el = this._getTipElement();
      return el.css('z-index', zIndex || '');
    };

    Base.prototype._buildContentElement = function(step) {
      var buttons, content;
      buttons = this._buildButtons(step);
      content = $($.parseHTML(this.template({
        content: step.content,
        buttons: buttons,
        close_button: this._buildCloseButton(step),
        counter: step.final ? '' : "step " + (step.index + 1) + " of " + step.total,
        counter_class: step.final ? 'final' : ''
      })));
      if (!buttons) {
        content.find('.tour-buttons').addClass('no-buttons');
      }
      this._renderActionLabels(content);
      return content;
    };

    Base.prototype._buildButtons = function(step) {
      var buttons;
      buttons = '';
      if (step.okButton) {
        buttons += this.okButtonTemplate;
      }
      if (step.skipButton) {
        buttons += this.skipButtonTemplate;
      }
      if (step.nextButton) {
        buttons += step.final ? this.finalButtonTemplate : this.nextButtonTemplate;
      }
      return buttons;
    };

    Base.prototype._buildCloseButton = function(step) {
      if (step.closeButton) {
        return this.closeButtonTemplate;
      } else {
        return '';
      }
    };

    Base.prototype._renderActionLabels = function(el) {
      var action, actionIndex, actions, label, _i, _len, _results;
      actions = el.find('.action');
      actionIndex = 0;
      _results = [];
      for (_i = 0, _len = actions.length; _i < _len; _i++) {
        action = actions[_i];
        label = $($.parseHTML(this.actionLabelTemplate({
          label: this.actionLabels[actionIndex]
        })));
        label.insertBefore(action);
        _results.push(actionIndex++);
      }
      return _results;
    };

    Base._cacheTip = function(tip) {
      if (!Tourist.Tip.Base._cachedTips) {
        Tourist.Tip.Base._cachedTips = [];
      }
      return Tourist.Tip.Base._cachedTips.push(tip);
    };

    Base.destroy = function() {
      var tip, _i, _len, _ref1;
      if (!Tourist.Tip.Base._cachedTips) {
        return;
      }
      _ref1 = Tourist.Tip.Base._cachedTips;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tip = _ref1[_i];
        tip.destroy();
      }
      return Tourist.Tip.Base._cachedTips = null;
    };

    return Base;

  })();

  /*
  Bootstrap based tip implementation
  */


  Tourist.Tip.Bootstrap = (function(_super) {
    __extends(Bootstrap, _super);

    function Bootstrap() {
      _ref1 = Bootstrap.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Bootstrap.prototype.initialize = function(options) {
      var defs;
      defs = {
        showEffect: null,
        hideEffect: null
      };
      this.options = _.extend(defs, options);
      return this.tip = new Tourist.Tip.BootstrapTip();
    };

    Bootstrap.prototype.destroy = function() {
      this.tip.destroy();
      return Bootstrap.__super__.destroy.call(this);
    };

    Bootstrap.prototype.show = function() {
      var fn;
      if (this.options.showEffect) {
        fn = Tourist.Tip.Bootstrap.effects[this.options.showEffect];
        return fn.call(this, this.tip, this.tip.el);
      } else {
        return this.tip.show();
      }
    };

    Bootstrap.prototype.hide = function() {
      var fn;
      if (this.options.hideEffect) {
        fn = Tourist.Tip.Bootstrap.effects[this.options.hideEffect];
        return fn.call(this, this.tip, this.tip.el);
      } else {
        return this.tip.hide();
      }
    };

    /*
    Private
    */


    Bootstrap.prototype._getTipElement = function() {
      return this.tip.el;
    };

    Bootstrap.prototype._setTarget = function(target, step) {
      Bootstrap.__super__._setTarget.call(this, target, step);
      return this.tip.setTarget(target);
    };

    Bootstrap.prototype._renderContent = function(step, contentElement) {
      var at, my;
      my = step.my || 'left center';
      at = step.at || 'right center';
      this.tip.setContainer(step.container || $('body'));
      this.tip.setContent(contentElement);
      return this.tip.setPosition(step.target || false, my, at);
    };

    return Bootstrap;

  })(Tourist.Tip.Base);

  Tourist.Tip.Bootstrap.effects = {
    slidein: function(tip, element) {
      var OFFSETS, css, easing, easings, offset, side, value, _i, _len;
      OFFSETS = {
        top: 80,
        left: 80,
        right: -80,
        bottom: -80
      };
      side = tip.my.split(' ')[0];
      side = side || 'top';
      offset = OFFSETS[side];
      if (side === 'bottom') {
        side = 'top';
      }
      if (side === 'right') {
        side = 'left';
      }
      value = parseInt(element.css(side));
      element.stop();
      css = {};
      css[side] = value + offset;
      element.css(css);
      element.show();
      css[side] = value;
      easings = ['easeOutCubic', 'swing', 'linear'];
      for (_i = 0, _len = easings.length; _i < _len; _i++) {
        easing = easings[_i];
        if ($.easing[easing]) {
          break;
        }
      }
      element.animate(css, 300, easing);
      return null;
    }
  };

  /*
  Simple implementation of tooltip with bootstrap markup.
  
  Almost entirely deals with positioning. Uses the similar method for
  positioning as qtip2:
  
    my: 'top center'
    at: 'bottom center'
  */


  Tourist.Tip.BootstrapTip = (function() {
    BootstrapTip.prototype.template = '<div class="popover">\n  <div class="arrow"></div>\n  <div class="popover-content"></div>\n</div>';

    BootstrapTip.prototype.FLIP_POSITION = {
      bottom: 'top',
      top: 'bottom',
      left: 'right',
      right: 'left'
    };

    function BootstrapTip(options) {
      var defs;
      defs = {
        offset: 10,
        tipOffset: 10
      };
      this.options = _.extend(defs, options);
      this.el = $($.parseHTML(this.template));
      this.hide();
    }

    BootstrapTip.prototype.destroy = function() {
      return this.el.remove();
    };

    BootstrapTip.prototype.show = function() {
      return this.el.show().addClass('visible');
    };

    BootstrapTip.prototype.hide = function() {
      return this.el.hide().removeClass('visible');
    };

    BootstrapTip.prototype.setTarget = function(target) {
      this.target = target;
      return this._setPosition(this.target, this.my, this.at);
    };

    BootstrapTip.prototype.setPosition = function(target, my, at) {
      this.target = target;
      this.my = my;
      this.at = at;
      return this._setPosition(this.target, this.my, this.at);
    };

    BootstrapTip.prototype.setContainer = function(container) {
      return container.append(this.el);
    };

    BootstrapTip.prototype.setContent = function(content) {
      return this._getContentElement().html(content);
    };

    /*
    Private
    */


    BootstrapTip.prototype._getContentElement = function() {
      return this.el.find('.popover-content');
    };

    BootstrapTip.prototype._getTipElement = function() {
      return this.el.find('.arrow');
    };

    BootstrapTip.prototype._setPosition = function(target, my, at) {
      var clas, css, originalDisplay, position, shift, targetPosition, tip, tipOffset, tipPosition, _ref2;
      if (my == null) {
        my = 'left center';
      }
      if (at == null) {
        at = 'right center';
      }
      if (!target) {
        return;
      }
      _ref2 = my.split(' '), clas = _ref2[0], shift = _ref2[1];
      originalDisplay = this.el.css('display');
      this.el.css({
        top: 0,
        left: 0,
        margin: 0,
        display: 'block'
      }).removeClass('top').removeClass('bottom').removeClass('left').removeClass('right').addClass(this.FLIP_POSITION[clas]);
      if (!target) {
        return;
      }
      tip = this._getTipElement().css({
        left: '',
        right: '',
        top: '',
        bottom: ''
      });
      if (shift !== 'center') {
        tipOffset = {
          left: tip[0].offsetWidth / 2,
          right: 0,
          top: tip[0].offsetHeight / 2,
          bottom: 0
        };
        css = {};
        css[shift] = tipOffset[shift] + this.options.tipOffset;
        css[this.FLIP_POSITION[shift]] = 'auto';
        tip.css(css);
      }
      targetPosition = this._caculateTargetPosition(at, target);
      tipPosition = this._caculateTipPosition(my, targetPosition);
      position = this._adjustForArrow(my, tipPosition);
      this.el.css(position);
      return this.el.css({
        display: originalDisplay
      });
    };

    BootstrapTip.prototype._caculateTargetPosition = function(atPosition, target) {
      var bounds, pos;
      if (Object.prototype.toString.call(target) === '[object Array]') {
        return {
          left: target[0],
          top: target[1]
        };
      }
      bounds = this._getTargetBounds(target);
      pos = this._lookupPosition(atPosition, bounds.width, bounds.height);
      return {
        left: bounds.left + pos[0],
        top: bounds.top + pos[1]
      };
    };

    BootstrapTip.prototype._caculateTipPosition = function(myPosition, targetPosition) {
      var height, pos, width;
      width = this.el[0].offsetWidth;
      height = this.el[0].offsetHeight;
      pos = this._lookupPosition(myPosition, width, height);
      return {
        left: targetPosition.left - pos[0],
        top: targetPosition.top - pos[1]
      };
    };

    BootstrapTip.prototype._adjustForArrow = function(myPosition, tipPosition) {
      var clas, height, position, shift, tip, width, _ref2;
      _ref2 = myPosition.split(' '), clas = _ref2[0], shift = _ref2[1];
      tip = this._getTipElement();
      width = tip[0].offsetWidth;
      height = tip[0].offsetHeight;
      position = {
        top: tipPosition.top,
        left: tipPosition.left
      };
      switch (clas) {
        case 'top':
          position.top += height + this.options.offset;
          break;
        case 'bottom':
          position.top -= height + this.options.offset;
          break;
        case 'left':
          position.left += width + this.options.offset;
          break;
        case 'right':
          position.left -= width + this.options.offset;
      }
      switch (shift) {
        case 'left':
          position.left -= width / 2 + this.options.tipOffset;
          break;
        case 'right':
          position.left += width / 2 + this.options.tipOffset;
          break;
        case 'top':
          position.top -= height / 2 + this.options.tipOffset;
          break;
        case 'bottom':
          position.top += height / 2 + this.options.tipOffset;
      }
      return position;
    };

    BootstrapTip.prototype._lookupPosition = function(position, width, height) {
      var height2, posLookup, width2;
      width2 = width / 2;
      height2 = height / 2;
      posLookup = {
        'top left': [0, 0],
        'left top': [0, 0],
        'top right': [width, 0],
        'right top': [width, 0],
        'bottom left': [0, height],
        'left bottom': [0, height],
        'bottom right': [width, height],
        'right bottom': [width, height],
        'top center': [width2, 0],
        'left center': [0, height2],
        'right center': [width, height2],
        'bottom center': [width2, height]
      };
      return posLookup[position];
    };

    BootstrapTip.prototype._getTargetBounds = function(target) {
      var el, size;
      el = target[0];
      if (typeof el.getBoundingClientRect === 'function') {
        size = el.getBoundingClientRect();
      } else {
        size = {
          width: el.offsetWidth,
          height: el.offsetHeight
        };
      }
      return $.extend({}, size, target.offset());
    };

    return BootstrapTip;

  })();

  /*
  Qtip based tip implementation
  */


  Tourist.Tip.QTip = (function(_super) {
    var ADJUST, OFFSETS, TIP_HEIGHT, TIP_WIDTH;

    __extends(QTip, _super);

    function QTip() {
      this._renderTipBackground = __bind(this._renderTipBackground, this);
      _ref2 = QTip.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    TIP_WIDTH = 6;

    TIP_HEIGHT = 14;

    ADJUST = 10;

    OFFSETS = {
      top: 80,
      left: 80,
      right: -80,
      bottom: -80
    };

    QTip.prototype.QTIP_DEFAULTS = {
      content: {
        text: ' '
      },
      show: {
        ready: false,
        delay: 0,
        effect: function(qtip) {
          var css, el, offset, side, value;
          el = $(this);
          side = qtip.options.position.my;
          if (side) {
            side = side[side.precedance];
          }
          side = side || 'top';
          offset = OFFSETS[side];
          if (side === 'bottom') {
            side = 'top';
          }
          if (side === 'right') {
            side = 'left';
          }
          value = parseInt(el.css(side));
          css = {};
          css[side] = value + offset;
          el.css(css);
          el.show();
          css[side] = value;
          el.animate(css, 300, 'easeOutCubic');
          return null;
        },
        autofocus: false
      },
      hide: {
        event: null,
        delay: 0,
        effect: false
      },
      position: {
        adjust: {
          method: 'shift shift',
          scroll: false
        }
      },
      style: {
        classes: 'ui-tour-tip',
        tip: {
          height: TIP_WIDTH,
          width: TIP_HEIGHT
        }
      },
      events: {},
      zindex: 2000
    };

    QTip.prototype.initialize = function(options) {
      options = $.extend(true, {}, this.QTIP_DEFAULTS, options);
      this.el.qtip(options);
      this.qtip = this.el.qtip('api');
      return this.qtip.render();
    };

    QTip.prototype.destroy = function() {
      if (this.qtip) {
        this.qtip.destroy();
      }
      return QTip.__super__.destroy.call(this);
    };

    QTip.prototype.show = function() {
      return this.qtip.show();
    };

    QTip.prototype.hide = function() {
      return this.qtip.hide();
    };

    /*
    Private
    */


    QTip.prototype._getTipElement = function() {
      return $('#qtip-' + this.qtip.id);
    };

    QTip.prototype._setTarget = function(targetElement, step) {
      QTip.__super__._setTarget.call(this, targetElement, step);
      return this.qtip.set('position.target', targetElement || false);
    };

    QTip.prototype._renderContent = function(step, contentElement) {
      var at, my,
        _this = this;
      my = step.my || 'left center';
      at = step.at || 'right center';
      this._adjustPlacement(my, at);
      this.qtip.set('content.text', contentElement);
      this.qtip.set('position.container', step.container || $('body'));
      this.qtip.set('position.my', my);
      this.qtip.set('position.at', at);
      this.qtip.set('position.viewport', step.viewport || false);
      this.qtip.set('position.target', step.target || false);
      return setTimeout(function() {
        return _this._renderTipBackground(my.split(' ')[0]);
      }, 10);
    };

    QTip.prototype._adjustPlacement = function(my, at) {
      if (my.indexOf('top') === 0) {
        return this._adjust(0, ADJUST);
      } else if (my.indexOf('bottom') === 0) {
        return this._adjust(0, -ADJUST);
      } else if (my.indexOf('right') === 0) {
        return this._adjust(-ADJUST, 0);
      } else {
        return this._adjust(ADJUST, 0);
      }
    };

    QTip.prototype._adjust = function(adjustX, adjusty) {
      this.qtip.set('position.adjust.x', adjustX);
      return this.qtip.set('position.adjust.y', adjusty);
    };

    QTip.prototype._renderTipBackground = function(direction) {
      var bg, el;
      el = $('#qtip-' + this.qtip.id + ' .qtip-tip');
      bg = el.find('.qtip-tip-bg');
      if (!bg.length) {
        bg = $('<div/>', {
          'class': 'icon icon-tip qtip-tip-bg'
        });
        el.append(bg);
      }
      bg.removeClass('top left right bottom');
      return bg.addClass(direction);
    };

    return QTip;

  })(Tourist.Tip.Base);

  /*
  Simplest implementation of a tooltip. Used in the tests. Useful as an example
  as well.
  */


  Tourist.Tip.Simple = (function(_super) {
    __extends(Simple, _super);

    function Simple() {
      _ref3 = Simple.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    Simple.prototype.initialize = function(options) {
      return $('body').append(this.el);
    };

    Simple.prototype.show = function() {
      return this.el.show();
    };

    Simple.prototype.hide = function() {
      return this.el.hide();
    };

    Simple.prototype._getTipElement = function() {
      return this.el;
    };

    Simple.prototype._renderContent = function(step, contentElement) {
      return this.el.html(contentElement);
    };

    return Simple;

  })(Tourist.Tip.Base);

  /*
  
  A way to make a tour. Basically, you specify a series of steps which explain
  elements to point at and what to say. This class manages moving between those
  steps.
  
  The 'step object' is a simple js obj that specifies how the step will behave.
  
  A simple Example of a step object:
    {
      content: '<p>Welcome to my step</p>'
      target: $('#something-to-point-at')
      closeButton: true
      highlightTarget: true
      setup: (tour, options) ->
        # do stuff in the interface/bind
      teardown: (tour, options) ->
        # remove stuff/unbind
    }
  
  Basic Step object options:
  
    content - a string of html to put into the step.
    target - jquery object or absolute point: [10, 30]
    highlightTarget - optional bool, true will outline the target with a bright color.
    container - optional jquery element that should contain the step flyout.
                default: $('body')
    viewport - optional jquery element that the step flyout should stay within.
               $(window) is commonly used. default: false
  
    my - string position of the pointer on the tip. default: 'left center'
    at - string position on the element the tip points to. default: 'right center'
    see http://craigsworks.com/projects/qtip2/docs/position/#basics
  
  Step object button options:
  
    okButton - optional bool, true will show a red ok button
    closeButton - optional bool, true will show a grey close button
    skipButton - optional bool, true will show a grey skip button
    nextButton - optional bool, true will show a red next button
  
  Step object function options:
  
    All functions on the step will have the signature '(tour, options) ->'
  
      tour - the Draw.Tour object. Handy to call tour.next()
      options - the step options. An object passed into the tour when created.
                It has the environment that the fns can use to manipulate the
                interface, bind to events, etc. The same object is passed to all
                of a step object's functions, so it is handy for passing data
                between steps.
  
    setup - called before step is shown. Use to scroll to your target, hide/show things, ...
  
      'this' is the step object itself.
  
      MUST return an object. Properties in the returned object will override
      properties in the step object.
  
      i.e. the target might be dynamic so you would specify:
  
      setup: (tour, options) ->
        return { target: $('#point-to-me') }
  
    teardown - function called right before hiding the step. Use to unbind from
      things you bound to in setup().
  
      'this' is the step object itself.
  
      Return nothing.
  
    bind - an array of function names to bind. Use this for event handlers you use in setup().
  
      Will bind functions to the step object as this, and the first 2 args as tour and options.
  
      i.e.
  
      bind: ['onChangeSomething']
      setup: (tour, options) ->
        options.document.bind('change:something', @onChangeSomething)
      onChangeSomething: (tour, options, model, value) ->
        tour.next()
      teardown: (tour, options) ->
        options.document.unbind('change:something', @onChangeSomething)
  */


  Tourist.Tour = (function() {
    _.extend(Tour.prototype, Backbone.Events);

    function Tour(options) {
      var defs, tipOptions;
      this.options = options != null ? options : {};
      this.onChangeCurrentStep = __bind(this.onChangeCurrentStep, this);
      this.next = __bind(this.next, this);
      defs = {
        tipClass: 'Bootstrap'
      };
      this.options = _.extend(defs, this.options);
      this.model = new Tourist.Model({
        current_step: null
      });
      tipOptions = _.extend({
        model: this.model
      }, this.options.tipOptions);
      this.view = new Tourist.Tip[this.options.tipClass](tipOptions);
      this.view.bind('click:close', _.bind(this.stop, this, true));
      this.view.bind('click:next', this.next);
      this.model.bind('change:current_step', this.onChangeCurrentStep);
    }

    /*
    Public
    */


    Tour.prototype.start = function() {
      this.trigger('start', this);
      return this.next();
    };

    Tour.prototype.stop = function(doFinalStep) {
      if (doFinalStep) {
        return this._showCancelFinalStep();
      } else {
        return this._stop();
      }
    };

    Tour.prototype.next = function() {
      var currentStep, index;
      currentStep = this._teardownCurrentStep();
      index = 0;
      if (currentStep) {
        index = currentStep.index + 1;
      }
      if (index < this.options.steps.length) {
        return this._showStep(this.options.steps[index], index);
      } else if (index === this.options.steps.length) {
        return this._showSuccessFinalStep();
      } else {
        return this._stop();
      }
    };

    Tour.prototype.setStepOptions = function(stepOptions) {
      return this.options.stepOptions = stepOptions;
    };

    /*
    Handlers
    */


    Tour.prototype.onChangeCurrentStep = function(model, step) {
      return this.view.render(step);
    };

    /*
    Private
    */


    Tour.prototype._showCancelFinalStep = function() {
      return this._showFinalStep(false);
    };

    Tour.prototype._showSuccessFinalStep = function() {
      return this._showFinalStep(true);
    };

    Tour.prototype._teardownCurrentStep = function() {
      var currentStep;
      currentStep = this.model.get('current_step');
      this._teardownStep(currentStep);
      return currentStep;
    };

    Tour.prototype._stop = function() {
      this._teardownCurrentStep();
      this.model.set({
        current_step: null
      });
      return this.trigger('stop', this);
    };

    Tour.prototype._showFinalStep = function(success) {
      var currentStep, finalStep;
      currentStep = this._teardownCurrentStep();
      finalStep = success ? this.options.successStep : this.options.cancelStep;
      if (_.isFunction(finalStep)) {
        finalStep.call(this, this, this.options.stepOptions);
        finalStep = null;
      }
      if (!finalStep) {
        return this._stop();
      }
      if (currentStep && currentStep.final) {
        return this._stop();
      }
      finalStep.final = true;
      return this._showStep(finalStep, this.options.steps.length);
    };

    Tour.prototype._showStep = function(step, index) {
      if (!step) {
        return;
      }
      step = _.clone(step);
      step.index = index;
      step.total = this.options.steps.length;
      if (!step.final) {
        step.final = this.options.steps.length === index + 1 && !this.options.successStep;
      }
      step = _.extend(step, this._setupStep(step));
      return this.model.set({
        current_step: step
      });
    };

    Tour.prototype._setupStep = function(step) {
      var fn, _i, _len, _ref4;
      if (!(step && step.setup)) {
        return {};
      }
      if (step.bind) {
        _ref4 = step.bind;
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          fn = _ref4[_i];
          step[fn] = _.bind(step[fn], step, this, this.options.stepOptions);
        }
      }
      return step.setup.call(step, this, this.options.stepOptions) || {};
    };

    Tour.prototype._teardownStep = function(step) {
      if (step && step.teardown) {
        step.teardown.call(step, this, this.options.stepOptions);
      }
      return this.view.cleanupCurrentTarget();
    };

    return Tour;

  })();

}).call(this);

define("tourist", ["backbone"], (function (global) {
    return function () {
        var ret, fn;
        return ret || global.Tourist;
    };
}(this)));

/*
 * TourView.js
 *
 * Manager for rspec Tours
 *
 */

define('js/canvas/TourView',['underscore', 'backbone', 'tourist'],
function (_, Backbone, Tourist)
{
  

  function TourView (rootDom, tourContainer, rspec)
  {
    this.rootDom = rootDom;
    this.tourContainer = tourContainer;
    this.rspec = rspec;
    this.tour = null;
    this.trivial = true;
    this.startTour();
  }

  TourView.prototype.startTour = function ()
  {
    var that = this;
    var root = $($.parseXML(this.rspec));
    var stepsNode = root.find('step');
    var steps = [];
    _.each(stepsNode, function (item) {
      var type = $(item).attr('point_type');
      var id = $(item).attr('point_id');
      var target = '#' + type + '-' + id;
      steps.push({
	content: '<p>' + _.escape($(item).find('description').text()) + '</p>',
	highlightTarget: true,
	nextButton: true,
	closeButton: true,
	container: that.tourContainer,
	setup: function(tourArg, options) {
	  return { target: that.rootDom.find(target) };
	},
	my: 'top center',
	at: 'bottom center'
      });
    });

    this.tour = new Tourist.Tour({
      steps: steps,
      tipClass: 'Bootstrap',
      tipOptions:{ showEffect: 'slidein' }
    });

    if (steps.length > 0)
    {
      this.trivial = false;
    }
  };

  TourView.prototype.nonTrivial = function ()
  {
    return ! this.trivial;
  };

  TourView.prototype.update = function ()
  {
    this.tour.view.render(this.tour.model.get('current_step'));
  };

  return TourView;
});

d3 = function() {
  var d3 = {
    version: "3.3.8"
  };
  if (!Date.now) Date.now = function() {
    return +new Date();
  };
  var d3_arraySlice = [].slice, d3_array = function(list) {
    return d3_arraySlice.call(list);
  };
  var d3_document = document, d3_documentElement = d3_document.documentElement, d3_window = window;
  try {
    d3_array(d3_documentElement.childNodes)[0].nodeType;
  } catch (e) {
    d3_array = function(list) {
      var i = list.length, array = new Array(i);
      while (i--) array[i] = list[i];
      return array;
    };
  }
  try {
    d3_document.createElement("div").style.setProperty("opacity", 0, "");
  } catch (error) {
    var d3_element_prototype = d3_window.Element.prototype, d3_element_setAttribute = d3_element_prototype.setAttribute, d3_element_setAttributeNS = d3_element_prototype.setAttributeNS, d3_style_prototype = d3_window.CSSStyleDeclaration.prototype, d3_style_setProperty = d3_style_prototype.setProperty;
    d3_element_prototype.setAttribute = function(name, value) {
      d3_element_setAttribute.call(this, name, value + "");
    };
    d3_element_prototype.setAttributeNS = function(space, local, value) {
      d3_element_setAttributeNS.call(this, space, local, value + "");
    };
    d3_style_prototype.setProperty = function(name, value, priority) {
      d3_style_setProperty.call(this, name, value + "", priority);
    };
  }
  d3.ascending = function(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  };
  d3.descending = function(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  };
  d3.min = function(array, f) {
    var i = -1, n = array.length, a, b;
    if (arguments.length === 1) {
      while (++i < n && !((a = array[i]) != null && a <= a)) a = undefined;
      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
    } else {
      while (++i < n && !((a = f.call(array, array[i], i)) != null && a <= a)) a = undefined;
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;
    }
    return a;
  };
  d3.max = function(array, f) {
    var i = -1, n = array.length, a, b;
    if (arguments.length === 1) {
      while (++i < n && !((a = array[i]) != null && a <= a)) a = undefined;
      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
    } else {
      while (++i < n && !((a = f.call(array, array[i], i)) != null && a <= a)) a = undefined;
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;
    }
    return a;
  };
  d3.extent = function(array, f) {
    var i = -1, n = array.length, a, b, c;
    if (arguments.length === 1) {
      while (++i < n && !((a = c = array[i]) != null && a <= a)) a = c = undefined;
      while (++i < n) if ((b = array[i]) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    } else {
      while (++i < n && !((a = c = f.call(array, array[i], i)) != null && a <= a)) a = undefined;
      while (++i < n) if ((b = f.call(array, array[i], i)) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    }
    return [ a, c ];
  };
  d3.sum = function(array, f) {
    var s = 0, n = array.length, a, i = -1;
    if (arguments.length === 1) {
      while (++i < n) if (!isNaN(a = +array[i])) s += a;
    } else {
      while (++i < n) if (!isNaN(a = +f.call(array, array[i], i))) s += a;
    }
    return s;
  };
  function d3_number(x) {
    return x != null && !isNaN(x);
  }
  d3.mean = function(array, f) {
    var n = array.length, a, m = 0, i = -1, j = 0;
    if (arguments.length === 1) {
      while (++i < n) if (d3_number(a = array[i])) m += (a - m) / ++j;
    } else {
      while (++i < n) if (d3_number(a = f.call(array, array[i], i))) m += (a - m) / ++j;
    }
    return j ? m : undefined;
  };
  d3.quantile = function(values, p) {
    var H = (values.length - 1) * p + 1, h = Math.floor(H), v = +values[h - 1], e = H - h;
    return e ? v + e * (values[h] - v) : v;
  };
  d3.median = function(array, f) {
    if (arguments.length > 1) array = array.map(f);
    array = array.filter(d3_number);
    return array.length ? d3.quantile(array.sort(d3.ascending), .5) : undefined;
  };
  d3.bisector = function(f) {
    return {
      left: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (f.call(a, a[mid], mid) < x) lo = mid + 1; else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (x < f.call(a, a[mid], mid)) hi = mid; else lo = mid + 1;
        }
        return lo;
      }
    };
  };
  var d3_bisector = d3.bisector(function(d) {
    return d;
  });
  d3.bisectLeft = d3_bisector.left;
  d3.bisect = d3.bisectRight = d3_bisector.right;
  d3.shuffle = function(array) {
    var m = array.length, t, i;
    while (m) {
      i = Math.random() * m-- | 0;
      t = array[m], array[m] = array[i], array[i] = t;
    }
    return array;
  };
  d3.permute = function(array, indexes) {
    var i = indexes.length, permutes = new Array(i);
    while (i--) permutes[i] = array[indexes[i]];
    return permutes;
  };
  d3.pairs = function(array) {
    var i = 0, n = array.length - 1, p0, p1 = array[0], pairs = new Array(n < 0 ? 0 : n);
    while (i < n) pairs[i] = [ p0 = p1, p1 = array[++i] ];
    return pairs;
  };
  d3.zip = function() {
    if (!(n = arguments.length)) return [];
    for (var i = -1, m = d3.min(arguments, d3_zipLength), zips = new Array(m); ++i < m; ) {
      for (var j = -1, n, zip = zips[i] = new Array(n); ++j < n; ) {
        zip[j] = arguments[j][i];
      }
    }
    return zips;
  };
  function d3_zipLength(d) {
    return d.length;
  }
  d3.transpose = function(matrix) {
    return d3.zip.apply(d3, matrix);
  };
  d3.keys = function(map) {
    var keys = [];
    for (var key in map) keys.push(key);
    return keys;
  };
  d3.values = function(map) {
    var values = [];
    for (var key in map) values.push(map[key]);
    return values;
  };
  d3.entries = function(map) {
    var entries = [];
    for (var key in map) entries.push({
      key: key,
      value: map[key]
    });
    return entries;
  };
  d3.merge = function(arrays) {
    var n = arrays.length, m, i = -1, j = 0, merged, array;
    while (++i < n) j += arrays[i].length;
    merged = new Array(j);
    while (--n >= 0) {
      array = arrays[n];
      m = array.length;
      while (--m >= 0) {
        merged[--j] = array[m];
      }
    }
    return merged;
  };
  var abs = Math.abs;
  d3.range = function(start, stop, step) {
    if (arguments.length < 3) {
      step = 1;
      if (arguments.length < 2) {
        stop = start;
        start = 0;
      }
    }
    if ((stop - start) / step === Infinity) throw new Error("infinite range");
    var range = [], k = d3_range_integerScale(abs(step)), i = -1, j;
    start *= k, stop *= k, step *= k;
    if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); else while ((j = start + step * ++i) < stop) range.push(j / k);
    return range;
  };
  function d3_range_integerScale(x) {
    var k = 1;
    while (x * k % 1) k *= 10;
    return k;
  }
  function d3_class(ctor, properties) {
    try {
      for (var key in properties) {
        Object.defineProperty(ctor.prototype, key, {
          value: properties[key],
          enumerable: false
        });
      }
    } catch (e) {
      ctor.prototype = properties;
    }
  }
  d3.map = function(object) {
    var map = new d3_Map();
    if (object instanceof d3_Map) object.forEach(function(key, value) {
      map.set(key, value);
    }); else for (var key in object) map.set(key, object[key]);
    return map;
  };
  function d3_Map() {}
  d3_class(d3_Map, {
    has: function(key) {
      return d3_map_prefix + key in this;
    },
    get: function(key) {
      return this[d3_map_prefix + key];
    },
    set: function(key, value) {
      return this[d3_map_prefix + key] = value;
    },
    remove: function(key) {
      key = d3_map_prefix + key;
      return key in this && delete this[key];
    },
    keys: function() {
      var keys = [];
      this.forEach(function(key) {
        keys.push(key);
      });
      return keys;
    },
    values: function() {
      var values = [];
      this.forEach(function(key, value) {
        values.push(value);
      });
      return values;
    },
    entries: function() {
      var entries = [];
      this.forEach(function(key, value) {
        entries.push({
          key: key,
          value: value
        });
      });
      return entries;
    },
    forEach: function(f) {
      for (var key in this) {
        if (key.charCodeAt(0) === d3_map_prefixCode) {
          f.call(this, key.substring(1), this[key]);
        }
      }
    }
  });
  var d3_map_prefix = "\x00", d3_map_prefixCode = d3_map_prefix.charCodeAt(0);
  d3.nest = function() {
    var nest = {}, keys = [], sortKeys = [], sortValues, rollup;
    function map(mapType, array, depth) {
      if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;
      var i = -1, n = array.length, key = keys[depth++], keyValue, object, setter, valuesByKey = new d3_Map(), values;
      while (++i < n) {
        if (values = valuesByKey.get(keyValue = key(object = array[i]))) {
          values.push(object);
        } else {
          valuesByKey.set(keyValue, [ object ]);
        }
      }
      if (mapType) {
        object = mapType();
        setter = function(keyValue, values) {
          object.set(keyValue, map(mapType, values, depth));
        };
      } else {
        object = {};
        setter = function(keyValue, values) {
          object[keyValue] = map(mapType, values, depth);
        };
      }
      valuesByKey.forEach(setter);
      return object;
    }
    function entries(map, depth) {
      if (depth >= keys.length) return map;
      var array = [], sortKey = sortKeys[depth++];
      map.forEach(function(key, keyMap) {
        array.push({
          key: key,
          values: entries(keyMap, depth)
        });
      });
      return sortKey ? array.sort(function(a, b) {
        return sortKey(a.key, b.key);
      }) : array;
    }
    nest.map = function(array, mapType) {
      return map(mapType, array, 0);
    };
    nest.entries = function(array) {
      return entries(map(d3.map, array, 0), 0);
    };
    nest.key = function(d) {
      keys.push(d);
      return nest;
    };
    nest.sortKeys = function(order) {
      sortKeys[keys.length - 1] = order;
      return nest;
    };
    nest.sortValues = function(order) {
      sortValues = order;
      return nest;
    };
    nest.rollup = function(f) {
      rollup = f;
      return nest;
    };
    return nest;
  };
  d3.set = function(array) {
    var set = new d3_Set();
    if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i]);
    return set;
  };
  function d3_Set() {}
  d3_class(d3_Set, {
    has: function(value) {
      return d3_map_prefix + value in this;
    },
    add: function(value) {
      this[d3_map_prefix + value] = true;
      return value;
    },
    remove: function(value) {
      value = d3_map_prefix + value;
      return value in this && delete this[value];
    },
    values: function() {
      var values = [];
      this.forEach(function(value) {
        values.push(value);
      });
      return values;
    },
    forEach: function(f) {
      for (var value in this) {
        if (value.charCodeAt(0) === d3_map_prefixCode) {
          f.call(this, value.substring(1));
        }
      }
    }
  });
  d3.behavior = {};
  d3.rebind = function(target, source) {
    var i = 1, n = arguments.length, method;
    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
    return target;
  };
  function d3_rebind(target, source, method) {
    return function() {
      var value = method.apply(source, arguments);
      return value === source ? target : value;
    };
  }
  function d3_vendorSymbol(object, name) {
    if (name in object) return name;
    name = name.charAt(0).toUpperCase() + name.substring(1);
    for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
      var prefixName = d3_vendorPrefixes[i] + name;
      if (prefixName in object) return prefixName;
    }
  }
  var d3_vendorPrefixes = [ "webkit", "ms", "moz", "Moz", "o", "O" ];
  function d3_noop() {}
  d3.dispatch = function() {
    var dispatch = new d3_dispatch(), i = -1, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
    return dispatch;
  };
  function d3_dispatch() {}
  d3_dispatch.prototype.on = function(type, listener) {
    var i = type.indexOf("."), name = "";
    if (i >= 0) {
      name = type.substring(i + 1);
      type = type.substring(0, i);
    }
    if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);
    if (arguments.length === 2) {
      if (listener == null) for (type in this) {
        if (this.hasOwnProperty(type)) this[type].on(name, null);
      }
      return this;
    }
  };
  function d3_dispatch_event(dispatch) {
    var listeners = [], listenerByName = new d3_Map();
    function event() {
      var z = listeners, i = -1, n = z.length, l;
      while (++i < n) if (l = z[i].on) l.apply(this, arguments);
      return dispatch;
    }
    event.on = function(name, listener) {
      var l = listenerByName.get(name), i;
      if (arguments.length < 2) return l && l.on;
      if (l) {
        l.on = null;
        listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
        listenerByName.remove(name);
      }
      if (listener) listeners.push(listenerByName.set(name, {
        on: listener
      }));
      return dispatch;
    };
    return event;
  }
  d3.event = null;
  function d3_eventPreventDefault() {
    d3.event.preventDefault();
  }
  function d3_eventSource() {
    var e = d3.event, s;
    while (s = e.sourceEvent) e = s;
    return e;
  }
  function d3_eventDispatch(target) {
    var dispatch = new d3_dispatch(), i = 0, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
    dispatch.of = function(thiz, argumentz) {
      return function(e1) {
        try {
          var e0 = e1.sourceEvent = d3.event;
          e1.target = target;
          d3.event = e1;
          dispatch[e1.type].apply(thiz, argumentz);
        } finally {
          d3.event = e0;
        }
      };
    };
    return dispatch;
  }
  d3.requote = function(s) {
    return s.replace(d3_requote_re, "\\$&");
  };
  var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
  var d3_subclass = {}.__proto__ ? function(object, prototype) {
    object.__proto__ = prototype;
  } : function(object, prototype) {
    for (var property in prototype) object[property] = prototype[property];
  };
  function d3_selection(groups) {
    d3_subclass(groups, d3_selectionPrototype);
    return groups;
  }
  var d3_select = function(s, n) {
    return n.querySelector(s);
  }, d3_selectAll = function(s, n) {
    return n.querySelectorAll(s);
  }, d3_selectMatcher = d3_documentElement[d3_vendorSymbol(d3_documentElement, "matchesSelector")], d3_selectMatches = function(n, s) {
    return d3_selectMatcher.call(n, s);
  };
  if (typeof Sizzle === "function") {
    d3_select = function(s, n) {
      return Sizzle(s, n)[0] || null;
    };
    d3_selectAll = function(s, n) {
      return Sizzle.uniqueSort(Sizzle(s, n));
    };
    d3_selectMatches = Sizzle.matchesSelector;
  }
  d3.selection = function() {
    return d3_selectionRoot;
  };
  var d3_selectionPrototype = d3.selection.prototype = [];
  d3_selectionPrototype.select = function(selector) {
    var subgroups = [], subgroup, subnode, group, node;
    selector = d3_selection_selector(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroup.push(subnode = selector.call(node, node.__data__, i, j));
          if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_selector(selector) {
    return typeof selector === "function" ? selector : function() {
      return d3_select(selector, this);
    };
  }
  d3_selectionPrototype.selectAll = function(selector) {
    var subgroups = [], subgroup, node;
    selector = d3_selection_selectorAll(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
          subgroup.parentNode = node;
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_selectorAll(selector) {
    return typeof selector === "function" ? selector : function() {
      return d3_selectAll(selector, this);
    };
  }
  var d3_nsPrefix = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };
  d3.ns = {
    prefix: d3_nsPrefix,
    qualify: function(name) {
      var i = name.indexOf(":"), prefix = name;
      if (i >= 0) {
        prefix = name.substring(0, i);
        name = name.substring(i + 1);
      }
      return d3_nsPrefix.hasOwnProperty(prefix) ? {
        space: d3_nsPrefix[prefix],
        local: name
      } : name;
    }
  };
  d3_selectionPrototype.attr = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") {
        var node = this.node();
        name = d3.ns.qualify(name);
        return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);
      }
      for (value in name) this.each(d3_selection_attr(value, name[value]));
      return this;
    }
    return this.each(d3_selection_attr(name, value));
  };
  function d3_selection_attr(name, value) {
    name = d3.ns.qualify(name);
    function attrNull() {
      this.removeAttribute(name);
    }
    function attrNullNS() {
      this.removeAttributeNS(name.space, name.local);
    }
    function attrConstant() {
      this.setAttribute(name, value);
    }
    function attrConstantNS() {
      this.setAttributeNS(name.space, name.local, value);
    }
    function attrFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttribute(name); else this.setAttribute(name, x);
    }
    function attrFunctionNS() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x);
    }
    return value == null ? name.local ? attrNullNS : attrNull : typeof value === "function" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;
  }
  function d3_collapse(s) {
    return s.trim().replace(/\s+/g, " ");
  }
  d3_selectionPrototype.classed = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") {
        var node = this.node(), n = (name = name.trim().split(/^|\s+/g)).length, i = -1;
        if (value = node.classList) {
          while (++i < n) if (!value.contains(name[i])) return false;
        } else {
          value = node.getAttribute("class");
          while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
        }
        return true;
      }
      for (value in name) this.each(d3_selection_classed(value, name[value]));
      return this;
    }
    return this.each(d3_selection_classed(name, value));
  };
  function d3_selection_classedRe(name) {
    return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
  }
  function d3_selection_classed(name, value) {
    name = name.trim().split(/\s+/).map(d3_selection_classedName);
    var n = name.length;
    function classedConstant() {
      var i = -1;
      while (++i < n) name[i](this, value);
    }
    function classedFunction() {
      var i = -1, x = value.apply(this, arguments);
      while (++i < n) name[i](this, x);
    }
    return typeof value === "function" ? classedFunction : classedConstant;
  }
  function d3_selection_classedName(name) {
    var re = d3_selection_classedRe(name);
    return function(node, value) {
      if (c = node.classList) return value ? c.add(name) : c.remove(name);
      var c = node.getAttribute("class") || "";
      if (value) {
        re.lastIndex = 0;
        if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
      } else {
        node.setAttribute("class", d3_collapse(c.replace(re, " ")));
      }
    };
  }
  d3_selectionPrototype.style = function(name, value, priority) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof name !== "string") {
        if (n < 2) value = "";
        for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
        return this;
      }
      if (n < 2) return d3_window.getComputedStyle(this.node(), null).getPropertyValue(name);
      priority = "";
    }
    return this.each(d3_selection_style(name, value, priority));
  };
  function d3_selection_style(name, value, priority) {
    function styleNull() {
      this.style.removeProperty(name);
    }
    function styleConstant() {
      this.style.setProperty(name, value, priority);
    }
    function styleFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority);
    }
    return value == null ? styleNull : typeof value === "function" ? styleFunction : styleConstant;
  }
  d3_selectionPrototype.property = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") return this.node()[name];
      for (value in name) this.each(d3_selection_property(value, name[value]));
      return this;
    }
    return this.each(d3_selection_property(name, value));
  };
  function d3_selection_property(name, value) {
    function propertyNull() {
      delete this[name];
    }
    function propertyConstant() {
      this[name] = value;
    }
    function propertyFunction() {
      var x = value.apply(this, arguments);
      if (x == null) delete this[name]; else this[name] = x;
    }
    return value == null ? propertyNull : typeof value === "function" ? propertyFunction : propertyConstant;
  }
  d3_selectionPrototype.text = function(value) {
    return arguments.length ? this.each(typeof value === "function" ? function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    } : value == null ? function() {
      this.textContent = "";
    } : function() {
      this.textContent = value;
    }) : this.node().textContent;
  };
  d3_selectionPrototype.html = function(value) {
    return arguments.length ? this.each(typeof value === "function" ? function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    } : value == null ? function() {
      this.innerHTML = "";
    } : function() {
      this.innerHTML = value;
    }) : this.node().innerHTML;
  };
  d3_selectionPrototype.append = function(name) {
    name = d3_selection_creator(name);
    return this.select(function() {
      return this.appendChild(name.apply(this, arguments));
    });
  };
  function d3_selection_creator(name) {
    return typeof name === "function" ? name : (name = d3.ns.qualify(name)).local ? function() {
      return this.ownerDocument.createElementNS(name.space, name.local);
    } : function() {
      return this.ownerDocument.createElementNS(this.namespaceURI, name);
    };
  }
  d3_selectionPrototype.insert = function(name, before) {
    name = d3_selection_creator(name);
    before = d3_selection_selector(before);
    return this.select(function() {
      return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
    });
  };
  d3_selectionPrototype.remove = function() {
    return this.each(function() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    });
  };
  d3_selectionPrototype.data = function(value, key) {
    var i = -1, n = this.length, group, node;
    if (!arguments.length) {
      value = new Array(n = (group = this[0]).length);
      while (++i < n) {
        if (node = group[i]) {
          value[i] = node.__data__;
        }
      }
      return value;
    }
    function bind(group, groupData) {
      var i, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n), node, nodeData;
      if (key) {
        var nodeByKeyValue = new d3_Map(), dataByKeyValue = new d3_Map(), keyValues = [], keyValue;
        for (i = -1; ++i < n; ) {
          keyValue = key.call(node = group[i], node.__data__, i);
          if (nodeByKeyValue.has(keyValue)) {
            exitNodes[i] = node;
          } else {
            nodeByKeyValue.set(keyValue, node);
          }
          keyValues.push(keyValue);
        }
        for (i = -1; ++i < m; ) {
          keyValue = key.call(groupData, nodeData = groupData[i], i);
          if (node = nodeByKeyValue.get(keyValue)) {
            updateNodes[i] = node;
            node.__data__ = nodeData;
          } else if (!dataByKeyValue.has(keyValue)) {
            enterNodes[i] = d3_selection_dataNode(nodeData);
          }
          dataByKeyValue.set(keyValue, nodeData);
          nodeByKeyValue.remove(keyValue);
        }
        for (i = -1; ++i < n; ) {
          if (nodeByKeyValue.has(keyValues[i])) {
            exitNodes[i] = group[i];
          }
        }
      } else {
        for (i = -1; ++i < n0; ) {
          node = group[i];
          nodeData = groupData[i];
          if (node) {
            node.__data__ = nodeData;
            updateNodes[i] = node;
          } else {
            enterNodes[i] = d3_selection_dataNode(nodeData);
          }
        }
        for (;i < m; ++i) {
          enterNodes[i] = d3_selection_dataNode(groupData[i]);
        }
        for (;i < n; ++i) {
          exitNodes[i] = group[i];
        }
      }
      enterNodes.update = updateNodes;
      enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;
      enter.push(enterNodes);
      update.push(updateNodes);
      exit.push(exitNodes);
    }
    var enter = d3_selection_enter([]), update = d3_selection([]), exit = d3_selection([]);
    if (typeof value === "function") {
      while (++i < n) {
        bind(group = this[i], value.call(group, group.parentNode.__data__, i));
      }
    } else {
      while (++i < n) {
        bind(group = this[i], value);
      }
    }
    update.enter = function() {
      return enter;
    };
    update.exit = function() {
      return exit;
    };
    return update;
  };
  function d3_selection_dataNode(data) {
    return {
      __data__: data
    };
  }
  d3_selectionPrototype.datum = function(value) {
    return arguments.length ? this.property("__data__", value) : this.property("__data__");
  };
  d3_selectionPrototype.filter = function(filter) {
    var subgroups = [], subgroup, group, node;
    if (typeof filter !== "function") filter = d3_selection_filter(filter);
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = 0, n = group.length; i < n; i++) {
        if ((node = group[i]) && filter.call(node, node.__data__, i)) {
          subgroup.push(node);
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_filter(selector) {
    return function() {
      return d3_selectMatches(this, selector);
    };
  }
  d3_selectionPrototype.order = function() {
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
        if (node = group[i]) {
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }
    return this;
  };
  d3_selectionPrototype.sort = function(comparator) {
    comparator = d3_selection_sortComparator.apply(this, arguments);
    for (var j = -1, m = this.length; ++j < m; ) this[j].sort(comparator);
    return this.order();
  };
  function d3_selection_sortComparator(comparator) {
    if (!arguments.length) comparator = d3.ascending;
    return function(a, b) {
      return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
    };
  }
  d3_selectionPrototype.each = function(callback) {
    return d3_selection_each(this, function(node, i, j) {
      callback.call(node, node.__data__, i, j);
    });
  };
  function d3_selection_each(groups, callback) {
    for (var j = 0, m = groups.length; j < m; j++) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
        if (node = group[i]) callback(node, i, j);
      }
    }
    return groups;
  }
  d3_selectionPrototype.call = function(callback) {
    var args = d3_array(arguments);
    callback.apply(args[0] = this, args);
    return this;
  };
  d3_selectionPrototype.empty = function() {
    return !this.node();
  };
  d3_selectionPrototype.node = function() {
    for (var j = 0, m = this.length; j < m; j++) {
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        var node = group[i];
        if (node) return node;
      }
    }
    return null;
  };
  d3_selectionPrototype.size = function() {
    var n = 0;
    this.each(function() {
      ++n;
    });
    return n;
  };
  function d3_selection_enter(selection) {
    d3_subclass(selection, d3_selection_enterPrototype);
    return selection;
  }
  var d3_selection_enterPrototype = [];
  d3.selection.enter = d3_selection_enter;
  d3.selection.enter.prototype = d3_selection_enterPrototype;
  d3_selection_enterPrototype.append = d3_selectionPrototype.append;
  d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;
  d3_selection_enterPrototype.node = d3_selectionPrototype.node;
  d3_selection_enterPrototype.call = d3_selectionPrototype.call;
  d3_selection_enterPrototype.size = d3_selectionPrototype.size;
  d3_selection_enterPrototype.select = function(selector) {
    var subgroups = [], subgroup, subnode, upgroup, group, node;
    for (var j = -1, m = this.length; ++j < m; ) {
      upgroup = (group = this[j]).update;
      subgroups.push(subgroup = []);
      subgroup.parentNode = group.parentNode;
      for (var i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
          subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_selection(subgroups);
  };
  d3_selection_enterPrototype.insert = function(name, before) {
    if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
    return d3_selectionPrototype.insert.call(this, name, before);
  };
  function d3_selection_enterInsertBefore(enter) {
    var i0, j0;
    return function(d, i, j) {
      var group = enter[j].update, n = group.length, node;
      if (j != j0) j0 = j, i0 = 0;
      if (i >= i0) i0 = i + 1;
      while (!(node = group[i0]) && ++i0 < n) ;
      return node;
    };
  }
  d3_selectionPrototype.transition = function() {
    var id = d3_transitionInheritId || ++d3_transitionId, subgroups = [], subgroup, node, transition = d3_transitionInherit || {
      time: Date.now(),
      ease: d3_ease_cubicInOut,
      delay: 0,
      duration: 250
    };
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) d3_transitionNode(node, i, id, transition);
        subgroup.push(node);
      }
    }
    return d3_transition(subgroups, id);
  };
  d3_selectionPrototype.interrupt = function() {
    return this.each(d3_selection_interrupt);
  };
  function d3_selection_interrupt() {
    var lock = this.__transition__;
    if (lock) ++lock.active;
  }
  d3.select = function(node) {
    var group = [ typeof node === "string" ? d3_select(node, d3_document) : node ];
    group.parentNode = d3_documentElement;
    return d3_selection([ group ]);
  };
  d3.selectAll = function(nodes) {
    var group = d3_array(typeof nodes === "string" ? d3_selectAll(nodes, d3_document) : nodes);
    group.parentNode = d3_documentElement;
    return d3_selection([ group ]);
  };
  var d3_selectionRoot = d3.select(d3_documentElement);
  d3_selectionPrototype.on = function(type, listener, capture) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof type !== "string") {
        if (n < 2) listener = false;
        for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
        return this;
      }
      if (n < 2) return (n = this.node()["__on" + type]) && n._;
      capture = false;
    }
    return this.each(d3_selection_on(type, listener, capture));
  };
  function d3_selection_on(type, listener, capture) {
    var name = "__on" + type, i = type.indexOf("."), wrap = d3_selection_onListener;
    if (i > 0) type = type.substring(0, i);
    var filter = d3_selection_onFilters.get(type);
    if (filter) type = filter, wrap = d3_selection_onFilter;
    function onRemove() {
      var l = this[name];
      if (l) {
        this.removeEventListener(type, l, l.$);
        delete this[name];
      }
    }
    function onAdd() {
      var l = wrap(listener, d3_array(arguments));
      onRemove.call(this);
      this.addEventListener(type, this[name] = l, l.$ = capture);
      l._ = listener;
    }
    function removeAll() {
      var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"), match;
      for (var name in this) {
        if (match = name.match(re)) {
          var l = this[name];
          this.removeEventListener(match[1], l, l.$);
          delete this[name];
        }
      }
    }
    return i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll;
  }
  var d3_selection_onFilters = d3.map({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  });
  d3_selection_onFilters.forEach(function(k) {
    if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
  });
  function d3_selection_onListener(listener, argumentz) {
    return function(e) {
      var o = d3.event;
      d3.event = e;
      argumentz[0] = this.__data__;
      try {
        listener.apply(this, argumentz);
      } finally {
        d3.event = o;
      }
    };
  }
  function d3_selection_onFilter(listener, argumentz) {
    var l = d3_selection_onListener(listener, argumentz);
    return function(e) {
      var target = this, related = e.relatedTarget;
      if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {
        l.call(target, e);
      }
    };
  }
  var d3_event_dragSelect = d3_vendorSymbol(d3_documentElement.style, "userSelect"), d3_event_dragId = 0;
  function d3_event_dragSuppress() {
    var name = ".dragsuppress-" + ++d3_event_dragId, touchmove = "touchmove" + name, selectstart = "selectstart" + name, dragstart = "dragstart" + name, click = "click" + name, w = d3.select(d3_window).on(touchmove, d3_eventPreventDefault).on(selectstart, d3_eventPreventDefault).on(dragstart, d3_eventPreventDefault), style = d3_documentElement.style, select = style[d3_event_dragSelect];
    style[d3_event_dragSelect] = "none";
    return function(suppressClick) {
      w.on(name, null);
      style[d3_event_dragSelect] = select;
      if (suppressClick) {
        function off() {
          w.on(click, null);
        }
        w.on(click, function() {
          d3_eventPreventDefault();
          off();
        }, true);
        setTimeout(off, 0);
      }
    };
  }
  d3.mouse = function(container) {
    return d3_mousePoint(container, d3_eventSource());
  };
  var d3_mouse_bug44083 = /WebKit/.test(d3_window.navigator.userAgent) ? -1 : 0;
  function d3_mousePoint(container, e) {
    if (e.changedTouches) e = e.changedTouches[0];
    var svg = container.ownerSVGElement || container;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      if (d3_mouse_bug44083 < 0 && (d3_window.scrollX || d3_window.scrollY)) {
        svg = d3.select("body").append("svg").style({
          position: "absolute",
          top: 0,
          left: 0,
          margin: 0,
          padding: 0,
          border: "none"
        }, "important");
        var ctm = svg[0][0].getScreenCTM();
        d3_mouse_bug44083 = !(ctm.f || ctm.e);
        svg.remove();
      }
      if (d3_mouse_bug44083) point.x = e.pageX, point.y = e.pageY; else point.x = e.clientX, 
      point.y = e.clientY;
      point = point.matrixTransform(container.getScreenCTM().inverse());
      return [ point.x, point.y ];
    }
    var rect = container.getBoundingClientRect();
    return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];
  }
  d3.touches = function(container, touches) {
    if (arguments.length < 2) touches = d3_eventSource().touches;
    return touches ? d3_array(touches).map(function(touch) {
      var point = d3_mousePoint(container, touch);
      point.identifier = touch.identifier;
      return point;
    }) : [];
  };
  d3.behavior.drag = function() {
    var event = d3_eventDispatch(drag, "drag", "dragstart", "dragend"), origin = null, mousedown = dragstart(d3_noop, d3.mouse, "mousemove", "mouseup"), touchstart = dragstart(touchid, touchposition, "touchmove", "touchend");
    function drag() {
      this.on("mousedown.drag", mousedown).on("touchstart.drag", touchstart);
    }
    function touchid() {
      return d3.event.changedTouches[0].identifier;
    }
    function touchposition(parent, id) {
      return d3.touches(parent).filter(function(p) {
        return p.identifier === id;
      })[0];
    }
    function dragstart(id, position, move, end) {
      return function() {
        var target = this, parent = target.parentNode, event_ = event.of(target, arguments), eventTarget = d3.event.target, eventId = id(), drag = eventId == null ? "drag" : "drag-" + eventId, origin_ = position(parent, eventId), dragged = 0, offset, w = d3.select(d3_window).on(move + "." + drag, moved).on(end + "." + drag, ended), dragRestore = d3_event_dragSuppress();
        if (origin) {
          offset = origin.apply(target, arguments);
          offset = [ offset.x - origin_[0], offset.y - origin_[1] ];
        } else {
          offset = [ 0, 0 ];
        }
        event_({
          type: "dragstart"
        });
        function moved() {
          var p = position(parent, eventId), dx = p[0] - origin_[0], dy = p[1] - origin_[1];
          dragged |= dx | dy;
          origin_ = p;
          event_({
            type: "drag",
            x: p[0] + offset[0],
            y: p[1] + offset[1],
            dx: dx,
            dy: dy
          });
        }
        function ended() {
          w.on(move + "." + drag, null).on(end + "." + drag, null);
          dragRestore(dragged && d3.event.target === eventTarget);
          event_({
            type: "dragend"
          });
        }
      };
    }
    drag.origin = function(x) {
      if (!arguments.length) return origin;
      origin = x;
      return drag;
    };
    return d3.rebind(drag, event, "on");
  };
  var π = Math.PI, τ = 2 * π, halfπ = π / 2, ε = 1e-6, ε2 = ε * ε, d3_radians = π / 180, d3_degrees = 180 / π;
  function d3_sgn(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
  }
  function d3_acos(x) {
    return x > 1 ? 0 : x < -1 ? π : Math.acos(x);
  }
  function d3_asin(x) {
    return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);
  }
  function d3_sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
  }
  function d3_cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
  }
  function d3_tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
  }
  function d3_haversin(x) {
    return (x = Math.sin(x / 2)) * x;
  }
  var ρ = Math.SQRT2, ρ2 = 2, ρ4 = 4;
  d3.interpolateZoom = function(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2];
    var dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1), b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1), dr = r1 - r0, S = (dr || Math.log(w1 / w0)) / ρ;
    function interpolate(t) {
      var s = t * S;
      if (dr) {
        var coshr0 = d3_cosh(r0), u = w0 / (ρ2 * d1) * (coshr0 * d3_tanh(ρ * s + r0) - d3_sinh(r0));
        return [ ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / d3_cosh(ρ * s + r0) ];
      }
      return [ ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(ρ * s) ];
    }
    interpolate.duration = S * 1e3;
    return interpolate;
  };
  d3.behavior.zoom = function() {
    var view = {
      x: 0,
      y: 0,
      k: 1
    }, translate0, center, size = [ 960, 500 ], scaleExtent = d3_behavior_zoomInfinity, mousedown = "mousedown.zoom", mousemove = "mousemove.zoom", mouseup = "mouseup.zoom", mousewheelTimer, touchstart = "touchstart.zoom", touchtime, event = d3_eventDispatch(zoom, "zoomstart", "zoom", "zoomend"), x0, x1, y0, y1;
    function zoom(g) {
      g.on(mousedown, mousedowned).on(d3_behavior_zoomWheel + ".zoom", mousewheeled).on(mousemove, mousewheelreset).on("dblclick.zoom", dblclicked).on(touchstart, touchstarted);
    }
    zoom.event = function(g) {
      g.each(function() {
        var event_ = event.of(this, arguments), view1 = view;
        if (d3_transitionInheritId) {
          d3.select(this).transition().each("start.zoom", function() {
            view = this.__chart__ || {
              x: 0,
              y: 0,
              k: 1
            };
            zoomstarted(event_);
          }).tween("zoom:zoom", function() {
            var dx = size[0], dy = size[1], cx = dx / 2, cy = dy / 2, i = d3.interpolateZoom([ (cx - view.x) / view.k, (cy - view.y) / view.k, dx / view.k ], [ (cx - view1.x) / view1.k, (cy - view1.y) / view1.k, dx / view1.k ]);
            return function(t) {
              var l = i(t), k = dx / l[2];
              this.__chart__ = view = {
                x: cx - l[0] * k,
                y: cy - l[1] * k,
                k: k
              };
              zoomed(event_);
            };
          }).each("end.zoom", function() {
            zoomended(event_);
          });
        } else {
          this.__chart__ = view;
          zoomstarted(event_);
          zoomed(event_);
          zoomended(event_);
        }
      });
    };
    zoom.translate = function(_) {
      if (!arguments.length) return [ view.x, view.y ];
      view = {
        x: +_[0],
        y: +_[1],
        k: view.k
      };
      rescale();
      return zoom;
    };
    zoom.scale = function(_) {
      if (!arguments.length) return view.k;
      view = {
        x: view.x,
        y: view.y,
        k: +_
      };
      rescale();
      return zoom;
    };
    zoom.scaleExtent = function(_) {
      if (!arguments.length) return scaleExtent;
      scaleExtent = _ == null ? d3_behavior_zoomInfinity : [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.center = function(_) {
      if (!arguments.length) return center;
      center = _ && [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.size = function(_) {
      if (!arguments.length) return size;
      size = _ && [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.x = function(z) {
      if (!arguments.length) return x1;
      x1 = z;
      x0 = z.copy();
      view = {
        x: 0,
        y: 0,
        k: 1
      };
      return zoom;
    };
    zoom.y = function(z) {
      if (!arguments.length) return y1;
      y1 = z;
      y0 = z.copy();
      view = {
        x: 0,
        y: 0,
        k: 1
      };
      return zoom;
    };
    function location(p) {
      return [ (p[0] - view.x) / view.k, (p[1] - view.y) / view.k ];
    }
    function point(l) {
      return [ l[0] * view.k + view.x, l[1] * view.k + view.y ];
    }
    function scaleTo(s) {
      view.k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s));
    }
    function translateTo(p, l) {
      l = point(l);
      view.x += p[0] - l[0];
      view.y += p[1] - l[1];
    }
    function rescale() {
      if (x1) x1.domain(x0.range().map(function(x) {
        return (x - view.x) / view.k;
      }).map(x0.invert));
      if (y1) y1.domain(y0.range().map(function(y) {
        return (y - view.y) / view.k;
      }).map(y0.invert));
    }
    function zoomstarted(event) {
      event({
        type: "zoomstart"
      });
    }
    function zoomed(event) {
      rescale();
      event({
        type: "zoom",
        scale: view.k,
        translate: [ view.x, view.y ]
      });
    }
    function zoomended(event) {
      event({
        type: "zoomend"
      });
    }
    function mousedowned() {
      var target = this, event_ = event.of(target, arguments), eventTarget = d3.event.target, dragged = 0, w = d3.select(d3_window).on(mousemove, moved).on(mouseup, ended), l = location(d3.mouse(target)), dragRestore = d3_event_dragSuppress();
      d3_selection_interrupt.call(target);
      zoomstarted(event_);
      function moved() {
        dragged = 1;
        translateTo(d3.mouse(target), l);
        zoomed(event_);
      }
      function ended() {
        w.on(mousemove, d3_window === target ? mousewheelreset : null).on(mouseup, null);
        dragRestore(dragged && d3.event.target === eventTarget);
        zoomended(event_);
      }
    }
    function touchstarted() {
      var target = this, event_ = event.of(target, arguments), locations0 = {}, distance0 = 0, scale0, eventId = d3.event.changedTouches[0].identifier, touchmove = "touchmove.zoom-" + eventId, touchend = "touchend.zoom-" + eventId, w = d3.select(d3_window).on(touchmove, moved).on(touchend, ended), t = d3.select(target).on(mousedown, null).on(touchstart, started), dragRestore = d3_event_dragSuppress();
      d3_selection_interrupt.call(target);
      started();
      zoomstarted(event_);
      function relocate() {
        var touches = d3.touches(target);
        scale0 = view.k;
        touches.forEach(function(t) {
          if (t.identifier in locations0) locations0[t.identifier] = location(t);
        });
        return touches;
      }
      function started() {
        var changed = d3.event.changedTouches;
        for (var i = 0, n = changed.length; i < n; ++i) {
          locations0[changed[i].identifier] = null;
        }
        var touches = relocate(), now = Date.now();
        if (touches.length === 1) {
          if (now - touchtime < 500) {
            var p = touches[0], l = locations0[p.identifier];
            scaleTo(view.k * 2);
            translateTo(p, l);
            d3_eventPreventDefault();
            zoomed(event_);
          }
          touchtime = now;
        } else if (touches.length > 1) {
          var p = touches[0], q = touches[1], dx = p[0] - q[0], dy = p[1] - q[1];
          distance0 = dx * dx + dy * dy;
        }
      }
      function moved() {
        var touches = d3.touches(target), p0, l0, p1, l1;
        for (var i = 0, n = touches.length; i < n; ++i, l1 = null) {
          p1 = touches[i];
          if (l1 = locations0[p1.identifier]) {
            if (l0) break;
            p0 = p1, l0 = l1;
          }
        }
        if (l1) {
          var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1, scale1 = distance0 && Math.sqrt(distance1 / distance0);
          p0 = [ (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 ];
          l0 = [ (l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2 ];
          scaleTo(scale1 * scale0);
        }
        touchtime = null;
        translateTo(p0, l0);
        zoomed(event_);
      }
      function ended() {
        if (d3.event.touches.length) {
          var changed = d3.event.changedTouches;
          for (var i = 0, n = changed.length; i < n; ++i) {
            delete locations0[changed[i].identifier];
          }
          for (var identifier in locations0) {
            return void relocate();
          }
        }
        w.on(touchmove, null).on(touchend, null);
        t.on(mousedown, mousedowned).on(touchstart, touchstarted);
        dragRestore();
        zoomended(event_);
      }
    }
    function mousewheeled() {
      var event_ = event.of(this, arguments);
      if (mousewheelTimer) clearTimeout(mousewheelTimer); else d3_selection_interrupt.call(this), 
      zoomstarted(event_);
      mousewheelTimer = setTimeout(function() {
        mousewheelTimer = null;
        zoomended(event_);
      }, 50);
      d3_eventPreventDefault();
      var point = center || d3.mouse(this);
      if (!translate0) translate0 = location(point);
      scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * view.k);
      translateTo(point, translate0);
      zoomed(event_);
    }
    function mousewheelreset() {
      translate0 = null;
    }
    function dblclicked() {
      var event_ = event.of(this, arguments), p = d3.mouse(this), l = location(p), k = Math.log(view.k) / Math.LN2;
      zoomstarted(event_);
      scaleTo(Math.pow(2, d3.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1));
      translateTo(p, l);
      zoomed(event_);
      zoomended(event_);
    }
    return d3.rebind(zoom, event, "on");
  };
  var d3_behavior_zoomInfinity = [ 0, Infinity ];
  var d3_behavior_zoomDelta, d3_behavior_zoomWheel = "onwheel" in d3_document ? (d3_behavior_zoomDelta = function() {
    return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1);
  }, "wheel") : "onmousewheel" in d3_document ? (d3_behavior_zoomDelta = function() {
    return d3.event.wheelDelta;
  }, "mousewheel") : (d3_behavior_zoomDelta = function() {
    return -d3.event.detail;
  }, "MozMousePixelScroll");
  function d3_Color() {}
  d3_Color.prototype.toString = function() {
    return this.rgb() + "";
  };
  d3.hsl = function(h, s, l) {
    return arguments.length === 1 ? h instanceof d3_Hsl ? d3_hsl(h.h, h.s, h.l) : d3_rgb_parse("" + h, d3_rgb_hsl, d3_hsl) : d3_hsl(+h, +s, +l);
  };
  function d3_hsl(h, s, l) {
    return new d3_Hsl(h, s, l);
  }
  function d3_Hsl(h, s, l) {
    this.h = h;
    this.s = s;
    this.l = l;
  }
  var d3_hslPrototype = d3_Hsl.prototype = new d3_Color();
  d3_hslPrototype.brighter = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return d3_hsl(this.h, this.s, this.l / k);
  };
  d3_hslPrototype.darker = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return d3_hsl(this.h, this.s, k * this.l);
  };
  d3_hslPrototype.rgb = function() {
    return d3_hsl_rgb(this.h, this.s, this.l);
  };
  function d3_hsl_rgb(h, s, l) {
    var m1, m2;
    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
    l = l < 0 ? 0 : l > 1 ? 1 : l;
    m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
    m1 = 2 * l - m2;
    function v(h) {
      if (h > 360) h -= 360; else if (h < 0) h += 360;
      if (h < 60) return m1 + (m2 - m1) * h / 60;
      if (h < 180) return m2;
      if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
      return m1;
    }
    function vv(h) {
      return Math.round(v(h) * 255);
    }
    return d3_rgb(vv(h + 120), vv(h), vv(h - 120));
  }
  d3.hcl = function(h, c, l) {
    return arguments.length === 1 ? h instanceof d3_Hcl ? d3_hcl(h.h, h.c, h.l) : h instanceof d3_Lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : d3_hcl(+h, +c, +l);
  };
  function d3_hcl(h, c, l) {
    return new d3_Hcl(h, c, l);
  }
  function d3_Hcl(h, c, l) {
    this.h = h;
    this.c = c;
    this.l = l;
  }
  var d3_hclPrototype = d3_Hcl.prototype = new d3_Color();
  d3_hclPrototype.brighter = function(k) {
    return d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)));
  };
  d3_hclPrototype.darker = function(k) {
    return d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)));
  };
  d3_hclPrototype.rgb = function() {
    return d3_hcl_lab(this.h, this.c, this.l).rgb();
  };
  function d3_hcl_lab(h, c, l) {
    if (isNaN(h)) h = 0;
    if (isNaN(c)) c = 0;
    return d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c);
  }
  d3.lab = function(l, a, b) {
    return arguments.length === 1 ? l instanceof d3_Lab ? d3_lab(l.l, l.a, l.b) : l instanceof d3_Hcl ? d3_hcl_lab(l.l, l.c, l.h) : d3_rgb_lab((l = d3.rgb(l)).r, l.g, l.b) : d3_lab(+l, +a, +b);
  };
  function d3_lab(l, a, b) {
    return new d3_Lab(l, a, b);
  }
  function d3_Lab(l, a, b) {
    this.l = l;
    this.a = a;
    this.b = b;
  }
  var d3_lab_K = 18;
  var d3_lab_X = .95047, d3_lab_Y = 1, d3_lab_Z = 1.08883;
  var d3_labPrototype = d3_Lab.prototype = new d3_Color();
  d3_labPrototype.brighter = function(k) {
    return d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
  };
  d3_labPrototype.darker = function(k) {
    return d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
  };
  d3_labPrototype.rgb = function() {
    return d3_lab_rgb(this.l, this.a, this.b);
  };
  function d3_lab_rgb(l, a, b) {
    var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200;
    x = d3_lab_xyz(x) * d3_lab_X;
    y = d3_lab_xyz(y) * d3_lab_Y;
    z = d3_lab_xyz(z) * d3_lab_Z;
    return d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));
  }
  function d3_lab_hcl(l, a, b) {
    return l > 0 ? d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : d3_hcl(NaN, NaN, l);
  }
  function d3_lab_xyz(x) {
    return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;
  }
  function d3_xyz_lab(x) {
    return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;
  }
  function d3_xyz_rgb(r) {
    return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));
  }
  d3.rgb = function(r, g, b) {
    return arguments.length === 1 ? r instanceof d3_Rgb ? d3_rgb(r.r, r.g, r.b) : d3_rgb_parse("" + r, d3_rgb, d3_hsl_rgb) : d3_rgb(~~r, ~~g, ~~b);
  };
  function d3_rgbNumber(value) {
    return d3_rgb(value >> 16, value >> 8 & 255, value & 255);
  }
  function d3_rgbString(value) {
    return d3_rgbNumber(value) + "";
  }
  function d3_rgb(r, g, b) {
    return new d3_Rgb(r, g, b);
  }
  function d3_Rgb(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  var d3_rgbPrototype = d3_Rgb.prototype = new d3_Color();
  d3_rgbPrototype.brighter = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    var r = this.r, g = this.g, b = this.b, i = 30;
    if (!r && !g && !b) return d3_rgb(i, i, i);
    if (r && r < i) r = i;
    if (g && g < i) g = i;
    if (b && b < i) b = i;
    return d3_rgb(Math.min(255, ~~(r / k)), Math.min(255, ~~(g / k)), Math.min(255, ~~(b / k)));
  };
  d3_rgbPrototype.darker = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return d3_rgb(~~(k * this.r), ~~(k * this.g), ~~(k * this.b));
  };
  d3_rgbPrototype.hsl = function() {
    return d3_rgb_hsl(this.r, this.g, this.b);
  };
  d3_rgbPrototype.toString = function() {
    return "#" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);
  };
  function d3_rgb_hex(v) {
    return v < 16 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
  }
  function d3_rgb_parse(format, rgb, hsl) {
    var r = 0, g = 0, b = 0, m1, m2, name;
    m1 = /([a-z]+)\((.*)\)/i.exec(format);
    if (m1) {
      m2 = m1[2].split(",");
      switch (m1[1]) {
       case "hsl":
        {
          return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
        }

       case "rgb":
        {
          return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]));
        }
      }
    }
    if (name = d3_rgb_names.get(format)) return rgb(name.r, name.g, name.b);
    if (format != null && format.charAt(0) === "#") {
      if (format.length === 4) {
        r = format.charAt(1);
        r += r;
        g = format.charAt(2);
        g += g;
        b = format.charAt(3);
        b += b;
      } else if (format.length === 7) {
        r = format.substring(1, 3);
        g = format.substring(3, 5);
        b = format.substring(5, 7);
      }
      r = parseInt(r, 16);
      g = parseInt(g, 16);
      b = parseInt(b, 16);
    }
    return rgb(r, g, b);
  }
  function d3_rgb_hsl(r, g, b) {
    var min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, h, s, l = (max + min) / 2;
    if (d) {
      s = l < .5 ? d / (max + min) : d / (2 - max - min);
      if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;
      h *= 60;
    } else {
      h = NaN;
      s = l > 0 && l < 1 ? 0 : h;
    }
    return d3_hsl(h, s, l);
  }
  function d3_rgb_lab(r, g, b) {
    r = d3_rgb_xyz(r);
    g = d3_rgb_xyz(g);
    b = d3_rgb_xyz(b);
    var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X), y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y), z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);
    return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));
  }
  function d3_rgb_xyz(r) {
    return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);
  }
  function d3_rgb_parseNumber(c) {
    var f = parseFloat(c);
    return c.charAt(c.length - 1) === "%" ? Math.round(f * 2.55) : f;
  }
  var d3_rgb_names = d3.map({
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  });
  d3_rgb_names.forEach(function(key, value) {
    d3_rgb_names.set(key, d3_rgbNumber(value));
  });
  function d3_functor(v) {
    return typeof v === "function" ? v : function() {
      return v;
    };
  }
  d3.functor = d3_functor;
  function d3_identity(d) {
    return d;
  }
  d3.xhr = d3_xhrType(d3_identity);
  function d3_xhrType(response) {
    return function(url, mimeType, callback) {
      if (arguments.length === 2 && typeof mimeType === "function") callback = mimeType, 
      mimeType = null;
      return d3_xhr(url, mimeType, response, callback);
    };
  }
  function d3_xhr(url, mimeType, response, callback) {
    var xhr = {}, dispatch = d3.dispatch("beforesend", "progress", "load", "error"), headers = {}, request = new XMLHttpRequest(), responseType = null;
    if (d3_window.XDomainRequest && !("withCredentials" in request) && /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest();
    "onload" in request ? request.onload = request.onerror = respond : request.onreadystatechange = function() {
      request.readyState > 3 && respond();
    };
    function respond() {
      var status = request.status, result;
      if (!status && request.responseText || status >= 200 && status < 300 || status === 304) {
        try {
          result = response.call(xhr, request);
        } catch (e) {
          dispatch.error.call(xhr, e);
          return;
        }
        dispatch.load.call(xhr, result);
      } else {
        dispatch.error.call(xhr, request);
      }
    }
    request.onprogress = function(event) {
      var o = d3.event;
      d3.event = event;
      try {
        dispatch.progress.call(xhr, request);
      } finally {
        d3.event = o;
      }
    };
    xhr.header = function(name, value) {
      name = (name + "").toLowerCase();
      if (arguments.length < 2) return headers[name];
      if (value == null) delete headers[name]; else headers[name] = value + "";
      return xhr;
    };
    xhr.mimeType = function(value) {
      if (!arguments.length) return mimeType;
      mimeType = value == null ? null : value + "";
      return xhr;
    };
    xhr.responseType = function(value) {
      if (!arguments.length) return responseType;
      responseType = value;
      return xhr;
    };
    xhr.response = function(value) {
      response = value;
      return xhr;
    };
    [ "get", "post" ].forEach(function(method) {
      xhr[method] = function() {
        return xhr.send.apply(xhr, [ method ].concat(d3_array(arguments)));
      };
    });
    xhr.send = function(method, data, callback) {
      if (arguments.length === 2 && typeof data === "function") callback = data, data = null;
      request.open(method, url, true);
      if (mimeType != null && !("accept" in headers)) headers["accept"] = mimeType + ",*/*";
      if (request.setRequestHeader) for (var name in headers) request.setRequestHeader(name, headers[name]);
      if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType);
      if (responseType != null) request.responseType = responseType;
      if (callback != null) xhr.on("error", callback).on("load", function(request) {
        callback(null, request);
      });
      dispatch.beforesend.call(xhr, request);
      request.send(data == null ? null : data);
      return xhr;
    };
    xhr.abort = function() {
      request.abort();
      return xhr;
    };
    d3.rebind(xhr, dispatch, "on");
    return callback == null ? xhr : xhr.get(d3_xhr_fixCallback(callback));
  }
  function d3_xhr_fixCallback(callback) {
    return callback.length === 1 ? function(error, request) {
      callback(error == null ? request : null);
    } : callback;
  }
  d3.dsv = function(delimiter, mimeType) {
    var reFormat = new RegExp('["' + delimiter + "\n]"), delimiterCode = delimiter.charCodeAt(0);
    function dsv(url, row, callback) {
      if (arguments.length < 3) callback = row, row = null;
      var xhr = d3.xhr(url, mimeType, callback);
      xhr.row = function(_) {
        return arguments.length ? xhr.response((row = _) == null ? response : typedResponse(_)) : row;
      };
      return xhr.row(row);
    }
    function response(request) {
      return dsv.parse(request.responseText);
    }
    function typedResponse(f) {
      return function(request) {
        return dsv.parse(request.responseText, f);
      };
    }
    dsv.parse = function(text, f) {
      var o;
      return dsv.parseRows(text, function(row, i) {
        if (o) return o(row, i - 1);
        var a = new Function("d", "return {" + row.map(function(name, i) {
          return JSON.stringify(name) + ": d[" + i + "]";
        }).join(",") + "}");
        o = f ? function(row, i) {
          return f(a(row), i);
        } : a;
      });
    };
    dsv.parseRows = function(text, f) {
      var EOL = {}, EOF = {}, rows = [], N = text.length, I = 0, n = 0, t, eol;
      function token() {
        if (I >= N) return EOF;
        if (eol) return eol = false, EOL;
        var j = I;
        if (text.charCodeAt(j) === 34) {
          var i = j;
          while (i++ < N) {
            if (text.charCodeAt(i) === 34) {
              if (text.charCodeAt(i + 1) !== 34) break;
              ++i;
            }
          }
          I = i + 2;
          var c = text.charCodeAt(i + 1);
          if (c === 13) {
            eol = true;
            if (text.charCodeAt(i + 2) === 10) ++I;
          } else if (c === 10) {
            eol = true;
          }
          return text.substring(j + 1, i).replace(/""/g, '"');
        }
        while (I < N) {
          var c = text.charCodeAt(I++), k = 1;
          if (c === 10) eol = true; else if (c === 13) {
            eol = true;
            if (text.charCodeAt(I) === 10) ++I, ++k;
          } else if (c !== delimiterCode) continue;
          return text.substring(j, I - k);
        }
        return text.substring(j);
      }
      while ((t = token()) !== EOF) {
        var a = [];
        while (t !== EOL && t !== EOF) {
          a.push(t);
          t = token();
        }
        if (f && !(a = f(a, n++))) continue;
        rows.push(a);
      }
      return rows;
    };
    dsv.format = function(rows) {
      if (Array.isArray(rows[0])) return dsv.formatRows(rows);
      var fieldSet = new d3_Set(), fields = [];
      rows.forEach(function(row) {
        for (var field in row) {
          if (!fieldSet.has(field)) {
            fields.push(fieldSet.add(field));
          }
        }
      });
      return [ fields.map(formatValue).join(delimiter) ].concat(rows.map(function(row) {
        return fields.map(function(field) {
          return formatValue(row[field]);
        }).join(delimiter);
      })).join("\n");
    };
    dsv.formatRows = function(rows) {
      return rows.map(formatRow).join("\n");
    };
    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }
    function formatValue(text) {
      return reFormat.test(text) ? '"' + text.replace(/\"/g, '""') + '"' : text;
    }
    return dsv;
  };
  d3.csv = d3.dsv(",", "text/csv");
  d3.tsv = d3.dsv("	", "text/tab-separated-values");
  var d3_timer_queueHead, d3_timer_queueTail, d3_timer_interval, d3_timer_timeout, d3_timer_active, d3_timer_frame = d3_window[d3_vendorSymbol(d3_window, "requestAnimationFrame")] || function(callback) {
    setTimeout(callback, 17);
  };
  d3.timer = function(callback, delay, then) {
    var n = arguments.length;
    if (n < 2) delay = 0;
    if (n < 3) then = Date.now();
    var time = then + delay, timer = {
      c: callback,
      t: time,
      f: false,
      n: null
    };
    if (d3_timer_queueTail) d3_timer_queueTail.n = timer; else d3_timer_queueHead = timer;
    d3_timer_queueTail = timer;
    if (!d3_timer_interval) {
      d3_timer_timeout = clearTimeout(d3_timer_timeout);
      d3_timer_interval = 1;
      d3_timer_frame(d3_timer_step);
    }
  };
  function d3_timer_step() {
    var now = d3_timer_mark(), delay = d3_timer_sweep() - now;
    if (delay > 24) {
      if (isFinite(delay)) {
        clearTimeout(d3_timer_timeout);
        d3_timer_timeout = setTimeout(d3_timer_step, delay);
      }
      d3_timer_interval = 0;
    } else {
      d3_timer_interval = 1;
      d3_timer_frame(d3_timer_step);
    }
  }
  d3.timer.flush = function() {
    d3_timer_mark();
    d3_timer_sweep();
  };
  function d3_timer_mark() {
    var now = Date.now();
    d3_timer_active = d3_timer_queueHead;
    while (d3_timer_active) {
      if (now >= d3_timer_active.t) d3_timer_active.f = d3_timer_active.c(now - d3_timer_active.t);
      d3_timer_active = d3_timer_active.n;
    }
    return now;
  }
  function d3_timer_sweep() {
    var t0, t1 = d3_timer_queueHead, time = Infinity;
    while (t1) {
      if (t1.f) {
        t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n;
      } else {
        if (t1.t < time) time = t1.t;
        t1 = (t0 = t1).n;
      }
    }
    d3_timer_queueTail = t0;
    return time;
  }
  var d3_format_decimalPoint = ".", d3_format_thousandsSeparator = ",", d3_format_grouping = [ 3, 3 ], d3_format_currencySymbol = "$";
  var d3_formatPrefixes = [ "y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y" ].map(d3_formatPrefix);
  d3.formatPrefix = function(value, precision) {
    var i = 0;
    if (value) {
      if (value < 0) value *= -1;
      if (precision) value = d3.round(value, d3_format_precision(value, precision));
      i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
      i = Math.max(-24, Math.min(24, Math.floor((i <= 0 ? i + 1 : i - 1) / 3) * 3));
    }
    return d3_formatPrefixes[8 + i / 3];
  };
  function d3_formatPrefix(d, i) {
    var k = Math.pow(10, abs(8 - i) * 3);
    return {
      scale: i > 8 ? function(d) {
        return d / k;
      } : function(d) {
        return d * k;
      },
      symbol: d
    };
  }
  d3.round = function(x, n) {
    return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
  };
  d3.format = function(specifier) {
    var match = d3_format_re.exec(specifier), fill = match[1] || " ", align = match[2] || ">", sign = match[3] || "", symbol = match[4] || "", zfill = match[5], width = +match[6], comma = match[7], precision = match[8], type = match[9], scale = 1, suffix = "", integer = false;
    if (precision) precision = +precision.substring(1);
    if (zfill || fill === "0" && align === "=") {
      zfill = fill = "0";
      align = "=";
      if (comma) width -= Math.floor((width - 1) / 4);
    }
    switch (type) {
     case "n":
      comma = true;
      type = "g";
      break;

     case "%":
      scale = 100;
      suffix = "%";
      type = "f";
      break;

     case "p":
      scale = 100;
      suffix = "%";
      type = "r";
      break;

     case "b":
     case "o":
     case "x":
     case "X":
      if (symbol === "#") symbol = "0" + type.toLowerCase();

     case "c":
     case "d":
      integer = true;
      precision = 0;
      break;

     case "s":
      scale = -1;
      type = "r";
      break;
    }
    if (symbol === "#") symbol = ""; else if (symbol === "$") symbol = d3_format_currencySymbol;
    if (type == "r" && !precision) type = "g";
    if (precision != null) {
      if (type == "g") precision = Math.max(1, Math.min(21, precision)); else if (type == "e" || type == "f") precision = Math.max(0, Math.min(20, precision));
    }
    type = d3_format_types.get(type) || d3_format_typeDefault;
    var zcomma = zfill && comma;
    return function(value) {
      if (integer && value % 1) return "";
      var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, "-") : sign;
      if (scale < 0) {
        var prefix = d3.formatPrefix(value, precision);
        value = prefix.scale(value);
        suffix = prefix.symbol;
      } else {
        value *= scale;
      }
      value = type(value, precision);
      var i = value.lastIndexOf("."), before = i < 0 ? value : value.substring(0, i), after = i < 0 ? "" : d3_format_decimalPoint + value.substring(i + 1);
      if (!zfill && comma) before = d3_format_group(before);
      var length = symbol.length + before.length + after.length + (zcomma ? 0 : negative.length), padding = length < width ? new Array(length = width - length + 1).join(fill) : "";
      if (zcomma) before = d3_format_group(padding + before);
      negative += symbol;
      value = before + after;
      return (align === "<" ? negative + value + padding : align === ">" ? padding + negative + value : align === "^" ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + suffix;
    };
  };
  var d3_format_re = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i;
  var d3_format_types = d3.map({
    b: function(x) {
      return x.toString(2);
    },
    c: function(x) {
      return String.fromCharCode(x);
    },
    o: function(x) {
      return x.toString(8);
    },
    x: function(x) {
      return x.toString(16);
    },
    X: function(x) {
      return x.toString(16).toUpperCase();
    },
    g: function(x, p) {
      return x.toPrecision(p);
    },
    e: function(x, p) {
      return x.toExponential(p);
    },
    f: function(x, p) {
      return x.toFixed(p);
    },
    r: function(x, p) {
      return (x = d3.round(x, d3_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, d3_format_precision(x * (1 + 1e-15), p))));
    }
  });
  function d3_format_precision(x, p) {
    return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);
  }
  function d3_format_typeDefault(x) {
    return x + "";
  }
  var d3_format_group = d3_identity;
  if (d3_format_grouping) {
    var d3_format_groupingLength = d3_format_grouping.length;
    d3_format_group = function(value) {
      var i = value.length, t = [], j = 0, g = d3_format_grouping[0];
      while (i > 0 && g > 0) {
        t.push(value.substring(i -= g, i + g));
        g = d3_format_grouping[j = (j + 1) % d3_format_groupingLength];
      }
      return t.reverse().join(d3_format_thousandsSeparator);
    };
  }
  d3.geo = {};
  function d3_adder() {}
  d3_adder.prototype = {
    s: 0,
    t: 0,
    add: function(y) {
      d3_adderSum(y, this.t, d3_adderTemp);
      d3_adderSum(d3_adderTemp.s, this.s, this);
      if (this.s) this.t += d3_adderTemp.t; else this.s = d3_adderTemp.t;
    },
    reset: function() {
      this.s = this.t = 0;
    },
    valueOf: function() {
      return this.s;
    }
  };
  var d3_adderTemp = new d3_adder();
  function d3_adderSum(a, b, o) {
    var x = o.s = a + b, bv = x - a, av = x - bv;
    o.t = a - av + (b - bv);
  }
  d3.geo.stream = function(object, listener) {
    if (object && d3_geo_streamObjectType.hasOwnProperty(object.type)) {
      d3_geo_streamObjectType[object.type](object, listener);
    } else {
      d3_geo_streamGeometry(object, listener);
    }
  };
  function d3_geo_streamGeometry(geometry, listener) {
    if (geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type)) {
      d3_geo_streamGeometryType[geometry.type](geometry, listener);
    }
  }
  var d3_geo_streamObjectType = {
    Feature: function(feature, listener) {
      d3_geo_streamGeometry(feature.geometry, listener);
    },
    FeatureCollection: function(object, listener) {
      var features = object.features, i = -1, n = features.length;
      while (++i < n) d3_geo_streamGeometry(features[i].geometry, listener);
    }
  };
  var d3_geo_streamGeometryType = {
    Sphere: function(object, listener) {
      listener.sphere();
    },
    Point: function(object, listener) {
      object = object.coordinates;
      listener.point(object[0], object[1], object[2]);
    },
    MultiPoint: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) object = coordinates[i], listener.point(object[0], object[1], object[2]);
    },
    LineString: function(object, listener) {
      d3_geo_streamLine(object.coordinates, listener, 0);
    },
    MultiLineString: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) d3_geo_streamLine(coordinates[i], listener, 0);
    },
    Polygon: function(object, listener) {
      d3_geo_streamPolygon(object.coordinates, listener);
    },
    MultiPolygon: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) d3_geo_streamPolygon(coordinates[i], listener);
    },
    GeometryCollection: function(object, listener) {
      var geometries = object.geometries, i = -1, n = geometries.length;
      while (++i < n) d3_geo_streamGeometry(geometries[i], listener);
    }
  };
  function d3_geo_streamLine(coordinates, listener, closed) {
    var i = -1, n = coordinates.length - closed, coordinate;
    listener.lineStart();
    while (++i < n) coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1], coordinate[2]);
    listener.lineEnd();
  }
  function d3_geo_streamPolygon(coordinates, listener) {
    var i = -1, n = coordinates.length;
    listener.polygonStart();
    while (++i < n) d3_geo_streamLine(coordinates[i], listener, 1);
    listener.polygonEnd();
  }
  d3.geo.area = function(object) {
    d3_geo_areaSum = 0;
    d3.geo.stream(object, d3_geo_area);
    return d3_geo_areaSum;
  };
  var d3_geo_areaSum, d3_geo_areaRingSum = new d3_adder();
  var d3_geo_area = {
    sphere: function() {
      d3_geo_areaSum += 4 * π;
    },
    point: d3_noop,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: function() {
      d3_geo_areaRingSum.reset();
      d3_geo_area.lineStart = d3_geo_areaRingStart;
    },
    polygonEnd: function() {
      var area = 2 * d3_geo_areaRingSum;
      d3_geo_areaSum += area < 0 ? 4 * π + area : area;
      d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop;
    }
  };
  function d3_geo_areaRingStart() {
    var λ00, φ00, λ0, cosφ0, sinφ0;
    d3_geo_area.point = function(λ, φ) {
      d3_geo_area.point = nextPoint;
      λ0 = (λ00 = λ) * d3_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4), 
      sinφ0 = Math.sin(φ);
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      φ = φ * d3_radians / 2 + π / 4;
      var dλ = λ - λ0, cosφ = Math.cos(φ), sinφ = Math.sin(φ), k = sinφ0 * sinφ, u = cosφ0 * cosφ + k * Math.cos(dλ), v = k * Math.sin(dλ);
      d3_geo_areaRingSum.add(Math.atan2(v, u));
      λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ;
    }
    d3_geo_area.lineEnd = function() {
      nextPoint(λ00, φ00);
    };
  }
  function d3_geo_cartesian(spherical) {
    var λ = spherical[0], φ = spherical[1], cosφ = Math.cos(φ);
    return [ cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ) ];
  }
  function d3_geo_cartesianDot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function d3_geo_cartesianCross(a, b) {
    return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ];
  }
  function d3_geo_cartesianAdd(a, b) {
    a[0] += b[0];
    a[1] += b[1];
    a[2] += b[2];
  }
  function d3_geo_cartesianScale(vector, k) {
    return [ vector[0] * k, vector[1] * k, vector[2] * k ];
  }
  function d3_geo_cartesianNormalize(d) {
    var l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
    d[0] /= l;
    d[1] /= l;
    d[2] /= l;
  }
  function d3_geo_spherical(cartesian) {
    return [ Math.atan2(cartesian[1], cartesian[0]), d3_asin(cartesian[2]) ];
  }
  function d3_geo_sphericalEqual(a, b) {
    return abs(a[0] - b[0]) < ε && abs(a[1] - b[1]) < ε;
  }
  d3.geo.bounds = function() {
    var λ0, φ0, λ1, φ1, λ_, λ__, φ__, p0, dλSum, ranges, range;
    var bound = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() {
        bound.point = ringPoint;
        bound.lineStart = ringStart;
        bound.lineEnd = ringEnd;
        dλSum = 0;
        d3_geo_area.polygonStart();
      },
      polygonEnd: function() {
        d3_geo_area.polygonEnd();
        bound.point = point;
        bound.lineStart = lineStart;
        bound.lineEnd = lineEnd;
        if (d3_geo_areaRingSum < 0) λ0 = -(λ1 = 180), φ0 = -(φ1 = 90); else if (dλSum > ε) φ1 = 90; else if (dλSum < -ε) φ0 = -90;
        range[0] = λ0, range[1] = λ1;
      }
    };
    function point(λ, φ) {
      ranges.push(range = [ λ0 = λ, λ1 = λ ]);
      if (φ < φ0) φ0 = φ;
      if (φ > φ1) φ1 = φ;
    }
    function linePoint(λ, φ) {
      var p = d3_geo_cartesian([ λ * d3_radians, φ * d3_radians ]);
      if (p0) {
        var normal = d3_geo_cartesianCross(p0, p), equatorial = [ normal[1], -normal[0], 0 ], inflection = d3_geo_cartesianCross(equatorial, normal);
        d3_geo_cartesianNormalize(inflection);
        inflection = d3_geo_spherical(inflection);
        var dλ = λ - λ_, s = dλ > 0 ? 1 : -1, λi = inflection[0] * d3_degrees * s, antimeridian = abs(dλ) > 180;
        if (antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
          var φi = inflection[1] * d3_degrees;
          if (φi > φ1) φ1 = φi;
        } else if (λi = (λi + 360) % 360 - 180, antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
          var φi = -inflection[1] * d3_degrees;
          if (φi < φ0) φ0 = φi;
        } else {
          if (φ < φ0) φ0 = φ;
          if (φ > φ1) φ1 = φ;
        }
        if (antimeridian) {
          if (λ < λ_) {
            if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
          } else {
            if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
          }
        } else {
          if (λ1 >= λ0) {
            if (λ < λ0) λ0 = λ;
            if (λ > λ1) λ1 = λ;
          } else {
            if (λ > λ_) {
              if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
            } else {
              if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
            }
          }
        }
      } else {
        point(λ, φ);
      }
      p0 = p, λ_ = λ;
    }
    function lineStart() {
      bound.point = linePoint;
    }
    function lineEnd() {
      range[0] = λ0, range[1] = λ1;
      bound.point = point;
      p0 = null;
    }
    function ringPoint(λ, φ) {
      if (p0) {
        var dλ = λ - λ_;
        dλSum += abs(dλ) > 180 ? dλ + (dλ > 0 ? 360 : -360) : dλ;
      } else λ__ = λ, φ__ = φ;
      d3_geo_area.point(λ, φ);
      linePoint(λ, φ);
    }
    function ringStart() {
      d3_geo_area.lineStart();
    }
    function ringEnd() {
      ringPoint(λ__, φ__);
      d3_geo_area.lineEnd();
      if (abs(dλSum) > ε) λ0 = -(λ1 = 180);
      range[0] = λ0, range[1] = λ1;
      p0 = null;
    }
    function angle(λ0, λ1) {
      return (λ1 -= λ0) < 0 ? λ1 + 360 : λ1;
    }
    function compareRanges(a, b) {
      return a[0] - b[0];
    }
    function withinRange(x, range) {
      return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
    }
    return function(feature) {
      φ1 = λ1 = -(λ0 = φ0 = Infinity);
      ranges = [];
      d3.geo.stream(feature, bound);
      var n = ranges.length;
      if (n) {
        ranges.sort(compareRanges);
        for (var i = 1, a = ranges[0], b, merged = [ a ]; i < n; ++i) {
          b = ranges[i];
          if (withinRange(b[0], a) || withinRange(b[1], a)) {
            if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
            if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
          } else {
            merged.push(a = b);
          }
        }
        var best = -Infinity, dλ;
        for (var n = merged.length - 1, i = 0, a = merged[n], b; i <= n; a = b, ++i) {
          b = merged[i];
          if ((dλ = angle(a[1], b[0])) > best) best = dλ, λ0 = b[0], λ1 = a[1];
        }
      }
      ranges = range = null;
      return λ0 === Infinity || φ0 === Infinity ? [ [ NaN, NaN ], [ NaN, NaN ] ] : [ [ λ0, φ0 ], [ λ1, φ1 ] ];
    };
  }();
  d3.geo.centroid = function(object) {
    d3_geo_centroidW0 = d3_geo_centroidW1 = d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
    d3.geo.stream(object, d3_geo_centroid);
    var x = d3_geo_centroidX2, y = d3_geo_centroidY2, z = d3_geo_centroidZ2, m = x * x + y * y + z * z;
    if (m < ε2) {
      x = d3_geo_centroidX1, y = d3_geo_centroidY1, z = d3_geo_centroidZ1;
      if (d3_geo_centroidW1 < ε) x = d3_geo_centroidX0, y = d3_geo_centroidY0, z = d3_geo_centroidZ0;
      m = x * x + y * y + z * z;
      if (m < ε2) return [ NaN, NaN ];
    }
    return [ Math.atan2(y, x) * d3_degrees, d3_asin(z / Math.sqrt(m)) * d3_degrees ];
  };
  var d3_geo_centroidW0, d3_geo_centroidW1, d3_geo_centroidX0, d3_geo_centroidY0, d3_geo_centroidZ0, d3_geo_centroidX1, d3_geo_centroidY1, d3_geo_centroidZ1, d3_geo_centroidX2, d3_geo_centroidY2, d3_geo_centroidZ2;
  var d3_geo_centroid = {
    sphere: d3_noop,
    point: d3_geo_centroidPoint,
    lineStart: d3_geo_centroidLineStart,
    lineEnd: d3_geo_centroidLineEnd,
    polygonStart: function() {
      d3_geo_centroid.lineStart = d3_geo_centroidRingStart;
    },
    polygonEnd: function() {
      d3_geo_centroid.lineStart = d3_geo_centroidLineStart;
    }
  };
  function d3_geo_centroidPoint(λ, φ) {
    λ *= d3_radians;
    var cosφ = Math.cos(φ *= d3_radians);
    d3_geo_centroidPointXYZ(cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ));
  }
  function d3_geo_centroidPointXYZ(x, y, z) {
    ++d3_geo_centroidW0;
    d3_geo_centroidX0 += (x - d3_geo_centroidX0) / d3_geo_centroidW0;
    d3_geo_centroidY0 += (y - d3_geo_centroidY0) / d3_geo_centroidW0;
    d3_geo_centroidZ0 += (z - d3_geo_centroidZ0) / d3_geo_centroidW0;
  }
  function d3_geo_centroidLineStart() {
    var x0, y0, z0;
    d3_geo_centroid.point = function(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians);
      x0 = cosφ * Math.cos(λ);
      y0 = cosφ * Math.sin(λ);
      z0 = Math.sin(φ);
      d3_geo_centroid.point = nextPoint;
      d3_geo_centroidPointXYZ(x0, y0, z0);
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), w = Math.atan2(Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
      d3_geo_centroidW1 += w;
      d3_geo_centroidX1 += w * (x0 + (x0 = x));
      d3_geo_centroidY1 += w * (y0 + (y0 = y));
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
      d3_geo_centroidPointXYZ(x0, y0, z0);
    }
  }
  function d3_geo_centroidLineEnd() {
    d3_geo_centroid.point = d3_geo_centroidPoint;
  }
  function d3_geo_centroidRingStart() {
    var λ00, φ00, x0, y0, z0;
    d3_geo_centroid.point = function(λ, φ) {
      λ00 = λ, φ00 = φ;
      d3_geo_centroid.point = nextPoint;
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians);
      x0 = cosφ * Math.cos(λ);
      y0 = cosφ * Math.sin(λ);
      z0 = Math.sin(φ);
      d3_geo_centroidPointXYZ(x0, y0, z0);
    };
    d3_geo_centroid.lineEnd = function() {
      nextPoint(λ00, φ00);
      d3_geo_centroid.lineEnd = d3_geo_centroidLineEnd;
      d3_geo_centroid.point = d3_geo_centroidPoint;
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), cx = y0 * z - z0 * y, cy = z0 * x - x0 * z, cz = x0 * y - y0 * x, m = Math.sqrt(cx * cx + cy * cy + cz * cz), u = x0 * x + y0 * y + z0 * z, v = m && -d3_acos(u) / m, w = Math.atan2(m, u);
      d3_geo_centroidX2 += v * cx;
      d3_geo_centroidY2 += v * cy;
      d3_geo_centroidZ2 += v * cz;
      d3_geo_centroidW1 += w;
      d3_geo_centroidX1 += w * (x0 + (x0 = x));
      d3_geo_centroidY1 += w * (y0 + (y0 = y));
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
      d3_geo_centroidPointXYZ(x0, y0, z0);
    }
  }
  function d3_true() {
    return true;
  }
  function d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener) {
    var subject = [], clip = [];
    segments.forEach(function(segment) {
      if ((n = segment.length - 1) <= 0) return;
      var n, p0 = segment[0], p1 = segment[n];
      if (d3_geo_sphericalEqual(p0, p1)) {
        listener.lineStart();
        for (var i = 0; i < n; ++i) listener.point((p0 = segment[i])[0], p0[1]);
        listener.lineEnd();
        return;
      }
      var a = new d3_geo_clipPolygonIntersection(p0, segment, null, true), b = new d3_geo_clipPolygonIntersection(p0, null, a, false);
      a.o = b;
      subject.push(a);
      clip.push(b);
      a = new d3_geo_clipPolygonIntersection(p1, segment, null, false);
      b = new d3_geo_clipPolygonIntersection(p1, null, a, true);
      a.o = b;
      subject.push(a);
      clip.push(b);
    });
    clip.sort(compare);
    d3_geo_clipPolygonLinkCircular(subject);
    d3_geo_clipPolygonLinkCircular(clip);
    if (!subject.length) return;
    for (var i = 0, entry = clipStartInside, n = clip.length; i < n; ++i) {
      clip[i].e = entry = !entry;
    }
    var start = subject[0], points, point;
    while (1) {
      var current = start, isSubject = true;
      while (current.v) if ((current = current.n) === start) return;
      points = current.z;
      listener.lineStart();
      do {
        current.v = current.o.v = true;
        if (current.e) {
          if (isSubject) {
            for (var i = 0, n = points.length; i < n; ++i) listener.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.n.x, 1, listener);
          }
          current = current.n;
        } else {
          if (isSubject) {
            points = current.p.z;
            for (var i = points.length - 1; i >= 0; --i) listener.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.p.x, -1, listener);
          }
          current = current.p;
        }
        current = current.o;
        points = current.z;
        isSubject = !isSubject;
      } while (!current.v);
      listener.lineEnd();
    }
  }
  function d3_geo_clipPolygonLinkCircular(array) {
    if (!(n = array.length)) return;
    var n, i = 0, a = array[0], b;
    while (++i < n) {
      a.n = b = array[i];
      b.p = a;
      a = b;
    }
    a.n = b = array[0];
    b.p = a;
  }
  function d3_geo_clipPolygonIntersection(point, points, other, entry) {
    this.x = point;
    this.z = points;
    this.o = other;
    this.e = entry;
    this.v = false;
    this.n = this.p = null;
  }
  function d3_geo_clip(pointVisible, clipLine, interpolate, clipStart) {
    return function(rotate, listener) {
      var line = clipLine(listener), rotatedClipStart = rotate.invert(clipStart[0], clipStart[1]);
      var clip = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          clip.point = pointRing;
          clip.lineStart = ringStart;
          clip.lineEnd = ringEnd;
          segments = [];
          polygon = [];
          listener.polygonStart();
        },
        polygonEnd: function() {
          clip.point = point;
          clip.lineStart = lineStart;
          clip.lineEnd = lineEnd;
          segments = d3.merge(segments);
          var clipStartInside = d3_geo_pointInPolygon(rotatedClipStart, polygon);
          if (segments.length) {
            d3_geo_clipPolygon(segments, d3_geo_clipSort, clipStartInside, interpolate, listener);
          } else if (clipStartInside) {
            listener.lineStart();
            interpolate(null, null, 1, listener);
            listener.lineEnd();
          }
          listener.polygonEnd();
          segments = polygon = null;
        },
        sphere: function() {
          listener.polygonStart();
          listener.lineStart();
          interpolate(null, null, 1, listener);
          listener.lineEnd();
          listener.polygonEnd();
        }
      };
      function point(λ, φ) {
        var point = rotate(λ, φ);
        if (pointVisible(λ = point[0], φ = point[1])) listener.point(λ, φ);
      }
      function pointLine(λ, φ) {
        var point = rotate(λ, φ);
        line.point(point[0], point[1]);
      }
      function lineStart() {
        clip.point = pointLine;
        line.lineStart();
      }
      function lineEnd() {
        clip.point = point;
        line.lineEnd();
      }
      var segments;
      var buffer = d3_geo_clipBufferListener(), ringListener = clipLine(buffer), polygon, ring;
      function pointRing(λ, φ) {
        ring.push([ λ, φ ]);
        var point = rotate(λ, φ);
        ringListener.point(point[0], point[1]);
      }
      function ringStart() {
        ringListener.lineStart();
        ring = [];
      }
      function ringEnd() {
        pointRing(ring[0][0], ring[0][1]);
        ringListener.lineEnd();
        var clean = ringListener.clean(), ringSegments = buffer.buffer(), segment, n = ringSegments.length;
        ring.pop();
        polygon.push(ring);
        ring = null;
        if (!n) return;
        if (clean & 1) {
          segment = ringSegments[0];
          var n = segment.length - 1, i = -1, point;
          listener.lineStart();
          while (++i < n) listener.point((point = segment[i])[0], point[1]);
          listener.lineEnd();
          return;
        }
        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));
        segments.push(ringSegments.filter(d3_geo_clipSegmentLength1));
      }
      return clip;
    };
  }
  function d3_geo_clipSegmentLength1(segment) {
    return segment.length > 1;
  }
  function d3_geo_clipBufferListener() {
    var lines = [], line;
    return {
      lineStart: function() {
        lines.push(line = []);
      },
      point: function(λ, φ) {
        line.push([ λ, φ ]);
      },
      lineEnd: d3_noop,
      buffer: function() {
        var buffer = lines;
        lines = [];
        line = null;
        return buffer;
      },
      rejoin: function() {
        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
      }
    };
  }
  function d3_geo_clipSort(a, b) {
    return ((a = a.x)[0] < 0 ? a[1] - halfπ - ε : halfπ - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfπ - ε : halfπ - b[1]);
  }
  function d3_geo_pointInPolygon(point, polygon) {
    var meridian = point[0], parallel = point[1], meridianNormal = [ Math.sin(meridian), -Math.cos(meridian), 0 ], polarAngle = 0, winding = 0;
    d3_geo_areaRingSum.reset();
    for (var i = 0, n = polygon.length; i < n; ++i) {
      var ring = polygon[i], m = ring.length;
      if (!m) continue;
      var point0 = ring[0], λ0 = point0[0], φ0 = point0[1] / 2 + π / 4, sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), j = 1;
      while (true) {
        if (j === m) j = 0;
        point = ring[j];
        var λ = point[0], φ = point[1] / 2 + π / 4, sinφ = Math.sin(φ), cosφ = Math.cos(φ), dλ = λ - λ0, antimeridian = abs(dλ) > π, k = sinφ0 * sinφ;
        d3_geo_areaRingSum.add(Math.atan2(k * Math.sin(dλ), cosφ0 * cosφ + k * Math.cos(dλ)));
        polarAngle += antimeridian ? dλ + (dλ >= 0 ? τ : -τ) : dλ;
        if (antimeridian ^ λ0 >= meridian ^ λ >= meridian) {
          var arc = d3_geo_cartesianCross(d3_geo_cartesian(point0), d3_geo_cartesian(point));
          d3_geo_cartesianNormalize(arc);
          var intersection = d3_geo_cartesianCross(meridianNormal, arc);
          d3_geo_cartesianNormalize(intersection);
          var φarc = (antimeridian ^ dλ >= 0 ? -1 : 1) * d3_asin(intersection[2]);
          if (parallel > φarc || parallel === φarc && (arc[0] || arc[1])) {
            winding += antimeridian ^ dλ >= 0 ? 1 : -1;
          }
        }
        if (!j++) break;
        λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ, point0 = point;
      }
    }
    return (polarAngle < -ε || polarAngle < ε && d3_geo_areaRingSum < 0) ^ winding & 1;
  }
  var d3_geo_clipAntimeridian = d3_geo_clip(d3_true, d3_geo_clipAntimeridianLine, d3_geo_clipAntimeridianInterpolate, [ -π, -π / 2 ]);
  function d3_geo_clipAntimeridianLine(listener) {
    var λ0 = NaN, φ0 = NaN, sλ0 = NaN, clean;
    return {
      lineStart: function() {
        listener.lineStart();
        clean = 1;
      },
      point: function(λ1, φ1) {
        var sλ1 = λ1 > 0 ? π : -π, dλ = abs(λ1 - λ0);
        if (abs(dλ - π) < ε) {
          listener.point(λ0, φ0 = (φ0 + φ1) / 2 > 0 ? halfπ : -halfπ);
          listener.point(sλ0, φ0);
          listener.lineEnd();
          listener.lineStart();
          listener.point(sλ1, φ0);
          listener.point(λ1, φ0);
          clean = 0;
        } else if (sλ0 !== sλ1 && dλ >= π) {
          if (abs(λ0 - sλ0) < ε) λ0 -= sλ0 * ε;
          if (abs(λ1 - sλ1) < ε) λ1 -= sλ1 * ε;
          φ0 = d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1);
          listener.point(sλ0, φ0);
          listener.lineEnd();
          listener.lineStart();
          listener.point(sλ1, φ0);
          clean = 0;
        }
        listener.point(λ0 = λ1, φ0 = φ1);
        sλ0 = sλ1;
      },
      lineEnd: function() {
        listener.lineEnd();
        λ0 = φ0 = NaN;
      },
      clean: function() {
        return 2 - clean;
      }
    };
  }
  function d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1) {
    var cosφ0, cosφ1, sinλ0_λ1 = Math.sin(λ0 - λ1);
    return abs(sinλ0_λ1) > ε ? Math.atan((Math.sin(φ0) * (cosφ1 = Math.cos(φ1)) * Math.sin(λ1) - Math.sin(φ1) * (cosφ0 = Math.cos(φ0)) * Math.sin(λ0)) / (cosφ0 * cosφ1 * sinλ0_λ1)) : (φ0 + φ1) / 2;
  }
  function d3_geo_clipAntimeridianInterpolate(from, to, direction, listener) {
    var φ;
    if (from == null) {
      φ = direction * halfπ;
      listener.point(-π, φ);
      listener.point(0, φ);
      listener.point(π, φ);
      listener.point(π, 0);
      listener.point(π, -φ);
      listener.point(0, -φ);
      listener.point(-π, -φ);
      listener.point(-π, 0);
      listener.point(-π, φ);
    } else if (abs(from[0] - to[0]) > ε) {
      var s = from[0] < to[0] ? π : -π;
      φ = direction * s / 2;
      listener.point(-s, φ);
      listener.point(0, φ);
      listener.point(s, φ);
    } else {
      listener.point(to[0], to[1]);
    }
  }
  function d3_geo_clipCircle(radius) {
    var cr = Math.cos(radius), smallRadius = cr > 0, notHemisphere = abs(cr) > ε, interpolate = d3_geo_circleInterpolate(radius, 6 * d3_radians);
    return d3_geo_clip(visible, clipLine, interpolate, smallRadius ? [ 0, -radius ] : [ -π, radius - π ]);
    function visible(λ, φ) {
      return Math.cos(λ) * Math.cos(φ) > cr;
    }
    function clipLine(listener) {
      var point0, c0, v0, v00, clean;
      return {
        lineStart: function() {
          v00 = v0 = false;
          clean = 1;
        },
        point: function(λ, φ) {
          var point1 = [ λ, φ ], point2, v = visible(λ, φ), c = smallRadius ? v ? 0 : code(λ, φ) : v ? code(λ + (λ < 0 ? π : -π), φ) : 0;
          if (!point0 && (v00 = v0 = v)) listener.lineStart();
          if (v !== v0) {
            point2 = intersect(point0, point1);
            if (d3_geo_sphericalEqual(point0, point2) || d3_geo_sphericalEqual(point1, point2)) {
              point1[0] += ε;
              point1[1] += ε;
              v = visible(point1[0], point1[1]);
            }
          }
          if (v !== v0) {
            clean = 0;
            if (v) {
              listener.lineStart();
              point2 = intersect(point1, point0);
              listener.point(point2[0], point2[1]);
            } else {
              point2 = intersect(point0, point1);
              listener.point(point2[0], point2[1]);
              listener.lineEnd();
            }
            point0 = point2;
          } else if (notHemisphere && point0 && smallRadius ^ v) {
            var t;
            if (!(c & c0) && (t = intersect(point1, point0, true))) {
              clean = 0;
              if (smallRadius) {
                listener.lineStart();
                listener.point(t[0][0], t[0][1]);
                listener.point(t[1][0], t[1][1]);
                listener.lineEnd();
              } else {
                listener.point(t[1][0], t[1][1]);
                listener.lineEnd();
                listener.lineStart();
                listener.point(t[0][0], t[0][1]);
              }
            }
          }
          if (v && (!point0 || !d3_geo_sphericalEqual(point0, point1))) {
            listener.point(point1[0], point1[1]);
          }
          point0 = point1, v0 = v, c0 = c;
        },
        lineEnd: function() {
          if (v0) listener.lineEnd();
          point0 = null;
        },
        clean: function() {
          return clean | (v00 && v0) << 1;
        }
      };
    }
    function intersect(a, b, two) {
      var pa = d3_geo_cartesian(a), pb = d3_geo_cartesian(b);
      var n1 = [ 1, 0, 0 ], n2 = d3_geo_cartesianCross(pa, pb), n2n2 = d3_geo_cartesianDot(n2, n2), n1n2 = n2[0], determinant = n2n2 - n1n2 * n1n2;
      if (!determinant) return !two && a;
      var c1 = cr * n2n2 / determinant, c2 = -cr * n1n2 / determinant, n1xn2 = d3_geo_cartesianCross(n1, n2), A = d3_geo_cartesianScale(n1, c1), B = d3_geo_cartesianScale(n2, c2);
      d3_geo_cartesianAdd(A, B);
      var u = n1xn2, w = d3_geo_cartesianDot(A, u), uu = d3_geo_cartesianDot(u, u), t2 = w * w - uu * (d3_geo_cartesianDot(A, A) - 1);
      if (t2 < 0) return;
      var t = Math.sqrt(t2), q = d3_geo_cartesianScale(u, (-w - t) / uu);
      d3_geo_cartesianAdd(q, A);
      q = d3_geo_spherical(q);
      if (!two) return q;
      var λ0 = a[0], λ1 = b[0], φ0 = a[1], φ1 = b[1], z;
      if (λ1 < λ0) z = λ0, λ0 = λ1, λ1 = z;
      var δλ = λ1 - λ0, polar = abs(δλ - π) < ε, meridian = polar || δλ < ε;
      if (!polar && φ1 < φ0) z = φ0, φ0 = φ1, φ1 = z;
      if (meridian ? polar ? φ0 + φ1 > 0 ^ q[1] < (abs(q[0] - λ0) < ε ? φ0 : φ1) : φ0 <= q[1] && q[1] <= φ1 : δλ > π ^ (λ0 <= q[0] && q[0] <= λ1)) {
        var q1 = d3_geo_cartesianScale(u, (-w + t) / uu);
        d3_geo_cartesianAdd(q1, A);
        return [ q, d3_geo_spherical(q1) ];
      }
    }
    function code(λ, φ) {
      var r = smallRadius ? radius : π - radius, code = 0;
      if (λ < -r) code |= 1; else if (λ > r) code |= 2;
      if (φ < -r) code |= 4; else if (φ > r) code |= 8;
      return code;
    }
  }
  function d3_geom_clipLine(x0, y0, x1, y1) {
    return function(line) {
      var a = line.a, b = line.b, ax = a.x, ay = a.y, bx = b.x, by = b.y, t0 = 0, t1 = 1, dx = bx - ax, dy = by - ay, r;
      r = x0 - ax;
      if (!dx && r > 0) return;
      r /= dx;
      if (dx < 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      } else if (dx > 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      }
      r = x1 - ax;
      if (!dx && r < 0) return;
      r /= dx;
      if (dx < 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      } else if (dx > 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      }
      r = y0 - ay;
      if (!dy && r > 0) return;
      r /= dy;
      if (dy < 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      } else if (dy > 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      }
      r = y1 - ay;
      if (!dy && r < 0) return;
      r /= dy;
      if (dy < 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      } else if (dy > 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      }
      if (t0 > 0) line.a = {
        x: ax + t0 * dx,
        y: ay + t0 * dy
      };
      if (t1 < 1) line.b = {
        x: ax + t1 * dx,
        y: ay + t1 * dy
      };
      return line;
    };
  }
  var d3_geo_clipExtentMAX = 1e9;
  d3.geo.clipExtent = function() {
    var x0, y0, x1, y1, stream, clip, clipExtent = {
      stream: function(output) {
        if (stream) stream.valid = false;
        stream = clip(output);
        stream.valid = true;
        return stream;
      },
      extent: function(_) {
        if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
        clip = d3_geo_clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]);
        if (stream) stream.valid = false, stream = null;
        return clipExtent;
      }
    };
    return clipExtent.extent([ [ 0, 0 ], [ 960, 500 ] ]);
  };
  function d3_geo_clipExtent(x0, y0, x1, y1) {
    return function(listener) {
      var listener_ = listener, bufferListener = d3_geo_clipBufferListener(), clipLine = d3_geom_clipLine(x0, y0, x1, y1), segments, polygon, ring;
      var clip = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          listener = bufferListener;
          segments = [];
          polygon = [];
          clean = true;
        },
        polygonEnd: function() {
          listener = listener_;
          segments = d3.merge(segments);
          var clipStartInside = insidePolygon([ x0, y1 ]), inside = clean && clipStartInside, visible = segments.length;
          if (inside || visible) {
            listener.polygonStart();
            if (inside) {
              listener.lineStart();
              interpolate(null, null, 1, listener);
              listener.lineEnd();
            }
            if (visible) {
              d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener);
            }
            listener.polygonEnd();
          }
          segments = polygon = ring = null;
        }
      };
      function insidePolygon(p) {
        var wn = 0, n = polygon.length, y = p[1];
        for (var i = 0; i < n; ++i) {
          for (var j = 1, v = polygon[i], m = v.length, a = v[0], b; j < m; ++j) {
            b = v[j];
            if (a[1] <= y) {
              if (b[1] > y && isLeft(a, b, p) > 0) ++wn;
            } else {
              if (b[1] <= y && isLeft(a, b, p) < 0) --wn;
            }
            a = b;
          }
        }
        return wn !== 0;
      }
      function isLeft(a, b, c) {
        return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
      }
      function interpolate(from, to, direction, listener) {
        var a = 0, a1 = 0;
        if (from == null || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoints(from, to) < 0 ^ direction > 0) {
          do {
            listener.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
          } while ((a = (a + direction + 4) % 4) !== a1);
        } else {
          listener.point(to[0], to[1]);
        }
      }
      function pointVisible(x, y) {
        return x0 <= x && x <= x1 && y0 <= y && y <= y1;
      }
      function point(x, y) {
        if (pointVisible(x, y)) listener.point(x, y);
      }
      var x__, y__, v__, x_, y_, v_, first, clean;
      function lineStart() {
        clip.point = linePoint;
        if (polygon) polygon.push(ring = []);
        first = true;
        v_ = false;
        x_ = y_ = NaN;
      }
      function lineEnd() {
        if (segments) {
          linePoint(x__, y__);
          if (v__ && v_) bufferListener.rejoin();
          segments.push(bufferListener.buffer());
        }
        clip.point = point;
        if (v_) listener.lineEnd();
      }
      function linePoint(x, y) {
        x = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, x));
        y = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, y));
        var v = pointVisible(x, y);
        if (polygon) ring.push([ x, y ]);
        if (first) {
          x__ = x, y__ = y, v__ = v;
          first = false;
          if (v) {
            listener.lineStart();
            listener.point(x, y);
          }
        } else {
          if (v && v_) listener.point(x, y); else {
            var l = {
              a: {
                x: x_,
                y: y_
              },
              b: {
                x: x,
                y: y
              }
            };
            if (clipLine(l)) {
              if (!v_) {
                listener.lineStart();
                listener.point(l.a.x, l.a.y);
              }
              listener.point(l.b.x, l.b.y);
              if (!v) listener.lineEnd();
              clean = false;
            } else if (v) {
              listener.lineStart();
              listener.point(x, y);
              clean = false;
            }
          }
        }
        x_ = x, y_ = y, v_ = v;
      }
      return clip;
    };
    function corner(p, direction) {
      return abs(p[0] - x0) < ε ? direction > 0 ? 0 : 3 : abs(p[0] - x1) < ε ? direction > 0 ? 2 : 1 : abs(p[1] - y0) < ε ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2;
    }
    function compare(a, b) {
      return comparePoints(a.x, b.x);
    }
    function comparePoints(a, b) {
      var ca = corner(a, 1), cb = corner(b, 1);
      return ca !== cb ? ca - cb : ca === 0 ? b[1] - a[1] : ca === 1 ? a[0] - b[0] : ca === 2 ? a[1] - b[1] : b[0] - a[0];
    }
  }
  function d3_geo_compose(a, b) {
    function compose(x, y) {
      return x = a(x, y), b(x[0], x[1]);
    }
    if (a.invert && b.invert) compose.invert = function(x, y) {
      return x = b.invert(x, y), x && a.invert(x[0], x[1]);
    };
    return compose;
  }
  function d3_geo_conic(projectAt) {
    var φ0 = 0, φ1 = π / 3, m = d3_geo_projectionMutator(projectAt), p = m(φ0, φ1);
    p.parallels = function(_) {
      if (!arguments.length) return [ φ0 / π * 180, φ1 / π * 180 ];
      return m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180);
    };
    return p;
  }
  function d3_geo_conicEqualArea(φ0, φ1) {
    var sinφ0 = Math.sin(φ0), n = (sinφ0 + Math.sin(φ1)) / 2, C = 1 + sinφ0 * (2 * n - sinφ0), ρ0 = Math.sqrt(C) / n;
    function forward(λ, φ) {
      var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n;
      return [ ρ * Math.sin(λ *= n), ρ0 - ρ * Math.cos(λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = ρ0 - y;
      return [ Math.atan2(x, ρ0_y) / n, d3_asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n)) ];
    };
    return forward;
  }
  (d3.geo.conicEqualArea = function() {
    return d3_geo_conic(d3_geo_conicEqualArea);
  }).raw = d3_geo_conicEqualArea;
  d3.geo.albers = function() {
    return d3.geo.conicEqualArea().rotate([ 96, 0 ]).center([ -.6, 38.7 ]).parallels([ 29.5, 45.5 ]).scale(1070);
  };
  d3.geo.albersUsa = function() {
    var lower48 = d3.geo.albers();
    var alaska = d3.geo.conicEqualArea().rotate([ 154, 0 ]).center([ -2, 58.5 ]).parallels([ 55, 65 ]);
    var hawaii = d3.geo.conicEqualArea().rotate([ 157, 0 ]).center([ -3, 19.9 ]).parallels([ 8, 18 ]);
    var point, pointStream = {
      point: function(x, y) {
        point = [ x, y ];
      }
    }, lower48Point, alaskaPoint, hawaiiPoint;
    function albersUsa(coordinates) {
      var x = coordinates[0], y = coordinates[1];
      point = null;
      (lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y);
      return point;
    }
    albersUsa.invert = function(coordinates) {
      var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k;
      return (y >= .12 && y < .234 && x >= -.425 && x < -.214 ? alaska : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii : lower48).invert(coordinates);
    };
    albersUsa.stream = function(stream) {
      var lower48Stream = lower48.stream(stream), alaskaStream = alaska.stream(stream), hawaiiStream = hawaii.stream(stream);
      return {
        point: function(x, y) {
          lower48Stream.point(x, y);
          alaskaStream.point(x, y);
          hawaiiStream.point(x, y);
        },
        sphere: function() {
          lower48Stream.sphere();
          alaskaStream.sphere();
          hawaiiStream.sphere();
        },
        lineStart: function() {
          lower48Stream.lineStart();
          alaskaStream.lineStart();
          hawaiiStream.lineStart();
        },
        lineEnd: function() {
          lower48Stream.lineEnd();
          alaskaStream.lineEnd();
          hawaiiStream.lineEnd();
        },
        polygonStart: function() {
          lower48Stream.polygonStart();
          alaskaStream.polygonStart();
          hawaiiStream.polygonStart();
        },
        polygonEnd: function() {
          lower48Stream.polygonEnd();
          alaskaStream.polygonEnd();
          hawaiiStream.polygonEnd();
        }
      };
    };
    albersUsa.precision = function(_) {
      if (!arguments.length) return lower48.precision();
      lower48.precision(_);
      alaska.precision(_);
      hawaii.precision(_);
      return albersUsa;
    };
    albersUsa.scale = function(_) {
      if (!arguments.length) return lower48.scale();
      lower48.scale(_);
      alaska.scale(_ * .35);
      hawaii.scale(_);
      return albersUsa.translate(lower48.translate());
    };
    albersUsa.translate = function(_) {
      if (!arguments.length) return lower48.translate();
      var k = lower48.scale(), x = +_[0], y = +_[1];
      lower48Point = lower48.translate(_).clipExtent([ [ x - .455 * k, y - .238 * k ], [ x + .455 * k, y + .238 * k ] ]).stream(pointStream).point;
      alaskaPoint = alaska.translate([ x - .307 * k, y + .201 * k ]).clipExtent([ [ x - .425 * k + ε, y + .12 * k + ε ], [ x - .214 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
      hawaiiPoint = hawaii.translate([ x - .205 * k, y + .212 * k ]).clipExtent([ [ x - .214 * k + ε, y + .166 * k + ε ], [ x - .115 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
      return albersUsa;
    };
    return albersUsa.scale(1070);
  };
  var d3_geo_pathAreaSum, d3_geo_pathAreaPolygon, d3_geo_pathArea = {
    point: d3_noop,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: function() {
      d3_geo_pathAreaPolygon = 0;
      d3_geo_pathArea.lineStart = d3_geo_pathAreaRingStart;
    },
    polygonEnd: function() {
      d3_geo_pathArea.lineStart = d3_geo_pathArea.lineEnd = d3_geo_pathArea.point = d3_noop;
      d3_geo_pathAreaSum += abs(d3_geo_pathAreaPolygon / 2);
    }
  };
  function d3_geo_pathAreaRingStart() {
    var x00, y00, x0, y0;
    d3_geo_pathArea.point = function(x, y) {
      d3_geo_pathArea.point = nextPoint;
      x00 = x0 = x, y00 = y0 = y;
    };
    function nextPoint(x, y) {
      d3_geo_pathAreaPolygon += y0 * x - x0 * y;
      x0 = x, y0 = y;
    }
    d3_geo_pathArea.lineEnd = function() {
      nextPoint(x00, y00);
    };
  }
  var d3_geo_pathBoundsX0, d3_geo_pathBoundsY0, d3_geo_pathBoundsX1, d3_geo_pathBoundsY1;
  var d3_geo_pathBounds = {
    point: d3_geo_pathBoundsPoint,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: d3_noop,
    polygonEnd: d3_noop
  };
  function d3_geo_pathBoundsPoint(x, y) {
    if (x < d3_geo_pathBoundsX0) d3_geo_pathBoundsX0 = x;
    if (x > d3_geo_pathBoundsX1) d3_geo_pathBoundsX1 = x;
    if (y < d3_geo_pathBoundsY0) d3_geo_pathBoundsY0 = y;
    if (y > d3_geo_pathBoundsY1) d3_geo_pathBoundsY1 = y;
  }
  function d3_geo_pathBuffer() {
    var pointCircle = d3_geo_pathBufferCircle(4.5), buffer = [];
    var stream = {
      point: point,
      lineStart: function() {
        stream.point = pointLineStart;
      },
      lineEnd: lineEnd,
      polygonStart: function() {
        stream.lineEnd = lineEndPolygon;
      },
      polygonEnd: function() {
        stream.lineEnd = lineEnd;
        stream.point = point;
      },
      pointRadius: function(_) {
        pointCircle = d3_geo_pathBufferCircle(_);
        return stream;
      },
      result: function() {
        if (buffer.length) {
          var result = buffer.join("");
          buffer = [];
          return result;
        }
      }
    };
    function point(x, y) {
      buffer.push("M", x, ",", y, pointCircle);
    }
    function pointLineStart(x, y) {
      buffer.push("M", x, ",", y);
      stream.point = pointLine;
    }
    function pointLine(x, y) {
      buffer.push("L", x, ",", y);
    }
    function lineEnd() {
      stream.point = point;
    }
    function lineEndPolygon() {
      buffer.push("Z");
    }
    return stream;
  }
  function d3_geo_pathBufferCircle(radius) {
    return "m0," + radius + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius + "z";
  }
  var d3_geo_pathCentroid = {
    point: d3_geo_pathCentroidPoint,
    lineStart: d3_geo_pathCentroidLineStart,
    lineEnd: d3_geo_pathCentroidLineEnd,
    polygonStart: function() {
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidRingStart;
    },
    polygonEnd: function() {
      d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidLineStart;
      d3_geo_pathCentroid.lineEnd = d3_geo_pathCentroidLineEnd;
    }
  };
  function d3_geo_pathCentroidPoint(x, y) {
    d3_geo_centroidX0 += x;
    d3_geo_centroidY0 += y;
    ++d3_geo_centroidZ0;
  }
  function d3_geo_pathCentroidLineStart() {
    var x0, y0;
    d3_geo_pathCentroid.point = function(x, y) {
      d3_geo_pathCentroid.point = nextPoint;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    };
    function nextPoint(x, y) {
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
      d3_geo_centroidX1 += z * (x0 + x) / 2;
      d3_geo_centroidY1 += z * (y0 + y) / 2;
      d3_geo_centroidZ1 += z;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    }
  }
  function d3_geo_pathCentroidLineEnd() {
    d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
  }
  function d3_geo_pathCentroidRingStart() {
    var x00, y00, x0, y0;
    d3_geo_pathCentroid.point = function(x, y) {
      d3_geo_pathCentroid.point = nextPoint;
      d3_geo_pathCentroidPoint(x00 = x0 = x, y00 = y0 = y);
    };
    function nextPoint(x, y) {
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
      d3_geo_centroidX1 += z * (x0 + x) / 2;
      d3_geo_centroidY1 += z * (y0 + y) / 2;
      d3_geo_centroidZ1 += z;
      z = y0 * x - x0 * y;
      d3_geo_centroidX2 += z * (x0 + x);
      d3_geo_centroidY2 += z * (y0 + y);
      d3_geo_centroidZ2 += z * 3;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    }
    d3_geo_pathCentroid.lineEnd = function() {
      nextPoint(x00, y00);
    };
  }
  function d3_geo_pathContext(context) {
    var pointRadius = 4.5;
    var stream = {
      point: point,
      lineStart: function() {
        stream.point = pointLineStart;
      },
      lineEnd: lineEnd,
      polygonStart: function() {
        stream.lineEnd = lineEndPolygon;
      },
      polygonEnd: function() {
        stream.lineEnd = lineEnd;
        stream.point = point;
      },
      pointRadius: function(_) {
        pointRadius = _;
        return stream;
      },
      result: d3_noop
    };
    function point(x, y) {
      context.moveTo(x, y);
      context.arc(x, y, pointRadius, 0, τ);
    }
    function pointLineStart(x, y) {
      context.moveTo(x, y);
      stream.point = pointLine;
    }
    function pointLine(x, y) {
      context.lineTo(x, y);
    }
    function lineEnd() {
      stream.point = point;
    }
    function lineEndPolygon() {
      context.closePath();
    }
    return stream;
  }
  function d3_geo_resample(project) {
    var δ2 = .5, cosMinDistance = Math.cos(30 * d3_radians), maxDepth = 16;
    function resample(stream) {
      var λ00, φ00, x00, y00, a00, b00, c00, λ0, x0, y0, a0, b0, c0;
      var resample = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          stream.polygonStart();
          resample.lineStart = ringStart;
        },
        polygonEnd: function() {
          stream.polygonEnd();
          resample.lineStart = lineStart;
        }
      };
      function point(x, y) {
        x = project(x, y);
        stream.point(x[0], x[1]);
      }
      function lineStart() {
        x0 = NaN;
        resample.point = linePoint;
        stream.lineStart();
      }
      function linePoint(λ, φ) {
        var c = d3_geo_cartesian([ λ, φ ]), p = project(λ, φ);
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x0 = p[0], y0 = p[1], λ0 = λ, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
        stream.point(x0, y0);
      }
      function lineEnd() {
        resample.point = point;
        stream.lineEnd();
      }
      function ringStart() {
        lineStart();
        resample.point = ringPoint;
        resample.lineEnd = ringEnd;
      }
      function ringPoint(λ, φ) {
        linePoint(λ00 = λ, φ00 = φ), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
        resample.point = linePoint;
      }
      function ringEnd() {
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x00, y00, λ00, a00, b00, c00, maxDepth, stream);
        resample.lineEnd = lineEnd;
        lineEnd();
      }
      return resample;
    }
    function resampleLineTo(x0, y0, λ0, a0, b0, c0, x1, y1, λ1, a1, b1, c1, depth, stream) {
      var dx = x1 - x0, dy = y1 - y0, d2 = dx * dx + dy * dy;
      if (d2 > 4 * δ2 && depth--) {
        var a = a0 + a1, b = b0 + b1, c = c0 + c1, m = Math.sqrt(a * a + b * b + c * c), φ2 = Math.asin(c /= m), λ2 = abs(abs(c) - 1) < ε ? (λ0 + λ1) / 2 : Math.atan2(b, a), p = project(λ2, φ2), x2 = p[0], y2 = p[1], dx2 = x2 - x0, dy2 = y2 - y0, dz = dy * dx2 - dx * dy2;
        if (dz * dz / d2 > δ2 || abs((dx * dx2 + dy * dy2) / d2 - .5) > .3 || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) {
          resampleLineTo(x0, y0, λ0, a0, b0, c0, x2, y2, λ2, a /= m, b /= m, c, depth, stream);
          stream.point(x2, y2);
          resampleLineTo(x2, y2, λ2, a, b, c, x1, y1, λ1, a1, b1, c1, depth, stream);
        }
      }
    }
    resample.precision = function(_) {
      if (!arguments.length) return Math.sqrt(δ2);
      maxDepth = (δ2 = _ * _) > 0 && 16;
      return resample;
    };
    return resample;
  }
  d3.geo.transform = function(methods) {
    return {
      stream: function(stream) {
        var transform = new d3_geo_transform(stream);
        for (var k in methods) transform[k] = methods[k];
        return transform;
      }
    };
  };
  function d3_geo_transform(stream) {
    this.stream = stream;
  }
  d3_geo_transform.prototype = {
    point: function(x, y) {
      this.stream.point(x, y);
    },
    sphere: function() {
      this.stream.sphere();
    },
    lineStart: function() {
      this.stream.lineStart();
    },
    lineEnd: function() {
      this.stream.lineEnd();
    },
    polygonStart: function() {
      this.stream.polygonStart();
    },
    polygonEnd: function() {
      this.stream.polygonEnd();
    }
  };
  d3.geo.path = function() {
    var pointRadius = 4.5, projection, context, projectStream, contextStream, cacheStream;
    function path(object) {
      if (object) {
        if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
        if (!cacheStream || !cacheStream.valid) cacheStream = projectStream(contextStream);
        d3.geo.stream(object, cacheStream);
      }
      return contextStream.result();
    }
    path.area = function(object) {
      d3_geo_pathAreaSum = 0;
      d3.geo.stream(object, projectStream(d3_geo_pathArea));
      return d3_geo_pathAreaSum;
    };
    path.centroid = function(object) {
      d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
      d3.geo.stream(object, projectStream(d3_geo_pathCentroid));
      return d3_geo_centroidZ2 ? [ d3_geo_centroidX2 / d3_geo_centroidZ2, d3_geo_centroidY2 / d3_geo_centroidZ2 ] : d3_geo_centroidZ1 ? [ d3_geo_centroidX1 / d3_geo_centroidZ1, d3_geo_centroidY1 / d3_geo_centroidZ1 ] : d3_geo_centroidZ0 ? [ d3_geo_centroidX0 / d3_geo_centroidZ0, d3_geo_centroidY0 / d3_geo_centroidZ0 ] : [ NaN, NaN ];
    };
    path.bounds = function(object) {
      d3_geo_pathBoundsX1 = d3_geo_pathBoundsY1 = -(d3_geo_pathBoundsX0 = d3_geo_pathBoundsY0 = Infinity);
      d3.geo.stream(object, projectStream(d3_geo_pathBounds));
      return [ [ d3_geo_pathBoundsX0, d3_geo_pathBoundsY0 ], [ d3_geo_pathBoundsX1, d3_geo_pathBoundsY1 ] ];
    };
    path.projection = function(_) {
      if (!arguments.length) return projection;
      projectStream = (projection = _) ? _.stream || d3_geo_pathProjectStream(_) : d3_identity;
      return reset();
    };
    path.context = function(_) {
      if (!arguments.length) return context;
      contextStream = (context = _) == null ? new d3_geo_pathBuffer() : new d3_geo_pathContext(_);
      if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
      return reset();
    };
    path.pointRadius = function(_) {
      if (!arguments.length) return pointRadius;
      pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
      return path;
    };
    function reset() {
      cacheStream = null;
      return path;
    }
    return path.projection(d3.geo.albersUsa()).context(null);
  };
  function d3_geo_pathProjectStream(project) {
    var resample = d3_geo_resample(function(x, y) {
      return project([ x * d3_degrees, y * d3_degrees ]);
    });
    return function(stream) {
      var transform = new d3_geo_transform(stream = resample(stream));
      transform.point = function(x, y) {
        stream.point(x * d3_radians, y * d3_radians);
      };
      return transform;
    };
  }
  d3.geo.projection = d3_geo_projection;
  d3.geo.projectionMutator = d3_geo_projectionMutator;
  function d3_geo_projection(project) {
    return d3_geo_projectionMutator(function() {
      return project;
    })();
  }
  function d3_geo_projectionMutator(projectAt) {
    var project, rotate, projectRotate, projectResample = d3_geo_resample(function(x, y) {
      x = project(x, y);
      return [ x[0] * k + δx, δy - x[1] * k ];
    }), k = 150, x = 480, y = 250, λ = 0, φ = 0, δλ = 0, δφ = 0, δγ = 0, δx, δy, preclip = d3_geo_clipAntimeridian, postclip = d3_identity, clipAngle = null, clipExtent = null, stream;
    function projection(point) {
      point = projectRotate(point[0] * d3_radians, point[1] * d3_radians);
      return [ point[0] * k + δx, δy - point[1] * k ];
    }
    function invert(point) {
      point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k);
      return point && [ point[0] * d3_degrees, point[1] * d3_degrees ];
    }
    projection.stream = function(output) {
      if (stream) stream.valid = false;
      stream = d3_geo_projectionRadians(preclip(rotate, projectResample(postclip(output))));
      stream.valid = true;
      return stream;
    };
    projection.clipAngle = function(_) {
      if (!arguments.length) return clipAngle;
      preclip = _ == null ? (clipAngle = _, d3_geo_clipAntimeridian) : d3_geo_clipCircle((clipAngle = +_) * d3_radians);
      return invalidate();
    };
    projection.clipExtent = function(_) {
      if (!arguments.length) return clipExtent;
      clipExtent = _;
      postclip = _ ? d3_geo_clipExtent(_[0][0], _[0][1], _[1][0], _[1][1]) : d3_identity;
      return invalidate();
    };
    projection.scale = function(_) {
      if (!arguments.length) return k;
      k = +_;
      return reset();
    };
    projection.translate = function(_) {
      if (!arguments.length) return [ x, y ];
      x = +_[0];
      y = +_[1];
      return reset();
    };
    projection.center = function(_) {
      if (!arguments.length) return [ λ * d3_degrees, φ * d3_degrees ];
      λ = _[0] % 360 * d3_radians;
      φ = _[1] % 360 * d3_radians;
      return reset();
    };
    projection.rotate = function(_) {
      if (!arguments.length) return [ δλ * d3_degrees, δφ * d3_degrees, δγ * d3_degrees ];
      δλ = _[0] % 360 * d3_radians;
      δφ = _[1] % 360 * d3_radians;
      δγ = _.length > 2 ? _[2] % 360 * d3_radians : 0;
      return reset();
    };
    d3.rebind(projection, projectResample, "precision");
    function reset() {
      projectRotate = d3_geo_compose(rotate = d3_geo_rotation(δλ, δφ, δγ), project);
      var center = project(λ, φ);
      δx = x - center[0] * k;
      δy = y + center[1] * k;
      return invalidate();
    }
    function invalidate() {
      if (stream) stream.valid = false, stream = null;
      return projection;
    }
    return function() {
      project = projectAt.apply(this, arguments);
      projection.invert = project.invert && invert;
      return reset();
    };
  }
  function d3_geo_projectionRadians(stream) {
    var transform = new d3_geo_transform(stream);
    transform.point = function(λ, φ) {
      stream.point(λ * d3_radians, φ * d3_radians);
    };
    return transform;
  }
  function d3_geo_equirectangular(λ, φ) {
    return [ λ, φ ];
  }
  (d3.geo.equirectangular = function() {
    return d3_geo_projection(d3_geo_equirectangular);
  }).raw = d3_geo_equirectangular.invert = d3_geo_equirectangular;
  d3.geo.rotation = function(rotate) {
    rotate = d3_geo_rotation(rotate[0] % 360 * d3_radians, rotate[1] * d3_radians, rotate.length > 2 ? rotate[2] * d3_radians : 0);
    function forward(coordinates) {
      coordinates = rotate(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
    }
    forward.invert = function(coordinates) {
      coordinates = rotate.invert(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
    };
    return forward;
  };
  function d3_geo_identityRotation(λ, φ) {
    return [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];
  }
  d3_geo_identityRotation.invert = d3_geo_equirectangular;
  function d3_geo_rotation(δλ, δφ, δγ) {
    return δλ ? δφ || δγ ? d3_geo_compose(d3_geo_rotationλ(δλ), d3_geo_rotationφγ(δφ, δγ)) : d3_geo_rotationλ(δλ) : δφ || δγ ? d3_geo_rotationφγ(δφ, δγ) : d3_geo_identityRotation;
  }
  function d3_geo_forwardRotationλ(δλ) {
    return function(λ, φ) {
      return λ += δλ, [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];
    };
  }
  function d3_geo_rotationλ(δλ) {
    var rotation = d3_geo_forwardRotationλ(δλ);
    rotation.invert = d3_geo_forwardRotationλ(-δλ);
    return rotation;
  }
  function d3_geo_rotationφγ(δφ, δγ) {
    var cosδφ = Math.cos(δφ), sinδφ = Math.sin(δφ), cosδγ = Math.cos(δγ), sinδγ = Math.sin(δγ);
    function rotation(λ, φ) {
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδφ + x * sinδφ;
      return [ Math.atan2(y * cosδγ - k * sinδγ, x * cosδφ - z * sinδφ), d3_asin(k * cosδγ + y * sinδγ) ];
    }
    rotation.invert = function(λ, φ) {
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδγ - y * sinδγ;
      return [ Math.atan2(y * cosδγ + z * sinδγ, x * cosδφ + k * sinδφ), d3_asin(k * cosδφ - x * sinδφ) ];
    };
    return rotation;
  }
  d3.geo.circle = function() {
    var origin = [ 0, 0 ], angle, precision = 6, interpolate;
    function circle() {
      var center = typeof origin === "function" ? origin.apply(this, arguments) : origin, rotate = d3_geo_rotation(-center[0] * d3_radians, -center[1] * d3_radians, 0).invert, ring = [];
      interpolate(null, null, 1, {
        point: function(x, y) {
          ring.push(x = rotate(x, y));
          x[0] *= d3_degrees, x[1] *= d3_degrees;
        }
      });
      return {
        type: "Polygon",
        coordinates: [ ring ]
      };
    }
    circle.origin = function(x) {
      if (!arguments.length) return origin;
      origin = x;
      return circle;
    };
    circle.angle = function(x) {
      if (!arguments.length) return angle;
      interpolate = d3_geo_circleInterpolate((angle = +x) * d3_radians, precision * d3_radians);
      return circle;
    };
    circle.precision = function(_) {
      if (!arguments.length) return precision;
      interpolate = d3_geo_circleInterpolate(angle * d3_radians, (precision = +_) * d3_radians);
      return circle;
    };
    return circle.angle(90);
  };
  function d3_geo_circleInterpolate(radius, precision) {
    var cr = Math.cos(radius), sr = Math.sin(radius);
    return function(from, to, direction, listener) {
      var step = direction * precision;
      if (from != null) {
        from = d3_geo_circleAngle(cr, from);
        to = d3_geo_circleAngle(cr, to);
        if (direction > 0 ? from < to : from > to) from += direction * τ;
      } else {
        from = radius + direction * τ;
        to = radius - .5 * step;
      }
      for (var point, t = from; direction > 0 ? t > to : t < to; t -= step) {
        listener.point((point = d3_geo_spherical([ cr, -sr * Math.cos(t), -sr * Math.sin(t) ]))[0], point[1]);
      }
    };
  }
  function d3_geo_circleAngle(cr, point) {
    var a = d3_geo_cartesian(point);
    a[0] -= cr;
    d3_geo_cartesianNormalize(a);
    var angle = d3_acos(-a[1]);
    return ((-a[2] < 0 ? -angle : angle) + 2 * Math.PI - ε) % (2 * Math.PI);
  }
  d3.geo.distance = function(a, b) {
    var Δλ = (b[0] - a[0]) * d3_radians, φ0 = a[1] * d3_radians, φ1 = b[1] * d3_radians, sinΔλ = Math.sin(Δλ), cosΔλ = Math.cos(Δλ), sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1), t;
    return Math.atan2(Math.sqrt((t = cosφ1 * sinΔλ) * t + (t = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * t), sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ);
  };
  d3.geo.graticule = function() {
    var x1, x0, X1, X0, y1, y0, Y1, Y0, dx = 10, dy = dx, DX = 90, DY = 360, x, y, X, Y, precision = 2.5;
    function graticule() {
      return {
        type: "MultiLineString",
        coordinates: lines()
      };
    }
    function lines() {
      return d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) {
        return abs(x % DX) > ε;
      }).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy, y1, dy).filter(function(y) {
        return abs(y % DY) > ε;
      }).map(y));
    }
    graticule.lines = function() {
      return lines().map(function(coordinates) {
        return {
          type: "LineString",
          coordinates: coordinates
        };
      });
    };
    graticule.outline = function() {
      return {
        type: "Polygon",
        coordinates: [ X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1)) ]
      };
    };
    graticule.extent = function(_) {
      if (!arguments.length) return graticule.minorExtent();
      return graticule.majorExtent(_).minorExtent(_);
    };
    graticule.majorExtent = function(_) {
      if (!arguments.length) return [ [ X0, Y0 ], [ X1, Y1 ] ];
      X0 = +_[0][0], X1 = +_[1][0];
      Y0 = +_[0][1], Y1 = +_[1][1];
      if (X0 > X1) _ = X0, X0 = X1, X1 = _;
      if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
      return graticule.precision(precision);
    };
    graticule.minorExtent = function(_) {
      if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
      x0 = +_[0][0], x1 = +_[1][0];
      y0 = +_[0][1], y1 = +_[1][1];
      if (x0 > x1) _ = x0, x0 = x1, x1 = _;
      if (y0 > y1) _ = y0, y0 = y1, y1 = _;
      return graticule.precision(precision);
    };
    graticule.step = function(_) {
      if (!arguments.length) return graticule.minorStep();
      return graticule.majorStep(_).minorStep(_);
    };
    graticule.majorStep = function(_) {
      if (!arguments.length) return [ DX, DY ];
      DX = +_[0], DY = +_[1];
      return graticule;
    };
    graticule.minorStep = function(_) {
      if (!arguments.length) return [ dx, dy ];
      dx = +_[0], dy = +_[1];
      return graticule;
    };
    graticule.precision = function(_) {
      if (!arguments.length) return precision;
      precision = +_;
      x = d3_geo_graticuleX(y0, y1, 90);
      y = d3_geo_graticuleY(x0, x1, precision);
      X = d3_geo_graticuleX(Y0, Y1, 90);
      Y = d3_geo_graticuleY(X0, X1, precision);
      return graticule;
    };
    return graticule.majorExtent([ [ -180, -90 + ε ], [ 180, 90 - ε ] ]).minorExtent([ [ -180, -80 - ε ], [ 180, 80 + ε ] ]);
  };
  function d3_geo_graticuleX(y0, y1, dy) {
    var y = d3.range(y0, y1 - ε, dy).concat(y1);
    return function(x) {
      return y.map(function(y) {
        return [ x, y ];
      });
    };
  }
  function d3_geo_graticuleY(x0, x1, dx) {
    var x = d3.range(x0, x1 - ε, dx).concat(x1);
    return function(y) {
      return x.map(function(x) {
        return [ x, y ];
      });
    };
  }
  function d3_source(d) {
    return d.source;
  }
  function d3_target(d) {
    return d.target;
  }
  d3.geo.greatArc = function() {
    var source = d3_source, source_, target = d3_target, target_;
    function greatArc() {
      return {
        type: "LineString",
        coordinates: [ source_ || source.apply(this, arguments), target_ || target.apply(this, arguments) ]
      };
    }
    greatArc.distance = function() {
      return d3.geo.distance(source_ || source.apply(this, arguments), target_ || target.apply(this, arguments));
    };
    greatArc.source = function(_) {
      if (!arguments.length) return source;
      source = _, source_ = typeof _ === "function" ? null : _;
      return greatArc;
    };
    greatArc.target = function(_) {
      if (!arguments.length) return target;
      target = _, target_ = typeof _ === "function" ? null : _;
      return greatArc;
    };
    greatArc.precision = function() {
      return arguments.length ? greatArc : 0;
    };
    return greatArc;
  };
  d3.geo.interpolate = function(source, target) {
    return d3_geo_interpolate(source[0] * d3_radians, source[1] * d3_radians, target[0] * d3_radians, target[1] * d3_radians);
  };
  function d3_geo_interpolate(x0, y0, x1, y1) {
    var cy0 = Math.cos(y0), sy0 = Math.sin(y0), cy1 = Math.cos(y1), sy1 = Math.sin(y1), kx0 = cy0 * Math.cos(x0), ky0 = cy0 * Math.sin(x0), kx1 = cy1 * Math.cos(x1), ky1 = cy1 * Math.sin(x1), d = 2 * Math.asin(Math.sqrt(d3_haversin(y1 - y0) + cy0 * cy1 * d3_haversin(x1 - x0))), k = 1 / Math.sin(d);
    var interpolate = d ? function(t) {
      var B = Math.sin(t *= d) * k, A = Math.sin(d - t) * k, x = A * kx0 + B * kx1, y = A * ky0 + B * ky1, z = A * sy0 + B * sy1;
      return [ Math.atan2(y, x) * d3_degrees, Math.atan2(z, Math.sqrt(x * x + y * y)) * d3_degrees ];
    } : function() {
      return [ x0 * d3_degrees, y0 * d3_degrees ];
    };
    interpolate.distance = d;
    return interpolate;
  }
  d3.geo.length = function(object) {
    d3_geo_lengthSum = 0;
    d3.geo.stream(object, d3_geo_length);
    return d3_geo_lengthSum;
  };
  var d3_geo_lengthSum;
  var d3_geo_length = {
    sphere: d3_noop,
    point: d3_noop,
    lineStart: d3_geo_lengthLineStart,
    lineEnd: d3_noop,
    polygonStart: d3_noop,
    polygonEnd: d3_noop
  };
  function d3_geo_lengthLineStart() {
    var λ0, sinφ0, cosφ0;
    d3_geo_length.point = function(λ, φ) {
      λ0 = λ * d3_radians, sinφ0 = Math.sin(φ *= d3_radians), cosφ0 = Math.cos(φ);
      d3_geo_length.point = nextPoint;
    };
    d3_geo_length.lineEnd = function() {
      d3_geo_length.point = d3_geo_length.lineEnd = d3_noop;
    };
    function nextPoint(λ, φ) {
      var sinφ = Math.sin(φ *= d3_radians), cosφ = Math.cos(φ), t = abs((λ *= d3_radians) - λ0), cosΔλ = Math.cos(t);
      d3_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ);
      λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ;
    }
  }
  function d3_geo_azimuthal(scale, angle) {
    function azimuthal(λ, φ) {
      var cosλ = Math.cos(λ), cosφ = Math.cos(φ), k = scale(cosλ * cosφ);
      return [ k * cosφ * Math.sin(λ), k * Math.sin(φ) ];
    }
    azimuthal.invert = function(x, y) {
      var ρ = Math.sqrt(x * x + y * y), c = angle(ρ), sinc = Math.sin(c), cosc = Math.cos(c);
      return [ Math.atan2(x * sinc, ρ * cosc), Math.asin(ρ && y * sinc / ρ) ];
    };
    return azimuthal;
  }
  var d3_geo_azimuthalEqualArea = d3_geo_azimuthal(function(cosλcosφ) {
    return Math.sqrt(2 / (1 + cosλcosφ));
  }, function(ρ) {
    return 2 * Math.asin(ρ / 2);
  });
  (d3.geo.azimuthalEqualArea = function() {
    return d3_geo_projection(d3_geo_azimuthalEqualArea);
  }).raw = d3_geo_azimuthalEqualArea;
  var d3_geo_azimuthalEquidistant = d3_geo_azimuthal(function(cosλcosφ) {
    var c = Math.acos(cosλcosφ);
    return c && c / Math.sin(c);
  }, d3_identity);
  (d3.geo.azimuthalEquidistant = function() {
    return d3_geo_projection(d3_geo_azimuthalEquidistant);
  }).raw = d3_geo_azimuthalEquidistant;
  function d3_geo_conicConformal(φ0, φ1) {
    var cosφ0 = Math.cos(φ0), t = function(φ) {
      return Math.tan(π / 4 + φ / 2);
    }, n = φ0 === φ1 ? Math.sin(φ0) : Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)), F = cosφ0 * Math.pow(t(φ0), n) / n;
    if (!n) return d3_geo_mercator;
    function forward(λ, φ) {
      var ρ = abs(abs(φ) - halfπ) < ε ? 0 : F / Math.pow(t(φ), n);
      return [ ρ * Math.sin(n * λ), F - ρ * Math.cos(n * λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = F - y, ρ = d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);
      return [ Math.atan2(x, ρ0_y) / n, 2 * Math.atan(Math.pow(F / ρ, 1 / n)) - halfπ ];
    };
    return forward;
  }
  (d3.geo.conicConformal = function() {
    return d3_geo_conic(d3_geo_conicConformal);
  }).raw = d3_geo_conicConformal;
  function d3_geo_conicEquidistant(φ0, φ1) {
    var cosφ0 = Math.cos(φ0), n = φ0 === φ1 ? Math.sin(φ0) : (cosφ0 - Math.cos(φ1)) / (φ1 - φ0), G = cosφ0 / n + φ0;
    if (abs(n) < ε) return d3_geo_equirectangular;
    function forward(λ, φ) {
      var ρ = G - φ;
      return [ ρ * Math.sin(n * λ), G - ρ * Math.cos(n * λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = G - y;
      return [ Math.atan2(x, ρ0_y) / n, G - d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y) ];
    };
    return forward;
  }
  (d3.geo.conicEquidistant = function() {
    return d3_geo_conic(d3_geo_conicEquidistant);
  }).raw = d3_geo_conicEquidistant;
  var d3_geo_gnomonic = d3_geo_azimuthal(function(cosλcosφ) {
    return 1 / cosλcosφ;
  }, Math.atan);
  (d3.geo.gnomonic = function() {
    return d3_geo_projection(d3_geo_gnomonic);
  }).raw = d3_geo_gnomonic;
  function d3_geo_mercator(λ, φ) {
    return [ λ, Math.log(Math.tan(π / 4 + φ / 2)) ];
  }
  d3_geo_mercator.invert = function(x, y) {
    return [ x, 2 * Math.atan(Math.exp(y)) - halfπ ];
  };
  function d3_geo_mercatorProjection(project) {
    var m = d3_geo_projection(project), scale = m.scale, translate = m.translate, clipExtent = m.clipExtent, clipAuto;
    m.scale = function() {
      var v = scale.apply(m, arguments);
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
    };
    m.translate = function() {
      var v = translate.apply(m, arguments);
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
    };
    m.clipExtent = function(_) {
      var v = clipExtent.apply(m, arguments);
      if (v === m) {
        if (clipAuto = _ == null) {
          var k = π * scale(), t = translate();
          clipExtent([ [ t[0] - k, t[1] - k ], [ t[0] + k, t[1] + k ] ]);
        }
      } else if (clipAuto) {
        v = null;
      }
      return v;
    };
    return m.clipExtent(null);
  }
  (d3.geo.mercator = function() {
    return d3_geo_mercatorProjection(d3_geo_mercator);
  }).raw = d3_geo_mercator;
  var d3_geo_orthographic = d3_geo_azimuthal(function() {
    return 1;
  }, Math.asin);
  (d3.geo.orthographic = function() {
    return d3_geo_projection(d3_geo_orthographic);
  }).raw = d3_geo_orthographic;
  var d3_geo_stereographic = d3_geo_azimuthal(function(cosλcosφ) {
    return 1 / (1 + cosλcosφ);
  }, function(ρ) {
    return 2 * Math.atan(ρ);
  });
  (d3.geo.stereographic = function() {
    return d3_geo_projection(d3_geo_stereographic);
  }).raw = d3_geo_stereographic;
  function d3_geo_transverseMercator(λ, φ) {
    var B = Math.cos(φ) * Math.sin(λ);
    return [ Math.log((1 + B) / (1 - B)) / 2, Math.atan2(Math.tan(φ), Math.cos(λ)) ];
  }
  d3_geo_transverseMercator.invert = function(x, y) {
    return [ Math.atan2(d3_sinh(x), Math.cos(y)), d3_asin(Math.sin(y) / d3_cosh(x)) ];
  };
  (d3.geo.transverseMercator = function() {
    return d3_geo_mercatorProjection(d3_geo_transverseMercator);
  }).raw = d3_geo_transverseMercator;
  d3.geom = {};
  function d3_geom_pointX(d) {
    return d[0];
  }
  function d3_geom_pointY(d) {
    return d[1];
  }
  d3.geom.hull = function(vertices) {
    var x = d3_geom_pointX, y = d3_geom_pointY;
    if (arguments.length) return hull(vertices);
    function hull(data) {
      if (data.length < 3) return [];
      var fx = d3_functor(x), fy = d3_functor(y), n = data.length, vertices, plen = n - 1, points = [], stack = [], d, i, j, h = 0, x1, y1, x2, y2, u, v, a, sp;
      if (fx === d3_geom_pointX && y === d3_geom_pointY) vertices = data; else for (i = 0, 
      vertices = []; i < n; ++i) {
        vertices.push([ +fx.call(this, d = data[i], i), +fy.call(this, d, i) ]);
      }
      for (i = 1; i < n; ++i) {
        if (vertices[i][1] < vertices[h][1] || vertices[i][1] == vertices[h][1] && vertices[i][0] < vertices[h][0]) h = i;
      }
      for (i = 0; i < n; ++i) {
        if (i === h) continue;
        y1 = vertices[i][1] - vertices[h][1];
        x1 = vertices[i][0] - vertices[h][0];
        points.push({
          angle: Math.atan2(y1, x1),
          index: i
        });
      }
      points.sort(function(a, b) {
        return a.angle - b.angle;
      });
      a = points[0].angle;
      v = points[0].index;
      u = 0;
      for (i = 1; i < plen; ++i) {
        j = points[i].index;
        if (a == points[i].angle) {
          x1 = vertices[v][0] - vertices[h][0];
          y1 = vertices[v][1] - vertices[h][1];
          x2 = vertices[j][0] - vertices[h][0];
          y2 = vertices[j][1] - vertices[h][1];
          if (x1 * x1 + y1 * y1 >= x2 * x2 + y2 * y2) {
            points[i].index = -1;
            continue;
          } else {
            points[u].index = -1;
          }
        }
        a = points[i].angle;
        u = i;
        v = j;
      }
      stack.push(h);
      for (i = 0, j = 0; i < 2; ++j) {
        if (points[j].index > -1) {
          stack.push(points[j].index);
          i++;
        }
      }
      sp = stack.length;
      for (;j < plen; ++j) {
        if (points[j].index < 0) continue;
        while (!d3_geom_hullCCW(stack[sp - 2], stack[sp - 1], points[j].index, vertices)) {
          --sp;
        }
        stack[sp++] = points[j].index;
      }
      var poly = [];
      for (i = sp - 1; i >= 0; --i) poly.push(data[stack[i]]);
      return poly;
    }
    hull.x = function(_) {
      return arguments.length ? (x = _, hull) : x;
    };
    hull.y = function(_) {
      return arguments.length ? (y = _, hull) : y;
    };
    return hull;
  };
  function d3_geom_hullCCW(i1, i2, i3, v) {
    var t, a, b, c, d, e, f;
    t = v[i1];
    a = t[0];
    b = t[1];
    t = v[i2];
    c = t[0];
    d = t[1];
    t = v[i3];
    e = t[0];
    f = t[1];
    return (f - b) * (c - a) - (d - b) * (e - a) > 0;
  }
  d3.geom.polygon = function(coordinates) {
    d3_subclass(coordinates, d3_geom_polygonPrototype);
    return coordinates;
  };
  var d3_geom_polygonPrototype = d3.geom.polygon.prototype = [];
  d3_geom_polygonPrototype.area = function() {
    var i = -1, n = this.length, a, b = this[n - 1], area = 0;
    while (++i < n) {
      a = b;
      b = this[i];
      area += a[1] * b[0] - a[0] * b[1];
    }
    return area * .5;
  };
  d3_geom_polygonPrototype.centroid = function(k) {
    var i = -1, n = this.length, x = 0, y = 0, a, b = this[n - 1], c;
    if (!arguments.length) k = -1 / (6 * this.area());
    while (++i < n) {
      a = b;
      b = this[i];
      c = a[0] * b[1] - b[0] * a[1];
      x += (a[0] + b[0]) * c;
      y += (a[1] + b[1]) * c;
    }
    return [ x * k, y * k ];
  };
  d3_geom_polygonPrototype.clip = function(subject) {
    var input, closed = d3_geom_polygonClosed(subject), i = -1, n = this.length - d3_geom_polygonClosed(this), j, m, a = this[n - 1], b, c, d;
    while (++i < n) {
      input = subject.slice();
      subject.length = 0;
      b = this[i];
      c = input[(m = input.length - closed) - 1];
      j = -1;
      while (++j < m) {
        d = input[j];
        if (d3_geom_polygonInside(d, a, b)) {
          if (!d3_geom_polygonInside(c, a, b)) {
            subject.push(d3_geom_polygonIntersect(c, d, a, b));
          }
          subject.push(d);
        } else if (d3_geom_polygonInside(c, a, b)) {
          subject.push(d3_geom_polygonIntersect(c, d, a, b));
        }
        c = d;
      }
      if (closed) subject.push(subject[0]);
      a = b;
    }
    return subject;
  };
  function d3_geom_polygonInside(p, a, b) {
    return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);
  }
  function d3_geom_polygonIntersect(c, d, a, b) {
    var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3, ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
    return [ x1 + ua * x21, y1 + ua * y21 ];
  }
  function d3_geom_polygonClosed(coordinates) {
    var a = coordinates[0], b = coordinates[coordinates.length - 1];
    return !(a[0] - b[0] || a[1] - b[1]);
  }
  var d3_geom_voronoiEdges, d3_geom_voronoiCells, d3_geom_voronoiBeaches, d3_geom_voronoiBeachPool = [], d3_geom_voronoiFirstCircle, d3_geom_voronoiCircles, d3_geom_voronoiCirclePool = [];
  function d3_geom_voronoiBeach() {
    d3_geom_voronoiRedBlackNode(this);
    this.edge = this.site = this.circle = null;
  }
  function d3_geom_voronoiCreateBeach(site) {
    var beach = d3_geom_voronoiBeachPool.pop() || new d3_geom_voronoiBeach();
    beach.site = site;
    return beach;
  }
  function d3_geom_voronoiDetachBeach(beach) {
    d3_geom_voronoiDetachCircle(beach);
    d3_geom_voronoiBeaches.remove(beach);
    d3_geom_voronoiBeachPool.push(beach);
    d3_geom_voronoiRedBlackNode(beach);
  }
  function d3_geom_voronoiRemoveBeach(beach) {
    var circle = beach.circle, x = circle.x, y = circle.cy, vertex = {
      x: x,
      y: y
    }, previous = beach.P, next = beach.N, disappearing = [ beach ];
    d3_geom_voronoiDetachBeach(beach);
    var lArc = previous;
    while (lArc.circle && abs(x - lArc.circle.x) < ε && abs(y - lArc.circle.cy) < ε) {
      previous = lArc.P;
      disappearing.unshift(lArc);
      d3_geom_voronoiDetachBeach(lArc);
      lArc = previous;
    }
    disappearing.unshift(lArc);
    d3_geom_voronoiDetachCircle(lArc);
    var rArc = next;
    while (rArc.circle && abs(x - rArc.circle.x) < ε && abs(y - rArc.circle.cy) < ε) {
      next = rArc.N;
      disappearing.push(rArc);
      d3_geom_voronoiDetachBeach(rArc);
      rArc = next;
    }
    disappearing.push(rArc);
    d3_geom_voronoiDetachCircle(rArc);
    var nArcs = disappearing.length, iArc;
    for (iArc = 1; iArc < nArcs; ++iArc) {
      rArc = disappearing[iArc];
      lArc = disappearing[iArc - 1];
      d3_geom_voronoiSetEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
    }
    lArc = disappearing[0];
    rArc = disappearing[nArcs - 1];
    rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, rArc.site, null, vertex);
    d3_geom_voronoiAttachCircle(lArc);
    d3_geom_voronoiAttachCircle(rArc);
  }
  function d3_geom_voronoiAddBeach(site) {
    var x = site.x, directrix = site.y, lArc, rArc, dxl, dxr, node = d3_geom_voronoiBeaches._;
    while (node) {
      dxl = d3_geom_voronoiLeftBreakPoint(node, directrix) - x;
      if (dxl > ε) node = node.L; else {
        dxr = x - d3_geom_voronoiRightBreakPoint(node, directrix);
        if (dxr > ε) {
          if (!node.R) {
            lArc = node;
            break;
          }
          node = node.R;
        } else {
          if (dxl > -ε) {
            lArc = node.P;
            rArc = node;
          } else if (dxr > -ε) {
            lArc = node;
            rArc = node.N;
          } else {
            lArc = rArc = node;
          }
          break;
        }
      }
    }
    var newArc = d3_geom_voronoiCreateBeach(site);
    d3_geom_voronoiBeaches.insert(lArc, newArc);
    if (!lArc && !rArc) return;
    if (lArc === rArc) {
      d3_geom_voronoiDetachCircle(lArc);
      rArc = d3_geom_voronoiCreateBeach(lArc.site);
      d3_geom_voronoiBeaches.insert(newArc, rArc);
      newArc.edge = rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
      d3_geom_voronoiAttachCircle(lArc);
      d3_geom_voronoiAttachCircle(rArc);
      return;
    }
    if (!rArc) {
      newArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
      return;
    }
    d3_geom_voronoiDetachCircle(lArc);
    d3_geom_voronoiDetachCircle(rArc);
    var lSite = lArc.site, ax = lSite.x, ay = lSite.y, bx = site.x - ax, by = site.y - ay, rSite = rArc.site, cx = rSite.x - ax, cy = rSite.y - ay, d = 2 * (bx * cy - by * cx), hb = bx * bx + by * by, hc = cx * cx + cy * cy, vertex = {
      x: (cy * hb - by * hc) / d + ax,
      y: (bx * hc - cx * hb) / d + ay
    };
    d3_geom_voronoiSetEdgeEnd(rArc.edge, lSite, rSite, vertex);
    newArc.edge = d3_geom_voronoiCreateEdge(lSite, site, null, vertex);
    rArc.edge = d3_geom_voronoiCreateEdge(site, rSite, null, vertex);
    d3_geom_voronoiAttachCircle(lArc);
    d3_geom_voronoiAttachCircle(rArc);
  }
  function d3_geom_voronoiLeftBreakPoint(arc, directrix) {
    var site = arc.site, rfocx = site.x, rfocy = site.y, pby2 = rfocy - directrix;
    if (!pby2) return rfocx;
    var lArc = arc.P;
    if (!lArc) return -Infinity;
    site = lArc.site;
    var lfocx = site.x, lfocy = site.y, plby2 = lfocy - directrix;
    if (!plby2) return lfocx;
    var hl = lfocx - rfocx, aby2 = 1 / pby2 - 1 / plby2, b = hl / plby2;
    if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;
    return (rfocx + lfocx) / 2;
  }
  function d3_geom_voronoiRightBreakPoint(arc, directrix) {
    var rArc = arc.N;
    if (rArc) return d3_geom_voronoiLeftBreakPoint(rArc, directrix);
    var site = arc.site;
    return site.y === directrix ? site.x : Infinity;
  }
  function d3_geom_voronoiCell(site) {
    this.site = site;
    this.edges = [];
  }
  d3_geom_voronoiCell.prototype.prepare = function() {
    var halfEdges = this.edges, iHalfEdge = halfEdges.length, edge;
    while (iHalfEdge--) {
      edge = halfEdges[iHalfEdge].edge;
      if (!edge.b || !edge.a) halfEdges.splice(iHalfEdge, 1);
    }
    halfEdges.sort(d3_geom_voronoiHalfEdgeOrder);
    return halfEdges.length;
  };
  function d3_geom_voronoiCloseCells(extent) {
    var x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], x2, y2, x3, y3, cells = d3_geom_voronoiCells, iCell = cells.length, cell, iHalfEdge, halfEdges, nHalfEdges, start, end;
    while (iCell--) {
      cell = cells[iCell];
      if (!cell || !cell.prepare()) continue;
      halfEdges = cell.edges;
      nHalfEdges = halfEdges.length;
      iHalfEdge = 0;
      while (iHalfEdge < nHalfEdges) {
        end = halfEdges[iHalfEdge].end(), x3 = end.x, y3 = end.y;
        start = halfEdges[++iHalfEdge % nHalfEdges].start(), x2 = start.x, y2 = start.y;
        if (abs(x3 - x2) > ε || abs(y3 - y2) > ε) {
          halfEdges.splice(iHalfEdge, 0, new d3_geom_voronoiHalfEdge(d3_geom_voronoiCreateBorderEdge(cell.site, end, abs(x3 - x0) < ε && y1 - y3 > ε ? {
            x: x0,
            y: abs(x2 - x0) < ε ? y2 : y1
          } : abs(y3 - y1) < ε && x1 - x3 > ε ? {
            x: abs(y2 - y1) < ε ? x2 : x1,
            y: y1
          } : abs(x3 - x1) < ε && y3 - y0 > ε ? {
            x: x1,
            y: abs(x2 - x1) < ε ? y2 : y0
          } : abs(y3 - y0) < ε && x3 - x0 > ε ? {
            x: abs(y2 - y0) < ε ? x2 : x0,
            y: y0
          } : null), cell.site, null));
          ++nHalfEdges;
        }
      }
    }
  }
  function d3_geom_voronoiHalfEdgeOrder(a, b) {
    return b.angle - a.angle;
  }
  function d3_geom_voronoiCircle() {
    d3_geom_voronoiRedBlackNode(this);
    this.x = this.y = this.arc = this.site = this.cy = null;
  }
  function d3_geom_voronoiAttachCircle(arc) {
    var lArc = arc.P, rArc = arc.N;
    if (!lArc || !rArc) return;
    var lSite = lArc.site, cSite = arc.site, rSite = rArc.site;
    if (lSite === rSite) return;
    var bx = cSite.x, by = cSite.y, ax = lSite.x - bx, ay = lSite.y - by, cx = rSite.x - bx, cy = rSite.y - by;
    var d = 2 * (ax * cy - ay * cx);
    if (d >= -ε2) return;
    var ha = ax * ax + ay * ay, hc = cx * cx + cy * cy, x = (cy * ha - ay * hc) / d, y = (ax * hc - cx * ha) / d, cy = y + by;
    var circle = d3_geom_voronoiCirclePool.pop() || new d3_geom_voronoiCircle();
    circle.arc = arc;
    circle.site = cSite;
    circle.x = x + bx;
    circle.y = cy + Math.sqrt(x * x + y * y);
    circle.cy = cy;
    arc.circle = circle;
    var before = null, node = d3_geom_voronoiCircles._;
    while (node) {
      if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {
        if (node.L) node = node.L; else {
          before = node.P;
          break;
        }
      } else {
        if (node.R) node = node.R; else {
          before = node;
          break;
        }
      }
    }
    d3_geom_voronoiCircles.insert(before, circle);
    if (!before) d3_geom_voronoiFirstCircle = circle;
  }
  function d3_geom_voronoiDetachCircle(arc) {
    var circle = arc.circle;
    if (circle) {
      if (!circle.P) d3_geom_voronoiFirstCircle = circle.N;
      d3_geom_voronoiCircles.remove(circle);
      d3_geom_voronoiCirclePool.push(circle);
      d3_geom_voronoiRedBlackNode(circle);
      arc.circle = null;
    }
  }
  function d3_geom_voronoiClipEdges(extent) {
    var edges = d3_geom_voronoiEdges, clip = d3_geom_clipLine(extent[0][0], extent[0][1], extent[1][0], extent[1][1]), i = edges.length, e;
    while (i--) {
      e = edges[i];
      if (!d3_geom_voronoiConnectEdge(e, extent) || !clip(e) || abs(e.a.x - e.b.x) < ε && abs(e.a.y - e.b.y) < ε) {
        e.a = e.b = null;
        edges.splice(i, 1);
      }
    }
  }
  function d3_geom_voronoiConnectEdge(edge, extent) {
    var vb = edge.b;
    if (vb) return true;
    var va = edge.a, x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], lSite = edge.l, rSite = edge.r, lx = lSite.x, ly = lSite.y, rx = rSite.x, ry = rSite.y, fx = (lx + rx) / 2, fy = (ly + ry) / 2, fm, fb;
    if (ry === ly) {
      if (fx < x0 || fx >= x1) return;
      if (lx > rx) {
        if (!va) va = {
          x: fx,
          y: y0
        }; else if (va.y >= y1) return;
        vb = {
          x: fx,
          y: y1
        };
      } else {
        if (!va) va = {
          x: fx,
          y: y1
        }; else if (va.y < y0) return;
        vb = {
          x: fx,
          y: y0
        };
      }
    } else {
      fm = (lx - rx) / (ry - ly);
      fb = fy - fm * fx;
      if (fm < -1 || fm > 1) {
        if (lx > rx) {
          if (!va) va = {
            x: (y0 - fb) / fm,
            y: y0
          }; else if (va.y >= y1) return;
          vb = {
            x: (y1 - fb) / fm,
            y: y1
          };
        } else {
          if (!va) va = {
            x: (y1 - fb) / fm,
            y: y1
          }; else if (va.y < y0) return;
          vb = {
            x: (y0 - fb) / fm,
            y: y0
          };
        }
      } else {
        if (ly < ry) {
          if (!va) va = {
            x: x0,
            y: fm * x0 + fb
          }; else if (va.x >= x1) return;
          vb = {
            x: x1,
            y: fm * x1 + fb
          };
        } else {
          if (!va) va = {
            x: x1,
            y: fm * x1 + fb
          }; else if (va.x < x0) return;
          vb = {
            x: x0,
            y: fm * x0 + fb
          };
        }
      }
    }
    edge.a = va;
    edge.b = vb;
    return true;
  }
  function d3_geom_voronoiEdge(lSite, rSite) {
    this.l = lSite;
    this.r = rSite;
    this.a = this.b = null;
  }
  function d3_geom_voronoiCreateEdge(lSite, rSite, va, vb) {
    var edge = new d3_geom_voronoiEdge(lSite, rSite);
    d3_geom_voronoiEdges.push(edge);
    if (va) d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, va);
    if (vb) d3_geom_voronoiSetEdgeEnd(edge, rSite, lSite, vb);
    d3_geom_voronoiCells[lSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, lSite, rSite));
    d3_geom_voronoiCells[rSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, rSite, lSite));
    return edge;
  }
  function d3_geom_voronoiCreateBorderEdge(lSite, va, vb) {
    var edge = new d3_geom_voronoiEdge(lSite, null);
    edge.a = va;
    edge.b = vb;
    d3_geom_voronoiEdges.push(edge);
    return edge;
  }
  function d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, vertex) {
    if (!edge.a && !edge.b) {
      edge.a = vertex;
      edge.l = lSite;
      edge.r = rSite;
    } else if (edge.l === rSite) {
      edge.b = vertex;
    } else {
      edge.a = vertex;
    }
  }
  function d3_geom_voronoiHalfEdge(edge, lSite, rSite) {
    var va = edge.a, vb = edge.b;
    this.edge = edge;
    this.site = lSite;
    this.angle = rSite ? Math.atan2(rSite.y - lSite.y, rSite.x - lSite.x) : edge.l === lSite ? Math.atan2(vb.x - va.x, va.y - vb.y) : Math.atan2(va.x - vb.x, vb.y - va.y);
  }
  d3_geom_voronoiHalfEdge.prototype = {
    start: function() {
      return this.edge.l === this.site ? this.edge.a : this.edge.b;
    },
    end: function() {
      return this.edge.l === this.site ? this.edge.b : this.edge.a;
    }
  };
  function d3_geom_voronoiRedBlackTree() {
    this._ = null;
  }
  function d3_geom_voronoiRedBlackNode(node) {
    node.U = node.C = node.L = node.R = node.P = node.N = null;
  }
  d3_geom_voronoiRedBlackTree.prototype = {
    insert: function(after, node) {
      var parent, grandpa, uncle;
      if (after) {
        node.P = after;
        node.N = after.N;
        if (after.N) after.N.P = node;
        after.N = node;
        if (after.R) {
          after = after.R;
          while (after.L) after = after.L;
          after.L = node;
        } else {
          after.R = node;
        }
        parent = after;
      } else if (this._) {
        after = d3_geom_voronoiRedBlackFirst(this._);
        node.P = null;
        node.N = after;
        after.P = after.L = node;
        parent = after;
      } else {
        node.P = node.N = null;
        this._ = node;
        parent = null;
      }
      node.L = node.R = null;
      node.U = parent;
      node.C = true;
      after = node;
      while (parent && parent.C) {
        grandpa = parent.U;
        if (parent === grandpa.L) {
          uncle = grandpa.R;
          if (uncle && uncle.C) {
            parent.C = uncle.C = false;
            grandpa.C = true;
            after = grandpa;
          } else {
            if (after === parent.R) {
              d3_geom_voronoiRedBlackRotateLeft(this, parent);
              after = parent;
              parent = after.U;
            }
            parent.C = false;
            grandpa.C = true;
            d3_geom_voronoiRedBlackRotateRight(this, grandpa);
          }
        } else {
          uncle = grandpa.L;
          if (uncle && uncle.C) {
            parent.C = uncle.C = false;
            grandpa.C = true;
            after = grandpa;
          } else {
            if (after === parent.L) {
              d3_geom_voronoiRedBlackRotateRight(this, parent);
              after = parent;
              parent = after.U;
            }
            parent.C = false;
            grandpa.C = true;
            d3_geom_voronoiRedBlackRotateLeft(this, grandpa);
          }
        }
        parent = after.U;
      }
      this._.C = false;
    },
    remove: function(node) {
      if (node.N) node.N.P = node.P;
      if (node.P) node.P.N = node.N;
      node.N = node.P = null;
      var parent = node.U, sibling, left = node.L, right = node.R, next, red;
      if (!left) next = right; else if (!right) next = left; else next = d3_geom_voronoiRedBlackFirst(right);
      if (parent) {
        if (parent.L === node) parent.L = next; else parent.R = next;
      } else {
        this._ = next;
      }
      if (left && right) {
        red = next.C;
        next.C = node.C;
        next.L = left;
        left.U = next;
        if (next !== right) {
          parent = next.U;
          next.U = node.U;
          node = next.R;
          parent.L = node;
          next.R = right;
          right.U = next;
        } else {
          next.U = parent;
          parent = next;
          node = next.R;
        }
      } else {
        red = node.C;
        node = next;
      }
      if (node) node.U = parent;
      if (red) return;
      if (node && node.C) {
        node.C = false;
        return;
      }
      do {
        if (node === this._) break;
        if (node === parent.L) {
          sibling = parent.R;
          if (sibling.C) {
            sibling.C = false;
            parent.C = true;
            d3_geom_voronoiRedBlackRotateLeft(this, parent);
            sibling = parent.R;
          }
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
            if (!sibling.R || !sibling.R.C) {
              sibling.L.C = false;
              sibling.C = true;
              d3_geom_voronoiRedBlackRotateRight(this, sibling);
              sibling = parent.R;
            }
            sibling.C = parent.C;
            parent.C = sibling.R.C = false;
            d3_geom_voronoiRedBlackRotateLeft(this, parent);
            node = this._;
            break;
          }
        } else {
          sibling = parent.L;
          if (sibling.C) {
            sibling.C = false;
            parent.C = true;
            d3_geom_voronoiRedBlackRotateRight(this, parent);
            sibling = parent.L;
          }
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
            if (!sibling.L || !sibling.L.C) {
              sibling.R.C = false;
              sibling.C = true;
              d3_geom_voronoiRedBlackRotateLeft(this, sibling);
              sibling = parent.L;
            }
            sibling.C = parent.C;
            parent.C = sibling.L.C = false;
            d3_geom_voronoiRedBlackRotateRight(this, parent);
            node = this._;
            break;
          }
        }
        sibling.C = true;
        node = parent;
        parent = parent.U;
      } while (!node.C);
      if (node) node.C = false;
    }
  };
  function d3_geom_voronoiRedBlackRotateLeft(tree, node) {
    var p = node, q = node.R, parent = p.U;
    if (parent) {
      if (parent.L === p) parent.L = q; else parent.R = q;
    } else {
      tree._ = q;
    }
    q.U = parent;
    p.U = q;
    p.R = q.L;
    if (p.R) p.R.U = p;
    q.L = p;
  }
  function d3_geom_voronoiRedBlackRotateRight(tree, node) {
    var p = node, q = node.L, parent = p.U;
    if (parent) {
      if (parent.L === p) parent.L = q; else parent.R = q;
    } else {
      tree._ = q;
    }
    q.U = parent;
    p.U = q;
    p.L = q.R;
    if (p.L) p.L.U = p;
    q.R = p;
  }
  function d3_geom_voronoiRedBlackFirst(node) {
    while (node.L) node = node.L;
    return node;
  }
  function d3_geom_voronoi(sites, bbox) {
    var site = sites.sort(d3_geom_voronoiVertexOrder).pop(), x0, y0, circle;
    d3_geom_voronoiEdges = [];
    d3_geom_voronoiCells = new Array(sites.length);
    d3_geom_voronoiBeaches = new d3_geom_voronoiRedBlackTree();
    d3_geom_voronoiCircles = new d3_geom_voronoiRedBlackTree();
    while (true) {
      circle = d3_geom_voronoiFirstCircle;
      if (site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x)) {
        if (site.x !== x0 || site.y !== y0) {
          d3_geom_voronoiCells[site.i] = new d3_geom_voronoiCell(site);
          d3_geom_voronoiAddBeach(site);
          x0 = site.x, y0 = site.y;
        }
        site = sites.pop();
      } else if (circle) {
        d3_geom_voronoiRemoveBeach(circle.arc);
      } else {
        break;
      }
    }
    if (bbox) d3_geom_voronoiClipEdges(bbox), d3_geom_voronoiCloseCells(bbox);
    var diagram = {
      cells: d3_geom_voronoiCells,
      edges: d3_geom_voronoiEdges
    };
    d3_geom_voronoiBeaches = d3_geom_voronoiCircles = d3_geom_voronoiEdges = d3_geom_voronoiCells = null;
    return diagram;
  }
  function d3_geom_voronoiVertexOrder(a, b) {
    return b.y - a.y || b.x - a.x;
  }
  d3.geom.voronoi = function(points) {
    var x = d3_geom_pointX, y = d3_geom_pointY, fx = x, fy = y, clipExtent = d3_geom_voronoiClipExtent;
    if (points) return voronoi(points);
    function voronoi(data) {
      var polygons = new Array(data.length), x0 = clipExtent[0][0], y0 = clipExtent[0][1], x1 = clipExtent[1][0], y1 = clipExtent[1][1];
      d3_geom_voronoi(sites(data), clipExtent).cells.forEach(function(cell, i) {
        var edges = cell.edges, site = cell.site, polygon = polygons[i] = edges.length ? edges.map(function(e) {
          var s = e.start();
          return [ s.x, s.y ];
        }) : site.x >= x0 && site.x <= x1 && site.y >= y0 && site.y <= y1 ? [ [ x0, y1 ], [ x1, y1 ], [ x1, y0 ], [ x0, y0 ] ] : [];
        polygon.point = data[i];
      });
      return polygons;
    }
    function sites(data) {
      return data.map(function(d, i) {
        return {
          x: Math.round(fx(d, i) / ε) * ε,
          y: Math.round(fy(d, i) / ε) * ε,
          i: i
        };
      });
    }
    voronoi.links = function(data) {
      return d3_geom_voronoi(sites(data)).edges.filter(function(edge) {
        return edge.l && edge.r;
      }).map(function(edge) {
        return {
          source: data[edge.l.i],
          target: data[edge.r.i]
        };
      });
    };
    voronoi.triangles = function(data) {
      var triangles = [];
      d3_geom_voronoi(sites(data)).cells.forEach(function(cell, i) {
        var site = cell.site, edges = cell.edges.sort(d3_geom_voronoiHalfEdgeOrder), j = -1, m = edges.length, e0, s0, e1 = edges[m - 1].edge, s1 = e1.l === site ? e1.r : e1.l;
        while (++j < m) {
          e0 = e1;
          s0 = s1;
          e1 = edges[j].edge;
          s1 = e1.l === site ? e1.r : e1.l;
          if (i < s0.i && i < s1.i && d3_geom_voronoiTriangleArea(site, s0, s1) < 0) {
            triangles.push([ data[i], data[s0.i], data[s1.i] ]);
          }
        }
      });
      return triangles;
    };
    voronoi.x = function(_) {
      return arguments.length ? (fx = d3_functor(x = _), voronoi) : x;
    };
    voronoi.y = function(_) {
      return arguments.length ? (fy = d3_functor(y = _), voronoi) : y;
    };
    voronoi.clipExtent = function(_) {
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent;
      clipExtent = _ == null ? d3_geom_voronoiClipExtent : _;
      return voronoi;
    };
    voronoi.size = function(_) {
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent && clipExtent[1];
      return voronoi.clipExtent(_ && [ [ 0, 0 ], _ ]);
    };
    return voronoi;
  };
  var d3_geom_voronoiClipExtent = [ [ -1e6, -1e6 ], [ 1e6, 1e6 ] ];
  function d3_geom_voronoiTriangleArea(a, b, c) {
    return (a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y);
  }
  d3.geom.delaunay = function(vertices) {
    return d3.geom.voronoi().triangles(vertices);
  };
  d3.geom.quadtree = function(points, x1, y1, x2, y2) {
    var x = d3_geom_pointX, y = d3_geom_pointY, compat;
    if (compat = arguments.length) {
      x = d3_geom_quadtreeCompatX;
      y = d3_geom_quadtreeCompatY;
      if (compat === 3) {
        y2 = y1;
        x2 = x1;
        y1 = x1 = 0;
      }
      return quadtree(points);
    }
    function quadtree(data) {
      var d, fx = d3_functor(x), fy = d3_functor(y), xs, ys, i, n, x1_, y1_, x2_, y2_;
      if (x1 != null) {
        x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2;
      } else {
        x2_ = y2_ = -(x1_ = y1_ = Infinity);
        xs = [], ys = [];
        n = data.length;
        if (compat) for (i = 0; i < n; ++i) {
          d = data[i];
          if (d.x < x1_) x1_ = d.x;
          if (d.y < y1_) y1_ = d.y;
          if (d.x > x2_) x2_ = d.x;
          if (d.y > y2_) y2_ = d.y;
          xs.push(d.x);
          ys.push(d.y);
        } else for (i = 0; i < n; ++i) {
          var x_ = +fx(d = data[i], i), y_ = +fy(d, i);
          if (x_ < x1_) x1_ = x_;
          if (y_ < y1_) y1_ = y_;
          if (x_ > x2_) x2_ = x_;
          if (y_ > y2_) y2_ = y_;
          xs.push(x_);
          ys.push(y_);
        }
      }
      var dx = x2_ - x1_, dy = y2_ - y1_;
      if (dx > dy) y2_ = y1_ + dx; else x2_ = x1_ + dy;
      function insert(n, d, x, y, x1, y1, x2, y2) {
        if (isNaN(x) || isNaN(y)) return;
        if (n.leaf) {
          var nx = n.x, ny = n.y;
          if (nx != null) {
            if (abs(nx - x) + abs(ny - y) < .01) {
              insertChild(n, d, x, y, x1, y1, x2, y2);
            } else {
              var nPoint = n.point;
              n.x = n.y = n.point = null;
              insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);
              insertChild(n, d, x, y, x1, y1, x2, y2);
            }
          } else {
            n.x = x, n.y = y, n.point = d;
          }
        } else {
          insertChild(n, d, x, y, x1, y1, x2, y2);
        }
      }
      function insertChild(n, d, x, y, x1, y1, x2, y2) {
        var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, right = x >= sx, bottom = y >= sy, i = (bottom << 1) + right;
        n.leaf = false;
        n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode());
        if (right) x1 = sx; else x2 = sx;
        if (bottom) y1 = sy; else y2 = sy;
        insert(n, d, x, y, x1, y1, x2, y2);
      }
      var root = d3_geom_quadtreeNode();
      root.add = function(d) {
        insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_);
      };
      root.visit = function(f) {
        d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_);
      };
      i = -1;
      if (x1 == null) {
        while (++i < n) {
          insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_);
        }
        --i;
      } else data.forEach(root.add);
      xs = ys = data = d = null;
      return root;
    }
    quadtree.x = function(_) {
      return arguments.length ? (x = _, quadtree) : x;
    };
    quadtree.y = function(_) {
      return arguments.length ? (y = _, quadtree) : y;
    };
    quadtree.extent = function(_) {
      if (!arguments.length) return x1 == null ? null : [ [ x1, y1 ], [ x2, y2 ] ];
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], 
      y2 = +_[1][1];
      return quadtree;
    };
    quadtree.size = function(_) {
      if (!arguments.length) return x1 == null ? null : [ x2 - x1, y2 - y1 ];
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = y1 = 0, x2 = +_[0], y2 = +_[1];
      return quadtree;
    };
    return quadtree;
  };
  function d3_geom_quadtreeCompatX(d) {
    return d.x;
  }
  function d3_geom_quadtreeCompatY(d) {
    return d.y;
  }
  function d3_geom_quadtreeNode() {
    return {
      leaf: true,
      nodes: [],
      point: null,
      x: null,
      y: null
    };
  }
  function d3_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {
    if (!f(node, x1, y1, x2, y2)) {
      var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, children = node.nodes;
      if (children[0]) d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy);
      if (children[1]) d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy);
      if (children[2]) d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2);
      if (children[3]) d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2);
    }
  }
  d3.interpolateRgb = d3_interpolateRgb;
  function d3_interpolateRgb(a, b) {
    a = d3.rgb(a);
    b = d3.rgb(b);
    var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab;
    return function(t) {
      return "#" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t));
    };
  }
  d3.interpolateObject = d3_interpolateObject;
  function d3_interpolateObject(a, b) {
    var i = {}, c = {}, k;
    for (k in a) {
      if (k in b) {
        i[k] = d3_interpolate(a[k], b[k]);
      } else {
        c[k] = a[k];
      }
    }
    for (k in b) {
      if (!(k in a)) {
        c[k] = b[k];
      }
    }
    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }
  d3.interpolateNumber = d3_interpolateNumber;
  function d3_interpolateNumber(a, b) {
    b -= a = +a;
    return function(t) {
      return a + b * t;
    };
  }
  d3.interpolateString = d3_interpolateString;
  function d3_interpolateString(a, b) {
    var m, i, j, s0 = 0, s1 = 0, s = [], q = [], n, o;
    a = a + "", b = b + "";
    d3_interpolate_number.lastIndex = 0;
    for (i = 0; m = d3_interpolate_number.exec(b); ++i) {
      if (m.index) s.push(b.substring(s0, s1 = m.index));
      q.push({
        i: s.length,
        x: m[0]
      });
      s.push(null);
      s0 = d3_interpolate_number.lastIndex;
    }
    if (s0 < b.length) s.push(b.substring(s0));
    for (i = 0, n = q.length; (m = d3_interpolate_number.exec(a)) && i < n; ++i) {
      o = q[i];
      if (o.x == m[0]) {
        if (o.i) {
          if (s[o.i + 1] == null) {
            s[o.i - 1] += o.x;
            s.splice(o.i, 1);
            for (j = i + 1; j < n; ++j) q[j].i--;
          } else {
            s[o.i - 1] += o.x + s[o.i + 1];
            s.splice(o.i, 2);
            for (j = i + 1; j < n; ++j) q[j].i -= 2;
          }
        } else {
          if (s[o.i + 1] == null) {
            s[o.i] = o.x;
          } else {
            s[o.i] = o.x + s[o.i + 1];
            s.splice(o.i + 1, 1);
            for (j = i + 1; j < n; ++j) q[j].i--;
          }
        }
        q.splice(i, 1);
        n--;
        i--;
      } else {
        o.x = d3_interpolateNumber(parseFloat(m[0]), parseFloat(o.x));
      }
    }
    while (i < n) {
      o = q.pop();
      if (s[o.i + 1] == null) {
        s[o.i] = o.x;
      } else {
        s[o.i] = o.x + s[o.i + 1];
        s.splice(o.i + 1, 1);
      }
      n--;
    }
    if (s.length === 1) {
      return s[0] == null ? (o = q[0].x, function(t) {
        return o(t) + "";
      }) : function() {
        return b;
      };
    }
    return function(t) {
      for (i = 0; i < n; ++i) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  }
  var d3_interpolate_number = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
  d3.interpolate = d3_interpolate;
  function d3_interpolate(a, b) {
    var i = d3.interpolators.length, f;
    while (--i >= 0 && !(f = d3.interpolators[i](a, b))) ;
    return f;
  }
  d3.interpolators = [ function(a, b) {
    var t = typeof b;
    return (t === "string" ? d3_rgb_names.has(b) || /^(#|rgb\(|hsl\()/.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_Color ? d3_interpolateRgb : t === "object" ? Array.isArray(b) ? d3_interpolateArray : d3_interpolateObject : d3_interpolateNumber)(a, b);
  } ];
  d3.interpolateArray = d3_interpolateArray;
  function d3_interpolateArray(a, b) {
    var x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length), i;
    for (i = 0; i < n0; ++i) x.push(d3_interpolate(a[i], b[i]));
    for (;i < na; ++i) c[i] = a[i];
    for (;i < nb; ++i) c[i] = b[i];
    return function(t) {
      for (i = 0; i < n0; ++i) c[i] = x[i](t);
      return c;
    };
  }
  var d3_ease_default = function() {
    return d3_identity;
  };
  var d3_ease = d3.map({
    linear: d3_ease_default,
    poly: d3_ease_poly,
    quad: function() {
      return d3_ease_quad;
    },
    cubic: function() {
      return d3_ease_cubic;
    },
    sin: function() {
      return d3_ease_sin;
    },
    exp: function() {
      return d3_ease_exp;
    },
    circle: function() {
      return d3_ease_circle;
    },
    elastic: d3_ease_elastic,
    back: d3_ease_back,
    bounce: function() {
      return d3_ease_bounce;
    }
  });
  var d3_ease_mode = d3.map({
    "in": d3_identity,
    out: d3_ease_reverse,
    "in-out": d3_ease_reflect,
    "out-in": function(f) {
      return d3_ease_reflect(d3_ease_reverse(f));
    }
  });
  d3.ease = function(name) {
    var i = name.indexOf("-"), t = i >= 0 ? name.substring(0, i) : name, m = i >= 0 ? name.substring(i + 1) : "in";
    t = d3_ease.get(t) || d3_ease_default;
    m = d3_ease_mode.get(m) || d3_identity;
    return d3_ease_clamp(m(t.apply(null, d3_arraySlice.call(arguments, 1))));
  };
  function d3_ease_clamp(f) {
    return function(t) {
      return t <= 0 ? 0 : t >= 1 ? 1 : f(t);
    };
  }
  function d3_ease_reverse(f) {
    return function(t) {
      return 1 - f(1 - t);
    };
  }
  function d3_ease_reflect(f) {
    return function(t) {
      return .5 * (t < .5 ? f(2 * t) : 2 - f(2 - 2 * t));
    };
  }
  function d3_ease_quad(t) {
    return t * t;
  }
  function d3_ease_cubic(t) {
    return t * t * t;
  }
  function d3_ease_cubicInOut(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    var t2 = t * t, t3 = t2 * t;
    return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);
  }
  function d3_ease_poly(e) {
    return function(t) {
      return Math.pow(t, e);
    };
  }
  function d3_ease_sin(t) {
    return 1 - Math.cos(t * halfπ);
  }
  function d3_ease_exp(t) {
    return Math.pow(2, 10 * (t - 1));
  }
  function d3_ease_circle(t) {
    return 1 - Math.sqrt(1 - t * t);
  }
  function d3_ease_elastic(a, p) {
    var s;
    if (arguments.length < 2) p = .45;
    if (arguments.length) s = p / τ * Math.asin(1 / a); else a = 1, s = p / 4;
    return function(t) {
      return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * τ / p);
    };
  }
  function d3_ease_back(s) {
    if (!s) s = 1.70158;
    return function(t) {
      return t * t * ((s + 1) * t - s);
    };
  }
  function d3_ease_bounce(t) {
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
  }
  d3.interpolateHcl = d3_interpolateHcl;
  function d3_interpolateHcl(a, b) {
    a = d3.hcl(a);
    b = d3.hcl(b);
    var ah = a.h, ac = a.c, al = a.l, bh = b.h - ah, bc = b.c - ac, bl = b.l - al;
    if (isNaN(bc)) bc = 0, ac = isNaN(ac) ? b.c : ac;
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
    return function(t) {
      return d3_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + "";
    };
  }
  d3.interpolateHsl = d3_interpolateHsl;
  function d3_interpolateHsl(a, b) {
    a = d3.hsl(a);
    b = d3.hsl(b);
    var ah = a.h, as = a.s, al = a.l, bh = b.h - ah, bs = b.s - as, bl = b.l - al;
    if (isNaN(bs)) bs = 0, as = isNaN(as) ? b.s : as;
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
    return function(t) {
      return d3_hsl_rgb(ah + bh * t, as + bs * t, al + bl * t) + "";
    };
  }
  d3.interpolateLab = d3_interpolateLab;
  function d3_interpolateLab(a, b) {
    a = d3.lab(a);
    b = d3.lab(b);
    var al = a.l, aa = a.a, ab = a.b, bl = b.l - al, ba = b.a - aa, bb = b.b - ab;
    return function(t) {
      return d3_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + "";
    };
  }
  d3.interpolateRound = d3_interpolateRound;
  function d3_interpolateRound(a, b) {
    b -= a;
    return function(t) {
      return Math.round(a + b * t);
    };
  }
  d3.transform = function(string) {
    var g = d3_document.createElementNS(d3.ns.prefix.svg, "g");
    return (d3.transform = function(string) {
      if (string != null) {
        g.setAttribute("transform", string);
        var t = g.transform.baseVal.consolidate();
      }
      return new d3_transform(t ? t.matrix : d3_transformIdentity);
    })(string);
  };
  function d3_transform(m) {
    var r0 = [ m.a, m.b ], r1 = [ m.c, m.d ], kx = d3_transformNormalize(r0), kz = d3_transformDot(r0, r1), ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0;
    if (r0[0] * r1[1] < r1[0] * r0[1]) {
      r0[0] *= -1;
      r0[1] *= -1;
      kx *= -1;
      kz *= -1;
    }
    this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees;
    this.translate = [ m.e, m.f ];
    this.scale = [ kx, ky ];
    this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0;
  }
  d3_transform.prototype.toString = function() {
    return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")";
  };
  function d3_transformDot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }
  function d3_transformNormalize(a) {
    var k = Math.sqrt(d3_transformDot(a, a));
    if (k) {
      a[0] /= k;
      a[1] /= k;
    }
    return k;
  }
  function d3_transformCombine(a, b, k) {
    a[0] += k * b[0];
    a[1] += k * b[1];
    return a;
  }
  var d3_transformIdentity = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0
  };
  d3.interpolateTransform = d3_interpolateTransform;
  function d3_interpolateTransform(a, b) {
    var s = [], q = [], n, A = d3.transform(a), B = d3.transform(b), ta = A.translate, tb = B.translate, ra = A.rotate, rb = B.rotate, wa = A.skew, wb = B.skew, ka = A.scale, kb = B.scale;
    if (ta[0] != tb[0] || ta[1] != tb[1]) {
      s.push("translate(", null, ",", null, ")");
      q.push({
        i: 1,
        x: d3_interpolateNumber(ta[0], tb[0])
      }, {
        i: 3,
        x: d3_interpolateNumber(ta[1], tb[1])
      });
    } else if (tb[0] || tb[1]) {
      s.push("translate(" + tb + ")");
    } else {
      s.push("");
    }
    if (ra != rb) {
      if (ra - rb > 180) rb += 360; else if (rb - ra > 180) ra += 360;
      q.push({
        i: s.push(s.pop() + "rotate(", null, ")") - 2,
        x: d3_interpolateNumber(ra, rb)
      });
    } else if (rb) {
      s.push(s.pop() + "rotate(" + rb + ")");
    }
    if (wa != wb) {
      q.push({
        i: s.push(s.pop() + "skewX(", null, ")") - 2,
        x: d3_interpolateNumber(wa, wb)
      });
    } else if (wb) {
      s.push(s.pop() + "skewX(" + wb + ")");
    }
    if (ka[0] != kb[0] || ka[1] != kb[1]) {
      n = s.push(s.pop() + "scale(", null, ",", null, ")");
      q.push({
        i: n - 4,
        x: d3_interpolateNumber(ka[0], kb[0])
      }, {
        i: n - 2,
        x: d3_interpolateNumber(ka[1], kb[1])
      });
    } else if (kb[0] != 1 || kb[1] != 1) {
      s.push(s.pop() + "scale(" + kb + ")");
    }
    n = q.length;
    return function(t) {
      var i = -1, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  }
  function d3_uninterpolateNumber(a, b) {
    b = b - (a = +a) ? 1 / (b - a) : 0;
    return function(x) {
      return (x - a) * b;
    };
  }
  function d3_uninterpolateClamp(a, b) {
    b = b - (a = +a) ? 1 / (b - a) : 0;
    return function(x) {
      return Math.max(0, Math.min(1, (x - a) * b));
    };
  }
  d3.layout = {};
  d3.layout.bundle = function() {
    return function(links) {
      var paths = [], i = -1, n = links.length;
      while (++i < n) paths.push(d3_layout_bundlePath(links[i]));
      return paths;
    };
  };
  function d3_layout_bundlePath(link) {
    var start = link.source, end = link.target, lca = d3_layout_bundleLeastCommonAncestor(start, end), points = [ start ];
    while (start !== lca) {
      start = start.parent;
      points.push(start);
    }
    var k = points.length;
    while (end !== lca) {
      points.splice(k, 0, end);
      end = end.parent;
    }
    return points;
  }
  function d3_layout_bundleAncestors(node) {
    var ancestors = [], parent = node.parent;
    while (parent != null) {
      ancestors.push(node);
      node = parent;
      parent = parent.parent;
    }
    ancestors.push(node);
    return ancestors;
  }
  function d3_layout_bundleLeastCommonAncestor(a, b) {
    if (a === b) return a;
    var aNodes = d3_layout_bundleAncestors(a), bNodes = d3_layout_bundleAncestors(b), aNode = aNodes.pop(), bNode = bNodes.pop(), sharedNode = null;
    while (aNode === bNode) {
      sharedNode = aNode;
      aNode = aNodes.pop();
      bNode = bNodes.pop();
    }
    return sharedNode;
  }
  d3.layout.chord = function() {
    var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;
    function relayout() {
      var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;
      chords = [];
      groups = [];
      k = 0, i = -1;
      while (++i < n) {
        x = 0, j = -1;
        while (++j < n) {
          x += matrix[i][j];
        }
        groupSums.push(x);
        subgroupIndex.push(d3.range(n));
        k += x;
      }
      if (sortGroups) {
        groupIndex.sort(function(a, b) {
          return sortGroups(groupSums[a], groupSums[b]);
        });
      }
      if (sortSubgroups) {
        subgroupIndex.forEach(function(d, i) {
          d.sort(function(a, b) {
            return sortSubgroups(matrix[i][a], matrix[i][b]);
          });
        });
      }
      k = (τ - padding * n) / k;
      x = 0, i = -1;
      while (++i < n) {
        x0 = x, j = -1;
        while (++j < n) {
          var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;
          subgroups[di + "-" + dj] = {
            index: di,
            subindex: dj,
            startAngle: a0,
            endAngle: a1,
            value: v
          };
        }
        groups[di] = {
          index: di,
          startAngle: x0,
          endAngle: x,
          value: (x - x0) / k
        };
        x += padding;
      }
      i = -1;
      while (++i < n) {
        j = i - 1;
        while (++j < n) {
          var source = subgroups[i + "-" + j], target = subgroups[j + "-" + i];
          if (source.value || target.value) {
            chords.push(source.value < target.value ? {
              source: target,
              target: source
            } : {
              source: source,
              target: target
            });
          }
        }
      }
      if (sortChords) resort();
    }
    function resort() {
      chords.sort(function(a, b) {
        return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
      });
    }
    chord.matrix = function(x) {
      if (!arguments.length) return matrix;
      n = (matrix = x) && matrix.length;
      chords = groups = null;
      return chord;
    };
    chord.padding = function(x) {
      if (!arguments.length) return padding;
      padding = x;
      chords = groups = null;
      return chord;
    };
    chord.sortGroups = function(x) {
      if (!arguments.length) return sortGroups;
      sortGroups = x;
      chords = groups = null;
      return chord;
    };
    chord.sortSubgroups = function(x) {
      if (!arguments.length) return sortSubgroups;
      sortSubgroups = x;
      chords = null;
      return chord;
    };
    chord.sortChords = function(x) {
      if (!arguments.length) return sortChords;
      sortChords = x;
      if (chords) resort();
      return chord;
    };
    chord.chords = function() {
      if (!chords) relayout();
      return chords;
    };
    chord.groups = function() {
      if (!groups) relayout();
      return groups;
    };
    return chord;
  };
  d3.layout.force = function() {
    var force = {}, event = d3.dispatch("start", "tick", "end"), size = [ 1, 1 ], drag, alpha, friction = .9, linkDistance = d3_layout_forceLinkDistance, linkStrength = d3_layout_forceLinkStrength, charge = -30, gravity = .1, theta = .8, nodes = [], links = [], distances, strengths, charges;
    function repulse(node) {
      return function(quad, x1, _, x2) {
        if (quad.point !== node) {
          var dx = quad.cx - node.x, dy = quad.cy - node.y, dn = 1 / Math.sqrt(dx * dx + dy * dy);
          if ((x2 - x1) * dn < theta) {
            var k = quad.charge * dn * dn;
            node.px -= dx * k;
            node.py -= dy * k;
            return true;
          }
          if (quad.point && isFinite(dn)) {
            var k = quad.pointCharge * dn * dn;
            node.px -= dx * k;
            node.py -= dy * k;
          }
        }
        return !quad.charge;
      };
    }
    force.tick = function() {
      if ((alpha *= .99) < .005) {
        event.end({
          type: "end",
          alpha: alpha = 0
        });
        return true;
      }
      var n = nodes.length, m = links.length, q, i, o, s, t, l, k, x, y;
      for (i = 0; i < m; ++i) {
        o = links[i];
        s = o.source;
        t = o.target;
        x = t.x - s.x;
        y = t.y - s.y;
        if (l = x * x + y * y) {
          l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;
          x *= l;
          y *= l;
          t.x -= x * (k = s.weight / (t.weight + s.weight));
          t.y -= y * k;
          s.x += x * (k = 1 - k);
          s.y += y * k;
        }
      }
      if (k = alpha * gravity) {
        x = size[0] / 2;
        y = size[1] / 2;
        i = -1;
        if (k) while (++i < n) {
          o = nodes[i];
          o.x += (x - o.x) * k;
          o.y += (y - o.y) * k;
        }
      }
      if (charge) {
        d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges);
        i = -1;
        while (++i < n) {
          if (!(o = nodes[i]).fixed) {
            q.visit(repulse(o));
          }
        }
      }
      i = -1;
      while (++i < n) {
        o = nodes[i];
        if (o.fixed) {
          o.x = o.px;
          o.y = o.py;
        } else {
          o.x -= (o.px - (o.px = o.x)) * friction;
          o.y -= (o.py - (o.py = o.y)) * friction;
        }
      }
      event.tick({
        type: "tick",
        alpha: alpha
      });
    };
    force.nodes = function(x) {
      if (!arguments.length) return nodes;
      nodes = x;
      return force;
    };
    force.links = function(x) {
      if (!arguments.length) return links;
      links = x;
      return force;
    };
    force.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return force;
    };
    force.linkDistance = function(x) {
      if (!arguments.length) return linkDistance;
      linkDistance = typeof x === "function" ? x : +x;
      return force;
    };
    force.distance = force.linkDistance;
    force.linkStrength = function(x) {
      if (!arguments.length) return linkStrength;
      linkStrength = typeof x === "function" ? x : +x;
      return force;
    };
    force.friction = function(x) {
      if (!arguments.length) return friction;
      friction = +x;
      return force;
    };
    force.charge = function(x) {
      if (!arguments.length) return charge;
      charge = typeof x === "function" ? x : +x;
      return force;
    };
    force.gravity = function(x) {
      if (!arguments.length) return gravity;
      gravity = +x;
      return force;
    };
    force.theta = function(x) {
      if (!arguments.length) return theta;
      theta = +x;
      return force;
    };
    force.alpha = function(x) {
      if (!arguments.length) return alpha;
      x = +x;
      if (alpha) {
        if (x > 0) alpha = x; else alpha = 0;
      } else if (x > 0) {
        event.start({
          type: "start",
          alpha: alpha = x
        });
        d3.timer(force.tick);
      }
      return force;
    };
    force.start = function() {
      var i, n = nodes.length, m = links.length, w = size[0], h = size[1], neighbors, o;
      for (i = 0; i < n; ++i) {
        (o = nodes[i]).index = i;
        o.weight = 0;
      }
      for (i = 0; i < m; ++i) {
        o = links[i];
        if (typeof o.source == "number") o.source = nodes[o.source];
        if (typeof o.target == "number") o.target = nodes[o.target];
        ++o.source.weight;
        ++o.target.weight;
      }
      for (i = 0; i < n; ++i) {
        o = nodes[i];
        if (isNaN(o.x)) o.x = position("x", w);
        if (isNaN(o.y)) o.y = position("y", h);
        if (isNaN(o.px)) o.px = o.x;
        if (isNaN(o.py)) o.py = o.y;
      }
      distances = [];
      if (typeof linkDistance === "function") for (i = 0; i < m; ++i) distances[i] = +linkDistance.call(this, links[i], i); else for (i = 0; i < m; ++i) distances[i] = linkDistance;
      strengths = [];
      if (typeof linkStrength === "function") for (i = 0; i < m; ++i) strengths[i] = +linkStrength.call(this, links[i], i); else for (i = 0; i < m; ++i) strengths[i] = linkStrength;
      charges = [];
      if (typeof charge === "function") for (i = 0; i < n; ++i) charges[i] = +charge.call(this, nodes[i], i); else for (i = 0; i < n; ++i) charges[i] = charge;
      function position(dimension, size) {
        if (!neighbors) {
          neighbors = new Array(n);
          for (j = 0; j < n; ++j) {
            neighbors[j] = [];
          }
          for (j = 0; j < m; ++j) {
            var o = links[j];
            neighbors[o.source.index].push(o.target);
            neighbors[o.target.index].push(o.source);
          }
        }
        var candidates = neighbors[i], j = -1, m = candidates.length, x;
        while (++j < m) if (!isNaN(x = candidates[j][dimension])) return x;
        return Math.random() * size;
      }
      return force.resume();
    };
    force.resume = function() {
      return force.alpha(.1);
    };
    force.stop = function() {
      return force.alpha(0);
    };
    force.drag = function() {
      if (!drag) drag = d3.behavior.drag().origin(d3_identity).on("dragstart.force", d3_layout_forceDragstart).on("drag.force", dragmove).on("dragend.force", d3_layout_forceDragend);
      if (!arguments.length) return drag;
      this.on("mouseover.force", d3_layout_forceMouseover).on("mouseout.force", d3_layout_forceMouseout).call(drag);
    };
    function dragmove(d) {
      d.px = d3.event.x, d.py = d3.event.y;
      force.resume();
    }
    return d3.rebind(force, event, "on");
  };
  function d3_layout_forceDragstart(d) {
    d.fixed |= 2;
  }
  function d3_layout_forceDragend(d) {
    d.fixed &= ~6;
  }
  function d3_layout_forceMouseover(d) {
    d.fixed |= 4;
    d.px = d.x, d.py = d.y;
  }
  function d3_layout_forceMouseout(d) {
    d.fixed &= ~4;
  }
  function d3_layout_forceAccumulate(quad, alpha, charges) {
    var cx = 0, cy = 0;
    quad.charge = 0;
    if (!quad.leaf) {
      var nodes = quad.nodes, n = nodes.length, i = -1, c;
      while (++i < n) {
        c = nodes[i];
        if (c == null) continue;
        d3_layout_forceAccumulate(c, alpha, charges);
        quad.charge += c.charge;
        cx += c.charge * c.cx;
        cy += c.charge * c.cy;
      }
    }
    if (quad.point) {
      if (!quad.leaf) {
        quad.point.x += Math.random() - .5;
        quad.point.y += Math.random() - .5;
      }
      var k = alpha * charges[quad.point.index];
      quad.charge += quad.pointCharge = k;
      cx += k * quad.point.x;
      cy += k * quad.point.y;
    }
    quad.cx = cx / quad.charge;
    quad.cy = cy / quad.charge;
  }
  var d3_layout_forceLinkDistance = 20, d3_layout_forceLinkStrength = 1;
  d3.layout.hierarchy = function() {
    var sort = d3_layout_hierarchySort, children = d3_layout_hierarchyChildren, value = d3_layout_hierarchyValue;
    function recurse(node, depth, nodes) {
      var childs = children.call(hierarchy, node, depth);
      node.depth = depth;
      nodes.push(node);
      if (childs && (n = childs.length)) {
        var i = -1, n, c = node.children = new Array(n), v = 0, j = depth + 1, d;
        while (++i < n) {
          d = c[i] = recurse(childs[i], j, nodes);
          d.parent = node;
          v += d.value;
        }
        if (sort) c.sort(sort);
        if (value) node.value = v;
      } else {
        delete node.children;
        if (value) {
          node.value = +value.call(hierarchy, node, depth) || 0;
        }
      }
      return node;
    }
    function revalue(node, depth) {
      var children = node.children, v = 0;
      if (children && (n = children.length)) {
        var i = -1, n, j = depth + 1;
        while (++i < n) v += revalue(children[i], j);
      } else if (value) {
        v = +value.call(hierarchy, node, depth) || 0;
      }
      if (value) node.value = v;
      return v;
    }
    function hierarchy(d) {
      var nodes = [];
      recurse(d, 0, nodes);
      return nodes;
    }
    hierarchy.sort = function(x) {
      if (!arguments.length) return sort;
      sort = x;
      return hierarchy;
    };
    hierarchy.children = function(x) {
      if (!arguments.length) return children;
      children = x;
      return hierarchy;
    };
    hierarchy.value = function(x) {
      if (!arguments.length) return value;
      value = x;
      return hierarchy;
    };
    hierarchy.revalue = function(root) {
      revalue(root, 0);
      return root;
    };
    return hierarchy;
  };
  function d3_layout_hierarchyRebind(object, hierarchy) {
    d3.rebind(object, hierarchy, "sort", "children", "value");
    object.nodes = object;
    object.links = d3_layout_hierarchyLinks;
    return object;
  }
  function d3_layout_hierarchyChildren(d) {
    return d.children;
  }
  function d3_layout_hierarchyValue(d) {
    return d.value;
  }
  function d3_layout_hierarchySort(a, b) {
    return b.value - a.value;
  }
  function d3_layout_hierarchyLinks(nodes) {
    return d3.merge(nodes.map(function(parent) {
      return (parent.children || []).map(function(child) {
        return {
          source: parent,
          target: child
        };
      });
    }));
  }
  d3.layout.partition = function() {
    var hierarchy = d3.layout.hierarchy(), size = [ 1, 1 ];
    function position(node, x, dx, dy) {
      var children = node.children;
      node.x = x;
      node.y = node.depth * dy;
      node.dx = dx;
      node.dy = dy;
      if (children && (n = children.length)) {
        var i = -1, n, c, d;
        dx = node.value ? dx / node.value : 0;
        while (++i < n) {
          position(c = children[i], x, d = c.value * dx, dy);
          x += d;
        }
      }
    }
    function depth(node) {
      var children = node.children, d = 0;
      if (children && (n = children.length)) {
        var i = -1, n;
        while (++i < n) d = Math.max(d, depth(children[i]));
      }
      return 1 + d;
    }
    function partition(d, i) {
      var nodes = hierarchy.call(this, d, i);
      position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));
      return nodes;
    }
    partition.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return partition;
    };
    return d3_layout_hierarchyRebind(partition, hierarchy);
  };
  d3.layout.pie = function() {
    var value = Number, sort = d3_layout_pieSortByValue, startAngle = 0, endAngle = τ;
    function pie(data) {
      var values = data.map(function(d, i) {
        return +value.call(pie, d, i);
      });
      var a = +(typeof startAngle === "function" ? startAngle.apply(this, arguments) : startAngle);
      var k = ((typeof endAngle === "function" ? endAngle.apply(this, arguments) : endAngle) - a) / d3.sum(values);
      var index = d3.range(data.length);
      if (sort != null) index.sort(sort === d3_layout_pieSortByValue ? function(i, j) {
        return values[j] - values[i];
      } : function(i, j) {
        return sort(data[i], data[j]);
      });
      var arcs = [];
      index.forEach(function(i) {
        var d;
        arcs[i] = {
          data: data[i],
          value: d = values[i],
          startAngle: a,
          endAngle: a += d * k
        };
      });
      return arcs;
    }
    pie.value = function(x) {
      if (!arguments.length) return value;
      value = x;
      return pie;
    };
    pie.sort = function(x) {
      if (!arguments.length) return sort;
      sort = x;
      return pie;
    };
    pie.startAngle = function(x) {
      if (!arguments.length) return startAngle;
      startAngle = x;
      return pie;
    };
    pie.endAngle = function(x) {
      if (!arguments.length) return endAngle;
      endAngle = x;
      return pie;
    };
    return pie;
  };
  var d3_layout_pieSortByValue = {};
  d3.layout.stack = function() {
    var values = d3_identity, order = d3_layout_stackOrderDefault, offset = d3_layout_stackOffsetZero, out = d3_layout_stackOut, x = d3_layout_stackX, y = d3_layout_stackY;
    function stack(data, index) {
      var series = data.map(function(d, i) {
        return values.call(stack, d, i);
      });
      var points = series.map(function(d) {
        return d.map(function(v, i) {
          return [ x.call(stack, v, i), y.call(stack, v, i) ];
        });
      });
      var orders = order.call(stack, points, index);
      series = d3.permute(series, orders);
      points = d3.permute(points, orders);
      var offsets = offset.call(stack, points, index);
      var n = series.length, m = series[0].length, i, j, o;
      for (j = 0; j < m; ++j) {
        out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);
        for (i = 1; i < n; ++i) {
          out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);
        }
      }
      return data;
    }
    stack.values = function(x) {
      if (!arguments.length) return values;
      values = x;
      return stack;
    };
    stack.order = function(x) {
      if (!arguments.length) return order;
      order = typeof x === "function" ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault;
      return stack;
    };
    stack.offset = function(x) {
      if (!arguments.length) return offset;
      offset = typeof x === "function" ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero;
      return stack;
    };
    stack.x = function(z) {
      if (!arguments.length) return x;
      x = z;
      return stack;
    };
    stack.y = function(z) {
      if (!arguments.length) return y;
      y = z;
      return stack;
    };
    stack.out = function(z) {
      if (!arguments.length) return out;
      out = z;
      return stack;
    };
    return stack;
  };
  function d3_layout_stackX(d) {
    return d.x;
  }
  function d3_layout_stackY(d) {
    return d.y;
  }
  function d3_layout_stackOut(d, y0, y) {
    d.y0 = y0;
    d.y = y;
  }
  var d3_layout_stackOrders = d3.map({
    "inside-out": function(data) {
      var n = data.length, i, j, max = data.map(d3_layout_stackMaxIndex), sums = data.map(d3_layout_stackReduceSum), index = d3.range(n).sort(function(a, b) {
        return max[a] - max[b];
      }), top = 0, bottom = 0, tops = [], bottoms = [];
      for (i = 0; i < n; ++i) {
        j = index[i];
        if (top < bottom) {
          top += sums[j];
          tops.push(j);
        } else {
          bottom += sums[j];
          bottoms.push(j);
        }
      }
      return bottoms.reverse().concat(tops);
    },
    reverse: function(data) {
      return d3.range(data.length).reverse();
    },
    "default": d3_layout_stackOrderDefault
  });
  var d3_layout_stackOffsets = d3.map({
    silhouette: function(data) {
      var n = data.length, m = data[0].length, sums = [], max = 0, i, j, o, y0 = [];
      for (j = 0; j < m; ++j) {
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
        if (o > max) max = o;
        sums.push(o);
      }
      for (j = 0; j < m; ++j) {
        y0[j] = (max - sums[j]) / 2;
      }
      return y0;
    },
    wiggle: function(data) {
      var n = data.length, x = data[0], m = x.length, i, j, k, s1, s2, s3, dx, o, o0, y0 = [];
      y0[0] = o = o0 = 0;
      for (j = 1; j < m; ++j) {
        for (i = 0, s1 = 0; i < n; ++i) s1 += data[i][j][1];
        for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; i < n; ++i) {
          for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); k < i; ++k) {
            s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;
          }
          s2 += s3 * data[i][j][1];
        }
        y0[j] = o -= s1 ? s2 / s1 * dx : 0;
        if (o < o0) o0 = o;
      }
      for (j = 0; j < m; ++j) y0[j] -= o0;
      return y0;
    },
    expand: function(data) {
      var n = data.length, m = data[0].length, k = 1 / n, i, j, o, y0 = [];
      for (j = 0; j < m; ++j) {
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
        if (o) for (i = 0; i < n; i++) data[i][j][1] /= o; else for (i = 0; i < n; i++) data[i][j][1] = k;
      }
      for (j = 0; j < m; ++j) y0[j] = 0;
      return y0;
    },
    zero: d3_layout_stackOffsetZero
  });
  function d3_layout_stackOrderDefault(data) {
    return d3.range(data.length);
  }
  function d3_layout_stackOffsetZero(data) {
    var j = -1, m = data[0].length, y0 = [];
    while (++j < m) y0[j] = 0;
    return y0;
  }
  function d3_layout_stackMaxIndex(array) {
    var i = 1, j = 0, v = array[0][1], k, n = array.length;
    for (;i < n; ++i) {
      if ((k = array[i][1]) > v) {
        j = i;
        v = k;
      }
    }
    return j;
  }
  function d3_layout_stackReduceSum(d) {
    return d.reduce(d3_layout_stackSum, 0);
  }
  function d3_layout_stackSum(p, d) {
    return p + d[1];
  }
  d3.layout.histogram = function() {
    var frequency = true, valuer = Number, ranger = d3_layout_histogramRange, binner = d3_layout_histogramBinSturges;
    function histogram(data, i) {
      var bins = [], values = data.map(valuer, this), range = ranger.call(this, values, i), thresholds = binner.call(this, range, values, i), bin, i = -1, n = values.length, m = thresholds.length - 1, k = frequency ? 1 : 1 / n, x;
      while (++i < m) {
        bin = bins[i] = [];
        bin.dx = thresholds[i + 1] - (bin.x = thresholds[i]);
        bin.y = 0;
      }
      if (m > 0) {
        i = -1;
        while (++i < n) {
          x = values[i];
          if (x >= range[0] && x <= range[1]) {
            bin = bins[d3.bisect(thresholds, x, 1, m) - 1];
            bin.y += k;
            bin.push(data[i]);
          }
        }
      }
      return bins;
    }
    histogram.value = function(x) {
      if (!arguments.length) return valuer;
      valuer = x;
      return histogram;
    };
    histogram.range = function(x) {
      if (!arguments.length) return ranger;
      ranger = d3_functor(x);
      return histogram;
    };
    histogram.bins = function(x) {
      if (!arguments.length) return binner;
      binner = typeof x === "number" ? function(range) {
        return d3_layout_histogramBinFixed(range, x);
      } : d3_functor(x);
      return histogram;
    };
    histogram.frequency = function(x) {
      if (!arguments.length) return frequency;
      frequency = !!x;
      return histogram;
    };
    return histogram;
  };
  function d3_layout_histogramBinSturges(range, values) {
    return d3_layout_histogramBinFixed(range, Math.ceil(Math.log(values.length) / Math.LN2 + 1));
  }
  function d3_layout_histogramBinFixed(range, n) {
    var x = -1, b = +range[0], m = (range[1] - b) / n, f = [];
    while (++x <= n) f[x] = m * x + b;
    return f;
  }
  function d3_layout_histogramRange(values) {
    return [ d3.min(values), d3.max(values) ];
  }
  d3.layout.tree = function() {
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false;
    function tree(d, i) {
      var nodes = hierarchy.call(this, d, i), root = nodes[0];
      function firstWalk(node, previousSibling) {
        var children = node.children, layout = node._tree;
        if (children && (n = children.length)) {
          var n, firstChild = children[0], previousChild, ancestor = firstChild, child, i = -1;
          while (++i < n) {
            child = children[i];
            firstWalk(child, previousChild);
            ancestor = apportion(child, previousChild, ancestor);
            previousChild = child;
          }
          d3_layout_treeShift(node);
          var midpoint = .5 * (firstChild._tree.prelim + child._tree.prelim);
          if (previousSibling) {
            layout.prelim = previousSibling._tree.prelim + separation(node, previousSibling);
            layout.mod = layout.prelim - midpoint;
          } else {
            layout.prelim = midpoint;
          }
        } else {
          if (previousSibling) {
            layout.prelim = previousSibling._tree.prelim + separation(node, previousSibling);
          }
        }
      }
      function secondWalk(node, x) {
        node.x = node._tree.prelim + x;
        var children = node.children;
        if (children && (n = children.length)) {
          var i = -1, n;
          x += node._tree.mod;
          while (++i < n) {
            secondWalk(children[i], x);
          }
        }
      }
      function apportion(node, previousSibling, ancestor) {
        if (previousSibling) {
          var vip = node, vop = node, vim = previousSibling, vom = node.parent.children[0], sip = vip._tree.mod, sop = vop._tree.mod, sim = vim._tree.mod, som = vom._tree.mod, shift;
          while (vim = d3_layout_treeRight(vim), vip = d3_layout_treeLeft(vip), vim && vip) {
            vom = d3_layout_treeLeft(vom);
            vop = d3_layout_treeRight(vop);
            vop._tree.ancestor = node;
            shift = vim._tree.prelim + sim - vip._tree.prelim - sip + separation(vim, vip);
            if (shift > 0) {
              d3_layout_treeMove(d3_layout_treeAncestor(vim, node, ancestor), node, shift);
              sip += shift;
              sop += shift;
            }
            sim += vim._tree.mod;
            sip += vip._tree.mod;
            som += vom._tree.mod;
            sop += vop._tree.mod;
          }
          if (vim && !d3_layout_treeRight(vop)) {
            vop._tree.thread = vim;
            vop._tree.mod += sim - sop;
          }
          if (vip && !d3_layout_treeLeft(vom)) {
            vom._tree.thread = vip;
            vom._tree.mod += sip - som;
            ancestor = node;
          }
        }
        return ancestor;
      }
      d3_layout_treeVisitAfter(root, function(node, previousSibling) {
        node._tree = {
          ancestor: node,
          prelim: 0,
          mod: 0,
          change: 0,
          shift: 0,
          number: previousSibling ? previousSibling._tree.number + 1 : 0
        };
      });
      firstWalk(root);
      secondWalk(root, -root._tree.prelim);
      var left = d3_layout_treeSearch(root, d3_layout_treeLeftmost), right = d3_layout_treeSearch(root, d3_layout_treeRightmost), deep = d3_layout_treeSearch(root, d3_layout_treeDeepest), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2, y1 = deep.depth || 1;
      d3_layout_treeVisitAfter(root, nodeSize ? function(node) {
        node.x *= size[0];
        node.y = node.depth * size[1];
        delete node._tree;
      } : function(node) {
        node.x = (node.x - x0) / (x1 - x0) * size[0];
        node.y = node.depth / y1 * size[1];
        delete node._tree;
      });
      return nodes;
    }
    tree.separation = function(x) {
      if (!arguments.length) return separation;
      separation = x;
      return tree;
    };
    tree.size = function(x) {
      if (!arguments.length) return nodeSize ? null : size;
      nodeSize = (size = x) == null;
      return tree;
    };
    tree.nodeSize = function(x) {
      if (!arguments.length) return nodeSize ? size : null;
      nodeSize = (size = x) != null;
      return tree;
    };
    return d3_layout_hierarchyRebind(tree, hierarchy);
  };
  function d3_layout_treeSeparation(a, b) {
    return a.parent == b.parent ? 1 : 2;
  }
  function d3_layout_treeLeft(node) {
    var children = node.children;
    return children && children.length ? children[0] : node._tree.thread;
  }
  function d3_layout_treeRight(node) {
    var children = node.children, n;
    return children && (n = children.length) ? children[n - 1] : node._tree.thread;
  }
  function d3_layout_treeSearch(node, compare) {
    var children = node.children;
    if (children && (n = children.length)) {
      var child, n, i = -1;
      while (++i < n) {
        if (compare(child = d3_layout_treeSearch(children[i], compare), node) > 0) {
          node = child;
        }
      }
    }
    return node;
  }
  function d3_layout_treeRightmost(a, b) {
    return a.x - b.x;
  }
  function d3_layout_treeLeftmost(a, b) {
    return b.x - a.x;
  }
  function d3_layout_treeDeepest(a, b) {
    return a.depth - b.depth;
  }
  function d3_layout_treeVisitAfter(node, callback) {
    function visit(node, previousSibling) {
      var children = node.children;
      if (children && (n = children.length)) {
        var child, previousChild = null, i = -1, n;
        while (++i < n) {
          child = children[i];
          visit(child, previousChild);
          previousChild = child;
        }
      }
      callback(node, previousSibling);
    }
    visit(node, null);
  }
  function d3_layout_treeShift(node) {
    var shift = 0, change = 0, children = node.children, i = children.length, child;
    while (--i >= 0) {
      child = children[i]._tree;
      child.prelim += shift;
      child.mod += shift;
      shift += child.shift + (change += child.change);
    }
  }
  function d3_layout_treeMove(ancestor, node, shift) {
    ancestor = ancestor._tree;
    node = node._tree;
    var change = shift / (node.number - ancestor.number);
    ancestor.change += change;
    node.change -= change;
    node.shift += shift;
    node.prelim += shift;
    node.mod += shift;
  }
  function d3_layout_treeAncestor(vim, node, ancestor) {
    return vim._tree.ancestor.parent == node.parent ? vim._tree.ancestor : ancestor;
  }
  d3.layout.pack = function() {
    var hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort), padding = 0, size = [ 1, 1 ], radius;
    function pack(d, i) {
      var nodes = hierarchy.call(this, d, i), root = nodes[0], w = size[0], h = size[1], r = radius == null ? Math.sqrt : typeof radius === "function" ? radius : function() {
        return radius;
      };
      root.x = root.y = 0;
      d3_layout_treeVisitAfter(root, function(d) {
        d.r = +r(d.value);
      });
      d3_layout_treeVisitAfter(root, d3_layout_packSiblings);
      if (padding) {
        var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2;
        d3_layout_treeVisitAfter(root, function(d) {
          d.r += dr;
        });
        d3_layout_treeVisitAfter(root, d3_layout_packSiblings);
        d3_layout_treeVisitAfter(root, function(d) {
          d.r -= dr;
        });
      }
      d3_layout_packTransform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h));
      return nodes;
    }
    pack.size = function(_) {
      if (!arguments.length) return size;
      size = _;
      return pack;
    };
    pack.radius = function(_) {
      if (!arguments.length) return radius;
      radius = _ == null || typeof _ === "function" ? _ : +_;
      return pack;
    };
    pack.padding = function(_) {
      if (!arguments.length) return padding;
      padding = +_;
      return pack;
    };
    return d3_layout_hierarchyRebind(pack, hierarchy);
  };
  function d3_layout_packSort(a, b) {
    return a.value - b.value;
  }
  function d3_layout_packInsert(a, b) {
    var c = a._pack_next;
    a._pack_next = b;
    b._pack_prev = a;
    b._pack_next = c;
    c._pack_prev = b;
  }
  function d3_layout_packSplice(a, b) {
    a._pack_next = b;
    b._pack_prev = a;
  }
  function d3_layout_packIntersects(a, b) {
    var dx = b.x - a.x, dy = b.y - a.y, dr = a.r + b.r;
    return .999 * dr * dr > dx * dx + dy * dy;
  }
  function d3_layout_packSiblings(node) {
    if (!(nodes = node.children) || !(n = nodes.length)) return;
    var nodes, xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity, a, b, c, i, j, k, n;
    function bound(node) {
      xMin = Math.min(node.x - node.r, xMin);
      xMax = Math.max(node.x + node.r, xMax);
      yMin = Math.min(node.y - node.r, yMin);
      yMax = Math.max(node.y + node.r, yMax);
    }
    nodes.forEach(d3_layout_packLink);
    a = nodes[0];
    a.x = -a.r;
    a.y = 0;
    bound(a);
    if (n > 1) {
      b = nodes[1];
      b.x = b.r;
      b.y = 0;
      bound(b);
      if (n > 2) {
        c = nodes[2];
        d3_layout_packPlace(a, b, c);
        bound(c);
        d3_layout_packInsert(a, c);
        a._pack_prev = c;
        d3_layout_packInsert(c, b);
        b = a._pack_next;
        for (i = 3; i < n; i++) {
          d3_layout_packPlace(a, b, c = nodes[i]);
          var isect = 0, s1 = 1, s2 = 1;
          for (j = b._pack_next; j !== b; j = j._pack_next, s1++) {
            if (d3_layout_packIntersects(j, c)) {
              isect = 1;
              break;
            }
          }
          if (isect == 1) {
            for (k = a._pack_prev; k !== j._pack_prev; k = k._pack_prev, s2++) {
              if (d3_layout_packIntersects(k, c)) {
                break;
              }
            }
          }
          if (isect) {
            if (s1 < s2 || s1 == s2 && b.r < a.r) d3_layout_packSplice(a, b = j); else d3_layout_packSplice(a = k, b);
            i--;
          } else {
            d3_layout_packInsert(a, c);
            b = c;
            bound(c);
          }
        }
      }
    }
    var cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2, cr = 0;
    for (i = 0; i < n; i++) {
      c = nodes[i];
      c.x -= cx;
      c.y -= cy;
      cr = Math.max(cr, c.r + Math.sqrt(c.x * c.x + c.y * c.y));
    }
    node.r = cr;
    nodes.forEach(d3_layout_packUnlink);
  }
  function d3_layout_packLink(node) {
    node._pack_next = node._pack_prev = node;
  }
  function d3_layout_packUnlink(node) {
    delete node._pack_next;
    delete node._pack_prev;
  }
  function d3_layout_packTransform(node, x, y, k) {
    var children = node.children;
    node.x = x += k * node.x;
    node.y = y += k * node.y;
    node.r *= k;
    if (children) {
      var i = -1, n = children.length;
      while (++i < n) d3_layout_packTransform(children[i], x, y, k);
    }
  }
  function d3_layout_packPlace(a, b, c) {
    var db = a.r + c.r, dx = b.x - a.x, dy = b.y - a.y;
    if (db && (dx || dy)) {
      var da = b.r + c.r, dc = dx * dx + dy * dy;
      da *= da;
      db *= db;
      var x = .5 + (db - da) / (2 * dc), y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
      c.x = a.x + x * dx + y * dy;
      c.y = a.y + x * dy - y * dx;
    } else {
      c.x = a.x + db;
      c.y = a.y;
    }
  }
  d3.layout.cluster = function() {
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false;
    function cluster(d, i) {
      var nodes = hierarchy.call(this, d, i), root = nodes[0], previousNode, x = 0;
      d3_layout_treeVisitAfter(root, function(node) {
        var children = node.children;
        if (children && children.length) {
          node.x = d3_layout_clusterX(children);
          node.y = d3_layout_clusterY(children);
        } else {
          node.x = previousNode ? x += separation(node, previousNode) : 0;
          node.y = 0;
          previousNode = node;
        }
      });
      var left = d3_layout_clusterLeft(root), right = d3_layout_clusterRight(root), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2;
      d3_layout_treeVisitAfter(root, nodeSize ? function(node) {
        node.x = (node.x - root.x) * size[0];
        node.y = (root.y - node.y) * size[1];
      } : function(node) {
        node.x = (node.x - x0) / (x1 - x0) * size[0];
        node.y = (1 - (root.y ? node.y / root.y : 1)) * size[1];
      });
      return nodes;
    }
    cluster.separation = function(x) {
      if (!arguments.length) return separation;
      separation = x;
      return cluster;
    };
    cluster.size = function(x) {
      if (!arguments.length) return nodeSize ? null : size;
      nodeSize = (size = x) == null;
      return cluster;
    };
    cluster.nodeSize = function(x) {
      if (!arguments.length) return nodeSize ? size : null;
      nodeSize = (size = x) != null;
      return cluster;
    };
    return d3_layout_hierarchyRebind(cluster, hierarchy);
  };
  function d3_layout_clusterY(children) {
    return 1 + d3.max(children, function(child) {
      return child.y;
    });
  }
  function d3_layout_clusterX(children) {
    return children.reduce(function(x, child) {
      return x + child.x;
    }, 0) / children.length;
  }
  function d3_layout_clusterLeft(node) {
    var children = node.children;
    return children && children.length ? d3_layout_clusterLeft(children[0]) : node;
  }
  function d3_layout_clusterRight(node) {
    var children = node.children, n;
    return children && (n = children.length) ? d3_layout_clusterRight(children[n - 1]) : node;
  }
  d3.layout.treemap = function() {
    var hierarchy = d3.layout.hierarchy(), round = Math.round, size = [ 1, 1 ], padding = null, pad = d3_layout_treemapPadNull, sticky = false, stickies, mode = "squarify", ratio = .5 * (1 + Math.sqrt(5));
    function scale(children, k) {
      var i = -1, n = children.length, child, area;
      while (++i < n) {
        area = (child = children[i]).value * (k < 0 ? 0 : k);
        child.area = isNaN(area) || area <= 0 ? 0 : area;
      }
    }
    function squarify(node) {
      var children = node.children;
      if (children && children.length) {
        var rect = pad(node), row = [], remaining = children.slice(), child, best = Infinity, score, u = mode === "slice" ? rect.dx : mode === "dice" ? rect.dy : mode === "slice-dice" ? node.depth & 1 ? rect.dy : rect.dx : Math.min(rect.dx, rect.dy), n;
        scale(remaining, rect.dx * rect.dy / node.value);
        row.area = 0;
        while ((n = remaining.length) > 0) {
          row.push(child = remaining[n - 1]);
          row.area += child.area;
          if (mode !== "squarify" || (score = worst(row, u)) <= best) {
            remaining.pop();
            best = score;
          } else {
            row.area -= row.pop().area;
            position(row, u, rect, false);
            u = Math.min(rect.dx, rect.dy);
            row.length = row.area = 0;
            best = Infinity;
          }
        }
        if (row.length) {
          position(row, u, rect, true);
          row.length = row.area = 0;
        }
        children.forEach(squarify);
      }
    }
    function stickify(node) {
      var children = node.children;
      if (children && children.length) {
        var rect = pad(node), remaining = children.slice(), child, row = [];
        scale(remaining, rect.dx * rect.dy / node.value);
        row.area = 0;
        while (child = remaining.pop()) {
          row.push(child);
          row.area += child.area;
          if (child.z != null) {
            position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length);
            row.length = row.area = 0;
          }
        }
        children.forEach(stickify);
      }
    }
    function worst(row, u) {
      var s = row.area, r, rmax = 0, rmin = Infinity, i = -1, n = row.length;
      while (++i < n) {
        if (!(r = row[i].area)) continue;
        if (r < rmin) rmin = r;
        if (r > rmax) rmax = r;
      }
      s *= s;
      u *= u;
      return s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : Infinity;
    }
    function position(row, u, rect, flush) {
      var i = -1, n = row.length, x = rect.x, y = rect.y, v = u ? round(row.area / u) : 0, o;
      if (u == rect.dx) {
        if (flush || v > rect.dy) v = rect.dy;
        while (++i < n) {
          o = row[i];
          o.x = x;
          o.y = y;
          o.dy = v;
          x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0);
        }
        o.z = true;
        o.dx += rect.x + rect.dx - x;
        rect.y += v;
        rect.dy -= v;
      } else {
        if (flush || v > rect.dx) v = rect.dx;
        while (++i < n) {
          o = row[i];
          o.x = x;
          o.y = y;
          o.dx = v;
          y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0);
        }
        o.z = false;
        o.dy += rect.y + rect.dy - y;
        rect.x += v;
        rect.dx -= v;
      }
    }
    function treemap(d) {
      var nodes = stickies || hierarchy(d), root = nodes[0];
      root.x = 0;
      root.y = 0;
      root.dx = size[0];
      root.dy = size[1];
      if (stickies) hierarchy.revalue(root);
      scale([ root ], root.dx * root.dy / root.value);
      (stickies ? stickify : squarify)(root);
      if (sticky) stickies = nodes;
      return nodes;
    }
    treemap.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return treemap;
    };
    treemap.padding = function(x) {
      if (!arguments.length) return padding;
      function padFunction(node) {
        var p = x.call(treemap, node, node.depth);
        return p == null ? d3_layout_treemapPadNull(node) : d3_layout_treemapPad(node, typeof p === "number" ? [ p, p, p, p ] : p);
      }
      function padConstant(node) {
        return d3_layout_treemapPad(node, x);
      }
      var type;
      pad = (padding = x) == null ? d3_layout_treemapPadNull : (type = typeof x) === "function" ? padFunction : type === "number" ? (x = [ x, x, x, x ], 
      padConstant) : padConstant;
      return treemap;
    };
    treemap.round = function(x) {
      if (!arguments.length) return round != Number;
      round = x ? Math.round : Number;
      return treemap;
    };
    treemap.sticky = function(x) {
      if (!arguments.length) return sticky;
      sticky = x;
      stickies = null;
      return treemap;
    };
    treemap.ratio = function(x) {
      if (!arguments.length) return ratio;
      ratio = x;
      return treemap;
    };
    treemap.mode = function(x) {
      if (!arguments.length) return mode;
      mode = x + "";
      return treemap;
    };
    return d3_layout_hierarchyRebind(treemap, hierarchy);
  };
  function d3_layout_treemapPadNull(node) {
    return {
      x: node.x,
      y: node.y,
      dx: node.dx,
      dy: node.dy
    };
  }
  function d3_layout_treemapPad(node, padding) {
    var x = node.x + padding[3], y = node.y + padding[0], dx = node.dx - padding[1] - padding[3], dy = node.dy - padding[0] - padding[2];
    if (dx < 0) {
      x += dx / 2;
      dx = 0;
    }
    if (dy < 0) {
      y += dy / 2;
      dy = 0;
    }
    return {
      x: x,
      y: y,
      dx: dx,
      dy: dy
    };
  }
  d3.random = {
    normal: function(µ, σ) {
      var n = arguments.length;
      if (n < 2) σ = 1;
      if (n < 1) µ = 0;
      return function() {
        var x, y, r;
        do {
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          r = x * x + y * y;
        } while (!r || r > 1);
        return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r);
      };
    },
    logNormal: function() {
      var random = d3.random.normal.apply(d3, arguments);
      return function() {
        return Math.exp(random());
      };
    },
    irwinHall: function(m) {
      return function() {
        for (var s = 0, j = 0; j < m; j++) s += Math.random();
        return s / m;
      };
    }
  };
  d3.scale = {};
  function d3_scaleExtent(domain) {
    var start = domain[0], stop = domain[domain.length - 1];
    return start < stop ? [ start, stop ] : [ stop, start ];
  }
  function d3_scaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
  }
  function d3_scale_bilinear(domain, range, uninterpolate, interpolate) {
    var u = uninterpolate(domain[0], domain[1]), i = interpolate(range[0], range[1]);
    return function(x) {
      return i(u(x));
    };
  }
  function d3_scale_nice(domain, nice) {
    var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], dx;
    if (x1 < x0) {
      dx = i0, i0 = i1, i1 = dx;
      dx = x0, x0 = x1, x1 = dx;
    }
    domain[i0] = nice.floor(x0);
    domain[i1] = nice.ceil(x1);
    return domain;
  }
  function d3_scale_niceStep(step) {
    return step ? {
      floor: function(x) {
        return Math.floor(x / step) * step;
      },
      ceil: function(x) {
        return Math.ceil(x / step) * step;
      }
    } : d3_scale_niceIdentity;
  }
  var d3_scale_niceIdentity = {
    floor: d3_identity,
    ceil: d3_identity
  };
  function d3_scale_polylinear(domain, range, uninterpolate, interpolate) {
    var u = [], i = [], j = 0, k = Math.min(domain.length, range.length) - 1;
    if (domain[k] < domain[0]) {
      domain = domain.slice().reverse();
      range = range.slice().reverse();
    }
    while (++j <= k) {
      u.push(uninterpolate(domain[j - 1], domain[j]));
      i.push(interpolate(range[j - 1], range[j]));
    }
    return function(x) {
      var j = d3.bisect(domain, x, 1, k) - 1;
      return i[j](u[j](x));
    };
  }
  d3.scale.linear = function() {
    return d3_scale_linear([ 0, 1 ], [ 0, 1 ], d3_interpolate, false);
  };
  function d3_scale_linear(domain, range, interpolate, clamp) {
    var output, input;
    function rescale() {
      var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear, uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber;
      output = linear(domain, range, uninterpolate, interpolate);
      input = linear(range, domain, uninterpolate, d3_interpolate);
      return scale;
    }
    function scale(x) {
      return output(x);
    }
    scale.invert = function(y) {
      return input(y);
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(Number);
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.rangeRound = function(x) {
      return scale.range(x).interpolate(d3_interpolateRound);
    };
    scale.clamp = function(x) {
      if (!arguments.length) return clamp;
      clamp = x;
      return rescale();
    };
    scale.interpolate = function(x) {
      if (!arguments.length) return interpolate;
      interpolate = x;
      return rescale();
    };
    scale.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    scale.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    scale.nice = function(m) {
      d3_scale_linearNice(domain, m);
      return rescale();
    };
    scale.copy = function() {
      return d3_scale_linear(domain, range, interpolate, clamp);
    };
    return rescale();
  }
  function d3_scale_linearRebind(scale, linear) {
    return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp");
  }
  function d3_scale_linearNice(domain, m) {
    return d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));
  }
  function d3_scale_linearTickRange(domain, m) {
    if (m == null) m = 10;
    var extent = d3_scaleExtent(domain), span = extent[1] - extent[0], step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)), err = m / span * step;
    if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;
    extent[0] = Math.ceil(extent[0] / step) * step;
    extent[1] = Math.floor(extent[1] / step) * step + step * .5;
    extent[2] = step;
    return extent;
  }
  function d3_scale_linearTicks(domain, m) {
    return d3.range.apply(d3, d3_scale_linearTickRange(domain, m));
  }
  function d3_scale_linearTickFormat(domain, m, format) {
    var precision = -Math.floor(Math.log(d3_scale_linearTickRange(domain, m)[2]) / Math.LN10 + .01);
    return d3.format(format ? format.replace(d3_format_re, function(a, b, c, d, e, f, g, h, i, j) {
      return [ b, c, d, e, f, g, h, i || "." + (precision - (j === "%") * 2), j ].join("");
    }) : ",." + precision + "f");
  }
  d3.scale.log = function() {
    return d3_scale_log(d3.scale.linear().domain([ 0, 1 ]), 10, true, [ 1, 10 ]);
  };
  function d3_scale_log(linear, base, positive, domain) {
    function log(x) {
      return (positive ? Math.log(x < 0 ? 0 : x) : -Math.log(x > 0 ? 0 : -x)) / Math.log(base);
    }
    function pow(x) {
      return positive ? Math.pow(base, x) : -Math.pow(base, -x);
    }
    function scale(x) {
      return linear(log(x));
    }
    scale.invert = function(x) {
      return pow(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      positive = x[0] >= 0;
      linear.domain((domain = x.map(Number)).map(log));
      return scale;
    };
    scale.base = function(_) {
      if (!arguments.length) return base;
      base = +_;
      linear.domain(domain.map(log));
      return scale;
    };
    scale.nice = function() {
      var niced = d3_scale_nice(domain.map(log), positive ? Math : d3_scale_logNiceNegative);
      linear.domain(niced);
      domain = niced.map(pow);
      return scale;
    };
    scale.ticks = function() {
      var extent = d3_scaleExtent(domain), ticks = [], u = extent[0], v = extent[1], i = Math.floor(log(u)), j = Math.ceil(log(v)), n = base % 1 ? 2 : base;
      if (isFinite(j - i)) {
        if (positive) {
          for (;i < j; i++) for (var k = 1; k < n; k++) ticks.push(pow(i) * k);
          ticks.push(pow(i));
        } else {
          ticks.push(pow(i));
          for (;i++ < j; ) for (var k = n - 1; k > 0; k--) ticks.push(pow(i) * k);
        }
        for (i = 0; ticks[i] < u; i++) {}
        for (j = ticks.length; ticks[j - 1] > v; j--) {}
        ticks = ticks.slice(i, j);
      }
      return ticks;
    };
    scale.tickFormat = function(n, format) {
      if (!arguments.length) return d3_scale_logFormat;
      if (arguments.length < 2) format = d3_scale_logFormat; else if (typeof format !== "function") format = d3.format(format);
      var k = Math.max(.1, n / scale.ticks().length), f = positive ? (e = 1e-12, Math.ceil) : (e = -1e-12, 
      Math.floor), e;
      return function(d) {
        return d / pow(f(log(d) + e)) <= k ? format(d) : "";
      };
    };
    scale.copy = function() {
      return d3_scale_log(linear.copy(), base, positive, domain);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  var d3_scale_logFormat = d3.format(".0e"), d3_scale_logNiceNegative = {
    floor: function(x) {
      return -Math.ceil(-x);
    },
    ceil: function(x) {
      return -Math.floor(-x);
    }
  };
  d3.scale.pow = function() {
    return d3_scale_pow(d3.scale.linear(), 1, [ 0, 1 ]);
  };
  function d3_scale_pow(linear, exponent, domain) {
    var powp = d3_scale_powPow(exponent), powb = d3_scale_powPow(1 / exponent);
    function scale(x) {
      return linear(powp(x));
    }
    scale.invert = function(x) {
      return powb(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      linear.domain((domain = x.map(Number)).map(powp));
      return scale;
    };
    scale.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    scale.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    scale.nice = function(m) {
      return scale.domain(d3_scale_linearNice(domain, m));
    };
    scale.exponent = function(x) {
      if (!arguments.length) return exponent;
      powp = d3_scale_powPow(exponent = x);
      powb = d3_scale_powPow(1 / exponent);
      linear.domain(domain.map(powp));
      return scale;
    };
    scale.copy = function() {
      return d3_scale_pow(linear.copy(), exponent, domain);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  function d3_scale_powPow(e) {
    return function(x) {
      return x < 0 ? -Math.pow(-x, e) : Math.pow(x, e);
    };
  }
  d3.scale.sqrt = function() {
    return d3.scale.pow().exponent(.5);
  };
  d3.scale.ordinal = function() {
    return d3_scale_ordinal([], {
      t: "range",
      a: [ [] ]
    });
  };
  function d3_scale_ordinal(domain, ranger) {
    var index, range, rangeBand;
    function scale(x) {
      return range[((index.get(x) || ranger.t === "range" && index.set(x, domain.push(x))) - 1) % range.length];
    }
    function steps(start, step) {
      return d3.range(domain.length).map(function(i) {
        return start + step * i;
      });
    }
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = [];
      index = new d3_Map();
      var i = -1, n = x.length, xi;
      while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi));
      return scale[ranger.t].apply(scale, ranger.a);
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      rangeBand = 0;
      ranger = {
        t: "range",
        a: arguments
      };
      return scale;
    };
    scale.rangePoints = function(x, padding) {
      if (arguments.length < 2) padding = 0;
      var start = x[0], stop = x[1], step = (stop - start) / (Math.max(1, domain.length - 1) + padding);
      range = steps(domain.length < 2 ? (start + stop) / 2 : start + step * padding / 2, step);
      rangeBand = 0;
      ranger = {
        t: "rangePoints",
        a: arguments
      };
      return scale;
    };
    scale.rangeBands = function(x, padding, outerPadding) {
      if (arguments.length < 2) padding = 0;
      if (arguments.length < 3) outerPadding = padding;
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = (stop - start) / (domain.length - padding + 2 * outerPadding);
      range = steps(start + step * outerPadding, step);
      if (reverse) range.reverse();
      rangeBand = step * (1 - padding);
      ranger = {
        t: "rangeBands",
        a: arguments
      };
      return scale;
    };
    scale.rangeRoundBands = function(x, padding, outerPadding) {
      if (arguments.length < 2) padding = 0;
      if (arguments.length < 3) outerPadding = padding;
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding)), error = stop - start - (domain.length - padding) * step;
      range = steps(start + Math.round(error / 2), step);
      if (reverse) range.reverse();
      rangeBand = Math.round(step * (1 - padding));
      ranger = {
        t: "rangeRoundBands",
        a: arguments
      };
      return scale;
    };
    scale.rangeBand = function() {
      return rangeBand;
    };
    scale.rangeExtent = function() {
      return d3_scaleExtent(ranger.a[0]);
    };
    scale.copy = function() {
      return d3_scale_ordinal(domain, ranger);
    };
    return scale.domain(domain);
  }
  d3.scale.category10 = function() {
    return d3.scale.ordinal().range(d3_category10);
  };
  d3.scale.category20 = function() {
    return d3.scale.ordinal().range(d3_category20);
  };
  d3.scale.category20b = function() {
    return d3.scale.ordinal().range(d3_category20b);
  };
  d3.scale.category20c = function() {
    return d3.scale.ordinal().range(d3_category20c);
  };
  var d3_category10 = [ 2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175 ].map(d3_rgbString);
  var d3_category20 = [ 2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725 ].map(d3_rgbString);
  var d3_category20b = [ 3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654 ].map(d3_rgbString);
  var d3_category20c = [ 3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081 ].map(d3_rgbString);
  d3.scale.quantile = function() {
    return d3_scale_quantile([], []);
  };
  function d3_scale_quantile(domain, range) {
    var thresholds;
    function rescale() {
      var k = 0, q = range.length;
      thresholds = [];
      while (++k < q) thresholds[k - 1] = d3.quantile(domain, k / q);
      return scale;
    }
    function scale(x) {
      if (!isNaN(x = +x)) return range[d3.bisect(thresholds, x)];
    }
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = x.filter(function(d) {
        return !isNaN(d);
      }).sort(d3.ascending);
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.quantiles = function() {
      return thresholds;
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      return y < 0 ? [ NaN, NaN ] : [ y > 0 ? thresholds[y - 1] : domain[0], y < thresholds.length ? thresholds[y] : domain[domain.length - 1] ];
    };
    scale.copy = function() {
      return d3_scale_quantile(domain, range);
    };
    return rescale();
  }
  d3.scale.quantize = function() {
    return d3_scale_quantize(0, 1, [ 0, 1 ]);
  };
  function d3_scale_quantize(x0, x1, range) {
    var kx, i;
    function scale(x) {
      return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))];
    }
    function rescale() {
      kx = range.length / (x1 - x0);
      i = range.length - 1;
      return scale;
    }
    scale.domain = function(x) {
      if (!arguments.length) return [ x0, x1 ];
      x0 = +x[0];
      x1 = +x[x.length - 1];
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      y = y < 0 ? NaN : y / kx + x0;
      return [ y, y + 1 / kx ];
    };
    scale.copy = function() {
      return d3_scale_quantize(x0, x1, range);
    };
    return rescale();
  }
  d3.scale.threshold = function() {
    return d3_scale_threshold([ .5 ], [ 0, 1 ]);
  };
  function d3_scale_threshold(domain, range) {
    function scale(x) {
      if (x <= x) return range[d3.bisect(domain, x)];
    }
    scale.domain = function(_) {
      if (!arguments.length) return domain;
      domain = _;
      return scale;
    };
    scale.range = function(_) {
      if (!arguments.length) return range;
      range = _;
      return scale;
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      return [ domain[y - 1], domain[y] ];
    };
    scale.copy = function() {
      return d3_scale_threshold(domain, range);
    };
    return scale;
  }
  d3.scale.identity = function() {
    return d3_scale_identity([ 0, 1 ]);
  };
  function d3_scale_identity(domain) {
    function identity(x) {
      return +x;
    }
    identity.invert = identity;
    identity.domain = identity.range = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(identity);
      return identity;
    };
    identity.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    identity.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    identity.copy = function() {
      return d3_scale_identity(domain);
    };
    return identity;
  }
  d3.svg = {};
  d3.svg.arc = function() {
    var innerRadius = d3_svg_arcInnerRadius, outerRadius = d3_svg_arcOuterRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;
    function arc() {
      var r0 = innerRadius.apply(this, arguments), r1 = outerRadius.apply(this, arguments), a0 = startAngle.apply(this, arguments) + d3_svg_arcOffset, a1 = endAngle.apply(this, arguments) + d3_svg_arcOffset, da = (a1 < a0 && (da = a0, 
      a0 = a1, a1 = da), a1 - a0), df = da < π ? "0" : "1", c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
      return da >= d3_svg_arcMax ? r0 ? "M0," + r1 + "A" + r1 + "," + r1 + " 0 1,1 0," + -r1 + "A" + r1 + "," + r1 + " 0 1,1 0," + r1 + "M0," + r0 + "A" + r0 + "," + r0 + " 0 1,0 0," + -r0 + "A" + r0 + "," + r0 + " 0 1,0 0," + r0 + "Z" : "M0," + r1 + "A" + r1 + "," + r1 + " 0 1,1 0," + -r1 + "A" + r1 + "," + r1 + " 0 1,1 0," + r1 + "Z" : r0 ? "M" + r1 * c0 + "," + r1 * s0 + "A" + r1 + "," + r1 + " 0 " + df + ",1 " + r1 * c1 + "," + r1 * s1 + "L" + r0 * c1 + "," + r0 * s1 + "A" + r0 + "," + r0 + " 0 " + df + ",0 " + r0 * c0 + "," + r0 * s0 + "Z" : "M" + r1 * c0 + "," + r1 * s0 + "A" + r1 + "," + r1 + " 0 " + df + ",1 " + r1 * c1 + "," + r1 * s1 + "L0,0" + "Z";
    }
    arc.innerRadius = function(v) {
      if (!arguments.length) return innerRadius;
      innerRadius = d3_functor(v);
      return arc;
    };
    arc.outerRadius = function(v) {
      if (!arguments.length) return outerRadius;
      outerRadius = d3_functor(v);
      return arc;
    };
    arc.startAngle = function(v) {
      if (!arguments.length) return startAngle;
      startAngle = d3_functor(v);
      return arc;
    };
    arc.endAngle = function(v) {
      if (!arguments.length) return endAngle;
      endAngle = d3_functor(v);
      return arc;
    };
    arc.centroid = function() {
      var r = (innerRadius.apply(this, arguments) + outerRadius.apply(this, arguments)) / 2, a = (startAngle.apply(this, arguments) + endAngle.apply(this, arguments)) / 2 + d3_svg_arcOffset;
      return [ Math.cos(a) * r, Math.sin(a) * r ];
    };
    return arc;
  };
  var d3_svg_arcOffset = -halfπ, d3_svg_arcMax = τ - ε;
  function d3_svg_arcInnerRadius(d) {
    return d.innerRadius;
  }
  function d3_svg_arcOuterRadius(d) {
    return d.outerRadius;
  }
  function d3_svg_arcStartAngle(d) {
    return d.startAngle;
  }
  function d3_svg_arcEndAngle(d) {
    return d.endAngle;
  }
  function d3_svg_line(projection) {
    var x = d3_geom_pointX, y = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, tension = .7;
    function line(data) {
      var segments = [], points = [], i = -1, n = data.length, d, fx = d3_functor(x), fy = d3_functor(y);
      function segment() {
        segments.push("M", interpolate(projection(points), tension));
      }
      while (++i < n) {
        if (defined.call(this, d = data[i], i)) {
          points.push([ +fx.call(this, d, i), +fy.call(this, d, i) ]);
        } else if (points.length) {
          segment();
          points = [];
        }
      }
      if (points.length) segment();
      return segments.length ? segments.join("") : null;
    }
    line.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      return line;
    };
    line.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return line;
    };
    line.defined = function(_) {
      if (!arguments.length) return defined;
      defined = _;
      return line;
    };
    line.interpolate = function(_) {
      if (!arguments.length) return interpolateKey;
      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
      return line;
    };
    line.tension = function(_) {
      if (!arguments.length) return tension;
      tension = _;
      return line;
    };
    return line;
  }
  d3.svg.line = function() {
    return d3_svg_line(d3_identity);
  };
  var d3_svg_lineInterpolators = d3.map({
    linear: d3_svg_lineLinear,
    "linear-closed": d3_svg_lineLinearClosed,
    step: d3_svg_lineStep,
    "step-before": d3_svg_lineStepBefore,
    "step-after": d3_svg_lineStepAfter,
    basis: d3_svg_lineBasis,
    "basis-open": d3_svg_lineBasisOpen,
    "basis-closed": d3_svg_lineBasisClosed,
    bundle: d3_svg_lineBundle,
    cardinal: d3_svg_lineCardinal,
    "cardinal-open": d3_svg_lineCardinalOpen,
    "cardinal-closed": d3_svg_lineCardinalClosed,
    monotone: d3_svg_lineMonotone
  });
  d3_svg_lineInterpolators.forEach(function(key, value) {
    value.key = key;
    value.closed = /-closed$/.test(key);
  });
  function d3_svg_lineLinear(points) {
    return points.join("L");
  }
  function d3_svg_lineLinearClosed(points) {
    return d3_svg_lineLinear(points) + "Z";
  }
  function d3_svg_lineStep(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("H", (p[0] + (p = points[i])[0]) / 2, "V", p[1]);
    if (n > 1) path.push("H", p[0]);
    return path.join("");
  }
  function d3_svg_lineStepBefore(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("V", (p = points[i])[1], "H", p[0]);
    return path.join("");
  }
  function d3_svg_lineStepAfter(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("H", (p = points[i])[0], "V", p[1]);
    return path.join("");
  }
  function d3_svg_lineCardinalOpen(points, tension) {
    return points.length < 4 ? d3_svg_lineLinear(points) : points[1] + d3_svg_lineHermite(points.slice(1, points.length - 1), d3_svg_lineCardinalTangents(points, tension));
  }
  function d3_svg_lineCardinalClosed(points, tension) {
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite((points.push(points[0]), 
    points), d3_svg_lineCardinalTangents([ points[points.length - 2] ].concat(points, [ points[1] ]), tension));
  }
  function d3_svg_lineCardinal(points, tension) {
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineCardinalTangents(points, tension));
  }
  function d3_svg_lineHermite(points, tangents) {
    if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {
      return d3_svg_lineLinear(points);
    }
    var quad = points.length != tangents.length, path = "", p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1;
    if (quad) {
      path += "Q" + (p[0] - t0[0] * 2 / 3) + "," + (p[1] - t0[1] * 2 / 3) + "," + p[0] + "," + p[1];
      p0 = points[1];
      pi = 2;
    }
    if (tangents.length > 1) {
      t = tangents[1];
      p = points[pi];
      pi++;
      path += "C" + (p0[0] + t0[0]) + "," + (p0[1] + t0[1]) + "," + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
      for (var i = 2; i < tangents.length; i++, pi++) {
        p = points[pi];
        t = tangents[i];
        path += "S" + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
      }
    }
    if (quad) {
      var lp = points[pi];
      path += "Q" + (p[0] + t[0] * 2 / 3) + "," + (p[1] + t[1] * 2 / 3) + "," + lp[0] + "," + lp[1];
    }
    return path;
  }
  function d3_svg_lineCardinalTangents(points, tension) {
    var tangents = [], a = (1 - tension) / 2, p0, p1 = points[0], p2 = points[1], i = 1, n = points.length;
    while (++i < n) {
      p0 = p1;
      p1 = p2;
      p2 = points[i];
      tangents.push([ a * (p2[0] - p0[0]), a * (p2[1] - p0[1]) ]);
    }
    return tangents;
  }
  function d3_svg_lineBasis(points) {
    if (points.length < 3) return d3_svg_lineLinear(points);
    var i = 1, n = points.length, pi = points[0], x0 = pi[0], y0 = pi[1], px = [ x0, x0, x0, (pi = points[1])[0] ], py = [ y0, y0, y0, pi[1] ], path = [ x0, ",", y0, "L", d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
    points.push(points[n - 1]);
    while (++i <= n) {
      pi = points[i];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    points.pop();
    path.push("L", pi);
    return path.join("");
  }
  function d3_svg_lineBasisOpen(points) {
    if (points.length < 4) return d3_svg_lineLinear(points);
    var path = [], i = -1, n = points.length, pi, px = [ 0 ], py = [ 0 ];
    while (++i < 3) {
      pi = points[i];
      px.push(pi[0]);
      py.push(pi[1]);
    }
    path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px) + "," + d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));
    --i;
    while (++i < n) {
      pi = points[i];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    return path.join("");
  }
  function d3_svg_lineBasisClosed(points) {
    var path, i = -1, n = points.length, m = n + 4, pi, px = [], py = [];
    while (++i < 4) {
      pi = points[i % n];
      px.push(pi[0]);
      py.push(pi[1]);
    }
    path = [ d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
    --i;
    while (++i < m) {
      pi = points[i % n];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    return path.join("");
  }
  function d3_svg_lineBundle(points, tension) {
    var n = points.length - 1;
    if (n) {
      var x0 = points[0][0], y0 = points[0][1], dx = points[n][0] - x0, dy = points[n][1] - y0, i = -1, p, t;
      while (++i <= n) {
        p = points[i];
        t = i / n;
        p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);
        p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);
      }
    }
    return d3_svg_lineBasis(points);
  }
  function d3_svg_lineDot4(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  var d3_svg_lineBasisBezier1 = [ 0, 2 / 3, 1 / 3, 0 ], d3_svg_lineBasisBezier2 = [ 0, 1 / 3, 2 / 3, 0 ], d3_svg_lineBasisBezier3 = [ 0, 1 / 6, 2 / 3, 1 / 6 ];
  function d3_svg_lineBasisBezier(path, x, y) {
    path.push("C", d3_svg_lineDot4(d3_svg_lineBasisBezier1, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier1, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, y));
  }
  function d3_svg_lineSlope(p0, p1) {
    return (p1[1] - p0[1]) / (p1[0] - p0[0]);
  }
  function d3_svg_lineFiniteDifferences(points) {
    var i = 0, j = points.length - 1, m = [], p0 = points[0], p1 = points[1], d = m[0] = d3_svg_lineSlope(p0, p1);
    while (++i < j) {
      m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;
    }
    m[i] = d;
    return m;
  }
  function d3_svg_lineMonotoneTangents(points) {
    var tangents = [], d, a, b, s, m = d3_svg_lineFiniteDifferences(points), i = -1, j = points.length - 1;
    while (++i < j) {
      d = d3_svg_lineSlope(points[i], points[i + 1]);
      if (abs(d) < ε) {
        m[i] = m[i + 1] = 0;
      } else {
        a = m[i] / d;
        b = m[i + 1] / d;
        s = a * a + b * b;
        if (s > 9) {
          s = d * 3 / Math.sqrt(s);
          m[i] = s * a;
          m[i + 1] = s * b;
        }
      }
    }
    i = -1;
    while (++i <= j) {
      s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
      tangents.push([ s || 0, m[i] * s || 0 ]);
    }
    return tangents;
  }
  function d3_svg_lineMonotone(points) {
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));
  }
  d3.svg.line.radial = function() {
    var line = d3_svg_line(d3_svg_lineRadial);
    line.radius = line.x, delete line.x;
    line.angle = line.y, delete line.y;
    return line;
  };
  function d3_svg_lineRadial(points) {
    var point, i = -1, n = points.length, r, a;
    while (++i < n) {
      point = points[i];
      r = point[0];
      a = point[1] + d3_svg_arcOffset;
      point[0] = r * Math.cos(a);
      point[1] = r * Math.sin(a);
    }
    return points;
  }
  function d3_svg_area(projection) {
    var x0 = d3_geom_pointX, x1 = d3_geom_pointX, y0 = 0, y1 = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, interpolateReverse = interpolate, L = "L", tension = .7;
    function area(data) {
      var segments = [], points0 = [], points1 = [], i = -1, n = data.length, d, fx0 = d3_functor(x0), fy0 = d3_functor(y0), fx1 = x0 === x1 ? function() {
        return x;
      } : d3_functor(x1), fy1 = y0 === y1 ? function() {
        return y;
      } : d3_functor(y1), x, y;
      function segment() {
        segments.push("M", interpolate(projection(points1), tension), L, interpolateReverse(projection(points0.reverse()), tension), "Z");
      }
      while (++i < n) {
        if (defined.call(this, d = data[i], i)) {
          points0.push([ x = +fx0.call(this, d, i), y = +fy0.call(this, d, i) ]);
          points1.push([ +fx1.call(this, d, i), +fy1.call(this, d, i) ]);
        } else if (points0.length) {
          segment();
          points0 = [];
          points1 = [];
        }
      }
      if (points0.length) segment();
      return segments.length ? segments.join("") : null;
    }
    area.x = function(_) {
      if (!arguments.length) return x1;
      x0 = x1 = _;
      return area;
    };
    area.x0 = function(_) {
      if (!arguments.length) return x0;
      x0 = _;
      return area;
    };
    area.x1 = function(_) {
      if (!arguments.length) return x1;
      x1 = _;
      return area;
    };
    area.y = function(_) {
      if (!arguments.length) return y1;
      y0 = y1 = _;
      return area;
    };
    area.y0 = function(_) {
      if (!arguments.length) return y0;
      y0 = _;
      return area;
    };
    area.y1 = function(_) {
      if (!arguments.length) return y1;
      y1 = _;
      return area;
    };
    area.defined = function(_) {
      if (!arguments.length) return defined;
      defined = _;
      return area;
    };
    area.interpolate = function(_) {
      if (!arguments.length) return interpolateKey;
      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
      interpolateReverse = interpolate.reverse || interpolate;
      L = interpolate.closed ? "M" : "L";
      return area;
    };
    area.tension = function(_) {
      if (!arguments.length) return tension;
      tension = _;
      return area;
    };
    return area;
  }
  d3_svg_lineStepBefore.reverse = d3_svg_lineStepAfter;
  d3_svg_lineStepAfter.reverse = d3_svg_lineStepBefore;
  d3.svg.area = function() {
    return d3_svg_area(d3_identity);
  };
  d3.svg.area.radial = function() {
    var area = d3_svg_area(d3_svg_lineRadial);
    area.radius = area.x, delete area.x;
    area.innerRadius = area.x0, delete area.x0;
    area.outerRadius = area.x1, delete area.x1;
    area.angle = area.y, delete area.y;
    area.startAngle = area.y0, delete area.y0;
    area.endAngle = area.y1, delete area.y1;
    return area;
  };
  d3.svg.chord = function() {
    var source = d3_source, target = d3_target, radius = d3_svg_chordRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;
    function chord(d, i) {
      var s = subgroup(this, source, d, i), t = subgroup(this, target, d, i);
      return "M" + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + "Z";
    }
    function subgroup(self, f, d, i) {
      var subgroup = f.call(self, d, i), r = radius.call(self, subgroup, i), a0 = startAngle.call(self, subgroup, i) + d3_svg_arcOffset, a1 = endAngle.call(self, subgroup, i) + d3_svg_arcOffset;
      return {
        r: r,
        a0: a0,
        a1: a1,
        p0: [ r * Math.cos(a0), r * Math.sin(a0) ],
        p1: [ r * Math.cos(a1), r * Math.sin(a1) ]
      };
    }
    function equals(a, b) {
      return a.a0 == b.a0 && a.a1 == b.a1;
    }
    function arc(r, p, a) {
      return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + p;
    }
    function curve(r0, p0, r1, p1) {
      return "Q 0,0 " + p1;
    }
    chord.radius = function(v) {
      if (!arguments.length) return radius;
      radius = d3_functor(v);
      return chord;
    };
    chord.source = function(v) {
      if (!arguments.length) return source;
      source = d3_functor(v);
      return chord;
    };
    chord.target = function(v) {
      if (!arguments.length) return target;
      target = d3_functor(v);
      return chord;
    };
    chord.startAngle = function(v) {
      if (!arguments.length) return startAngle;
      startAngle = d3_functor(v);
      return chord;
    };
    chord.endAngle = function(v) {
      if (!arguments.length) return endAngle;
      endAngle = d3_functor(v);
      return chord;
    };
    return chord;
  };
  function d3_svg_chordRadius(d) {
    return d.radius;
  }
  d3.svg.diagonal = function() {
    var source = d3_source, target = d3_target, projection = d3_svg_diagonalProjection;
    function diagonal(d, i) {
      var p0 = source.call(this, d, i), p3 = target.call(this, d, i), m = (p0.y + p3.y) / 2, p = [ p0, {
        x: p0.x,
        y: m
      }, {
        x: p3.x,
        y: m
      }, p3 ];
      p = p.map(projection);
      return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
    }
    diagonal.source = function(x) {
      if (!arguments.length) return source;
      source = d3_functor(x);
      return diagonal;
    };
    diagonal.target = function(x) {
      if (!arguments.length) return target;
      target = d3_functor(x);
      return diagonal;
    };
    diagonal.projection = function(x) {
      if (!arguments.length) return projection;
      projection = x;
      return diagonal;
    };
    return diagonal;
  };
  function d3_svg_diagonalProjection(d) {
    return [ d.x, d.y ];
  }
  d3.svg.diagonal.radial = function() {
    var diagonal = d3.svg.diagonal(), projection = d3_svg_diagonalProjection, projection_ = diagonal.projection;
    diagonal.projection = function(x) {
      return arguments.length ? projection_(d3_svg_diagonalRadialProjection(projection = x)) : projection;
    };
    return diagonal;
  };
  function d3_svg_diagonalRadialProjection(projection) {
    return function() {
      var d = projection.apply(this, arguments), r = d[0], a = d[1] + d3_svg_arcOffset;
      return [ r * Math.cos(a), r * Math.sin(a) ];
    };
  }
  d3.svg.symbol = function() {
    var type = d3_svg_symbolType, size = d3_svg_symbolSize;
    function symbol(d, i) {
      return (d3_svg_symbols.get(type.call(this, d, i)) || d3_svg_symbolCircle)(size.call(this, d, i));
    }
    symbol.type = function(x) {
      if (!arguments.length) return type;
      type = d3_functor(x);
      return symbol;
    };
    symbol.size = function(x) {
      if (!arguments.length) return size;
      size = d3_functor(x);
      return symbol;
    };
    return symbol;
  };
  function d3_svg_symbolSize() {
    return 64;
  }
  function d3_svg_symbolType() {
    return "circle";
  }
  function d3_svg_symbolCircle(size) {
    var r = Math.sqrt(size / π);
    return "M0," + r + "A" + r + "," + r + " 0 1,1 0," + -r + "A" + r + "," + r + " 0 1,1 0," + r + "Z";
  }
  var d3_svg_symbols = d3.map({
    circle: d3_svg_symbolCircle,
    cross: function(size) {
      var r = Math.sqrt(size / 5) / 2;
      return "M" + -3 * r + "," + -r + "H" + -r + "V" + -3 * r + "H" + r + "V" + -r + "H" + 3 * r + "V" + r + "H" + r + "V" + 3 * r + "H" + -r + "V" + r + "H" + -3 * r + "Z";
    },
    diamond: function(size) {
      var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)), rx = ry * d3_svg_symbolTan30;
      return "M0," + -ry + "L" + rx + ",0" + " 0," + ry + " " + -rx + ",0" + "Z";
    },
    square: function(size) {
      var r = Math.sqrt(size) / 2;
      return "M" + -r + "," + -r + "L" + r + "," + -r + " " + r + "," + r + " " + -r + "," + r + "Z";
    },
    "triangle-down": function(size) {
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
      return "M0," + ry + "L" + rx + "," + -ry + " " + -rx + "," + -ry + "Z";
    },
    "triangle-up": function(size) {
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
      return "M0," + -ry + "L" + rx + "," + ry + " " + -rx + "," + ry + "Z";
    }
  });
  d3.svg.symbolTypes = d3_svg_symbols.keys();
  var d3_svg_symbolSqrt3 = Math.sqrt(3), d3_svg_symbolTan30 = Math.tan(30 * d3_radians);
  function d3_transition(groups, id) {
    d3_subclass(groups, d3_transitionPrototype);
    groups.id = id;
    return groups;
  }
  var d3_transitionPrototype = [], d3_transitionId = 0, d3_transitionInheritId, d3_transitionInherit;
  d3_transitionPrototype.call = d3_selectionPrototype.call;
  d3_transitionPrototype.empty = d3_selectionPrototype.empty;
  d3_transitionPrototype.node = d3_selectionPrototype.node;
  d3_transitionPrototype.size = d3_selectionPrototype.size;
  d3.transition = function(selection) {
    return arguments.length ? d3_transitionInheritId ? selection.transition() : selection : d3_selectionRoot.transition();
  };
  d3.transition.prototype = d3_transitionPrototype;
  d3_transitionPrototype.select = function(selector) {
    var id = this.id, subgroups = [], subgroup, subnode, node;
    selector = d3_selection_selector(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          d3_transitionNode(subnode, i, id, node.__transition__[id]);
          subgroup.push(subnode);
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_transition(subgroups, id);
  };
  d3_transitionPrototype.selectAll = function(selector) {
    var id = this.id, subgroups = [], subgroup, subnodes, node, subnode, transition;
    selector = d3_selection_selectorAll(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          transition = node.__transition__[id];
          subnodes = selector.call(node, node.__data__, i, j);
          subgroups.push(subgroup = []);
          for (var k = -1, o = subnodes.length; ++k < o; ) {
            if (subnode = subnodes[k]) d3_transitionNode(subnode, k, id, transition);
            subgroup.push(subnode);
          }
        }
      }
    }
    return d3_transition(subgroups, id);
  };
  d3_transitionPrototype.filter = function(filter) {
    var subgroups = [], subgroup, group, node;
    if (typeof filter !== "function") filter = d3_selection_filter(filter);
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        if ((node = group[i]) && filter.call(node, node.__data__, i)) {
          subgroup.push(node);
        }
      }
    }
    return d3_transition(subgroups, this.id);
  };
  d3_transitionPrototype.tween = function(name, tween) {
    var id = this.id;
    if (arguments.length < 2) return this.node().__transition__[id].tween.get(name);
    return d3_selection_each(this, tween == null ? function(node) {
      node.__transition__[id].tween.remove(name);
    } : function(node) {
      node.__transition__[id].tween.set(name, tween);
    });
  };
  function d3_transition_tween(groups, name, value, tween) {
    var id = groups.id;
    return d3_selection_each(groups, typeof value === "function" ? function(node, i, j) {
      node.__transition__[id].tween.set(name, tween(value.call(node, node.__data__, i, j)));
    } : (value = tween(value), function(node) {
      node.__transition__[id].tween.set(name, value);
    }));
  }
  d3_transitionPrototype.attr = function(nameNS, value) {
    if (arguments.length < 2) {
      for (value in nameNS) this.attr(value, nameNS[value]);
      return this;
    }
    var interpolate = nameNS == "transform" ? d3_interpolateTransform : d3_interpolate, name = d3.ns.qualify(nameNS);
    function attrNull() {
      this.removeAttribute(name);
    }
    function attrNullNS() {
      this.removeAttributeNS(name.space, name.local);
    }
    function attrTween(b) {
      return b == null ? attrNull : (b += "", function() {
        var a = this.getAttribute(name), i;
        return a !== b && (i = interpolate(a, b), function(t) {
          this.setAttribute(name, i(t));
        });
      });
    }
    function attrTweenNS(b) {
      return b == null ? attrNullNS : (b += "", function() {
        var a = this.getAttributeNS(name.space, name.local), i;
        return a !== b && (i = interpolate(a, b), function(t) {
          this.setAttributeNS(name.space, name.local, i(t));
        });
      });
    }
    return d3_transition_tween(this, "attr." + nameNS, value, name.local ? attrTweenNS : attrTween);
  };
  d3_transitionPrototype.attrTween = function(nameNS, tween) {
    var name = d3.ns.qualify(nameNS);
    function attrTween(d, i) {
      var f = tween.call(this, d, i, this.getAttribute(name));
      return f && function(t) {
        this.setAttribute(name, f(t));
      };
    }
    function attrTweenNS(d, i) {
      var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local));
      return f && function(t) {
        this.setAttributeNS(name.space, name.local, f(t));
      };
    }
    return this.tween("attr." + nameNS, name.local ? attrTweenNS : attrTween);
  };
  d3_transitionPrototype.style = function(name, value, priority) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof name !== "string") {
        if (n < 2) value = "";
        for (priority in name) this.style(priority, name[priority], value);
        return this;
      }
      priority = "";
    }
    function styleNull() {
      this.style.removeProperty(name);
    }
    function styleString(b) {
      return b == null ? styleNull : (b += "", function() {
        var a = d3_window.getComputedStyle(this, null).getPropertyValue(name), i;
        return a !== b && (i = d3_interpolate(a, b), function(t) {
          this.style.setProperty(name, i(t), priority);
        });
      });
    }
    return d3_transition_tween(this, "style." + name, value, styleString);
  };
  d3_transitionPrototype.styleTween = function(name, tween, priority) {
    if (arguments.length < 3) priority = "";
    function styleTween(d, i) {
      var f = tween.call(this, d, i, d3_window.getComputedStyle(this, null).getPropertyValue(name));
      return f && function(t) {
        this.style.setProperty(name, f(t), priority);
      };
    }
    return this.tween("style." + name, styleTween);
  };
  d3_transitionPrototype.text = function(value) {
    return d3_transition_tween(this, "text", value, d3_transition_text);
  };
  function d3_transition_text(b) {
    if (b == null) b = "";
    return function() {
      this.textContent = b;
    };
  }
  d3_transitionPrototype.remove = function() {
    return this.each("end.transition", function() {
      var p;
      if (this.__transition__.count < 2 && (p = this.parentNode)) p.removeChild(this);
    });
  };
  d3_transitionPrototype.ease = function(value) {
    var id = this.id;
    if (arguments.length < 1) return this.node().__transition__[id].ease;
    if (typeof value !== "function") value = d3.ease.apply(d3, arguments);
    return d3_selection_each(this, function(node) {
      node.__transition__[id].ease = value;
    });
  };
  d3_transitionPrototype.delay = function(value) {
    var id = this.id;
    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
      node.__transition__[id].delay = +value.call(node, node.__data__, i, j);
    } : (value = +value, function(node) {
      node.__transition__[id].delay = value;
    }));
  };
  d3_transitionPrototype.duration = function(value) {
    var id = this.id;
    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
      node.__transition__[id].duration = Math.max(1, value.call(node, node.__data__, i, j));
    } : (value = Math.max(1, value), function(node) {
      node.__transition__[id].duration = value;
    }));
  };
  d3_transitionPrototype.each = function(type, listener) {
    var id = this.id;
    if (arguments.length < 2) {
      var inherit = d3_transitionInherit, inheritId = d3_transitionInheritId;
      d3_transitionInheritId = id;
      d3_selection_each(this, function(node, i, j) {
        d3_transitionInherit = node.__transition__[id];
        type.call(node, node.__data__, i, j);
      });
      d3_transitionInherit = inherit;
      d3_transitionInheritId = inheritId;
    } else {
      d3_selection_each(this, function(node) {
        var transition = node.__transition__[id];
        (transition.event || (transition.event = d3.dispatch("start", "end"))).on(type, listener);
      });
    }
    return this;
  };
  d3_transitionPrototype.transition = function() {
    var id0 = this.id, id1 = ++d3_transitionId, subgroups = [], subgroup, group, node, transition;
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        if (node = group[i]) {
          transition = Object.create(node.__transition__[id0]);
          transition.delay += transition.duration;
          d3_transitionNode(node, i, id1, transition);
        }
        subgroup.push(node);
      }
    }
    return d3_transition(subgroups, id1);
  };
  function d3_transitionNode(node, i, id, inherit) {
    var lock = node.__transition__ || (node.__transition__ = {
      active: 0,
      count: 0
    }), transition = lock[id];
    if (!transition) {
      var time = inherit.time;
      transition = lock[id] = {
        tween: new d3_Map(),
        time: time,
        ease: inherit.ease,
        delay: inherit.delay,
        duration: inherit.duration
      };
      ++lock.count;
      d3.timer(function(elapsed) {
        var d = node.__data__, ease = transition.ease, delay = transition.delay, duration = transition.duration, timer = d3_timer_active, tweened = [];
        timer.t = delay + time;
        if (delay <= elapsed) return start(elapsed - delay);
        timer.c = start;
        function start(elapsed) {
          if (lock.active > id) return stop();
          lock.active = id;
          transition.event && transition.event.start.call(node, d, i);
          transition.tween.forEach(function(key, value) {
            if (value = value.call(node, d, i)) {
              tweened.push(value);
            }
          });
          d3.timer(function() {
            timer.c = tick(elapsed || 1) ? d3_true : tick;
            return 1;
          }, 0, time);
        }
        function tick(elapsed) {
          if (lock.active !== id) return stop();
          var t = elapsed / duration, e = ease(t), n = tweened.length;
          while (n > 0) {
            tweened[--n].call(node, e);
          }
          if (t >= 1) {
            transition.event && transition.event.end.call(node, d, i);
            return stop();
          }
        }
        function stop() {
          if (--lock.count) delete lock[id]; else delete node.__transition__;
          return 1;
        }
      }, 0, time);
    }
  }
  d3.svg.axis = function() {
    var scale = d3.scale.linear(), orient = d3_svg_axisDefaultOrient, innerTickSize = 6, outerTickSize = 6, tickPadding = 3, tickArguments_ = [ 10 ], tickValues = null, tickFormat_;
    function axis(g) {
      g.each(function() {
        var g = d3.select(this);
        var scale0 = this.__chart__ || scale, scale1 = this.__chart__ = scale.copy();
        var ticks = tickValues == null ? scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain() : tickValues, tickFormat = tickFormat_ == null ? scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity : tickFormat_, tick = g.selectAll(".tick").data(ticks, scale1), tickEnter = tick.enter().insert("g", ".domain").attr("class", "tick").style("opacity", ε), tickExit = d3.transition(tick.exit()).style("opacity", ε).remove(), tickUpdate = d3.transition(tick).style("opacity", 1), tickTransform;
        var range = d3_scaleRange(scale1), path = g.selectAll(".domain").data([ 0 ]), pathUpdate = (path.enter().append("path").attr("class", "domain"), 
        d3.transition(path));
        tickEnter.append("line");
        tickEnter.append("text");
        var lineEnter = tickEnter.select("line"), lineUpdate = tickUpdate.select("line"), text = tick.select("text").text(tickFormat), textEnter = tickEnter.select("text"), textUpdate = tickUpdate.select("text");
        switch (orient) {
         case "bottom":
          {
            tickTransform = d3_svg_axisX;
            lineEnter.attr("y2", innerTickSize);
            textEnter.attr("y", Math.max(innerTickSize, 0) + tickPadding);
            lineUpdate.attr("x2", 0).attr("y2", innerTickSize);
            textUpdate.attr("x", 0).attr("y", Math.max(innerTickSize, 0) + tickPadding);
            text.attr("dy", ".71em").style("text-anchor", "middle");
            pathUpdate.attr("d", "M" + range[0] + "," + outerTickSize + "V0H" + range[1] + "V" + outerTickSize);
            break;
          }

         case "top":
          {
            tickTransform = d3_svg_axisX;
            lineEnter.attr("y2", -innerTickSize);
            textEnter.attr("y", -(Math.max(innerTickSize, 0) + tickPadding));
            lineUpdate.attr("x2", 0).attr("y2", -innerTickSize);
            textUpdate.attr("x", 0).attr("y", -(Math.max(innerTickSize, 0) + tickPadding));
            text.attr("dy", "0em").style("text-anchor", "middle");
            pathUpdate.attr("d", "M" + range[0] + "," + -outerTickSize + "V0H" + range[1] + "V" + -outerTickSize);
            break;
          }

         case "left":
          {
            tickTransform = d3_svg_axisY;
            lineEnter.attr("x2", -innerTickSize);
            textEnter.attr("x", -(Math.max(innerTickSize, 0) + tickPadding));
            lineUpdate.attr("x2", -innerTickSize).attr("y2", 0);
            textUpdate.attr("x", -(Math.max(innerTickSize, 0) + tickPadding)).attr("y", 0);
            text.attr("dy", ".32em").style("text-anchor", "end");
            pathUpdate.attr("d", "M" + -outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + -outerTickSize);
            break;
          }

         case "right":
          {
            tickTransform = d3_svg_axisY;
            lineEnter.attr("x2", innerTickSize);
            textEnter.attr("x", Math.max(innerTickSize, 0) + tickPadding);
            lineUpdate.attr("x2", innerTickSize).attr("y2", 0);
            textUpdate.attr("x", Math.max(innerTickSize, 0) + tickPadding).attr("y", 0);
            text.attr("dy", ".32em").style("text-anchor", "start");
            pathUpdate.attr("d", "M" + outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + outerTickSize);
            break;
          }
        }
        if (scale1.rangeBand) {
          var dx = scale1.rangeBand() / 2, x = function(d) {
            return scale1(d) + dx;
          };
          tickEnter.call(tickTransform, x);
          tickUpdate.call(tickTransform, x);
        } else {
          tickEnter.call(tickTransform, scale0);
          tickUpdate.call(tickTransform, scale1);
          tickExit.call(tickTransform, scale1);
        }
      });
    }
    axis.scale = function(x) {
      if (!arguments.length) return scale;
      scale = x;
      return axis;
    };
    axis.orient = function(x) {
      if (!arguments.length) return orient;
      orient = x in d3_svg_axisOrients ? x + "" : d3_svg_axisDefaultOrient;
      return axis;
    };
    axis.ticks = function() {
      if (!arguments.length) return tickArguments_;
      tickArguments_ = arguments;
      return axis;
    };
    axis.tickValues = function(x) {
      if (!arguments.length) return tickValues;
      tickValues = x;
      return axis;
    };
    axis.tickFormat = function(x) {
      if (!arguments.length) return tickFormat_;
      tickFormat_ = x;
      return axis;
    };
    axis.tickSize = function(x) {
      var n = arguments.length;
      if (!n) return innerTickSize;
      innerTickSize = +x;
      outerTickSize = +arguments[n - 1];
      return axis;
    };
    axis.innerTickSize = function(x) {
      if (!arguments.length) return innerTickSize;
      innerTickSize = +x;
      return axis;
    };
    axis.outerTickSize = function(x) {
      if (!arguments.length) return outerTickSize;
      outerTickSize = +x;
      return axis;
    };
    axis.tickPadding = function(x) {
      if (!arguments.length) return tickPadding;
      tickPadding = +x;
      return axis;
    };
    axis.tickSubdivide = function() {
      return arguments.length && axis;
    };
    return axis;
  };
  var d3_svg_axisDefaultOrient = "bottom", d3_svg_axisOrients = {
    top: 1,
    right: 1,
    bottom: 1,
    left: 1
  };
  function d3_svg_axisX(selection, x) {
    selection.attr("transform", function(d) {
      return "translate(" + x(d) + ",0)";
    });
  }
  function d3_svg_axisY(selection, y) {
    selection.attr("transform", function(d) {
      return "translate(0," + y(d) + ")";
    });
  }
  d3.svg.brush = function() {
    var event = d3_eventDispatch(brush, "brushstart", "brush", "brushend"), x = null, y = null, xExtent = [ 0, 0 ], yExtent = [ 0, 0 ], xExtentDomain, yExtentDomain, xClamp = true, yClamp = true, resizes = d3_svg_brushResizes[0];
    function brush(g) {
      g.each(function() {
        var g = d3.select(this).style("pointer-events", "all").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)").on("mousedown.brush", brushstart).on("touchstart.brush", brushstart);
        var background = g.selectAll(".background").data([ 0 ]);
        background.enter().append("rect").attr("class", "background").style("visibility", "hidden").style("cursor", "crosshair");
        g.selectAll(".extent").data([ 0 ]).enter().append("rect").attr("class", "extent").style("cursor", "move");
        var resize = g.selectAll(".resize").data(resizes, d3_identity);
        resize.exit().remove();
        resize.enter().append("g").attr("class", function(d) {
          return "resize " + d;
        }).style("cursor", function(d) {
          return d3_svg_brushCursor[d];
        }).append("rect").attr("x", function(d) {
          return /[ew]$/.test(d) ? -3 : null;
        }).attr("y", function(d) {
          return /^[ns]/.test(d) ? -3 : null;
        }).attr("width", 6).attr("height", 6).style("visibility", "hidden");
        resize.style("display", brush.empty() ? "none" : null);
        var gUpdate = d3.transition(g), backgroundUpdate = d3.transition(background), range;
        if (x) {
          range = d3_scaleRange(x);
          backgroundUpdate.attr("x", range[0]).attr("width", range[1] - range[0]);
          redrawX(gUpdate);
        }
        if (y) {
          range = d3_scaleRange(y);
          backgroundUpdate.attr("y", range[0]).attr("height", range[1] - range[0]);
          redrawY(gUpdate);
        }
        redraw(gUpdate);
      });
    }
    brush.event = function(g) {
      g.each(function() {
        var event_ = event.of(this, arguments), extent1 = {
          x: xExtent,
          y: yExtent,
          i: xExtentDomain,
          j: yExtentDomain
        }, extent0 = this.__chart__ || extent1;
        this.__chart__ = extent1;
        if (d3_transitionInheritId) {
          d3.select(this).transition().each("start.brush", function() {
            xExtentDomain = extent0.i;
            yExtentDomain = extent0.j;
            xExtent = extent0.x;
            yExtent = extent0.y;
            event_({
              type: "brushstart"
            });
          }).tween("brush:brush", function() {
            var xi = d3_interpolateArray(xExtent, extent1.x), yi = d3_interpolateArray(yExtent, extent1.y);
            xExtentDomain = yExtentDomain = null;
            return function(t) {
              xExtent = extent1.x = xi(t);
              yExtent = extent1.y = yi(t);
              event_({
                type: "brush",
                mode: "resize"
              });
            };
          }).each("end.brush", function() {
            xExtentDomain = extent1.i;
            yExtentDomain = extent1.j;
            event_({
              type: "brush",
              mode: "resize"
            });
            event_({
              type: "brushend"
            });
          });
        } else {
          event_({
            type: "brushstart"
          });
          event_({
            type: "brush",
            mode: "resize"
          });
          event_({
            type: "brushend"
          });
        }
      });
    };
    function redraw(g) {
      g.selectAll(".resize").attr("transform", function(d) {
        return "translate(" + xExtent[+/e$/.test(d)] + "," + yExtent[+/^s/.test(d)] + ")";
      });
    }
    function redrawX(g) {
      g.select(".extent").attr("x", xExtent[0]);
      g.selectAll(".extent,.n>rect,.s>rect").attr("width", xExtent[1] - xExtent[0]);
    }
    function redrawY(g) {
      g.select(".extent").attr("y", yExtent[0]);
      g.selectAll(".extent,.e>rect,.w>rect").attr("height", yExtent[1] - yExtent[0]);
    }
    function brushstart() {
      var target = this, eventTarget = d3.select(d3.event.target), event_ = event.of(target, arguments), g = d3.select(target), resizing = eventTarget.datum(), resizingX = !/^(n|s)$/.test(resizing) && x, resizingY = !/^(e|w)$/.test(resizing) && y, dragging = eventTarget.classed("extent"), dragRestore = d3_event_dragSuppress(), center, origin = d3.mouse(target), offset;
      var w = d3.select(d3_window).on("keydown.brush", keydown).on("keyup.brush", keyup);
      if (d3.event.changedTouches) {
        w.on("touchmove.brush", brushmove).on("touchend.brush", brushend);
      } else {
        w.on("mousemove.brush", brushmove).on("mouseup.brush", brushend);
      }
      g.interrupt().selectAll("*").interrupt();
      if (dragging) {
        origin[0] = xExtent[0] - origin[0];
        origin[1] = yExtent[0] - origin[1];
      } else if (resizing) {
        var ex = +/w$/.test(resizing), ey = +/^n/.test(resizing);
        offset = [ xExtent[1 - ex] - origin[0], yExtent[1 - ey] - origin[1] ];
        origin[0] = xExtent[ex];
        origin[1] = yExtent[ey];
      } else if (d3.event.altKey) center = origin.slice();
      g.style("pointer-events", "none").selectAll(".resize").style("display", null);
      d3.select("body").style("cursor", eventTarget.style("cursor"));
      event_({
        type: "brushstart"
      });
      brushmove();
      function keydown() {
        if (d3.event.keyCode == 32) {
          if (!dragging) {
            center = null;
            origin[0] -= xExtent[1];
            origin[1] -= yExtent[1];
            dragging = 2;
          }
          d3_eventPreventDefault();
        }
      }
      function keyup() {
        if (d3.event.keyCode == 32 && dragging == 2) {
          origin[0] += xExtent[1];
          origin[1] += yExtent[1];
          dragging = 0;
          d3_eventPreventDefault();
        }
      }
      function brushmove() {
        var point = d3.mouse(target), moved = false;
        if (offset) {
          point[0] += offset[0];
          point[1] += offset[1];
        }
        if (!dragging) {
          if (d3.event.altKey) {
            if (!center) center = [ (xExtent[0] + xExtent[1]) / 2, (yExtent[0] + yExtent[1]) / 2 ];
            origin[0] = xExtent[+(point[0] < center[0])];
            origin[1] = yExtent[+(point[1] < center[1])];
          } else center = null;
        }
        if (resizingX && move1(point, x, 0)) {
          redrawX(g);
          moved = true;
        }
        if (resizingY && move1(point, y, 1)) {
          redrawY(g);
          moved = true;
        }
        if (moved) {
          redraw(g);
          event_({
            type: "brush",
            mode: dragging ? "move" : "resize"
          });
        }
      }
      function move1(point, scale, i) {
        var range = d3_scaleRange(scale), r0 = range[0], r1 = range[1], position = origin[i], extent = i ? yExtent : xExtent, size = extent[1] - extent[0], min, max;
        if (dragging) {
          r0 -= position;
          r1 -= size + position;
        }
        min = (i ? yClamp : xClamp) ? Math.max(r0, Math.min(r1, point[i])) : point[i];
        if (dragging) {
          max = (min += position) + size;
        } else {
          if (center) position = Math.max(r0, Math.min(r1, 2 * center[i] - min));
          if (position < min) {
            max = min;
            min = position;
          } else {
            max = position;
          }
        }
        if (extent[0] != min || extent[1] != max) {
          if (i) yExtentDomain = null; else xExtentDomain = null;
          extent[0] = min;
          extent[1] = max;
          return true;
        }
      }
      function brushend() {
        brushmove();
        g.style("pointer-events", "all").selectAll(".resize").style("display", brush.empty() ? "none" : null);
        d3.select("body").style("cursor", null);
        w.on("mousemove.brush", null).on("mouseup.brush", null).on("touchmove.brush", null).on("touchend.brush", null).on("keydown.brush", null).on("keyup.brush", null);
        dragRestore();
        event_({
          type: "brushend"
        });
      }
    }
    brush.x = function(z) {
      if (!arguments.length) return x;
      x = z;
      resizes = d3_svg_brushResizes[!x << 1 | !y];
      return brush;
    };
    brush.y = function(z) {
      if (!arguments.length) return y;
      y = z;
      resizes = d3_svg_brushResizes[!x << 1 | !y];
      return brush;
    };
    brush.clamp = function(z) {
      if (!arguments.length) return x && y ? [ xClamp, yClamp ] : x ? xClamp : y ? yClamp : null;
      if (x && y) xClamp = !!z[0], yClamp = !!z[1]; else if (x) xClamp = !!z; else if (y) yClamp = !!z;
      return brush;
    };
    brush.extent = function(z) {
      var x0, x1, y0, y1, t;
      if (!arguments.length) {
        if (x) {
          if (xExtentDomain) {
            x0 = xExtentDomain[0], x1 = xExtentDomain[1];
          } else {
            x0 = xExtent[0], x1 = xExtent[1];
            if (x.invert) x0 = x.invert(x0), x1 = x.invert(x1);
            if (x1 < x0) t = x0, x0 = x1, x1 = t;
          }
        }
        if (y) {
          if (yExtentDomain) {
            y0 = yExtentDomain[0], y1 = yExtentDomain[1];
          } else {
            y0 = yExtent[0], y1 = yExtent[1];
            if (y.invert) y0 = y.invert(y0), y1 = y.invert(y1);
            if (y1 < y0) t = y0, y0 = y1, y1 = t;
          }
        }
        return x && y ? [ [ x0, y0 ], [ x1, y1 ] ] : x ? [ x0, x1 ] : y && [ y0, y1 ];
      }
      if (x) {
        x0 = z[0], x1 = z[1];
        if (y) x0 = x0[0], x1 = x1[0];
        xExtentDomain = [ x0, x1 ];
        if (x.invert) x0 = x(x0), x1 = x(x1);
        if (x1 < x0) t = x0, x0 = x1, x1 = t;
        if (x0 != xExtent[0] || x1 != xExtent[1]) xExtent = [ x0, x1 ];
      }
      if (y) {
        y0 = z[0], y1 = z[1];
        if (x) y0 = y0[1], y1 = y1[1];
        yExtentDomain = [ y0, y1 ];
        if (y.invert) y0 = y(y0), y1 = y(y1);
        if (y1 < y0) t = y0, y0 = y1, y1 = t;
        if (y0 != yExtent[0] || y1 != yExtent[1]) yExtent = [ y0, y1 ];
      }
      return brush;
    };
    brush.clear = function() {
      if (!brush.empty()) {
        xExtent = [ 0, 0 ], yExtent = [ 0, 0 ];
        xExtentDomain = yExtentDomain = null;
      }
      return brush;
    };
    brush.empty = function() {
      return !!x && xExtent[0] == xExtent[1] || !!y && yExtent[0] == yExtent[1];
    };
    return d3.rebind(brush, event, "on");
  };
  var d3_svg_brushCursor = {
    n: "ns-resize",
    e: "ew-resize",
    s: "ns-resize",
    w: "ew-resize",
    nw: "nwse-resize",
    ne: "nesw-resize",
    se: "nwse-resize",
    sw: "nesw-resize"
  };
  var d3_svg_brushResizes = [ [ "n", "e", "s", "w", "nw", "ne", "se", "sw" ], [ "e", "w" ], [ "n", "s" ], [] ];
  var d3_time = d3.time = {}, d3_date = Date, d3_time_daySymbols = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
  function d3_date_utc() {
    this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0]);
  }
  d3_date_utc.prototype = {
    getDate: function() {
      return this._.getUTCDate();
    },
    getDay: function() {
      return this._.getUTCDay();
    },
    getFullYear: function() {
      return this._.getUTCFullYear();
    },
    getHours: function() {
      return this._.getUTCHours();
    },
    getMilliseconds: function() {
      return this._.getUTCMilliseconds();
    },
    getMinutes: function() {
      return this._.getUTCMinutes();
    },
    getMonth: function() {
      return this._.getUTCMonth();
    },
    getSeconds: function() {
      return this._.getUTCSeconds();
    },
    getTime: function() {
      return this._.getTime();
    },
    getTimezoneOffset: function() {
      return 0;
    },
    valueOf: function() {
      return this._.valueOf();
    },
    setDate: function() {
      d3_time_prototype.setUTCDate.apply(this._, arguments);
    },
    setDay: function() {
      d3_time_prototype.setUTCDay.apply(this._, arguments);
    },
    setFullYear: function() {
      d3_time_prototype.setUTCFullYear.apply(this._, arguments);
    },
    setHours: function() {
      d3_time_prototype.setUTCHours.apply(this._, arguments);
    },
    setMilliseconds: function() {
      d3_time_prototype.setUTCMilliseconds.apply(this._, arguments);
    },
    setMinutes: function() {
      d3_time_prototype.setUTCMinutes.apply(this._, arguments);
    },
    setMonth: function() {
      d3_time_prototype.setUTCMonth.apply(this._, arguments);
    },
    setSeconds: function() {
      d3_time_prototype.setUTCSeconds.apply(this._, arguments);
    },
    setTime: function() {
      d3_time_prototype.setTime.apply(this._, arguments);
    }
  };
  var d3_time_prototype = Date.prototype;
  var d3_time_formatDateTime = "%a %b %e %X %Y", d3_time_formatDate = "%m/%d/%Y", d3_time_formatTime = "%H:%M:%S";
  var d3_time_days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ], d3_time_dayAbbreviations = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ], d3_time_months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ], d3_time_monthAbbreviations = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  function d3_time_interval(local, step, number) {
    function round(date) {
      var d0 = local(date), d1 = offset(d0, 1);
      return date - d0 < d1 - date ? d0 : d1;
    }
    function ceil(date) {
      step(date = local(new d3_date(date - 1)), 1);
      return date;
    }
    function offset(date, k) {
      step(date = new d3_date(+date), k);
      return date;
    }
    function range(t0, t1, dt) {
      var time = ceil(t0), times = [];
      if (dt > 1) {
        while (time < t1) {
          if (!(number(time) % dt)) times.push(new Date(+time));
          step(time, 1);
        }
      } else {
        while (time < t1) times.push(new Date(+time)), step(time, 1);
      }
      return times;
    }
    function range_utc(t0, t1, dt) {
      try {
        d3_date = d3_date_utc;
        var utc = new d3_date_utc();
        utc._ = t0;
        return range(utc, t1, dt);
      } finally {
        d3_date = Date;
      }
    }
    local.floor = local;
    local.round = round;
    local.ceil = ceil;
    local.offset = offset;
    local.range = range;
    var utc = local.utc = d3_time_interval_utc(local);
    utc.floor = utc;
    utc.round = d3_time_interval_utc(round);
    utc.ceil = d3_time_interval_utc(ceil);
    utc.offset = d3_time_interval_utc(offset);
    utc.range = range_utc;
    return local;
  }
  function d3_time_interval_utc(method) {
    return function(date, k) {
      try {
        d3_date = d3_date_utc;
        var utc = new d3_date_utc();
        utc._ = date;
        return method(utc, k)._;
      } finally {
        d3_date = Date;
      }
    };
  }
  d3_time.year = d3_time_interval(function(date) {
    date = d3_time.day(date);
    date.setMonth(0, 1);
    return date;
  }, function(date, offset) {
    date.setFullYear(date.getFullYear() + offset);
  }, function(date) {
    return date.getFullYear();
  });
  d3_time.years = d3_time.year.range;
  d3_time.years.utc = d3_time.year.utc.range;
  d3_time.day = d3_time_interval(function(date) {
    var day = new d3_date(2e3, 0);
    day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    return day;
  }, function(date, offset) {
    date.setDate(date.getDate() + offset);
  }, function(date) {
    return date.getDate() - 1;
  });
  d3_time.days = d3_time.day.range;
  d3_time.days.utc = d3_time.day.utc.range;
  d3_time.dayOfYear = function(date) {
    var year = d3_time.year(date);
    return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);
  };
  d3_time_daySymbols.forEach(function(day, i) {
    day = day.toLowerCase();
    i = 7 - i;
    var interval = d3_time[day] = d3_time_interval(function(date) {
      (date = d3_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);
      return date;
    }, function(date, offset) {
      date.setDate(date.getDate() + Math.floor(offset) * 7);
    }, function(date) {
      var day = d3_time.year(date).getDay();
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);
    });
    d3_time[day + "s"] = interval.range;
    d3_time[day + "s"].utc = interval.utc.range;
    d3_time[day + "OfYear"] = function(date) {
      var day = d3_time.year(date).getDay();
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7);
    };
  });
  d3_time.week = d3_time.sunday;
  d3_time.weeks = d3_time.sunday.range;
  d3_time.weeks.utc = d3_time.sunday.utc.range;
  d3_time.weekOfYear = d3_time.sundayOfYear;
  d3_time.format = d3_time_format;
  function d3_time_format(template) {
    var n = template.length;
    function format(date) {
      var string = [], i = -1, j = 0, c, p, f;
      while (++i < n) {
        if (template.charCodeAt(i) === 37) {
          string.push(template.substring(j, i));
          if ((p = d3_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i);
          if (f = d3_time_formats[c]) c = f(date, p == null ? c === "e" ? " " : "0" : p);
          string.push(c);
          j = i + 1;
        }
      }
      string.push(template.substring(j, i));
      return string.join("");
    }
    format.parse = function(string) {
      var d = {
        y: 1900,
        m: 0,
        d: 1,
        H: 0,
        M: 0,
        S: 0,
        L: 0,
        Z: null
      }, i = d3_time_parse(d, template, string, 0);
      if (i != string.length) return null;
      if ("p" in d) d.H = d.H % 12 + d.p * 12;
      var localZ = d.Z != null && d3_date !== d3_date_utc, date = new (localZ ? d3_date_utc : d3_date)();
      if ("j" in d) date.setFullYear(d.y, 0, d.j); else if ("w" in d && ("W" in d || "U" in d)) {
        date.setFullYear(d.y, 0, 1);
        date.setFullYear(d.y, 0, "W" in d ? (d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7 : d.w + d.U * 7 - (date.getDay() + 6) % 7);
      } else date.setFullYear(d.y, d.m, d.d);
      date.setHours(d.H + Math.floor(d.Z / 100), d.M + d.Z % 100, d.S, d.L);
      return localZ ? date._ : date;
    };
    format.toString = function() {
      return template;
    };
    return format;
  }
  function d3_time_parse(date, template, string, j) {
    var c, p, t, i = 0, n = template.length, m = string.length;
    while (i < n) {
      if (j >= m) return -1;
      c = template.charCodeAt(i++);
      if (c === 37) {
        t = template.charAt(i++);
        p = d3_time_parsers[t in d3_time_formatPads ? template.charAt(i++) : t];
        if (!p || (j = p(date, string, j)) < 0) return -1;
      } else if (c != string.charCodeAt(j++)) {
        return -1;
      }
    }
    return j;
  }
  function d3_time_formatRe(names) {
    return new RegExp("^(?:" + names.map(d3.requote).join("|") + ")", "i");
  }
  function d3_time_formatLookup(names) {
    var map = new d3_Map(), i = -1, n = names.length;
    while (++i < n) map.set(names[i].toLowerCase(), i);
    return map;
  }
  function d3_time_formatPad(value, fill, width) {
    var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }
  var d3_time_dayRe = d3_time_formatRe(d3_time_days), d3_time_dayLookup = d3_time_formatLookup(d3_time_days), d3_time_dayAbbrevRe = d3_time_formatRe(d3_time_dayAbbreviations), d3_time_dayAbbrevLookup = d3_time_formatLookup(d3_time_dayAbbreviations), d3_time_monthRe = d3_time_formatRe(d3_time_months), d3_time_monthLookup = d3_time_formatLookup(d3_time_months), d3_time_monthAbbrevRe = d3_time_formatRe(d3_time_monthAbbreviations), d3_time_monthAbbrevLookup = d3_time_formatLookup(d3_time_monthAbbreviations), d3_time_percentRe = /^%/;
  var d3_time_formatPads = {
    "-": "",
    _: " ",
    "0": "0"
  };
  var d3_time_formats = {
    a: function(d) {
      return d3_time_dayAbbreviations[d.getDay()];
    },
    A: function(d) {
      return d3_time_days[d.getDay()];
    },
    b: function(d) {
      return d3_time_monthAbbreviations[d.getMonth()];
    },
    B: function(d) {
      return d3_time_months[d.getMonth()];
    },
    c: d3_time_format(d3_time_formatDateTime),
    d: function(d, p) {
      return d3_time_formatPad(d.getDate(), p, 2);
    },
    e: function(d, p) {
      return d3_time_formatPad(d.getDate(), p, 2);
    },
    H: function(d, p) {
      return d3_time_formatPad(d.getHours(), p, 2);
    },
    I: function(d, p) {
      return d3_time_formatPad(d.getHours() % 12 || 12, p, 2);
    },
    j: function(d, p) {
      return d3_time_formatPad(1 + d3_time.dayOfYear(d), p, 3);
    },
    L: function(d, p) {
      return d3_time_formatPad(d.getMilliseconds(), p, 3);
    },
    m: function(d, p) {
      return d3_time_formatPad(d.getMonth() + 1, p, 2);
    },
    M: function(d, p) {
      return d3_time_formatPad(d.getMinutes(), p, 2);
    },
    p: function(d) {
      return d.getHours() >= 12 ? "PM" : "AM";
    },
    S: function(d, p) {
      return d3_time_formatPad(d.getSeconds(), p, 2);
    },
    U: function(d, p) {
      return d3_time_formatPad(d3_time.sundayOfYear(d), p, 2);
    },
    w: function(d) {
      return d.getDay();
    },
    W: function(d, p) {
      return d3_time_formatPad(d3_time.mondayOfYear(d), p, 2);
    },
    x: d3_time_format(d3_time_formatDate),
    X: d3_time_format(d3_time_formatTime),
    y: function(d, p) {
      return d3_time_formatPad(d.getFullYear() % 100, p, 2);
    },
    Y: function(d, p) {
      return d3_time_formatPad(d.getFullYear() % 1e4, p, 4);
    },
    Z: d3_time_zone,
    "%": function() {
      return "%";
    }
  };
  var d3_time_parsers = {
    a: d3_time_parseWeekdayAbbrev,
    A: d3_time_parseWeekday,
    b: d3_time_parseMonthAbbrev,
    B: d3_time_parseMonth,
    c: d3_time_parseLocaleFull,
    d: d3_time_parseDay,
    e: d3_time_parseDay,
    H: d3_time_parseHour24,
    I: d3_time_parseHour24,
    j: d3_time_parseDayOfYear,
    L: d3_time_parseMilliseconds,
    m: d3_time_parseMonthNumber,
    M: d3_time_parseMinutes,
    p: d3_time_parseAmPm,
    S: d3_time_parseSeconds,
    U: d3_time_parseWeekNumberSunday,
    w: d3_time_parseWeekdayNumber,
    W: d3_time_parseWeekNumberMonday,
    x: d3_time_parseLocaleDate,
    X: d3_time_parseLocaleTime,
    y: d3_time_parseYear,
    Y: d3_time_parseFullYear,
    Z: d3_time_parseZone,
    "%": d3_time_parseLiteralPercent
  };
  function d3_time_parseWeekdayAbbrev(date, string, i) {
    d3_time_dayAbbrevRe.lastIndex = 0;
    var n = d3_time_dayAbbrevRe.exec(string.substring(i));
    return n ? (date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }
  function d3_time_parseWeekday(date, string, i) {
    d3_time_dayRe.lastIndex = 0;
    var n = d3_time_dayRe.exec(string.substring(i));
    return n ? (date.w = d3_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }
  function d3_time_parseWeekdayNumber(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 1));
    return n ? (date.w = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseWeekNumberSunday(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i));
    return n ? (date.U = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseWeekNumberMonday(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i));
    return n ? (date.W = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseMonthAbbrev(date, string, i) {
    d3_time_monthAbbrevRe.lastIndex = 0;
    var n = d3_time_monthAbbrevRe.exec(string.substring(i));
    return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }
  function d3_time_parseMonth(date, string, i) {
    d3_time_monthRe.lastIndex = 0;
    var n = d3_time_monthRe.exec(string.substring(i));
    return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
  }
  function d3_time_parseLocaleFull(date, string, i) {
    return d3_time_parse(date, d3_time_formats.c.toString(), string, i);
  }
  function d3_time_parseLocaleDate(date, string, i) {
    return d3_time_parse(date, d3_time_formats.x.toString(), string, i);
  }
  function d3_time_parseLocaleTime(date, string, i) {
    return d3_time_parse(date, d3_time_formats.X.toString(), string, i);
  }
  function d3_time_parseFullYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 4));
    return n ? (date.y = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));
    return n ? (date.y = d3_time_expandYear(+n[0]), i + n[0].length) : -1;
  }
  function d3_time_parseZone(date, string, i) {
    return /^[+-]\d{4}$/.test(string = string.substring(i, i + 5)) ? (date.Z = +string, 
    i + 5) : -1;
  }
  function d3_time_expandYear(d) {
    return d + (d > 68 ? 1900 : 2e3);
  }
  function d3_time_parseMonthNumber(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));
    return n ? (date.m = n[0] - 1, i + n[0].length) : -1;
  }
  function d3_time_parseDay(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));
    return n ? (date.d = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseDayOfYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 3));
    return n ? (date.j = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseHour24(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));
    return n ? (date.H = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseMinutes(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));
    return n ? (date.M = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseSeconds(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));
    return n ? (date.S = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseMilliseconds(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.substring(i, i + 3));
    return n ? (date.L = +n[0], i + n[0].length) : -1;
  }
  var d3_time_numberRe = /^\s*\d+/;
  function d3_time_parseAmPm(date, string, i) {
    var n = d3_time_amPmLookup.get(string.substring(i, i += 2).toLowerCase());
    return n == null ? -1 : (date.p = n, i);
  }
  var d3_time_amPmLookup = d3.map({
    am: 0,
    pm: 1
  });
  function d3_time_zone(d) {
    var z = d.getTimezoneOffset(), zs = z > 0 ? "-" : "+", zh = ~~(abs(z) / 60), zm = abs(z) % 60;
    return zs + d3_time_formatPad(zh, "0", 2) + d3_time_formatPad(zm, "0", 2);
  }
  function d3_time_parseLiteralPercent(date, string, i) {
    d3_time_percentRe.lastIndex = 0;
    var n = d3_time_percentRe.exec(string.substring(i, i + 1));
    return n ? i + n[0].length : -1;
  }
  d3_time_format.utc = d3_time_formatUtc;
  function d3_time_formatUtc(template) {
    var local = d3_time_format(template);
    function format(date) {
      try {
        d3_date = d3_date_utc;
        var utc = new d3_date();
        utc._ = date;
        return local(utc);
      } finally {
        d3_date = Date;
      }
    }
    format.parse = function(string) {
      try {
        d3_date = d3_date_utc;
        var date = local.parse(string);
        return date && date._;
      } finally {
        d3_date = Date;
      }
    };
    format.toString = local.toString;
    return format;
  }
  var d3_time_formatIso = d3_time_formatUtc("%Y-%m-%dT%H:%M:%S.%LZ");
  d3_time_format.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z") ? d3_time_formatIsoNative : d3_time_formatIso;
  function d3_time_formatIsoNative(date) {
    return date.toISOString();
  }
  d3_time_formatIsoNative.parse = function(string) {
    var date = new Date(string);
    return isNaN(date) ? null : date;
  };
  d3_time_formatIsoNative.toString = d3_time_formatIso.toString;
  d3_time.second = d3_time_interval(function(date) {
    return new d3_date(Math.floor(date / 1e3) * 1e3);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 1e3);
  }, function(date) {
    return date.getSeconds();
  });
  d3_time.seconds = d3_time.second.range;
  d3_time.seconds.utc = d3_time.second.utc.range;
  d3_time.minute = d3_time_interval(function(date) {
    return new d3_date(Math.floor(date / 6e4) * 6e4);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 6e4);
  }, function(date) {
    return date.getMinutes();
  });
  d3_time.minutes = d3_time.minute.range;
  d3_time.minutes.utc = d3_time.minute.utc.range;
  d3_time.hour = d3_time_interval(function(date) {
    var timezone = date.getTimezoneOffset() / 60;
    return new d3_date((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 36e5);
  }, function(date) {
    return date.getHours();
  });
  d3_time.hours = d3_time.hour.range;
  d3_time.hours.utc = d3_time.hour.utc.range;
  d3_time.month = d3_time_interval(function(date) {
    date = d3_time.day(date);
    date.setDate(1);
    return date;
  }, function(date, offset) {
    date.setMonth(date.getMonth() + offset);
  }, function(date) {
    return date.getMonth();
  });
  d3_time.months = d3_time.month.range;
  d3_time.months.utc = d3_time.month.utc.range;
  function d3_time_scale(linear, methods, format) {
    function scale(x) {
      return linear(x);
    }
    scale.invert = function(x) {
      return d3_time_scaleDate(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return linear.domain().map(d3_time_scaleDate);
      linear.domain(x);
      return scale;
    };
    function tickMethod(extent, count) {
      var span = extent[1] - extent[0], target = span / count, i = d3.bisect(d3_time_scaleSteps, target);
      return i == d3_time_scaleSteps.length ? [ methods.year, d3_scale_linearTickRange(extent.map(function(d) {
        return d / 31536e6;
      }), count)[2] ] : !i ? [ d3_time_scaleMilliseconds, d3_scale_linearTickRange(extent, count)[2] ] : methods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target ? i - 1 : i];
    }
    scale.nice = function(interval, skip) {
      var domain = scale.domain(), extent = d3_scaleExtent(domain), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" && tickMethod(extent, interval);
      if (method) interval = method[0], skip = method[1];
      function skipped(date) {
        return !isNaN(date) && !interval.range(date, d3_time_scaleDate(+date + 1), skip).length;
      }
      return scale.domain(d3_scale_nice(domain, skip > 1 ? {
        floor: function(date) {
          while (skipped(date = interval.floor(date))) date = d3_time_scaleDate(date - 1);
          return date;
        },
        ceil: function(date) {
          while (skipped(date = interval.ceil(date))) date = d3_time_scaleDate(+date + 1);
          return date;
        }
      } : interval));
    };
    scale.ticks = function(interval, skip) {
      var extent = d3_scaleExtent(scale.domain()), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" ? tickMethod(extent, interval) : !interval.range && [ {
        range: interval
      }, skip ];
      if (method) interval = method[0], skip = method[1];
      return interval.range(extent[0], d3_time_scaleDate(+extent[1] + 1), skip < 1 ? 1 : skip);
    };
    scale.tickFormat = function() {
      return format;
    };
    scale.copy = function() {
      return d3_time_scale(linear.copy(), methods, format);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  function d3_time_scaleDate(t) {
    return new Date(t);
  }
  function d3_time_scaleFormat(formats) {
    return function(date) {
      var i = formats.length - 1, f = formats[i];
      while (!f[1](date)) f = formats[--i];
      return f[0](date);
    };
  }
  var d3_time_scaleSteps = [ 1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6 ];
  var d3_time_scaleLocalMethods = [ [ d3_time.second, 1 ], [ d3_time.second, 5 ], [ d3_time.second, 15 ], [ d3_time.second, 30 ], [ d3_time.minute, 1 ], [ d3_time.minute, 5 ], [ d3_time.minute, 15 ], [ d3_time.minute, 30 ], [ d3_time.hour, 1 ], [ d3_time.hour, 3 ], [ d3_time.hour, 6 ], [ d3_time.hour, 12 ], [ d3_time.day, 1 ], [ d3_time.day, 2 ], [ d3_time.week, 1 ], [ d3_time.month, 1 ], [ d3_time.month, 3 ], [ d3_time.year, 1 ] ];
  var d3_time_scaleLocalFormats = [ [ d3_time_format("%Y"), d3_true ], [ d3_time_format("%B"), function(d) {
    return d.getMonth();
  } ], [ d3_time_format("%b %d"), function(d) {
    return d.getDate() != 1;
  } ], [ d3_time_format("%a %d"), function(d) {
    return d.getDay() && d.getDate() != 1;
  } ], [ d3_time_format("%I %p"), function(d) {
    return d.getHours();
  } ], [ d3_time_format("%I:%M"), function(d) {
    return d.getMinutes();
  } ], [ d3_time_format(":%S"), function(d) {
    return d.getSeconds();
  } ], [ d3_time_format(".%L"), function(d) {
    return d.getMilliseconds();
  } ] ];
  var d3_time_scaleLocalFormat = d3_time_scaleFormat(d3_time_scaleLocalFormats);
  d3_time_scaleLocalMethods.year = d3_time.year;
  d3_time.scale = function() {
    return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat);
  };
  var d3_time_scaleMilliseconds = {
    range: function(start, stop, step) {
      return d3.range(+start, +stop, step).map(d3_time_scaleDate);
    }
  };
  var d3_time_scaleUTCMethods = d3_time_scaleLocalMethods.map(function(m) {
    return [ m[0].utc, m[1] ];
  });
  var d3_time_scaleUTCFormats = [ [ d3_time_formatUtc("%Y"), d3_true ], [ d3_time_formatUtc("%B"), function(d) {
    return d.getUTCMonth();
  } ], [ d3_time_formatUtc("%b %d"), function(d) {
    return d.getUTCDate() != 1;
  } ], [ d3_time_formatUtc("%a %d"), function(d) {
    return d.getUTCDay() && d.getUTCDate() != 1;
  } ], [ d3_time_formatUtc("%I %p"), function(d) {
    return d.getUTCHours();
  } ], [ d3_time_formatUtc("%I:%M"), function(d) {
    return d.getUTCMinutes();
  } ], [ d3_time_formatUtc(":%S"), function(d) {
    return d.getUTCSeconds();
  } ], [ d3_time_formatUtc(".%L"), function(d) {
    return d.getUTCMilliseconds();
  } ] ];
  var d3_time_scaleUTCFormat = d3_time_scaleFormat(d3_time_scaleUTCFormats);
  d3_time_scaleUTCMethods.year = d3_time.year.utc;
  d3_time.scale.utc = function() {
    return d3_time_scale(d3.scale.linear(), d3_time_scaleUTCMethods, d3_time_scaleUTCFormat);
  };
  d3.text = d3_xhrType(function(request) {
    return request.responseText;
  });
  d3.json = function(url, callback) {
    return d3_xhr(url, "application/json", d3_json, callback);
  };
  function d3_json(request) {
    return JSON.parse(request.responseText);
  }
  d3.html = function(url, callback) {
    return d3_xhr(url, "text/html", d3_html, callback);
  };
  function d3_html(request) {
    var range = d3_document.createRange();
    range.selectNode(d3_document.body);
    return range.createContextualFragment(request.responseText);
  }
  d3.xml = d3_xhrType(function(request) {
    return request.responseXML;
  });
  return d3;
}();
define("d3", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.d3;
    };
}(this)));

define('js/canvas/NodeOption',['underscore', 'd3', 'backbone'],
function (_, d3, Backbone)
{
  

  // arguments
  // {
  //   root: jQuery node
  //   options: defaults item
  //   pos: { x: int, y: int } to place it on paletter
  //   toInternalPosition: function to get internal topology coordinates
  function NodeOption(args)
  {
    this.root = args.root;
    this.options = args.options;
    this.pos = args.pos;
    this.toInternalPosition = args.toInternalPosition;
    this.force = args.force;
    this.validList = args.validList;
    this.lazy = null;
    this.marker = null;
    this.lastPos = null;
    _.extend(this, Backbone.Events);
  }

  NodeOption.prototype = {

    render: function ()
    {
      this.lazy = this.makeNode(this.root);
      this.lazy.style('visibility', 'hidden');
      this.marker = this.makeNode(this.root);
      var drag = d3.behavior.drag()
	.on('dragstart', _.bind(this.dragStart, this))
	.on('drag', _.bind(this.dragMove, this))
	.on('dragend', _.bind(this.dragEnd, this));
      this.marker.call(drag);
    },

    makeNode: function (root)
    {
      var result = root.append('svg:g')
	.attr('transform', 'translate(' + this.pos.x + ', ' +
	      this.pos.y + ')')
        .attr("class", "node");

      result.append('svg:rect')
	.attr('class', 'nodebox')
	.attr('x', '-30px')
	.attr('y', '-25px')
	.attr('width', '60px')
	.attr('height', '65px');

      var iconUrl = window.JACKS_LOADER.basePath + 'images/default.svg';
      if (this.options.icon)
      {
	iconUrl = this.options.icon;
      }
      result.append('svg:image')
	.attr("class", "nodebox")
	.attr("x", "-20px")
	.attr("y", "-20px")
	.attr("width", "40px")
	.attr("height", "40px")
	.attr("xlink:href", iconUrl);

      var name = 'New Node';
      if (this.options.name)
      {
	name = this.options.name;
      }
      result.append('svg:text')
	.attr("class", "nodetextpalette")
	.attr("x", "0px")
	.attr("y", "35px")
	.text(name);
      return result;
    },

    dragStart: function ()
    {
      this.lazy.style('visibility', 'visible');
      this.lastPos = null;
      this.force.stop();
    },

    dragMove: function ()
    {
      this.marker.attr('transform', 'translate(' + (d3.event.x - 20) +
		       ',' + (d3.event.y - 10) + ')');
      var oldClosest = null;
      if (this.lastPos)
      {
	oldClosest = this.lastPos.closestSite;
      }
      this.lastPos = this.toInternalPosition({ x: d3.event.x,
					       y: d3.event.y });
      if (this.lastPos.closestSite !== null)
      {
	this.lastPos.closestSite.update(true, undefined,
					[this.lastPos.topX,
					 this.lastPos.topY]);
      }
      if (this.lastPos.closestSite !== oldClosest &&
	  oldClosest !== null)
      {
	oldClosest.update(true);
      }
      if (this.lastPos.closestSite !== oldClosest &&
	  this.lastPos.closestSite !== null)
      {
	var node = _.clone(this.options);
	node.custom = {};
	if (this.validList.isValidNode(node,
				       this.lastPos.closestSite.model))
	{
	  this.marker.classed('invalid', false);
	}
	else
	{
	  this.marker.classed('invalid', true);
	}
      }
    },

    dragEnd: function ()
    {
      this.lazy.style('visibility', 'hidden');
      if (this.lastPos && this.lastPos.closestSite !== null)
      {
	this.trigger('create-node', this.lastPos.topX, this.lastPos.topY,
		     this.lastPos.closestSite.model.id);
      }
      this.marker.attr('transform', 'translate(' + this.pos.x + ', ' +
		       this.pos.y + ')')
      this.marker.classed('invalid', false);
    },

  };

  return NodeOption;
});

define('js/canvas/TopologyBackground',['underscore', 'd3', 'backbone', 'js/canvas/NodeOption'],
function (_, d3, Backbone, NodeOption)
{
  

  function TopologyBackground(domRoot, forceNodes, sites, defaults,
			      clickUpdate, context, force, validList)
  {
    this.root = d3.select(domRoot[0]);
    this.forceNodes = forceNodes;
    this.sites = sites;
    this.defaults = defaults;
    this.clickUpdate = clickUpdate;
    this.context = context;
    this.force = force;
    this.validList = validList;
    this.zoom = d3.behavior.zoom()
      .size([100, 100])
      .scale(1)
      .translate([50, 50])
      .on('zoom', _.bind(this.handleRescale, this));
    this.width = 1000;
    this.height = 1000;
    this.lastCenter = null;
    this.justClickedOutside = false;
    this.paletteOffset = 300;
    if (context.mode !== 'editor' && ! context.show.selectInfo)
    {
      this.paletteOffset = 0;
    }

    _.extend(this, Backbone.Events);
  }

  TopologyBackground.prototype = {

    render: function ()
    {
      this.outer = this.root.append("svg:svg")
	.attr("class", "topomap")
//	.style("visibility", "hidden")
	.attr("width", this.width)
	.attr("height", this.height)
	.attr("pointer-events", "all");

      this.viewport = this.outer.append('svg:g')
	.attr('width', this.width - this.paletteOffset)
	.attr('height', this.height)
	.attr('transform', 'translate(' + this.paletteOffset + ', 0)')
	.call(this.zoom);

      this.rect = this.viewport.append("svg:rect")
	.attr("class", "rect")
	.attr("width", this.width - this.paletteOffset)
	.attr("height", this.height)
	.style("fill", "#fff")
	.on("click", _.bind(this.handleClickOutside, this))
	.on("mousedown", _.bind(this.handleMouseDown, this))
	.on("mouseup", _.bind(this.handleMouseUp, this));

      this.inner = this.viewport
	.append('svg:g')
	.attr("class", "vis");

      this.hullBase = this.inner.append('svg:g');
      this.linkBase = this.inner.append('svg:g');

      this.dragLine = this.inner.append('svg:line')
	.attr('class', 'linkline dragline hidden')
	.attr('x1', '0')
	.attr('y1', '0')
	.attr('x2', '0')
	.attr('y2', '0');

      this.nodeBase = this.inner.append('svg:g');
      this.hullLabelBase = this.inner.append('svg:g');

      this.palette = this.outer.append('svg:g')
	.attr('width', this.paletteOffset)
	.attr('height', this.height);
      this.paletteBackground = this.palette.append('svg:rect')
	.attr('fill', '#ddd')
	.attr('width', this.paletteOffset)
	.attr('height', this.height);

      if (this.context.mode === 'editor')
      {
	this.palette.append('svg:text')
          .attr('x', '150px')
	  .attr('y', '30px')
          .attr('class', 'dragtext')
	  .text('Drag to Add');

	this.nodeMarkers = [];
	
	var i = 0;
	_.each(this.defaults, function (options) {
	  var marker = new NodeOption({
	    root: this.outer,
	    options: options,
	    pos: {
	      x: 75 + (i%3) * 75,
	      y: 70 + 75 * Math.floor(i/3)
	    },
	    toInternalPosition: _.bind(this.toInternalPosition, this),
	    force: this.force,
	    validList: this.validList
	  });
	  marker.on('create-node', function (x, y, site) {
	    this.trigger('create-node', x, y, site, options);
	  }.bind(this));
	  console.log("nikos");
	  console.log(marker);
	  marker.render();
	  this.nodeMarkers.push(marker);
	  console.log( this.nodeMarkers);
	  i += 1;
	}.bind(this));

	if (this.context.multiSite)
	{
	  this.siteOrigin = { x: 125,
			      y: 100 + 75 * Math.ceil(i/3) };

	  this.lazySite = this.makeSite(this.outer);
	  this.lazySite.style('visibility', 'hidden');
	  this.siteMarker = this.makeSite(this.outer);
	  var siteDrag = d3.behavior.drag()
	    .on('dragstart', _.bind(this.siteDragStart, this))
	    .on('drag', _.bind(this.siteDragMove, this))
	    .on('dragend', _.bind(this.siteDragEnd, this));
	  this.siteMarker.call(siteDrag);
	}
      }

      //this.rescaleToZoom();
      this.centerScale();
    },

    makeSite: function (root)
    {
      var result = root.append('svg:g')
	.attr('transform', 'translate(' + this.siteOrigin.x + ', ' +
	      this.siteOrigin.y + ')')
	.attr('class', 'site-marker')
	.attr('style', 'cursor: pointer');

      result.append('svg:path')
        .style("fill", 'rgb(255, 127, 144)')
        .style("stroke", 'rgb(147, 127, 14)')
        .style("stroke-width", 80)
        .style("stroke-linejoin", "round")
        .style("opacity", .6)
	.attr('d', 'M-20,0L70,0Z');
      var label = result.append('svg:g')
	.attr('class', 'sitelabelgroup')
	.attr('transform', 'translate(25, 5)');

      label.append('svg:rect')
        .attr('class', 'labelbox')
        .attr('x', '-40px')
        .attr('y', '-14px')
        .attr('width', '80px')
        .attr('height', '20px');

      label.append('svg:text')
        .attr('x', '0px')
        .attr("class", "sitetext")
	.text('New Site');

      return result;
    },
   makeSite2: function (root)
    {
      var result = root.append('svg:g')
	.attr('transform', 'translate(' + this.siteOrigin.x + ', ' +
	      this.siteOrigin.y + ')')
	.attr('class', 'site-marker')
	.attr('style', 'cursor: pointer');

      result.append('svg:path')
        .style("fill", 'rgb(255, 127, 144)')
        .style("stroke", 'rgb(147, 127, 14)')
        .style("stroke-width", 80)
        .style("stroke-linejoin", "round")
        .style("opacity", .6)
	.attr('d', 'M-20,0L70,0Z');
      var label = result.append('svg:g')
	.attr('class', 'sitelabelgroup')
	.attr('transform', 'translate(25, 5)');

      label.append('svg:rect')
        .attr('class', 'labelbox')
        .attr('x', '-40px')
        .attr('y', '-14px')
        .attr('width', '80px')
        .attr('height', '20px');

      label.append('svg:text')
        .attr('x', '0px')
        .attr("class", "sitetext")
	.text('New Sitet');

      return result;
    },
    resize: function (width, height)
    {
      if (width > 0 && height > 0)
      {
	this.width = width - this.paletteOffset;
	this.height = height;
	this.zoom.size([width - this.paletteOffset, height]);
	this.outer.attr('width', width).attr('height', height);
	this.palette.attr('height', height);
	this.paletteBackground.attr('height', height);
	this.viewport.attr('width', width - this.paletteOffset).attr('height', height);
	this.rect.attr('width', width - this.paletteOffset).attr('height', height);
	//this.rescaleToZoom();
	this.centerScale(true);
      }
    },

    centerScale: function (alwaysRecenter)
    {
      var nodes = _.clone(this.forceNodes);
      _.each(this.sites, function (site) {
	nodes.push(site.label);
      });
      var minX = getExtreme(Math.min, nodes, 'x');
      var maxX = getExtreme(Math.max, nodes, 'x');
      var minY = getExtreme(Math.min, nodes, 'y');
      var maxY = getExtreme(Math.max, nodes, 'y');
      var center = {
	tx: 0,
	ty: 0,
	scale: 1
      };
      if (minX !== null && minY !== null && maxX !== null && maxY !== null)
      {
	var width = maxX - minX + 200;
	var height = maxY - minY + 200;
	center.scale = Math.min(this.width / width,
				this.height / height);
	center.scale = Math.min(center.scale, 1);
//      center.scale *= 1.2; 
	var marginX = (this.width/center.scale - (maxX - minX))/2;
	var marginY = (this.height/center.scale - (maxY - minY))/2;
	center.tx = -(minX*center.scale) + marginX*center.scale;
	center.ty = -(minY*center.scale) + marginY*center.scale;
      }
      if (alwaysRecenter ||
	  ! this.lastCenter ||
	  Math.abs(this.lastCenter.tx - center.tx) > 100 ||
	  Math.abs(this.lastCenter.ty - center.ty) > 100 ||
	  center.scale / this.lastCenter.scale > 1.2 ||
	  center.scale / this.lastCenter.scale < 1.0)
      {
	this.lastCenter = center;
	this.inner.attr('transform',
			'translate(' + center.tx + ',' + center.ty + ')' +
			'scale(' + center.scale + ')');
      }
      this.lastCenter.scale = center.scale;
      this.zoom.translate([center.tx, center.ty]);
      this.zoom.scale(center.scale);
    },

    rescaleToZoom: function ()
    {
      this.rescaleTo(this.zoom.translate()[0],
		     this.zoom.translate()[1],
		     this.zoom.scale());
    },

    rescaleTo: function (x, y, scale)
    {
      var baseWidth = 1000;
      var baseHeight = 1000;
      var minScale = Math.max(this.width / baseWidth,
			      this.height / baseHeight);
      var xScale = scale;
      var yScale = scale;
      if (baseWidth * scale <= this.width)
      {
	xScale = this.width / baseWidth;
      }
      if (baseHeight * scale <= this.height)
      {
	yScale = this.height / baseHeight;
      }
      var finalScale = Math.max(xScale, yScale);

      var tx = Math.min(0, Math.max(this.width - baseWidth * finalScale, x));
      var ty = Math.min(0, Math.max(this.height - baseHeight * finalScale, y));
      this.zoom.translate([tx, ty]);
      this.zoom.scale(finalScale);
      this.zoom.scaleExtent([minScale, 20]);
      this.inner.attr('transform',
		      'translate(' + tx + ',' + ty + ')' +
		      'scale(' + finalScale + ')');
//      this.tour.update();
    },

    showDragLine: function (start, end)
    {
      this.dragLine.classed('hidden', false)
	.attr('x1', start.x)
	.attr('y1', start.y)
	.attr('x2', end.x)
	.attr('y2', end.y);
    },

    hideDragLine: function ()
    {
      this.dragLine.classed('hidden', true);
    },

    handleRescale: function ()
    {
//    //if (! this.isMouseDown)
//    {
//      this.rescaleTo(d3.event.translate[0], d3.event.translate[1],
//		     d3.event.scale);
//    }
    },

    handleMouseDown: function (event)
    {
      var that = this;
      this.justClickedOutside = true;
      _.delay(function () { that.justClickedOutside = false; }, 200);
//      this.domRoot.addClass("unselectable");
    },

    handleMouseUp: function (event)
    {
//      this.domRoot.removeClass("unselectable");
    },

    handleClickOutside: function (event)
    {
      if (this.justClickedOutside)
      {
	this.clickUpdate.trigger('click-outside',
				 { event: _.clone(d3.event) });
      }
    },

    siteDragStart: function ()
    {
      this.lazySite.style('visibility', 'visible');
      this.lastSite = null;
      this.force.stop();
    },

    siteDragMove: function ()
    {
      this.siteMarker.attr('transform', 'translate(' + (d3.event.x - 20) + ',' + (d3.event.y - 10) + ')');
//      this.lastSiteMouse = d3.mouse(this.inner);
      var scale = this.zoom.scale();
      var tx = this.zoom.translate()[0];
      var ty = this.zoom.translate()[1];
      this.lastSite = {
	x: d3.event.x,
	y: d3.event.y,
	topX: (d3.event.x - tx - this.paletteOffset)/scale,
	topY: (d3.event.y - ty)/scale
      };
    },

    siteDragEnd: function ()
    {
      this.lazySite.style('visibility', 'hidden');
      if (this.lastSite &&
	  this.lastSite.x > this.paletteOffset &&
	  this.lastSite.y > 0 &&
	  this.lastSite.x < this.width + this.paletteOffset &&
	  this.lastSite.y < this.height)
      {
	this.trigger('create-site', this.lastSite.topX, this.lastSite.topY);
      }
      this.siteMarker.attr('transform', 'translate(' + this.siteOrigin.x +
			   ', ' + this.siteOrigin.y + ')');
    },

    closestSite: function (x, y)
    {
      var closest = null;
      var closestDistance = null;
      _.each(this.sites, function (site) {
	var distance = site.distance(x, y);
	if (closest === null || distance < closestDistance)
	{
	  closest = site;
	  closestDistance = distance;
	}
      });
      return closest;
    },

    toInternalPosition: function (pos)
    {
      var scale = this.zoom.scale();
      var tx = this.zoom.translate()[0];
      var ty = this.zoom.translate()[1];
      var result = {
	x: pos.x,
	y: pos.y,
	topX: (pos.x - tx - this.paletteOffset)/scale,
	topY: (pos.y - ty)/scale
      };
      if (result.x > this.paletteOffset &&
	  result.y > 0 &&
	  result.x < this.width + this.paletteOffset &&
	  result.y < this.height)
      {
	result.closestSite = this.closestSite(result.topX, result.topY);
      }
      else
      {
	result.closestSite = null;
      }
      return result;
    }

  };

  function getExtreme(f, list, key)
  {
    var result = null;
    _.each(list, function (item) {
      if (item[key] !== null && item[key] !== undefined)
      {
	if (result === null)
	{
	  result = item[key];
	}
	else
	{
	  result = f(result, item[key]);
	}
      }
    });
    return result;
  }

  return TopologyBackground;
});

define('js/canvas/ForceGraph',['underscore', 'd3', 'backbone'],
function (_, d3, Backbone)
{
  

  function ForceGraph()
  {
    this.nodes = [];
    this.links = [];
    this.force = d3.layout.force()
      .nodes(this.nodes)
      .links(this.links)
      .linkDistance(function(d) {
	return d.distance;
      })
      .linkStrength(function(d) {
	return d.strength;
      })
      .gravity(0.05)
      .charge(-500)
      .size([1000, 1000])
      .on('tick', _.bind(this.tick, this));
    this.shouldDisplay = true;

    _.extend(this, Backbone.Events);
  }

  ForceGraph.prototype = {

    add: function (newNodes, newLinks) {
      var that = this;
      _.each(newNodes, function (node) {
	that.nodes.push(node);
      });
      _.each(newLinks, function (link) {
	that.links.push(link);
      });
    },

    remove: function (oldNodes, oldLinks) {
      for (var i = this.nodes.length - 1; i >= 0; i--)
      {
	if (_.contains(oldNodes, this.nodes[i]))
	{
	  this.nodes.splice(i, 1);
	}
      }
      for (var i = this.links - 1; i >= 0; i--)
      {
	if (_.contains(oldLinks, this.links[i]) ||
	    _.contains(oldNodes, this.links[i].source) ||
	    _.contains(oldNodes, this.links[i].target))
	{
	  this.links.splice(i, 1);
	}
      }
      this.tick();
    },

    start: function () {
      this.force.start();
    },

    stop: function () {
      this.force.stop();
    },

    skipAhead: function () {
      this.shouldDisplay = false;
      this.force.start();
      for (var i = 0; i < 40; i += 1)
      {
	this.force.tick();
      }
      this.force.stop();
      this.shouldDisplay = true;
      this.force.start();
    },

    tick: function (event) {
      var forceStopped = false;
      if (event && event.alpha < 0.03)
      {
	this.force.stop();
	forceStopped = true;
      }
      this.trigger('tick', forceStopped, this.shouldDisplay);
    },

    findEndpoint: function (nodeModel) {
      var result = null;
      _.each(this.nodes, function (node) {
	if (node.model && node.model === nodeModel)
	{
	  result = node;
	}
      });
      return result;
    }

  }

  return ForceGraph;
});

define('js/canvas/NodeView',['underscore', 'd3', 'backbone'],
function (_, d3, Backbone)
{
  

  var NodeView = Backbone.View.extend({

    initialize: function () {
      this.node = {
	model: this.model,
	view: this
      };
      if (this.model.x !== undefined &&
	  this.model.y !== undefined)
      {
	this.node.x = this.model.x;
	this.node.y = this.model.y;
      }
      this.old = {};
      this.oldPos = { x: this.node.x, y: this.node.y };
      this.options.force.add([this.node], []);
      this.render();
      this.groupChanged = null;
      this.linkDragging = false;
    },

    cleanup: function () {
      this.options.force.remove([this.node], []);
      this.container.remove();
    },

    render: function () {
      var dragnode = d3.behavior.drag()
	.on('dragstart', _.bind(this.handleDragStart, this))
	.on('drag', _.bind(this.handleDragMove, this))
	.on('dragend', _.bind(this.handleDragEnd, this));

      var draglink = d3.behavior.drag()
	.on('dragstart', _.bind(this.linkDragStart, this))
	.on('drag', _.bind(this.linkDragMove, this))
	.on('dragend', _.bind(this.linkDragEnd, this));

      this.container = this.options.background.nodeBase.append('svg:g')
	.attr("id", this.model.id);

      if (this.options.context.mode === 'editor')
      {
	this.background = this.container.append('svg:g');
	this.backRect = this.background.append('svg:rect')
	  .attr('class', 'nodebackground')
	  .attr('x', '-70px')
	  .attr('y', '-65px')
	  .attr('width', '140px')
	  .attr('height', '145px')
	  .call(draglink)
	  .on('click', _.bind(this.handleBackgroundClick, this))
	  .on('mouseover', _.bind(this.linkHoverStart, this))
	  .on('mousemove', _.bind(this.linkHoverMove, this))
	  .on('mouseout', _.bind(this.linkHoverEnd, this));
      }

      this.foreground = this.container.append('svg:g')
        .attr("class", "node")
	.call(dragnode)
	.on('click', _.bind(this.handleClick, this))
	.on('mouseover', _.bind(this.foregroundHover, this))
	.on('mouseout', _.bind(this.foregroundHoverEnd, this));

      this.rect = this.foreground.append('svg:rect')
	.attr('class', 'nodebox')
	.attr('x', '-30px')
	.attr('y', '-25px')
	.attr('width', '60px')
	.attr('height', '65px');

      this.highlight = this.foreground.append('svg:rect')
	.attr("class", "checkbox")
	.attr('x', '-30px')
	.attr('y', '-25px')
	.attr('width', '60px')
	.attr('height', '65px')
	.attr("style", "visibility:hidden;");

      this.warning = this.foreground.append('svg:g')
	.attr('style', 'visibility:hidden');

  /*    this.warning.append('svg:rect')
        .attr('x', '-140px')
	.attr('y', '-35px')
        .attr('class', 'warningbox')
	.attr('width', '20px')
	.attr('height', '20px');

    this.warning.append('svg:text')
        .attr('class', 'warningboxtext')
        .attr('x', '-32px')
	.attr('y', '-20px')
	.text('!!n');*/

      this.icon = this.foreground.append('svg:image')
	.attr("class", "nodebox")
	.attr("x", "-20px")
	.attr("y", "-20px")
	.attr("width", "40px")
	.attr("height", "40px");

      this.label = this.foreground.append('svg:text')
	.attr("class", "nodetext")
	.attr("x", "0px")
	.attr("y", "35px");
    },

    update: function (shouldDisplay, highlightList) {
      if (shouldDisplay)
      {
	if (this.node.x && this.node.y &&
	    (this.node.x !== this.old.x ||
	     this.node.y !== this.old.y))
	{
	  this.container.attr('transform', 'translate(' +
			      this.node.x + ',' +
			      this.node.y + ')');
	  this.model.x = this.node.x;
	  this.model.y = this.node.y;
	}
	if (this.oldPos.x !== this.node.x ||
	    this.oldPos.y !== this.node.y)
	{
	  this.options.background.hideDragLine();
	  this.oldPos = { x: this.node.x, y: this.node.y };
	}
	if (this.model.name !== this.old.name)
	{
	  this.label.text(this.model.name);
	  var textWidth = 50;
	  try
	  {
	    this.label.each(function () {
	      textWidth = this.getBBox().width + 10;
	    });
	  } catch (e) {}
	  textWidth = Math.max(textWidth, 60)

	  this.rect.attr('width', textWidth + 'px');
	  this.rect.attr('x', (-textWidth/2) + 'px');
	  this.highlight.attr('width', textWidth + 'px');
	  this.highlight.attr('x', (-textWidth/2) + 'px');
	}
	var iconUrl = window.JACKS_LOADER.basePath + 'images/default.svg';
	if (this.model.icon)
	{
	  iconUrl = this.model.icon;
	}
	if (iconUrl !== this.old.icon)
	{
	  this.icon.attr("xlink:href", iconUrl);
	}

	this.old = {
	  x: this.node.x,
	  y: this.node.y,
	  name: this.model.name,
	  icon: iconUrl
	};
	if (highlightList)
	{
	  if (_.contains(highlightList, this.model.id))
	  {
	    this.highlight.style('visibility', 'visible')
	      .classed('selected', true);
	  }
	  else
	  {
	    this.highlight.style('visibility', 'hidden')
	      .classed('selected', false);
	  }
	}

	var shouldWarn = false;
	_.each(_.keys(this.model.warnings), function(key) {
	  if (this.model.warnings[key])
	  {
	    shouldWarn = true;
	  }
	}.bind(this));
	if (shouldWarn !== this.shouldWarn)
	{
	  this.shouldWarn = shouldWarn;
	  if (shouldWarn)
	  {
	    this.warning.style('visibility', 'visible');
	  }
	  else
	  {
	    this.warning.style('visibility', 'hidden');
	  }
	}

      }
    },

    handleClick: function () {
      if (! d3.event.defaultPrevented)
      {
	d3.event.preventDefault();
	var data = {
	  type: 'node',
	  item: this.model,
	  modkey: (d3.event.ctrlKey || d3.event.shiftKey),
	  event: _.clone(d3.event)
	};
	this.options.clickUpdate.trigger('click-event', data);
      }
    },

    handleBackgroundClick: function () {
      if (! d3.event.defaultPrevented)
      {
	this.options.clickUpdate.trigger('click-outside');
      }
    },

    foregroundHover: function () {
      this.options.setHoverId(this.model.id);
    },

    foregroundHoverEnd: function () {
      this.options.setHoverId(null);
    },

    handleDragStart: function () {
      this.groupChanged = null;
      this.options.force.stop();
      $('body > .popover').hide();
    },

    handleDragMove: function () {
      var pos = d3.mouse(this.options.background.inner.node());
      this.node.px = pos[0];
      this.node.py = pos[1];
      this.node.x  = pos[0];
      this.node.y  = pos[1];
      var newGroup = this.options.checkGroup(this.node.x, this.node.y,
					     this.model.group);
      if (this.options.context.mode === 'editor' &&
	  newGroup !== this.model.group &&
	  (! this.groupChanged ||
	   Math.abs(this.node.x - this.groupChanged.x) > 60 ||
	   Math.abs(this.node.y - this.groupChanged.y) > 60))
      {
	this.groupChanged = { x: this.node.x, y: this.node.y };
	this.model.group = newGroup;
      }
      this.trigger('update');
    },

    handleDragEnd: function () {
      this.trigger('update-move');
      _.defer(function () {
	$('html').css('-webkit-user-select', 'initial')
	$('html').css('-moz-user-select', 'initial')
      });
    },

    linkHoverStart: function () {
      var pos = d3.mouse(this.options.background.inner.node());
      if (! this.linkDragging)
      {
	this.options.background.showDragLine(this.node,
					     { x: pos[0], y: pos[1] });
      }
    },

    linkHoverMove: function () {
      var pos = d3.mouse(this.options.background.inner.node());
      if (! this.linkDragging)
      {
	this.options.background.showDragLine(this.node,
					     { x: pos[0], y: pos[1] });
      }
    },

    linkHoverEnd: function () {
      if (! this.linkDragging)
      {
	this.options.background.hideDragLine();
      }
    },

    linkDragStart: function () {
      var pos = d3.mouse(this.options.background.inner.node());
      this.linkDragging = true;
      this.options.background.showDragLine(this.node,
					   { x: pos[0], y: pos[1] });
    },

    linkDragMove: function () {
      var pos = d3.mouse(this.options.background.inner.node());
      this.options.background.showDragLine(this.node,
					   { x: pos[0], y: pos[1] });
    },

    linkDragEnd: function () {
      this.linkDragging = false;
      this.options.background.hideDragLine();
      this.trigger('create-link', this.model.id);
      _.defer(function () {
	$('html').css('-webkit-user-select', 'initial')
	$('html').css('-moz-user-select', 'initial')
      });
    }

  });

  return NodeView;
});

define('js/canvas/LanView',['underscore', 'd3', 'backbone'],
function (_, d3, Backbone)
{
  

  var LanView = Backbone.View.extend({

    initialize: function () {
      var that = this;
      this.node = {
	model: this.model,
	view: this,
	fixed: true,
	x: 10,
	y: 10
      };
      this.render();

      this.links = [];
      _.each(this.model.endpoints, function (endpoint) {
	that.addEndpoint(endpoint);
      });
      this.options.force.add([this.node], this.links);
      this.listenTo(this.model, 'addEndpoint', this.addEndpoint);
      this.listenTo(this.model, 'removeEndpoint', this.removeEndpoint);
    },

    cleanup: function () {
      this.options.force.remove([this.node], this.links);
      this.lineContainer.remove();
      this.center.remove();
    },

    render: function () {
      var that = this;
      this.lineContainer = this.options.background.linkBase.append('svg:g')
        .attr("class", "link");
      this.lines = [];

      this.center = this.options.background.nodeBase.append('svg:g')
	.attr("class", "boxgroup")
	.on('click', _.bind(this.handleClick, this))
	.on('mouseover', _.bind(this.handleHover, this))
	.on('mouseout', _.bind(this.handleHoverEnd, this))
	.attr("id", this.model.id);

      this.centerRect = this.center.append('svg:rect')
	.attr("class", "linkbox")
	.attr('x', '-10px')
	.attr('y', '-10px')
	.attr('width', '20px')
	.attr('height', '20px');

      this.centerHighlight = this.center.append('svg:rect')
	.attr("class", "checkbox")
	.attr('x', '-10px')
	.attr('y', '-10px')
	.attr('width', '20px')
	.attr('height', '20px')
	.attr("style", "visibility:hidden;");

      this.warning = this.center.append('svg:g')
	.attr('style', 'visibility:hidden');

      this.warning.append('svg:rect')
        .attr('x', '-17px')
	.attr('y', '-17px')
        .attr('class', 'warningbox')
	.attr('width', '14px')
	.attr('height', '14px');

      this.warning.append('svg:text')
        .attr('class', 'warningboxtext')
        .attr('x', '-12px')
	.attr('y', '-5px')
	.text('!');
    },

    update: function (shouldDisplay, highlightList) {
      if (this.links.length > 1)
      {
	var sum = { x: 0, y: 0 };
	_.each(this.links, function (link) {
	  if (link.target.x && link.target.y)
	  {
	    sum.x += link.target.x;
	    sum.y += link.target.y;
	  }
	});
	this.node.fixed = true;
	this.node.x = sum.x / this.links.length + (this.model.id % 30);
	this.node.y = sum.y / this.links.length + Math.floor(this.model.id / 30);
      }
      else if (this.links.length == 1)
      {
	if (! this.node.x || ! this.node.y)
	{
	  this.node.x = this.links[0].target.x + 50;
	  this.node.y = this.links[0].target.y - 50;
	}
	this.node.fixed = false;
      }
      this.updateForceLinks();

      if (shouldDisplay)
      {
	this.center.attr('transform',
			 'translate(' + this.node.x +
			 ',' + this.node.y + ')');
	for (var i = 0; i < this.links.length; i += 1)
	{
	  if (this.links[i].source.x && this.links[i].source.y &&
	      this.links[i].target.x && this.links[i].target.y)
	  {
	    this.lines[i].attr('x1', this.links[i].source.x)
	      .attr('y1', this.links[i].source.y)
	      .attr('x2', this.links[i].target.x)
	      .attr('y2', this.links[i].target.y);
	  }
	}
	if (highlightList)
	{
	  if (_.contains(highlightList, this.model.id))
	  {
	    this.centerHighlight.style('visibility', 'visible')
	      .classed('selected', true);
	  }
	  else
	  {
	    this.centerHighlight.style('visibility', 'hidden')
	      .classed('selected', false);
	  }
	}

	var shouldWarn = false;
	_.each(_.keys(this.model.warnings), function(key) {
	  if (this.model.warnings[key])
	  {
	    shouldWarn = true;
	  }
	}.bind(this));
	if (shouldWarn !== this.shouldWarn)
	{
	  this.shouldWarn = shouldWarn;
	  if (shouldWarn)
	  {
	    this.warning.style('visibility', 'visible');
	  }
	  else
	  {
	    this.warning.style('visibility', 'hidden');
	  }
	}

      }
    },

    updateForceLinks: function () {
      var distance = 100;
      var strength = 0.2;
      if (this.withinSite())
      {
	distance = 75;
	strength = 1;
      }
      _.each(this.links, function (link) {
	link.distance = distance;
	link.strength = strength;
      });
    },

    withinSite: function ()
    {
      var result = true;
      if (this.model.endpoints.length > 0)
      {
	var first = this.model.endpoints[0].group;
	_.each(this.model.endpoints, function (endpoint) {
	  if (first !== endpoint.group)
	  {
	    result = false;
	  }
	});
      }
      return result;
    },

    addEndpoint: function (endpoint) {
      var link = {};
      link.source = this.node;
      link.target = this.options.force.findEndpoint(endpoint);
      this.links.push(link);
      var line = this.lineContainer.append('svg:line')
	.attr('class', 'linkline')
	.attr("id", 'link-' + this.model.id + '-node-' + endpoint.id);
      this.lines.push(line);
      this.updateForceLinks();
      this.options.force.add([], [link]);
    },

    removeEndpoint: function (endpoint) {
      var link;
      var linkIndex;
      var target = this.options.force.findEndpoint(endpoint);
      _.each(this.links, function (candidate, index) {
	if (candidate.source === this.node && candidate.target === target)
	{
	  link = candidate;
	  linkIndex = index;
	}
      }.bind(this));
      if (link)
      {
	this.lines[linkIndex].remove();
	this.links.splice(linkIndex, 1);
	this.lines.splice(linkIndex, 1);
	this.options.force.remove([], [link]);
      }
    },

    handleClick: function () {
      if (! d3.event.defaultPrevented)
      {
	var data = {
	  type: 'link',
	  item: this.model,
	  modkey: (d3.event.ctrlKey || d3.event.shiftKey),
	  event: _.clone(d3.event)
	};
	this.options.clickUpdate.trigger('click-event', data);
      }
    },

    handleHover: function () {
      this.options.setHoverId(this.model.id);
    },

    handleHoverEnd: function () {
      this.options.setHoverId(null);
    }

  });

  return LanView;
});

define('js/canvas/SiteView',['underscore', 'd3', 'backbone'],
function (_, d3, Backbone)
{
  

  var SiteView = Backbone.View.extend({

    initialize: function () {
      this.justClickedOutside = false;
      this.vertices = [];
      this.links = [];
      this.label = {
	model: this.model,
	view: this
      };
      if (this.model.x !== undefined &&
	  this.model.y !== undefined)
      {
	this.label.x = this.model.x;
	this.label.y = this.model.y;
      }
      this.options.force.add([this.label], []);
      this.render();
    },

    cleanup: function () {
      this.options.force.remove([this.label], this.links);
      if (this.hull)
      {
	this.hull.remove();
      }
      if (this.hullLabel)
      {
	this.hullLabel.remove();
      }
    },

    render: function () {
      var drag = d3.behavior.drag()
	.on('dragstart', _.bind(this.handleDragStart, this))
	.on('drag', _.bind(this.handleDragMove, this))
	.on('dragend', _.bind(this.handleDragEnd, this));

      var background = this.options.background;
      this.hull = background.hullBase.append('svg:path')
        .style("fill", this.options.fill)
        .style("stroke", this.options.fill)
        .style("stroke-width", 150)
        .style("stroke-linejoin", "round")
        .style("opacity", .6)
	.on("click", _.bind(this.handleClickOutside, this))
	.on("mousedown", _.bind(this.handleMouseDown, this));

      if (this.options.context.multiSite)
      {
	this.hullLabel = background.hullLabelBase.append('svg:g')
	  .attr('class', 'sitelabelgroup')
          .attr('style', 'cursor:pointer')
	  .call(drag)
	  .on('click', _.bind(this.handleClick, this))
	  .attr("id", this.model.id);

	this.labelRect = this.hullLabel.append('svg:rect')
          .attr('class', 'labelbox')
          .attr('x', '-40px')
          .attr('y', '-14px')
          .attr('width', '80px')
          .attr('height', '20px');

	this.labelSelect = this.hullLabel.append('svg:rect')
          .attr('class', 'checkbox')
          .attr('x', '-40px')
          .attr('y', '-14px')
          .attr('width', '80px')
          .attr('height', '20px')
          .style('visibility', 'hidden');

	this.hullText = this.hullLabel.append('svg:text')
          .attr('x', '0px')
          .attr("class", "sitetext");
      }
    },

    update: function (shouldDisplay, highlightList, dragPoint) {
      this.findVertices();
      this.connectVertices();
      if (shouldDisplay)
      {
	if (this.options.context.multiSite && this.options.siteCount() > 1)
	{
	  this.hull.style("fill", this.options.fill)
            .style("stroke", this.options.fill);
//	  this.hullLabel.attr('class', 'sitelabelgroup');
	}
	else
	{
	  this.hull.style("fill", "#fff")
            .style("stroke", "#fff");
//	  if (this.hullLabel)
//	  {
//	    this.hullLabel.attr('class', 'hidden sitelabelgroup');
//	  }
	}
	this.hull.attr("d", this.groupPath(dragPoint));
	if (this.options.context.multiSite)// && this.options.siteCount() > 1)
	{
	  this.hullLabel.attr('transform',
			      'translate(' + this.label.x + ',' +
			      this.label.y + ')');
	  var name = this.model.name;
	  var re = new RegExp('^[0-9]+$');
	  if (re.test(name))
	  {
	    name = 'Site ' + name;
	  }
	  this.hullText.text(name);
	  var textWidth = 50;
	  try
	  {
	    this.hullText.each(function (d, i) {
	      textWidth = this.getBBox().width;
	    });
	  }
	  catch (e) {}
	  var textHeight = 20;
	  if (this.options.siteCount() === 1)
	  {
	    textWidth += 20;
	    textHeight += 20;
	  }
	  this.labelRect.attr('width', (textWidth + 10) + 'px')
	    .attr('height', textHeight + 'px');
	  this.labelRect.attr('x', (-textWidth/2 - 5) + 'px')
	    .attr('y', (-textHeight/2 - 5) + 'px');
	  this.labelSelect.attr('width', (textWidth + 10) + 'px')
	    .attr('height', textHeight + 'px');
	  this.labelSelect.attr('x', (-textWidth/2 - 5) + 'px')
	    .attr('y', (-textHeight/2 - 5) + 'px');
	  if (highlightList)
	  {
	    if (_.contains(highlightList, this.model.id))
	    {
	      this.hullLabel.selectAll('.checkbox')
		.style('visibility', 'visible')
		.classed('selected', true);
	    }
	    else
	    {
	      this.hullLabel.selectAll('.checkbox')
		.style('visibility', 'hidden')
		.classed('selected', false);
	    }
	  }
	}
      }
    },

    contains: function (x, y, oldGroup) {
      return (this.model.id !== oldGroup &&
	      intersects([x, y, 150], this.vertices));
    },

    distance: function (x, y) {
      return minDistance([x, y], this.vertices);
    },

    connectVertices: function () {
      var freshLinks = []; // Links that need to be added
      var staleLinks = []; // Links that need to be removed
      _.each(this.options.force.nodes, function (node) {
	var link = _.findWhere(this.links, { target: node });
	if (node.model && node.model.group === this.model.id)
	{
	  // Ensure that it is connected to the label node
	  if (! link)
	  {
	    freshLinks.push({
	      source: this.label,
	      target: node,
	      distance: 100,
	      strength: 0.05
	    });
	  }
	}
	else
	{
	  // Ensure that it is not connected to the label node
	  if (link)
	  {
	    staleLinks.push(link);
	  }
	}
      }.bind(this));
      if (freshLinks.length > 0)
      {
	this.links = this.links.concat(freshLinks);
	this.options.force.add([], freshLinks);
      }
      if (staleLinks.length > 0)
      {
	this.links = _.difference(this.links, staleLinks);
	this.options.force.remove([], staleLinks);
      }
    },

    findVertices: function () {
      var that = this;
      this.vertices = [];

      _.each(this.options.force.nodes, function (node) {
	if (node.model && node.model.group === that.model.id &&
	    node.x && node.y)
	{
	  that.vertices.push([node.x, node.y]);
	}
      });

      if (this.label.x === undefined && this.label.y === undefined)
      {
	if (this.vertices.length > 0)
	{
	  this.label.x = (_.max(this.vertices, function (a) { return a[0]; })[0] + _.min(this.vertices, function (a) { return a[0]; })[0])/2;
	  this.label.y = (_.max(this.vertices, function (a) { return a[1]; })[1] + _.min(this.vertices, function (a) { return a[1]; })[1])/2;
	  this.label.px = this.label.x;
	  this.label.py = this.label.y;
	}
	else
	{
	  this.label.x = 0;
	  this.label.y = 0;
	  this.label.px = 0;
	  this.label.py = 0;
	}
      }
/*
      if (this.vertices.length > 1)
      {
	this.label.x = (_.max(this.vertices, function (a) { return a[0]; })[0] + _.min(this.vertices, function (a) { return a[0]; })[0])/2;
	this.label.y = _.min(this.vertices, function (a) { return a[1]; })[1] - 40;
      }
      else if (this.vertices.length === 1)
      {
	var distance = Math.sqrt(Math.pow(this.vertices[0][0] - this.label.x, 2) +
				 Math.pow(this.vertices[0][1] - this.label.y, 2));
	if (distance > 200)
	{
	  var angle = Math.atan2(this.vertices[0][1] - this.label.y,
				 this.vertices[0][0] - this.label.x);
	  this.label.x = this.vertices[0][0] - Math.cos(angle)*200;
	  this.label.y = this.vertices[0][1] - Math.sin(angle)*200;
	}
      }
*/

      this.vertices.push([this.label.x, this.label.y]);

      if (this.vertices.length === 2)
      {
        this.vertices.push([(this.vertices[0][0] + this.vertices[1][0])/2 - 5,
			    (this.vertices[0][1] + this.vertices[1][1])/2 - 5]);
        this.vertices.push([(this.vertices[0][0] + this.vertices[1][0])/2 - 5,
			    (this.vertices[0][1] + this.vertices[1][1])/2 + 5]);
        this.vertices.push([(this.vertices[0][0] + this.vertices[1][0])/2 + 5,
			    (this.vertices[0][1] + this.vertices[1][1])/2 - 5]);
        this.vertices.push([(this.vertices[0][0] + this.vertices[1][0])/2 + 5,
			    (this.vertices[0][1] + this.vertices[1][1])/2 + 5]);
      }
      else if (this.vertices.length === 1)
      {
        this.vertices.push([this.vertices[0][0] - 25, this.vertices[0][1] - 25]);
        this.vertices.push([this.vertices[0][0] + 25, this.vertices[0][1] - 25]);
        this.vertices.push([this.vertices[0][0] + 25, this.vertices[0][1] + 25]);
        this.vertices.push([this.vertices[0][0] - 25, this.vertices[0][1] + 25]);
      }
    },

    groupPath: function(dragPoint) {
      var vertices = this.vertices;
      if (dragPoint)
      {
	vertices = _.clone(vertices);
	vertices.push(dragPoint);
      }
      return 'M' + d3.geom.hull(vertices).join('L') + 'Z';
    },

    handleClick: function () {
      if (! d3.event.defaultPrevented)
      {
	var data = {
	  type: 'site',
	  item: this.model,
	  modkey: (d3.event.ctrlKey || d3.event.shiftKey),
	  event: _.clone(d3.event)
	};
	this.options.clickUpdate.trigger('click-event', data);
      }
    },

    handleDragStart: function () {
      this.options.force.stop();
    },

    handleDragMove: function () {
      var that = this;
      var found = 0;
      _.each(this.options.force.nodes, function (node) {
	if (node.model && node.model.group === that.model.id)
	{
	  node.px += d3.event.dx;
	  node.py += d3.event.dy;
	  node.x += d3.event.dx;
	  node.y += d3.event.dy;
	  found += 1;
	}
      });
      this.label.x += d3.event.dx;
      this.label.y += d3.event.dy;
      this.label.px = this.label.x;
      this.label.py = this.label.y;
      this.trigger('update');
    },

    handleDragEnd: function () {
      this.trigger('update-move');
      _.defer(function () {
	$('html').css('-webkit-user-select', 'initial')
	$('html').css('-moz-user-select', 'initial')
      });
    },

    handleMouseDown: function ()
    {
      var that = this;
      this.justClickedOutside = true;
      _.delay(function () { that.justClickedOutside = false; }, 200);
    },

    handleClickOutside: function () {
      if (this.justClickedOutside)
      {
	this.options.clickUpdate.trigger('click-outside');
      }
    },

  });

  function minDistance(point, polygon)
  {
    var result = null;
    _.each(polygonEdges(polygon), function (edge) {
      var distance = pointLineSegmentDistance(point, edge);
      if (result === null ||
	  distance < result)
      {
	result = distance;
      }
    });
    return result;
  }

  function intersects(circle, polygon)
  {
    return pointInPolygon(circle, polygon)
        || polygonEdges(polygon).some(function(line) { return pointLineSegmentDistance(circle, line) < circle[2]; });
  }

  function polygonEdges(polygon)
  {
    return polygon.map(function(p, i) {
      return i ? [polygon[i - 1], p] : [polygon[polygon.length - 1], p];
    });
  }

  function pointInPolygon(point, polygon)
  {
    for (var n = polygon.length, i = 0, j = n - 1, x = point[0], y = point[1], inside = false; i < n; j = i++)
    {
      var xi = polygon[i][0], yi = polygon[i][1],
          xj = polygon[j][0], yj = polygon[j][1];
      if ((yi > y ^ yj > y) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }

  function pointLineSegmentDistance(point, line)
  {
    var v = line[0], w = line[1], d, t;
    return Math.sqrt(pointPointSquaredDistance(point, (d = pointPointSquaredDistance(v, w))
        ? ((t = ((point[0] - v[0]) * (w[0] - v[0]) + (point[1] - v[1]) * (w[1] - v[1])) / d) < 0 ? v
        : t > 1 ? w
        : [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])])
        : v));
  }

  function pointPointSquaredDistance(v, w)
  {
    var dx = v[0] - w[0], dy = v[1] - w[1];
    return dx * dx + dy * dy;
  }

  return SiteView;
});

define('js/canvas/ValidList',['underscore'],
function (_)
{
  

  function ValidList(model, constraints)
  {
    this.model = model;
    this.constraints = constraints;
  }

  ValidList.prototype = {

    findNodes: function (node, key)
    {
      var result = {
	allowed: [],
	rejected: []
      };
      var bound = makeAllNodeCandidates(node, this.model);
      result.allowed = this.constraints.getValidList(bound, 'node', key,
						     result.rejected);
      return result;
    },

    findLinks: function (link, key)
    {
      var result = {
	allowed: [],
	rejected: []
      };
      var bound = makeAllLinkCandidates(link, this.model.sites);
      result.allowed = this.constraints.getValidList(bound, 'link', key,
						     result.rejected);
      return result;
    },

    findSites: function (site, key)
    {
      var result = {
	allowed: [],
	rejected: []
      };
      var bound = makeAllSiteCandidates(site, this.model.nodes, this.model.interfaces, this.model.lans, this.model.sites);
      result.allowed = this.constraints.getValidList(bound, 'node', key,
						     result.rejected);
      return result;
    },

    isValidNode: function (node, site)
    {
      var candidate = { node: makeSimpleNode(node, site) };
      return this.constraints.isValid(candidate);
    },

    isValidNodeNeighbor: function (node)
    {
      var candidates = makeNodeNeighborCandidates(node, this.model);
      return this.constraints.allValid(candidates);
    },

    isValidLan: function (lan)
    {
      var candidates = makeAllLinkCandidates(lan, this.model.sites);
      return this.constraints.allValid(candidates);
    },

    isValidLink: function (node1, site1, node2, site2)
    {
      var candidate = {
	node: makeSimpleNode(node1, site1),
	link: {},
	node2: makeSimpleNode(node2, site2)
      };
      return this.constraints.isValid(candidate);
    },

    getNodeCandidates: function ()
    {
      var result = [];
      _.each(_.values(this.model.sites), function (site) {
	result = result.concat(makeAllSiteCandidates(site, this.model.nodes, this.model.interfaces, this.model.lans, this.model.sites));
      }.bind(this));
      return result;
    }
  };

  function makeNodeNeighborCandidates(node, topo)
  {
    var result = [];
    var nodeSite = topo.sites[node.group];
    _.each(node.interfaces, function (ifaceUnique) {
      var iface = topo.interfaces[ifaceUnique];
//      console.log(iface.linkId, topo.interfaces);
      var link = _.where(topo.lans,
			 { id: iface.linkId })[0]; 
      _.each(link.endpoints, function (endpoint) {
	if (endpoint.id !== node.id)
	{
	  var endpointSite = topo.sites[endpoint.group];
	  result.push({ node: makeSimpleNode(node, nodeSite),
			link: makeSimpleLink(link, topo.sites),
			node2: makeSimpleNode(endpoint, endpointSite) });
	}
      });
    });
    return result;
  }

  function makeAllNodeCandidates(node, topo)
  {
    var result = makeNodeNeighborCandidates(node, topo);
    var nodeSite = topo.sites[node.group];
    result.push({ node: makeSimpleNode(node, nodeSite) });
    return result;
  }

  function makeAllLinkCandidates(link, sites, defaultSite)
  {
    var result = [];
    for (var i = 0; i < link.endpoints.length; i += 1)
    {
      var site1 = sites[link.endpoints[i].group];
      for (var j = i + 1; j < link.endpoints.length; j += 1)
      {
	var site2 = sites[link.endpoints[j].group];
	if (defaultSite === site2)
	{
	  var temp = site1;
	  site1 = site2;
	  site2 = temp;
	}
	result.push({ node: makeSimpleNode(link.endpoints[i], site1),
		      link: makeSimpleLink(link),
		      node2: makeSimpleNode(link.endpoints[j], site2) });
      }
    }
    return result;
  }

  function makeAllSiteCandidates(site, nodes, ifaces, links, sites)
  {
    var result = [];
    var linkMap = {};
    _.each(nodes, function (node) {
      if (node.group === site.id)
      {
	result.push({ node: makeSimpleNode(node, site) });
	_.each(node.interfaces, function (ifaceId) {
	  var linkId = ifaces[ifaceId].linkId;
	  linkMap[linkId] = links[linkId];
	});
      }
    });
    _.each(_.values(linkMap), function(link) {
      var links = makeAllLinkCandidates(link, sites, site);
      result = result.concat(links);
    });
    return result;
  }

  function makeSimpleNode(node, site)
  {
    var result =  {
      'images': node.image,
      'types': node.type,
      'hardware': node.hardware
    };
    if (node.custom.image)
    {
      result.images = undefined;
    }
    if (node.custom.type)
    {
      result.types = undefined;
    }
    if (node.custom.hardware)
    {
      result.hardware = undefined;
    }
    if (site.urn && ! site.custom.urn)
    {
      result.aggregates = site.urn;
    }
    return result;
  }

  function makeSimpleLink(link)
  {
    var result = {
      'linkTypes': link.linkType,
      'sharedvlan': link.sharedvlan
    };
    if (link.custom.linkType)
    {
      result.linkTypes = undefined;
    }
    if (link.custom.shardvlan)
    {
      result.sharedvlan = undefined;
    }
    return result;
  }

  function getIncidentLinkTypes(node, topoData)
  {
    var types = {};
    _.each(node.interfaces, function (ifaceUnique) {
      var iface = topoData.interfaces[ifaceUnique];
      var link = _.where(topoData.links, { id: iface.linkId })[0];
      if (link.linkType)
      {
	types[link.linkType] = 1;
      }
    });
    return _.keys(types);
  }

  return ValidList;
});


define('js/canvas/TopologyView',['underscore', 'd3', 'backbone',
	'js/canvas/TopologyBackground', 'js/canvas/ForceGraph',
	'js/canvas/NodeView', 'js/canvas/LanView', 'js/canvas/SiteView',
	'js/canvas/ValidList'],
function (_, d3, Backbone,
	 TopologyBackground, ForceGraph, NodeView, LanView, SiteView,
	 ValidList)
{
  

  var TopologyView = Backbone.View.extend({

    events: {
    },

    initialize: function () {
      this.force = new ForceGraph();
      this.nodes = [];
      this.lans = [];
      this.sites = [];
      this.siteFill = d3.scale.category10();
      this.validList = new ValidList(this.model, this.options.constraints);
      this.background = new TopologyBackground(this.$el,
					       this.force.nodes,
					       this.sites,
					       this.options.defaults,
					       this.options.clickUpdate,
					       this.options.context,
					       this.force,
					       this.validList);
      this.hoverId = null;

      this.listenTo(this.model, 'addNodes', this.addNodes);
      this.listenTo(this.model, 'addLans', this.addLans);
      this.listenTo(this.model, 'addSites', this.addSites);
      this.listenTo(this.model, 'removeNodes', this.removeNodes);
      this.listenTo(this.model, 'removeLans', this.removeLans);
      this.listenTo(this.model, 'removeSites', this.removeSites);
      this.listenTo(this.model, 'firstGraph', this.firstGraph);
      this.listenTo(this.model, 'change', this.update);
      this.listenTo(this.force, 'tick', this.updateGraph);
      this.listenTo(this.background, 'create-site', this.createSite);
      this.listenTo(this.background, 'create-node', this.createNode);

      this.render();
    },

    render: function () {
      var that = this;
      this.background.render();
/*
      _.each(this.nodes, function (node) {
	node.render();
      });
      _.each(this.lans, function (lan) {
	lan.render();
      });
      _.each(this.sites, function (site) {
	site.render();
      });
*/
      this.updateGraph();
    },

    show: function () {
      this.$el.show();
    },

    hide: function () {
      this.$el.hide();
    },

    resize: function (width, height) {
      this.background.resize(width, height);
    },

    startForce: function () {
      this.force.start();
    },

    update: function () {
      this.updateNoScale(false, true);
    },

    updateNoScale: function (stopped, shouldDisplay, highlightList) {
      _.each(this.nodes, function (node) {
      	
      	
for (var key in node){
	
	
if (key=="model"){
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(key, node[key].id, node[key].type, node[key],sitesurn[node[key].group]);
    if (node[key].type=="wireless"){
getItemsList(node[key].id,true,sitesurn[node[key].group]);
} else {

getItemsList(node[key].id,false,sitesurn[node[key].group]);
}
}
    }
	node.update(shouldDisplay, highlightList);
      });
      _.each(this.lans, function (lan) {
	lan.update(shouldDisplay, highlightList);
      });
      _.each(this.sites, function (site) {
//console.log(site);
	site.update(shouldDisplay, highlightList);
      });
    },

    updateGraph: function (stopped, shouldDisplay, highlightList) {
console.log("updateGraph");
      this.updateNoScale(stopped, shouldDisplay, highlightList);
      this.background.centerScale(true);
    },

    firstGraph: function () {
      this.force.skipAhead();
      this.updateGraph(true, true);
    },

    addNodes: function (newNodes) {
      this.add(newNodes, NodeView, this.nodes);
console.log("addNodes");
console.log(newNodes[0]);

for (var key in newNodes[0]){
if (key=='id'){
    console.log(key, newNodes[0][key]);
}
if (key=='group'){
    console.log(key, newNodes[0][key]);
}
    }
      this.updateGraph(false, true);

    },

    addLans: function (newLans) {
      this.add(newLans, LanView, this.lans);
      this.updateGraph(false, true);
    },

    addSites: function (newSites) {
      this.add(newSites, SiteView, this.sites);
	  console.log("addSites");
      this.updateGraph(false, true);
    },

    removeNodes: function (oldIds) {
      this.nodes = this.remove(oldIds, this.nodes);
      this.updateGraph(false, true);
    },

    removeLans: function (oldIds) {
      this.lans = this.remove(oldIds, this.lans);
      this.updateGraph(false, true);
    },

    removeSites: function (oldIds) {
      this.sites = this.remove(oldIds, this.sites);
      this.updateGraph(false, true);
    },

    add: function (items, ItemType, list)
    {
      var that = this;
      _.each(items, function (item) {
	var newView = new ItemType({
	  model: item,
	  force: that.force,
	  background: that.background,
	  fill: that.siteFill(list.length),
	  clickUpdate: that.options.clickUpdate,
	  checkGroup: _.bind(that.checkGroup, that),
	  setHoverId: _.bind(that.setHoverId, that),
	  siteCount: _.bind(that.siteCount, that),
	  context: that.options.context
	});
	that.listenTo(newView, 'update', that.update);
	that.listenTo(newView, 'update-move', that.updateGraph);
	that.listenTo(newView, 'create-link', that.createLink);
	list.push(newView);
      });
    },

    remove: function (ids, list)
    {
      var result = list;
      _.each(ids, function (id) {
	var found;
	var foundIndex;
	_.each (list, function(candidate, index) {
	  if (id === candidate.options.model.id)
	  {
	    found = candidate;
	    foundIndex = index;
	  }
	}.bind(this));
	if (found)
	{
	  found.cleanup();
	  list.splice(foundIndex, 1);
	}
      });
      return result;
    },

    checkGroup: function (x, y, oldGroup)
    {
      var result = oldGroup;
      _.each(this.sites, function (site) {
	if (site.contains(x, y, oldGroup))
	{
	  result = site.model.id;
	}
      });
      return result;
    },

    setHoverId: function (newId)
    {
      this.hoverId = newId;
    },

    siteCount: function ()
    {
      return this.sites.length;
    },

    setHighlights: function (list, type)
    {
      this.updateGraph(true, true, list);
    },

    createNode: function (x, y, siteId, options)
    {
      this.model.addEmptyNode(x, y, siteId, options);
      this.force.start();
      this.force.stop();
    },

    createSite: function (x, y)
    {
      this.model.addEmptySite(x, y);
      this.force.start();
      this.force.stop();
    },

    createLink: function (sourceId)
    {
      this.model.attemptConnection(sourceId, this.hoverId);
      this.force.start();
      this.force.stop();
    }

  });


  return TopologyView;
});

define('js/canvas/TopologyModel',['underscore', 'backbone', 'js/canvas/ValidList'],
function (_, Backbone, ValidList)
{
  

  function TopologyModel(context, constraints, errorModal)
  {
    this.context = context;
    this.validList = new ValidList(this, constraints);
    this.errorModal = errorModal;
    this.nodes = {};
    this.lans = {};
    this.interfaces = {};
    this.sites = {};
    this.idList = {};
    this.extraChildren = [];
    // A hash of arrays. Key is IP address. Array is a list of interface IDs. There should only ever be 1 interface ID at most for each key. Otherwise the user has assigned a duplicate address.
    this.ipUsage = {};
    _.extend(this, Backbone.Events);
  }

  TopologyModel.prototype = {

    addGraph: function (newGraph) {
      var firstGraph = (_.keys(this.nodes).length === 0);

      var bornSites = [];
      _.each(newGraph.sites, function (site) {
	this.insertSite(site, newGraph, bornSites);
      }.bind(this));

      var bornNodes = [];
      // Reaper nodes are old nodes which are not kept
      var reaperNodes = [];
      // Ghosts are new nodes which are not kept
      var ghostToOld = {};
      var bornToOld = {};
      _.each(newGraph.nodes, function (node) {
	this.insertNode(node, newGraph, reaperNodes, bornNodes,
			bornToOld, ghostToOld);
      }.bind(this));

      var reaperLans = [];
      _.each(newGraph.links, function (lan) {
	this.insertLan(lan, newGraph, bornToOld, ghostToOld,
		       newGraph.interfaces, this.interfaces, reaperLans);
      }.bind(this));

      _.each(newGraph.sites, function (site) {
	if (this.sites[site.id] && ! this.sites[site.id].name)
	{
	  this.sites[site.id].name = this.generateSiteName(this.sites[site.id]);
	}
      }.bind(this));
      _.each(newGraph.interfaces, function (iface) {
	this.interfaces[iface.id] = iface;
      }.bind(this));
      this.extraChildren = newGraph.remainder;
      this.removeNodes(reaperNodes);
      this.removeLinks(reaperLans);
      _.each(_.keys(this.interfaces), function (ifaceId) {
	var iface = this.interfaces[ifaceId];
	if (iface.ip)
	{
	  this.switchIp(ifaceId, null, iface.ip);
	}
	var node;
	if (! iface.linkId) {
	  node = this.nodes[iface.nodeId];
	  node.interfaces = _.without(node.interfaces, ifaceId);
	  delete this.interfaces[ifaceId];
	} else if (! this.nodes[iface.nodeId]) {
	  var link = this.lans[iface.linkId];
	  node = _.findWhere(link.endpoints, { id: iface.nodeId });
	  console.log(node);
	  link.interfaces = _.without(link.interfaces, ifaceId);
	  link.endpoints = _.without(link.endpoints, node);
	  delete this.interfaces[ifaceId];
	}
      }.bind(this));
      _.each(bornNodes, function (node) {
	this.checkNode(node);
      }.bind(this));
      _.each(newGraph.links, function (link) {
	this.checkLan(link);
      }.bind(this));
      this.trigger('addSites', bornSites);
      this.trigger('addNodes', bornNodes);
      this.trigger('addLans', newGraph.links);
      this.trigger('change');
      if (firstGraph)
      {
	this.trigger('firstGraph');
      }
    },

    nodesMatch: function (oldNode, newNode) {
      var oldSite = this.sites[oldNode.group];
      var newSite = this.sites[newNode.group];
      var siteMatch = (oldSite.urn && newSite.urn &&
		       oldSite.urn === newSite.urn &&
		       oldNode.name === newNode.name);
      var sliverMatch = (oldNode.sliverId && newNode.sliverId &&
			 oldNode.sliverId === newNode.sliverId);
      return siteMatch || sliverMatch;
    },

    insertNode: function (newNode, newGraph,
			  reaperList, bornList, bornToOld, ghostToOld) {
      // New nodes replace old nodes
      var newSite = this.sites[newNode.group];
      var oldSite, oldNode;
      _.each(_.values(this.nodes), function (candidate) {
	var site = this.sites[candidate.group];
	if (this.nodesMatch(candidate, newNode))
	{
	  oldNode = candidate;
	  oldSite = site;
	}
      }.bind(this));

      // Destroy old node if there is an old node and if either the
      // new node has a sliver id or the old node lacks a sliver id
//      var destroyOld = (oldNode &&
//			(! newNode.sliverId ||
//			 oldNode.sliverId));
//      var destroyOld = true;
//      if (destroyOld && oldNode)
      var hasReplaced = false;
      if (oldNode)
      {
	newNode.x = oldNode.x;
	newNode.y = oldNode.y;
	reaperList.push(oldNode.id);
	if (oldNode.sliverId && ! newNode.sliverId)
	{
	  _.each(_.keys(oldNode), function (key) {
	    if (key !== 'id' && key !== 'interfaces')
	    {
	      newNode[key] = oldNode[key];
	    }
	  }.bind(this));
	}
      }
      var isViewer = (this.context.mode === 'viewer');
      var hasSliver = (newNode.sliverId !== null && newNode.sliverId !== undefined)
      // Add the new node if there is no old node, or if we destroyed it
//      if (destroyOld || ! oldNode)
//      {
      if (! isViewer || hasSliver)
      {
	this.nodes[newNode.id] = newNode;
	bornList.push(newNode);
	bornToOld[newNode.id] = oldNode;
      }
//      }
//      else
//      {
//	ghostToOld[newNode.id] = oldNode;
//      }
    },

    insertLan: function (newLan, newGraph, bornToOld, ghostToOld, newInterfaces, oldInterfaces, reaperLans) {
/*
      _.each(_.values(this.lans), function (candidate) {
	if (candidate.name === newLan.name)
	{
	  var allMatch = true;
	  _.each(newLan.interfaces, function (ifaceId) {
	    var newId = newInterfaces[ifaceId].nodeId;
	    var mapped = ghostToOld[newId];
	    if (mapped === undefined || mapped === null)
	    {
	      mapped = bornToOld[newId];
	    }
	    var found = false;
	    if (mapped !== undefined && mapped !== null)
	    {
	      _.each(candidate.interfaces, function (oldIfaceId) {
		var oldId = this.interfaces[oldIfaceId].nodeId;
		if (oldId === mapped.id)
		{
		  found = true;
		}
	      });
	    }
	    if (! found)
	    {
	      allMatch = false;
	    }
	  });
	  if (allMatch)
	  {
	    reaperLans.push(candidate.id);
	  }
	}
      });
*/
      _.extend(newLan, Backbone.Events);
      this.lans[newLan.id] = newLan;
    },

    insertSite: function (newSite, newGraph, bornList) {
      // New sites are ignored and not added
      var foundId = undefined;
      _.each(_.values(this.sites), function (candidate) {
	if (candidate.urn && newSite.urn &&
	    candidate.urn === newSite.urn)
	{
	  foundId = candidate.id;
	}
      }.bind(this));
      if (foundId === undefined)
      {
	bornList.push(newSite);
	this.sites[newSite.id] = newSite;
      }
      else
      {
	_.each(_.values(newGraph.nodes), function (node) {
	  if (node.group === newSite.id)
	  {
	    node.group = foundId;
	  }
	}.bind(this));
      }
    },

    addEmptyNode: function (x, y, siteId, option) {
      var name = this.generateNodeName();
	  console.log(option);
	 //getItemsList( name,true,"");
      var newNode = {
	custom: {},
	warnings: {},
	id: _.uniqueId(),
	interfaces: [],
	name: name,
	x: x,
	y: y,
	group: siteId,
	type: option.type,
	image: option.image,
	imageVersion: undefined,
	hardware: option.hardware,
	icon: option.icon,
	execute: [],
	install: []
      };
      var image = _.findWhere(this.context.canvasOptions.images,
			      { id: option.image });
      if (image)
      {
	newNode.imageVersion = image.version;
      }
     /* if (! this.validList.isValidNode(newNode, this.sites[siteId]))
      {
	this.errorModal.update({ title: 'Incompatible Node Warning',
				 contents: 'This node is not listed as compatible with the site you have placed it in. Your topology may be impossible to allocate.' });
      }*/
      this.nodes[newNode.id] = newNode;
      this.checkNode(newNode);
      this.trigger('addNodes', [newNode]);
    },

    addEmptySite: function (x, y) {
      var newSite = {
	custom: {},
	id: _.uniqueId(),
	x: x,
	y: y
      };
      newSite.name = this.generateSiteName(newSite);
      this.sites[newSite.id] = newSite;
      this.trigger('addSites', [newSite]);
    },

    attemptConnection: function (sourceId, targetId) {
      if (sourceId !== null && targetId !== null && targetId !== sourceId)
      {
	if (this.nodes[sourceId] &&
	    this.nodes[targetId])
	{
	  this.addEmptyLink(sourceId, targetId);
	}
	else if (this.nodes[sourceId] && this.lans[targetId])
	{
	  this.addNodeToLan(sourceId, targetId);
	}
	else if (this.nodes[targetId] && this.lans[sourceId])
	{
	  this.addNodeToLan(targetId, sourceId);
	}
      }
    },

    addEmptyLink: function (sourceId, targetId) {
      var newLan = {
	custom: {},
	warnings: {},
	id: _.uniqueId(),
	name: this.generateLinkName(),
	interfaces: [],
	nodeIndices: [],
	endpoints: [],
	endpointNames: [],
	transitSites: {}
      };
      _.extend(newLan, Backbone.Events);
      this.lans[newLan.id] = newLan;
      this.addNodeToLan(sourceId, newLan.id);
      this.addNodeToLan(targetId, newLan.id);
      var source = this.nodes[sourceId];
      var target = this.nodes[targetId];
      if (! this.validList.isValidLink(source, this.sites[source.group],
				       target, this.sites[target.group]))
      {
	this.errorModal.update({ title: 'Incompatible Link Warning',
				 contents: 'This link is not listed as compatible with the nodes you have connected. Your topology may be impossible to allocate.' });
      }
      this.checkLan(newLan);
      this.trigger('addLans', [newLan]);
    },

    addNodeToLan: function (nodeId, lanId) {
      var node = this.nodes[nodeId];
      var lan = this.lans[lanId];
      if (! _.contains(lan.endpoints, node))
      {
	lan.nodeIndices.push(nodeId);
	lan.endpoints.push(node);
	lan.endpointNames.push(node.name);
	var iface = {
	  id: _.uniqueId(),
	  name: this.generateInterfaceName(),
	  nodeName: node.name,
	  node: node,
	  linkId: lanId,
	  nodeId: nodeId
	};
	this.interfaces[iface.id] = iface;
	node.interfaces.push(iface.id);
	lan.interfaces.push(iface.id);
	this.checkLan(lan);
	this.checkNode(node);
	lan.trigger('addEndpoint', node);
	this.trigger('change');
      }
    },

    getItems: function (type) {
      return _.values(this.getType(type));
    },

    getType: function (type) {
      if (type === 'node')
      {
	return this.nodes;
      }
      else if (type === 'link')
      {
	return this.lans;
      }
      else if (type === 'site')
      {
	return this.sites;
      }
      else
      {
	return {};
      }
    },

    uniqueName: function(inPrefix)
    {
      var prefix = inPrefix;
      if (! prefix)
      {
	prefix = '';
      }
      if (this.idList[prefix] === undefined)
      {
	this.idList[prefix] = 0;
      }
      var id = prefix + this.idList[prefix];
      this.idList[prefix] += 1;
      return id;
    },

    generateNodeName: function ()
    {
      var id = this.uniqueName('node-');
      while (_.where(this.nodes, { name: id }).length > 0)
      {
	id = this.uniqueName('node-');
	 
      }
      return id;
    },

    generateLinkName: function ()
    {
      var id = this.uniqueName('link-');
      while (_.where(this.lans, { name: id }).length > 0)
      {
	id = this.uniqueName('link-');
      }
      return id;
    },

    generateInterfaceName: function ()
    {
      var id = this.uniqueName('interface-');
      while (_.where(this.interfaces, { name: id }).length > 0)
      {
	id = this.uniqueName('interface-');
      }
      return id;
    },

    generateSiteName: function (site)
    {
      var result;
      if (site.urn)
      {
	if (this.context.canvasOptions.aggregates)
	{
	  var found = _.findWhere(this.context.canvasOptions.aggregates,
				  { id: site.urn });
	  if (found)
	  {
	    result = found.name;
	  }
	}
	if (result === undefined)
	{
	  var split = site.urn.split('+');
	  if (split.length === 4)
	  {
	    result = site.urn.split('+')[1];
	  }
	  else
	  {
	    result = site.urn;
	  }
	}
      }
      if (result === undefined)
      {
	result = this.uniqueName('Site ');
	while (_.where(this.sites, { name: result }).length > 0)
	{
	  result = this.uniqueName('Site ');
	}
      }
      return result;
    },

    changeAttribute: function (itemsToChange, key, value, type)
    {
      var that = this;
      var items;
      if (type === 'node')
      {
	items = this.nodes;
      }
      else if (type === 'link')
      {
	items = this.lans;
      }
      else
      {
	items = this.sites;
      }
      _.each(itemsToChange, _.bind(function(d) {
	var item = _.where(items, {id: d})[0];
	item[key] = value;
	if (key === 'name' && type === 'node')
	{
	  _.each(item.interfaces, function (iface) {
	    iface.nodeName = item.name;
	  });
	}
      }, this));
      if (key === 'urn' && type === 'site')
      {
	_.each(itemsToChange, _.bind(function(d) {
	  var item = _.where(items, {id: d})[0];
	  item.name = this.generateSiteName(item);
	}, this));
	this.trigger('changeAggregate');
      }
      _.each(itemsToChange, _.bind(function(d) {
	var item = _.where(items, {id: d})[0];
	if (type === 'node')
	{
	  this.checkNode(item);
	  _.each(item.interfaces, function (ifaceId) {
	    var iface = this.interfaces[ifaceId];
	    var linkId = iface.linkId;
	    var link = this.lans[linkId];
	    this.checkLan(link);
	  }.bind(this));
	}
	else
	{
	  this.checkLan(item);
	  _.each(item.endpoints, function (endpoint) {
	    this.checkNode(endpoint);
	  }.bind(this));
	}
      }, this));
      this.trigger('change');
    },

    removeItems: function (idList, type)
    {
      if (type === 'node')
      {
	this.removeNodes(idList);
      }
      else if (type === 'link')
      {
	this.removeLinks(idList);
      }
      else if (type === 'site')
      {
	this.removeSites(idList);
      }
    },

    removeNodes: function (idList)
    {
      var linkReaper = [];
      _.each(idList, function (id) {
	var node = this.nodes[id];
	while (node.interfaces.length > 0)
	{
	  var iface = this.interfaces[node.interfaces[0]];
	  var link = this.lans[iface.linkId];
	  this.removeNodeFromLan(node, link);
	  if (link.interfaces.length < 2)
	  {
	    linkReaper.push(link.id);
	  }
	}
	delete this.nodes[id];
      }.bind(this));
      this.trigger('removeNodes', idList);
      this.trigger('change');
      this.removeLinks(_.unique(linkReaper));
    },

    removeLinks: function (idList)
    {
      _.each(idList, function (id) {
	var link = this.lans[id];
	while (link.interfaces.length > 0)
	{
	  var iface = this.interfaces[link.interfaces[0]];
	  var node = this.nodes[iface.nodeId];
	  this.removeNodeFromLan(node, link);
	}
	delete this.lans[id];
      }.bind(this));
      this.trigger('removeLans', idList);
      this.trigger('change');
    },

    removeNodeFromLan: function (node, link)
    {
      var iface;
      _.each(node.interfaces, function (id) {
	var candidate = this.interfaces[id];
	if (candidate.linkId === link.id)
	{
	  iface = candidate;
	}
      }.bind(this));
      if (iface)
      {
	delete this.interfaces[iface.id];
	node.interfaces = _.without(node.interfaces, iface.id);
	link.interfaces = _.without(link.interfaces, iface.id);
	link.endpoints = _.without(link.endpoints, node);
	link.trigger('removeEndpoint', node);
	this.trigger('change');
      }
    },

    removeSites: function (idList)
    {
      var reaperList = [];
      _.each(idList, function (id) {
	var membership = _.where(this.nodes, { group: id});
	if (membership.length === 0)
	{
	  reaperList.push(id);
	  delete this.sites[id];
	}
      }.bind(this));
      if (reaperList.length > 0)
      {
	this.trigger('removeSites', reaperList);
	this.trigger('change');
      }
    },

    // Do bookkeeping when an IP address changes.
    switchIp: function (ifaceId, oldValue, newValue)
    {
      if (oldValue)
      {
	this.ipUsage[oldValue] = _.without(this.ipUsage[oldValue], ifaceId);
	if (this.ipUsage[oldValue].length === 0)
	{
	  delete this.ipUsage[oldValue];
	}
      }
      if (newValue)
      {
	if (! this.ipUsage[newValue])
	{
	  this.ipUsage[newValue] = [];
	}
	this.ipUsage[newValue] = _.union(this.ipUsage[newValue], [ifaceId]);
      }
      var iface = this.interfaces[ifaceId];
      this.checkLan(this.lans[iface.linkId]);
      this.trigger('change');
    },

    checkNode: function (node)
    {
     //n node.warnings.constraintNode = (! this.validList.isValidNode(node, this.sites[node.group]));
      node.warnings.adjacentLink = (! this.validList.isValidNodeNeighbor(node));
    },

    checkLan: function (lan)
    {
      lan.warnings.openflow = (lan.openflow === '');
      lan.warnings.adjacentNode = (! this.validList.isValidLan(lan));

      var linkTypes = this.validList.findLinks(lan, 'linkTypes');
      var allowed = _.without(linkTypes.allowed, 'gre-tunnel', 'egre-tunnel');
      lan.warnings.defaultLinkType = (allowed.length === 0);

      var foundDuplicate = false;
      _.each(lan.interfaces, function (ifaceId) {
	var iface = this.interfaces[ifaceId];
	if (iface.ip && this.ipUsage[iface.ip] &&
	    this.ipUsage[iface.ip].length > 1)
	{
	  foundDuplicate = true;
	}
      }.bind(this));
      lan.warnings.duplicateAddress = foundDuplicate;
    },

  };

  return TopologyModel;
});

define('lib/View',['underscore', 'backbone'],
function (_, Backbone)
{
  

  var View = function(options) {
    options = options || {};
    bindUnderscore(this);
    this.options = options;
    this.cid = _.uniqueId('view');
    this.$el = $([]);
    this.children = [];
    this.rendered = false;
    this.shown = true;
    this.initialize.apply(this, arguments);
  };

  _.extend(View.prototype, Backbone.Events, {

    $: function(selector)
    {
      return this.$el.find(selector);
    },

    // $on(eventName, method)
    // $on(eventName, selector, method)
    // $on(eventName, jQuery, method)
    $on: function(eventName, selector, method)
    {
      var base = this.$el;
      if (! method)
      {
	method = selector;
	selector = undefined;
      }
      if (selector !== undefined && ! _.isString(selector))
      {
	base = selector;
	selector = undefined;
      }

      boundMethod = _.bind(method, this);
      fullName = '';
      names = eventName.split(' ');
      this._each(names, function (name) {
	if (name !== '')
	{
	  if (fullName !== '')
	  {
	    fullName += ' ';
	  }
	  fullName += name + '.selectBind' + this.cid;
	}
      });
      if (selector === undefined)
      {
	base.on(fullName, boundMethod);
      }
      else
      {
	base.on(fullName, selector, boundMethod);
      }
    },

    $off: function()
    {
      this.$el.off('.selectBind' + this.cid);
    },

    superCleanup: function ()
    {
      this.stopListening();
      this.$off();
      this._each(this.children, function (child) {
	child.$el.remove();
	child.cleanup();
      });
    },

    superRender: function (el)
    {
      this.$el = el || this.$el;
      this.rendered = true;
      this.update(this.options.state);
      return this.$el;
    },

    superShow: function ()
    {
      if (! this.shown)
      {
	this.$el.show();
	this.shown = true;
      }
    },

    superHide: function ()
    {
      if (this.shown)
      {
	this.$el.hide();
	this.shown = false;
      }
    },

    initialize: function (options) {},

    cleanup: function () { this.superCleanup() },

    render: function (el) { this.superRender(el) },

    update: function (state) {},

    show: function () { this.superShow() },

    hide: function () { this.superHide() }

  });

  View.extend = function(protoProps, staticProps)
  {
    var parent = this;
    var child;

    if (protoProps && _.has(protoProps, 'constructor'))
    {
      child = protoProps.constructor;
    }
    else
    {
      child = function(){ return parent.apply(this, arguments); };
    }

   _.extend(child, parent, staticProps);

    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    if (protoProps) _.extend(child.prototype, protoProps);

    child.__super__ = parent.prototype;

    return child;
  };

  underscoreMethods = ['each', 'forEach',
		       'map', 'collect',
		       'reduce', 'inject', 'foldl',
		       'reduceRight', 'foldr',
		       'find', 'detect',
		       'filter', 'select',
		       'reject', 'every', 'all',
		       'some', 'any',
		       'max', 'min',
		       'sortBy', 'groupBy', 'indexBy', 'countBy'];

  function bindUnderscore(that)
  {
    that._ = {};
    _.each(underscoreMethods, function (method) {
      that['_' + method] = function()
      {
	args = _.toArray(arguments);
	if (args.length >= 2 && _.isFunction(args[1]) &&
	    args[1] !== undefined && args[1] !== null)
	{
	  args[1] = _.bind(args[1], that);
	}
	return _[method].apply(_, args);
      };
    });
  }

  return View;
});

define('js/info/TextInputView',['underscore', 'backbone', 'lib/View'],
function (_, Backbone, View)
{
  

  var TextInputView = View.extend({

    // options {
    //  data: opaque value returned in change event
    //  state: Initial state
    // }
    initialize: function (options)
    {
      this.value = null;
      this.disabled = null;
    },

    render: function (el)
    {
      if (! this.rendered)
      {
	this.$el = el || $('<input type="text">');
	this.$on('change keyup paste', this.$el, this.change);
      }
      return this.superRender();
    },

    // state {
    //  value: New value
    //  disabled: True if this input should be disabled
    //  shown: True if this input should be displayed
    // }
    update: function (state)
    {
      if (state)
      {
	this.setValue(state.value);
	if (state.disabled === true)
	{
	  this.disable();
	}
	else if (state.disabled === false)
	{
	  this.enable();
	}
	if (state.shown === true)
	{
	  this.show();
	}
	else if (state.shown === false)
	{
	  this.hide();
	}
      }
    },

    disable: function ()
    {
      if (this.disabled !== true)
      {
	this.$el.attr('readonly', 'readonly');
      }
      this.disabled = true;
    },

    enable: function ()
    {
      if (this.disabled !== false)
      {
	this.$el.removeAttr('readonly');
      }
      this.disabled = false;
    },

    setValue: function (inText)
    {
      var text = inText || '';
      if (text !== this.value)
      {
	this.$el.val(text);
      }
      this.value = text;
    },

    change: function (event)
    {
      this.value = this.$el.val();
      this.trigger('change', { value: this.value,
			       data: this.options.data });
    },

  });

  return TextInputView;
});

define('js/info/TextField',['underscore', 'backbone', 'lib/View', 'js/info/TextInputView'],
function (_, Backbone, View, TextInputView)
{
  

  var TextField = View.extend({

    // options {
    //   title: Title of this field
    //   state: Initial state
    //   data: Opaque data object passed back on change events
    // }
    initialize: function (options)
    {
      this.input = new TextInputView();
      this.children.push(this.input);
    },

    render: function (el)
    {
      if (! this.rendered)
      {
	this.$el = el || $('<div/>');
	var title = $('<h4>')
	  .html(_.escape(this.options.title))
	  .appendTo(this.$el);
	this.input.render()
	  .addClass('form-control')
	  .appendTo(this.$el);
	this.listenTo(this.input, 'change', this.change);
	this.update(this.options.state);
      }
      return this.superRender();
    },

    // state {
    //   values: List of values to place in this box
    //   isViewer: True if this is read-only viewer mode
    //   type: 'node' or 'site' or 'link' or 'none'
    //   disabled: True if this box should be disabled
    // }
    update: function (state)
    {
      if (state)
      {
	var unique = _.unique(state.values);
	var values = unique.join(', ');
	var disabled = (state.isViewer || unique.length > 1 ||
			state.disabled);
	this.input.update({
	  value: values,
	  disabled: disabled
	});
      }
    },

    change: function (state)
    {
      this.trigger('change', { value: state.value,
			       data: this.options.data });
    }

  });
console.log(TextField);
  return TextField;
});

define('js/info/ReadOnlyField',['underscore', 'backbone', 'lib/View'],
function (_, Backbone, View)
{
  

  var ReadOnlyField = View.extend({

    initialize: function (options)
    {
      this.value = null;
      this.title = options.title;
    },

    render: function (el)
    {
      if (! this.rendered)
      {
	this.$el = el || $('<div/>');
	var title = $('<strong/>')
	  .html(_.escape(this.title))
	  .appendTo(this.$el);
	this.$el.append(' <span/>');
      }
      return this.superRender();
    },

    // state {
    //   values: List of values to place in this box
    //   isViewer: True if this is read-only viewer mode
    //   type: 'node' or 'site' or 'link' or 'none'
    //   disabled: True if this box should be disabled
    // }
    update: function (state)
    {
      if (state)
      {
	var valueList = [];
	this._each(state.values, function (value) {
	  if (value !== null && value !== undefined && value !== '')
	  {
	    valueList.push(_.escape(value));
	  }
	});
	if (valueList.length > 0)
	{
	  this.$('strong').show();
	  this.$('span').html(valueList.join('<br>')).show();
	}
	else
	{
	  this.$('strong').hide();
	  this.$('span').hide();
	}
      }
    }

  });

  return ReadOnlyField;
});

define('js/info/ConstrainedField',['underscore', 'backbone', 'lib/View', 'js/canvas/ValidList'],
function (_, Backbone, View, ValidList)
{
  

  var ConstrainedField = View.extend({

    // options {
    //   title: Title of this field
    //   choices: List of possible options
    //   contraints: Constraint system on choices
    //   data: Opaque data object passed back on change events
    // }
    initialize: function (options)
    {
      this.title = options.title;
      this.choices = options.choices;
      this.constraints = options.constraints;
      this.optionKey = options.optionKey;
      this.data = options.data;
      this.dropdownField = null;
      this.freeformField = null;
      this.versionField = null;

      this.constrainedChoices = null;
      this.dropdownValue = null;
      this.value = null;
      this.isVersion = null;
      this.version = null;
      this.isFreeform = null;
      this.disabled = null;
      this.freeformDisabled = null;
    },

    render: function (el)
    {
      if (! this.rendered)
      {
	this.$el = el || $('<div/>');
	if (this.title)
	{
	  $('<h4>')
	    .html(_.escape(this.title))
	    .appendTo(this.$el);
	}
	this.dropdownField = $('<input type="hidden">')
	  .addClass('form-control dropdown')
	  .appendTo(this.$el);
	this.freeformField = $('<input type="text">')
	  .addClass('form-control custom')
	  .hide()
	  .appendTo(this.$el);
	this.versionField = $('<input type="text" placeholder="version">')
	  .addClass('form-control custom')
	  .hide()
	  .appendTo(this.$el);
	this.$on('change', this.dropdownField, this.change);
	this.$on('change keyup paste', this.freeformField,
		 this.changeFreeform);
      }
      return this.superRender();
    },

    // state {
    //   values: List of values to place in this box
    //   isViewer: True if this is read-only viewer mode
    //   type: 'node' or 'site' or 'link' or 'none'
    //   disabled: True if this box should be disabled
    //   freeform: True if we should be using the freeform box
    //   model: Global view of the topology
    //   selection: Current items selected (node, site, or link)
    // }
    update: function (state)
    {

      if (state)
      {
	var unique = _.unique(state.values);
	var values = unique.join(', ');

	var freeform = (state.freeform ||
			(values !== '' &&
			 (unique.length > 1 ||
			  ! this.hasChoice(unique))));
	var dropdownValue = values;
	if (dropdownValue === '')
	{
	  dropdownValue = '(any)';
	}
	if (freeform)
	{
	  dropdownValue = 'Other...';
	}
	var validList = new ValidList(state.model, this.constraints);
	var constrainedChoices = this.runConstraints(state.selection,
						     state.type,
						     validList);
	if (dropdownValue !== this.dropdownValue ||
	    this.isDifferentChoices(constrainedChoices))
	{
	  this.updateChoices(constrainedChoices);
	  this.dropdownField.select2('val', dropdownValue);
	}

	if (values !== this.value)
	{
	  this.freeformField.val(values);
	}

	if (freeform !== this.isFreeform)
	{
	  if (freeform)
	  {
	    this.freeformField.show();
	  }
	  else
	  {
	    this.freeformField.hide();
	  }
	}

	var version = '';
	if (state.selection.length === 1 && state.selection[0].version)
	{
	  version = state.selection[0].version;
	}
	if (version !== this.version)
	{
	  this.versionField.val(version);
	}

	var isVersion = (freeform && this.optionKey === 'images' &&
			 state.selection.length === 1);
	if (isVersion !== this.isVersion)
	{
	  if (isVersion)
	  {
	    this.versionField.show();
	  }
	  else
	  {
	    this.versionField.hide();
	  }
	}

	var disabled = (state.isViewer || state.disabled || unique.length > 1)
	if (disabled !== this.disabled)
	{
	  if (disabled)
	  {
	    this.dropdownField.select2('enable', false);
	  }
	  else
	  {
	    this.dropdownField.select2('enable', true);
	  }
	}

	var freeformDisabled = freeform && (disabled || unique.length > 1);
	if (freeformDisabled !== this.freeformDisabled)
	{
	  if (freeformDisabled)
	  {
	    this.freeformField.attr('readonly', 'readonly');
	    this.versionField.attr('readonly', 'readonly');
	  }
	  else
	  {
	    this.freeformField.removeAttr('readonly');
	    this.versionField.removeAttr('readonly');
	  }
	}
	this.constrainedChoices = constrainedChoices;
	this.dropdownValue = dropdownValue;
	this.value = values; 
	this.isFreeform = freeform;
	this.version = version;
	this.isVersion = isVersion;
	this.disabled = disabled;
	this.freeformDisabled = freeformDisabled;
      }
    },

    updateChoices: function (constrainedChoices)
    {

      var allowed = constrainedChoices.allowed;
      var data = { results: [] };
      data.results.push({ id: '(any)', text: '(any)' });
      this._each(allowed, function(item) {
	data.results.push({
	  id: item,
	  text: _.findWhere(this.choices, { id: item }).name
	});
      });
      data.results.push({ id: 'Other...', text: 'Other...' });
      if (constrainedChoices.rejected.length > 0)
      {
	var rejected = [];
	this._each(constrainedChoices.rejected, function (item) {
	  rejected.push({
	    id: item, 
	    text: _.findWhere(this.choices, { id: item }).name
	  });
	});
	data.results.push({
	  text: '----------',
	  children: rejected,
	  disabled: true
	});
      }

      function format(item) {
	if (item.url)
	{
	  return '<img class="dropdown-icon" width="20" height="20" src="' +
	    item.url + '"> ' + _.escape(item.text);
	}
	else
	{
	  return _.escape(item.text);
	}
      }

      var that = this;
      this.dropdownField.select2('destroy');
      this.dropdownField.select2({
	initSelection: function (element, callback) {
	  var id = element.val();
	  var name = id;
	  var choice = _.findWhere(that.choices, { id: id });
	  if (choice)
	  {
	    name = choice.name;
	  }
	  var newItem = { id: id, text: name };
	  if (that.optionKey === 'icons' && id !== '(any)' && id !== 'Other...')
	  {
	    newItem.url = id;
	  }
	  callback(newItem);
	},
	query: function (query) {
	  query.callback(data);
	},
	formatResult: format,
	formatSelection: format,
	escapeMarkup: function (m) { return m; }
      });
    },

    change: function (event)
    {

      var value;
      var isFreeform = false;
      if (event.val === '(any)')
      {
	value = undefined;
	isFreeform = false;
      }
      else if (event.val === 'Other...')
      {
	value = this.value;
	isFreeform = true;
      }
      else
      {
	value = event.val;
	isFreeform = false;
      }
      result = {
	value: value,
	freeform: isFreeform,
	data: this.data
      };
      if (this.optionKey === 'images' && event.val !== 'Other...')
      {
	result.hasVersion = true;
	result.version = undefined;
	var choice = _.findWhere(this.choices, { id: value });
	if (choice)
	{
	  result.version = choice.version;
	}
      }
      this.trigger('change', result);
    },

    changeFreeform: function (event)
    {
console.log("changeFreeform");
      this.value = this.freeformField.val();
      result = {
	value: this.value,
	freeform: this.isFreeform,
	data: this.data
      };
      if (this.optionKey === 'images')
      {
	this.version = this.versionField.val();
	result.hasVersion = true;
	result.version = this.version;
      }
      this.trigger('change', result);
    },

    hasChoice: function (list)
    {
console.log("hasChoice");
      var result = false;
      this._each(list, function(item) {
	result = result ||
	  _.findWhere(this.choices, { id: item }) !== undefined;
      });
      return result;
    },

    runConstraints: function (selection, selectionType, validList)
    {
console.log("runConstraints");
      var result = {
	allowed: [],
	rejected: []
      };
      if (selection.length > 0)
      {
	if (this.optionKey === 'icons')
	{
	  result = {
	    allowed: _.pluck(this.choices, 'id'),
	    rejected: []
	  };
	}
	else
	{
	  if (selectionType === 'node')
	  {
	    result = validList.findNodes(selection[0],
					 this.optionKey);
	  }
	  else if (selectionType === 'link')
	  {
	    result = validList.findLinks(selection[0],
					 this.optionKey);
	  }
	  else if (selectionType === 'site')
	  {
	    result = validList.findSites(selection[0],
					 this.optionKey);
	  }
	}
      }
      return result;
    },

    isDifferentChoices: function (newChoices)
    {
console.log("isDifferentChoices");
      var isDifferent = false;
      var old = this.constrainedChoices;
      if (old === null)
      {
	isDifferent = true;
      }
      else
      {
	this._each(['allowed', 'rejected'], function (status) {
	  if (newChoices[status].length !== old[status].length)
	  {
	    isDifferent = true;
	  }
	  else
	  {
	    for (var i = 0; i < newChoices[status].length; i += 1)
	    {
	      if (newChoices[status][i] !== old[status][i])
	      {
		isDifferent = true;
		break;
	      }
	    }
	  }
	});
      }
      return isDifferent;
    }

  });

  return ConstrainedField;
});

define('js/info/CheckboxView',['underscore', 'backbone', 'lib/View'],
function (_, Backbone, View)
{
  

  var CheckboxView = View.extend({

    // options {
    //  state: Initial state
    //  data: opaque value returned in change event
    // }
    initialize: function (options)
    {
      this.checked = null;
      this.label = null;
      this.disabled = null;
    },

    render: function (el)
    {
      if (! this.rendered)
      {
	this.$el = el || $('<div class="checkbox"/>');
	this.labelEl = $('<label/>').appendTo(this.$el);
	this.checkbox = $('<input type="checkbox">')
	  .appendTo(this.labelEl);
	this.$on('change', this.checkbox, this.change);
      }
      return this.superRender();
    },

    // state {
    //  value: True if box is checked
    //  label: New label
    //  disabled: True if box is disabled
    //  shown: True if this component should be shown
    // }
    update: function (state)
    {
      if (state)
      {
	if (state.value === true)
	{
	  this.check();
	}
	else if (state.value === false)
	{
	  this.clear();
	}

	if (state.label !== undefined && state.label !== null)
	{
	  this.setLabel(state.label);
	}

	if (state.disabled === true)
	{
	  this.disable();
	}
	else if (state.disabled === false)
	{
	  this.enable();
	}

	if (state.shown === true)
	{
	  this.show();
	}
	else if (state.shown === false)
	{
	  this.hide();
	}
      }
    },

    check: function ()
    {
      if (this.checked !== true)
      {
	this.checkbox.prop('checked', true);
      }
      this.checked = true;
    },

    clear: function ()
    {
      if (this.checked !== false)
      {
	this.checkbox.prop('checked', false);
      }
      this.checked = false;
    },

    disable: function ()
    {
      if (this.disabled !== true)
      {
	this.checkbox.attr('disabled', true);
      }
      this.disabled = true;
    },

    enable: function ()
    {
      if (this.disabled !== false)
      {
	this.checkbox.attr('disabled', false);
      }
      this.disabled = false;
    },

    setLabel: function (label)
    {
      var text = label || '';
      if (text !== this.label)
      {
	var current = this.labelEl.contents().last();
	if (! current.is('input:checkbox'))
	{
	  current.remove();
	}
	this.labelEl.append(_.escape(text));
      }
      this.label = text;
    },

    change: function (event)
    {
      this.trigger('change', {
	value: this.$('input').prop('checked'),
	data: this.options.data
      });
    }

  });

  return CheckboxView;
});


define('js/info/ToggleField',['underscore', 'backbone', 'lib/View', 'js/info/CheckboxView'],
function (_, Backbone, View, CheckboxView)
{
  

  var ToggleField = View.extend({

    // options {
    //   title: Title of this field
    //   state: Initial state
    //   data: Opaque data object passed back on change
    // }
    initialize: function ()
    {
      this.checkbox = new CheckboxView();
      this.children.push(this.checkbox);
    },

    render: function (el)
    {
      if (! this.rendered)
      {
	this.$el = el || $('<div/>');
	this.checkbox.render()
	  .appendTo(this.$el);
	this.listenTo(this.checkbox, 'change', this.change);
      }
      return this.superRender();
    },

    // state {
    //   values: List of values to place here
    //   isViewer: True if this is read-only viewer mode
    //   disabled: True if box should be disabled
    // }
    update: function (state)
    {
      if (state)
      {
	var unique = _.unique(state.values);
	var shown = (unique.length === 1);
	var checked = false;
	if (shown && unique[0])
	{
	  checked = true;
	}
	this.checkbox.update({
	  value: checked,
	  label: this.options.title,
	  disabled: (state.isViewer || state.disabled),
	  shown: shown,
	});
      }
    },

    change: function (state)
    {
      this.trigger('change', {
	value: state.value,
	data: this.options.data
      });
    }

  });

  return ToggleField;
});

define('js/canvas/InstallDisplay',['underscore', 'backbone'],
function (_, Backbone)
{
  

  var template = '<div class="panel-body"><label>URL:</label><input type="text" class="form-control" id="url" value="" placeholder="ex: http://example.com/mystuff.tar.gz"><label>Install Path:</label><input type="text" class="form-control" id="path" value="" placeholder="ex: /local"><button id="remove" class="btn btn-danger">Remove</button></div>';

  var InstallDisplay = Backbone.View.extend({

    events: {
      'click #remove': 'removeItem'
    },

    initialize: function () {
      this.render();
      this.$el.on('change keyup paste', 'input',
		  _.bind(this.changeItem, this));
    },

    cleanup: function () {
      this.$el.off('change keyup paste', 'input');
      this.$el.remove();
    },

    render: function () {
      this.$el.html(template);
    },

    update: function (install) {
      if (this.$('#url') !== install.url)
      {
	this.$('#url').val(install.url);
      }
      if (this.$('#path') !== install.install_path)
      {
	this.$('#path').val(install.install_path);
      }
    },

    removeItem: function () {
      this.trigger('remove', { item: this });
    },

    changeItem: function () {
      this.trigger('change', { item: this,
			       url: this.$('#url').val(),
			       install_path: this.$('#path').val() });
    }

  });

  return InstallDisplay;
});

define('js/canvas/ExecuteDisplay',['underscore', 'backbone'],
function (_, Backbone)
{
  

  var template = '<div class="panel-body"><label>Command:</label><input type="text" class="form-control" id="command" value="" placeholder="ex: sh /local/myscript.sh"><input type="text" class="form-control" id="shell" disabled="true" value="/bin/sh"><button id="remove" class="btn btn-danger">Remove</button></div>';

  var ExecuteDisplay = Backbone.View.extend({

    events: {
      'click #remove': 'removeItem'
    },

    initialize: function () {
      this.render();
      this.$el.on('change keyup paste', 'input',
		  _.bind(this.changeItem, this));
    },

    cleanup: function () {
      this.$el.off('change keyup paste', 'input');
      this.$el.remove();
    },

    render: function () {
      this.$el.html(template);
    },

    update: function (execute) {
      if (this.$('#command').val() !== execute.command)
      {
	this.$('#command').val(execute.command);
      }
      if (this.$('#shell').val() !== execute.shell)
      {
	this.$('#shell').val(execute.shell);
      }
    },

    removeItem: function () {
      this.trigger('remove', { item: this });
    },

    changeItem: function () {
      this.trigger('change', { item: this,
			       command: this.$('#command').val(),
			       shell: this.$('#shell').val() });
    }

  });

  return ExecuteDisplay;
});

define('js/canvas/InterfaceDisplay',['underscore', 'backbone'],
function (_, Backbone)
{
  

  var template = '<div class="panel-body"><h5>Interface to <strong id="nodeName"></strong></h5><label>Name:</label><input type="text" class="form-control" id="name" value="" placeholder="ex: interface-3"><label>Bandwidth (in kbps):</label><input type="text" class="form-control" id="bandwidth" value="" placeholder="ex: 100000"><label>IP:</label><input type="text" class="form-control" id="ip" value="" placeholder="ex: 192.168.6.7"><label>Netmask:</label><input type="text" class="form-control" id="netmask" value="" placeholder="ex: 255.255.255.0"><div id="mac-container"><strong>MAC:</strong> <span id="mac"></span></div><button id="remove" class="btn btn-danger">Remove</button></div>';

  var InterfaceDisplay = Backbone.View.extend({

    events: {
      'click #remove': 'removeItem'
    },

    initialize: function () {
      this.render();
      this.$el.on('change keyup paste', 'input',
		  _.bind(this.changeItem, this));
    },

    cleanup: function () {
      this.$el.off('change keyup paste', 'input');
      this.$el.remove();
    },

    render: function () {
      this.$el.html(template);
    },

    update: function (iface) {
      this.$('#nodeName').html(_.escape(iface.node.name));
      if (this.$('#name').val() !== iface.name)
      {
	this.$('#name').val(iface.name);
      }
      if (this.$('#bandwidth').val() !== iface.bandwidth)
      {
	this.$('#bandwidth').val(iface.bandwidth);
      }
      if (this.$('#ip') !== iface.ip)
      {
	this.$('#ip').val(iface.ip);
      }
      if (this.$('#netmask') !== iface.netmask)
      {
	this.$('#netmask').val(iface.netmask);
      }
      if (iface.mac)
      {
	this.$('#mac-container').show();
	this.$('#mac').html(_.escape(iface.mac));
      }
      else
      {
	this.$('#mac-container').hide();
      }
    },

    removeItem: function () {
      this.trigger('remove', { item: this });
    },

    changeItem: function () {
console.log("changeItem");
      this.trigger('change', { item: this,
			       name: this.$('#name').val(),
			       bandwidth: this.$('#bandwidth').val(),
			       ip: this.$('#ip').val(),
			       netmask: this.$('#netmask').val() });
    }

  });

  return InterfaceDisplay;
});

define('js/canvas/ListDisplay',['underscore', 'backbone'],
function (_, Backbone)
{
  

  ListDisplay = Backbone.View.extend({

    events: {
      'click #add': 'addItem'
    },

    initialize: function () {
      this.domItems = [];
    },

    cleanup: function () {
      this.stopListening();
      _.each(this.domItems, function (item) {
	item.cleanup();
      });
    },

    render: function () {
    },

    update: function (list) {
      for (var i = 0; i < this.domItems.length; i += 1)
      {
	if (i < list.length)
	{
	  this.domItems[i].update(list[i]);
	}
	else
	{
	  this.stopListening(this.domItems[i]);
	  this.domItems[i].cleanup();
	}
      }
      for (var i = this.domItems.length; i < list.length; i += 1)
      {
	var newElement = $('<div class="info-list-item panel panel-default"/>');
	var newItem = new this.options.ItemDisplay({ el: newElement });
	this.listenTo(newItem, 'change', this.changeItem);
	this.listenTo(newItem, 'remove', this.removeItem);
	newItem.update(list[i]);
	this.domItems.push(newItem);
	this.$('.list').append(newElement);
      }
      this.domItems.splice(list.length, this.domItems.length);
    },

    addItem: function () {
      this.trigger('add');
    },

    removeItem: function (changed) {
      var index = this.domItems.indexOf(changed.item)
      this.trigger('remove', { index: index });
    },

    changeItem: function (changed) {
      var index = this.domItems.indexOf(changed.item);
      this.trigger('change', { index: index,
			       changed: changed });
    }

  });

  return ListDisplay;
});

// This object manages all of the listdisplays which actually render
// individual lists

define('js/info/ListManager',['underscore', 'backbone', 'lib/View',
	'js/canvas/InstallDisplay', 'js/canvas/ExecuteDisplay',
	'js/canvas/InterfaceDisplay', 'js/canvas/ListDisplay'],
function (_, Backbone, View,
	  InstallDisplay, ExecuteDisplay, InterfaceDisplay, ListDisplay)
{
  

  var ListManager = View.extend({

    initialize: function (options)
    {
      this.title = options.title;
      this.displayType = options.display;
      this.data = options.data;
      this.display = null;
      this.container = null;
      this.disabled = null;
      this.outside = null;
    },

    render: function (el)
    {
      if (! this.rendered)
      {
	this.$el = (el || $('<div/>'));
	this.outside = $('<div/>')
	  .append('<hr>')
	  .appendTo(this.$el);
	var title = $('<h4>')
	  .html(_.escape(this.title))
	  .appendTo(this.outside);
	this.container = $('<div/>')
	  .appendTo(this.outside);
	var list = $('<div>')
	  .addClass('list')
	  .appendTo(this.container);
	if (this.displayType === ExecuteDisplay ||
	    this.displayType === InstallDisplay)
	{
	  var add = $('<button>Add</button>')
	    .addClass('btn btn-success')
	    .attr('id', 'add')
	    .appendTo(this.container);
	}
	this.display = new ListDisplay({
	  el: this.container,
	  ItemDisplay: this.displayType
	});
	this.listenTo(this.display, 'add', this.add);
	this.listenTo(this.display, 'remove', this.remove);
	this.listenTo(this.display, 'change', this.change);
      }
      return this.superRender();
    },

    // state {
    //   values: List of values to place in this box
    //   isViewer: True if this is read-only viewer mode
    //   type: 'node' or 'site' or 'link' or 'none'
    //   disabled: True if this box should be disabled
    // }
    update: function (state)
    {
      if (state)
      {
	disabled = state.disabled || state.isViewer;
	if (disabled !== this.disabled)
	{
	  if (disabled)
	  {
	    this.$('button').attr('disabled', 'true');
	    this.$('input').attr('readonly', 'readonly');
	  }
	  else
	  {
	    this.$('button').removeAttr('disabled');
	    this.$('input').removeAttr('readonly');
	  }
	  if (state.isViewer)
	  {
	    this.$('button').hide();
	  }
	}
	if (state.isViewer &&
	    (! state.values || state.values.length !== 1 ||
	     (state.values.length === 1 && state.values[0].length === 0)))
	{
	  this.outside.hide();
	}
	else
	{
	  this.outside.show();
	}
	if (state.values && state.values.length === 1)
	{
	  this.display.update(state.values[0]);
	}
	this.disabled = disabled;
      }
    },

    add: function (state)
    {
      if (this.displayType === ExecuteDisplay)
      {
	this.trigger('addToList', {
	  data: this.data,
	  item: {
	    command: '',
	    shell: '/bin/sh'
	  }
	});
      }
      else if (this.displayType === InstallDisplay)
      {
	this.trigger('addToList', {
	  data: this.data,
	  item: {
	    url: '',
	    install_path: ''
	  }
	});
      }
    },

    remove: function (state)
    {
      this.trigger('removeFromList', {
	index: state.index,
	data: this.data
      });
    },

    change: function (state)
    {
      this.trigger('changeList', {
	index: state.index,
	changed: state.changed,
	data: this.data
      });
    }

  });

/*
    addExecute: function ()
    {
      if (this.highlights.length === 1)
      {
	var current = this.topoData.nodes[this.highlights[0]];
	current.execute.push({ command: '', shell: '/bin/sh' });
	this.showAttributes();
      }
    },

    addInstall: function ()
    {
      if (this.highlights.length === 1)
      {
	var current = this.topoData.nodes[this.highlights[0]];
	current.install.push({ url: '', install_path: '' });
	this.showAttributes();
      }
    },

    removeExecute: function (removed)
    {
      if (this.highlights.length === 1)
      {
	var current = this.topoData.nodes[this.highlights[0]];
	current.execute.splice(removed.index, 1);
	this.showAttributes();
      }
    },

    removeInstall: function (removed)
    {
      if (this.highlights.length === 1)
      {
	var current = this.topoData.nodes[this.highlights[0]];
	current.install.splice(removed.index, 1);
	this.showAttributes();
      }
    },

    changeExecute: function (changed)
    {
      if (this.highlights.length === 1)
      {
	var current = this.topoData.nodes[this.highlights[0]];
	_.each(changed.changed, function (value, key) {
	  current.execute[changed.index][key] = value;
	});
	this.showAttributes();
      }
    },


    changeInstall: function (changed)
    {
      if (this.highlights.length === 1)
      {
	var current = this.topoData.nodes[this.highlights[0]];
	_.each(changed.changed, function (value, key) {
	  current.install[changed.index][key] = value;
	});
	this.showAttributes();
      }
    },

    changeInterface: function (changed)
    {
      if (this.highlights.length === 1)
      {
	var link = this.topoData.lans[this.highlights[0]];
	var id = link.interfaces[changed.index];
	var current = this.topoData.interfaces[id];
	console.log(current, changed);
	_.each(changed.changed, function (value, key) {
	  current[key] = value;
	});
      }
    },
*/

  return ListManager;
});

define('js/info/OpenflowField',['underscore', 'backbone', 'lib/View',
	'js/info/CheckboxView', 'js/info/TextInputView'],
function (_, Backbone, View, CheckboxView, TextInputView)
{
  

  var OpenflowDisplay = View.extend({

    // options {
    //   state: Initial state
    //   data: Opaque data object passed back on change events
    // }
    initialize: function (options)
    {
      this.checkbox = new CheckboxView();
      this.children.push(this.checkbox);
      this.input = new TextInputView();
      this.children.push(this.input);
    },

    render: function (el)
    {
      if (! this.rendered)
      {
	this.$el = el || $('<div/>');
	this.checkbox.render()
	  .appendTo(this.$el);
	this.input.render()
	  .attr('placeholder', 'ex: tcp:controller_ip:6633')
	  .appendTo(this.$el);
	this.listenTo(this.checkbox, 'change', this.changeCheckbox);
	this.listenTo(this.input, 'change', this.changeInput);
      }
      return this.superRender();
    },

    // state {
    //   values: List of values to place in this box
    //   isViewer: True if this is read-only viewer mode
    //   type: 'node' or 'site' or 'link' or 'none'
    //   disabled: True if this box should be disabled
    // }
    update: function (state)
    {
      if (state)
      {
	var unique = _.unique(state.values);
	if (unique.length === 1)
	{
	  var value = unique[0];
	  var checked = (value !== undefined);
	  if (! checked)
	  {
	    value = '';
	  }
	  var disabled = (state.disabled || state.isViewer)
	  this.checkbox.update({
	    value: checked,
	    disabled: disabled,
	    shown: true,
	    label: this.options.title
	  });
	  this.input.update({
	    value: value,
	    disabled: disabled,
	    shown: checked
	  });
	}
	else
	{
	  this.checkbox.hide();
	  this.input.hide();
	}
      }
    },

    changeCheckbox: function (state)
    {
      if (state.value)
      {
	this.trigger('change', { value: '', data: this.options.data });
      }
      else
      {
	this.trigger('change', { value: undefined, data: this.options.data });
      }
    },

    changeInput: function (state)
    {
      this.trigger('change', { value: state.value, data: this.options.data });
    },

  });

  return OpenflowDisplay;
});

define('js/info/ButtonView',['underscore', 'backbone', 'lib/View'],
function (_, Backbone, View)
{
  

  var ButtonView = View.extend({

    // options {
    //  state: Initial state
    //  data: opque value returned in change event
    // }
    initialize: function (options)
    {
      this.label = null;
      this.disabled = null;
    },

    render: function (el)
    {
      if (! this.rendered)
      {
	this.$el = el || $('<button type="button">');
	this.$el.addClass('btn');
	this.$on('click', this.$el, this.change);
      }
      return this.superRender();
    },

    // state {
    //  label: Button label
    //  disabled: True if button is disabled
    //  shown: True if button is shown
    // }
    update: function (state)
    {
      if (state)
      {
	if (state.label !== undefined && state.label !== null)
	{
	  this.setLabel(state.label);
	}

	if (state.disabled === true)
	{
	  this.disable();
	}
	else if (state.disabled === false)
	{
	  this.enable();
	}

	if (state.shown === true)
	{
	  this.show();
	}
	else if (state.shown === false)
	{
	  this.hide();
	}
      }
    },

    disable: function ()
    {
      if (this.disabled !== true)
      {
	this.$el.attr('disabled', true);
      }
      this.disabled = true;
    },

    enable: function ()
    {
      if (this.disabled !== false)
      {
	this.$el.attr('disabled', false);
      }
      this.disabled = false;
    },

    setLabel: function (label)
    {
      var text = label || '';
      if (text !== this.label)
      {
	this.$el.html(_.escape(text));
      }
      this.label = text;
    },

    change: function (event)
    {
      this.trigger('change', { data: this.options.data });
    }

  });

  return ButtonView;
});

define('js/info/WarningField',['underscore', 'backbone', 'lib/View'],
function (_, Backbone, View)
{
  

  var WarningField = View.extend({

    initialize: function (options)
    {
      this.oldContents = null;
    },

    render: function (el)
    {
      if (! this.rendered)
      {
	this.$el = el || $('<div/>');
	this.warnEl = $('<div class="alert alert-danger" style="display: none; margin-top: 10px" role="alert"></div>')
	  .appendTo(this.$el);
      }
      return this.superRender();
    },

    // state {
    //   values: List of values to place in this box
    //   isViewer: True if this is read-only viewer mode
    //   type: 'node' or 'site' or 'link' or 'none'
    // }
    update: function (state)
    {
      if (state)
      {
	var contents = this.processValues(state.values);
	if (contents !== this.oldContents)
	{
	  this.oldContents = contents;
	  if (contents)
	  {
	    this.$('.alert.alert-danger').show().html(contents);
	  }
	  else
	  {
	    this.$('.alert.alert-danger').hide();
	  }
	}
      }
    },

    processValues: function (values)
    {
      var result = null;
      var warnings = {};
      _.each(values, function (value) {
	_.each(_.keys(value), function (key) {
	  if (value[key])
	  {
	    warnings[key] = true;
	  }
	});
      });
      var keys = _.keys(warnings);
      var hasWarnings = keys.length > 0;
      if (hasWarnings)
      {
	result = '<p><strong>Warning:</strong></p>'
	_.each(keys, function (key) {
	  if (warnings[key])
	  {
	    if (messages[key])
	    {
	      result += '<p>' + messages[key] + '</p>';
	    }
	    else
	    {
	      console.log('Unknown Warning: ' + key);
	    }
	  }
	});
      }
      return result;
    },

  });

  var messages = {
    openflow: 'This LAN has enabled openflow, but has no controller specified.',
    adjacentNode: 'This LAN has settings that may be incompatible with at least one adjacent node.',
    defaultLinkType: 'This LAN has a default link type that may fail. Try setting the link type.',
    duplicateAddress: 'This LAN has an IP address which is duplicated elsewhere.',
    adjacentLink: 'This node has settings that may be incompatible with at least one adjacent LAN.',
    constraintNode: 'This node has settings that may be incompatible with each other or its aggregate.'
  };

  return WarningField;
});

/*
 * Info.js
 *
 * Module for viewing and editing the side info box
 *
 */

define('js/info/Info',['underscore', 'backbone', 'lib/View',
	'js/info/TextField', 'js/info/ReadOnlyField',
	'js/info/ConstrainedField', 'js/info/ToggleField',
	'js/canvas/Constraints', 'js/info/ListManager',
	'js/canvas/InstallDisplay', 'js/canvas/ExecuteDisplay',
	'js/canvas/InterfaceDisplay', 'js/info/OpenflowField',
	'js/info/ButtonView', 'js/info/WarningField'],
function (_, Backbone, View,
	  TextField, ReadOnlyField,
	  ConstrainedField, ToggleField,
	  Constraints, ListManager,
	  InstallDisplay, ExecuteDisplay,
	  InterfaceDisplay, OpenflowField,
	  ButtonView, WarningField)
{
  

/*
  fieldOptions = [
    {
      id: 'logins',
      on: {
	mode: 'node',
	key: 'type',
	value: [],
      },
      type: {
	id: 'span',
	title: 'SSH to',
      },
    },
    {
      id: 'type',
      on: {
	mode: 'node',
      },
      type: {
	type: 'dropdown',
	title: 'Node Type',
	options: [
	]
      }
    },
  ];
*/

  fieldOptions = [
    {
      key: 'name',
      on: 'any',
      type: TextField,
      title: 'Name'
    },
    {
      key: 'logins',
      on: 'node',
      type: ReadOnlyField,
      title: 'SSH to'
    },
    {
      key: 'type',
      on: 'node',
      type: ConstrainedField,
      optionKey: 'types',
      title: 'Node Type'
    },
    {
      key: 'hardware',
      on: 'node',
      type: ConstrainedField,
      optionKey: 'hardware',
      title: 'Hardware Type'
    },
    {
      key: 'image',
      on: 'node',
      type: ConstrainedField,
      optionKey: 'images',
      title: 'Disk Image'
    },
    {
      key: 'nomac',
      on: 'node',
      type: ToggleField,
      title: 'Disable MAC Learning (For OVS Images Only)'
    },
    {
      key: 'routable',
      on: 'node',
      type: ToggleField,
      title: 'Publicly Routable IP'
    },
    {
      key: 'icon',
      on: 'node',
      type: ConstrainedField,
      optionKey: 'icons',
      title: 'Icon'
    },
    {
      key: 'warnings',
      on: 'node',
      type: WarningField,
      title: 'Warning'
    },
    {
      key: 'install',
      on: 'node',
      type: ListManager,
      display: InstallDisplay,
      title: 'Install Scripts'
    },
    {
      key: 'execute',
      on: 'node',
      type: ListManager,
      display: ExecuteDisplay,
      title: 'Execute Scripts'
    },
    {
      key: 'linkType',
      on: 'link',
      type: ConstrainedField,
      optionKey: 'linkTypes',
      title: 'Link Type'
    },
    {
      key: 'nontrivial',
      on: 'link',
      type: ToggleField,
      title: 'Force non-trivial'
    },
    {
      key: 'openflow',
      on: 'link',
      type: OpenflowField,
      title: 'Enable Openflow'
    },
    {
      key: 'sharedvlan',
      on: 'link',
      type: ConstrainedField,
      optionKey: 'sharedvlans',
      title: 'Shared VLan'
    },
    {
      key: 'warnings',
      on: 'link',
      type: WarningField,
      title: 'Warning'
    },
    {
      key: 'urn',
      on: 'site',
      type: ConstrainedField,
      optionKey: 'aggregates',
      title: 'Aggregate'
    },
    {
      key: 'interfaces',
      on: 'link',
      type: ListManager,
      display: InterfaceDisplay,
      title: 'Interfaces'
    },
    {
      key: 'delete',
      on: 'node',
      type: ButtonView,
      label: 'Delete Node'
    },
    {
      key: 'delete',
      on: 'link',
      type: ButtonView,
      label: 'Delete Link'
    },
    {
      key: 'delete',
      on: 'site',
      type: ButtonView,
      label: 'Delete Site'
    },
  ];

  var Info = View.extend({

    // options {
    //   context: Overall context for Jacks
    //   data: Opaque object passed back on change
    // }
    initialize: function (options)
    {
      this.data = options.data;
      this.context = options.context;
      this.constraints = options.constraints;
    },

    render: function (el)
    {
      if (! this.rendered)
      {
	this.$el = el || $('<div/>');
	this.$el.addClass('nodeAttr fromLeft withButtonBar');
	var inner = $('<div/>')
	  .addClass('form-group')
	  .appendTo(this.$el);
	this._each(fieldOptions, function (option) {
	  var current = null;

	  if (option.type === ConstrainedField)
	  {
	    var choices = this.context.canvasOptions[option.optionKey];
	    current = new option.type({
	      data: option,
	      choices: choices,
	      title: option.title,
	      constraints: this.constraints,
	      optionKey: option.optionKey
	    });
	    this.listenTo(current, 'change', this.change);
	  }
	  else if (option.type === ListManager)
	  {
	    current = new option.type({
	      data: option,
	      display: option.display,
	      title: option.title
	    });
	    this.listenTo(current, 'addToList', this.addToList);
	    this.listenTo(current, 'removeFromList', this.removeFromList);
	    this.listenTo(current, 'changeList', this.changeList);
	  }
	  else
	  {
	    current = new option.type({ data: option,
					title: option.title });
	    this.listenTo(current, 'change', this.change);
	  }
	  inner.append(current.render());
	  if (option.key === 'delete')
	  {
	    current.$el.addClass('btn-danger');
	  }
	  this.children.push(current);
	});
      }
      return this.superRender();
    },

    // state {
    //   selection: array of selected items
    //   type: type of selected item
    //   isViewer: True if this is in viewer mode
    // }
    update:  function (state)
    {
		
      if (state)
      {
		var objarr=state.selection[0];
  //  console.log(objarr.id);
//id=objarr.id;
	this._each(this.children, function (field, index) {
	  var option = fieldOptions[index];
	  var disabled = (option.key === 'name' && state.type === 'site');
	  var fieldSelection = [];
	  console.log(this.id);
	  console.log('**************');
	  this._each(state.selection, function (item) {
		  console.log(item[option.key]+"!!!!!!!!!");
		   console.log(item.id);
console.log(item.image);
console.log(item.group);
		  //+","+option.key+","+item.id);
		  id=item.id;
	    fieldSelection.push(item[option.key]);
	  });
	  // Lookup interfaces based on indexes if we are printing them.
	  if (option.key === 'interfaces' && state.selection.length === 1)
	  {
	    fieldSelection = [[]];
	    this._each(state.selection[0].interfaces, function (id) {
	      fieldSelection[0].push(state.model.interfaces[id]);
	    });
	  }
	  var freeform = false;
	  if (state.selection.length === 1 &&
	      state.selection[0].custom[option.key])
	  {
	    freeform = true;
	  }
	  var siteNodeCount = 1;
	  if (state.type === 'site' && state.selection.length === 1)
	  {
	    siteNodeCount = 0;
	    _.each(_.values(state.model.nodes), function (node) {
	      if (node.group === state.selection[0].id)
	      {
		siteNodeCount += 1;
	      }
	    });
	  }
	  var values = fieldSelection;

	  // If the image the user has selected was tagged nomac, then
	  // display the nomac checkbox as checked and disabled.
	  if (option.key === 'nomac' &&
	      state.selection.length === 1 &&
	      state.selection[0].image)
	  {
	    var image = state.selection[0].image;
	    var imageList = state.model.context.canvasOptions.images;
	    //alert(imageList);
	    console.log("pppppppppppppppppppppppppppp");
	    console.log(imageList);
	    console.log(image);
	    
	    console.log("sitesite");
console.log(state.selection);
	    var imageObj = _.findWhere(imageList, { id: image });
	    console.log(imageObj.nomac);
	    if (imageObj && imageObj.nomac)
	    {
	      disabled = true;
	      values = [true];
	    }
	  }
	      
	  if ((option.on === 'any' ||
	       option.on === state.type) &&
	      (option.type !== ListDisplay ||
	       state.selection.length === 1) &&
	      !(option.type === ButtonView && option.key === 'delete' && state.isViewer) &&
	      !(option.type === ButtonView && option.key === 'delete' && option.on === 'site' &&
		siteNodeCount !== 0))
	  {
	    field.update({
	      values: values        ,
	      isViewer: state.isViewer,
	      type: state.type,
	      disabled: disabled,
	      freeform: freeform,
	      model: state.model,
	      selection: state.selection,
	      label: option.label
	    });
	    field.show();
	  }
	  else
	  {
	    field.hide();
	  }
	});

      }
	  
    },

    change: function (state)
    {
		console.log(state.data.key+state.value+$( "#user_slices option:selected" ).text);
		console.log(state);

		//	getItemsList(id,true,state.value);
sitesurn[id]=state.value;
      result = {
	key: state.data.key,
	value: state.value,
	data: this.data
      };
      if (state.data.type === ConstrainedField)
      {
	result.hasFreeform = true;
	result.freeform = state.freeform;
	result.hasVersion = state.hasVersion;
	result.version = state.version;
      }
      this.trigger('change', result);
    },

    addToList: function (state)
    {
      this.trigger('addToList', {
	key: state.data.key,
	item: state.item,
	data: this.data
      });
    },

    removeFromList: function (state)
    {
      this.trigger('removeFromList', {
	key: state.data.key,
	index: state.index,
	data: this.data
      });
    },

    changeList: function (state)
    {
console.log(state);
      this.trigger('changeList', {
	key: state.data.key,
	index: state.index,
	changed: state.changed,
	data: this.data
      });
    }

/*
    show: function (customFields)
    {
      if (this.context.show.selectInfo)
      {
	this.executeDisplay = new ListDisplay({
	  el: root.find('#execute-list'),
	  ItemDisplay: ExecuteDisplay
	});
	this.executeDisplay.on('add', _.bind(this.addExecute, this));
	this.executeDisplay.on('remove', _.bind(this.removeExecute, this));
	this.executeDisplay.on('change', _.bind(this.changeExecute, this));
	this.installDisplay = new ListDisplay({
	  el: root.find('#install-list'),
	  ItemDisplay: InstallDisplay
	});
	this.installDisplay.on('add', _.bind(this.addInstall, this));
	this.installDisplay.on('remove', _.bind(this.removeInstall, this));
	this.installDisplay.on('change', _.bind(this.changeInstall, this));
	this.interfaceDisplay = new ListDisplay({
	  el: root.find('#interface-list'),
	  ItemDisplay: InterfaceDisplay
	});
	this.interfaceDisplay.on('change', _.bind(this.changeInterface, this));
      }
    },

    update: function (selection, selectionType)
    {
    },


    handleOpenflowChange: function (event)
    {
      if (this.domRoot.find('#openflowControl').prop('checked'))
      {
	this.domRoot.find('#openflowField').show();
      }
      else
      {
	this.domRoot.find('#openflowField').hide();
	this.topoData.changeAttribute(this.highlights, 'openflow',
				      undefined, this.lastHighlightType);
      }
    },

    handleRoutableChange: function (event)
    {
      var isRoutable = false;
      if (this.domRoot.find('#routableControl').prop('checked'))
      {
	isRoutable = true;
      }
      this.topoData.changeAttribute(this.highlights, 'routable',
				    isRoutable, this.lastHighlightType);
    },

    bindAttribute: function (that, selector, field, optionList, allowCustom)
    {
      var dom = that.domRoot.find(selector);
      if (optionList)
      {
	if (allowCustom)
	{
	  dom = that.domRoot.find(selector).find('.dropdown');
	}
	dom.change(function (event) {
	  var value = undefined;
	  if (event.val !== '(any)')
	  {
	    value = _.where(optionList,
			    { name: event.val })[0].id;
	  }
	  that.topoData.changeAttribute(that.highlights, field, value,
					that.lastHighlightType);
	  if (field === 'image')
	  {
	    var versionValue = undefined;
	    if (event.val !== '(any)')
	    {
	      versionValue = _.findWhere(optionList,
					 { name: event.val }).version;
	    }
	    that.topoData.changeAttribute(that.highlights, 'imageVersion',
					  versionValue,
					  that.lastHighlightType);
	  }
	  that.showAttributes();
	});
      }
      if (allowCustom)
      {
	dom = that.domRoot.find(selector).find('.checkbox');
	
	dom.change(function () {
	  var isCustom = false;
	  if (that.domRoot.find(selector).find('.checkbox').prop('checked'))
	  {
	    isCustom = true;
	  }
	  var item = that.topoData.getType(that.lastHighlightType)[that.highlights[0]];
	  var custom = item.custom;
	  custom[field] = isCustom;
	  that.topoData.changeAttribute(that.highlights, 'custom',
					custom, that.lastHighlightType);
	  that.showAttributes();
	});
	
	dom = that.domRoot.find(selector).find('.custom');
      }
      if (! optionList || allowCustom)
      {
	dom.on('change keyup paste', function () {
	  var value = dom.val();
	  that.topoData.changeAttribute(that.highlights, field, value,
					that.lastHighlightType);
	  that.showAttributes();
	});
      }
    }
*/

  });

  return Info;
});

define('js/canvas/ErrorModal',['underscore', 'backbone', 'lib/View'],
function (_, Backbone, View)
{
  

  var ErrorModal = View.extend({

    initialize: function (options)
    {
    },

    render: function (el)
    {
      if (! this.rendered)
      {
	this.$el = el || $('#error-modal');
      }
      return this.superRender();
    },

    // state {
    //   title: Text for title
    //   contents: Text for display
    //   verbatim: True if you don't want the contents and title escaped
    // }
    // Displays the modal on every update
    update: function (state)
    {
console.log("update");
      if (state)
      {

	var title = state.title;
	var contents = state.contents;
	if (! state.verbatim)
	{
	  title = _.escape(title);
	  contents = _.escape(contents);
	}
	this.$('.modal-title').html(title);
	this.$('.modal-contents').html(contents);
	this.$el.modal('show');
      }
    }

  });

  return ErrorModal;
});


define('text!html/Canvas.html',[],function () { return '<div class="modal fade" id="error-modal">\r\n  <div class="modal-dialog">\r\n    <div class="modal-content">\r\n      <div class="modal-header">\r\n\t<button type="button" class="close" data-dismiss="modal"\r\n\t\taria-label="Close">\r\n\t  <span aria-hidden="true">&times;</span>\r\n\t</button>\r\n\t<h4 class="modal-title"></h4>\r\n      </div>\r\n      <div class="modal-body">\r\n\t<p class="modal-contents"></p>\r\n      </div>\r\n      <div class="modal-footer">\r\n\t<button type="button" class="btn btn-default"\r\n\t\tdata-dismiss="modal">Close</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<div id="topoButtons" class="viewer hidden">\r\n  <button id="fbTour" class="btn btn-default">\r\n    Slice Tour\r\n  </button>\r\n  <button id="fbSlice" class="btn btn-primary">\r\n    Switch Slice\r\n  </button>\r\n  <button id="fbRspec" class="btn btn-primary">\r\n    View Rspec\r\n  </button>\r\n</div>\r\n<div id="topoButtons" class="editor hidden">\r\n  <!--<button id="fbcTour" class="btn btn-primary pull-right">\r\n    Edit Tour\r\n  </button>-->\r\n  <div id="fbcSite" class="pull-right"></div>\r\n <button id="fbcRspec" class="btn btn-primary pull-right">\r\n    View Rspec\r\n  </button>\r\n</div>\r\n<div id="leftNav">\r\n  <div style="display: none; visibility: hidden" class="navSlices fromLeft withButtonBar">\r\n    <div class="panel panel-default">\r\n      <div class="panel-body">\r\n        <div class="panel-heading">\r\n          <h3 class="panel-title">Select Slice</h3>\r\n        </div>\r\n        <div class="panel-body">\r\n          <div class="form-group">\r\n            <div id="lnSliceList" class="list-group"></div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class="navRspec fromBottom">\r\n    <div class="panel panel-default">\r\n      <div class="panel-body">\r\n\t<button id="hideRspec" type="button" class="close">\r\n\t  <span aria-hidden="true">&times;</span>\r\n\t  <span class="sr-only">Close</span>\r\n\t</button>\r\n        <div class="form-group">\r\n          <div id="lnRspec">\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div style="display: none;  visibility: hidden" class="navTopo fromRight">\r\n    <div class="panel panel-default">\r\n      <div class="panel-body">\r\n        <div id="addNodeList" class="form-group">\r\n          <!--<div id="lnTopo" class="lnLink">\r\n            <image id="node-source" class="nodebox" x="-30px" y="-30px" width="70px" height="45px">\r\n            <span>Add VM</span>\r\n          </div>-->\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div id="viewer-default" class="navTopo" style="display: none">\r\n    <h1>Click Node to Select</h1>\r\n  </div>\r\n\r\n  <div class="closeContainer fromLeft withButtonBar">\r\n    <button id="hideLeftPane" class="close" type="button">\r\n      <span aria-hidden="true">x</span>\r\n      <span class="sr-only">Close</span>\r\n    </button>\r\n  </div>\r\n\r\n  <div class="nodeAttr fromLeft withButtonBar">\r\n<!--\r\n    <div class="panel panel-default">\r\n      <div class="panel-body">\r\n-->\r\n<!--\r\n          <div class="form-group">\r\n\t    <div class="naNameGroup">\r\n              <h4>Name</h4>\r\n              <input type="text" class="form-control" id="naName" value="">\r\n\t    </div>\r\n\t    <div class="naLoginGroup">\r\n\t      <strong>SSH to</strong> <span id="#loginHost"></span>\r\n\t    </div>\r\n\t    <div class="naNodeType">\r\n\t      <h4>Node Type</h4>\r\n\t      <input type="hidden" id="naTypes" class="form-control dropdown">\r\n\t      <div class="checkboxContainer"><input class="checkbox" type="checkbox"> <span class="checkboxLabel">Custom Type</span></div>\r\n\t      <input type="text" class="form-control custom">\r\n\t    </div>\r\n\t    <div class="naHardwareType">\r\n\t      <h4>Hardware Type</h4>\r\n\t      <input type="hidden" id="naHardwares" class="form-control dropdown">\r\n\t      <div class="checkboxContainer"><input class="checkbox" type="checkbox"> <span class="checkboxLabel">Custom Hardware</span></div>\r\n\t      <input type="text" class="form-control custom">\r\n\t    </div>\r\n            <div class="naImageGroup">\r\n              <h4>Disk Image</h4>\r\n              <input type="hidden" id="naImages" class="form-control dropdown">\r\n\t      <div class="checkboxContainer"><input class="checkbox" type="checkbox"> <span class="checkboxLabel">Custom Disk Image</span></div>\r\n\t      <input type="text" class="form-control custom">\r\n\t      <input type="text" class="form-control customVersion"\r\n\t\t     placeholder="Version (for ExoGENI Images)">\r\n            </div>\r\n\t    <div class="naInstallGroup">\r\n\t      <hr>\r\n\t      <h4>Install Scripts</h4>\r\n\t      <div id="install-list">\r\n\t\t<ul class="list"></ul>\r\n\t\t<button class="btn btn-success" id="add">Add</button>\r\n\t      </div>\r\n\t    </div>\r\n\t    <div class="naExecuteGroup">\r\n\t      <hr>\r\n\t      <h4>Execute Scripts</h4>\r\n\t      <div id="execute-list">\r\n\t\t<ul class="list"></ul>\r\n\t\t<button class="btn btn-success" id="add">Add</button>\r\n\t      </div>\r\n\t    </div>\r\n\t    <div class="naRoutableGroup">\r\n\t      <hr><div class="checkboxContainer">\r\n\t      <input id="routableControl" type="checkbox"> <span class="checkboxLabel">Publicly Routable IP</span></div>\r\n\t    </div>\r\n\t    <div class="naLinkTypeGroup">\r\n\t      <h4>Link Type</h4>\r\n              <input type="hidden" id="naLinkType" class="form-control dropdown">\r\n\t      <div class="checkboxContainer"><input class="checkbox" type="checkbox"> <span class="checkboxLabel">Custom Link Type</span></div>\r\n\t      <input type="text" class="form-control custom">\r\n\t    </div>\r\n\t    <div class="naOpenflowGroup">\r\n\t      <div class="checkboxContainer"><input id="openflowControl" type="checkbox"> <span class="checkboxLabel">Enable Openflow</span></div>\r\n\t      <div id="openflowField">\r\n\t\t<h4>Controller URL (required)</h4>\r\n\t\t<input type="text" class="form-control"\r\n\t\t       id="naOpenflow" value=""\r\n\t\t       placeholder="ex: tcp:10.11.12.13:8000">\r\n\t      </div>\r\n\t    </div>\r\n\t    <div class="naSharedVLanGroup">\r\n\t      <h4>Shared VLan</h4>\r\n\t      <input type="hidden" id="naSharedVLan" class="form-control dropdown">\r\n\t      <div class="checkboxContainer"><input class="checkbox" type="checkbox"> <span class="checkboxLabel">Custom Shared VLan</span></div>\r\n\t      <input type="text" class="form-control custom">\r\n\t    </div>\r\n\t    <div class="naAggregateUrnGroup">\r\n\t      <h4>Aggregate</h4>\r\n\t      <input type="hidden" id="naAggregateUrn" class="form-control dropdown">\r\n\t      <div class="checkboxContainer"><input class="checkbox" type="checkbox"> <span class="checkboxLabel">Custom Aggregate</span></div>\r\n\t      <input type="text" class="form-control custom">\r\n\t    </div>\r\n\t    <div class="naInterfaceGroup">\r\n\t      <hr>\r\n\t      <h4>Interfaces</h4>\r\n\t      <div id="interface-list">\r\n\t\t<ul class="list"></ul>\r\n\t      </div>\r\n\t    </div>\r\n\t    <div class="naIconGroup">\r\n\t      <h4>Icon</h4>\r\n\t      <input type="hidden" id="naIcon" class="form-control dropdown">\r\n\t      <div class="checkboxContainer"><input class="checkbox" type="checkbox"> <span class="checkboxLabel">Custom Icon</span></div>\r\n\t      <input type="text" class="form-control custom">\r\n\t    </div>\r\n-->\r\n<!--\r\n\t    <div class="naLatencyGroup">\r\n\t      <h4>Latency (ms)</h4>\r\n              <input type="text" class="form-control"\r\n\t\t     id="naLatency" value=""\r\n\t\t     placeholder="ex: 100"\r\n\t\t     title="Latency is the number of ms of delay"\r\n\t\t     pattern="[0-9]*[.]?[0-9]+">\r\n\t    </div>\r\n\t    <div class="naBandwidthGroup">\r\n\t      <h4>Bandwidth (kbps)</h4>\r\n              <input type="text" class="form-control"\r\n\t\t     id="naBandwidth" value=""\r\n\t\t     placeholder="ex: 10000"\r\n\t\t     title="Bandwidth is the number of kbps required"\r\n\t\t     pattern="[0-9]*[.]?[0-9]+">\r\n\t    </div>\r\n\t    <div class="naLossGroup">\r\n\t      <h4>Loss (0.0-1.0)</h4>\r\n              <input type="text" class="form-control"\r\n\t\t     id="naLoss" value=""\r\n\t\t     placeholder="ex: 0.03"\r\n\t\t     title="Loss should be a proportion between 0 and 1"\r\n\t\t     pattern="[0-9]*[.]?[0-9]+">\r\n\t    </div>\r\n-->\r\n<!--\r\n            <hr>\r\n            <button type="button" id="naDelete" class="btn btn-danger pull-right">\r\n              Delete\r\n            </button>\r\n          </div>\r\n-->\r\n<!--\r\n      </div>\r\n    </div>\r\n-->\r\n  </div>\r\n\r\n  <div id="versionNumber">v1.6</div>\r\n</div>\r\n<div id="topoContainer" class="withButtonBar showLeft"></div>\r\n';});


define('text!html/AddNode.html',[],function () { return '<div class="lnNode">\r\n  <image class="nodebox" x="-30px" y="-30px" width="70px" height="45px"\r\n\t src="<%- icon %>">\r\n  <span><%- name %></span>\r\n</div>\r\n';});

/*
Copyright 2012 Igor Vaynberg

Version: 3.5.0 Timestamp: Mon Jun 16 19:29:44 EDT 2014

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

    http://www.apache.org/licenses/LICENSE-2.0
    http://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the
Apache License or the GPL License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the Apache License and the GPL License for
the specific language governing permissions and limitations under the Apache License and the GPL License.
*/
(function ($) {
    if(typeof $.fn.each2 == "undefined") {
        $.extend($.fn, {
            /*
            * 4-10 times faster .each replacement
            * use it carefully, as it overrides jQuery context of element on each iteration
            */
            each2 : function (c) {
                var j = $([0]), i = -1, l = this.length;
                while (
                    ++i < l
                    && (j.context = j[0] = this[i])
                    && c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object
                );
                return this;
            }
        });
    }
})(jQuery);

(function ($, undefined) {
    
    /*global document, window, jQuery, console */

    if (window.Select2 !== undefined) {
        return;
    }

    var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer,
        lastMousePosition={x:0,y:0}, $document, scrollBarDimensions,

    KEY = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46,
        isArrow: function (k) {
            k = k.which ? k.which : k;
            switch (k) {
            case KEY.LEFT:
            case KEY.RIGHT:
            case KEY.UP:
            case KEY.DOWN:
                return true;
            }
            return false;
        },
        isControl: function (e) {
            var k = e.which;
            switch (k) {
            case KEY.SHIFT:
            case KEY.CTRL:
            case KEY.ALT:
                return true;
            }

            if (e.metaKey) return true;

            return false;
        },
        isFunctionKey: function (k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        }
    },
    MEASURE_SCROLLBAR_TEMPLATE = "<div class='select2-measure-scrollbar'></div>",

    DIACRITICS = {"\u24B6":"A","\uFF21":"A","\u00C0":"A","\u00C1":"A","\u00C2":"A","\u1EA6":"A","\u1EA4":"A","\u1EAA":"A","\u1EA8":"A","\u00C3":"A","\u0100":"A","\u0102":"A","\u1EB0":"A","\u1EAE":"A","\u1EB4":"A","\u1EB2":"A","\u0226":"A","\u01E0":"A","\u00C4":"A","\u01DE":"A","\u1EA2":"A","\u00C5":"A","\u01FA":"A","\u01CD":"A","\u0200":"A","\u0202":"A","\u1EA0":"A","\u1EAC":"A","\u1EB6":"A","\u1E00":"A","\u0104":"A","\u023A":"A","\u2C6F":"A","\uA732":"AA","\u00C6":"AE","\u01FC":"AE","\u01E2":"AE","\uA734":"AO","\uA736":"AU","\uA738":"AV","\uA73A":"AV","\uA73C":"AY","\u24B7":"B","\uFF22":"B","\u1E02":"B","\u1E04":"B","\u1E06":"B","\u0243":"B","\u0182":"B","\u0181":"B","\u24B8":"C","\uFF23":"C","\u0106":"C","\u0108":"C","\u010A":"C","\u010C":"C","\u00C7":"C","\u1E08":"C","\u0187":"C","\u023B":"C","\uA73E":"C","\u24B9":"D","\uFF24":"D","\u1E0A":"D","\u010E":"D","\u1E0C":"D","\u1E10":"D","\u1E12":"D","\u1E0E":"D","\u0110":"D","\u018B":"D","\u018A":"D","\u0189":"D","\uA779":"D","\u01F1":"DZ","\u01C4":"DZ","\u01F2":"Dz","\u01C5":"Dz","\u24BA":"E","\uFF25":"E","\u00C8":"E","\u00C9":"E","\u00CA":"E","\u1EC0":"E","\u1EBE":"E","\u1EC4":"E","\u1EC2":"E","\u1EBC":"E","\u0112":"E","\u1E14":"E","\u1E16":"E","\u0114":"E","\u0116":"E","\u00CB":"E","\u1EBA":"E","\u011A":"E","\u0204":"E","\u0206":"E","\u1EB8":"E","\u1EC6":"E","\u0228":"E","\u1E1C":"E","\u0118":"E","\u1E18":"E","\u1E1A":"E","\u0190":"E","\u018E":"E","\u24BB":"F","\uFF26":"F","\u1E1E":"F","\u0191":"F","\uA77B":"F","\u24BC":"G","\uFF27":"G","\u01F4":"G","\u011C":"G","\u1E20":"G","\u011E":"G","\u0120":"G","\u01E6":"G","\u0122":"G","\u01E4":"G","\u0193":"G","\uA7A0":"G","\uA77D":"G","\uA77E":"G","\u24BD":"H","\uFF28":"H","\u0124":"H","\u1E22":"H","\u1E26":"H","\u021E":"H","\u1E24":"H","\u1E28":"H","\u1E2A":"H","\u0126":"H","\u2C67":"H","\u2C75":"H","\uA78D":"H","\u24BE":"I","\uFF29":"I","\u00CC":"I","\u00CD":"I","\u00CE":"I","\u0128":"I","\u012A":"I","\u012C":"I","\u0130":"I","\u00CF":"I","\u1E2E":"I","\u1EC8":"I","\u01CF":"I","\u0208":"I","\u020A":"I","\u1ECA":"I","\u012E":"I","\u1E2C":"I","\u0197":"I","\u24BF":"J","\uFF2A":"J","\u0134":"J","\u0248":"J","\u24C0":"K","\uFF2B":"K","\u1E30":"K","\u01E8":"K","\u1E32":"K","\u0136":"K","\u1E34":"K","\u0198":"K","\u2C69":"K","\uA740":"K","\uA742":"K","\uA744":"K","\uA7A2":"K","\u24C1":"L","\uFF2C":"L","\u013F":"L","\u0139":"L","\u013D":"L","\u1E36":"L","\u1E38":"L","\u013B":"L","\u1E3C":"L","\u1E3A":"L","\u0141":"L","\u023D":"L","\u2C62":"L","\u2C60":"L","\uA748":"L","\uA746":"L","\uA780":"L","\u01C7":"LJ","\u01C8":"Lj","\u24C2":"M","\uFF2D":"M","\u1E3E":"M","\u1E40":"M","\u1E42":"M","\u2C6E":"M","\u019C":"M","\u24C3":"N","\uFF2E":"N","\u01F8":"N","\u0143":"N","\u00D1":"N","\u1E44":"N","\u0147":"N","\u1E46":"N","\u0145":"N","\u1E4A":"N","\u1E48":"N","\u0220":"N","\u019D":"N","\uA790":"N","\uA7A4":"N","\u01CA":"NJ","\u01CB":"Nj","\u24C4":"O","\uFF2F":"O","\u00D2":"O","\u00D3":"O","\u00D4":"O","\u1ED2":"O","\u1ED0":"O","\u1ED6":"O","\u1ED4":"O","\u00D5":"O","\u1E4C":"O","\u022C":"O","\u1E4E":"O","\u014C":"O","\u1E50":"O","\u1E52":"O","\u014E":"O","\u022E":"O","\u0230":"O","\u00D6":"O","\u022A":"O","\u1ECE":"O","\u0150":"O","\u01D1":"O","\u020C":"O","\u020E":"O","\u01A0":"O","\u1EDC":"O","\u1EDA":"O","\u1EE0":"O","\u1EDE":"O","\u1EE2":"O","\u1ECC":"O","\u1ED8":"O","\u01EA":"O","\u01EC":"O","\u00D8":"O","\u01FE":"O","\u0186":"O","\u019F":"O","\uA74A":"O","\uA74C":"O","\u01A2":"OI","\uA74E":"OO","\u0222":"OU","\u24C5":"P","\uFF30":"P","\u1E54":"P","\u1E56":"P","\u01A4":"P","\u2C63":"P","\uA750":"P","\uA752":"P","\uA754":"P","\u24C6":"Q","\uFF31":"Q","\uA756":"Q","\uA758":"Q","\u024A":"Q","\u24C7":"R","\uFF32":"R","\u0154":"R","\u1E58":"R","\u0158":"R","\u0210":"R","\u0212":"R","\u1E5A":"R","\u1E5C":"R","\u0156":"R","\u1E5E":"R","\u024C":"R","\u2C64":"R","\uA75A":"R","\uA7A6":"R","\uA782":"R","\u24C8":"S","\uFF33":"S","\u1E9E":"S","\u015A":"S","\u1E64":"S","\u015C":"S","\u1E60":"S","\u0160":"S","\u1E66":"S","\u1E62":"S","\u1E68":"S","\u0218":"S","\u015E":"S","\u2C7E":"S","\uA7A8":"S","\uA784":"S","\u24C9":"T","\uFF34":"T","\u1E6A":"T","\u0164":"T","\u1E6C":"T","\u021A":"T","\u0162":"T","\u1E70":"T","\u1E6E":"T","\u0166":"T","\u01AC":"T","\u01AE":"T","\u023E":"T","\uA786":"T","\uA728":"TZ","\u24CA":"U","\uFF35":"U","\u00D9":"U","\u00DA":"U","\u00DB":"U","\u0168":"U","\u1E78":"U","\u016A":"U","\u1E7A":"U","\u016C":"U","\u00DC":"U","\u01DB":"U","\u01D7":"U","\u01D5":"U","\u01D9":"U","\u1EE6":"U","\u016E":"U","\u0170":"U","\u01D3":"U","\u0214":"U","\u0216":"U","\u01AF":"U","\u1EEA":"U","\u1EE8":"U","\u1EEE":"U","\u1EEC":"U","\u1EF0":"U","\u1EE4":"U","\u1E72":"U","\u0172":"U","\u1E76":"U","\u1E74":"U","\u0244":"U","\u24CB":"V","\uFF36":"V","\u1E7C":"V","\u1E7E":"V","\u01B2":"V","\uA75E":"V","\u0245":"V","\uA760":"VY","\u24CC":"W","\uFF37":"W","\u1E80":"W","\u1E82":"W","\u0174":"W","\u1E86":"W","\u1E84":"W","\u1E88":"W","\u2C72":"W","\u24CD":"X","\uFF38":"X","\u1E8A":"X","\u1E8C":"X","\u24CE":"Y","\uFF39":"Y","\u1EF2":"Y","\u00DD":"Y","\u0176":"Y","\u1EF8":"Y","\u0232":"Y","\u1E8E":"Y","\u0178":"Y","\u1EF6":"Y","\u1EF4":"Y","\u01B3":"Y","\u024E":"Y","\u1EFE":"Y","\u24CF":"Z","\uFF3A":"Z","\u0179":"Z","\u1E90":"Z","\u017B":"Z","\u017D":"Z","\u1E92":"Z","\u1E94":"Z","\u01B5":"Z","\u0224":"Z","\u2C7F":"Z","\u2C6B":"Z","\uA762":"Z","\u24D0":"a","\uFF41":"a","\u1E9A":"a","\u00E0":"a","\u00E1":"a","\u00E2":"a","\u1EA7":"a","\u1EA5":"a","\u1EAB":"a","\u1EA9":"a","\u00E3":"a","\u0101":"a","\u0103":"a","\u1EB1":"a","\u1EAF":"a","\u1EB5":"a","\u1EB3":"a","\u0227":"a","\u01E1":"a","\u00E4":"a","\u01DF":"a","\u1EA3":"a","\u00E5":"a","\u01FB":"a","\u01CE":"a","\u0201":"a","\u0203":"a","\u1EA1":"a","\u1EAD":"a","\u1EB7":"a","\u1E01":"a","\u0105":"a","\u2C65":"a","\u0250":"a","\uA733":"aa","\u00E6":"ae","\u01FD":"ae","\u01E3":"ae","\uA735":"ao","\uA737":"au","\uA739":"av","\uA73B":"av","\uA73D":"ay","\u24D1":"b","\uFF42":"b","\u1E03":"b","\u1E05":"b","\u1E07":"b","\u0180":"b","\u0183":"b","\u0253":"b","\u24D2":"c","\uFF43":"c","\u0107":"c","\u0109":"c","\u010B":"c","\u010D":"c","\u00E7":"c","\u1E09":"c","\u0188":"c","\u023C":"c","\uA73F":"c","\u2184":"c","\u24D3":"d","\uFF44":"d","\u1E0B":"d","\u010F":"d","\u1E0D":"d","\u1E11":"d","\u1E13":"d","\u1E0F":"d","\u0111":"d","\u018C":"d","\u0256":"d","\u0257":"d","\uA77A":"d","\u01F3":"dz","\u01C6":"dz","\u24D4":"e","\uFF45":"e","\u00E8":"e","\u00E9":"e","\u00EA":"e","\u1EC1":"e","\u1EBF":"e","\u1EC5":"e","\u1EC3":"e","\u1EBD":"e","\u0113":"e","\u1E15":"e","\u1E17":"e","\u0115":"e","\u0117":"e","\u00EB":"e","\u1EBB":"e","\u011B":"e","\u0205":"e","\u0207":"e","\u1EB9":"e","\u1EC7":"e","\u0229":"e","\u1E1D":"e","\u0119":"e","\u1E19":"e","\u1E1B":"e","\u0247":"e","\u025B":"e","\u01DD":"e","\u24D5":"f","\uFF46":"f","\u1E1F":"f","\u0192":"f","\uA77C":"f","\u24D6":"g","\uFF47":"g","\u01F5":"g","\u011D":"g","\u1E21":"g","\u011F":"g","\u0121":"g","\u01E7":"g","\u0123":"g","\u01E5":"g","\u0260":"g","\uA7A1":"g","\u1D79":"g","\uA77F":"g","\u24D7":"h","\uFF48":"h","\u0125":"h","\u1E23":"h","\u1E27":"h","\u021F":"h","\u1E25":"h","\u1E29":"h","\u1E2B":"h","\u1E96":"h","\u0127":"h","\u2C68":"h","\u2C76":"h","\u0265":"h","\u0195":"hv","\u24D8":"i","\uFF49":"i","\u00EC":"i","\u00ED":"i","\u00EE":"i","\u0129":"i","\u012B":"i","\u012D":"i","\u00EF":"i","\u1E2F":"i","\u1EC9":"i","\u01D0":"i","\u0209":"i","\u020B":"i","\u1ECB":"i","\u012F":"i","\u1E2D":"i","\u0268":"i","\u0131":"i","\u24D9":"j","\uFF4A":"j","\u0135":"j","\u01F0":"j","\u0249":"j","\u24DA":"k","\uFF4B":"k","\u1E31":"k","\u01E9":"k","\u1E33":"k","\u0137":"k","\u1E35":"k","\u0199":"k","\u2C6A":"k","\uA741":"k","\uA743":"k","\uA745":"k","\uA7A3":"k","\u24DB":"l","\uFF4C":"l","\u0140":"l","\u013A":"l","\u013E":"l","\u1E37":"l","\u1E39":"l","\u013C":"l","\u1E3D":"l","\u1E3B":"l","\u017F":"l","\u0142":"l","\u019A":"l","\u026B":"l","\u2C61":"l","\uA749":"l","\uA781":"l","\uA747":"l","\u01C9":"lj","\u24DC":"m","\uFF4D":"m","\u1E3F":"m","\u1E41":"m","\u1E43":"m","\u0271":"m","\u026F":"m","\u24DD":"n","\uFF4E":"n","\u01F9":"n","\u0144":"n","\u00F1":"n","\u1E45":"n","\u0148":"n","\u1E47":"n","\u0146":"n","\u1E4B":"n","\u1E49":"n","\u019E":"n","\u0272":"n","\u0149":"n","\uA791":"n","\uA7A5":"n","\u01CC":"nj","\u24DE":"o","\uFF4F":"o","\u00F2":"o","\u00F3":"o","\u00F4":"o","\u1ED3":"o","\u1ED1":"o","\u1ED7":"o","\u1ED5":"o","\u00F5":"o","\u1E4D":"o","\u022D":"o","\u1E4F":"o","\u014D":"o","\u1E51":"o","\u1E53":"o","\u014F":"o","\u022F":"o","\u0231":"o","\u00F6":"o","\u022B":"o","\u1ECF":"o","\u0151":"o","\u01D2":"o","\u020D":"o","\u020F":"o","\u01A1":"o","\u1EDD":"o","\u1EDB":"o","\u1EE1":"o","\u1EDF":"o","\u1EE3":"o","\u1ECD":"o","\u1ED9":"o","\u01EB":"o","\u01ED":"o","\u00F8":"o","\u01FF":"o","\u0254":"o","\uA74B":"o","\uA74D":"o","\u0275":"o","\u01A3":"oi","\u0223":"ou","\uA74F":"oo","\u24DF":"p","\uFF50":"p","\u1E55":"p","\u1E57":"p","\u01A5":"p","\u1D7D":"p","\uA751":"p","\uA753":"p","\uA755":"p","\u24E0":"q","\uFF51":"q","\u024B":"q","\uA757":"q","\uA759":"q","\u24E1":"r","\uFF52":"r","\u0155":"r","\u1E59":"r","\u0159":"r","\u0211":"r","\u0213":"r","\u1E5B":"r","\u1E5D":"r","\u0157":"r","\u1E5F":"r","\u024D":"r","\u027D":"r","\uA75B":"r","\uA7A7":"r","\uA783":"r","\u24E2":"s","\uFF53":"s","\u00DF":"s","\u015B":"s","\u1E65":"s","\u015D":"s","\u1E61":"s","\u0161":"s","\u1E67":"s","\u1E63":"s","\u1E69":"s","\u0219":"s","\u015F":"s","\u023F":"s","\uA7A9":"s","\uA785":"s","\u1E9B":"s","\u24E3":"t","\uFF54":"t","\u1E6B":"t","\u1E97":"t","\u0165":"t","\u1E6D":"t","\u021B":"t","\u0163":"t","\u1E71":"t","\u1E6F":"t","\u0167":"t","\u01AD":"t","\u0288":"t","\u2C66":"t","\uA787":"t","\uA729":"tz","\u24E4":"u","\uFF55":"u","\u00F9":"u","\u00FA":"u","\u00FB":"u","\u0169":"u","\u1E79":"u","\u016B":"u","\u1E7B":"u","\u016D":"u","\u00FC":"u","\u01DC":"u","\u01D8":"u","\u01D6":"u","\u01DA":"u","\u1EE7":"u","\u016F":"u","\u0171":"u","\u01D4":"u","\u0215":"u","\u0217":"u","\u01B0":"u","\u1EEB":"u","\u1EE9":"u","\u1EEF":"u","\u1EED":"u","\u1EF1":"u","\u1EE5":"u","\u1E73":"u","\u0173":"u","\u1E77":"u","\u1E75":"u","\u0289":"u","\u24E5":"v","\uFF56":"v","\u1E7D":"v","\u1E7F":"v","\u028B":"v","\uA75F":"v","\u028C":"v","\uA761":"vy","\u24E6":"w","\uFF57":"w","\u1E81":"w","\u1E83":"w","\u0175":"w","\u1E87":"w","\u1E85":"w","\u1E98":"w","\u1E89":"w","\u2C73":"w","\u24E7":"x","\uFF58":"x","\u1E8B":"x","\u1E8D":"x","\u24E8":"y","\uFF59":"y","\u1EF3":"y","\u00FD":"y","\u0177":"y","\u1EF9":"y","\u0233":"y","\u1E8F":"y","\u00FF":"y","\u1EF7":"y","\u1E99":"y","\u1EF5":"y","\u01B4":"y","\u024F":"y","\u1EFF":"y","\u24E9":"z","\uFF5A":"z","\u017A":"z","\u1E91":"z","\u017C":"z","\u017E":"z","\u1E93":"z","\u1E95":"z","\u01B6":"z","\u0225":"z","\u0240":"z","\u2C6C":"z","\uA763":"z","\u0386":"\u0391","\u0388":"\u0395","\u0389":"\u0397","\u038A":"\u0399","\u03AA":"\u0399","\u038C":"\u039F","\u038E":"\u03A5","\u03AB":"\u03A5","\u038F":"\u03A9","\u03AC":"\u03B1","\u03AD":"\u03B5","\u03AE":"\u03B7","\u03AF":"\u03B9","\u03CA":"\u03B9","\u0390":"\u03B9","\u03CC":"\u03BF","\u03CD":"\u03C5","\u03CB":"\u03C5","\u03B0":"\u03C5","\u03C9":"\u03C9","\u03C2":"\u03C3"};

    $document = $(document);

    nextUid=(function() { var counter=1; return function() { return counter++; }; }());


    function reinsertElement(element) {
        var placeholder = $(document.createTextNode(''));

        element.before(placeholder);
        placeholder.before(element);
        placeholder.remove();
    }

    function stripDiacritics(str) {
        // Used 'uni range + named function' from http://jsperf.com/diacritics/18
        function match(a) {
            return DIACRITICS[a] || a;
        }

        return str.replace(/[^\u0000-\u007E]/g, match);
    }

    function indexOf(value, array) {
        var i = 0, l = array.length;
        for (; i < l; i = i + 1) {
            if (equal(value, array[i])) return i;
        }
        return -1;
    }

    function measureScrollbar () {
        var $template = $( MEASURE_SCROLLBAR_TEMPLATE );
        $template.appendTo('body');

        var dim = {
            width: $template.width() - $template[0].clientWidth,
            height: $template.height() - $template[0].clientHeight
        };
        $template.remove();

        return dim;
    }

    /**
     * Compares equality of a and b
     * @param a
     * @param b
     */
    function equal(a, b) {
        if (a === b) return true;
        if (a === undefined || b === undefined) return false;
        if (a === null || b === null) return false;
        // Check whether 'a' or 'b' is a string (primitive or object).
        // The concatenation of an empty string (+'') converts its argument to a string's primitive.
        if (a.constructor === String) return a+'' === b+''; // a+'' - in case 'a' is a String object
        if (b.constructor === String) return b+'' === a+''; // b+'' - in case 'b' is a String object
        return false;
    }

    /**
     * Splits the string into an array of values, trimming each value. An empty array is returned for nulls or empty
     * strings
     * @param string
     * @param separator
     */
    function splitVal(string, separator) {
        var val, i, l;
        if (string === null || string.length < 1) return [];
        val = string.split(separator);
        for (i = 0, l = val.length; i < l; i = i + 1) val[i] = $.trim(val[i]);
        return val;
    }

    function getSideBorderPadding(element) {
        return element.outerWidth(false) - element.width();
    }

    function installKeyUpChangeEvent(element) {
        var key="keyup-change-value";
        element.on("keydown", function () {
            if ($.data(element, key) === undefined) {
                $.data(element, key, element.val());
            }
        });
        element.on("keyup", function () {
            var val= $.data(element, key);
            if (val !== undefined && element.val() !== val) {
                $.removeData(element, key);
                element.trigger("keyup-change");
            }
        });
    }


    /**
     * filters mouse events so an event is fired only if the mouse moved.
     *
     * filters out mouse events that occur when mouse is stationary but
     * the elements under the pointer are scrolled.
     */
    function installFilteredMouseMove(element) {
        element.on("mousemove", function (e) {
            var lastpos = lastMousePosition;
            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    }

    /**
     * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
     * within the last quietMillis milliseconds.
     *
     * @param quietMillis number of milliseconds to wait before invoking fn
     * @param fn function to be debounced
     * @param ctx object to be used as this reference within fn
     * @return debounced version of fn
     */
    function debounce(quietMillis, fn, ctx) {
        ctx = ctx || undefined;
        var timeout;
        return function () {
            var args = arguments;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function() {
                fn.apply(ctx, args);
            }, quietMillis);
        };
    }

    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});
        element.on("scroll", function (e) {
            if (indexOf(e.target, element.get()) >= 0) notify(e);
        });
    }

    function focus($el) {
        if ($el[0] === document.activeElement) return;

        /* set the focus in a 0 timeout - that way the focus is set after the processing
            of the current event has finished - which seems like the only reliable way
            to set focus */
        window.setTimeout(function() {
            var el=$el[0], pos=$el.val().length, range;

            $el.focus();

            /* make sure el received focus so we do not error out when trying to manipulate the caret.
                sometimes modals or others listeners may steal it after its set */
            var isVisible = (el.offsetWidth > 0 || el.offsetHeight > 0);
            if (isVisible && el === document.activeElement) {

                /* after the focus is set move the caret to the end, necessary when we val()
                    just before setting focus */
                if(el.setSelectionRange)
                {
                    el.setSelectionRange(pos, pos);
                }
                else if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            }
        }, 0);
    }

    function getCursorInfo(el) {
        el = $(el)[0];
        var offset = 0;
        var length = 0;
        if ('selectionStart' in el) {
            offset = el.selectionStart;
            length = el.selectionEnd - offset;
        } else if ('selection' in document) {
            el.focus();
            var sel = document.selection.createRange();
            length = document.selection.createRange().text.length;
            sel.moveStart('character', -el.value.length);
            offset = sel.text.length - length;
        }
        return { offset: offset, length: length };
    }

    function killEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function killEventImmediately(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function measureTextWidth(e) {
        if (!sizer){
            var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
            sizer = $(document.createElement("div")).css({
                position: "absolute",
                left: "-10000px",
                top: "-10000px",
                display: "none",
                fontSize: style.fontSize,
                fontFamily: style.fontFamily,
                fontStyle: style.fontStyle,
                fontWeight: style.fontWeight,
                letterSpacing: style.letterSpacing,
                textTransform: style.textTransform,
                whiteSpace: "nowrap"
            });
            sizer.attr("class","select2-sizer");
            $("body").append(sizer);
        }
        sizer.text(e.val());
        return sizer.width();
    }

    function syncCssClasses(dest, src, adapter) {
        var classes, replacements = [], adapted;

        classes = $.trim(dest.attr("class"));

        if (classes) {
            classes = '' + classes; // for IE which returns object

            $(classes.split(/\s+/)).each2(function() {
                if (this.indexOf("select2-") === 0) {
                    replacements.push(this);
                }
            });
        }

        classes = $.trim(src.attr("class"));

        if (classes) {
            classes = '' + classes; // for IE which returns object

            $(classes.split(/\s+/)).each2(function() {
                if (this.indexOf("select2-") !== 0) {
                    adapted = adapter(this);

                    if (adapted) {
                        replacements.push(adapted);
                    }
                }
            });
        }

        dest.attr("class", replacements.join(" "));
    }


    function markMatch(text, term, markup, escapeMarkup) {
        var match=stripDiacritics(text.toUpperCase()).indexOf(stripDiacritics(term.toUpperCase())),
            tl=term.length;

        if (match<0) {
            markup.push(escapeMarkup(text));
            return;
        }

        markup.push(escapeMarkup(text.substring(0, match)));
        markup.push("<span class='select2-match'>");
        markup.push(escapeMarkup(text.substring(match, match + tl)));
        markup.push("</span>");
        markup.push(escapeMarkup(text.substring(match + tl, text.length)));
    }

    function defaultEscapeMarkup(markup) {
        var replace_map = {
            '\\': '&#92;',
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#47;'
        };

        return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
            return replace_map[match];
        });
    }

    /**
     * Produces an ajax-based query function
     *
     * @param options object containing configuration parameters
     * @param options.params parameter map for the transport ajax call, can contain such options as cache, jsonpCallback, etc. see $.ajax
     * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
     * @param options.url url for the data
     * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatypes supported by jQuery's $.ajax function or the transport function if specified
     * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
     * @param options.results a function(remoteData, pageNumber, query) that converts data returned form the remote request to the format expected by Select2.
     *      The expected format is an object containing the following keys:
     *      results array of objects that will be used as choices
     *      more (optional) boolean indicating whether there are more results available
     *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
     */
    function ajax(options) {
        var timeout, // current scheduled but not yet executed request
            handler = null,
            quietMillis = options.quietMillis || 100,
            ajaxUrl = options.url,
            self = this;

        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                var data = options.data, // ajax data function
                    url = ajaxUrl, // ajax url string or function
                    transport = options.transport || $.fn.select2.ajaxDefaults.transport,
                    // deprecated - to be removed in 4.0  - use params instead
                    deprecated = {
                        type: options.type || 'GET', // set type of request (GET or POST)
                        cache: options.cache || false,
                        jsonpCallback: options.jsonpCallback||undefined,
                        dataType: options.dataType||"json"
                    },
                    params = $.extend({}, $.fn.select2.ajaxDefaults.params, deprecated);

                data = data ? data.call(self, query.term, query.page, query.context) : null;
                url = (typeof url === 'function') ? url.call(self, query.term, query.page, query.context) : url;

                if (handler && typeof handler.abort === "function") { handler.abort(); }

                if (options.params) {
                    if ($.isFunction(options.params)) {
                        $.extend(params, options.params.call(self));
                    } else {
                        $.extend(params, options.params);
                    }
                }

                $.extend(params, {
                    url: url,
                    dataType: options.dataType,
                    data: data,
                    success: function (data) {
                        // TODO - replace query.page with query so users have access to term, page, etc.
                        // added query as third paramter to keep backwards compatibility
                        var results = options.results(data, query.page, query);
                        query.callback(results);
                    }
                });
                handler = transport.call(self, params);
            }, quietMillis);
        };
    }

    /**
     * Produces a query function that works with a local array
     *
     * @param options object containing configuration parameters. The options parameter can either be an array or an
     * object.
     *
     * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
     *
     * If the object form is used it is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
     * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
     * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
     * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
     * the text.
     */
    function local(options) {
        var data = options, // data elements
            dataText,
            tmp,
            text = function (item) { return ""+item.text; }; // function used to retrieve the text portion of a data item that is matched against the search

         if ($.isArray(data)) {
            tmp = data;
            data = { results: tmp };
        }

         if ($.isFunction(data) === false) {
            tmp = data;
            data = function() { return tmp; };
        }

        var dataItem = data();
        if (dataItem.text) {
            text = dataItem.text;
            // if text is not a function we assume it to be a key name
            if (!$.isFunction(text)) {
                dataText = dataItem.text; // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
                text = function (item) { return item[dataText]; };
            }
        }

        return function (query) {
            var t = query.term, filtered = { results: [] }, process;
            if (t === "") {
                query.callback(data());
                return;
            }

            process = function(datum, collection) {
                var group, attr;
                datum = datum[0];
                if (datum.children) {
                    group = {};
                    for (attr in datum) {
                        if (datum.hasOwnProperty(attr)) group[attr]=datum[attr];
                    }
                    group.children=[];
                    $(datum.children).each2(function(i, childDatum) { process(childDatum, group.children); });
                    if (group.children.length || query.matcher(t, text(group), datum)) {
                        collection.push(group);
                    }
                } else {
                    if (query.matcher(t, text(datum), datum)) {
                        collection.push(datum);
                    }
                }
            };

            $(data().results).each2(function(i, datum) { process(datum, filtered.results); });
            query.callback(filtered);
        };
    }

    // TODO javadoc
    function tags(data) {
        var isFunc = $.isFunction(data);
        return function (query) {
            var t = query.term, filtered = {results: []};
            var result = isFunc ? data(query) : data;
            if ($.isArray(result)) {
                $(result).each(function () {
                    var isObject = this.text !== undefined,
                        text = isObject ? this.text : this;
                    if (t === "" || query.matcher(t, text)) {
                        filtered.results.push(isObject ? this : {id: this, text: this});
                    }
                });
                query.callback(filtered);
            }
        };
    }

    /**
     * Checks if the formatter function should be used.
     *
     * Throws an error if it is not a function. Returns true if it should be used,
     * false if no formatting should be performed.
     *
     * @param formatter
     */
    function checkFormatter(formatter, formatterName) {
        if ($.isFunction(formatter)) return true;
        if (!formatter) return false;
        if (typeof(formatter) === 'string') return true;
        throw new Error(formatterName +" must be a string, function, or falsy value");
    }

  /**
   * Returns a given value
   * If given a function, returns its output
   *
   * @param val string|function
   * @param context value of "this" to be passed to function
   * @returns {*}
   */
    function evaluate(val, context) {
        if ($.isFunction(val)) {
            var args = Array.prototype.slice.call(arguments, 2);
            return val.apply(context, args);
        }
        return val;
    }

    function countResults(results) {
        var count = 0;
        $.each(results, function(i, item) {
            if (item.children) {
                count += countResults(item.children);
            } else {
                count++;
            }
        });
        return count;
    }

    /**
     * Default tokenizer. This function uses breaks the input on substring match of any string from the
     * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
     * two options have to be defined in order for the tokenizer to work.
     *
     * @param input text user has typed so far or pasted into the search field
     * @param selection currently selected choices
     * @param selectCallback function(choice) callback tho add the choice to selection
     * @param opts select2's opts
     * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
     */
    function defaultTokenizer(input, selection, selectCallback, opts) {
        var original = input, // store the original so we can compare and know if we need to tell the search to update its text
            dupe = false, // check for whether a token we extracted represents a duplicate selected choice
            token, // token
            index, // position at which the separator was found
            i, l, // looping variables
            separator; // the matched separator

        if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;

        while (true) {
            index = -1;

            for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
                separator = opts.tokenSeparators[i];
                index = input.indexOf(separator);
                if (index >= 0) break;
            }

            if (index < 0) break; // did not find any token separator in the input string, bail

            token = input.substring(0, index);
            input = input.substring(index + separator.length);

            if (token.length > 0) {
                token = opts.createSearchChoice.call(this, token, selection);
                if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                    dupe = false;
                    for (i = 0, l = selection.length; i < l; i++) {
                        if (equal(opts.id(token), opts.id(selection[i]))) {
                            dupe = true; break;
                        }
                    }

                    if (!dupe) selectCallback(token);
                }
            }
        }

        if (original!==input) return input;
    }

    function cleanupJQueryElements() {
        var self = this;

        $.each(arguments, function (i, element) {
            self[element].remove();
            self[element] = null;
        });
    }

    /**
     * Creates a new class
     *
     * @param superClass
     * @param methods
     */
    function clazz(SuperClass, methods) {
        var constructor = function () {};
        constructor.prototype = new SuperClass;
        constructor.prototype.constructor = constructor;
        constructor.prototype.parent = SuperClass.prototype;
        constructor.prototype = $.extend(constructor.prototype, methods);
        return constructor;
    }

    AbstractSelect2 = clazz(Object, {

        // abstract
        bind: function (func) {
            var self = this;
            return function () {
                func.apply(self, arguments);
            };
        },

        // abstract
        init: function (opts) {
            var results, search, resultsSelector = ".select2-results";

            // prepare options
            this.opts = opts = this.prepareOpts(opts);

            this.id=opts.id;

            // destroy if called on an existing component
            if (opts.element.data("select2") !== undefined &&
                opts.element.data("select2") !== null) {
                opts.element.data("select2").destroy();
            }

            this.container = this.createContainer();

            this.liveRegion = $("<span>", {
                    role: "status",
                    "aria-live": "polite"
                })
                .addClass("select2-hidden-accessible")
                .appendTo(document.body);

            this.containerId="s2id_"+(opts.element.attr("id") || "autogen"+nextUid());
            this.containerEventName= this.containerId
                .replace(/([.])/g, '_')
                .replace(/([;&,\-\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
            this.container.attr("id", this.containerId);

            this.container.attr("title", opts.element.attr("title"));

            this.body = $("body");

            syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);

            this.container.attr("style", opts.element.attr("style"));
            this.container.css(evaluate(opts.containerCss, this.opts.element));
            this.container.addClass(evaluate(opts.containerCssClass, this.opts.element));

            this.elementTabIndex = this.opts.element.attr("tabindex");

            // swap container for the element
            this.opts.element
                .data("select2", this)
                .attr("tabindex", "-1")
                .before(this.container)
                .on("click.select2", killEvent); // do not leak click events

            this.container.data("select2", this);

            this.dropdown = this.container.find(".select2-drop");

            syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);

            this.dropdown.addClass(evaluate(opts.dropdownCssClass, this.opts.element));
            this.dropdown.data("select2", this);
            this.dropdown.on("click", killEvent);

            this.results = results = this.container.find(resultsSelector);
            this.search = search = this.container.find("input.select2-input");

            this.queryCount = 0;
            this.resultsPage = 0;
            this.context = null;

            // initialize the container
            this.initContainer();

            this.container.on("click", killEvent);

            installFilteredMouseMove(this.results);

            this.dropdown.on("mousemove-filtered", resultsSelector, this.bind(this.highlightUnderEvent));
            this.dropdown.on("touchstart touchmove touchend", resultsSelector, this.bind(function (event) {
                this._touchEvent = true;
                this.highlightUnderEvent(event);
            }));
            this.dropdown.on("touchmove", resultsSelector, this.bind(this.touchMoved));
            this.dropdown.on("touchstart touchend", resultsSelector, this.bind(this.clearTouchMoved));

            // Waiting for a click event on touch devices to select option and hide dropdown
            // otherwise click will be triggered on an underlying element
            this.dropdown.on('click', this.bind(function (event) {
                if (this._touchEvent) {
                    this._touchEvent = false;
                    this.selectHighlighted();
                }
            }));

            installDebouncedScroll(80, this.results);
            this.dropdown.on("scroll-debounced", resultsSelector, this.bind(this.loadMoreIfNeeded));

            // do not propagate change event from the search field out of the component
            $(this.container).on("change", ".select2-input", function(e) {e.stopPropagation();});
            $(this.dropdown).on("change", ".select2-input", function(e) {e.stopPropagation();});

            // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
            if ($.fn.mousewheel) {
                results.mousewheel(function (e, delta, deltaX, deltaY) {
                    var top = results.scrollTop();
                    if (deltaY > 0 && top - deltaY <= 0) {
                        results.scrollTop(0);
                        killEvent(e);
                    } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                        results.scrollTop(results.get(0).scrollHeight - results.height());
                        killEvent(e);
                    }
                });
            }

            installKeyUpChangeEvent(search);
            search.on("keyup-change input paste", this.bind(this.updateResults));
            search.on("focus", function () { search.addClass("select2-focused"); });
            search.on("blur", function () { search.removeClass("select2-focused");});

            this.dropdown.on("mouseup", resultsSelector, this.bind(function (e) {
                if ($(e.target).closest(".select2-result-selectable").length > 0) {
                    this.highlightUnderEvent(e);
                    this.selectHighlighted(e);
                }
            }));

            // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
            // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
            // dom it will trigger the popup close, which is not what we want
            // focusin can cause focus wars between modals and select2 since the dropdown is outside the modal.
            this.dropdown.on("click mouseup mousedown touchstart touchend focusin", function (e) { e.stopPropagation(); });

            this.nextSearchTerm = undefined;

            if ($.isFunction(this.opts.initSelection)) {
                // initialize selection based on the current value of the source element
                this.initSelection();

                // if the user has provided a function that can set selection based on the value of the source element
                // we monitor the change event on the element and trigger it, allowing for two way synchronization
                this.monitorSource();
            }

            if (opts.maximumInputLength !== null) {
                this.search.attr("maxlength", opts.maximumInputLength);
            }

            var disabled = opts.element.prop("disabled");
            if (disabled === undefined) disabled = false;
            this.enable(!disabled);

            var readonly = opts.element.prop("readonly");
            if (readonly === undefined) readonly = false;
            this.readonly(readonly);

            // Calculate size of scrollbar
            scrollBarDimensions = scrollBarDimensions || measureScrollbar();

            this.autofocus = opts.element.prop("autofocus");
            opts.element.prop("autofocus", false);
            if (this.autofocus) this.focus();

            this.search.attr("placeholder", opts.searchInputPlaceholder);
        },

        // abstract
        destroy: function () {
            var element=this.opts.element, select2 = element.data("select2");

            this.close();

            if (element.length && element[0].detachEvent) {
                element.each(function () {
                    this.detachEvent("onpropertychange", this._sync);
                });
            }
            if (this.propertyObserver) {
                this.propertyObserver.disconnect();
                this.propertyObserver = null;
            }
            this._sync = null;

            if (select2 !== undefined) {
                select2.container.remove();
                select2.liveRegion.remove();
                select2.dropdown.remove();
                element
                    .removeClass("select2-offscreen")
                    .removeData("select2")
                    .off(".select2")
                    .prop("autofocus", this.autofocus || false);
                if (this.elementTabIndex) {
                    element.attr({tabindex: this.elementTabIndex});
                } else {
                    element.removeAttr("tabindex");
                }
                element.show();
            }

            cleanupJQueryElements.call(this,
                "container",
                "liveRegion",
                "dropdown",
                "results",
                "search"
            );
        },

        // abstract
        optionToData: function(element) {
            if (element.is("option")) {
                return {
                    id:element.prop("value"),
                    text:element.text(),
                    element: element.get(),
                    css: element.attr("class"),
                    disabled: element.prop("disabled"),
                    locked: equal(element.attr("locked"), "locked") || equal(element.data("locked"), true)
                };
            } else if (element.is("optgroup")) {
                return {
                    text:element.attr("label"),
                    children:[],
                    element: element.get(),
                    css: element.attr("class")
                };
            }
        },

        // abstract
        prepareOpts: function (opts) {
            var element, select, idKey, ajaxUrl, self = this;

            element = opts.element;

            if (element.get(0).tagName.toLowerCase() === "select") {
                this.select = select = opts.element;
            }

            if (select) {
                // these options are not allowed when attached to a select because they are picked up off the element itself
                $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
                    if (this in opts) {
                        throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                    }
                });
            }

            opts = $.extend({}, {
                populateResults: function(container, results, query) {
                    var populate, id=this.opts.id, liveRegion=this.liveRegion;

                    populate=function(results, container, depth) {

                        var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;

                        results = opts.sortResults(results, container, query);

                        // collect the created nodes for bulk append
                        var nodes = [];
                        for (i = 0, l = results.length; i < l; i = i + 1) {

                            result=results[i];

                            disabled = (result.disabled === true);
                            selectable = (!disabled) && (id(result) !== undefined);

                            compound=result.children && result.children.length > 0;

                            node=$("<li></li>");
                            node.addClass("select2-results-dept-"+depth);
                            node.addClass("select2-result");
                            node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                            if (disabled) { node.addClass("select2-disabled"); }
                            if (compound) { node.addClass("select2-result-with-children"); }
                            node.addClass(self.opts.formatResultCssClass(result));
                            node.attr("role", "presentation");

                            label=$(document.createElement("div"));
                            label.addClass("select2-result-label");
                            label.attr("id", "select2-result-label-" + nextUid());
                            label.attr("role", "option");

                            formatted=opts.formatResult(result, label, query, self.opts.escapeMarkup);
                            if (formatted!==undefined) {
                                label.html(formatted);
                                node.append(label);
                            }


                            if (compound) {

                                innerContainer=$("<ul></ul>");
                                innerContainer.addClass("select2-result-sub");
                                populate(result.children, innerContainer, depth+1);
                                node.append(innerContainer);
                            }

                            node.data("select2-data", result);
                            nodes.push(node[0]);
                        }

                        // bulk append the created nodes
                        container.append(nodes);
                        liveRegion.text(opts.formatMatches(results.length));
                    };

                    populate(results, container, 0);
                }
            }, $.fn.select2.defaults, opts);

            if (typeof(opts.id) !== "function") {
                idKey = opts.id;
                opts.id = function (e) { return e[idKey]; };
            }

            if ($.isArray(opts.element.data("select2Tags"))) {
                if ("tags" in opts) {
                    throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
                }
                opts.tags=opts.element.data("select2Tags");
            }

            if (select) {
                opts.query = this.bind(function (query) {
                    var data = { results: [], more: false },
                        term = query.term,
                        children, placeholderOption, process;

                    process=function(element, collection) {
                        var group;
                        if (element.is("option")) {
                            if (query.matcher(term, element.text(), element)) {
                                collection.push(self.optionToData(element));
                            }
                        } else if (element.is("optgroup")) {
                            group=self.optionToData(element);
                            element.children().each2(function(i, elm) { process(elm, group.children); });
                            if (group.children.length>0) {
                                collection.push(group);
                            }
                        }
                    };

                    children=element.children();

                    // ignore the placeholder option if there is one
                    if (this.getPlaceholder() !== undefined && children.length > 0) {
                        placeholderOption = this.getPlaceholderOption();
                        if (placeholderOption) {
                            children=children.not(placeholderOption);
                        }
                    }

                    children.each2(function(i, elm) { process(elm, data.results); });

                    query.callback(data);
                });
                // this is needed because inside val() we construct choices from options and there id is hardcoded
                opts.id=function(e) { return e.id; };
            } else {
                if (!("query" in opts)) {

                    if ("ajax" in opts) {
                        ajaxUrl = opts.element.data("ajax-url");
                        if (ajaxUrl && ajaxUrl.length > 0) {
                            opts.ajax.url = ajaxUrl;
                        }
                        opts.query = ajax.call(opts.element, opts.ajax);
                    } else if ("data" in opts) {
                        opts.query = local(opts.data);
                    } else if ("tags" in opts) {
                        opts.query = tags(opts.tags);
                        if (opts.createSearchChoice === undefined) {
                            opts.createSearchChoice = function (term) { return {id: $.trim(term), text: $.trim(term)}; };
                        }
                        if (opts.initSelection === undefined) {
                            opts.initSelection = function (element, callback) {
                                var data = [];
                                $(splitVal(element.val(), opts.separator)).each(function () {
                                    var obj = { id: this, text: this },
                                        tags = opts.tags;
                                    if ($.isFunction(tags)) tags=tags();
                                    $(tags).each(function() { if (equal(this.id, obj.id)) { obj = this; return false; } });
                                    data.push(obj);
                                });

                                callback(data);
                            };
                        }
                    }
                }
            }
            if (typeof(opts.query) !== "function") {
                throw "query function not defined for Select2 " + opts.element.attr("id");
            }

            if (opts.createSearchChoicePosition === 'top') {
                opts.createSearchChoicePosition = function(list, item) { list.unshift(item); };
            }
            else if (opts.createSearchChoicePosition === 'bottom') {
                opts.createSearchChoicePosition = function(list, item) { list.push(item); };
            }
            else if (typeof(opts.createSearchChoicePosition) !== "function")  {
                throw "invalid createSearchChoicePosition option must be 'top', 'bottom' or a custom function";
            }

            return opts;
        },

        /**
         * Monitor the original element for changes and update select2 accordingly
         */
        // abstract
        monitorSource: function () {
            var el = this.opts.element, observer, self = this;

            el.on("change.select2", this.bind(function (e) {
                if (this.opts.element.data("select2-change-triggered") !== true) {
                    this.initSelection();
                }
            }));

            this._sync = this.bind(function () {

                // sync enabled state
                var disabled = el.prop("disabled");
                if (disabled === undefined) disabled = false;
                this.enable(!disabled);

                var readonly = el.prop("readonly");
                if (readonly === undefined) readonly = false;
                this.readonly(readonly);

                syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
                this.container.addClass(evaluate(this.opts.containerCssClass, this.opts.element));

                syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
                this.dropdown.addClass(evaluate(this.opts.dropdownCssClass, this.opts.element));

            });

            // IE8-10 (IE9/10 won't fire propertyChange via attachEventListener)
            if (el.length && el[0].attachEvent) {
                el.each(function() {
                    this.attachEvent("onpropertychange", self._sync);
                });
            }

            // safari, chrome, firefox, IE11
            observer = window.MutationObserver || window.WebKitMutationObserver|| window.MozMutationObserver;
            if (observer !== undefined) {
                if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }
                this.propertyObserver = new observer(function (mutations) {
                    $.each(mutations, self._sync);
                });
                this.propertyObserver.observe(el.get(0), { attributes:true, subtree:false });
            }
        },

        // abstract
        triggerSelect: function(data) {
            var evt = $.Event("select2-selecting", { val: this.id(data), object: data, choice: data });
            this.opts.element.trigger(evt);
            return !evt.isDefaultPrevented();
        },

        /**
         * Triggers the change event on the source element
         */
        // abstract
        triggerChange: function (details) {

            details = details || {};
            details= $.extend({}, details, { type: "change", val: this.val() });
            // prevents recursive triggering
            this.opts.element.data("select2-change-triggered", true);
            this.opts.element.trigger(details);
            this.opts.element.data("select2-change-triggered", false);

            // some validation frameworks ignore the change event and listen instead to keyup, click for selects
            // so here we trigger the click event manually
            this.opts.element.click();

            // ValidationEngine ignores the change event and listens instead to blur
            // so here we trigger the blur event manually if so desired
            if (this.opts.blurOnChange)
                this.opts.element.blur();
        },

        //abstract
        isInterfaceEnabled: function()
        {
            return this.enabledInterface === true;
        },

        // abstract
        enableInterface: function() {
            var enabled = this._enabled && !this._readonly,
                disabled = !enabled;

            if (enabled === this.enabledInterface) return false;

            this.container.toggleClass("select2-container-disabled", disabled);
            this.close();
            this.enabledInterface = enabled;

            return true;
        },

        // abstract
        enable: function(enabled) {
            if (enabled === undefined) enabled = true;
            if (this._enabled === enabled) return;
            this._enabled = enabled;

            this.opts.element.prop("disabled", !enabled);
            this.enableInterface();
        },

        // abstract
        disable: function() {
            this.enable(false);
        },

        // abstract
        readonly: function(enabled) {
            if (enabled === undefined) enabled = false;
            if (this._readonly === enabled) return;
            this._readonly = enabled;

            this.opts.element.prop("readonly", enabled);
            this.enableInterface();
        },

        // abstract
        opened: function () {
            return (this.container) ? this.container.hasClass("select2-dropdown-open") : false;
        },

        // abstract
        positionDropdown: function() {
            var $dropdown = this.dropdown,
                offset = this.container.offset(),
                height = this.container.outerHeight(false),
                width = this.container.outerWidth(false),
                dropHeight = $dropdown.outerHeight(false),
                $window = $(window),
                windowWidth = $window.width(),
                windowHeight = $window.height(),
                viewPortRight = $window.scrollLeft() + windowWidth,
                viewportBottom = $window.scrollTop() + windowHeight,
                dropTop = offset.top + height,
                dropLeft = offset.left,
                enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
                enoughRoomAbove = (offset.top - dropHeight) >= $window.scrollTop(),
                dropWidth = $dropdown.outerWidth(false),
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight,
                aboveNow = $dropdown.hasClass("select2-drop-above"),
                bodyOffset,
                above,
                changeDirection,
                css,
                resultsListNode;

            // always prefer the current above/below alignment, unless there is not enough room
            if (aboveNow) {
                above = true;
                if (!enoughRoomAbove && enoughRoomBelow) {
                    changeDirection = true;
                    above = false;
                }
            } else {
                above = false;
                if (!enoughRoomBelow && enoughRoomAbove) {
                    changeDirection = true;
                    above = true;
                }
            }

            //if we are changing direction we need to get positions when dropdown is hidden;
            if (changeDirection) {
                $dropdown.hide();
                offset = this.container.offset();
                height = this.container.outerHeight(false);
                width = this.container.outerWidth(false);
                dropHeight = $dropdown.outerHeight(false);
                viewPortRight = $window.scrollLeft() + windowWidth;
                viewportBottom = $window.scrollTop() + windowHeight;
                dropTop = offset.top + height;
                dropLeft = offset.left;
                dropWidth = $dropdown.outerWidth(false);
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
                $dropdown.show();

                // fix so the cursor does not move to the left within the search-textbox in IE
                this.focusSearch();
            }

            if (this.opts.dropdownAutoWidth) {
                resultsListNode = $('.select2-results', $dropdown)[0];
                $dropdown.addClass('select2-drop-auto-width');
                $dropdown.css('width', '');
                // Add scrollbar width to dropdown if vertical scrollbar is present
                dropWidth = $dropdown.outerWidth(false) + (resultsListNode.scrollHeight === resultsListNode.clientHeight ? 0 : scrollBarDimensions.width);
                dropWidth > width ? width = dropWidth : dropWidth = width;
                dropHeight = $dropdown.outerHeight(false);
                enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
            }
            else {
                this.container.removeClass('select2-drop-auto-width');
            }

            //console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
            //console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body.scrollTop(), "enough?", enoughRoomAbove);

            // fix positioning when body has an offset and is not position: static
            if (this.body.css('position') !== 'static') {
                bodyOffset = this.body.offset();
                dropTop -= bodyOffset.top;
                dropLeft -= bodyOffset.left;
            }

            if (!enoughRoomOnRight) {
                dropLeft = offset.left + this.container.outerWidth(false) - dropWidth;
            }

            css =  {
                left: dropLeft,
                width: width
            };

            if (above) {
                css.top = offset.top - dropHeight;
                css.bottom = 'auto';
                this.container.addClass("select2-drop-above");
                $dropdown.addClass("select2-drop-above");
            }
            else {
                css.top = dropTop;
                css.bottom = 'auto';
                this.container.removeClass("select2-drop-above");
                $dropdown.removeClass("select2-drop-above");
            }
            css = $.extend(css, evaluate(this.opts.dropdownCss, this.opts.element));

            $dropdown.css(css);
        },

        // abstract
        shouldOpen: function() {
            var event;

            if (this.opened()) return false;

            if (this._enabled === false || this._readonly === true) return false;

            event = $.Event("select2-opening");
            this.opts.element.trigger(event);
            return !event.isDefaultPrevented();
        },

        // abstract
        clearDropdownAlignmentPreference: function() {
            // clear the classes used to figure out the preference of where the dropdown should be opened
            this.container.removeClass("select2-drop-above");
            this.dropdown.removeClass("select2-drop-above");
        },

        /**
         * Opens the dropdown
         *
         * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
         * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
         */
        // abstract
        open: function () {

            if (!this.shouldOpen()) return false;

            this.opening();

            // Only bind the document mousemove when the dropdown is visible
            $document.on("mousemove.select2Event", function (e) {
                lastMousePosition.x = e.pageX;
                lastMousePosition.y = e.pageY;
            });

            return true;
        },

        /**
         * Performs the opening of the dropdown
         */
        // abstract
        opening: function() {
            var cid = this.containerEventName,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid,
                mask;

            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");

            this.clearDropdownAlignmentPreference();

            if(this.dropdown[0] !== this.body.children().last()[0]) {
                this.dropdown.detach().appendTo(this.body);
            }

            // create the dropdown mask if doesn't already exist
            mask = $("#select2-drop-mask");
            if (mask.length == 0) {
                mask = $(document.createElement("div"));
                mask.attr("id","select2-drop-mask").attr("class","select2-drop-mask");
                mask.hide();
                mask.appendTo(this.body);
                mask.on("mousedown touchstart click", function (e) {
                    // Prevent IE from generating a click event on the body
                    reinsertElement(mask);

                    var dropdown = $("#select2-drop"), self;
                    if (dropdown.length > 0) {
                        self=dropdown.data("select2");
                        if (self.opts.selectOnBlur) {
                            self.selectHighlighted({noFocus: true});
                        }
                        self.close();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            }

            // ensure the mask is always right before the dropdown
            if (this.dropdown.prev()[0] !== mask[0]) {
                this.dropdown.before(mask);
            }

            // move the global id to the correct dropdown
            $("#select2-drop").removeAttr("id");
            this.dropdown.attr("id", "select2-drop");

            // show the elements
            mask.show();

            this.positionDropdown();
            this.dropdown.show();
            this.positionDropdown();

            this.dropdown.addClass("select2-drop-active");

            // attach listeners to events that can change the position of the container and thus require
            // the position of the dropdown to be updated as well so it does not come unglued from the container
            var that = this;
            this.container.parents().add(window).each(function () {
                $(this).on(resize+" "+scroll+" "+orient, function (e) {
                    if (that.opened()) that.positionDropdown();
                });
            });


        },

        // abstract
        close: function () {
            if (!this.opened()) return;

            var cid = this.containerEventName,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid;

            // unbind event listeners
            this.container.parents().add(window).each(function () { $(this).off(scroll).off(resize).off(orient); });

            this.clearDropdownAlignmentPreference();

            $("#select2-drop-mask").hide();
            this.dropdown.removeAttr("id"); // only the active dropdown has the select2-drop id
            this.dropdown.hide();
            this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active");
            this.results.empty();

            // Now that the dropdown is closed, unbind the global document mousemove event
            $document.off("mousemove.select2Event");

            this.clearSearch();
            this.search.removeClass("select2-active");
            this.opts.element.trigger($.Event("select2-close"));
        },

        /**
         * Opens control, sets input value, and updates results.
         */
        // abstract
        externalSearch: function (term) {
            this.open();
            this.search.val(term);
            this.updateResults(false);
        },

        // abstract
        clearSearch: function () {

        },

        //abstract
        getMaximumSelectionSize: function() {
            return evaluate(this.opts.maximumSelectionSize, this.opts.element);
        },

        // abstract
        ensureHighlightVisible: function () {
            var results = this.results, children, index, child, hb, rb, y, more, topOffset;

            index = this.highlight();

            if (index < 0) return;

            if (index == 0) {

                // if the first element is highlighted scroll all the way to the top,
                // that way any unselectable headers above it will also be scrolled
                // into view

                results.scrollTop(0);
                return;
            }

            children = this.findHighlightableChoices().find('.select2-result-label');

            child = $(children[index]);

            topOffset = (child.offset() || {}).top || 0;

            hb = topOffset + child.outerHeight(true);

            // if this is the last child lets also make sure select2-more-results is visible
            if (index === children.length - 1) {
                more = results.find("li.select2-more-results");
                if (more.length > 0) {
                    hb = more.offset().top + more.outerHeight(true);
                }
            }

            rb = results.offset().top + results.outerHeight(true);
            if (hb > rb) {
                results.scrollTop(results.scrollTop() + (hb - rb));
            }
            y = topOffset - results.offset().top;

            // make sure the top of the element is visible
            if (y < 0 && child.css('display') != 'none' ) {
                results.scrollTop(results.scrollTop() + y); // y is negative
            }
        },

        // abstract
        findHighlightableChoices: function() {
            return this.results.find(".select2-result-selectable:not(.select2-disabled):not(.select2-selected)");
        },

        // abstract
        moveHighlight: function (delta) {
            var choices = this.findHighlightableChoices(),
                index = this.highlight();

            while (index > -1 && index < choices.length) {
                index += delta;
                var choice = $(choices[index]);
                if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                    this.highlight(index);
                    break;
                }
            }
        },

        // abstract
        highlight: function (index) {
            var choices = this.findHighlightableChoices(),
                choice,
                data;

            if (arguments.length === 0) {
                return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
            }

            if (index >= choices.length) index = choices.length - 1;
            if (index < 0) index = 0;

            this.removeHighlight();

            choice = $(choices[index]);
            choice.addClass("select2-highlighted");

            // ensure assistive technology can determine the active choice
            this.search.attr("aria-activedescendant", choice.find(".select2-result-label").attr("id"));

            this.ensureHighlightVisible();

            this.liveRegion.text(choice.text());

            data = choice.data("select2-data");
            if (data) {
                this.opts.element.trigger({ type: "select2-highlight", val: this.id(data), choice: data });
            }
        },

        removeHighlight: function() {
            this.results.find(".select2-highlighted").removeClass("select2-highlighted");
        },

        touchMoved: function() {
            this._touchMoved = true;
        },

        clearTouchMoved: function() {
          this._touchMoved = false;
        },

        // abstract
        countSelectableResults: function() {
            return this.findHighlightableChoices().length;
        },

        // abstract
        highlightUnderEvent: function (event) {
            var el = $(event.target).closest(".select2-result-selectable");
            if (el.length > 0 && !el.is(".select2-highlighted")) {
                var choices = this.findHighlightableChoices();
                this.highlight(choices.index(el));
            } else if (el.length == 0) {
                // if we are over an unselectable item remove all highlights
                this.removeHighlight();
            }
        },

        // abstract
        loadMoreIfNeeded: function () {
            var results = this.results,
                more = results.find("li.select2-more-results"),
                below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                page = this.resultsPage + 1,
                self=this,
                term=this.search.val(),
                context=this.context;

            if (more.length === 0) return;
            below = more.offset().top - results.offset().top - results.height();

            if (below <= this.opts.loadMorePadding) {
                more.addClass("select2-active");
                this.opts.query({
                        element: this.opts.element,
                        term: term,
                        page: page,
                        context: context,
                        matcher: this.opts.matcher,
                        callback: this.bind(function (data) {

                    // ignore a response if the select2 has been closed before it was received
                    if (!self.opened()) return;


                    self.opts.populateResults.call(this, results, data.results, {term: term, page: page, context:context});
                    self.postprocessResults(data, false, false);

                    if (data.more===true) {
                        more.detach().appendTo(results).text(evaluate(self.opts.formatLoadMore, self.opts.element, page+1));
                        window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                    } else {
                        more.remove();
                    }
                    self.positionDropdown();
                    self.resultsPage = page;
                    self.context = data.context;
                    this.opts.element.trigger({ type: "select2-loaded", items: data });
                })});
            }
        },

        /**
         * Default tokenizer function which does nothing
         */
        tokenize: function() {

        },

        /**
         * @param initial whether or not this is the call to this method right after the dropdown has been opened
         */
        // abstract
        updateResults: function (initial) {
            var search = this.search,
                results = this.results,
                opts = this.opts,
                data,
                self = this,
                input,
                term = search.val(),
                lastTerm = $.data(this.container, "select2-last-term"),
                // sequence number used to drop out-of-order responses
                queryNumber;

            // prevent duplicate queries against the same term
            if (initial !== true && lastTerm && equal(term, lastTerm)) return;

            $.data(this.container, "select2-last-term", term);

            // if the search is currently hidden we do not alter the results
            if (initial !== true && (this.showSearchInput === false || !this.opened())) {
                return;
            }

            function postRender() {
                search.removeClass("select2-active");
                self.positionDropdown();
                if (results.find('.select2-no-results,.select2-selection-limit,.select2-searching').length) {
                    self.liveRegion.text(results.text());
                }
                else {
                    self.liveRegion.text(self.opts.formatMatches(results.find('.select2-result-selectable').length));
                }
            }

            function render(html) {
                results.html(html);
                postRender();
            }

            queryNumber = ++this.queryCount;

            var maxSelSize = this.getMaximumSelectionSize();
            if (maxSelSize >=1) {
                data = this.data();
                if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
                    render("<li class='select2-selection-limit'>" + evaluate(opts.formatSelectionTooBig, opts.element, maxSelSize) + "</li>");
                    return;
                }
            }

            if (search.val().length < opts.minimumInputLength) {
                if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooShort, opts.element, search.val(), opts.minimumInputLength) + "</li>");
                } else {
                    render("");
                }
                if (initial && this.showSearch) this.showSearch(true);
                return;
            }

            if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
                if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooLong, opts.element, search.val(), opts.maximumInputLength) + "</li>");
                } else {
                    render("");
                }
                return;
            }

            if (opts.formatSearching && this.findHighlightableChoices().length === 0) {
                render("<li class='select2-searching'>" + evaluate(opts.formatSearching, opts.element) + "</li>");
            }

            search.addClass("select2-active");

            this.removeHighlight();

            // give the tokenizer a chance to pre-process the input
            input = this.tokenize();
            if (input != undefined && input != null) {
                search.val(input);
            }

            this.resultsPage = 1;

            opts.query({
                element: opts.element,
                    term: search.val(),
                    page: this.resultsPage,
                    context: null,
                    matcher: opts.matcher,
                    callback: this.bind(function (data) {
                var def; // default choice

                // ignore old responses
                if (queryNumber != this.queryCount) {
                  return;
                }

                // ignore a response if the select2 has been closed before it was received
                if (!this.opened()) {
                    this.search.removeClass("select2-active");
                    return;
                }

                // save context, if any
                this.context = (data.context===undefined) ? null : data.context;
                // create a default choice and prepend it to the list
                if (this.opts.createSearchChoice && search.val() !== "") {
                    def = this.opts.createSearchChoice.call(self, search.val(), data.results);
                    if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                        if ($(data.results).filter(
                            function () {
                                return equal(self.id(this), self.id(def));
                            }).length === 0) {
                            this.opts.createSearchChoicePosition(data.results, def);
                        }
                    }
                }

                if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatNoMatches, opts.element, search.val()) + "</li>");
                    return;
                }

                results.empty();
                self.opts.populateResults.call(this, results, data.results, {term: search.val(), page: this.resultsPage, context:null});

                if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                    results.append("<li class='select2-more-results'>" + opts.escapeMarkup(evaluate(opts.formatLoadMore, opts.element, this.resultsPage)) + "</li>");
                    window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                }

                this.postprocessResults(data, initial);

                postRender();

                this.opts.element.trigger({ type: "select2-loaded", items: data });
            })});
        },

        // abstract
        cancel: function () {
            this.close();
        },

        // abstract
        blur: function () {
            // if selectOnBlur == true, select the currently highlighted option
            if (this.opts.selectOnBlur)
                this.selectHighlighted({noFocus: true});

            this.close();
            this.container.removeClass("select2-container-active");
            // synonymous to .is(':focus'), which is available in jquery >= 1.6
            if (this.search[0] === document.activeElement) { this.search.blur(); }
            this.clearSearch();
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
        },

        // abstract
        focusSearch: function () {
            focus(this.search);
        },

        // abstract
        selectHighlighted: function (options) {
            if (this._touchMoved) {
              this.clearTouchMoved();
              return;
            }
            var index=this.highlight(),
                highlighted=this.results.find(".select2-highlighted"),
                data = highlighted.closest('.select2-result').data("select2-data");

            if (data) {
                this.highlight(index);
                this.onSelect(data, options);
            } else if (options && options.noFocus) {
                this.close();
            }
        },

        // abstract
        getPlaceholder: function () {
            var placeholderOption;
            return this.opts.element.attr("placeholder") ||
                this.opts.element.attr("data-placeholder") || // jquery 1.4 compat
                this.opts.element.data("placeholder") ||
                this.opts.placeholder ||
                ((placeholderOption = this.getPlaceholderOption()) !== undefined ? placeholderOption.text() : undefined);
        },

        // abstract
        getPlaceholderOption: function() {
            if (this.select) {
                var firstOption = this.select.children('option').first();
                if (this.opts.placeholderOption !== undefined ) {
                    //Determine the placeholder option based on the specified placeholderOption setting
                    return (this.opts.placeholderOption === "first" && firstOption) ||
                           (typeof this.opts.placeholderOption === "function" && this.opts.placeholderOption(this.select));
                } else if ($.trim(firstOption.text()) === "" && firstOption.val() === "") {
                    //No explicit placeholder option specified, use the first if it's blank
                    return firstOption;
                }
            }
        },

        /**
         * Get the desired width for the container element.  This is
         * derived first from option `width` passed to select2, then
         * the inline 'style' on the original element, and finally
         * falls back to the jQuery calculated element width.
         */
        // abstract
        initContainerWidth: function () {
            function resolveContainerWidth() {
                var style, attrs, matches, i, l, attr;

                if (this.opts.width === "off") {
                    return null;
                } else if (this.opts.width === "element"){
                    return this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px';
                } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                    // check if there is inline style on the element that contains width
                    style = this.opts.element.attr('style');
                    if (style !== undefined) {
                        attrs = style.split(';');
                        for (i = 0, l = attrs.length; i < l; i = i + 1) {
                            attr = attrs[i].replace(/\s/g, '');
                            matches = attr.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);
                            if (matches !== null && matches.length >= 1)
                                return matches[1];
                        }
                    }

                    if (this.opts.width === "resolve") {
                        // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                        // when attached to input type=hidden or elements hidden via css
                        style = this.opts.element.css('width');
                        if (style.indexOf("%") > 0) return style;

                        // finally, fallback on the calculated width of the element
                        return (this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px');
                    }

                    return null;
                } else if ($.isFunction(this.opts.width)) {
                    return this.opts.width();
                } else {
                    return this.opts.width;
               }
            };

            var width = resolveContainerWidth.call(this);
            if (width !== null) {
                this.container.css("width", width);
            }
        }
    });

    SingleSelect2 = clazz(AbstractSelect2, {

        // single

        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container"
            }).html([
                "<a href='javascript:void(0)' class='select2-choice' tabindex='-1'>",
                "   <span class='select2-chosen'>&#160;</span><abbr class='select2-search-choice-close'></abbr>",
                "   <span class='select2-arrow' role='presentation'><b role='presentation'></b></span>",
                "</a>",
                "<label for='' class='select2-offscreen'></label>",
                "<input class='select2-focusser select2-offscreen' type='text' aria-haspopup='true' role='button' />",
                "<div class='select2-drop select2-display-none'>",
                "   <div class='select2-search'>",
                "       <label for='' class='select2-offscreen'></label>",
                "       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input' role='combobox' aria-expanded='true'",
                "       aria-autocomplete='list' />",
                "   </div>",
                "   <ul class='select2-results' role='listbox'>",
                "   </ul>",
                "</div>"].join(""));
            return container;
        },

        // single
        enableInterface: function() {
            if (this.parent.enableInterface.apply(this, arguments)) {
                this.focusser.prop("disabled", !this.isInterfaceEnabled());
            }
        },

        // single
        opening: function () {
            var el, range, len;

            if (this.opts.minimumResultsForSearch >= 0) {
                this.showSearch(true);
            }

            this.parent.opening.apply(this, arguments);

            if (this.showSearchInput !== false) {
                // IE appends focusser.val() at the end of field :/ so we manually insert it at the beginning using a range
                // all other browsers handle this just fine

                this.search.val(this.focusser.val());
            }
            if (this.opts.shouldFocusInput(this)) {
                this.search.focus();
                // move the cursor to the end after focussing, otherwise it will be at the beginning and
                // new text will appear *before* focusser.val()
                el = this.search.get(0);
                if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                } else if (el.setSelectionRange) {
                    len = this.search.val().length;
                    el.setSelectionRange(len, len);
                }
            }

            // initializes search's value with nextSearchTerm (if defined by user)
            // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
            if(this.search.val() === "") {
                if(this.nextSearchTerm != undefined){
                    this.search.val(this.nextSearchTerm);
                    this.search.select();
                }
            }

            this.focusser.prop("disabled", true).val("");
            this.updateResults(true);
            this.opts.element.trigger($.Event("select2-open"));
        },

        // single
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);

            this.focusser.prop("disabled", false);

            if (this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }
        },

        // single
        focus: function () {
            if (this.opened()) {
                this.close();
            } else {
                this.focusser.prop("disabled", false);
                if (this.opts.shouldFocusInput(this)) {
                    this.focusser.focus();
                }
            }
        },

        // single
        isFocused: function () {
            return this.container.hasClass("select2-container-active");
        },

        // single
        cancel: function () {
            this.parent.cancel.apply(this, arguments);
            this.focusser.prop("disabled", false);

            if (this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }
        },

        // single
        destroy: function() {
            $("label[for='" + this.focusser.attr('id') + "']")
                .attr('for', this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);

            cleanupJQueryElements.call(this,
                "selection",
                "focusser"
            );
        },

        // single
        initContainer: function () {

            var selection,
                container = this.container,
                dropdown = this.dropdown,
                idSuffix = nextUid(),
                elementLabel;

            if (this.opts.minimumResultsForSearch < 0) {
                this.showSearch(false);
            } else {
                this.showSearch(true);
            }

            this.selection = selection = container.find(".select2-choice");

            this.focusser = container.find(".select2-focusser");

            // add aria associations
            selection.find(".select2-chosen").attr("id", "select2-chosen-"+idSuffix);
            this.focusser.attr("aria-labelledby", "select2-chosen-"+idSuffix);
            this.results.attr("id", "select2-results-"+idSuffix);
            this.search.attr("aria-owns", "select2-results-"+idSuffix);

            // rewrite labels from original element to focusser
            this.focusser.attr("id", "s2id_autogen"+idSuffix);

            elementLabel = $("label[for='" + this.opts.element.attr("id") + "']");

            this.focusser.prev()
                .text(elementLabel.text())
                .attr('for', this.focusser.attr('id'));

            // Ensure the original element retains an accessible name
            var originalTitle = this.opts.element.attr("title");
            this.opts.element.attr("title", (originalTitle || elementLabel.text()));

            this.focusser.attr("tabindex", this.elementTabIndex);

            // write label for search field using the label from the focusser element
            this.search.attr("id", this.focusser.attr('id') + '_search');

            this.search.prev()
                .text($("label[for='" + this.focusser.attr('id') + "']").text())
                .attr('for', this.search.attr('id'));

            this.search.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                    return;
                }

                switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.TAB:
                        this.selectHighlighted({noFocus: true});
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                }
            }));

            this.search.on("blur", this.bind(function(e) {
                // a workaround for chrome to keep the search field focussed when the scroll bar is used to scroll the dropdown.
                // without this the search field loses focus which is annoying
                if (document.activeElement === this.body.get(0)) {
                    window.setTimeout(this.bind(function() {
                        if (this.opened()) {
                            this.search.focus();
                        }
                    }), 0);
                }
            }));

            this.focusser.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                    return;
                }

                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DOWN || e.which == KEY.UP
                    || (e.which == KEY.ENTER && this.opts.openOnEnter)) {

                    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;

                    this.open();
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                    if (this.opts.allowClear) {
                        this.clear();
                    }
                    killEvent(e);
                    return;
                }
            }));


            installKeyUpChangeEvent(this.focusser);
            this.focusser.on("keyup-change input", this.bind(function(e) {
                if (this.opts.minimumResultsForSearch >= 0) {
                    e.stopPropagation();
                    if (this.opened()) return;
                    this.open();
                }
            }));

            selection.on("mousedown touchstart", "abbr", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;
                this.selection.focus();
                this.clear();
                killEventImmediately(e);
                this.close();
            }));

            selection.on("mousedown touchstart", this.bind(function (e) {
                // Prevent IE from generating a click event on the body
                reinsertElement(selection);

                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }

                if (this.opened()) {
                    this.close();
                } else if (this.isInterfaceEnabled()) {
                    this.open();
                }

                killEvent(e);
            }));

            dropdown.on("mousedown touchstart", this.bind(function() {
                if (this.opts.shouldFocusInput(this)) {
                    this.search.focus();
                }
            }));

            selection.on("focus", this.bind(function(e) {
                killEvent(e);
            }));

            this.focusser.on("focus", this.bind(function(){
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            })).on("blur", this.bind(function() {
                if (!this.opened()) {
                    this.container.removeClass("select2-container-active");
                    this.opts.element.trigger($.Event("select2-blur"));
                }
            }));
            this.search.on("focus", this.bind(function(){
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            }));

            this.initContainerWidth();
            this.opts.element.addClass("select2-offscreen");
            this.setPlaceholder();

        },

        // single
        clear: function(triggerChange) {
            var data=this.selection.data("select2-data");
            if (data) { // guard against queued quick consecutive clicks
                var evt = $.Event("select2-clearing");
                this.opts.element.trigger(evt);
                if (evt.isDefaultPrevented()) {
                    return;
                }
                var placeholderOption = this.getPlaceholderOption();
                this.opts.element.val(placeholderOption ? placeholderOption.val() : "");
                this.selection.find(".select2-chosen").empty();
                this.selection.removeData("select2-data");
                this.setPlaceholder();

                if (triggerChange !== false){
                    this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
                    this.triggerChange({removed:data});
                }
            }
        },

        /**
         * Sets selection based on source element's value
         */
        // single
        initSelection: function () {
            var selected;
            if (this.isPlaceholderOptionSelected()) {
                this.updateSelection(null);
                this.close();
                this.setPlaceholder();
            } else {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(selected){
                    if (selected !== undefined && selected !== null) {
                        self.updateSelection(selected);
                        self.close();
                        self.setPlaceholder();
                        self.nextSearchTerm = self.opts.nextSearchTerm(selected, self.search.val());
                    }
                });
            }
        },

        isPlaceholderOptionSelected: function() {
            var placeholderOption;
            if (this.getPlaceholder() === undefined) return false; // no placeholder specified so no option should be considered
            return ((placeholderOption = this.getPlaceholderOption()) !== undefined && placeholderOption.prop("selected"))
                || (this.opts.element.val() === "")
                || (this.opts.element.val() === undefined)
                || (this.opts.element.val() === null);
        },

        // single
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments),
                self=this;

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {
                    var selected = element.find("option").filter(function() { return this.selected && !this.disabled });
                    // a single select box always has a value, no need to null check 'selected'
                    callback(self.optionToData(selected));
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var id = element.val();
                    //search in data by id, storing the actual matching item
                    var match = null;
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = equal(id, opts.id(el));
                            if (is_match) {
                                match = el;
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            callback(match);
                        }
                    });
                };
            }

            return opts;
        },

        // single
        getPlaceholder: function() {
            // if a placeholder is specified on a single select without a valid placeholder option ignore it
            if (this.select) {
                if (this.getPlaceholderOption() === undefined) {
                    return undefined;
                }
            }

            return this.parent.getPlaceholder.apply(this, arguments);
        },

        // single
        setPlaceholder: function () {
            var placeholder = this.getPlaceholder();

            if (this.isPlaceholderOptionSelected() && placeholder !== undefined) {

                // check for a placeholder option if attached to a select
                if (this.select && this.getPlaceholderOption() === undefined) return;

                this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(placeholder));

                this.selection.addClass("select2-default");

                this.container.removeClass("select2-allowclear");
            }
        },

        // single
        postprocessResults: function (data, initial, noHighlightUpdate) {
            var selected = 0, self = this, showSearchInput = true;

            // find the selected element in the result list

            this.findHighlightableChoices().each2(function (i, elm) {
                if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
                    selected = i;
                    return false;
                }
            });

            // and highlight it
            if (noHighlightUpdate !== false) {
                if (initial === true && selected >= 0) {
                    this.highlight(selected);
                } else {
                    this.highlight(0);
                }
            }

            // hide the search box if this is the first we got the results and there are enough of them for search

            if (initial === true) {
                var min = this.opts.minimumResultsForSearch;
                if (min >= 0) {
                    this.showSearch(countResults(data.results) >= min);
                }
            }
        },

        // single
        showSearch: function(showSearchInput) {
            if (this.showSearchInput === showSearchInput) return;

            this.showSearchInput = showSearchInput;

            this.dropdown.find(".select2-search").toggleClass("select2-search-hidden", !showSearchInput);
            this.dropdown.find(".select2-search").toggleClass("select2-offscreen", !showSearchInput);
            //add "select2-with-searchbox" to the container if search box is shown
            $(this.dropdown, this.container).toggleClass("select2-with-searchbox", showSearchInput);
        },

        // single
        onSelect: function (data, options) {

            if (!this.triggerSelect(data)) { return; }

            var old = this.opts.element.val(),
                oldData = this.data();

            this.opts.element.val(this.id(data));
            this.updateSelection(data);

            this.opts.element.trigger({ type: "select2-selected", val: this.id(data), choice: data });

            this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());
            this.close();

            if ((!options || !options.noFocus) && this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }

            if (!equal(old, this.id(data))) {
                this.triggerChange({ added: data, removed: oldData });
            }
        },

        // single
        updateSelection: function (data) {

            var container=this.selection.find(".select2-chosen"), formatted, cssClass;

            this.selection.data("select2-data", data);

            container.empty();
            if (data !== null) {
                formatted=this.opts.formatSelection(data, container, this.opts.escapeMarkup);
            }
            if (formatted !== undefined) {
                container.append(formatted);
            }
            cssClass=this.opts.formatSelectionCssClass(data, container);
            if (cssClass !== undefined) {
                container.addClass(cssClass);
            }

            this.selection.removeClass("select2-default");

            if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                this.container.addClass("select2-allowclear");
            }
        },

        // single
        val: function () {
            var val,
                triggerChange = false,
                data = null,
                self = this,
                oldData = this.data();

            if (arguments.length === 0) {
                return this.opts.element.val();
            }

            val = arguments[0];

            if (arguments.length > 1) {
                triggerChange = arguments[1];
            }

            if (this.select) {
                this.select
                    .val(val)
                    .find("option").filter(function() { return this.selected }).each2(function (i, elm) {
                        data = self.optionToData(elm);
                        return false;
                    });
                this.updateSelection(data);
                this.setPlaceholder();
                if (triggerChange) {
                    this.triggerChange({added: data, removed:oldData});
                }
            } else {
                // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
                if (!val && val !== 0) {
                    this.clear(triggerChange);
                    return;
                }
                if (this.opts.initSelection === undefined) {
                    throw new Error("cannot call val() if initSelection() is not defined");
                }
                this.opts.element.val(val);
                this.opts.initSelection(this.opts.element, function(data){
                    self.opts.element.val(!data ? "" : self.id(data));
                    self.updateSelection(data);
                    self.setPlaceholder();
                    if (triggerChange) {
                        self.triggerChange({added: data, removed:oldData});
                    }
                });
            }
        },

        // single
        clearSearch: function () {
            this.search.val("");
            this.focusser.val("");
        },

        // single
        data: function(value) {
            var data,
                triggerChange = false;

            if (arguments.length === 0) {
                data = this.selection.data("select2-data");
                if (data == undefined) data = null;
                return data;
            } else {
                if (arguments.length > 1) {
                    triggerChange = arguments[1];
                }
                if (!value) {
                    this.clear(triggerChange);
                } else {
                    data = this.data();
                    this.opts.element.val(!value ? "" : this.id(value));
                    this.updateSelection(value);
                    if (triggerChange) {
                        this.triggerChange({added: value, removed:data});
                    }
                }
            }
        }
    });

    MultiSelect2 = clazz(AbstractSelect2, {

        // multi
        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container select2-container-multi"
            }).html([
                "<ul class='select2-choices'>",
                "  <li class='select2-search-field'>",
                "    <label for='' class='select2-offscreen'></label>",
                "    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>",
                "  </li>",
                "</ul>",
                "<div class='select2-drop select2-drop-multi select2-display-none'>",
                "   <ul class='select2-results'>",
                "   </ul>",
                "</div>"].join(""));
            return container;
        },

        // multi
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments),
                self=this;

            // TODO validate placeholder is a string if specified

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {

                    var data = [];

                    element.find("option").filter(function() { return this.selected && !this.disabled }).each2(function (i, elm) {
                        data.push(self.optionToData(elm));
                    });
                    callback(data);
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var ids = splitVal(element.val(), opts.separator);
                    //search in data by array of ids, storing matching items in a list
                    var matches = [];
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = $.grep(ids, function(id) {
                                return equal(id, opts.id(el));
                            }).length;
                            if (is_match) {
                                matches.push(el);
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            // reorder matches based on the order they appear in the ids array because right now
                            // they are in the order in which they appear in data array
                            var ordered = [];
                            for (var i = 0; i < ids.length; i++) {
                                var id = ids[i];
                                for (var j = 0; j < matches.length; j++) {
                                    var match = matches[j];
                                    if (equal(id, opts.id(match))) {
                                        ordered.push(match);
                                        matches.splice(j, 1);
                                        break;
                                    }
                                }
                            }
                            callback(ordered);
                        }
                    });
                };
            }

            return opts;
        },

        // multi
        selectChoice: function (choice) {

            var selected = this.container.find(".select2-search-choice-focus");
            if (selected.length && choice && choice[0] == selected[0]) {

            } else {
                if (selected.length) {
                    this.opts.element.trigger("choice-deselected", selected);
                }
                selected.removeClass("select2-search-choice-focus");
                if (choice && choice.length) {
                    this.close();
                    choice.addClass("select2-search-choice-focus");
                    this.opts.element.trigger("choice-selected", choice);
                }
            }
        },

        // multi
        destroy: function() {
            $("label[for='" + this.search.attr('id') + "']")
                .attr('for', this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);

            cleanupJQueryElements.call(this,
                "searchContainer",
                "selection"
            );
        },

        // multi
        initContainer: function () {

            var selector = ".select2-choices", selection;

            this.searchContainer = this.container.find(".select2-search-field");
            this.selection = selection = this.container.find(selector);

            var _this = this;
            this.selection.on("click", ".select2-search-choice:not(.select2-locked)", function (e) {
                //killEvent(e);
                _this.search[0].focus();
                _this.selectChoice($(this));
            });

            // rewrite labels from original element to focusser
            this.search.attr("id", "s2id_autogen"+nextUid());

            this.search.prev()
                .text($("label[for='" + this.opts.element.attr("id") + "']").text())
                .attr('for', this.search.attr('id'));

            this.search.on("input paste", this.bind(function() {
                if (this.search.attr('placeholder') && this.search.val().length == 0) return;
                if (!this.isInterfaceEnabled()) return;
                if (!this.opened()) {
                    this.open();
                }
            }));

            this.search.attr("tabindex", this.elementTabIndex);

            this.keydowns = 0;
            this.search.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                ++this.keydowns;
                var selected = selection.find(".select2-search-choice-focus");
                var prev = selected.prev(".select2-search-choice:not(.select2-locked)");
                var next = selected.next(".select2-search-choice:not(.select2-locked)");
                var pos = getCursorInfo(this.search);

                if (selected.length &&
                    (e.which == KEY.LEFT || e.which == KEY.RIGHT || e.which == KEY.BACKSPACE || e.which == KEY.DELETE || e.which == KEY.ENTER)) {
                    var selectedChoice = selected;
                    if (e.which == KEY.LEFT && prev.length) {
                        selectedChoice = prev;
                    }
                    else if (e.which == KEY.RIGHT) {
                        selectedChoice = next.length ? next : null;
                    }
                    else if (e.which === KEY.BACKSPACE) {
                        if (this.unselect(selected.first())) {
                            this.search.width(10);
                            selectedChoice = prev.length ? prev : next;
                        }
                    } else if (e.which == KEY.DELETE) {
                        if (this.unselect(selected.first())) {
                            this.search.width(10);
                            selectedChoice = next.length ? next : null;
                        }
                    } else if (e.which == KEY.ENTER) {
                        selectedChoice = null;
                    }

                    this.selectChoice(selectedChoice);
                    killEvent(e);
                    if (!selectedChoice || !selectedChoice.length) {
                        this.open();
                    }
                    return;
                } else if (((e.which === KEY.BACKSPACE && this.keydowns == 1)
                    || e.which == KEY.LEFT) && (pos.offset == 0 && !pos.length)) {

                    this.selectChoice(selection.find(".select2-search-choice:not(.select2-locked)").last());
                    killEvent(e);
                    return;
                } else {
                    this.selectChoice(null);
                }

                if (this.opened()) {
                    switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.TAB:
                        this.selectHighlighted({noFocus:true});
                        this.close();
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                    }
                }

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e)
                 || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                    return;
                }

                if (e.which === KEY.ENTER) {
                    if (this.opts.openOnEnter === false) {
                        return;
                    } else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
                        return;
                    }
                }

                this.open();

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                }

                if (e.which === KEY.ENTER) {
                    // prevent form from being submitted
                    killEvent(e);
                }

            }));

            this.search.on("keyup", this.bind(function (e) {
                this.keydowns = 0;
                this.resizeSearch();
            })
            );

            this.search.on("blur", this.bind(function(e) {
                this.container.removeClass("select2-container-active");
                this.search.removeClass("select2-focused");
                this.selectChoice(null);
                if (!this.opened()) this.clearSearch();
                e.stopImmediatePropagation();
                this.opts.element.trigger($.Event("select2-blur"));
            }));

            this.container.on("click", selector, this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;
                if ($(e.target).closest(".select2-search-choice").length > 0) {
                    // clicked inside a select2 search choice, do not open
                    return;
                }
                this.selectChoice(null);
                this.clearPlaceholder();
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.open();
                this.focusSearch();
                e.preventDefault();
            }));

            this.container.on("focus", selector, this.bind(function () {
                if (!this.isInterfaceEnabled()) return;
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
                this.dropdown.addClass("select2-drop-active");
                this.clearPlaceholder();
            }));

            this.initContainerWidth();
            this.opts.element.addClass("select2-offscreen");

            // set the placeholder if necessary
            this.clearSearch();
        },

        // multi
        enableInterface: function() {
            if (this.parent.enableInterface.apply(this, arguments)) {
                this.search.prop("disabled", !this.isInterfaceEnabled());
            }
        },

        // multi
        initSelection: function () {
            var data;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                this.updateSelection([]);
                this.close();
                // set the placeholder if necessary
                this.clearSearch();
            }
            if (this.select || this.opts.element.val() !== "") {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(data){
                    if (data !== undefined && data !== null) {
                        self.updateSelection(data);
                        self.close();
                        // set the placeholder if necessary
                        self.clearSearch();
                    }
                });
            }
        },

        // multi
        clearSearch: function () {
            var placeholder = this.getPlaceholder(),
                maxWidth = this.getMaxSearchWidth();

            if (placeholder !== undefined  && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
                this.search.val(placeholder).addClass("select2-default");
                // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                // we could call this.resizeSearch(), but we do not because that requires a sizer and we do not want to create one so early because of a firefox bug, see #944
                this.search.width(maxWidth > 0 ? maxWidth : this.container.css("width"));
            } else {
                this.search.val("").width(10);
            }
        },

        // multi
        clearPlaceholder: function () {
            if (this.search.hasClass("select2-default")) {
                this.search.val("").removeClass("select2-default");
            }
        },

        // multi
        opening: function () {
            this.clearPlaceholder(); // should be done before super so placeholder is not used to search
            this.resizeSearch();

            this.parent.opening.apply(this, arguments);

            this.focusSearch();

            // initializes search's value with nextSearchTerm (if defined by user)
            // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
            if(this.search.val() === "") {
                if(this.nextSearchTerm != undefined){
                    this.search.val(this.nextSearchTerm);
                    this.search.select();
                }
            }

            this.updateResults(true);
            if (this.opts.shouldFocusInput(this)) {
                this.search.focus();
            }
            this.opts.element.trigger($.Event("select2-open"));
        },

        // multi
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
        },

        // multi
        focus: function () {
            this.close();
            this.search.focus();
        },

        // multi
        isFocused: function () {
            return this.search.hasClass("select2-focused");
        },

        // multi
        updateSelection: function (data) {
            var ids = [], filtered = [], self = this;

            // filter out duplicates
            $(data).each(function () {
                if (indexOf(self.id(this), ids) < 0) {
                    ids.push(self.id(this));
                    filtered.push(this);
                }
            });
            data = filtered;

            this.selection.find(".select2-search-choice").remove();
            $(data).each(function () {
                self.addSelectedChoice(this);
            });
            self.postprocessResults();
        },

        // multi
        tokenize: function() {
            var input = this.search.val();
            input = this.opts.tokenizer.call(this, input, this.data(), this.bind(this.onSelect), this.opts);
            if (input != null && input != undefined) {
                this.search.val(input);
                if (input.length > 0) {
                    this.open();
                }
            }

        },

        // multi
        onSelect: function (data, options) {

            if (!this.triggerSelect(data)) { return; }

            this.addSelectedChoice(data);

            this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data });

            // keep track of the search's value before it gets cleared
            this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());

            this.clearSearch();
            this.updateResults();

            if (this.select || !this.opts.closeOnSelect) this.postprocessResults(data, false, this.opts.closeOnSelect===true);

            if (this.opts.closeOnSelect) {
                this.close();
                this.search.width(10);
            } else {
                if (this.countSelectableResults()>0) {
                    this.search.width(10);
                    this.resizeSearch();
                    if (this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize()) {
                        // if we reached max selection size repaint the results so choices
                        // are replaced with the max selection reached message
                        this.updateResults(true);
                    } else {
                        // initializes search's value with nextSearchTerm and update search result
                        if(this.nextSearchTerm != undefined){
                            this.search.val(this.nextSearchTerm);
                            this.updateResults();
                            this.search.select();
                        }
                    }
                    this.positionDropdown();
                } else {
                    // if nothing left to select close
                    this.close();
                    this.search.width(10);
                }
            }

            // since its not possible to select an element that has already been
            // added we do not need to check if this is a new element before firing change
            this.triggerChange({ added: data });

            if (!options || !options.noFocus)
                this.focusSearch();
        },

        // multi
        cancel: function () {
            this.close();
            this.focusSearch();
        },

        addSelectedChoice: function (data) {
            var enableChoice = !data.locked,
                enabledItem = $(
                    "<li class='select2-search-choice'>" +
                    "    <div></div>" +
                    "    <a href='#' class='select2-search-choice-close' tabindex='-1'></a>" +
                    "</li>"),
                disabledItem = $(
                    "<li class='select2-search-choice select2-locked'>" +
                    "<div></div>" +
                    "</li>");
            var choice = enableChoice ? enabledItem : disabledItem,
                id = this.id(data),
                val = this.getVal(),
                formatted,
                cssClass;

            formatted=this.opts.formatSelection(data, choice.find("div"), this.opts.escapeMarkup);
            if (formatted != undefined) {
                choice.find("div").replaceWith("<div>"+formatted+"</div>");
            }
            cssClass=this.opts.formatSelectionCssClass(data, choice.find("div"));
            if (cssClass != undefined) {
                choice.addClass(cssClass);
            }

            if(enableChoice){
              choice.find(".select2-search-choice-close")
                  .on("mousedown", killEvent)
                  .on("click dblclick", this.bind(function (e) {
                  if (!this.isInterfaceEnabled()) return;

                  this.unselect($(e.target));
                  this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                  killEvent(e);
                  this.close();
                  this.focusSearch();
              })).on("focus", this.bind(function () {
                  if (!this.isInterfaceEnabled()) return;
                  this.container.addClass("select2-container-active");
                  this.dropdown.addClass("select2-drop-active");
              }));
            }

            choice.data("select2-data", data);
            choice.insertBefore(this.searchContainer);

            val.push(id);
            this.setVal(val);
        },

        // multi
        unselect: function (selected) {
            var val = this.getVal(),
                data,
                index;
            selected = selected.closest(".select2-search-choice");

            if (selected.length === 0) {
                throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
            }

            data = selected.data("select2-data");

            if (!data) {
                // prevent a race condition when the 'x' is clicked really fast repeatedly the event can be queued
                // and invoked on an element already removed
                return;
            }

            var evt = $.Event("select2-removing");
            evt.val = this.id(data);
            evt.choice = data;
            this.opts.element.trigger(evt);

            if (evt.isDefaultPrevented()) {
                return false;
            }

            while((index = indexOf(this.id(data), val)) >= 0) {
                val.splice(index, 1);
                this.setVal(val);
                if (this.select) this.postprocessResults();
            }

            selected.remove();

            this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
            this.triggerChange({ removed: data });

            return true;
        },

        // multi
        postprocessResults: function (data, initial, noHighlightUpdate) {
            var val = this.getVal(),
                choices = this.results.find(".select2-result"),
                compound = this.results.find(".select2-result-with-children"),
                self = this;

            choices.each2(function (i, choice) {
                var id = self.id(choice.data("select2-data"));
                if (indexOf(id, val) >= 0) {
                    choice.addClass("select2-selected");
                    // mark all children of the selected parent as selected
                    choice.find(".select2-result-selectable").addClass("select2-selected");
                }
            });

            compound.each2(function(i, choice) {
                // hide an optgroup if it doesn't have any selectable children
                if (!choice.is('.select2-result-selectable')
                    && choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) {
                    choice.addClass("select2-selected");
                }
            });

            if (this.highlight() == -1 && noHighlightUpdate !== false){
                self.highlight(0);
            }

            //If all results are chosen render formatNoMatches
            if(!this.opts.createSearchChoice && !choices.filter('.select2-result:not(.select2-selected)').length > 0){
                if(!data || data && !data.more && this.results.find(".select2-no-results").length === 0) {
                    if (checkFormatter(self.opts.formatNoMatches, "formatNoMatches")) {
                        this.results.append("<li class='select2-no-results'>" + evaluate(self.opts.formatNoMatches, self.opts.element, self.search.val()) + "</li>");
                    }
                }
            }

        },

        // multi
        getMaxSearchWidth: function() {
            return this.selection.width() - getSideBorderPadding(this.search);
        },

        // multi
        resizeSearch: function () {
            var minimumWidth, left, maxWidth, containerLeft, searchWidth,
                sideBorderPadding = getSideBorderPadding(this.search);

            minimumWidth = measureTextWidth(this.search) + 10;

            left = this.search.offset().left;

            maxWidth = this.selection.width();
            containerLeft = this.selection.offset().left;

            searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;

            if (searchWidth < minimumWidth) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth < 40) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth <= 0) {
              searchWidth = minimumWidth;
            }

            this.search.width(Math.floor(searchWidth));
        },

        // multi
        getVal: function () {
            var val;
            if (this.select) {
                val = this.select.val();
                return val === null ? [] : val;
            } else {
                val = this.opts.element.val();
                return splitVal(val, this.opts.separator);
            }
        },

        // multi
        setVal: function (val) {
            var unique;
            if (this.select) {
                this.select.val(val);
            } else {
                unique = [];
                // filter out duplicates
                $(val).each(function () {
                    if (indexOf(this, unique) < 0) unique.push(this);
                });
                this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
            }
        },

        // multi
        buildChangeDetails: function (old, current) {
            var current = current.slice(0),
                old = old.slice(0);

            // remove intersection from each array
            for (var i = 0; i < current.length; i++) {
                for (var j = 0; j < old.length; j++) {
                    if (equal(this.opts.id(current[i]), this.opts.id(old[j]))) {
                        current.splice(i, 1);
                        if(i>0){
                        	i--;
                        }
                        old.splice(j, 1);
                        j--;
                    }
                }
            }

            return {added: current, removed: old};
        },


        // multi
        val: function (val, triggerChange) {
            var oldData, self=this;

            if (arguments.length === 0) {
                return this.getVal();
            }

            oldData=this.data();
            if (!oldData.length) oldData=[];

            // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
            if (!val && val !== 0) {
                this.opts.element.val("");
                this.updateSelection([]);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange({added: this.data(), removed: oldData});
                }
                return;
            }

            // val is a list of ids
            this.setVal(val);

            if (this.select) {
                this.opts.initSelection(this.select, this.bind(this.updateSelection));
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(oldData, this.data()));
                }
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("val() cannot be called if initSelection() is not defined");
                }

                this.opts.initSelection(this.opts.element, function(data){
                    var ids=$.map(data, self.id);
                    self.setVal(ids);
                    self.updateSelection(data);
                    self.clearSearch();
                    if (triggerChange) {
                        self.triggerChange(self.buildChangeDetails(oldData, self.data()));
                    }
                });
            }
            this.clearSearch();
        },

        // multi
        onSortStart: function() {
            if (this.select) {
                throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
            }

            // collapse search field into 0 width so its container can be collapsed as well
            this.search.width(0);
            // hide the container
            this.searchContainer.hide();
        },

        // multi
        onSortEnd:function() {

            var val=[], self=this;

            // show search and move it to the end of the list
            this.searchContainer.show();
            // make sure the search container is the last item in the list
            this.searchContainer.appendTo(this.searchContainer.parent());
            // since we collapsed the width in dragStarted, we resize it here
            this.resizeSearch();

            // update selection
            this.selection.find(".select2-search-choice").each(function() {
                val.push(self.opts.id($(this).data("select2-data")));
            });
            this.setVal(val);
            this.triggerChange();
        },

        // multi
        data: function(values, triggerChange) {
            var self=this, ids, old;
            if (arguments.length === 0) {
                 return this.selection
                     .children(".select2-search-choice")
                     .map(function() { return $(this).data("select2-data"); })
                     .get();
            } else {
                old = this.data();
                if (!values) { values = []; }
                ids = $.map(values, function(e) { return self.opts.id(e); });
                this.setVal(ids);
                this.updateSelection(values);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(old, this.data()));
                }
            }
        }
    });

    $.fn.select2 = function () {

        var args = Array.prototype.slice.call(arguments, 0),
            opts,
            select2,
            method, value, multiple,
            allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "dropdown", "onSortStart", "onSortEnd", "enable", "disable", "readonly", "positionDropdown", "data", "search"],
            valueMethods = ["opened", "isFocused", "container", "dropdown"],
            propertyMethods = ["val", "data"],
            methodsMap = { search: "externalSearch" };

        this.each(function () {
            if (args.length === 0 || typeof(args[0]) === "object") {
                opts = args.length === 0 ? {} : $.extend({}, args[0]);
                opts.element = $(this);

                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    multiple = opts.element.prop("multiple");
                } else {
                    multiple = opts.multiple || false;
                    if ("tags" in opts) {opts.multiple = multiple = true;}
                }

                select2 = multiple ? new window.Select2["class"].multi() : new window.Select2["class"].single();
                select2.init(opts);
            } else if (typeof(args[0]) === "string") {

                if (indexOf(args[0], allowedMethods) < 0) {
                    throw "Unknown method: " + args[0];
                }

                value = undefined;
                select2 = $(this).data("select2");
                if (select2 === undefined) return;

                method=args[0];

                if (method === "container") {
                    value = select2.container;
                } else if (method === "dropdown") {
                    value = select2.dropdown;
                } else {
                    if (methodsMap[method]) method = methodsMap[method];

                    value = select2[method].apply(select2, args.slice(1));
                }
                if (indexOf(args[0], valueMethods) >= 0
                    || (indexOf(args[0], propertyMethods) >= 0 && args.length == 1)) {
                    return false; // abort the iteration, ready to return first matched value
                }
            } else {
                throw "Invalid arguments to select2 plugin: " + args;
            }
        });
        return (value === undefined) ? this : value;
    };

    // plugin defaults, accessible to users
    $.fn.select2.defaults = {
        width: "copy",
        loadMorePadding: 0,
        closeOnSelect: true,
        openOnEnter: true,
        containerCss: {},
        dropdownCss: {},
        containerCssClass: "",
        dropdownCssClass: "",
        formatResult: function(result, container, query, escapeMarkup) {
            var markup=[];
            markMatch(result.text, query.term, markup, escapeMarkup);
            return markup.join("");
        },
        formatSelection: function (data, container, escapeMarkup) {
            return data ? escapeMarkup(data.text) : undefined;
        },
        sortResults: function (results, container, query) {
            return results;
        },
        formatResultCssClass: function(data) {return data.css;},
        formatSelectionCssClass: function(data, container) {return undefined;},
        formatMatches: function (matches) { if (matches === 1) { return "One result is available, press enter to select it."; } return matches + " results are available, use up and down arrow keys to navigate."; },
        formatNoMatches: function () { return "No matches found"; },
        formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " or more character" + (n == 1? "" : "s"); },
        formatInputTooLong: function (input, max) { var n = input.length - max; return "Please delete " + n + " character" + (n == 1? "" : "s"); },
        formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
        formatLoadMore: function (pageNumber) { return "Loading more results…"; },
        formatSearching: function () { return "Searching…"; },
        minimumResultsForSearch: 0,
        minimumInputLength: 0,
        maximumInputLength: null,
        maximumSelectionSize: 0,
        id: function (e) { return e == undefined ? null : e.id; },
        matcher: function(term, text) {
            return stripDiacritics(''+text).toUpperCase().indexOf(stripDiacritics(''+term).toUpperCase()) >= 0;
        },
        separator: ",",
        tokenSeparators: [],
        tokenizer: defaultTokenizer,
        escapeMarkup: defaultEscapeMarkup,
        blurOnChange: false,
        selectOnBlur: false,
        adaptContainerCssClass: function(c) { return c; },
        adaptDropdownCssClass: function(c) { return null; },
        nextSearchTerm: function(selectedObject, currentSearchTerm) { return undefined; },
        searchInputPlaceholder: '',
        createSearchChoicePosition: 'top',
        shouldFocusInput: function (instance) {
            // Attempt to detect touch devices
            var supportsTouchEvents = (('ontouchstart' in window) ||
                                       (navigator.msMaxTouchPoints > 0));

            // Only devices which support touch events should be special cased
            if (!supportsTouchEvents) {
                return true;
            }

            // Never focus the input if search is disabled
            if (instance.opts.minimumResultsForSearch < 0) {
                return false;
            }

            return true;
        }
    };

    $.fn.select2.ajaxDefaults = {
        transport: $.ajax,
        params: {
            type: "GET",
            cache: false,
            dataType: "json"
        }
    };

    // exports
    window.Select2 = {
        query: {
            ajax: ajax,
            local: local,
            tags: tags
        }, util: {
            debounce: debounce,
            markMatch: markMatch,
            escapeMarkup: defaultEscapeMarkup,
            stripDiacritics: stripDiacritics
        }, "class": {
            "abstract": AbstractSelect2,
            "single": SingleSelect2,
            "multi": MultiSelect2
        }
    };

}(jQuery));

define("select2", function(){});

/*
 * Canvas.js
 *
 * Overall module for editing or viewing rspecs, profiles, and slices
 *
 */

define('js/canvas/Canvas',['underscore', 'backbone', 'lib/PrettyXML',
	'js/canvas/Constraints',
	'js/canvas/rspecParser', 'js/canvas/rspecGenerator',
	'js/canvas/TourView', 'js/canvas/TopologyView',
	'js/canvas/TopologyModel',
	'js/info/Info', 'js/info/ConstrainedField', 'js/canvas/ErrorModal',
	'text!html/Canvas.html', 'text!html/AddNode.html',
	'text!html/rspec.xml',
	'select2'],
function (_, Backbone, PrettyXML,
	  Constraints, rspecParser, rspecGenerator,
	  TourView, TopologyView, TopologyModel,
	  Info, ConstrainedField, ErrorModal,
	  canvasString, addNodeString, defaultRspecString)
{
  

  var addNodeTemplate = _.template(addNodeString);

  function Canvas(context, domRoot, tourContainer, updateIn, updateOut)
  {
    this.context = context;
    this.constraints = new Constraints(context);
    this.domRoot = domRoot;
    this.tourContainer = tourContainer;
    this.updateIn = updateIn;
    this.updateOut = updateOut;
    this.size = context.size;
    this.highlights = [];
    this.lastHighlightEvent = null;
    this.rspecShowing = false;
    this.info = new Info({
      context: context,
      constraints: this.constraints
    });
    domRoot.html(canvasString);
    this.errorModal = new ErrorModal();
    this.errorModal.render($('#error-modal'));

    this.info.render(domRoot.find('.nodeAttr'));
    this.info.on('change', _.bind(this.changeAttribute, this));
    this.info.on('addToList', _.bind(this.addToList, this));
    this.info.on('removeFromList', _.bind(this.removeFromList, this));
    this.info.on('changeList', _.bind(this.changeList, this));

    this.singleSite = new ConstrainedField({
      choices: context.canvasOptions.aggregates,
      constraints: this.info.constraints,
      optionKey: 'aggregates',
    });
    this.singleSite.render(domRoot.find('#fbcSite'));
    this.singleSite.on('change', _.bind(this.changeSingleSite, this));

    this.clickUpdate = {};
    _.extend(this.clickUpdate, Backbone.Events);

    if (this.context.nodeSelect === false) {
      this.clickUpdate.on("click-event", function(data) {
	var out = {};
	if (data.type === 'node')
	{
	  out = {
	    'type': 'node',
	    'client_id': data.item.name,
	    'ssh': data.item.sshurl
	  };
	}
	else if (data.type === 'link')
	{
	  out = {
	    'type': 'link',
	    'client_id': data.item.name
	  };
	}
	else if (data.type === 'site')
	{
	  out = {
	    'type': 'site'
	  };
	}
	out.event = data.event;
        updateOut.trigger("click-event", out);
      });
    }
    else {
      this.clickUpdate.on("click-event", _.bind(this.handleClick, this));
      this.clickUpdate.on("click-outside", _.bind(this.handleClickOutside, this));
    }
    if (_.isString(context.size) && context.size === 'auto')
    {
      this.lastSize = {
	x: null,
	y: null
      };
      setInterval(_.bind(this.checkResize, this), 100);
    }
    this.updateIn.on('show-rspec', _.bind(this.viewRspec, this));
  }

  Canvas.prototype.hasNodes = function ()
  {
    return _.keys(this.topoData.nodes).length > 0;
  }

  Canvas.prototype.show = function ()
  {
    var that = this;
    var root = this.domRoot;
    this.rspec = defaultRspecString;
    if (! this.context.show.menu)
    {
      root.find('.withButtonBar').removeClass('withButtonBar');
      root.find('.editor#topoButtons, .viewer#topoButtons').hide();
    }

    if (_.isObject(this.context.size))
    {
      root.css('width', this.context.size.x + 'px');
      root.css('height', this.context.size.y + 'px');
    }

    showCommon(this.rspec, that, root);
    this.updateSingleSite();
    if (this.context.mode === 'viewer') {
      showViewer(this.rspec, that, root);
    }
    else if (this.context.mode === 'editor') {
      showEditor(this.rspec, that, root);
    }
  };

  Canvas.prototype.hide = function ()
  {
    this.domRoot.hide();
  };

  Canvas.prototype.clear = function ()
  {
    this.highlights = [];
    this.topology.setHighlights(this.highlights);
    this.showAttributes();
    this.topoData.removeLinks(_.keys(this.topoData.lans));
    this.topoData.removeNodes(_.keys(this.topoData.nodes));
    this.topoData.removeSites(_.keys(this.topoData.sites));
  };

  Canvas.prototype.checkResize = function (force)
  {
    var topoDom = this.domRoot.find('#topoContainer');
    var newSize = {
      x: topoDom.outerWidth(),
      y: topoDom.outerHeight()
    };
    if (! this.lastSize ||
	newSize.x !== this.lastSize.x ||
	newSize.y !== this.lastSize.y || force)
    {
      this.lastSize = newSize;
      this.resize(newSize);
    }
  };

  Canvas.prototype.calculateSize = function ()
  {
    var topoDom = this.domRoot.find('#topoContainer');
    var size = {
      x: topoDom.outerWidth(),
      y: topoDom.outerHeight()
    };
    if (_.isObject(this.context.size))
    {
      size = {
	x: this.context.size.x,
	y: this.context.size.y
      };
    }
    return size;
  };

  Canvas.prototype.resize = function (size)
  {
    var topoDom = this.domRoot.find('#topoContainer');
    this.size = size;
    this.topology.resize(size.x, size.y);
  };

  Canvas.prototype.generateRequest = function () {
    return rspecGenerator.request(this.topoData, this.context);
  };

  Canvas.prototype.viewRspec = function () {
    if (! this.rspecShowing)
    {
      var request = rspecGenerator.request(this.topoData, this.context);
      this.domRoot.find('#lnRspec').html('<pre>' +
					 _.escape(PrettyXML.format(request)) +
					 '</pre>');
      this.domRoot.find('.navRspec').show();
      this.rspecShowing = true;
      $('html').css('-webkit-user-select', '');
      $('html').css('-moz-user-select', '');
    }
    else
    {
      this.hideRspec();
    }
  };

  Canvas.prototype.hideRspec = function () {
    this.domRoot.find('.navRspec').hide();
    this.rspecShowing = false;
  };

  Canvas.prototype.addRspec = function (list) {
    var that = this;
    _.each(list, function (item) {
      var newGraph =
	rspecParser.parse({
	  rspec: item.rspec,
	  context: that.context,
	  errorModal: that.errorModal
	})
      that.topoData.addGraph(newGraph);
    });
    if (list.length > 0)
    {
      this.topology.startForce();
    }
  };

  Canvas.prototype.modifiedTopology = function () {
    _.defer(function () {
      this.updateOut.trigger('modified-topology',
			     this.generateModifiedData(true));
    }.bind(this));
  }

  Canvas.prototype.modifiedField = function () {
    if (! this.pendingModifiedField)
    {
      this.pendingModifiedField = true;
      _.defer(function () {
	this.updateOut.trigger('modified', this.generateModifiedData(false));
	this.pendingModifiedField = false;
      }.bind(this));
    }
  }

  Canvas.prototype.generateModifiedData = function (makeRspec) {
    var data = {};
    if (makeRspec)
    {
      data.rspec = PrettyXML.format(rspecGenerator.request(this.topoData,
							   this.context));
    }
    data.nodes = [];
    _.each(this.topoData.nodes, function (node) {
	var nodeData = {
	  id: node.id,
	  client_id: node.name,
	  sliver_id: node.sliverId
	};
	if (node.group)
	{
	  var site = this.topoData.sites[node.group];
	  if (site.urn)
	  {
	    nodeData.aggregate_id = site.urn;
	  }
	  if (site.name)
	  {
	    nodeData.site_name = site.name;
	  }
	}
	data.nodes.push(nodeData);
    }.bind(this));
    data.links = [];
    _.each(this.topoData.lans, function (link) {
	data.links.push({
	  id: link.id,
	  client_id: link.name,
	  link_type: link.linkType
	});
    }.bind(this));
    data.sites = [];
    _.each(this.topoData.sites, function (site) {
	siteData = {
	  id: site.id,
	};
	if (site.name)
	{
	  siteData.name = site.name;
	}
	if (site.urn)
	{
	  siteData.urn = site.urn;
	}
	data.sites.push(siteData);
    }.bind(this));
    return data;
  };

  function showCommon(rspec, that, root)
  {
    if (! that.context.show.rspec)
    {
      root.find('#fbRspec').hide();//css('visibility', 'hidden');
      root.find('#fbcRspec').hide();//css('visibility', 'hidden');
    }
    if (! that.context.show.tour)
    {
      root.find('#fbTour').css('visibility', 'hidden');
    }
    if (! that.context.show.version)
    {
      root.find('#versionNumber').css('visibility', 'hidden');
    }
    root.find('#fbRspec').click(_.bind(that.viewRspec, that));
    root.find('#fbcRspec').click(_.bind(that.viewRspec, that));
    root.find('#hideRspec').click(_.bind(that.hideRspec, that));
    root.find('#hideLeftPane').click(_.bind(that.handleClickOutside, that));
    root.find('.navRspec').blur(function() {
      setTimeout(function() {
	enableButton(root.find('#fbRspec'));
	enableButton(root.find('#fbcRspec'));
      }, 250);
    });
    root.find('#fbTour').click(function (event) {
      event.preventDefault();
      that.tour.tour.start();
    });
    root.find('#fbcCleanup').click(function (event) {
      that.topology.startForce();
    });

    var topoDom = that.domRoot.find('#topoContainer');
    var size = that.calculateSize();

    that.topoData = new TopologyModel(that.context, that.constraints, that.errorModal);
    that.topoData.on('addSites addNodes addLans addEndpoint ' +
		     'removeSites removeNodes removeLans removeEndpoint ' +
		     'changeAggregate ',
		     _.bind(that.modifiedTopology, that));
    that.topoData.on('change', _.bind(that.modifiedField, that));
    that.topoData.on('addSites removeSites changeAggregate',
		     _.bind(that.updateSingleSite, that));
    that.topoData.on('change', _.bind(that.showAttributes, that));
    that.tour = new TourView(topoDom, that.tourContainer, rspec);
    that.topology = new TopologyView({ el: topoDom,
				       model: that.topoData,
				       clickUpdate: that.clickUpdate,
				       defaults: that.context.canvasOptions.defaults,
				       tour: that.tour,
				       context: that.context,
				       constraints: that.constraints,
				       errorModal: that.errorModal });
    that.topoData.addGraph(rspecParser.parse({
      rspec: rspec,
      context: that.context,
      errorModal: that.errorModal
    }));
    if (_.isString(that.context.size) && that.context.size === 'auto')
    {
      that.checkResize(true);
    }
    else
    {
      that.resize(that.size);
    }

    if (that.context.mode === 'editor' ||
	(that.context.nodeSelect && that.context.show.selectInfo))
    {
      slideOutStatic(that.domRoot.find('.nodeAttr'), that.domRoot.find('.closeContainer'));
      that.showAttributes();
    }
  }

  function showViewer(rspec, that, root)
  {
    if (that.context.show.selectInfo)
    {
      root.find('#viewer-default').show();
    }
    root.find('#topoButtons.viewer').removeClass('hidden');

    root.find('#fbSlice').click(function() {
      slideOut(root.find('.navSlices'), root.find('#fbSlice'));
    });
    root.find('.navSlices').blur(function() {
      setTimeout(function() {
	enableButton(root.find('#fbSlice'));
      }, 250);
    });
    if (that.context.show.tour)
    {
      root.find('#fbTour').popover({
	title: 'Start Tour',
	content: '<p>This slice has a tour which describe how it works. ' +
	  'Click here to view it.</p>',
	html: true,
	placement: 'bottom',
	trigger: 'manual'
      });
    }

    if (that.tour.nonTrivial())
    {
      root.find('#fbTour').show();
      _.defer(function () { root.find('#fbTour').popover('show'); });
      $('body').one('click', function () {
	root.find('#fbTour').popover('hide');
      });
    }
    else
    {
      root.find('#fbTour').hide();
    }

    if (that.context.source === 'api')
    {
      root.find('#fbSlice').show();
    }
    else
    {
      root.find('#fbSlice').hide();
    }

    root.find('#naDelete').hide();
  }

  function showEditor(rspec, that, root)
  {
    if (that.context.show.clear)
    {
		 
      root.find('#fbcClear').click(function () {
	this.clear();
	this.topoData.addGraph(rspecParser.parse({
	  rspec: defaultRspecString,
	  context: this.context,
	  errorModal: this.errorModal
	}));
      }.bind(that));
	   $('#fbcClear').click(function () {
	this.clear();
	this.topoData.addGraph(rspecParser.parse({
	  rspec: defaultRspecString,
	  context: this.context,
	  errorModal: this.errorModal
	}));
      }.bind(that));
    }
    else
    {
      root.find('#fbcClear').hide();
    }

    root.find('#topoButtons.editor').removeClass('hidden');
  }

  Canvas.prototype.handleClick = function(data) 
  {
    if (this.lastHighlightType !== data.type)
    {
      this.highlights = [];
    }
    this.lastHighlightType = data.type;
    this.lastHighlightEvent = data.event;

    if (data.modkey)
    {
      if (_.contains(this.highlights, data.item.id))
      {
        this.highlights = _.without(this.highlights, data.item.id)
      }
      else
      {
        this.highlights.push(data.item.id);
      }
    }
    else
    {
      if (this.highlights !== undefined &&
	  this.highlights.length === 1 &&
	  _.contains(this.highlights, data.item.id))
      {
        this.highlights = [];
      }
      else
      {
        this.highlights = [data.item.id];
      }
    }

    this.showAttributes();
    this.topology.setHighlights(this.highlights, data.type);
  };

  Canvas.prototype.handleClickOutside = function()
  {
    this.lastHighlightEvent = null;
    this.highlights = [];
    this.topology.setHighlights(this.highlights);
    this.showAttributes();
  };

  function generateOutsideSelection(items, selectType, lastHighlightEvent)
  {
    var result = {
      type: selectType,
      items: [],
      event: lastHighlightEvent
    };
    _.each(items, function (item) {
      var out = {};
      out.key = item.id;
      if (selectType == 'node')
      {
	out.name = item.name;
	out.sshurl = item.ssh;
      }
      else if (selectType == 'link')
      {
	out.name = item.name;
      }
      else if (selectType == 'site')
      {
	out.urn = item.urn;
	out.id = item.name;
      }
      result.items.push(out);
    });
    return result;
  }

  Canvas.prototype.changeSingleSite = function (state)
  {
    _.defer(function () {
      var key = _.keys(this.topoData.sites)[0];
      this.topoData.changeAttribute([key], 'urn', state.value, 'site');
    }.bind(this));
  }

  Canvas.prototype.updateSingleSite = function ()
  {
/*
    var keys = _.keys(this.topoData.sites);
    if (keys.length === 1)
    {
      var site = this.topoData.sites[keys[0]];
      this.singleSite.show();
      this.singleSite.update({
	values: [site.urn],
	isViewer: this.context.mode === 'viewer',
	type: 'site',
	disabled: false,
	freeform: site.custom.urn,
	model: this.topoData,
	selection: 'site'
      });
    }
    else
*/
    {
      this.singleSite.hide();
    }
  }

  Canvas.prototype.changeAttribute = function (state)
  {
    if (state.hasFreeform)
    {
      var items = _.filter(this.topoData.getItems(this.lastHighlightType),
			   function(item) {
			     return _.contains(this.highlights, item.id);
			   }.bind(this));
      _.each(items, function (item) {
	item.custom[state.key] = state.freeform;
      });
    }
    if (state.key === 'delete')
    {
      this.topoData.removeItems(this.highlights, this.lastHighlightType);
      this.highlights = [];
    }
    else
    {
      this.topoData.changeAttribute(this.highlights, state.key, state.value,
				    this.lastHighlightType);
    }
    if (state.hasVersion)
    {
      this.topoData.changeAttribute(this.highlights, 'imageVersion', state.version,
				    this.lastHighlightType);
    }
    _.defer(_.bind(this.showAttributes, this));
  };

  Canvas.prototype.addToList = function (state)
  {
    if (this.highlights.length === 1)
    {
      var current = this.topoData.nodes[this.highlights[0]];
      current[state.key].push(state.item);
      this.showAttributes();
    }
  };

  Canvas.prototype.removeFromList = function (state)
  {
    if (this.highlights.length === 1)
    {
      if (state.key === 'interfaces')
      {
	var link = this.topoData.lans[this.highlights[0]];
	var iface = this.topoData.interfaces[link.interfaces[state.index]];
	var node = this.topoData.nodes[iface.nodeId];
	this.topoData.removeNodeFromLan(node, link);
      }
      else
      {
	var current = this.topoData.nodes[this.highlights[0]];
	current[state.key].splice(state.index, 1);
      }
      this.showAttributes();
    }
  };

  Canvas.prototype.changeList = function (state)
  {
    if (this.highlights.length === 1)
    {
      var current;
      if (state.key === 'interfaces')
      {
	var link = this.topoData.lans[this.highlights[0]];
	var id = link.interfaces[state.index];
	current = this.topoData.interfaces[id];
      }
      else
      {
	current = this.topoData.nodes[this.highlights[0]][state.key][state.index];
      }
      _.each(state.changed, function (value, key) {
	if (key === 'ip')
	{
	  var oldValue = current[key];
	  current[key] = value;
	  this.topoData.switchIp(current.id, oldValue, value);
	}
	else
	{
	  current[key] = value;
	}
      }.bind(this));
      this.showAttributes();
    }
  };

  Canvas.prototype.showAttributes = function()
  {
    if (! this.showingAttributes)
    {
      this.showingAttributes = true;
      _.defer(_.bind(this.finalShowAttributes, this));
    }
  }

  Canvas.prototype.finalShowAttributes = function ()
  {
    this.showingAttributes = false;
    $('html').css('-webkit-user-select', 'initial');
    $('html').css('-moz-user-select', 'initial');
    var isViewer = this.context.mode === 'viewer';
    var items = _.filter(this.topoData.getItems(this.lastHighlightType),
			 function(item) {
			   return _.contains(this.highlights, item.id);
			 }.bind(this));
    var selectType = this.lastHighlightType;
    var unselected = (items.length === 0);
    if (unselected)
    {
      selectType = 'none';
    }
    this.info.update({ selection: items, type: selectType,
		       isViewer: isViewer, model: this.topoData });

    //var topo = this.domRoot.find('#topoContainer');
    var pane = this.domRoot.find('.nodeAttr');
    this.updateOut.trigger('selection',
			   generateOutsideSelection(items, selectType,
						    this.lastHighlightEvent));
    if (items.length === 0)
    {
      slideInStatic(pane, this.domRoot.find('.closeContainer'));
    }
    else
    {
      slideOutStatic(pane, this.domRoot.find('.closeContainer'));
    }
  }

  function slideOut(goTo, thisButton)
  {
    if (!thisButton.hasClass('freeze'))
    {
      setTimeout(function() {
	      goTo.attr('tabindex', -1).focus();
      }, 1);
      thisButton.addClass('freeze');
    }
  }

  function enableButton(thisButton)
  {
    thisButton.removeClass('freeze');
  }

  function slideOutStatic(goTo, closeButton, thisButton)
  {
    goTo.addClass('show');
    closeButton.addClass('show');
    if (thisButton !== null && thisButton !== undefined) {
      thisButton.addClass('btn-warning');
      thisButton.removeClass('btn-primary');
    }
  }

  function slideInStatic(goFrom, closeButton, thisButton)
  {
    goFrom.removeClass('show');
    closeButton.removeClass('show');
    if (thisButton !== null && thisButton !== undefined) {
      thisButton.removeClass('btn-warning');
      thisButton.addClass('btn-primary');
    }
  }

  return Canvas;
});


define('text!html/Login.html',[],function () { return '<div class="row xmlrpc">\r\n  <div class="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 col-xs-offset-0">\r\n\r\n    <!-- Wait spinner -->\r\n    <div id="waitContainer" class="text-center hides afterHide">\r\n      <span id="waitText">Doing stuff...</span>\r\n      <img src="images/ajax-loader.gif">\r\n    </div>\r\n\r\n    <!-- Cert window -->\r\n    <div id="certificate" class="panel panel-default">\r\n      <div class="panel-heading">\r\n        <h3 class="panel-title">Log In</h3>\r\n      </div>\r\n      <div class="panel-body">\r\n        <div class="form-group">\r\n          <ul class="nav nav-tabs sslCertNav">\r\n            <li class="active saTab"><a href="#">Identity Provider</a></li>\r\n            <li class="fileTab"><a href="#">Certificate</a></li>\r\n          </ul>\r\n\r\n          <div class="panel-body sa active tab">\r\n            <p>Sign in using your account at any one of GENI\'s federated\r\n              facilities:</p>\r\n\t    <div class="panel-group" id="accordion">\r\n              <div class="panel panel-default">\r\n                <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">\r\n                  <div class="panel-heading">\r\n                    <h4 class="panel-title">\r\n                      Recommended Providers\r\n                    </h4>\r\n                  </div>\r\n                </a>\r\n                <div id="collapseOne" class="panel-collapse collapse in">\r\n                  <div class="panel-body">\r\n                    <div id="recommendedSA">\r\n                      <div class="recSAImages">\r\n                      </div>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <div class="panel panel-default">\r\n                <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">\r\n                  <div class="panel-heading">\r\n                    <h4 class="panel-title">\r\n                      Other Providers\r\n                    </h4>\r\n                  </div>\r\n                </a>\r\n                <div id="collapseTwo" class="panel-collapse collapse">\r\n                  <div class="panel-body">\r\n                    <div id="otherSA">\r\n                      <select class="form-control sliceAuthorities"></select>\r\n                      <button id="other-sa-button" class="btn btn-primary btn-sm pull-right retrieve-cert">Retrieve Certificate</button>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div class="panel-body fromFile tab">\r\n            <h5>\r\n              Enter SSL Certificate\r\n              <a class="info" data-toggle="tooltip" data-placement="right" data-html="true" title="SSL Certificate is in PEM format">\r\n                <span class="glyphicon glyphicon-question-sign"></span>\r\n              </a>\r\n            </h5>\r\n            <p>You may paste a certificate issued by any GENI identity provider below.</p>\r\n            <textarea id="clientKey" class="form-control" rows="5"></textarea>\r\n            <button id="manualCert" class="btn btn-primary btn-sm pull-right cert-form" type="button">Select Certificate</button>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <!-- Passphrase window -->\r\n    <div id="passphrase" class="panel panel-default hides afterHide">\r\n      <div class="panel-heading">\r\n        <h3 id="userNameContainer" class="panel-title" style="display: none;">Log In</h3>\r\n      </div>\r\n      <div class="panel-body">\r\n\t<div class="alert alert-info">Remember to use the passphrase for your certificate, not for your identity provider.</div>\r\n        <div class="form-group" id="userGroup">\r\n          <h5>Identity Provider</h5>\r\n          <input type="text" class="form-control" id="currentSA" disabled>\r\n          <h5>User Name</h5>\r\n          <input type="text" class="form-control pull-left" id="userName" disabled>\r\n          <button id="passBack" class="btn btn-primary btn-sm pull-right" type="button">Change User</button>\r\n        </div>\r\n        <div class="form-group" id="passGroup">\r\n          <h5>Enter Passphrase</h5>\r\n          <input type="password" class="form-control" id="clientPhrase">\r\n          <div id="passError" class="alert alert-danger hidden"></div>\r\n          <button id="passForm" class="btn btn-primary btn-sm pull-right" name="pass" type="button">Log In</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <!-- Slice select window -->\r\n    <div id="sliceListContainer" class="panel panel-default hides afterHide">\r\n      <div class="panel-heading">\r\n\t<h3 class="panel-title">Available Slices</h3>\r\n      </div>\r\n      <div class="panel-body">\r\n\t<div class="form-group">\r\n          <div id="slice-list" class="list-group"></div>\r\n\t  <!--              <button id="select-slice" class="btn btn-primary btn-sm pull-right">Select</button> -->\r\n\t</div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n';});

define('js/actor/LoginView',['underscore', 'backbone', 'js/cache',
	'text!html/Login.html'],
function (_, Backbone, cache,
	  loginString)
{
  

  var LoginView = Backbone.View.extend({

    events: {
      'keyup #clientPhrase': 'updatePassphrase',
      'click .fileTab': 'clickFileTab',
      'click .saTab': 'clickSaTab',
      'click #manualCert': 'clickManualCert',
      'click #passBack': 'clickPassphraseBack',
      'click #passForm': 'submitPassphraseForm',
      'click .suggested-button': 'clickSuggested',
      'click #other-sa-button': 'clickOtherSA'
    },

    initialize: function () {
      this.render();
    },

    render: function () {
      this.$el.html(loginString);
      this.renderSAList();
      this.$('.info').tooltip();
    },

    renderSAList: function () {
      var inputOptions = '';
      var isSelected = false;
      var list = this.options.saList;
      var suggested = [];

      for (var i = 0; i < list.length; ++i)
      {
	if (list[i]['web-cert-url'])
	{
	  var name = list[i]['name'];
	  if (! name || name === '')
	  {
	    name = list[i]['urn'].split('+')[1];
	  }
	  inputOptions += '<option value="' + i + '"';
	  if (list[i]['urn'] === 'urn:publicid:IDN+emulab.net+authority+sa' ||
	      list[i]['urn'] === 'urn:publicid:IDN+uky.emulab.net+authority+sa')
	  {
	    inputOptions += ' class="hidden"';
	    suggested.push({ index: i, item: list[i]});
	  }
	  else if (! isSelected)
	  {
	    inputOptions += ' selected="selected"';
	    isSelected = false;
	  }
	  inputOptions += '>' + name + '</option>';
	}
      }

      this.$('.sliceAuthorities').html(inputOptions);
      this.renderSuggestedSAList(suggested);
/*
      this.$('.sliceAuthorities').change(updateIdentityProvider);
      if (! cache.get('provider'))
      {
	updateIdentityProvider(0);
      }
*/
    },

    renderSuggestedSAList: function (suggested) {
      var imageHTML = '';
      _.each(suggested, function (value) {
	var icon = value.item.icon;
	var index = value.index;

	imageHTML += '<div class="SAImage pull-left"><a data-index="' + index + '" class="suggested-button">';
	if (icon && icon !== '')
	{
	  imageHTML += '<img style="margin-top: 10px;" src="' +
	    _.escape(icon) + '" />';
	}
	else
	{
	  imageHTML += value.item.name;
	}
	imageHTML += '</a></div>';
      });

      this.$('.recSAImages').html(imageHTML);
    },

    fillPassphraseForm: function (name, saName)
    {
      this.$('#userName').val(_.escape(name));
      this.$('#userNameContainer').show();
      this.$('#currentSA').val(saName);
      this.options.transition.page(this.$('#certificate'),
				   this.$('#passphrase'));
    },

    updatePassphrase: function (event) {
      if (event.keyCode === 13)
      {
	this.submitPassphraseForm();
      }
    },

    clickFileTab: function () {
      switchTab(this.$('.fileTab'), this.$('.fromFile'));
    },

    clickSaTab: function () {
      switchTab(this.$('.saTab'), this.$('.sa'));
    },

    clickManualCert: function () {
      var that = this;
      this.options.login.parseCert(this.$('#clientKey').val());
      this.options.transition.page(this.$('#certificate'),
				   this.$('#passphrase'));
      this.$('#passphrase').one('transitionend', function() {
	that.$('#clientPhrase').focus();
      });
    },

    clickPassphraseBack: function () {
      this.options.transition.page(this.$('#passphrase'),
				   this.$('#certificate'))
    },

    submitPassphraseForm: function () {
      this.options.login.tryPassphrase(this.$('#clientPhrase').val());
    },

    clickSuggested: function (event) {
      event.preventDefault();
      var index = event.currentTarget.dataset['index'];
      cache.set('provider', this.options.saList[index]);
      this.options.login.getCertFromSA();
    },

    clickOtherSA: function (event) {
      event.preventDefault();
      var index = parseInt(this.$('.sliceAuthorities').val());
      cache.set('provider', this.options.saList[indx]);
      this.options.login.getCertFromSA();
    }

  });

  function switchTab(switchTo, panel) {
    switchTo.siblings('.active').removeClass('active');
    panel.siblings('.active').removeClass('active');

    switchTo.addClass('active');
    panel.addClass('active');
  }

  return LoginView;
});

!function(a){if("function"==typeof bootstrap)bootstrap("promise",a);else if("object"==typeof exports)module.exports=a();else if("function"==typeof define&&define.amd)define('q',a);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeQ=a}else Q=a()}(function(){function a(a){return function(){return V.apply(a,arguments)}}function b(a){return a===Object(a)}function c(a){return"[object StopIteration]"===bb(a)||a instanceof R}function d(a,b){if(O&&b.stack&&"object"==typeof a&&null!==a&&a.stack&&-1===a.stack.indexOf(cb)){for(var c=[],d=b;d;d=d.source)d.stack&&c.unshift(d.stack);c.unshift(a.stack);var f=c.join("\n"+cb+"\n");a.stack=e(f)}}function e(a){for(var b=a.split("\n"),c=[],d=0;d<b.length;++d){var e=b[d];h(e)||f(e)||!e||c.push(e)}return c.join("\n")}function f(a){return-1!==a.indexOf("(module.js:")||-1!==a.indexOf("(node.js:")}function g(a){var b=/at .+ \((.+):(\d+):(?:\d+)\)$/.exec(a);if(b)return[b[1],Number(b[2])];var c=/at ([^ ]+):(\d+):(?:\d+)$/.exec(a);if(c)return[c[1],Number(c[2])];var d=/.*@(.+):(\d+)$/.exec(a);return d?[d[1],Number(d[2])]:void 0}function h(a){var b=g(a);if(!b)return!1;var c=b[0],d=b[1];return c===Q&&d>=S&&gb>=d}function i(){if(O)try{throw new Error}catch(a){var b=a.stack.split("\n"),c=b[0].indexOf("@")>0?b[1]:b[2],d=g(c);if(!d)return;return Q=d[0],d[1]}}function j(a,b,c){return function(){return"undefined"!=typeof console&&"function"==typeof console.warn&&console.warn(b+" is deprecated, use "+c+" instead.",new Error("").stack),a.apply(a,arguments)}}function k(a){return r(a)?a:s(a)?B(a):A(a)}function l(){function a(a){b=a,f.source=a,X(c,function(b,c){U(function(){a.promiseDispatch.apply(a,c)})},void 0),c=void 0,d=void 0}var b,c=[],d=[],e=$(l.prototype),f=$(o.prototype);if(f.promiseDispatch=function(a,e,f){var g=W(arguments);c?(c.push(g),"when"===e&&f[1]&&d.push(f[1])):U(function(){b.promiseDispatch.apply(b,g)})},f.valueOf=function(){if(c)return f;var a=q(b);return r(a)&&(b=a),a},f.inspect=function(){return b?b.inspect():{state:"pending"}},k.longStackSupport&&O)try{throw new Error}catch(g){f.stack=g.stack.substring(g.stack.indexOf("\n")+1)}return e.promise=f,e.resolve=function(c){b||a(k(c))},e.fulfill=function(c){b||a(A(c))},e.reject=function(c){b||a(z(c))},e.notify=function(a){b||X(d,function(b,c){U(function(){c(a)})},void 0)},e}function m(a){if("function"!=typeof a)throw new TypeError("resolver must be a function.");var b=l();try{a(b.resolve,b.reject,b.notify)}catch(c){b.reject(c)}return b.promise}function n(a){return m(function(b,c){for(var d=0,e=a.length;e>d;d++)k(a[d]).then(b,c)})}function o(a,b,c){void 0===b&&(b=function(a){return z(new Error("Promise does not support operation: "+a))}),void 0===c&&(c=function(){return{state:"unknown"}});var d=$(o.prototype);if(d.promiseDispatch=function(c,e,f){var g;try{g=a[e]?a[e].apply(d,f):b.call(d,e,f)}catch(h){g=z(h)}c&&c(g)},d.inspect=c,c){var e=c();"rejected"===e.state&&(d.exception=e.reason),d.valueOf=function(){var a=c();return"pending"===a.state||"rejected"===a.state?d:a.value}}return d}function p(a,b,c,d){return k(a).then(b,c,d)}function q(a){if(r(a)){var b=a.inspect();if("fulfilled"===b.state)return b.value}return a}function r(a){return b(a)&&"function"==typeof a.promiseDispatch&&"function"==typeof a.inspect}function s(a){return b(a)&&"function"==typeof a.then}function t(a){return r(a)&&"pending"===a.inspect().state}function u(a){return!r(a)||"fulfilled"===a.inspect().state}function v(a){return r(a)&&"rejected"===a.inspect().state}function w(){db.length=0,eb.length=0,fb||(fb=!0)}function x(a,b){fb&&(eb.push(a),db.push(b&&"undefined"!=typeof b.stack?b.stack:"(no stack) "+b))}function y(a){if(fb){var b=Y(eb,a);-1!==b&&(eb.splice(b,1),db.splice(b,1))}}function z(a){var b=o({when:function(b){return b&&y(this),b?b(a):this}},function(){return this},function(){return{state:"rejected",reason:a}});return x(b,a),b}function A(a){return o({when:function(){return a},get:function(b){return a[b]},set:function(b,c){a[b]=c},"delete":function(b){delete a[b]},post:function(b,c){return null===b||void 0===b?a.apply(void 0,c):a[b].apply(a,c)},apply:function(b,c){return a.apply(b,c)},keys:function(){return ab(a)}},void 0,function(){return{state:"fulfilled",value:a}})}function B(a){var b=l();return U(function(){try{a.then(b.resolve,b.reject,b.notify)}catch(c){b.reject(c)}}),b.promise}function C(a){return o({isDef:function(){}},function(b,c){return I(a,b,c)},function(){return k(a).inspect()})}function D(a,b,c){return k(a).spread(b,c)}function E(a){return function(){function b(a,b){var g;if("undefined"==typeof StopIteration){try{g=d[a](b)}catch(h){return z(h)}return g.done?g.value:p(g.value,e,f)}try{g=d[a](b)}catch(h){return c(h)?h.value:z(h)}return p(g,e,f)}var d=a.apply(this,arguments),e=b.bind(b,"next"),f=b.bind(b,"throw");return e()}}function F(a){k.done(k.async(a)())}function G(a){throw new R(a)}function H(a){return function(){return D([this,J(arguments)],function(b,c){return a.apply(b,c)})}}function I(a,b,c){return k(a).dispatch(b,c)}function J(a){return p(a,function(a){var b=0,c=l();return X(a,function(d,e,f){var g;r(e)&&"fulfilled"===(g=e.inspect()).state?a[f]=g.value:(++b,p(e,function(d){a[f]=d,0===--b&&c.resolve(a)},c.reject,function(a){c.notify({index:f,value:a})}))},void 0),0===b&&c.resolve(a),c.promise})}function K(a){return p(a,function(a){return a=Z(a,k),p(J(Z(a,function(a){return p(a,T,T)})),function(){return a})})}function L(a){return k(a).allSettled()}function M(a,b){return k(a).then(void 0,void 0,b)}function N(a,b){return k(a).nodeify(b)}var O=!1;try{throw new Error}catch(P){O=!!P.stack}var Q,R,S=i(),T=function(){},U=function(){function a(){for(;b.next;){b=b.next;var c=b.task;b.task=void 0;var e=b.domain;e&&(b.domain=void 0,e.enter());try{c()}catch(g){if(f)throw e&&e.exit(),setTimeout(a,0),e&&e.enter(),g;setTimeout(function(){throw g},0)}e&&e.exit()}d=!1}var b={task:void 0,next:null},c=b,d=!1,e=void 0,f=!1;if(U=function(a){c=c.next={task:a,domain:f&&process.domain,next:null},d||(d=!0,e())},"undefined"!=typeof process&&process.nextTick)f=!0,e=function(){process.nextTick(a)};else if("function"==typeof setImmediate)e="undefined"!=typeof window?setImmediate.bind(window,a):function(){setImmediate(a)};else if("undefined"!=typeof MessageChannel){var g=new MessageChannel;g.port1.onmessage=function(){e=h,g.port1.onmessage=a,a()};var h=function(){g.port2.postMessage(0)};e=function(){setTimeout(a,0),h()}}else e=function(){setTimeout(a,0)};return U}(),V=Function.call,W=a(Array.prototype.slice),X=a(Array.prototype.reduce||function(a,b){var c=0,d=this.length;if(1===arguments.length)for(;;){if(c in this){b=this[c++];break}if(++c>=d)throw new TypeError}for(;d>c;c++)c in this&&(b=a(b,this[c],c));return b}),Y=a(Array.prototype.indexOf||function(a){for(var b=0;b<this.length;b++)if(this[b]===a)return b;return-1}),Z=a(Array.prototype.map||function(a,b){var c=this,d=[];return X(c,function(e,f,g){d.push(a.call(b,f,g,c))},void 0),d}),$=Object.create||function(a){function b(){}return b.prototype=a,new b},_=a(Object.prototype.hasOwnProperty),ab=Object.keys||function(a){var b=[];for(var c in a)_(a,c)&&b.push(c);return b},bb=a(Object.prototype.toString);R="undefined"!=typeof ReturnValue?ReturnValue:function(a){this.value=a};var cb="From previous event:";k.resolve=k,k.nextTick=U,k.longStackSupport=!1,k.defer=l,l.prototype.makeNodeResolver=function(){var a=this;return function(b,c){b?a.reject(b):a.resolve(arguments.length>2?W(arguments,1):c)}},k.Promise=m,k.promise=m,m.race=n,m.all=J,m.reject=z,m.resolve=k,k.passByCopy=function(a){return a},o.prototype.passByCopy=function(){return this},k.join=function(a,b){return k(a).join(b)},o.prototype.join=function(a){return k([this,a]).spread(function(a,b){if(a===b)return a;throw new Error("Can't join: not the same: "+a+" "+b)})},k.race=n,o.prototype.race=function(){return this.then(k.race)},k.makePromise=o,o.prototype.toString=function(){return"[object Promise]"},o.prototype.then=function(a,b,c){function e(b){try{return"function"==typeof a?a(b):b}catch(c){return z(c)}}function f(a){if("function"==typeof b){d(a,h);try{return b(a)}catch(c){return z(c)}}return z(a)}function g(a){return"function"==typeof c?c(a):a}var h=this,i=l(),j=!1;return U(function(){h.promiseDispatch(function(a){j||(j=!0,i.resolve(e(a)))},"when",[function(a){j||(j=!0,i.resolve(f(a)))}])}),h.promiseDispatch(void 0,"when",[void 0,function(a){var b,c=!1;try{b=g(a)}catch(d){if(c=!0,!k.onerror)throw d;k.onerror(d)}c||i.notify(b)}]),i.promise},k.when=p,o.prototype.thenResolve=function(a){return this.then(function(){return a})},k.thenResolve=function(a,b){return k(a).thenResolve(b)},o.prototype.thenReject=function(a){return this.then(function(){throw a})},k.thenReject=function(a,b){return k(a).thenReject(b)},k.nearer=q,k.isPromise=r,k.isPromiseAlike=s,k.isPending=t,o.prototype.isPending=function(){return"pending"===this.inspect().state},k.isFulfilled=u,o.prototype.isFulfilled=function(){return"fulfilled"===this.inspect().state},k.isRejected=v,o.prototype.isRejected=function(){return"rejected"===this.inspect().state};var db=[],eb=[],fb=!0;k.resetUnhandledRejections=w,k.getUnhandledReasons=function(){return db.slice()},k.stopUnhandledRejectionTracking=function(){w(),fb=!1},w(),k.reject=z,k.fulfill=A,k.master=C,k.spread=D,o.prototype.spread=function(a,b){return this.all().then(function(b){return a.apply(void 0,b)},b)},k.async=E,k.spawn=F,k["return"]=G,k.promised=H,k.dispatch=I,o.prototype.dispatch=function(a,b){var c=this,d=l();return U(function(){c.promiseDispatch(d.resolve,a,b)}),d.promise},k.get=function(a,b){return k(a).dispatch("get",[b])},o.prototype.get=function(a){return this.dispatch("get",[a])},k.set=function(a,b,c){return k(a).dispatch("set",[b,c])},o.prototype.set=function(a,b){return this.dispatch("set",[a,b])},k.del=k["delete"]=function(a,b){return k(a).dispatch("delete",[b])},o.prototype.del=o.prototype["delete"]=function(a){return this.dispatch("delete",[a])},k.mapply=k.post=function(a,b,c){return k(a).dispatch("post",[b,c])},o.prototype.mapply=o.prototype.post=function(a,b){return this.dispatch("post",[a,b])},k.send=k.mcall=k.invoke=function(a,b){return k(a).dispatch("post",[b,W(arguments,2)])},o.prototype.send=o.prototype.mcall=o.prototype.invoke=function(a){return this.dispatch("post",[a,W(arguments,1)])},k.fapply=function(a,b){return k(a).dispatch("apply",[void 0,b])},o.prototype.fapply=function(a){return this.dispatch("apply",[void 0,a])},k["try"]=k.fcall=function(a){return k(a).dispatch("apply",[void 0,W(arguments,1)])},o.prototype.fcall=function(){return this.dispatch("apply",[void 0,W(arguments)])},k.fbind=function(a){var b=k(a),c=W(arguments,1);return function(){return b.dispatch("apply",[this,c.concat(W(arguments))])}},o.prototype.fbind=function(){var a=this,b=W(arguments);return function(){return a.dispatch("apply",[this,b.concat(W(arguments))])}},k.keys=function(a){return k(a).dispatch("keys",[])},o.prototype.keys=function(){return this.dispatch("keys",[])},k.all=J,o.prototype.all=function(){return J(this)},k.allResolved=j(K,"allResolved","allSettled"),o.prototype.allResolved=function(){return K(this)},k.allSettled=L,o.prototype.allSettled=function(){return this.then(function(a){return J(Z(a,function(a){function b(){return a.inspect()}return a=k(a),a.then(b,b)}))})},k.fail=k["catch"]=function(a,b){return k(a).then(void 0,b)},o.prototype.fail=o.prototype["catch"]=function(a){return this.then(void 0,a)},k.progress=M,o.prototype.progress=function(a){return this.then(void 0,void 0,a)},k.fin=k["finally"]=function(a,b){return k(a)["finally"](b)},o.prototype.fin=o.prototype["finally"]=function(a){return a=k(a),this.then(function(b){return a.fcall().then(function(){return b})},function(b){return a.fcall().then(function(){throw b})})},k.done=function(a,b,c,d){return k(a).done(b,c,d)},o.prototype.done=function(a,b,c){var e=function(a){U(function(){if(d(a,f),!k.onerror)throw a;k.onerror(a)})},f=a||b||c?this.then(a,b,c):this;"object"==typeof process&&process&&process.domain&&(e=process.domain.bind(e)),f.then(void 0,e)},k.timeout=function(a,b,c){return k(a).timeout(b,c)},o.prototype.timeout=function(a,b){var c=l(),d=setTimeout(function(){c.reject(new Error(b||"Timed out after "+a+" ms"))},a);return this.then(function(a){clearTimeout(d),c.resolve(a)},function(a){clearTimeout(d),c.reject(a)},c.notify),c.promise},k.delay=function(a,b){return void 0===b&&(b=a,a=void 0),k(a).delay(b)},o.prototype.delay=function(a){return this.then(function(b){var c=l();return setTimeout(function(){c.resolve(b)},a),c.promise})},k.nfapply=function(a,b){return k(a).nfapply(b)},o.prototype.nfapply=function(a){var b=l(),c=W(a);return c.push(b.makeNodeResolver()),this.fapply(c).fail(b.reject),b.promise},k.nfcall=function(a){var b=W(arguments,1);return k(a).nfapply(b)},o.prototype.nfcall=function(){var a=W(arguments),b=l();return a.push(b.makeNodeResolver()),this.fapply(a).fail(b.reject),b.promise},k.nfbind=k.denodeify=function(a){var b=W(arguments,1);return function(){var c=b.concat(W(arguments)),d=l();return c.push(d.makeNodeResolver()),k(a).fapply(c).fail(d.reject),d.promise}},o.prototype.nfbind=o.prototype.denodeify=function(){var a=W(arguments);return a.unshift(this),k.denodeify.apply(void 0,a)},k.nbind=function(a,b){var c=W(arguments,2);return function(){function d(){return a.apply(b,arguments)}var e=c.concat(W(arguments)),f=l();return e.push(f.makeNodeResolver()),k(d).fapply(e).fail(f.reject),f.promise}},o.prototype.nbind=function(){var a=W(arguments,0);return a.unshift(this),k.nbind.apply(void 0,a)},k.nmapply=k.npost=function(a,b,c){return k(a).npost(b,c)},o.prototype.nmapply=o.prototype.npost=function(a,b){var c=W(b||[]),d=l();return c.push(d.makeNodeResolver()),this.dispatch("post",[a,c]).fail(d.reject),d.promise},k.nsend=k.nmcall=k.ninvoke=function(a,b){var c=W(arguments,2),d=l();return c.push(d.makeNodeResolver()),k(a).dispatch("post",[b,c]).fail(d.reject),d.promise},o.prototype.nsend=o.prototype.nmcall=o.prototype.ninvoke=function(a){var b=W(arguments,1),c=l();return b.push(c.makeNodeResolver()),this.dispatch("post",[a,b]).fail(c.reject),c.promise},k.nodeify=N,o.prototype.nodeify=function(a){return a?void this.then(function(b){U(function(){a(null,b)})},function(b){U(function(){a(b)})}):this};var gb=i();return k});
define('js/ajaxforge',['q'],
function (Q)
{
  

  var isInitialized = false;
  var socketpool = null;
  var socketCounter = 0;
  var clientPool = {};
  var settingsPool = {};

  var serverCerts = [];
  var clientCerts = [];
  var clientKey = [];

  var defaultPoolUrl = 'SocketPool.swf';
  var defaultPoolId = 'socketPool';

  // $.ajaxforge(url, settings)
  // $.ajaxforge(settings)
  $.ajaxforge = function (arg1, arg2)
  {
//    $.ajaxforge.initialize(defaultPoolUrl, defaultPoolId);
    var settings;
    if (arguments.length === 2)
    {
      settings = arg2;
      settings.url = arg1;
    }
    else
    {
      settings = arg1;
    }

    settings.deferred = Q.defer();

    var url = $('<a>', { href: settings.url } )[0];
    var host = url.hostname;
    var path = url.pathname + url.search + url.hash;
    var sendData = settings.data;

    var newClient = initClient(url.protocol + '//' + host + ':' + url.port,
                               socketCounter);
    clientPool[socketCounter] = newClient;
    settingsPool[socketCounter] = settings;
    sendClient(newClient, path, sendData, socketCounter);

    socketCounter += 1;

    return settings.deferred.promise.then(function (response) {
      return settings.converters['xml json']($.parseXML(response.body));
    });
  };

  $.ajaxforge.initialize = function (flashUrl, flashId, serverCertText,
                                     clientKeyText, clientCertText)
  {
    setServerCert(serverCertText);
    setClientKey(clientKeyText);
    setClientCert(clientCertText);
    if (! isInitialized)
    {
//      swfobject.embedSWF(flashUrl, flashId, '0', '0', '9.0.0',
//                         false, {}, {allowscriptaccess: 'always'}, {});
      socketpool = forge.net.createSocketPool({
        flashId: flashId,
        policyPort: 843,
        msie: false
        });

      isInitialized = true;
    }
  };

  function initClient(host, socketId)
  {
    var result = null;
    try
    {
//      console.log('initClient -- ' + host);
      var arg = {
        url: host,
        socketPool: socketpool,
        connections: 1,
        // optional cipher suites in order of preference
        caCerts : serverCerts,
        cipherSuites: [
          forge.tls.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA,
          forge.tls.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA],
        verify: function(c, verified, depth, certs)
        {
          return verified;
        },
        primeTlsSockets: false
      };
      if (clientCerts.length > 0)
      {
        arg.getCertificate = function(c, request) { return clientCerts; };
        arg.getPrivateKey = function(c, cert) { return clientKey; };
      }
      result = forge.http.createClient(arg);
    }
    catch(ex)
    {
      console.log('ERROR: client_init', host);
      console.dir(ex);
    }
  
    return result;
  }


  function sendClient(client, path, data, socketId)
  {
    var requestArg = {
      path: path,
      method: 'GET'
    };
    if (data != "")
    {
      requestArg.method = 'POST';
      requestArg.headers = [{'Content-Type': 'text/xml'}];
      requestArg.body = data;
    }
    var request = forge.http.createRequest(requestArg);
    console.log('sendClient', request);
    try {
    client.send({
      request: request,
      connected: function(e)
      {
//        console.log('forge.tests.tls', 'connected', e);
      },
      headerReady: function(e)
      {
//        console.log('forge.tests.tls', 'header ready', e);
      },
      bodyReady: function(e)
      {
//        console.log('bodyReady', e);
        settingsPool[socketId].deferred.resolve(e.response);
      },
      error: function(e)
      {
        console.log('error', e);
        settingsPool[socketId].deferred.reject([e.type, e.message,
                                                e.cause]);
        e.socket.close();
      }
    });
    } catch (e) {
      console.log('sendError', e);
    }
    return false;
  }

  function setServerCert(newCert)
  {
    try
    {
      serverCerts = [];
      var list = newCert.split("-----END CERTIFICATE-----");
      for (var i = 0; i < list.length - 1; ++i)
      {
        serverCerts.push(list[i] + "-----END CERTIFICATE-----\n");
      }
    }
    catch(ex)
    {
      console.log('ERROR setServerCert:');
      console.dir(ex);
    }
  }

  function setClientCert(newCert)
  {
    try
    {
      clientCerts = [];
      if (typeof(newCert) === "string")
      {
        var list = newCert.split("-----END CERTIFICATE-----");
        for (var i = 0; i < list.length - 1; ++i)
        {
          clientCerts.push(list[i] + "-----END CERTIFICATE-----\n");
        }
      }
      else
      {
        clientCerts = newCert;
      }
    }
    catch (ex)
    {
      console.log('ERROR setting client cert:');
      console.dir(ex);
    }
  }

  function setClientKey(newKey)
  {
    try
    {
      clientKey = newKey;
    }
    catch(ex)
    {
      console.log('ERROR setting client key:');
      console.dir(ex);
    }
  }

  return $.ajaxforge;
});

define('js/actor/Login',['underscore', 'backbone',
	'js/cache', 'js/actor/LoginView', 'js/ajaxforge'],
function (_, Backbone, cache, LoginView)
{
  

  var Login = function (rootDom, canvas, transition, saList)
  {
    _.extend(this, Backbone.Events);
    this.root = rootDom;
    this.certWindow = null;
    this.canvas = canvas;
    this.transition = transition;
    this.saList = saList;
    this.view = new LoginView({
      el: rootDom.find('#loginContainer'),
      login: this,
      transition: transition,
      saList: saList
    });
    rootDom.find('button.logout').click(logout);
    window.addEventListener('message', _.bind(this.certFromMessage, this));
    // This cannot run directly in the initializer because we need to
    // give others a chance to bind to the events this might invoke.
    _.defer(_.bind(this.checkCache, this));
  }

  Login.prototype.checkCache = function ()
  {
    this.transition.page($('#loadingContainer'), $('#loginContainer'));
    $('#loginContainer').one('transitionend', function() {
      $('#clientPhrase').focus();
    });
    if (cache.get('userKey') && cache.get('userCert'))
    {
      var combined = cache.get('userKey') + '\n' + cache.get('userCert');
      $('#clientKey').val(combined);
      this.parseCert(combined);
      if (cache.get('passphrase') !== null &&
	  cache.get('passphrase') !== undefined)
      {
	this.tryPassphrase(cache.get('passphrase'));
      }
/*
      {
      	pageTransition($('#certificate'), $('#passphrase'));
	$('#passphrase').one('transitionend', function() {
	  $('#clientPhrase').focus();
	});
      }
*/
    }
  };

  Login.prototype.getCertFromSA = function ()
  {
    // The confirmation event is a message that is caught and handled
    // by LoginView
    var that = this;
    if (this.certWindow)
    {
      this.certWindow.close();
    }

    var url = cache.get('provider')['web-cert-url'];
    this.certWindow = window.open(url, 'Slice Authority Credential',
				  'height=400,width=600,toolbar=yes');
    $(this.certWindow.document).ready(function() {
      that.root.find('.windowOpen').removeClass('hidden');
      $(that.certWindow).focus();

      var interval = window.setInterval(function() {
    	if (that.certWindow.closed)
	{
    	  window.clearInterval(interval);
    	  that.root.find('.windowOpen').addClass('hidden');
    	}
      }, 250);
    });
  };

  Login.prototype.certFromMessage = function (event)
  {
    if (event.source === this.certWindow && event.data &&
	event.data.certificate && event.data.authority)
    {
      this.root.find('#clientKey').val(event.data.certificate);
      this.view.clickManualCert();
    }
  };

  Login.prototype.parseCert = function (source)
  {
    var inKey = false;
    var inCert = false;
    var cert = "";
    var key = "";
    var lines = source.split('\n');
    var i = 0;
    for (i = 0; i < lines.length; i += 1)
    {
      if (lines[i] === "-----BEGIN RSA PRIVATE KEY-----")
      {
	key = lines[i] + '\n';
	inKey = true;
      }
      else if (lines[i] === "-----END RSA PRIVATE KEY-----")
      {
	key += lines[i] + '\n';
	inKey = false;
      }
      else if (inKey)
      {
	key += lines[i] + '\n';
      }
      else if (lines[i] === "-----BEGIN CERTIFICATE-----")
      {
	cert += lines[i] + '\n';
	inCert = true;
      }
      else if (lines[i] === "-----END CERTIFICATE-----")
      {
	cert += lines[i] + '\n';
	inCert = false;
      }
      else if (inCert)
      {
	cert += lines[i] + '\n';
      }
    }

    cache.set('userKey', key);
    cache.set('userCert', cert);

    this.getCertFields(cert);
  };

  Login.prototype.getCertFields = function (certificate)
  {
    var cert = forge.pki.certificateFromPem(certificate);
    var found = false;
    var urn;
    var name;

    var altField;
    _.each(cert.extensions, function (field) {
      if (field.name === 'subjectAltName')
      {
	altField = field;
      }
    });
    if (altField)
    {
      _.each(altField.altNames, function (item) {
	if (item.type === 6 && item.value.substr(0, 12) === 'urn:publicid')
	{
	  urn = item.value;
	}
      });
    }
    if (urn)
    {
      name = urn.split('+')[3];
      cache.set('userUrn', urn);
      cache.set('userName', name);
      found = true;
    }

    if (found)
    {
      var authorityUrn = 'urn:publicid:IDN+' + urn.split('+')[1] +
	'+authority+sa';
      var index = 0;
      _.each(this.saList, function (provider, i) {
	if (provider.urn === authorityUrn)
	{
	  index = i;
	}
      });
      cache.set('provider', this.saList[index]);

      var currentSAName;
      if (cache.get('provider').name)
      {
	currentSAName = _.escape(cache.get('provider').name);
      }
      else
      {
	currentSAName = _.escape(cache.get('provider')['urn'].split('+')[1]);
      }
      this.view.fillPassphraseForm(name, currentSAName);
    }
  };

  Login.prototype.tryPassphrase = function (passphrase)
  {
    try
    {
      var decrypted = forge.pki.decryptRsaPrivateKey(cache.get('userKey'),
						     passphrase);
      var keyText = forge.pki.privateKeyToPem(decrypted);
      $.ajaxforge.initialize('SocketPool.swf', 'socketPool',
			     cache.get('cabundle'), keyText,
			     cache.get('userCert'));
      this.root.find('#passError').addClass('hidden');
      this.root.find('#passGroup').removeClass('has-error');
      cache.set('passphrase', passphrase);
      this.trigger('login-complete');
    }
    catch (e)
    {
      console.log('Error: ', e);
      this.root.find('#passError').html('Could not decrypt private key. Please check your passphrase.');
      this.root.find('#passError').removeClass('hidden');
      this.root.find('#passGroup').addClass('has-error');
    }
  };

  function logout(event)
  {
    event.preventDefault();
    cache.remove('passphrase');
    cache.remove('userName');
    cache.remove('userUrn');
    cache.remove('userCert');
    cache.remove('userKey');
    cache.remove('userCredential');
    cache.remove('provider');
    cache.remove('salist');
    cache.remove('amlist');
    cache.remove('cabundle');
    window.location.reload();
  }

  return Login;
});

/*jshint browser:true */
/*global jQuery */
(function($) {
	

	var XmlRpcFault = function() {
		Error.apply(this, arguments);
	};
	XmlRpcFault.prototype = new Error();
	XmlRpcFault.prototype.type = 'XML-RPC fault';

	var xmlrpc = $.xmlrpc = function(url, settings) {

		if (arguments.length === 2) {
			settings.url = url;
		} else {
			settings = url;
			url = settings.url;
		}

		settings.dataType = 'xml json';
		settings.type = 'POST';
		settings.contentType = 'text/xml';
		settings.converters = {'xml json': xmlrpc.parseDocument};

		var xmlDoc = xmlrpc.document(settings.methodName, settings.params || []);

		if ("XMLSerializer" in window) {
			settings.data = new window.XMLSerializer().serializeToString(xmlDoc);
		} else {
			// IE does not have XMLSerializer
			settings.data = xmlDoc.xml;
		}

		return $.ajaxforge(settings);
	};

	/**
	* Make an XML document node.
	*/
	xmlrpc.createXMLDocument = function () {

		if (document.implementation && "createDocument" in document.implementation) {
			// Most browsers support createDocument
			return document.implementation.createDocument(null, null, null);

		} else {
			// IE uses ActiveXObject instead of the above.
			var i, length, activeX = [
				"MSXML6.DomDocument", "MSXML3.DomDocument",
				"MSXML2.DomDocument", "MSXML.DomDocument", "Microsoft.XmlDom"
			];
			for (i = 0, length = activeX.length; i < length; i++) {
				try {
					return new ActiveXObject(activeX[i]);
				} catch(_) {}
			}
		}
	};

	/**
	* Make an XML-RPC document from a method name and a set of parameters
	*/
	xmlrpc.document = function(name, params) {
		var doc = xmlrpc.createXMLDocument();


		var $xml = function(name) {
			return $(doc.createElement(name));
		};

		var $methodName = $xml('methodName').text(name);
		var $params = $xml('params').append($.map(params, function(param) {
			var $value = $xml('value').append(xmlrpc.toXmlRpc(param, $xml));
			return $xml('param').append($value);
		}));
		var $methodCall = $xml('methodCall').append($methodName, $params);
		doc.appendChild($methodCall.get(0));
		return doc;
	};

	var _isInt = function(x) {
		return (x === parseInt(x, 10)) && !isNaN(x);
	};

	/**
	* Take a JavaScript value, and return an XML node representing the value
	* in XML-RPC style. If the value is one of the `XmlRpcType`s, that type is
	* used. Otherwise, a best guess is made as to its type. The best guess is
	* good enough in the vast majority of cases.
	*/
	xmlrpc.toXmlRpc = function(item, $xml) {

		if (item instanceof XmlRpcType) {
			return item.toXmlRpc($xml);
		}

		var types = $.xmlrpc.types;
		var type = $.type(item);

		switch (type) {
			case "undefined":
			case "null":
				return types.nil.encode(item, $xml);

			case "date":
				return types['datetime.iso8601'].encode(item, $xml);

			case "object":
				if (item instanceof ArrayBuffer) {
					return types.base64.encode(item, $xml);
				} else {
					return types.struct.encode(item, $xml);
				}
				break;


			case "number":
				// Ints and Floats encode differently
				if (_isInt(item)) {
					return types['int'].encode(item, $xml);
				} else {
					return types['double'].encode(item, $xml);
				}
				break;

			case "array":
			case "boolean":
			case "string":
				return types[type].encode(item, $xml);

			default:
				throw new Error("Unknown type", item);
		}
	};

	/**
	* Take an XML-RPC document and decode it to an equivalent JavaScript
	* representation.
	*
	* If the XML-RPC document represents a fault, then an equivalent
	* XmlRpcFault will be thrown instead
	*/
	xmlrpc.parseDocument = function(doc) {
		var $doc = $(doc);
		var $response = $doc.children('methodresponse');

		var $fault = $response.find('> fault');
		if ($fault.length === 0) {
			var $params = $response.find('> params > param > value > *');
			var json = $params.toArray().map(xmlrpc.parseNode);
			return json;
		} else {
			var fault = xmlrpc.parseNode($fault.find('> value > *').get(0));
			var err = new XmlRpcFault(fault.faultString);
			err.msg = err.message = fault.faultString;
			err.type = err.code = fault.faultCode;
		  console.log('err', err);
			throw err;
		}
	};

	/*
	* Take an XML-RPC node, and return the JavaScript equivalent
	*/
	xmlrpc.parseNode = function(node) {

		// Some XML-RPC services return empty <value /> elements. This is not
		// legal XML-RPC, but we may as well handle it.
		if (node === undefined) {
			return null;
		}
		var nodename = node.nodeName.toLowerCase();
		if (nodename in xmlrpc.types) {
			return xmlrpc.types[nodename].decode(node);
		} else {
			throw new Error('Unknown type ' + nodename);
		}
	};

	/*
	* Take a <value> node, and return the JavaScript equivalent.
	*/
	xmlrpc.parseValue = function(value) {
		var child = $(value).children()[0];
		if (child) {
			// Child nodes should be decoded.
			return xmlrpc.parseNode(child);
		} else {
			// If no child nodes, the value is a plain text node.
			return $(value).text();
		}
	};

	var XmlRpcType = function() { };

	$.xmlrpc.types = {};

	/**
	* Make a XML-RPC type. We use these to encode and decode values. You can
	* also force a values type using this. See `$.xmlrpc.force()`
	*/
	xmlrpc.makeType = function(tagName, simple, encode, decode) {
		var Type;

		Type = function(value) {
			this.value = value;
		};
		Type.prototype = new XmlRpcType();
		Type.prototype.tagName = tagName;

		if (simple) {
			var simpleEncode = encode, simpleDecode = decode;
			encode = function(value, $xml) {
				var text = simpleEncode(value);
				return $xml(Type.tagName).text(text);
			};
			decode = function(node) {
				return simpleDecode($(node).text(), node);
			};
		}
		Type.prototype.toXmlRpc = function($xml) {
			return Type.encode(this.value, $xml);
		};

		Type.tagName = tagName;
		Type.encode = encode;
		Type.decode = decode;

		xmlrpc.types[tagName.toLowerCase()] = Type;
	};


	// Number types
	var _fromInt = function(value) { return '' + Math.floor(value); };
	var _toInt = function(text, _) { return parseInt(text, 10); };

	xmlrpc.makeType('int', true, _fromInt, _toInt);
	xmlrpc.makeType('i4', true, _fromInt, _toInt);
	xmlrpc.makeType('i8', true, _fromInt, _toInt);
	xmlrpc.makeType('i16', true, _fromInt, _toInt);
	xmlrpc.makeType('i32', true, _fromInt, _toInt);

	xmlrpc.makeType('double', true, String, function(text) {
		return parseFloat(text, 10);
	});

	// String type. Fairly simple
	xmlrpc.makeType('string', true, String, String);

	// Boolean type. True == '1', False == '0'
	xmlrpc.makeType('boolean', true, function(value) {
		return value ? '1' : '0';
	}, function(text) {
		return text === '1';
	});

	// Dates are a little trickier
	var _pad = function(n) { return n<10 ? '0'+n : n; };

	xmlrpc.makeType('dateTime.iso8601', true, function(d) {
		return [
			d.getUTCFullYear(), '-', _pad(d.getUTCMonth()+1), '-',
			_pad(d.getUTCDate()), 'T', _pad(d.getUTCHours()), ':',
			_pad(d.getUTCMinutes()), ':', _pad(d.getUTCSeconds()), 'Z'
		].join('');
	}, function(text) {
		return new Date(text);
	});

	// Go between a base64 string and an ArrayBuffer
	xmlrpc.binary = (function() {
		var pad = '=';
		var toChars = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
			'abcdefghijklmnopqrstuvwxyz0123456789+/').split("");
		var fromChars = toChars.reduce(function(acc, chr, i) {
			acc[chr] = i;
			return acc;
		}, {});

		/*
		* In the following, three bytes are added together into a 24-bit
		* number, which is then split up in to 4 6-bit numbers - or vice versa.
		* That is why there is lots of shifting by multiples of 6 and 8, and
		* the magic numbers 3 and 4.
		*
		* The modulo 64 is for converting to base 64, and the modulo 256 is for
		* converting to 8-bit numbers.
		*/
		return {
			toBase64: function(ab) {
				var acc = [];

				var int8View = new Uint8Array(ab);
				var int8Index = 0, int24;
				for (; int8Index < int8View.length; int8Index += 3) {

					// Grab three bytes
					int24 =
						(int8View[int8Index + 0] << 16) +
						(int8View[int8Index + 1] << 8) +
						(int8View[int8Index + 2] << 0);

					// Push four chars
					acc.push(toChars[(int24 >> 18) % 64]);
					acc.push(toChars[(int24 >> 12) % 64]);
					acc.push(toChars[(int24 >> 6) % 64]);
					acc.push(toChars[(int24 >> 0)% 64]);
				}

				// Set the last few characters to the padding character
				var padChars = 3 - ((ab.byteLength % 3) || 3);
				while (padChars--) {
					acc[acc.length - padChars - 1] = pad;
				}

				return acc.join('');
			},

			fromBase64: function(base64) {
				var base64Len = base64.length;

				// Work out the length of the data, accommodating for padding
				var abLen = (base64Len / 4) * 3;
				if (base64.charAt(base64Len - 1) === pad) { abLen--; }
				if (base64.charAt(base64Len - 2) === pad) { abLen--; }

				// Make the ArrayBuffer, and an Int8Array to work with it
				var ab = new ArrayBuffer(abLen);
				var int8View = new Uint8Array(ab);

				var base64Index = 0, int8Index = 0, int24;
				for (; base64Index < base64Len; base64Index += 4, int8Index += 3) {

					// Grab four chars
					int24 =
						(fromChars[base64[base64Index + 0]] << 18) +
						(fromChars[base64[base64Index + 1]] << 12) +
						(fromChars[base64[base64Index + 2]] << 6) +
						(fromChars[base64[base64Index + 3]] << 0);

					// Push three bytes
					int8View[int8Index + 0] = (int24 >> 16) % 256;
					int8View[int8Index + 1] = (int24 >> 8) % 256;
					int8View[int8Index + 2] = (int24 >> 0) % 256;

				}

				return ab;
			}
		};
	})();

	xmlrpc.makeType('base64', true, function(ab) {
		return xmlrpc.binary.toBase64(ab);
	}, function(text) {
		return xmlrpc.binary.fromBase64(text);
	});

	// Nil/null
	xmlrpc.makeType('nil', false,
		function(val, $xml) { return $xml('nil'); },
		function(_) { return null; }
	);

	// Structs/Objects
	xmlrpc.makeType('struct', false, function(value, $xml) {
		var $struct = $xml('struct');

		$.each(value, function(name, value) {
			var $name = $xml('name').text(name);
			var $value = $xml('value').append(xmlrpc.toXmlRpc(value, $xml));
			$struct.append($xml('member').append($name, $value));
		});

		return $struct;

	}, function(node) {
		return $(node)
			.find('> member')
			.toArray()
			.reduce(function(struct, el) {
				var $el = $(el);
				var key = $el.find('> name').text();
				var value = xmlrpc.parseValue($el.find('> value'));

				struct[key] = value;
				return struct;
			}, {});

	});

	// Arrays
	xmlrpc.makeType('array', false, function(value, $xml) {
		var $array = $xml('array');
		var $data = $xml('data');
		$.each(value, function(i, val) {
			$data.append($xml('value').append(xmlrpc.toXmlRpc(val, $xml)));
		});
		$array.append($data);
		return $array;
	}, function(node) {
		return $(node).find('> data > value').toArray()
			.map(xmlrpc.parseValue);
	});


	/**
	* Force a value to an XML-RPC type. All the usual XML-RPC types are
	* supported
	*/
	xmlrpc.force = function(type, value) {
		return new xmlrpc.types[type](value);
	};

})(jQuery);

define("lib/jquery.xmlrpc", function(){});

define('js/actor/FetchSlices',['underscore', 'backbone', 'q', 'js/cache',
	'lib/jquery.xmlrpc'],
function (_, Backbone, Q, cache)
{
  

  function FetchSlices (root, transition, amList, canvas)
  {
    this.root = root;
    this.transition = transition;
    this.amList = amList;
    this.canvas = canvas;
    this.userSlices = null;
  }

  FetchSlices.prototype.checkCode = function (response, action, isGeni)
  {
    if ((! isGeni && response[0].code !== 0) ||
	(isGeni && response[0].code.geni_code !== 0))
    {
      this.transition.startFail($('#loginContainer'), 'Failed: ' + action,
				response);
      throw 'Failed: ' + action + JSON.stringify(response);
    }
  };

  FetchSlices.prototype.fetchXmlrpc = function ()
  {
    var that = this;
    this.transition.startWaiting($('#passphrase'), null);
    var deferred = Q.defer();
    var promise = deferred.promise;
    if (!cache.get('userCredential'))
    {
      promise = promise.then(function () {
        that.transition.startWaiting(null, 'Fetching Your Credential...');
        return $.xmlrpc({
	  url: cache.get('provider')['pg-sa-url'],
	  methodName: 'GetCredential',
	  params: [{}]
        });
      }).then(function (response) {
	that.checkCode(response, 'Fetch Credential');
        cache.set('userCredential', response[0].value);
      });
    }
    promise.then(function () {
      that.transition.startWaiting(null, 'Finding Slices...');
      return $.xmlrpc({
        url: cache.get('provider')['pg-sa-url'],
        methodName: 'Resolve',
        params: [{credential: cache.get('userCredential'),
		  urn: cache.get('userUrn'),
		  type: 'User' }]
      });
    }).then(function (response) {
      that.checkCode(response, 'Find Slices');
      that.userSlices = response[0].value.slices;
      if (! that.userSlices)
      {
	that.transition.startFail($('#loginContainer'), 'Found no slices',
				  response);
	throw 'Found no slices: ' + JSON.stringify(response);
      }
      that.updateSliceList(_.bind(that.selectSlice, that));
      that.transition.stopWaiting($('#sliceListContainer'));
    }).fail(function (error) {
      that.transition.startFail($('#loginContainer'), 'Error during setup',
				error);
      console.log('ERROR: ', error);
    });
    deferred.resolve();
  };

  FetchSlices.prototype.selectSlice = function (sliceUrn)
  {
    var that = this;
    if ($('#loginContainer').hasClass('afterHide')) {
      this.transition.page($('#canvasContainer'), $('#loginContainer'));
      $('#waitContainer').removeClass('hides afterHide');
    }
    this.transition.startWaiting($('#sliceListContainer'),
				 'Resolving Slice...');

    var sliceCredential;
    var amUrl;
    var promise = $.xmlrpc({
      url: cache.get('provider')['pg-sa-url'],
      methodName: 'Resolve',
      params: [{credential: cache.get('userCredential'),
		urn: sliceUrn,
		type: 'Slice' }]
    });
    promise.then(function (response) {
      that.checkCode(response, 'Resolving Slice');
      that.transition.startWaiting(null, 'Fetching Credential...');
      var urn = response[0].value.component_managers[0];
      if (! urn)
      {
	that.transition.startFail($('#loginContainer'),
				  'Could not find AM URN for this slice',
				  null);
	throw 'Could not find URN for this slice';
      }
      amUrl = that.amList[urn];
      if (! amUrl)
      {
	that.transition.startFail($('#loginContainer'),
				  'Could not convert AM URN ' + urn 
				  + ' to URL', null);
	throw 'Could not convert AM URN to URL';
      }
      return $.xmlrpc({
	url: cache.get('provider')['pg-sa-url'],
	methodName: 'GetCredential',
	params: [{credential: cache.get('userCredential'),
		  urn: sliceUrn,
		  type: 'Slice' }]
      });
    }).then(function (response) {
      that.checkCode(response, 'Fetching Credential');
      that.transition.startWaiting(null, 'Fetching Manifest...');

      //  sliceCredential = { 'geni_type': 'geni_sfa',
      //          'geni_version': '3',
      //          'geni_value': response[0].value };

      sliceCredential = response[0].value;
      var options = {
	'geni_rspec_version': {
	  'type': 'ProtoGENI',
	  'version': '3'
	},
	'geni_slice_urn': sliceUrn
      };
      return $.xmlrpc({
        url: amUrl,
	methodName: 'ListResources',
        params: [[sliceCredential], options]
      });
    }).then(function (response) {
      that.checkCode(response, 'Fetching Manifest', true);
      that.transition.switchNav($('#small'));
      $('#canvasContainer').removeClass('afterHide');
      that.transition.page($('#loginContainer'), that.canvas.domRoot);
      that.canvas.show(response[0].value);
      that.transition.stopWaiting($('#sliceListContainer'));
      //      initJacks($('#canvasContainer'), response[0].value);
      var name = sliceUrn.split('+')[3];
      $('#lnSliceList .active').removeClass('active');
      $('.name' + name).addClass('active');
    }).fail(function (error) {
      that.transition.startFail($('#loginContainer'), 'Error during setup',
				error);
      console.log('ERROR: ', error);
    });
  };


  FetchSlices.prototype.updateSliceList = function (selectSlice)
  {
    var that = this;
    var options = $('<div/>');
    var options2 = $('<div/>');
    _.each(that.userSlices, function (urn) {
      var name = urn.split('+')[3];
      var newOption = $('<a class="list-group-item" href="">' + name + 
			'<span class="glyphicon glyphicon-chevron-right pull-right"></span>' +
			'</a>');
      newOption.click(function (event) {
	event.preventDefault();
	selectSlice(urn);
      });
      options.append(newOption);
      var newOption2 = $('<a class="list-group-item name' + name + '" href="">' + name + 
			 '<span class="glyphicon glyphicon-chevron-right pull-right"></span>' +
			 '</a>');
      newOption2.click(function (event) {
	event.preventDefault();
	selectSlice(urn);
	$('#leftNav > .active').removeClass('active');
      });
      options2.append(newOption2);
    });
    $('#slice-list').html(options);
    $('#lnSliceList').html(options2);
  }

  return FetchSlices;
});

define('js/actor/Actor.js',['underscore', 'backbone', 'js/cache',
	'js/actor/Login', 'js/actor/FetchSlices'],
function (_, Backbone, cache, Login, FetchSlices)
{
  

  function Actor(rootDom, canvas, transition)
  {
    this.rootDom = rootDom;
    this.canvas = canvas;
    this.transition = transition;
    this.saList = [];
    this.amList = {};
    this.bundle = '';
    this.login = null;
    this.fetchSlices = null;

    swfobject.embedSWF(
      'SocketPool.swf', 'socketPool',
      '0', '0',
      '9.0.0', false,
      {}, {allowscriptaccess: 'always'}, {}, _.bind(this.swfComplete, this));
    swfobject.createCSS("#socketPool", "opacity: 1;");
  }

  Actor.prototype.swfComplete = function (event)
  {
    if (event.success)
    {
      var sa, am, caBundle;

      if (cache.get('salist'))
      {
	this.parseSAList(cache.get('salist'));
      }
      else
      {
	sa = $.ajax({
	  url: 'https://www.emulab.net/protogeni/boot/salist.json',
	  dataType: 'text'
	}).then(_.bind(this.parseSAList, this));
      }

      if (cache.get('amlist'))
      {
	this.parseAMList(cache.get('amlist'));
      }
      else
      {
	am = $.ajax({
	  url: 'https://www.emulab.net/protogeni/boot/amlist.json',
	  dataType: 'text'
	}).then(_.bind(this.parseAMList, this));
      }

      if (cache.get('cabundle'))
      {
	this.parseCABundle(cache.get('cabundle'));
      }
      else
      {
	caBundle = $.ajax({
	  url: 'https://www.emulab.net/protogeni/boot/genica.bundle',
	  dataType: 'text'
	}).then(_.bind(this.parseCABundle, this));
      }

      var waitForSwf = $.Deferred();
      setTimeout(function () {
	waitForSwf.resolve();
      }, 500);

      var that = this;
      $.when(sa, am, caBundle, waitForSwf.promise()).then(function () {
	that.transition.page(that.rootDom.find('#loadingContainer'),
			     that.rootDom.find('#loginContainer'));
	that.login = new Login(that.rootDom, that.canvas, that.transition,
			       that.saList);
	that.login.on('login-complete', _.bind(that.loginComplete, that));
      });
    }
    else
    {
      this.transition.startFail(this.rootDom.find('#loadingContainer'),
				'Failed to load socket flash file', event);
    }
  };

  Actor.prototype.parseSAList = function (response)
  {
    cache.set('salist', response);
    var inputOptions = '';
    var data = JSON.parse(response);
    var list = data['identity-providers'];
    this.saList = list;
  };

  Actor.prototype.parseAMList = function (response)
  {
    cache.set('amlist', response);
    var data = JSON.parse(response);
    var list = data['aggregate-managers'];

    var that = this;
    _.each(list, function (item) {
      that.amList[item.urn] = item['am-url'];
    });
  };

  Actor.prototype.parseCABundle = function (response)
  {
    cache.set('cabundle', response);
  };

  Actor.prototype.loginComplete = function ()
  {
    this.fetchSlices = new FetchSlices(this.rootDom, this.transition,
				       this.amList, this.canvas);
    this.fetchSlices.fetchXmlrpc();
  };

  return Actor;
});


define('text!html/Viewer.html',[],function () { return '<!-- Error Mode -->\n<div id="failContainer" class="container hides afterHide">\n  <div class="row">\n    <div class="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 col-xs-offset-0">\n      <div class="alert alert-danger">\n\t<h1 id="failTitle"></h1>\n\t<pre id="failMessage"></pre>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- Main Jacks page -->\n<div id="canvasContainer" class="container"></div>\n<!-- End Main Jacks page -->\n\n<!-- Loading containers -->\n<div id="loadingContainer" class="container">\n  <div class="row loading">\n    <h1 id="title">Loading...</h1>\n    <noscript>\n      <h1>Jacks requires that JavaScript be turned on</h1>\n    </noscript>\n  </div>\n</div>\n<!-- End Loading containers -->\n';});


define('text!html/Actor.html',[],function () { return '<div id="wrap">\r\n\r\n<!-- Top nav -->\r\n\r\n  <div id="large" class="navbar navbar-static-top" role="navigation">\r\n    <button class="btn btn-danger logout pull-right">Logout</button>\r\n    <div class="brand">\r\n      <div class="logo-container">\r\n\t<img height="45px" src="images/jacks-logo.svg">\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div id="small" class="navbar navbar-static-top hidden" role="navigation">\r\n    <button class="btn btn-danger logout pull-right">Logout</button>\r\n    <div class="brand">\r\n      <div class="logo-container">\r\n\t<img height="25px" src="images/jacks-logo.svg">\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n<!-- End Top nav -->\r\n\r\n<!-- Error Mode -->\r\n  <div id="failContainer" class="container hides afterHide">\r\n    <div class="row">\r\n      <div class="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 col-xs-offset-0">\r\n\t<div class="alert alert-danger">\r\n\t  <h1 id="failTitle"></h1>\r\n\t  <pre id="failMessage"></pre>\r\n\t</div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n<!-- Main Jacks page -->\r\n  <div id="canvasContainer" class="container hides afterHide"></div>\r\n<!-- End Main Jacks page -->\r\n\r\n<!-- Loading containers -->\r\n\r\n  <div id="loadingContainer" class="container">\r\n    <div class="row loading">\r\n      <h1 id="title">Loading...</h1>\r\n      <noscript>\r\n        <h1>Jacks requires that JavaScript be turned on</h1>\r\n      </noscript>\r\n    </div>\r\n  </div>\r\n\r\n<!-- End Loading containers -->\r\n\r\n  <div class="windowOpen hidden">\r\n    <div class="alert alert-success"><h5 class="panel-title">Please continue in popup window.</h5></div>\r\n  </div>\r\n\r\n<!-- Login pages -->\r\n\r\n  <div id="loginContainer" class="container hides"></div></div>\r\n\r\n\r\n\r\n<!-- End Login pages -->\r\n</div>\r\n\r\n<div id="socketPool" class="row hides">\r\n  <p>Could not load the Flash SocketPool for Jacks. Make sure you have Flash installed.</p>\r\n</div>\r\n';});


define('text!html/Editor.html',[],function () { return '<!-- Error Mode -->\n<div id="failContainer" class="container hides afterHide">\n  <div class="row">\n    <div class="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12 col-xs-offset-0">\n      <div class="alert alert-danger">\n\t<h1 id="failTitle"></h1>\n\t<pre id="failMessage"></pre>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- Main Jacks page -->\n<div id="canvasContainer" class="container"></div>\n<!-- End Main Jacks page -->\n\n<!-- Loading containers -->\n<div id="loadingContainer" class="container">\n  <div class="row loading">\n    <h1 id="title">Loading...</h1>\n    <noscript>\n      <h1>Jacks requires that JavaScript be turned on</h1>\n    </noscript>\n  </div>\n</div>\n<!-- End Loading containers -->\n';});

/*
 * main.js
 *
 */

/*global require: true */
/*
require.config({
  baseUrl: '.',
  paths: {
    'jquery-xmlrpc': 'lib/jquery.xmlrpc',
    'backbone': 'lib/backbone-min',
    'd3': 'lib/d3.v3',
    'underscore': 'lib/underscore-min',
    'demo': 'js/demo',
    'tourist': 'lib/tourist',
    'q': 'lib/q.min',
    'highlight': 'lib/highlight.pack',
    'text': 'lib/text'
  },
  shim: {
    'jquery-xmlrpc': { deps: ['js/ajaxforge'] },
    'backbone': { deps: ['underscore'], exports: 'Backbone' },
    'tourist': { deps: ['backbone'], exports: 'Tourist' },
    'underscore': { exports: '_' },
    'd3': { exports: 'd3' },
    'highlight': { exports: 'hljs' }
  }
});
*/
require({
    baseUrl: '.',
    paths: {
      'jquery-xmlrpc': 'lib/jquery.xmlrpc',
      'backbone': 'lib/backbone-min',
      'd3': 'lib/d3.v3',
      'underscore': 'lib/underscore-min',
      'demo': 'js/demo',
      'tourist': 'lib/tourist',
      'q': 'lib/q.min',
      'highlight': 'lib/highlight.pack',
      'select2': 'lib/select2.min',
      'text': 'lib/text'
    },
    shim: {
      'jquery-xmlrpc': { deps: ['js/ajaxforge'] },
      'backbone': { deps: ['underscore'], exports: 'Backbone' },
      'tourist': { deps: ['backbone'], exports: 'Tourist' },
      'underscore': { exports: '_' },
      'd3': { exports: 'd3' },
      'highlight': { exports: 'hljs' }
    }
  },
  ['underscore', 'backbone', 'js/Transition', 'js/cache',
   'js/canvas/Canvas', 'js/actor/Actor.js', 'js/canvas/ValidList',
   'text!html/Viewer.html', 'text!html/Actor.html',
   'text!html/Editor.html'],
function (_, Backbone, Transition, cache,
	  Canvas, Actor, ValidList,
	  viewerString, actorString, editorString)
{
  

  window.JACKS_LOADER.version = '2015-03-06-A';

  var defaults = {
    mode: 'viewer',
    multiSite: false,
    source: 'rspec',
    root: 'body',
    nodeSelect: true,
    size: 'auto',
    canvasOptions: {}
  };

  var defaultDefault = {
    name: 'Add Node'
  };

  var defaultShow = {
    rspec: true,
    tour: true,
    version: true,
    menu: true,
    selectInfo: false,
    clear: true
  };

  function MainClass(context)
  {
    this.context = _.defaults(context, defaults);
    if (this.context.show)
    {
      var show = _.clone(defaultShow);
      if (context.nodeSelect)
      {
	show.selectInfo = true;
      }
      this.context.show = _.defaults(this.context.show, defaultShow);
    }
    else
    {
      this.context.show = defaultShow;
    }
    if (! this.context.canvasOptions.defaults)
    {
      this.context.canvasOptions.defaults = [defaultDefault];
    }
    if (this.context.mode === 'viewer' && ! this.context.nodeSelect)
    {
      this.context.show.selectInfo = false;
    }
    this.updateIn = {};
    _.extend(this.updateIn, Backbone.Events);
    this.updateOut = {};
    _.extend(this.updateOut, Backbone.Events);

    this.root = $(context.root);
    this.root.show();
    this.transition = new Transition(this.root);

    if (context.mode === 'viewer' && context.source === 'api')
    {
      this.root.html(actorString);
      this.canvas = new Canvas(context, this.root.find('#canvasContainer'),
			       this.root, this.updateIn, this.updateOut);
      this.canvas.show();
      this.actor = new Actor(this.root, this.canvas, this.transition);
    }
    else if (context.mode === 'viewer' && context.source === 'rspec')
    {
      this.root.html(viewerString);
      this.canvas = new Canvas(context, this.root.find('#canvasContainer'),
			       this.root, this.updateIn, this.updateOut);
      this.canvas.show();
      this.root.find('#loadingContainer').hide();
      this.root.find('#canvasContainer').show();
    }
    else if (context.mode === 'editor' && context.source === 'rspec')
    {
      this.root.html(editorString);
      this.canvas = new Canvas(context, this.root.find('#canvasContainer'),
			       this.root, this.updateIn, this.updateOut);
      this.canvas.show();
      this.root.find('#loadingContainer').hide();
      this.root.find('#canvasContainer').show();
    }

    this.updateIn.on('change-topology', _.bind(this.changeTopologyHandler,
					       this));
    this.updateIn.on('add-topology', _.bind(this.addTopologyHandler,
					    this));
    this.updateIn.on('resize', _.bind(this.resizeHandler, this));
    this.updateIn.on('fetch-topology', _.bind(this.fetchTopologyHandler,
					      this));
  }

  MainClass.prototype.changeTopologyHandler = function (list, options)
  {
    this.canvas.clear();
    if (list.length > 0)
    {
      this.canvas.addRspec(list);
    }
    if (options && options.constrainedFields)
    {
      var validList = new ValidList(this.canvas.topoData, this.canvas.constraints);
      var clauses = validList.getNodeCandidates();
      options.constrainedFields(clauses);
    }
  };

  MainClass.prototype.addTopologyHandler = function (list)
  {
    if (this.canvas.hasNodes())
    {
      this.canvas.addRspec(list);
    }
    else
    {
      this.changeTopologyHandler(list);
    }
  };

  MainClass.prototype.resizeHandler = function (size)
  {
    this.canvas.resize(size);
  };

  MainClass.prototype.fetchTopologyHandler = function ()
  {
    var rspec = this.canvas.generateRequest();
    this.updateOut.trigger('fetch-topology', [{ rspec: rspec }]);
  };

  function initialize ()
  {
    window.JACKS_LOADER.isReady = true;
    window.JACKS_LOADER.MainClass = MainClass;
    if (window.JACKS_LOADER.onReady)
    {
      _.defer(_.bind(window.JACKS_LOADER.onReady, window.JACKS_LOADER));
    }
  }

  $(document).ready(initialize);
});

define("js/main", function(){});


//# sourceMappingURL=main.js.map
