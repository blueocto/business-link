'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};!function($){"use strict";var FOUNDATION_VERSION='6.3.0';// Global Foundation object
// This is attached to the window, or used as a module for AMD/Browserify
var Foundation={version:FOUNDATION_VERSION,/**
   * Stores initialized plugins.
   */_plugins:{},/**
   * Stores generated unique ids for plugin instances
   */_uuids:[],/**
   * Returns a boolean for RTL support
   */rtl:function rtl(){return $('html').attr('dir')==='rtl';},/**
   * Defines a Foundation plugin, adding it to the `Foundation` namespace and the list of plugins to initialize when reflowing.
   * @param {Object} plugin - The constructor of the plugin.
   */plugin:function plugin(_plugin,name){// Object key to use when adding to global Foundation object
// Examples: Foundation.Reveal, Foundation.OffCanvas
var className=name||functionName(_plugin);// Object key to use when storing the plugin, also used to create the identifying data attribute for the plugin
// Examples: data-reveal, data-off-canvas
var attrName=hyphenate(className);// Add to the Foundation object and the plugins list (for reflowing)
this._plugins[attrName]=this[className]=_plugin;},/**
   * @function
   * Populates the _uuids array with pointers to each individual plugin instance.
   * Adds the `zfPlugin` data-attribute to programmatically created plugins to allow use of $(selector).foundation(method) calls.
   * Also fires the initialization event for each plugin, consolidating repetitive code.
   * @param {Object} plugin - an instance of a plugin, usually `this` in context.
   * @param {String} name - the name of the plugin, passed as a camelCased string.
   * @fires Plugin#init
   */registerPlugin:function registerPlugin(plugin,name){var pluginName=name?hyphenate(name):functionName(plugin.constructor).toLowerCase();plugin.uuid=this.GetYoDigits(6,pluginName);if(!plugin.$element.attr('data-'+pluginName)){plugin.$element.attr('data-'+pluginName,plugin.uuid);}if(!plugin.$element.data('zfPlugin')){plugin.$element.data('zfPlugin',plugin);}/**
           * Fires when the plugin has initialized.
           * @event Plugin#init
           */plugin.$element.trigger('init.zf.'+pluginName);this._uuids.push(plugin.uuid);return;},/**
   * @function
   * Removes the plugins uuid from the _uuids array.
   * Removes the zfPlugin data attribute, as well as the data-plugin-name attribute.
   * Also fires the destroyed event for the plugin, consolidating repetitive code.
   * @param {Object} plugin - an instance of a plugin, usually `this` in context.
   * @fires Plugin#destroyed
   */unregisterPlugin:function unregisterPlugin(plugin){var pluginName=hyphenate(functionName(plugin.$element.data('zfPlugin').constructor));this._uuids.splice(this._uuids.indexOf(plugin.uuid),1);plugin.$element.removeAttr('data-'+pluginName).removeData('zfPlugin')/**
           * Fires when the plugin has been destroyed.
           * @event Plugin#destroyed
           */.trigger('destroyed.zf.'+pluginName);for(var prop in plugin){plugin[prop]=null;//clean up script to prep for garbage collection.
}return;},/**
   * @function
   * Causes one or more active plugins to re-initialize, resetting event listeners, recalculating positions, etc.
   * @param {String} plugins - optional string of an individual plugin key, attained by calling `$(element).data('pluginName')`, or string of a plugin class i.e. `'dropdown'`
   * @default If no argument is passed, reflow all currently active plugins.
   */reInit:function reInit(plugins){var isJQ=plugins instanceof $;try{if(isJQ){plugins.each(function(){$(this).data('zfPlugin')._init();});}else{var type=typeof plugins==='undefined'?'undefined':_typeof(plugins),_this=this,fns={'object':function object(plgs){plgs.forEach(function(p){p=hyphenate(p);$('[data-'+p+']').foundation('_init');});},'string':function string(){plugins=hyphenate(plugins);$('[data-'+plugins+']').foundation('_init');},'undefined':function undefined(){this['object'](Object.keys(_this._plugins));}};fns[type](plugins);}}catch(err){console.error(err);}finally{return plugins;}},/**
   * returns a random base-36 uid with namespacing
   * @function
   * @param {Number} length - number of random base-36 digits desired. Increase for more random strings.
   * @param {String} namespace - name of plugin to be incorporated in uid, optional.
   * @default {String} '' - if no plugin name is provided, nothing is appended to the uid.
   * @returns {String} - unique id
   */GetYoDigits:function GetYoDigits(length,namespace){length=length||6;return Math.round(Math.pow(36,length+1)-Math.random()*Math.pow(36,length)).toString(36).slice(1)+(namespace?'-'+namespace:'');},/**
   * Initialize plugins on any elements within `elem` (and `elem` itself) that aren't already initialized.
   * @param {Object} elem - jQuery object containing the element to check inside. Also checks the element itself, unless it's the `document` object.
   * @param {String|Array} plugins - A list of plugins to initialize. Leave this out to initialize everything.
   */reflow:function reflow(elem,plugins){// If plugins is undefined, just grab everything
if(typeof plugins==='undefined'){plugins=Object.keys(this._plugins);}// If plugins is a string, convert it to an array with one item
else if(typeof plugins==='string'){plugins=[plugins];}var _this=this;// Iterate through each plugin
$.each(plugins,function(i,name){// Get the current plugin
var plugin=_this._plugins[name];// Localize the search to all elements inside elem, as well as elem itself, unless elem === document
var $elem=$(elem).find('[data-'+name+']').addBack('[data-'+name+']');// For each plugin found, initialize it
$elem.each(function(){var $el=$(this),opts={};// Don't double-dip on plugins
if($el.data('zfPlugin')){console.warn("Tried to initialize "+name+" on an element that already has a Foundation plugin.");return;}if($el.attr('data-options')){var thing=$el.attr('data-options').split(';').forEach(function(e,i){var opt=e.split(':').map(function(el){return el.trim();});if(opt[0])opts[opt[0]]=parseValue(opt[1]);});}try{$el.data('zfPlugin',new plugin($(this),opts));}catch(er){console.error(er);}finally{return;}});});},getFnName:functionName,transitionend:function transitionend($elem){var transitions={'transition':'transitionend','WebkitTransition':'webkitTransitionEnd','MozTransition':'transitionend','OTransition':'otransitionend'};var elem=document.createElement('div'),end;for(var t in transitions){if(typeof elem.style[t]!=='undefined'){end=transitions[t];}}if(end){return end;}else{end=setTimeout(function(){$elem.triggerHandler('transitionend',[$elem]);},1);return'transitionend';}}};Foundation.util={/**
   * Function for applying a debounce effect to a function call.
   * @function
   * @param {Function} func - Function to be called at end of timeout.
   * @param {Number} delay - Time in ms to delay the call of `func`.
   * @returns function
   */throttle:function throttle(func,delay){var timer=null;return function(){var context=this,args=arguments;if(timer===null){timer=setTimeout(function(){func.apply(context,args);timer=null;},delay);}};}};// TODO: consider not making this a jQuery function
// TODO: need way to reflow vs. re-initialize
/**
 * The Foundation jQuery method.
 * @param {String|Array} method - An action to perform on the current jQuery object.
 */var foundation=function foundation(method){var type=typeof method==='undefined'?'undefined':_typeof(method),$meta=$('meta.foundation-mq'),$noJS=$('.no-js');if(!$meta.length){$('<meta class="foundation-mq">').appendTo(document.head);}if($noJS.length){$noJS.removeClass('no-js');}if(type==='undefined'){//needs to initialize the Foundation object, or an individual plugin.
Foundation.MediaQuery._init();Foundation.reflow(this);}else if(type==='string'){//an individual method to invoke on a plugin or group of plugins
var args=Array.prototype.slice.call(arguments,1);//collect all the arguments, if necessary
var plugClass=this.data('zfPlugin');//determine the class of plugin
if(plugClass!==undefined&&plugClass[method]!==undefined){//make sure both the class and method exist
if(this.length===1){//if there's only one, call it directly.
plugClass[method].apply(plugClass,args);}else{this.each(function(i,el){//otherwise loop through the jQuery collection and invoke the method on each
plugClass[method].apply($(el).data('zfPlugin'),args);});}}else{//error for no class or no method
throw new ReferenceError("We're sorry, '"+method+"' is not an available method for "+(plugClass?functionName(plugClass):'this element')+'.');}}else{//error for invalid argument type
throw new TypeError('We\'re sorry, '+type+' is not a valid parameter. You must use a string representing the method you wish to invoke.');}return this;};window.Foundation=Foundation;$.fn.foundation=foundation;// Polyfill for requestAnimationFrame
(function(){if(!Date.now||!window.Date.now)window.Date.now=Date.now=function(){return new Date().getTime();};var vendors=['webkit','moz'];for(var i=0;i<vendors.length&&!window.requestAnimationFrame;++i){var vp=vendors[i];window.requestAnimationFrame=window[vp+'RequestAnimationFrame'];window.cancelAnimationFrame=window[vp+'CancelAnimationFrame']||window[vp+'CancelRequestAnimationFrame'];}if(/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)||!window.requestAnimationFrame||!window.cancelAnimationFrame){var lastTime=0;window.requestAnimationFrame=function(callback){var now=Date.now();var nextTime=Math.max(lastTime+16,now);return setTimeout(function(){callback(lastTime=nextTime);},nextTime-now);};window.cancelAnimationFrame=clearTimeout;}/**
   * Polyfill for performance.now, required by rAF
   */if(!window.performance||!window.performance.now){window.performance={start:Date.now(),now:function now(){return Date.now()-this.start;}};}})();if(!Function.prototype.bind){Function.prototype.bind=function(oThis){if(typeof this!=='function'){// closest thing possible to the ECMAScript 5
// internal IsCallable function
throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');}var aArgs=Array.prototype.slice.call(arguments,1),fToBind=this,fNOP=function fNOP(){},fBound=function fBound(){return fToBind.apply(this instanceof fNOP?this:oThis,aArgs.concat(Array.prototype.slice.call(arguments)));};if(this.prototype){// native functions don't have a prototype
fNOP.prototype=this.prototype;}fBound.prototype=new fNOP();return fBound;};}// Polyfill to get the name of a function in IE9
function functionName(fn){if(Function.prototype.name===undefined){var funcNameRegex=/function\s([^(]{1,})\(/;var results=funcNameRegex.exec(fn.toString());return results&&results.length>1?results[1].trim():"";}else if(fn.prototype===undefined){return fn.constructor.name;}else{return fn.prototype.constructor.name;}}function parseValue(str){if('true'===str)return true;else if('false'===str)return false;else if(!isNaN(str*1))return parseFloat(str);return str;}// Convert PascalCase to kebab-case
// Thank you: http://stackoverflow.com/a/8955580
function hyphenate(str){return str.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase();}}(jQuery);
'use strict';!function($){Foundation.Box={ImNotTouchingYou:ImNotTouchingYou,GetDimensions:GetDimensions,GetOffsets:GetOffsets/**
 * Compares the dimensions of an element to a container and determines collision events with container.
 * @function
 * @param {jQuery} element - jQuery object to test for collisions.
 * @param {jQuery} parent - jQuery object to use as bounding container.
 * @param {Boolean} lrOnly - set to true to check left and right values only.
 * @param {Boolean} tbOnly - set to true to check top and bottom values only.
 * @default if no parent object passed, detects collisions with `window`.
 * @returns {Boolean} - true if collision free, false if a collision in any direction.
 */};function ImNotTouchingYou(element,parent,lrOnly,tbOnly){var eleDims=GetDimensions(element),top,bottom,left,right;if(parent){var parDims=GetDimensions(parent);bottom=eleDims.offset.top+eleDims.height<=parDims.height+parDims.offset.top;top=eleDims.offset.top>=parDims.offset.top;left=eleDims.offset.left>=parDims.offset.left;right=eleDims.offset.left+eleDims.width<=parDims.width+parDims.offset.left;}else{bottom=eleDims.offset.top+eleDims.height<=eleDims.windowDims.height+eleDims.windowDims.offset.top;top=eleDims.offset.top>=eleDims.windowDims.offset.top;left=eleDims.offset.left>=eleDims.windowDims.offset.left;right=eleDims.offset.left+eleDims.width<=eleDims.windowDims.width;}var allDirs=[bottom,top,left,right];if(lrOnly){return left===right===true;}if(tbOnly){return top===bottom===true;}return allDirs.indexOf(false)===-1;};/**
 * Uses native methods to return an object of dimension values.
 * @function
 * @param {jQuery || HTML} element - jQuery object or DOM element for which to get the dimensions. Can be any element other that document or window.
 * @returns {Object} - nested object of integer pixel values
 * TODO - if element is window, return only those values.
 */function GetDimensions(elem,test){elem=elem.length?elem[0]:elem;if(elem===window||elem===document){throw new Error("I'm sorry, Dave. I'm afraid I can't do that.");}var rect=elem.getBoundingClientRect(),parRect=elem.parentNode.getBoundingClientRect(),winRect=document.body.getBoundingClientRect(),winY=window.pageYOffset,winX=window.pageXOffset;return{width:rect.width,height:rect.height,offset:{top:rect.top+winY,left:rect.left+winX},parentDims:{width:parRect.width,height:parRect.height,offset:{top:parRect.top+winY,left:parRect.left+winX}},windowDims:{width:winRect.width,height:winRect.height,offset:{top:winY,left:winX}}};}/**
 * Returns an object of top and left integer pixel values for dynamically rendered elements,
 * such as: Tooltip, Reveal, and Dropdown
 * @function
 * @param {jQuery} element - jQuery object for the element being positioned.
 * @param {jQuery} anchor - jQuery object for the element's anchor point.
 * @param {String} position - a string relating to the desired position of the element, relative to it's anchor
 * @param {Number} vOffset - integer pixel value of desired vertical separation between anchor and element.
 * @param {Number} hOffset - integer pixel value of desired horizontal separation between anchor and element.
 * @param {Boolean} isOverflow - if a collision event is detected, sets to true to default the element to full width - any desired offset.
 * TODO alter/rewrite to work with `em` values as well/instead of pixels
 */function GetOffsets(element,anchor,position,vOffset,hOffset,isOverflow){var $eleDims=GetDimensions(element),$anchorDims=anchor?GetDimensions(anchor):null;switch(position){case'top':return{left:Foundation.rtl()?$anchorDims.offset.left-$eleDims.width+$anchorDims.width:$anchorDims.offset.left,top:$anchorDims.offset.top-($eleDims.height+vOffset)};break;case'left':return{left:$anchorDims.offset.left-($eleDims.width+hOffset),top:$anchorDims.offset.top};break;case'right':return{left:$anchorDims.offset.left+$anchorDims.width+hOffset,top:$anchorDims.offset.top};break;case'center top':return{left:$anchorDims.offset.left+$anchorDims.width/2-$eleDims.width/2,top:$anchorDims.offset.top-($eleDims.height+vOffset)};break;case'center bottom':return{left:isOverflow?hOffset:$anchorDims.offset.left+$anchorDims.width/2-$eleDims.width/2,top:$anchorDims.offset.top+$anchorDims.height+vOffset};break;case'center left':return{left:$anchorDims.offset.left-($eleDims.width+hOffset),top:$anchorDims.offset.top+$anchorDims.height/2-$eleDims.height/2};break;case'center right':return{left:$anchorDims.offset.left+$anchorDims.width+hOffset+1,top:$anchorDims.offset.top+$anchorDims.height/2-$eleDims.height/2};break;case'center':return{left:$eleDims.windowDims.offset.left+$eleDims.windowDims.width/2-$eleDims.width/2,top:$eleDims.windowDims.offset.top+$eleDims.windowDims.height/2-$eleDims.height/2};break;case'reveal':return{left:($eleDims.windowDims.width-$eleDims.width)/2,top:$eleDims.windowDims.offset.top+vOffset};case'reveal full':return{left:$eleDims.windowDims.offset.left,top:$eleDims.windowDims.offset.top};break;case'left bottom':return{left:$anchorDims.offset.left,top:$anchorDims.offset.top+$anchorDims.height+vOffset};break;case'right bottom':return{left:$anchorDims.offset.left+$anchorDims.width+hOffset-$eleDims.width,top:$anchorDims.offset.top+$anchorDims.height+vOffset};break;default:return{left:Foundation.rtl()?$anchorDims.offset.left-$eleDims.width+$anchorDims.width:$anchorDims.offset.left+hOffset,top:$anchorDims.offset.top+$anchorDims.height+vOffset};}}}(jQuery);
/*******************************************
 *                                         *
 * This util was created by Marius Olbertz *
 * Please thank Marius on GitHub /owlbertz *
 * or the web http://www.mariusolbertz.de/ *
 *                                         *
 ******************************************/'use strict';!function($){var keyCodes={9:'TAB',13:'ENTER',27:'ESCAPE',32:'SPACE',37:'ARROW_LEFT',38:'ARROW_UP',39:'ARROW_RIGHT',40:'ARROW_DOWN'};var commands={};var Keyboard={keys:getKeyCodes(keyCodes),/**
   * Parses the (keyboard) event and returns a String that represents its key
   * Can be used like Foundation.parseKey(event) === Foundation.keys.SPACE
   * @param {Event} event - the event generated by the event handler
   * @return String key - String that represents the key pressed
   */parseKey:function parseKey(event){var key=keyCodes[event.which||event.keyCode]||String.fromCharCode(event.which).toUpperCase();// Remove un-printable characters, e.g. for `fromCharCode` calls for CTRL only events
key=key.replace(/\W+/,'');if(event.shiftKey)key='SHIFT_'+key;if(event.ctrlKey)key='CTRL_'+key;if(event.altKey)key='ALT_'+key;// Remove trailing underscore, in case only modifiers were used (e.g. only `CTRL_ALT`)
key=key.replace(/_$/,'');return key;},/**
   * Handles the given (keyboard) event
   * @param {Event} event - the event generated by the event handler
   * @param {String} component - Foundation component's name, e.g. Slider or Reveal
   * @param {Objects} functions - collection of functions that are to be executed
   */handleKey:function handleKey(event,component,functions){var commandList=commands[component],keyCode=this.parseKey(event),cmds,command,fn;if(!commandList)return console.warn('Component not defined!');if(typeof commandList.ltr==='undefined'){// this component does not differentiate between ltr and rtl
cmds=commandList;// use plain list
}else{// merge ltr and rtl: if document is rtl, rtl overwrites ltr and vice versa
if(Foundation.rtl())cmds=$.extend({},commandList.ltr,commandList.rtl);else cmds=$.extend({},commandList.rtl,commandList.ltr);}command=cmds[keyCode];fn=functions[command];if(fn&&typeof fn==='function'){// execute function  if exists
var returnValue=fn.apply();if(functions.handled||typeof functions.handled==='function'){// execute function when event was handled
functions.handled(returnValue);}}else{if(functions.unhandled||typeof functions.unhandled==='function'){// execute function when event was not handled
functions.unhandled();}}},/**
   * Finds all focusable elements within the given `$element`
   * @param {jQuery} $element - jQuery object to search within
   * @return {jQuery} $focusable - all focusable elements within `$element`
   */findFocusable:function findFocusable($element){if(!$element){return false;}return $element.find('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]').filter(function(){if(!$(this).is(':visible')||$(this).attr('tabindex')<0){return false;}//only have visible elements and those that have a tabindex greater or equal 0
return true;});},/**
   * Returns the component name name
   * @param {Object} component - Foundation component, e.g. Slider or Reveal
   * @return String componentName
   */register:function register(componentName,cmds){commands[componentName]=cmds;},/**
   * Traps the focus in the given element.
   * @param  {jQuery} $element  jQuery object to trap the foucs into.
   */trapFocus:function trapFocus($element){var $focusable=Foundation.Keyboard.findFocusable($element),$firstFocusable=$focusable.eq(0),$lastFocusable=$focusable.eq(-1);$element.on('keydown.zf.trapfocus',function(event){if(event.target===$lastFocusable[0]&&Foundation.Keyboard.parseKey(event)==='TAB'){event.preventDefault();$firstFocusable.focus();}else if(event.target===$firstFocusable[0]&&Foundation.Keyboard.parseKey(event)==='SHIFT_TAB'){event.preventDefault();$lastFocusable.focus();}});},/**
   * Releases the trapped focus from the given element.
   * @param  {jQuery} $element  jQuery object to release the focus for.
   */releaseFocus:function releaseFocus($element){$element.off('keydown.zf.trapfocus');}};/*
 * Constants for easier comparing.
 * Can be used like Foundation.parseKey(event) === Foundation.keys.SPACE
 */function getKeyCodes(kcs){var k={};for(var kc in kcs){k[kcs[kc]]=kcs[kc];}return k;}Foundation.Keyboard=Keyboard;}(jQuery);
'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};!function($){// Default set of media queries
var defaultQueries={'default':'only screen',landscape:'only screen and (orientation: landscape)',portrait:'only screen and (orientation: portrait)',retina:'only screen and (-webkit-min-device-pixel-ratio: 2),'+'only screen and (min--moz-device-pixel-ratio: 2),'+'only screen and (-o-min-device-pixel-ratio: 2/1),'+'only screen and (min-device-pixel-ratio: 2),'+'only screen and (min-resolution: 192dpi),'+'only screen and (min-resolution: 2dppx)'};var MediaQuery={queries:[],current:'',/**
   * Initializes the media query helper, by extracting the breakpoint list from the CSS and activating the breakpoint watcher.
   * @function
   * @private
   */_init:function _init(){var self=this;var extractedStyles=$('.foundation-mq').css('font-family');var namedQueries;namedQueries=parseStyleToObject(extractedStyles);for(var key in namedQueries){if(namedQueries.hasOwnProperty(key)){self.queries.push({name:key,value:'only screen and (min-width: '+namedQueries[key]+')'});}}this.current=this._getCurrentSize();this._watcher();},/**
   * Checks if the screen is at least as wide as a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to check.
   * @returns {Boolean} `true` if the breakpoint matches, `false` if it's smaller.
   */atLeast:function atLeast(size){var query=this.get(size);if(query){return window.matchMedia(query).matches;}return false;},/**
   * Checks if the screen matches to a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to check, either 'small only' or 'small'. Omitting 'only' falls back to using atLeast() method.
   * @returns {Boolean} `true` if the breakpoint matches, `false` if it does not.
   */is:function is(size){size=size.trim().split(' ');if(size.length>1&&size[1]==='only'){if(size[0]===this._getCurrentSize())return true;}else{return this.atLeast(size[0]);}return false;},/**
   * Gets the media query of a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to get.
   * @returns {String|null} - The media query of the breakpoint, or `null` if the breakpoint doesn't exist.
   */get:function get(size){for(var i in this.queries){if(this.queries.hasOwnProperty(i)){var query=this.queries[i];if(size===query.name)return query.value;}}return null;},/**
   * Gets the current breakpoint name by testing every breakpoint and returning the last one to match (the biggest one).
   * @function
   * @private
   * @returns {String} Name of the current breakpoint.
   */_getCurrentSize:function _getCurrentSize(){var matched;for(var i=0;i<this.queries.length;i++){var query=this.queries[i];if(window.matchMedia(query.value).matches){matched=query;}}if((typeof matched==='undefined'?'undefined':_typeof(matched))==='object'){return matched.name;}else{return matched;}},/**
   * Activates the breakpoint watcher, which fires an event on the window whenever the breakpoint changes.
   * @function
   * @private
   */_watcher:function _watcher(){var _this=this;$(window).on('resize.zf.mediaquery',function(){var newSize=_this._getCurrentSize(),currentSize=_this.current;if(newSize!==currentSize){// Change the current media query
_this.current=newSize;// Broadcast the media query change on the window
$(window).trigger('changed.zf.mediaquery',[newSize,currentSize]);}});}};Foundation.MediaQuery=MediaQuery;// matchMedia() polyfill - Test a CSS media type/query in JS.
// Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license
window.matchMedia||(window.matchMedia=function(){'use strict';// For browsers that support matchMedium api such as IE 9 and webkit
var styleMedia=window.styleMedia||window.media;// For those that don't support matchMedium
if(!styleMedia){var style=document.createElement('style'),script=document.getElementsByTagName('script')[0],info=null;style.type='text/css';style.id='matchmediajs-test';script&&script.parentNode&&script.parentNode.insertBefore(style,script);// 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
info='getComputedStyle'in window&&window.getComputedStyle(style,null)||style.currentStyle;styleMedia={matchMedium:function matchMedium(media){var text='@media '+media+'{ #matchmediajs-test { width: 1px; } }';// 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
if(style.styleSheet){style.styleSheet.cssText=text;}else{style.textContent=text;}// Test if media query is true or false
return info.width==='1px';}};}return function(media){return{matches:styleMedia.matchMedium(media||'all'),media:media||'all'};};}());// Thank you: https://github.com/sindresorhus/query-string
function parseStyleToObject(str){var styleObject={};if(typeof str!=='string'){return styleObject;}str=str.trim().slice(1,-1);// browsers re-quote string style values
if(!str){return styleObject;}styleObject=str.split('&').reduce(function(ret,param){var parts=param.replace(/\+/g,' ').split('=');var key=parts[0];var val=parts[1];key=decodeURIComponent(key);// missing `=` should be `null`:
// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
val=val===undefined?null:decodeURIComponent(val);if(!ret.hasOwnProperty(key)){ret[key]=val;}else if(Array.isArray(ret[key])){ret[key].push(val);}else{ret[key]=[ret[key],val];}return ret;},{});return styleObject;}Foundation.MediaQuery=MediaQuery;}(jQuery);
'use strict';!function($){/**
 * Motion module.
 * @module foundation.motion
 */var initClasses=['mui-enter','mui-leave'];var activeClasses=['mui-enter-active','mui-leave-active'];var Motion={animateIn:function animateIn(element,animation,cb){animate(true,element,animation,cb);},animateOut:function animateOut(element,animation,cb){animate(false,element,animation,cb);}};function Move(duration,elem,fn){var anim,prog,start=null;// console.log('called');
if(duration===0){fn.apply(elem);elem.trigger('finished.zf.animate',[elem]).triggerHandler('finished.zf.animate',[elem]);return;}function move(ts){if(!start)start=ts;// console.log(start, ts);
prog=ts-start;fn.apply(elem);if(prog<duration){anim=window.requestAnimationFrame(move,elem);}else{window.cancelAnimationFrame(anim);elem.trigger('finished.zf.animate',[elem]).triggerHandler('finished.zf.animate',[elem]);}}anim=window.requestAnimationFrame(move);}/**
 * Animates an element in or out using a CSS transition class.
 * @function
 * @private
 * @param {Boolean} isIn - Defines if the animation is in or out.
 * @param {Object} element - jQuery or HTML object to animate.
 * @param {String} animation - CSS class to use.
 * @param {Function} cb - Callback to run when animation is finished.
 */function animate(isIn,element,animation,cb){element=$(element).eq(0);if(!element.length)return;var initClass=isIn?initClasses[0]:initClasses[1];var activeClass=isIn?activeClasses[0]:activeClasses[1];// Set up the animation
reset();element.addClass(animation).css('transition','none');requestAnimationFrame(function(){element.addClass(initClass);if(isIn)element.show();});// Start the animation
requestAnimationFrame(function(){element[0].offsetWidth;element.css('transition','').addClass(activeClass);});// Clean up the animation when it finishes
element.one(Foundation.transitionend(element),finish);// Hides the element (for out animations), resets the element, and runs a callback
function finish(){if(!isIn)element.hide();reset();if(cb)cb.apply(element);}// Resets transitions and removes motion-specific classes
function reset(){element[0].style.transitionDuration=0;element.removeClass(initClass+' '+activeClass+' '+animation);}}Foundation.Move=Move;Foundation.Motion=Motion;}(jQuery);
'use strict';!function($){var Nest={Feather:function Feather(menu){var type=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'zf';menu.attr('role','menubar');var items=menu.find('li').attr({'role':'menuitem'}),subMenuClass='is-'+type+'-submenu',subItemClass=subMenuClass+'-item',hasSubClass='is-'+type+'-submenu-parent';items.each(function(){var $item=$(this),$sub=$item.children('ul');if($sub.length){$item.addClass(hasSubClass).attr({'aria-haspopup':true,'aria-label':$item.children('a:first').text()});// Note:  Drilldowns behave differently in how they hide, and so need
// additional attributes.  We should look if this possibly over-generalized
// utility (Nest) is appropriate when we rework menus in 6.4
if(type==='drilldown'){$item.attr({'aria-expanded':false});}$sub.addClass('submenu '+subMenuClass).attr({'data-submenu':'','role':'menu'});if(type==='drilldown'){$sub.attr({'aria-hidden':true});}}if($item.parent('[data-submenu]').length){$item.addClass('is-submenu-item '+subItemClass);}});return;},Burn:function Burn(menu,type){var//items = menu.find('li'),
subMenuClass='is-'+type+'-submenu',subItemClass=subMenuClass+'-item',hasSubClass='is-'+type+'-submenu-parent';menu.find('>li, .menu, .menu > li').removeClass(subMenuClass+' '+subItemClass+' '+hasSubClass+' is-submenu-item submenu is-active').removeAttr('data-submenu').css('display','');// console.log(      menu.find('.' + subMenuClass + ', .' + subItemClass + ', .has-submenu, .is-submenu-item, .submenu, [data-submenu]')
//           .removeClass(subMenuClass + ' ' + subItemClass + ' has-submenu is-submenu-item submenu')
//           .removeAttr('data-submenu'));
// items.each(function(){
//   var $item = $(this),
//       $sub = $item.children('ul');
//   if($item.parent('[data-submenu]').length){
//     $item.removeClass('is-submenu-item ' + subItemClass);
//   }
//   if($sub.length){
//     $item.removeClass('has-submenu');
//     $sub.removeClass('submenu ' + subMenuClass).removeAttr('data-submenu');
//   }
// });
}};Foundation.Nest=Nest;}(jQuery);
'use strict';!function($){function Timer(elem,options,cb){var _this=this,duration=options.duration,//options is an object for easily adding features later.
nameSpace=Object.keys(elem.data())[0]||'timer',remain=-1,start,timer;this.isPaused=false;this.restart=function(){remain=-1;clearTimeout(timer);this.start();};this.start=function(){this.isPaused=false;// if(!elem.data('paused')){ return false; }//maybe implement this sanity check if used for other things.
clearTimeout(timer);remain=remain<=0?duration:remain;elem.data('paused',false);start=Date.now();timer=setTimeout(function(){if(options.infinite){_this.restart();//rerun the timer.
}if(cb&&typeof cb==='function'){cb();}},remain);elem.trigger('timerstart.zf.'+nameSpace);};this.pause=function(){this.isPaused=true;//if(elem.data('paused')){ return false; }//maybe implement this sanity check if used for other things.
clearTimeout(timer);elem.data('paused',true);var end=Date.now();remain=remain-(end-start);elem.trigger('timerpaused.zf.'+nameSpace);};}/**
 * Runs a callback function when images are fully loaded.
 * @param {Object} images - Image(s) to check if loaded.
 * @param {Func} callback - Function to execute when image is fully loaded.
 */function onImagesLoaded(images,callback){var self=this,unloaded=images.length;if(unloaded===0){callback();}images.each(function(){// Check if image is loaded
if(this.complete||this.readyState===4||this.readyState==='complete'){singleImageLoaded();}// Force load the image
else{// fix for IE. See https://css-tricks.com/snippets/jquery/fixing-load-in-ie-for-cached-images/
var src=$(this).attr('src');$(this).attr('src',src+(src.indexOf('?')>=0?'&':'?')+new Date().getTime());$(this).one('load',function(){singleImageLoaded();});}});function singleImageLoaded(){unloaded--;if(unloaded===0){callback();}}}Foundation.Timer=Timer;Foundation.onImagesLoaded=onImagesLoaded;}(jQuery);
'use strict';//**************************************************
//**Work inspired by multiple jquery swipe plugins**
//**Done by Yohai Ararat ***************************
//**************************************************
(function($){$.spotSwipe={version:'1.0.0',enabled:'ontouchstart'in document.documentElement,preventDefault:false,moveThreshold:75,timeThreshold:200};var startPosX,startPosY,startTime,elapsedTime,isMoving=false;function onTouchEnd(){//  alert(this);
this.removeEventListener('touchmove',onTouchMove);this.removeEventListener('touchend',onTouchEnd);isMoving=false;}function onTouchMove(e){if($.spotSwipe.preventDefault){e.preventDefault();}if(isMoving){var x=e.touches[0].pageX;var y=e.touches[0].pageY;var dx=startPosX-x;var dy=startPosY-y;var dir;elapsedTime=new Date().getTime()-startTime;if(Math.abs(dx)>=$.spotSwipe.moveThreshold&&elapsedTime<=$.spotSwipe.timeThreshold){dir=dx>0?'left':'right';}// else if(Math.abs(dy) >= $.spotSwipe.moveThreshold && elapsedTime <= $.spotSwipe.timeThreshold) {
//   dir = dy > 0 ? 'down' : 'up';
// }
if(dir){e.preventDefault();onTouchEnd.call(this);$(this).trigger('swipe',dir).trigger('swipe'+dir);}}}function onTouchStart(e){if(e.touches.length==1){startPosX=e.touches[0].pageX;startPosY=e.touches[0].pageY;isMoving=true;startTime=new Date().getTime();this.addEventListener('touchmove',onTouchMove,false);this.addEventListener('touchend',onTouchEnd,false);}}function init(){this.addEventListener&&this.addEventListener('touchstart',onTouchStart,false);}function teardown(){this.removeEventListener('touchstart',onTouchStart);}$.event.special.swipe={setup:init};$.each(['left','up','down','right'],function(){$.event.special['swipe'+this]={setup:function setup(){$(this).on('swipe',$.noop);}};});})(jQuery);/****************************************************
 * Method for adding psuedo drag events to elements *
 ***************************************************/!function($){$.fn.addTouch=function(){this.each(function(i,el){$(el).bind('touchstart touchmove touchend touchcancel',function(){//we pass the original event object because the jQuery event
//object is normalized to w3c specs and does not provide the TouchList
handleTouch(event);});});var handleTouch=function handleTouch(event){var touches=event.changedTouches,first=touches[0],eventTypes={touchstart:'mousedown',touchmove:'mousemove',touchend:'mouseup'},type=eventTypes[event.type],simulatedEvent;if('MouseEvent'in window&&typeof window.MouseEvent==='function'){simulatedEvent=new window.MouseEvent(type,{'bubbles':true,'cancelable':true,'screenX':first.screenX,'screenY':first.screenY,'clientX':first.clientX,'clientY':first.clientY});}else{simulatedEvent=document.createEvent('MouseEvent');simulatedEvent.initMouseEvent(type,true,true,window,1,first.screenX,first.screenY,first.clientX,first.clientY,false,false,false,false,0/*left*/,null);}first.target.dispatchEvent(simulatedEvent);};};}(jQuery);//**********************************
//**From the jQuery Mobile Library**
//**need to recreate functionality**
//**and try to improve if possible**
//**********************************
/* Removing the jQuery function ****
************************************

(function( $, window, undefined ) {

	var $document = $( document ),
		// supportTouch = $.mobile.support.touch,
		touchStartEvent = 'touchstart'//supportTouch ? "touchstart" : "mousedown",
		touchStopEvent = 'touchend'//supportTouch ? "touchend" : "mouseup",
		touchMoveEvent = 'touchmove'//supportTouch ? "touchmove" : "mousemove";

	// setup new event shortcuts
	$.each( ( "touchstart touchmove touchend " +
		"swipe swipeleft swiperight" ).split( " " ), function( i, name ) {

		$.fn[ name ] = function( fn ) {
			return fn ? this.bind( name, fn ) : this.trigger( name );
		};

		// jQuery < 1.8
		if ( $.attrFn ) {
			$.attrFn[ name ] = true;
		}
	});

	function triggerCustomEvent( obj, eventType, event, bubble ) {
		var originalType = event.type;
		event.type = eventType;
		if ( bubble ) {
			$.event.trigger( event, undefined, obj );
		} else {
			$.event.dispatch.call( obj, event );
		}
		event.type = originalType;
	}

	// also handles taphold

	// Also handles swipeleft, swiperight
	$.event.special.swipe = {

		// More than this horizontal displacement, and we will suppress scrolling.
		scrollSupressionThreshold: 30,

		// More time than this, and it isn't a swipe.
		durationThreshold: 1000,

		// Swipe horizontal displacement must be more than this.
		horizontalDistanceThreshold: window.devicePixelRatio >= 2 ? 15 : 30,

		// Swipe vertical displacement must be less than this.
		verticalDistanceThreshold: window.devicePixelRatio >= 2 ? 15 : 30,

		getLocation: function ( event ) {
			var winPageX = window.pageXOffset,
				winPageY = window.pageYOffset,
				x = event.clientX,
				y = event.clientY;

			if ( event.pageY === 0 && Math.floor( y ) > Math.floor( event.pageY ) ||
				event.pageX === 0 && Math.floor( x ) > Math.floor( event.pageX ) ) {

				// iOS4 clientX/clientY have the value that should have been
				// in pageX/pageY. While pageX/page/ have the value 0
				x = x - winPageX;
				y = y - winPageY;
			} else if ( y < ( event.pageY - winPageY) || x < ( event.pageX - winPageX ) ) {

				// Some Android browsers have totally bogus values for clientX/Y
				// when scrolling/zooming a page. Detectable since clientX/clientY
				// should never be smaller than pageX/pageY minus page scroll
				x = event.pageX - winPageX;
				y = event.pageY - winPageY;
			}

			return {
				x: x,
				y: y
			};
		},

		start: function( event ) {
			var data = event.originalEvent.touches ?
					event.originalEvent.touches[ 0 ] : event,
				location = $.event.special.swipe.getLocation( data );
			return {
						time: ( new Date() ).getTime(),
						coords: [ location.x, location.y ],
						origin: $( event.target )
					};
		},

		stop: function( event ) {
			var data = event.originalEvent.touches ?
					event.originalEvent.touches[ 0 ] : event,
				location = $.event.special.swipe.getLocation( data );
			return {
						time: ( new Date() ).getTime(),
						coords: [ location.x, location.y ]
					};
		},

		handleSwipe: function( start, stop, thisObject, origTarget ) {
			if ( stop.time - start.time < $.event.special.swipe.durationThreshold &&
				Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.horizontalDistanceThreshold &&
				Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ) < $.event.special.swipe.verticalDistanceThreshold ) {
				var direction = start.coords[0] > stop.coords[ 0 ] ? "swipeleft" : "swiperight";

				triggerCustomEvent( thisObject, "swipe", $.Event( "swipe", { target: origTarget, swipestart: start, swipestop: stop }), true );
				triggerCustomEvent( thisObject, direction,$.Event( direction, { target: origTarget, swipestart: start, swipestop: stop } ), true );
				return true;
			}
			return false;

		},

		// This serves as a flag to ensure that at most one swipe event event is
		// in work at any given time
		eventInProgress: false,

		setup: function() {
			var events,
				thisObject = this,
				$this = $( thisObject ),
				context = {};

			// Retrieve the events data for this element and add the swipe context
			events = $.data( this, "mobile-events" );
			if ( !events ) {
				events = { length: 0 };
				$.data( this, "mobile-events", events );
			}
			events.length++;
			events.swipe = context;

			context.start = function( event ) {

				// Bail if we're already working on a swipe event
				if ( $.event.special.swipe.eventInProgress ) {
					return;
				}
				$.event.special.swipe.eventInProgress = true;

				var stop,
					start = $.event.special.swipe.start( event ),
					origTarget = event.target,
					emitted = false;

				context.move = function( event ) {
					if ( !start || event.isDefaultPrevented() ) {
						return;
					}

					stop = $.event.special.swipe.stop( event );
					if ( !emitted ) {
						emitted = $.event.special.swipe.handleSwipe( start, stop, thisObject, origTarget );
						if ( emitted ) {

							// Reset the context to make way for the next swipe event
							$.event.special.swipe.eventInProgress = false;
						}
					}
					// prevent scrolling
					if ( Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.scrollSupressionThreshold ) {
						event.preventDefault();
					}
				};

				context.stop = function() {
						emitted = true;

						// Reset the context to make way for the next swipe event
						$.event.special.swipe.eventInProgress = false;
						$document.off( touchMoveEvent, context.move );
						context.move = null;
				};

				$document.on( touchMoveEvent, context.move )
					.one( touchStopEvent, context.stop );
			};
			$this.on( touchStartEvent, context.start );
		},

		teardown: function() {
			var events, context;

			events = $.data( this, "mobile-events" );
			if ( events ) {
				context = events.swipe;
				delete events.swipe;
				events.length--;
				if ( events.length === 0 ) {
					$.removeData( this, "mobile-events" );
				}
			}

			if ( context ) {
				if ( context.start ) {
					$( this ).off( touchStartEvent, context.start );
				}
				if ( context.move ) {
					$document.off( touchMoveEvent, context.move );
				}
				if ( context.stop ) {
					$document.off( touchStopEvent, context.stop );
				}
			}
		}
	};
	$.each({
		swipeleft: "swipe.left",
		swiperight: "swipe.right"
	}, function( event, sourceEvent ) {

		$.event.special[ event ] = {
			setup: function() {
				$( this ).bind( sourceEvent, $.noop );
			},
			teardown: function() {
				$( this ).unbind( sourceEvent );
			}
		};
	});
})( jQuery, this );
*/
'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};!function($){var MutationObserver=function(){var prefixes=['WebKit','Moz','O','Ms',''];for(var i=0;i<prefixes.length;i++){if(prefixes[i]+'MutationObserver'in window){return window[prefixes[i]+'MutationObserver'];}}return false;}();var triggers=function triggers(el,type){el.data(type).split(' ').forEach(function(id){$('#'+id)[type==='close'?'trigger':'triggerHandler'](type+'.zf.trigger',[el]);});};// Elements with [data-open] will reveal a plugin that supports it when clicked.
$(document).on('click.zf.trigger','[data-open]',function(){triggers($(this),'open');});// Elements with [data-close] will close a plugin that supports it when clicked.
// If used without a value on [data-close], the event will bubble, allowing it to close a parent component.
$(document).on('click.zf.trigger','[data-close]',function(){var id=$(this).data('close');if(id){triggers($(this),'close');}else{$(this).trigger('close.zf.trigger');}});// Elements with [data-toggle] will toggle a plugin that supports it when clicked.
$(document).on('click.zf.trigger','[data-toggle]',function(){var id=$(this).data('toggle');if(id){triggers($(this),'toggle');}else{$(this).trigger('toggle.zf.trigger');}});// Elements with [data-closable] will respond to close.zf.trigger events.
$(document).on('close.zf.trigger','[data-closable]',function(e){e.stopPropagation();var animation=$(this).data('closable');if(animation!==''){Foundation.Motion.animateOut($(this),animation,function(){$(this).trigger('closed.zf');});}else{$(this).fadeOut().trigger('closed.zf');}});$(document).on('focus.zf.trigger blur.zf.trigger','[data-toggle-focus]',function(){var id=$(this).data('toggle-focus');$('#'+id).triggerHandler('toggle.zf.trigger',[$(this)]);});/**
* Fires once after all other scripts have loaded
* @function
* @private
*/$(window).on('load',function(){checkListeners();});function checkListeners(){eventsListener();resizeListener();scrollListener();closemeListener();}//******** only fires this function once on load, if there's something to watch ********
function closemeListener(pluginName){var yetiBoxes=$('[data-yeti-box]'),plugNames=['dropdown','tooltip','reveal'];if(pluginName){if(typeof pluginName==='string'){plugNames.push(pluginName);}else if((typeof pluginName==='undefined'?'undefined':_typeof(pluginName))==='object'&&typeof pluginName[0]==='string'){plugNames.concat(pluginName);}else{console.error('Plugin names must be strings');}}if(yetiBoxes.length){var listeners=plugNames.map(function(name){return'closeme.zf.'+name;}).join(' ');$(window).off(listeners).on(listeners,function(e,pluginId){var plugin=e.namespace.split('.')[0];var plugins=$('[data-'+plugin+']').not('[data-yeti-box="'+pluginId+'"]');plugins.each(function(){var _this=$(this);_this.triggerHandler('close.zf.trigger',[_this]);});});}}function resizeListener(debounce){var timer=void 0,$nodes=$('[data-resize]');if($nodes.length){$(window).off('resize.zf.trigger').on('resize.zf.trigger',function(e){if(timer){clearTimeout(timer);}timer=setTimeout(function(){if(!MutationObserver){//fallback for IE 9
$nodes.each(function(){$(this).triggerHandler('resizeme.zf.trigger');});}//trigger all listening elements and signal a resize event
$nodes.attr('data-events',"resize");},debounce||10);//default time to emit resize event
});}}function scrollListener(debounce){var timer=void 0,$nodes=$('[data-scroll]');if($nodes.length){$(window).off('scroll.zf.trigger').on('scroll.zf.trigger',function(e){if(timer){clearTimeout(timer);}timer=setTimeout(function(){if(!MutationObserver){//fallback for IE 9
$nodes.each(function(){$(this).triggerHandler('scrollme.zf.trigger');});}//trigger all listening elements and signal a scroll event
$nodes.attr('data-events',"scroll");},debounce||10);//default time to emit scroll event
});}}function eventsListener(){if(!MutationObserver){return false;}var nodes=document.querySelectorAll('[data-resize], [data-scroll], [data-mutate]');//element callback
var listeningElementsMutation=function listeningElementsMutation(mutationRecordsList){var $target=$(mutationRecordsList[0].target);//trigger the event handler for the element depending on type
switch(mutationRecordsList[0].type){case"attributes":if($target.attr("data-events")==="scroll"&&mutationRecordsList[0].attributeName==="data-events"){$target.triggerHandler('scrollme.zf.trigger',[$target,window.pageYOffset]);}if($target.attr("data-events")==="resize"&&mutationRecordsList[0].attributeName==="data-events"){$target.triggerHandler('resizeme.zf.trigger',[$target]);}if(mutationRecordsList[0].attributeName==="style"){$target.closest("[data-mutate]").attr("data-events","mutate");$target.closest("[data-mutate]").triggerHandler('mutateme.zf.trigger',[$target.closest("[data-mutate]")]);}break;case"childList":$target.closest("[data-mutate]").attr("data-events","mutate");$target.closest("[data-mutate]").triggerHandler('mutateme.zf.trigger',[$target.closest("[data-mutate]")]);break;default:return false;//nothing
}};if(nodes.length){//for each element that needs to listen for resizing, scrolling, or mutation add a single observer
for(var i=0;i<=nodes.length-1;i++){var elementObserver=new MutationObserver(listeningElementsMutation);elementObserver.observe(nodes[i],{attributes:true,childList:true,characterData:false,subtree:true,attributeFilter:["data-events","style"]});}}}// ------------------------------------
// [PH]
// Foundation.CheckWatchers = checkWatchers;
Foundation.IHearYou=checkListeners;// Foundation.ISeeYou = scrollListener;
// Foundation.IFeelYou = closemeListener;
}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * Accordion module.
 * @module foundation.accordion
 * @requires foundation.util.keyboard
 * @requires foundation.util.motion
 */var Accordion=function(){/**
   * Creates a new instance of an accordion.
   * @class
   * @fires Accordion#init
   * @param {jQuery} element - jQuery object to make into an accordion.
   * @param {Object} options - a plain object with settings to override the default options.
   */function Accordion(element,options){_classCallCheck(this,Accordion);this.$element=element;this.options=$.extend({},Accordion.defaults,this.$element.data(),options);this._init();Foundation.registerPlugin(this,'Accordion');Foundation.Keyboard.register('Accordion',{'ENTER':'toggle','SPACE':'toggle','ARROW_DOWN':'next','ARROW_UP':'previous'});}/**
   * Initializes the accordion by animating the preset active pane(s).
   * @private
   */_createClass(Accordion,[{key:'_init',value:function _init(){var _this2=this;this.$element.attr('role','tablist');this.$tabs=this.$element.children('[data-accordion-item]');this.$tabs.each(function(idx,el){var $el=$(el),$content=$el.children('[data-tab-content]'),id=$content[0].id||Foundation.GetYoDigits(6,'accordion'),linkId=el.id||id+'-label';$el.find('a:first').attr({'aria-controls':id,'role':'tab','id':linkId,'aria-expanded':false,'aria-selected':false});$content.attr({'role':'tabpanel','aria-labelledby':linkId,'aria-hidden':true,'id':id});});var $initActive=this.$element.find('.is-active').children('[data-tab-content]');this.firstTimeInit=true;if($initActive.length){this.down($initActive,this.firstTimeInit);this.firstTimeInit=false;}this._checkDeepLink=function(){var anchor=window.location.hash;//need a hash and a relevant anchor in this tabset
if(anchor.length){var $link=_this2.$element.find('[href$="'+anchor+'"]'),$anchor=$(anchor);if($link.length&&$anchor){if(!$link.parent('[data-accordion-item]').hasClass('is-active')){_this2.down($anchor,_this2.firstTimeInit);_this2.firstTimeInit=false;};//roll up a little to show the titles
if(_this2.options.deepLinkSmudge){var _this=_this2;$(window).load(function(){var offset=_this.$element.offset();$('html, body').animate({scrollTop:offset.top},_this.options.deepLinkSmudgeDelay);});}/**
            * Fires when the zplugin has deeplinked at pageload
            * @event Accordion#deeplink
            */_this2.$element.trigger('deeplink.zf.accordion',[$link,$anchor]);}}};//use browser to open a tab, if it exists in this tabset
if(this.options.deepLink){this._checkDeepLink();}this._events();}/**
   * Adds event handlers for items within the accordion.
   * @private
   */},{key:'_events',value:function _events(){var _this=this;this.$tabs.each(function(){var $elem=$(this);var $tabContent=$elem.children('[data-tab-content]');if($tabContent.length){$elem.children('a').off('click.zf.accordion keydown.zf.accordion').on('click.zf.accordion',function(e){e.preventDefault();_this.toggle($tabContent);}).on('keydown.zf.accordion',function(e){Foundation.Keyboard.handleKey(e,'Accordion',{toggle:function toggle(){_this.toggle($tabContent);},next:function next(){var $a=$elem.next().find('a').focus();if(!_this.options.multiExpand){$a.trigger('click.zf.accordion');}},previous:function previous(){var $a=$elem.prev().find('a').focus();if(!_this.options.multiExpand){$a.trigger('click.zf.accordion');}},handled:function handled(){e.preventDefault();e.stopPropagation();}});});}});if(this.options.deepLink){$(window).on('popstate',this._checkDeepLink);}}/**
   * Toggles the selected content pane's open/close state.
   * @param {jQuery} $target - jQuery object of the pane to toggle (`.accordion-content`).
   * @function
   */},{key:'toggle',value:function toggle($target){if($target.parent().hasClass('is-active')){this.up($target);}else{this.down($target);}//either replace or update browser history
if(this.options.deepLink){var anchor=$target.prev('a').attr('href');if(this.options.updateHistory){history.pushState({},'',anchor);}else{history.replaceState({},'',anchor);}}}/**
   * Opens the accordion tab defined by `$target`.
   * @param {jQuery} $target - Accordion pane to open (`.accordion-content`).
   * @param {Boolean} firstTime - flag to determine if reflow should happen.
   * @fires Accordion#down
   * @function
   */},{key:'down',value:function down($target,firstTime){var _this3=this;$target.attr('aria-hidden',false).parent('[data-tab-content]').addBack().parent().addClass('is-active');if(!this.options.multiExpand&&!firstTime){var $currentActive=this.$element.children('.is-active').children('[data-tab-content]');if($currentActive.length){this.up($currentActive.not($target));}}$target.slideDown(this.options.slideSpeed,function(){/**
       * Fires when the tab is done opening.
       * @event Accordion#down
       */_this3.$element.trigger('down.zf.accordion',[$target]);});$('#'+$target.attr('aria-labelledby')).attr({'aria-expanded':true,'aria-selected':true});}/**
   * Closes the tab defined by `$target`.
   * @param {jQuery} $target - Accordion tab to close (`.accordion-content`).
   * @fires Accordion#up
   * @function
   */},{key:'up',value:function up($target){var $aunts=$target.parent().siblings(),_this=this;if(!this.options.allowAllClosed&&!$aunts.hasClass('is-active')||!$target.parent().hasClass('is-active')){return;}// Foundation.Move(this.options.slideSpeed, $target, function(){
$target.slideUp(_this.options.slideSpeed,function(){/**
         * Fires when the tab is done collapsing up.
         * @event Accordion#up
         */_this.$element.trigger('up.zf.accordion',[$target]);});// });
$target.attr('aria-hidden',true).parent().removeClass('is-active');$('#'+$target.attr('aria-labelledby')).attr({'aria-expanded':false,'aria-selected':false});}/**
   * Destroys an instance of an accordion.
   * @fires Accordion#destroyed
   * @function
   */},{key:'destroy',value:function destroy(){this.$element.find('[data-tab-content]').stop(true).slideUp(0).css('display','');this.$element.find('a').off('.zf.accordion');if(this.options.deepLink){$(window).off('popstate',this._checkDeepLink);}Foundation.unregisterPlugin(this);}}]);return Accordion;}();Accordion.defaults={/**
   * Amount of time to animate the opening of an accordion pane.
   * @option
   * @type {number}
   * @default 250
   */slideSpeed:250,/**
   * Allow the accordion to have multiple open panes.
   * @option
   * @type {boolean}
   * @default false
   */multiExpand:false,/**
   * Allow the accordion to close all panes.
   * @option
   * @type {boolean}
   * @default false
   */allowAllClosed:false,/**
   * Allows the window to scroll to content of pane specified by hash anchor
   * @option
   * @type {boolean}
   * @default false
   */deepLink:false,/**
   * Adjust the deep link scroll to make sure the top of the accordion panel is visible
   * @option
   * @type {boolean}
   * @default false
   */deepLinkSmudge:false,/**
   * Animation time (ms) for the deep link adjustment
   * @option
   * @type {number}
   * @default 300
   */deepLinkSmudgeDelay:300,/**
   * Update the browser history with the open accordion
   * @option
   * @type {boolean}
   * @default false
   */updateHistory:false};// Window exports
Foundation.plugin(Accordion,'Accordion');}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * AccordionMenu module.
 * @module foundation.accordionMenu
 * @requires foundation.util.keyboard
 * @requires foundation.util.motion
 * @requires foundation.util.nest
 */var AccordionMenu=function(){/**
   * Creates a new instance of an accordion menu.
   * @class
   * @fires AccordionMenu#init
   * @param {jQuery} element - jQuery object to make into an accordion menu.
   * @param {Object} options - Overrides to the default plugin settings.
   */function AccordionMenu(element,options){_classCallCheck(this,AccordionMenu);this.$element=element;this.options=$.extend({},AccordionMenu.defaults,this.$element.data(),options);Foundation.Nest.Feather(this.$element,'accordion');this._init();Foundation.registerPlugin(this,'AccordionMenu');Foundation.Keyboard.register('AccordionMenu',{'ENTER':'toggle','SPACE':'toggle','ARROW_RIGHT':'open','ARROW_UP':'up','ARROW_DOWN':'down','ARROW_LEFT':'close','ESCAPE':'closeAll'});}/**
   * Initializes the accordion menu by hiding all nested menus.
   * @private
   */_createClass(AccordionMenu,[{key:'_init',value:function _init(){this.$element.find('[data-submenu]').not('.is-active').slideUp(0);//.find('a').css('padding-left', '1rem');
this.$element.attr({'role':'menu','aria-multiselectable':this.options.multiOpen});this.$menuLinks=this.$element.find('.is-accordion-submenu-parent');this.$menuLinks.each(function(){var linkId=this.id||Foundation.GetYoDigits(6,'acc-menu-link'),$elem=$(this),$sub=$elem.children('[data-submenu]'),subId=$sub[0].id||Foundation.GetYoDigits(6,'acc-menu'),isActive=$sub.hasClass('is-active');$elem.attr({'aria-controls':subId,'aria-expanded':isActive,'role':'menuitem','id':linkId});$sub.attr({'aria-labelledby':linkId,'aria-hidden':!isActive,'role':'menu','id':subId});});var initPanes=this.$element.find('.is-active');if(initPanes.length){var _this=this;initPanes.each(function(){_this.down($(this));});}this._events();}/**
   * Adds event handlers for items within the menu.
   * @private
   */},{key:'_events',value:function _events(){var _this=this;this.$element.find('li').each(function(){var $submenu=$(this).children('[data-submenu]');if($submenu.length){$(this).children('a').off('click.zf.accordionMenu').on('click.zf.accordionMenu',function(e){e.preventDefault();_this.toggle($submenu);});}}).on('keydown.zf.accordionmenu',function(e){var $element=$(this),$elements=$element.parent('ul').children('li'),$prevElement,$nextElement,$target=$element.children('[data-submenu]');$elements.each(function(i){if($(this).is($element)){$prevElement=$elements.eq(Math.max(0,i-1)).find('a').first();$nextElement=$elements.eq(Math.min(i+1,$elements.length-1)).find('a').first();if($(this).children('[data-submenu]:visible').length){// has open sub menu
$nextElement=$element.find('li:first-child').find('a').first();}if($(this).is(':first-child')){// is first element of sub menu
$prevElement=$element.parents('li').first().find('a').first();}else if($prevElement.parents('li').first().children('[data-submenu]:visible').length){// if previous element has open sub menu
$prevElement=$prevElement.parents('li').find('li:last-child').find('a').first();}if($(this).is(':last-child')){// is last element of sub menu
$nextElement=$element.parents('li').first().next('li').find('a').first();}return;}});Foundation.Keyboard.handleKey(e,'AccordionMenu',{open:function open(){if($target.is(':hidden')){_this.down($target);$target.find('li').first().find('a').first().focus();}},close:function close(){if($target.length&&!$target.is(':hidden')){// close active sub of this item
_this.up($target);}else if($element.parent('[data-submenu]').length){// close currently open sub
_this.up($element.parent('[data-submenu]'));$element.parents('li').first().find('a').first().focus();}},up:function up(){$prevElement.focus();return true;},down:function down(){$nextElement.focus();return true;},toggle:function toggle(){if($element.children('[data-submenu]').length){_this.toggle($element.children('[data-submenu]'));}},closeAll:function closeAll(){_this.hideAll();},handled:function handled(preventDefault){if(preventDefault){e.preventDefault();}e.stopImmediatePropagation();}});});//.attr('tabindex', 0);
}/**
   * Closes all panes of the menu.
   * @function
   */},{key:'hideAll',value:function hideAll(){this.up(this.$element.find('[data-submenu]'));}/**
   * Opens all panes of the menu.
   * @function
   */},{key:'showAll',value:function showAll(){this.down(this.$element.find('[data-submenu]'));}/**
   * Toggles the open/close state of a submenu.
   * @function
   * @param {jQuery} $target - the submenu to toggle
   */},{key:'toggle',value:function toggle($target){if(!$target.is(':animated')){if(!$target.is(':hidden')){this.up($target);}else{this.down($target);}}}/**
   * Opens the sub-menu defined by `$target`.
   * @param {jQuery} $target - Sub-menu to open.
   * @fires AccordionMenu#down
   */},{key:'down',value:function down($target){var _this=this;if(!this.options.multiOpen){this.up(this.$element.find('.is-active').not($target.parentsUntil(this.$element).add($target)));}$target.addClass('is-active').attr({'aria-hidden':false}).parent('.is-accordion-submenu-parent').attr({'aria-expanded':true});//Foundation.Move(this.options.slideSpeed, $target, function() {
$target.slideDown(_this.options.slideSpeed,function(){/**
           * Fires when the menu is done opening.
           * @event AccordionMenu#down
           */_this.$element.trigger('down.zf.accordionMenu',[$target]);});//});
}/**
   * Closes the sub-menu defined by `$target`. All sub-menus inside the target will be closed as well.
   * @param {jQuery} $target - Sub-menu to close.
   * @fires AccordionMenu#up
   */},{key:'up',value:function up($target){var _this=this;//Foundation.Move(this.options.slideSpeed, $target, function(){
$target.slideUp(_this.options.slideSpeed,function(){/**
         * Fires when the menu is done collapsing up.
         * @event AccordionMenu#up
         */_this.$element.trigger('up.zf.accordionMenu',[$target]);});//});
var $menus=$target.find('[data-submenu]').slideUp(0).addBack().attr('aria-hidden',true);$menus.parent('.is-accordion-submenu-parent').attr('aria-expanded',false);}/**
   * Destroys an instance of accordion menu.
   * @fires AccordionMenu#destroyed
   */},{key:'destroy',value:function destroy(){this.$element.find('[data-submenu]').slideDown(0).css('display','');this.$element.find('a').off('click.zf.accordionMenu');Foundation.Nest.Burn(this.$element,'accordion');Foundation.unregisterPlugin(this);}}]);return AccordionMenu;}();AccordionMenu.defaults={/**
   * Amount of time to animate the opening of a submenu in ms.
   * @option
   * @type {number}
   * @default 250
   */slideSpeed:250,/**
   * Allow the menu to have multiple open panes.
   * @option
   * @type {boolean}
   * @default true
   */multiOpen:true};// Window exports
Foundation.plugin(AccordionMenu,'AccordionMenu');}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * Drilldown module.
 * @module foundation.drilldown
 * @requires foundation.util.keyboard
 * @requires foundation.util.motion
 * @requires foundation.util.nest
 */var Drilldown=function(){/**
   * Creates a new instance of a drilldown menu.
   * @class
   * @param {jQuery} element - jQuery object to make into an accordion menu.
   * @param {Object} options - Overrides to the default plugin settings.
   */function Drilldown(element,options){_classCallCheck(this,Drilldown);this.$element=element;this.options=$.extend({},Drilldown.defaults,this.$element.data(),options);Foundation.Nest.Feather(this.$element,'drilldown');this._init();Foundation.registerPlugin(this,'Drilldown');Foundation.Keyboard.register('Drilldown',{'ENTER':'open','SPACE':'open','ARROW_RIGHT':'next','ARROW_UP':'up','ARROW_DOWN':'down','ARROW_LEFT':'previous','ESCAPE':'close','TAB':'down','SHIFT_TAB':'up'});}/**
   * Initializes the drilldown by creating jQuery collections of elements
   * @private
   */_createClass(Drilldown,[{key:'_init',value:function _init(){this.$submenuAnchors=this.$element.find('li.is-drilldown-submenu-parent').children('a');this.$submenus=this.$submenuAnchors.parent('li').children('[data-submenu]');this.$menuItems=this.$element.find('li').not('.js-drilldown-back').attr('role','menuitem').find('a');this.$element.attr('data-mutate',this.$element.attr('data-drilldown')||Foundation.GetYoDigits(6,'drilldown'));this._prepareMenu();this._registerEvents();this._keyboardEvents();}/**
   * prepares drilldown menu by setting attributes to links and elements
   * sets a min height to prevent content jumping
   * wraps the element if not already wrapped
   * @private
   * @function
   */},{key:'_prepareMenu',value:function _prepareMenu(){var _this=this;// if(!this.options.holdOpen){
//   this._menuLinkEvents();
// }
this.$submenuAnchors.each(function(){var $link=$(this);var $sub=$link.parent();if(_this.options.parentLink){$link.clone().prependTo($sub.children('[data-submenu]')).wrap('<li class="is-submenu-parent-item is-submenu-item is-drilldown-submenu-item" role="menu-item"></li>');}$link.data('savedHref',$link.attr('href')).removeAttr('href').attr('tabindex',0);$link.children('[data-submenu]').attr({'aria-hidden':true,'tabindex':0,'role':'menu'});_this._events($link);});this.$submenus.each(function(){var $menu=$(this),$back=$menu.find('.js-drilldown-back');if(!$back.length){switch(_this.options.backButtonPosition){case"bottom":$menu.append(_this.options.backButton);break;case"top":$menu.prepend(_this.options.backButton);break;default:console.error("Unsupported backButtonPosition value '"+_this.options.backButtonPosition+"'");}}_this._back($menu);});if(!this.options.autoHeight){this.$submenus.addClass('drilldown-submenu-cover-previous');}// create a wrapper on element if it doesn't exist.
if(!this.$element.parent().hasClass('is-drilldown')){this.$wrapper=$(this.options.wrapper).addClass('is-drilldown');if(this.options.animateHeight)this.$wrapper.addClass('animate-height');this.$element.wrap(this.$wrapper);}// set wrapper
this.$wrapper=this.$element.parent();this.$wrapper.css(this._getMaxDims());}},{key:'_resize',value:function _resize(){this.$wrapper.css({'max-width':'none','min-height':'none'});// _getMaxDims has side effects (boo) but calling it should update all other necessary heights & widths
this.$wrapper.css(this._getMaxDims());}/**
   * Adds event handlers to elements in the menu.
   * @function
   * @private
   * @param {jQuery} $elem - the current menu item to add handlers to.
   */},{key:'_events',value:function _events($elem){var _this=this;$elem.off('click.zf.drilldown').on('click.zf.drilldown',function(e){if($(e.target).parentsUntil('ul','li').hasClass('is-drilldown-submenu-parent')){e.stopImmediatePropagation();e.preventDefault();}// if(e.target !== e.currentTarget.firstElementChild){
//   return false;
// }
_this._show($elem.parent('li'));if(_this.options.closeOnClick){var $body=$('body');$body.off('.zf.drilldown').on('click.zf.drilldown',function(e){if(e.target===_this.$element[0]||$.contains(_this.$element[0],e.target)){return;}e.preventDefault();_this._hideAll();$body.off('.zf.drilldown');});}});this.$element.on('mutateme.zf.trigger',this._resize.bind(this));}/**
   * Adds event handlers to the menu element.
   * @function
   * @private
   */},{key:'_registerEvents',value:function _registerEvents(){if(this.options.scrollTop){this._bindHandler=this._scrollTop.bind(this);this.$element.on('open.zf.drilldown hide.zf.drilldown closed.zf.drilldown',this._bindHandler);}}/**
   * Scroll to Top of Element or data-scroll-top-element
   * @function
   * @fires Drilldown#scrollme
   */},{key:'_scrollTop',value:function _scrollTop(){var _this=this;var $scrollTopElement=_this.options.scrollTopElement!=''?$(_this.options.scrollTopElement):_this.$element,scrollPos=parseInt($scrollTopElement.offset().top+_this.options.scrollTopOffset);$('html, body').stop(true).animate({scrollTop:scrollPos},_this.options.animationDuration,_this.options.animationEasing,function(){/**
        * Fires after the menu has scrolled
        * @event Drilldown#scrollme
        */if(this===$('html')[0])_this.$element.trigger('scrollme.zf.drilldown');});}/**
   * Adds keydown event listener to `li`'s in the menu.
   * @private
   */},{key:'_keyboardEvents',value:function _keyboardEvents(){var _this=this;this.$menuItems.add(this.$element.find('.js-drilldown-back > a, .is-submenu-parent-item > a')).on('keydown.zf.drilldown',function(e){var $element=$(this),$elements=$element.parent('li').parent('ul').children('li').children('a'),$prevElement,$nextElement;$elements.each(function(i){if($(this).is($element)){$prevElement=$elements.eq(Math.max(0,i-1));$nextElement=$elements.eq(Math.min(i+1,$elements.length-1));return;}});Foundation.Keyboard.handleKey(e,'Drilldown',{next:function next(){if($element.is(_this.$submenuAnchors)){_this._show($element.parent('li'));$element.parent('li').one(Foundation.transitionend($element),function(){$element.parent('li').find('ul li a').filter(_this.$menuItems).first().focus();});return true;}},previous:function previous(){_this._hide($element.parent('li').parent('ul'));$element.parent('li').parent('ul').one(Foundation.transitionend($element),function(){setTimeout(function(){$element.parent('li').parent('ul').parent('li').children('a').first().focus();},1);});return true;},up:function up(){$prevElement.focus();// Don't tap focus on first element in root ul
return!$element.is(_this.$element.find('> li:first-child > a'));},down:function down(){$nextElement.focus();// Don't tap focus on last element in root ul
return!$element.is(_this.$element.find('> li:last-child > a'));},close:function close(){// Don't close on element in root ul
if(!$element.is(_this.$element.find('> li > a'))){_this._hide($element.parent().parent());$element.parent().parent().siblings('a').focus();}},open:function open(){if(!$element.is(_this.$menuItems)){// not menu item means back button
_this._hide($element.parent('li').parent('ul'));$element.parent('li').parent('ul').one(Foundation.transitionend($element),function(){setTimeout(function(){$element.parent('li').parent('ul').parent('li').children('a').first().focus();},1);});return true;}else if($element.is(_this.$submenuAnchors)){_this._show($element.parent('li'));$element.parent('li').one(Foundation.transitionend($element),function(){$element.parent('li').find('ul li a').filter(_this.$menuItems).first().focus();});return true;}},handled:function handled(preventDefault){if(preventDefault){e.preventDefault();}e.stopImmediatePropagation();}});});// end keyboardAccess
}/**
   * Closes all open elements, and returns to root menu.
   * @function
   * @fires Drilldown#closed
   */},{key:'_hideAll',value:function _hideAll(){var $elem=this.$element.find('.is-drilldown-submenu.is-active').addClass('is-closing');if(this.options.autoHeight)this.$wrapper.css({height:$elem.parent().closest('ul').data('calcHeight')});$elem.one(Foundation.transitionend($elem),function(e){$elem.removeClass('is-active is-closing');});/**
         * Fires when the menu is fully closed.
         * @event Drilldown#closed
         */this.$element.trigger('closed.zf.drilldown');}/**
   * Adds event listener for each `back` button, and closes open menus.
   * @function
   * @fires Drilldown#back
   * @param {jQuery} $elem - the current sub-menu to add `back` event.
   */},{key:'_back',value:function _back($elem){var _this=this;$elem.off('click.zf.drilldown');$elem.children('.js-drilldown-back').on('click.zf.drilldown',function(e){e.stopImmediatePropagation();// console.log('mouseup on back');
_this._hide($elem);// If there is a parent submenu, call show
var parentSubMenu=$elem.parent('li').parent('ul').parent('li');if(parentSubMenu.length){_this._show(parentSubMenu);}});}/**
   * Adds event listener to menu items w/o submenus to close open menus on click.
   * @function
   * @private
   */},{key:'_menuLinkEvents',value:function _menuLinkEvents(){var _this=this;this.$menuItems.not('.is-drilldown-submenu-parent').off('click.zf.drilldown').on('click.zf.drilldown',function(e){// e.stopImmediatePropagation();
setTimeout(function(){_this._hideAll();},0);});}/**
   * Opens a submenu.
   * @function
   * @fires Drilldown#open
   * @param {jQuery} $elem - the current element with a submenu to open, i.e. the `li` tag.
   */},{key:'_show',value:function _show($elem){if(this.options.autoHeight)this.$wrapper.css({height:$elem.children('[data-submenu]').data('calcHeight')});$elem.attr('aria-expanded',true);$elem.children('[data-submenu]').addClass('is-active').attr('aria-hidden',false);/**
     * Fires when the submenu has opened.
     * @event Drilldown#open
     */this.$element.trigger('open.zf.drilldown',[$elem]);}},{key:'_hide',/**
   * Hides a submenu
   * @function
   * @fires Drilldown#hide
   * @param {jQuery} $elem - the current sub-menu to hide, i.e. the `ul` tag.
   */value:function _hide($elem){if(this.options.autoHeight)this.$wrapper.css({height:$elem.parent().closest('ul').data('calcHeight')});var _this=this;$elem.parent('li').attr('aria-expanded',false);$elem.attr('aria-hidden',true).addClass('is-closing');$elem.addClass('is-closing').one(Foundation.transitionend($elem),function(){$elem.removeClass('is-active is-closing');$elem.blur();});/**
     * Fires when the submenu has closed.
     * @event Drilldown#hide
     */$elem.trigger('hide.zf.drilldown',[$elem]);}/**
   * Iterates through the nested menus to calculate the min-height, and max-width for the menu.
   * Prevents content jumping.
   * @function
   * @private
   */},{key:'_getMaxDims',value:function _getMaxDims(){var maxHeight=0,result={},_this=this;this.$submenus.add(this.$element).each(function(){var numOfElems=$(this).children('li').length;var height=Foundation.Box.GetDimensions(this).height;maxHeight=height>maxHeight?height:maxHeight;if(_this.options.autoHeight){$(this).data('calcHeight',height);if(!$(this).hasClass('is-drilldown-submenu'))result['height']=height;}});if(!this.options.autoHeight)result['min-height']=maxHeight+'px';result['max-width']=this.$element[0].getBoundingClientRect().width+'px';return result;}/**
   * Destroys the Drilldown Menu
   * @function
   */},{key:'destroy',value:function destroy(){if(this.options.scrollTop)this.$element.off('.zf.drilldown',this._bindHandler);this._hideAll();this.$element.off('mutateme.zf.trigger');Foundation.Nest.Burn(this.$element,'drilldown');this.$element.unwrap().find('.js-drilldown-back, .is-submenu-parent-item').remove().end().find('.is-active, .is-closing, .is-drilldown-submenu').removeClass('is-active is-closing is-drilldown-submenu').end().find('[data-submenu]').removeAttr('aria-hidden tabindex role');this.$submenuAnchors.each(function(){$(this).off('.zf.drilldown');});this.$submenus.removeClass('drilldown-submenu-cover-previous');this.$element.find('a').each(function(){var $link=$(this);$link.removeAttr('tabindex');if($link.data('savedHref')){$link.attr('href',$link.data('savedHref')).removeData('savedHref');}else{return;}});Foundation.unregisterPlugin(this);}}]);return Drilldown;}();Drilldown.defaults={/**
   * Markup used for JS generated back button. Prepended  or appended (see backButtonPosition) to submenu lists and deleted on `destroy` method, 'js-drilldown-back' class required. Remove the backslash (`\`) if copy and pasting.
   * @option
   * @type {string}
   * @default '<li class="js-drilldown-back"><a tabindex="0">Back</a></li>'
   */backButton:'<li class="js-drilldown-back"><a tabindex="0">Back</a></li>',/**
   * Position the back button either at the top or bottom of drilldown submenus. Can be `'left'` or `'bottom'`.
   * @option
   * @type {string}
   * @default top
   */backButtonPosition:'top',/**
   * Markup used to wrap drilldown menu. Use a class name for independent styling; the JS applied class: `is-drilldown` is required. Remove the backslash (`\`) if copy and pasting.
   * @option
   * @type {string}
   * @default '<div></div>'
   */wrapper:'<div></div>',/**
   * Adds the parent link to the submenu.
   * @option
   * @type {boolean}
   * @default false
   */parentLink:false,/**
   * Allow the menu to return to root list on body click.
   * @option
   * @type {boolean}
   * @default false
   */closeOnClick:false,/**
   * Allow the menu to auto adjust height.
   * @option
   * @type {boolean}
   * @default false
   */autoHeight:false,/**
   * Animate the auto adjust height.
   * @option
   * @type {boolean}
   * @default false
   */animateHeight:false,/**
   * Scroll to the top of the menu after opening a submenu or navigating back using the menu back button
   * @option
   * @type {boolean}
   * @default false
   */scrollTop:false,/**
   * String jquery selector (for example 'body') of element to take offset().top from, if empty string the drilldown menu offset().top is taken
   * @option
   * @type {string}
   * @default ''
   */scrollTopElement:'',/**
   * ScrollTop offset
   * @option
   * @type {number}
   * @default 0
   */scrollTopOffset:0,/**
   * Scroll animation duration
   * @option
   * @type {number}
   * @default 500
   */animationDuration:500,/**
   * Scroll animation easing. Can be `'swing'` or `'linear'`.
   * @option
   * @type {string}
   * @see {@link https://api.jquery.com/animate|JQuery animate}
   * @default 'swing'
   */animationEasing:'swing'// holdOpen: false
};// Window exports
Foundation.plugin(Drilldown,'Drilldown');}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * Dropdown module.
 * @module foundation.dropdown
 * @requires foundation.util.keyboard
 * @requires foundation.util.box
 * @requires foundation.util.triggers
 */var Dropdown=function(){/**
   * Creates a new instance of a dropdown.
   * @class
   * @param {jQuery} element - jQuery object to make into a dropdown.
   *        Object should be of the dropdown panel, rather than its anchor.
   * @param {Object} options - Overrides to the default plugin settings.
   */function Dropdown(element,options){_classCallCheck(this,Dropdown);this.$element=element;this.options=$.extend({},Dropdown.defaults,this.$element.data(),options);this._init();Foundation.registerPlugin(this,'Dropdown');Foundation.Keyboard.register('Dropdown',{'ENTER':'open','SPACE':'open','ESCAPE':'close'});}/**
   * Initializes the plugin by setting/checking options and attributes, adding helper variables, and saving the anchor.
   * @function
   * @private
   */_createClass(Dropdown,[{key:'_init',value:function _init(){var $id=this.$element.attr('id');this.$anchor=$('[data-toggle="'+$id+'"]').length?$('[data-toggle="'+$id+'"]'):$('[data-open="'+$id+'"]');this.$anchor.attr({'aria-controls':$id,'data-is-focus':false,'data-yeti-box':$id,'aria-haspopup':true,'aria-expanded':false});if(this.options.parentClass){this.$parent=this.$element.parents('.'+this.options.parentClass);}else{this.$parent=null;}this.options.positionClass=this.getPositionClass();this.counter=4;this.usedPositions=[];this.$element.attr({'aria-hidden':'true','data-yeti-box':$id,'data-resize':$id,'aria-labelledby':this.$anchor[0].id||Foundation.GetYoDigits(6,'dd-anchor')});this._events();}/**
   * Helper function to determine current orientation of dropdown pane.
   * @function
   * @returns {String} position - string value of a position class.
   */},{key:'getPositionClass',value:function getPositionClass(){var verticalPosition=this.$element[0].className.match(/(top|left|right|bottom)/g);verticalPosition=verticalPosition?verticalPosition[0]:'';var horizontalPosition=/float-(\S+)/.exec(this.$anchor[0].className);horizontalPosition=horizontalPosition?horizontalPosition[1]:'';var position=horizontalPosition?horizontalPosition+' '+verticalPosition:verticalPosition;return position;}/**
   * Adjusts the dropdown panes orientation by adding/removing positioning classes.
   * @function
   * @private
   * @param {String} position - position class to remove.
   */},{key:'_reposition',value:function _reposition(position){this.usedPositions.push(position?position:'bottom');//default, try switching to opposite side
if(!position&&this.usedPositions.indexOf('top')<0){this.$element.addClass('top');}else if(position==='top'&&this.usedPositions.indexOf('bottom')<0){this.$element.removeClass(position);}else if(position==='left'&&this.usedPositions.indexOf('right')<0){this.$element.removeClass(position).addClass('right');}else if(position==='right'&&this.usedPositions.indexOf('left')<0){this.$element.removeClass(position).addClass('left');}//if default change didn't work, try bottom or left first
else if(!position&&this.usedPositions.indexOf('top')>-1&&this.usedPositions.indexOf('left')<0){this.$element.addClass('left');}else if(position==='top'&&this.usedPositions.indexOf('bottom')>-1&&this.usedPositions.indexOf('left')<0){this.$element.removeClass(position).addClass('left');}else if(position==='left'&&this.usedPositions.indexOf('right')>-1&&this.usedPositions.indexOf('bottom')<0){this.$element.removeClass(position);}else if(position==='right'&&this.usedPositions.indexOf('left')>-1&&this.usedPositions.indexOf('bottom')<0){this.$element.removeClass(position);}//if nothing cleared, set to bottom
else{this.$element.removeClass(position);}this.classChanged=true;this.counter--;}/**
   * Sets the position and orientation of the dropdown pane, checks for collisions.
   * Recursively calls itself if a collision is detected, with a new position class.
   * @function
   * @private
   */},{key:'_setPosition',value:function _setPosition(){if(this.$anchor.attr('aria-expanded')==='false'){return false;}var position=this.getPositionClass(),$eleDims=Foundation.Box.GetDimensions(this.$element),$anchorDims=Foundation.Box.GetDimensions(this.$anchor),_this=this,direction=position==='left'?'left':position==='right'?'left':'top',param=direction==='top'?'height':'width',offset=param==='height'?this.options.vOffset:this.options.hOffset;if($eleDims.width>=$eleDims.windowDims.width||!this.counter&&!Foundation.Box.ImNotTouchingYou(this.$element,this.$parent)){var newWidth=$eleDims.windowDims.width,parentHOffset=0;if(this.$parent){var $parentDims=Foundation.Box.GetDimensions(this.$parent),parentHOffset=$parentDims.offset.left;if($parentDims.width<newWidth){newWidth=$parentDims.width;}}this.$element.offset(Foundation.Box.GetOffsets(this.$element,this.$anchor,'center bottom',this.options.vOffset,this.options.hOffset+parentHOffset,true)).css({'width':newWidth-this.options.hOffset*2,'height':'auto'});this.classChanged=true;return false;}this.$element.offset(Foundation.Box.GetOffsets(this.$element,this.$anchor,position,this.options.vOffset,this.options.hOffset));while(!Foundation.Box.ImNotTouchingYou(this.$element,this.$parent,true)&&this.counter){this._reposition(position);this._setPosition();}}/**
   * Adds event listeners to the element utilizing the triggers utility library.
   * @function
   * @private
   */},{key:'_events',value:function _events(){var _this=this;this.$element.on({'open.zf.trigger':this.open.bind(this),'close.zf.trigger':this.close.bind(this),'toggle.zf.trigger':this.toggle.bind(this),'resizeme.zf.trigger':this._setPosition.bind(this)});if(this.options.hover){this.$anchor.off('mouseenter.zf.dropdown mouseleave.zf.dropdown').on('mouseenter.zf.dropdown',function(){var bodyData=$('body').data();if(typeof bodyData.whatinput==='undefined'||bodyData.whatinput==='mouse'){clearTimeout(_this.timeout);_this.timeout=setTimeout(function(){_this.open();_this.$anchor.data('hover',true);},_this.options.hoverDelay);}}).on('mouseleave.zf.dropdown',function(){clearTimeout(_this.timeout);_this.timeout=setTimeout(function(){_this.close();_this.$anchor.data('hover',false);},_this.options.hoverDelay);});if(this.options.hoverPane){this.$element.off('mouseenter.zf.dropdown mouseleave.zf.dropdown').on('mouseenter.zf.dropdown',function(){clearTimeout(_this.timeout);}).on('mouseleave.zf.dropdown',function(){clearTimeout(_this.timeout);_this.timeout=setTimeout(function(){_this.close();_this.$anchor.data('hover',false);},_this.options.hoverDelay);});}}this.$anchor.add(this.$element).on('keydown.zf.dropdown',function(e){var $target=$(this),visibleFocusableElements=Foundation.Keyboard.findFocusable(_this.$element);Foundation.Keyboard.handleKey(e,'Dropdown',{open:function open(){if($target.is(_this.$anchor)){_this.open();_this.$element.attr('tabindex',-1).focus();e.preventDefault();}},close:function close(){_this.close();_this.$anchor.focus();}});});}/**
   * Adds an event handler to the body to close any dropdowns on a click.
   * @function
   * @private
   */},{key:'_addBodyHandler',value:function _addBodyHandler(){var $body=$(document.body).not(this.$element),_this=this;$body.off('click.zf.dropdown').on('click.zf.dropdown',function(e){if(_this.$anchor.is(e.target)||_this.$anchor.find(e.target).length){return;}if(_this.$element.find(e.target).length){return;}_this.close();$body.off('click.zf.dropdown');});}/**
   * Opens the dropdown pane, and fires a bubbling event to close other dropdowns.
   * @function
   * @fires Dropdown#closeme
   * @fires Dropdown#show
   */},{key:'open',value:function open(){// var _this = this;
/**
     * Fires to close other open dropdowns, typically when dropdown is opening
     * @event Dropdown#closeme
     */this.$element.trigger('closeme.zf.dropdown',this.$element.attr('id'));this.$anchor.addClass('hover').attr({'aria-expanded':true});// this.$element/*.show()*/;
this._setPosition();this.$element.addClass('is-open').attr({'aria-hidden':false});if(this.options.autoFocus){var $focusable=Foundation.Keyboard.findFocusable(this.$element);if($focusable.length){$focusable.eq(0).focus();}}if(this.options.closeOnClick){this._addBodyHandler();}if(this.options.trapFocus){Foundation.Keyboard.trapFocus(this.$element);}/**
     * Fires once the dropdown is visible.
     * @event Dropdown#show
     */this.$element.trigger('show.zf.dropdown',[this.$element]);}/**
   * Closes the open dropdown pane.
   * @function
   * @fires Dropdown#hide
   */},{key:'close',value:function close(){if(!this.$element.hasClass('is-open')){return false;}this.$element.removeClass('is-open').attr({'aria-hidden':true});this.$anchor.removeClass('hover').attr('aria-expanded',false);if(this.classChanged){var curPositionClass=this.getPositionClass();if(curPositionClass){this.$element.removeClass(curPositionClass);}this.$element.addClass(this.options.positionClass)/*.hide()*/.css({height:'',width:''});this.classChanged=false;this.counter=4;this.usedPositions.length=0;}/**
     * Fires once the dropdown is no longer visible.
     * @event Dropdown#hide
     */this.$element.trigger('hide.zf.dropdown',[this.$element]);if(this.options.trapFocus){Foundation.Keyboard.releaseFocus(this.$element);}}/**
   * Toggles the dropdown pane's visibility.
   * @function
   */},{key:'toggle',value:function toggle(){if(this.$element.hasClass('is-open')){if(this.$anchor.data('hover'))return;this.close();}else{this.open();}}/**
   * Destroys the dropdown.
   * @function
   */},{key:'destroy',value:function destroy(){this.$element.off('.zf.trigger').hide();this.$anchor.off('.zf.dropdown');Foundation.unregisterPlugin(this);}}]);return Dropdown;}();Dropdown.defaults={/**
   * Class that designates bounding container of Dropdown (default: window)
   * @option
   * @type {?string}
   * @default null
   */parentClass:null,/**
   * Amount of time to delay opening a submenu on hover event.
   * @option
   * @type {number}
   * @default 250
   */hoverDelay:250,/**
   * Allow submenus to open on hover events
   * @option
   * @type {boolean}
   * @default false
   */hover:false,/**
   * Don't close dropdown when hovering over dropdown pane
   * @option
   * @type {boolean}
   * @default false
   */hoverPane:false,/**
   * Number of pixels between the dropdown pane and the triggering element on open.
   * @option
   * @type {number}
   * @default 1
   */vOffset:1,/**
   * Number of pixels between the dropdown pane and the triggering element on open.
   * @option
   * @type {number}
   * @default 1
   */hOffset:1,/**
   * Class applied to adjust open position. JS will test and fill this in.
   * @option
   * @type {string}
   * @default ''
   */positionClass:'',/**
   * Allow the plugin to trap focus to the dropdown pane if opened with keyboard commands.
   * @option
   * @type {boolean}
   * @default false
   */trapFocus:false,/**
   * Allow the plugin to set focus to the first focusable element within the pane, regardless of method of opening.
   * @option
   * @type {boolean}
   * @default false
   */autoFocus:false,/**
   * Allows a click on the body to close the dropdown.
   * @option
   * @type {boolean}
   * @default false
   */closeOnClick:false// Window exports
};Foundation.plugin(Dropdown,'Dropdown');}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * DropdownMenu module.
 * @module foundation.dropdown-menu
 * @requires foundation.util.keyboard
 * @requires foundation.util.box
 * @requires foundation.util.nest
 */var DropdownMenu=function(){/**
   * Creates a new instance of DropdownMenu.
   * @class
   * @fires DropdownMenu#init
   * @param {jQuery} element - jQuery object to make into a dropdown menu.
   * @param {Object} options - Overrides to the default plugin settings.
   */function DropdownMenu(element,options){_classCallCheck(this,DropdownMenu);this.$element=element;this.options=$.extend({},DropdownMenu.defaults,this.$element.data(),options);Foundation.Nest.Feather(this.$element,'dropdown');this._init();Foundation.registerPlugin(this,'DropdownMenu');Foundation.Keyboard.register('DropdownMenu',{'ENTER':'open','SPACE':'open','ARROW_RIGHT':'next','ARROW_UP':'up','ARROW_DOWN':'down','ARROW_LEFT':'previous','ESCAPE':'close'});}/**
   * Initializes the plugin, and calls _prepareMenu
   * @private
   * @function
   */_createClass(DropdownMenu,[{key:'_init',value:function _init(){var subs=this.$element.find('li.is-dropdown-submenu-parent');this.$element.children('.is-dropdown-submenu-parent').children('.is-dropdown-submenu').addClass('first-sub');this.$menuItems=this.$element.find('[role="menuitem"]');this.$tabs=this.$element.children('[role="menuitem"]');this.$tabs.find('ul.is-dropdown-submenu').addClass(this.options.verticalClass);if(this.$element.hasClass(this.options.rightClass)||this.options.alignment==='right'||Foundation.rtl()||this.$element.parents('.top-bar-right').is('*')){this.options.alignment='right';subs.addClass('opens-left');}else{subs.addClass('opens-right');}this.changed=false;this._events();}},{key:'_isVertical',value:function _isVertical(){return this.$tabs.css('display')==='block';}/**
   * Adds event listeners to elements within the menu
   * @private
   * @function
   */},{key:'_events',value:function _events(){var _this=this,hasTouch='ontouchstart'in window||typeof window.ontouchstart!=='undefined',parClass='is-dropdown-submenu-parent';// used for onClick and in the keyboard handlers
var handleClickFn=function handleClickFn(e){var $elem=$(e.target).parentsUntil('ul','.'+parClass),hasSub=$elem.hasClass(parClass),hasClicked=$elem.attr('data-is-click')==='true',$sub=$elem.children('.is-dropdown-submenu');if(hasSub){if(hasClicked){if(!_this.options.closeOnClick||!_this.options.clickOpen&&!hasTouch||_this.options.forceFollow&&hasTouch){return;}else{e.stopImmediatePropagation();e.preventDefault();_this._hide($elem);}}else{e.preventDefault();e.stopImmediatePropagation();_this._show($sub);$elem.add($elem.parentsUntil(_this.$element,'.'+parClass)).attr('data-is-click',true);}}};if(this.options.clickOpen||hasTouch){this.$menuItems.on('click.zf.dropdownmenu touchstart.zf.dropdownmenu',handleClickFn);}// Handle Leaf element Clicks
if(_this.options.closeOnClickInside){this.$menuItems.on('click.zf.dropdownmenu',function(e){var $elem=$(this),hasSub=$elem.hasClass(parClass);if(!hasSub){_this._hide();}});}if(!this.options.disableHover){this.$menuItems.on('mouseenter.zf.dropdownmenu',function(e){var $elem=$(this),hasSub=$elem.hasClass(parClass);if(hasSub){clearTimeout($elem.data('_delay'));$elem.data('_delay',setTimeout(function(){_this._show($elem.children('.is-dropdown-submenu'));},_this.options.hoverDelay));}}).on('mouseleave.zf.dropdownmenu',function(e){var $elem=$(this),hasSub=$elem.hasClass(parClass);if(hasSub&&_this.options.autoclose){if($elem.attr('data-is-click')==='true'&&_this.options.clickOpen){return false;}clearTimeout($elem.data('_delay'));$elem.data('_delay',setTimeout(function(){_this._hide($elem);},_this.options.closingTime));}});}this.$menuItems.on('keydown.zf.dropdownmenu',function(e){var $element=$(e.target).parentsUntil('ul','[role="menuitem"]'),isTab=_this.$tabs.index($element)>-1,$elements=isTab?_this.$tabs:$element.siblings('li').add($element),$prevElement,$nextElement;$elements.each(function(i){if($(this).is($element)){$prevElement=$elements.eq(i-1);$nextElement=$elements.eq(i+1);return;}});var nextSibling=function nextSibling(){if(!$element.is(':last-child')){$nextElement.children('a:first').focus();e.preventDefault();}},prevSibling=function prevSibling(){$prevElement.children('a:first').focus();e.preventDefault();},openSub=function openSub(){var $sub=$element.children('ul.is-dropdown-submenu');if($sub.length){_this._show($sub);$element.find('li > a:first').focus();e.preventDefault();}else{return;}},closeSub=function closeSub(){//if ($element.is(':first-child')) {
var close=$element.parent('ul').parent('li');close.children('a:first').focus();_this._hide(close);e.preventDefault();//}
};var functions={open:openSub,close:function close(){_this._hide(_this.$element);_this.$menuItems.find('a:first').focus();// focus to first element
e.preventDefault();},handled:function handled(){e.stopImmediatePropagation();}};if(isTab){if(_this._isVertical()){// vertical menu
if(Foundation.rtl()){// right aligned
$.extend(functions,{down:nextSibling,up:prevSibling,next:closeSub,previous:openSub});}else{// left aligned
$.extend(functions,{down:nextSibling,up:prevSibling,next:openSub,previous:closeSub});}}else{// horizontal menu
if(Foundation.rtl()){// right aligned
$.extend(functions,{next:prevSibling,previous:nextSibling,down:openSub,up:closeSub});}else{// left aligned
$.extend(functions,{next:nextSibling,previous:prevSibling,down:openSub,up:closeSub});}}}else{// not tabs -> one sub
if(Foundation.rtl()){// right aligned
$.extend(functions,{next:closeSub,previous:openSub,down:nextSibling,up:prevSibling});}else{// left aligned
$.extend(functions,{next:openSub,previous:closeSub,down:nextSibling,up:prevSibling});}}Foundation.Keyboard.handleKey(e,'DropdownMenu',functions);});}/**
   * Adds an event handler to the body to close any dropdowns on a click.
   * @function
   * @private
   */},{key:'_addBodyHandler',value:function _addBodyHandler(){var $body=$(document.body),_this=this;$body.off('mouseup.zf.dropdownmenu touchend.zf.dropdownmenu').on('mouseup.zf.dropdownmenu touchend.zf.dropdownmenu',function(e){var $link=_this.$element.find(e.target);if($link.length){return;}_this._hide();$body.off('mouseup.zf.dropdownmenu touchend.zf.dropdownmenu');});}/**
   * Opens a dropdown pane, and checks for collisions first.
   * @param {jQuery} $sub - ul element that is a submenu to show
   * @function
   * @private
   * @fires DropdownMenu#show
   */},{key:'_show',value:function _show($sub){var idx=this.$tabs.index(this.$tabs.filter(function(i,el){return $(el).find($sub).length>0;}));var $sibs=$sub.parent('li.is-dropdown-submenu-parent').siblings('li.is-dropdown-submenu-parent');this._hide($sibs,idx);$sub.css('visibility','hidden').addClass('js-dropdown-active').parent('li.is-dropdown-submenu-parent').addClass('is-active');var clear=Foundation.Box.ImNotTouchingYou($sub,null,true);if(!clear){var oldClass=this.options.alignment==='left'?'-right':'-left',$parentLi=$sub.parent('.is-dropdown-submenu-parent');$parentLi.removeClass('opens'+oldClass).addClass('opens-'+this.options.alignment);clear=Foundation.Box.ImNotTouchingYou($sub,null,true);if(!clear){$parentLi.removeClass('opens-'+this.options.alignment).addClass('opens-inner');}this.changed=true;}$sub.css('visibility','');if(this.options.closeOnClick){this._addBodyHandler();}/**
     * Fires when the new dropdown pane is visible.
     * @event DropdownMenu#show
     */this.$element.trigger('show.zf.dropdownmenu',[$sub]);}/**
   * Hides a single, currently open dropdown pane, if passed a parameter, otherwise, hides everything.
   * @function
   * @param {jQuery} $elem - element with a submenu to hide
   * @param {Number} idx - index of the $tabs collection to hide
   * @private
   */},{key:'_hide',value:function _hide($elem,idx){var $toClose;if($elem&&$elem.length){$toClose=$elem;}else if(idx!==undefined){$toClose=this.$tabs.not(function(i,el){return i===idx;});}else{$toClose=this.$element;}var somethingToClose=$toClose.hasClass('is-active')||$toClose.find('.is-active').length>0;if(somethingToClose){$toClose.find('li.is-active').add($toClose).attr({'data-is-click':false}).removeClass('is-active');$toClose.find('ul.js-dropdown-active').removeClass('js-dropdown-active');if(this.changed||$toClose.find('opens-inner').length){var oldClass=this.options.alignment==='left'?'right':'left';$toClose.find('li.is-dropdown-submenu-parent').add($toClose).removeClass('opens-inner opens-'+this.options.alignment).addClass('opens-'+oldClass);this.changed=false;}/**
       * Fires when the open menus are closed.
       * @event DropdownMenu#hide
       */this.$element.trigger('hide.zf.dropdownmenu',[$toClose]);}}/**
   * Destroys the plugin.
   * @function
   */},{key:'destroy',value:function destroy(){this.$menuItems.off('.zf.dropdownmenu').removeAttr('data-is-click').removeClass('is-right-arrow is-left-arrow is-down-arrow opens-right opens-left opens-inner');$(document.body).off('.zf.dropdownmenu');Foundation.Nest.Burn(this.$element,'dropdown');Foundation.unregisterPlugin(this);}}]);return DropdownMenu;}();/**
 * Default settings for plugin
 */DropdownMenu.defaults={/**
   * Disallows hover events from opening submenus
   * @option
   * @type {boolean}
   * @default false
   */disableHover:false,/**
   * Allow a submenu to automatically close on a mouseleave event, if not clicked open.
   * @option
   * @type {boolean}
   * @default true
   */autoclose:true,/**
   * Amount of time to delay opening a submenu on hover event.
   * @option
   * @type {number}
   * @default 50
   */hoverDelay:50,/**
   * Allow a submenu to open/remain open on parent click event. Allows cursor to move away from menu.
   * @option
   * @type {boolean}
   * @default false
   */clickOpen:false,/**
   * Amount of time to delay closing a submenu on a mouseleave event.
   * @option
   * @type {number}
   * @default 500
   */closingTime:500,/**
   * Position of the menu relative to what direction the submenus should open. Handled by JS. Can be `'left'` or `'right'`.
   * @option
   * @type {string}
   * @default 'left'
   */alignment:'left',/**
   * Allow clicks on the body to close any open submenus.
   * @option
   * @type {boolean}
   * @default true
   */closeOnClick:true,/**
   * Allow clicks on leaf anchor links to close any open submenus.
   * @option
   * @type {boolean}
   * @default true
   */closeOnClickInside:true,/**
   * Class applied to vertical oriented menus, Foundation default is `vertical`. Update this if using your own class.
   * @option
   * @type {string}
   * @default 'vertical'
   */verticalClass:'vertical',/**
   * Class applied to right-side oriented menus, Foundation default is `align-right`. Update this if using your own class.
   * @option
   * @type {string}
   * @default 'align-right'
   */rightClass:'align-right',/**
   * Boolean to force overide the clicking of links to perform default action, on second touch event for mobile.
   * @option
   * @type {boolean}
   * @default true
   */forceFollow:true};// Window exports
Foundation.plugin(DropdownMenu,'DropdownMenu');}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * OffCanvas module.
 * @module foundation.offcanvas
 * @requires foundation.util.keyboard
 * @requires foundation.util.mediaQuery
 * @requires foundation.util.triggers
 * @requires foundation.util.motion
 */var OffCanvas=function(){/**
   * Creates a new instance of an off-canvas wrapper.
   * @class
   * @fires OffCanvas#init
   * @param {Object} element - jQuery object to initialize.
   * @param {Object} options - Overrides to the default plugin settings.
   */function OffCanvas(element,options){_classCallCheck(this,OffCanvas);this.$element=element;this.options=$.extend({},OffCanvas.defaults,this.$element.data(),options);this.$lastTrigger=$();this.$triggers=$();this._init();this._events();Foundation.registerPlugin(this,'OffCanvas');Foundation.Keyboard.register('OffCanvas',{'ESCAPE':'close'});}/**
   * Initializes the off-canvas wrapper by adding the exit overlay (if needed).
   * @function
   * @private
   */_createClass(OffCanvas,[{key:'_init',value:function _init(){var id=this.$element.attr('id');this.$element.attr('aria-hidden','true');this.$element.addClass('is-transition-'+this.options.transition);// Find triggers that affect this element and add aria-expanded to them
this.$triggers=$(document).find('[data-open="'+id+'"], [data-close="'+id+'"], [data-toggle="'+id+'"]').attr('aria-expanded','false').attr('aria-controls',id);// Add an overlay over the content if necessary
if(this.options.contentOverlay===true){var overlay=document.createElement('div');var overlayPosition=$(this.$element).css("position")==='fixed'?'is-overlay-fixed':'is-overlay-absolute';overlay.setAttribute('class','js-off-canvas-overlay '+overlayPosition);this.$overlay=$(overlay);if(overlayPosition==='is-overlay-fixed'){$('body').append(this.$overlay);}else{this.$element.siblings('[data-off-canvas-content]').append(this.$overlay);}}this.options.isRevealed=this.options.isRevealed||new RegExp(this.options.revealClass,'g').test(this.$element[0].className);if(this.options.isRevealed===true){this.options.revealOn=this.options.revealOn||this.$element[0].className.match(/(reveal-for-medium|reveal-for-large)/g)[0].split('-')[2];this._setMQChecker();}if(!this.options.transitionTime===true){this.options.transitionTime=parseFloat(window.getComputedStyle($('[data-off-canvas]')[0]).transitionDuration)*1000;}}/**
   * Adds event handlers to the off-canvas wrapper and the exit overlay.
   * @function
   * @private
   */},{key:'_events',value:function _events(){this.$element.off('.zf.trigger .zf.offcanvas').on({'open.zf.trigger':this.open.bind(this),'close.zf.trigger':this.close.bind(this),'toggle.zf.trigger':this.toggle.bind(this),'keydown.zf.offcanvas':this._handleKeyboard.bind(this)});if(this.options.closeOnClick===true){var $target=this.options.contentOverlay?this.$overlay:$('[data-off-canvas-content]');$target.on({'click.zf.offcanvas':this.close.bind(this)});}}/**
   * Applies event listener for elements that will reveal at certain breakpoints.
   * @private
   */},{key:'_setMQChecker',value:function _setMQChecker(){var _this=this;$(window).on('changed.zf.mediaquery',function(){if(Foundation.MediaQuery.atLeast(_this.options.revealOn)){_this.reveal(true);}else{_this.reveal(false);}}).one('load.zf.offcanvas',function(){if(Foundation.MediaQuery.atLeast(_this.options.revealOn)){_this.reveal(true);}});}/**
   * Handles the revealing/hiding the off-canvas at breakpoints, not the same as open.
   * @param {Boolean} isRevealed - true if element should be revealed.
   * @function
   */},{key:'reveal',value:function reveal(isRevealed){var $closer=this.$element.find('[data-close]');if(isRevealed){this.close();this.isRevealed=true;this.$element.attr('aria-hidden','false');this.$element.off('open.zf.trigger toggle.zf.trigger');if($closer.length){$closer.hide();}}else{this.isRevealed=false;this.$element.attr('aria-hidden','true');this.$element.off('open.zf.trigger toggle.zf.trigger').on({'open.zf.trigger':this.open.bind(this),'toggle.zf.trigger':this.toggle.bind(this)});if($closer.length){$closer.show();}}}/**
   * Stops scrolling of the body when offcanvas is open on mobile Safari and other troublesome browsers.
   * @private
   */},{key:'_stopScrolling',value:function _stopScrolling(event){return false;}/**
   * Opens the off-canvas menu.
   * @function
   * @param {Object} event - Event object passed from listener.
   * @param {jQuery} trigger - element that triggered the off-canvas to open.
   * @fires OffCanvas#opened
   */},{key:'open',value:function open(event,trigger){if(this.$element.hasClass('is-open')||this.isRevealed){return;}var _this=this;if(trigger){this.$lastTrigger=trigger;}if(this.options.forceTo==='top'){window.scrollTo(0,0);}else if(this.options.forceTo==='bottom'){window.scrollTo(0,document.body.scrollHeight);}/**
     * Fires when the off-canvas menu opens.
     * @event OffCanvas#opened
     */_this.$element.addClass('is-open');this.$triggers.attr('aria-expanded','true');this.$element.attr('aria-hidden','false').trigger('opened.zf.offcanvas');// If `contentScroll` is set to false, add class and disable scrolling on touch devices.
if(this.options.contentScroll===false){$('body').addClass('is-off-canvas-open').on('touchmove',this._stopScrolling);}if(this.options.contentOverlay===true){this.$overlay.addClass('is-visible');}if(this.options.closeOnClick===true&&this.options.contentOverlay===true){this.$overlay.addClass('is-closable');}if(this.options.autoFocus===true){this.$element.one(Foundation.transitionend(this.$element),function(){var canvasFocus=_this.$element.find('[data-autofocus]');if(canvasFocus.length){canvasFocus.eq(0).focus();}else{_this.$element.find('a, button').eq(0).focus();}});}if(this.options.trapFocus===true){this.$element.siblings('[data-off-canvas-content]').attr('tabindex','-1');Foundation.Keyboard.trapFocus(this.$element);}}/**
   * Closes the off-canvas menu.
   * @function
   * @param {Function} cb - optional cb to fire after closure.
   * @fires OffCanvas#closed
   */},{key:'close',value:function close(cb){if(!this.$element.hasClass('is-open')||this.isRevealed){return;}var _this=this;_this.$element.removeClass('is-open');this.$element.attr('aria-hidden','true')/**
       * Fires when the off-canvas menu opens.
       * @event OffCanvas#closed
       */.trigger('closed.zf.offcanvas');// If `contentScroll` is set to false, remove class and re-enable scrolling on touch devices.
if(this.options.contentScroll===false){$('body').removeClass('is-off-canvas-open').off('touchmove',this._stopScrolling);}if(this.options.contentOverlay===true){this.$overlay.removeClass('is-visible');}if(this.options.closeOnClick===true&&this.options.contentOverlay===true){this.$overlay.removeClass('is-closable');}this.$triggers.attr('aria-expanded','false');if(this.options.trapFocus===true){this.$element.siblings('[data-off-canvas-content]').removeAttr('tabindex');Foundation.Keyboard.releaseFocus(this.$element);}}/**
   * Toggles the off-canvas menu open or closed.
   * @function
   * @param {Object} event - Event object passed from listener.
   * @param {jQuery} trigger - element that triggered the off-canvas to open.
   */},{key:'toggle',value:function toggle(event,trigger){if(this.$element.hasClass('is-open')){this.close(event,trigger);}else{this.open(event,trigger);}}/**
   * Handles keyboard input when detected. When the escape key is pressed, the off-canvas menu closes, and focus is restored to the element that opened the menu.
   * @function
   * @private
   */},{key:'_handleKeyboard',value:function _handleKeyboard(e){var _this2=this;Foundation.Keyboard.handleKey(e,'OffCanvas',{close:function close(){_this2.close();_this2.$lastTrigger.focus();return true;},handled:function handled(){e.stopPropagation();e.preventDefault();}});}/**
   * Destroys the offcanvas plugin.
   * @function
   */},{key:'destroy',value:function destroy(){this.close();this.$element.off('.zf.trigger .zf.offcanvas');this.$overlay.off('.zf.offcanvas');Foundation.unregisterPlugin(this);}}]);return OffCanvas;}();OffCanvas.defaults={/**
   * Allow the user to click outside of the menu to close it.
   * @option
   * @type {boolean}
   * @default true
   */closeOnClick:true,/**
   * Adds an overlay on top of `[data-off-canvas-content]`.
   * @option
   * @type {boolean}
   * @default true
   */contentOverlay:true,/**
   * Enable/disable scrolling of the main content when an off canvas panel is open.
   * @option
   * @type {boolean}
   * @default true
   */contentScroll:true,/**
   * Amount of time in ms the open and close transition requires. If none selected, pulls from body style.
   * @option
   * @type {number}
   * @default 0
   */transitionTime:0,/**
   * Type of transition for the offcanvas menu. Options are 'push', 'detached' or 'slide'.
   * @option
   * @type {string}
   * @default push
   */transition:'push',/**
   * Force the page to scroll to top or bottom on open.
   * @option
   * @type {?string}
   * @default null
   */forceTo:null,/**
   * Allow the offcanvas to remain open for certain breakpoints.
   * @option
   * @type {boolean}
   * @default false
   */isRevealed:false,/**
   * Breakpoint at which to reveal. JS will use a RegExp to target standard classes, if changing classnames, pass your class with the `revealClass` option.
   * @option
   * @type {?string}
   * @default null
   */revealOn:null,/**
   * Force focus to the offcanvas on open. If true, will focus the opening trigger on close.
   * @option
   * @type {boolean}
   * @default true
   */autoFocus:true,/**
   * Class used to force an offcanvas to remain open. Foundation defaults for this are `reveal-for-large` & `reveal-for-medium`.
   * @option
   * @type {string}
   * @default reveal-for-
   * @todo improve the regex testing for this.
   */revealClass:'reveal-for-',/**
   * Triggers optional focus trapping when opening an offcanvas. Sets tabindex of [data-off-canvas-content] to -1 for accessibility purposes.
   * @option
   * @type {boolean}
   * @default false
   */trapFocus:false// Window exports
};Foundation.plugin(OffCanvas,'OffCanvas');}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * ResponsiveMenu module.
 * @module foundation.responsiveMenu
 * @requires foundation.util.triggers
 * @requires foundation.util.mediaQuery
 */var ResponsiveMenu=function(){/**
   * Creates a new instance of a responsive menu.
   * @class
   * @fires ResponsiveMenu#init
   * @param {jQuery} element - jQuery object to make into a dropdown menu.
   * @param {Object} options - Overrides to the default plugin settings.
   */function ResponsiveMenu(element,options){_classCallCheck(this,ResponsiveMenu);this.$element=$(element);this.rules=this.$element.data('responsive-menu');this.currentMq=null;this.currentPlugin=null;this._init();this._events();Foundation.registerPlugin(this,'ResponsiveMenu');}/**
   * Initializes the Menu by parsing the classes from the 'data-ResponsiveMenu' attribute on the element.
   * @function
   * @private
   */_createClass(ResponsiveMenu,[{key:'_init',value:function _init(){// The first time an Interchange plugin is initialized, this.rules is converted from a string of "classes" to an object of rules
if(typeof this.rules==='string'){var rulesTree={};// Parse rules from "classes" pulled from data attribute
var rules=this.rules.split(' ');// Iterate through every rule found
for(var i=0;i<rules.length;i++){var rule=rules[i].split('-');var ruleSize=rule.length>1?rule[0]:'small';var rulePlugin=rule.length>1?rule[1]:rule[0];if(MenuPlugins[rulePlugin]!==null){rulesTree[ruleSize]=MenuPlugins[rulePlugin];}}this.rules=rulesTree;}if(!$.isEmptyObject(this.rules)){this._checkMediaQueries();}// Add data-mutate since children may need it.
this.$element.attr('data-mutate',this.$element.attr('data-mutate')||Foundation.GetYoDigits(6,'responsive-menu'));}/**
   * Initializes events for the Menu.
   * @function
   * @private
   */},{key:'_events',value:function _events(){var _this=this;$(window).on('changed.zf.mediaquery',function(){_this._checkMediaQueries();});// $(window).on('resize.zf.ResponsiveMenu', function() {
//   _this._checkMediaQueries();
// });
}/**
   * Checks the current screen width against available media queries. If the media query has changed, and the plugin needed has changed, the plugins will swap out.
   * @function
   * @private
   */},{key:'_checkMediaQueries',value:function _checkMediaQueries(){var matchedMq,_this=this;// Iterate through each rule and find the last matching rule
$.each(this.rules,function(key){if(Foundation.MediaQuery.atLeast(key)){matchedMq=key;}});// No match? No dice
if(!matchedMq)return;// Plugin already initialized? We good
if(this.currentPlugin instanceof this.rules[matchedMq].plugin)return;// Remove existing plugin-specific CSS classes
$.each(MenuPlugins,function(key,value){_this.$element.removeClass(value.cssClass);});// Add the CSS class for the new plugin
this.$element.addClass(this.rules[matchedMq].cssClass);// Create an instance of the new plugin
if(this.currentPlugin)this.currentPlugin.destroy();this.currentPlugin=new this.rules[matchedMq].plugin(this.$element,{});}/**
   * Destroys the instance of the current plugin on this element, as well as the window resize handler that switches the plugins out.
   * @function
   */},{key:'destroy',value:function destroy(){this.currentPlugin.destroy();$(window).off('.zf.ResponsiveMenu');Foundation.unregisterPlugin(this);}}]);return ResponsiveMenu;}();ResponsiveMenu.defaults={};// The plugin matches the plugin classes with these plugin instances.
var MenuPlugins={dropdown:{cssClass:'dropdown',plugin:Foundation._plugins['dropdown-menu']||null},drilldown:{cssClass:'drilldown',plugin:Foundation._plugins['drilldown']||null},accordion:{cssClass:'accordion-menu',plugin:Foundation._plugins['accordion-menu']||null}};// Window exports
Foundation.plugin(ResponsiveMenu,'ResponsiveMenu');}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * ResponsiveToggle module.
 * @module foundation.responsiveToggle
 * @requires foundation.util.mediaQuery
 */var ResponsiveToggle=function(){/**
   * Creates a new instance of Tab Bar.
   * @class
   * @fires ResponsiveToggle#init
   * @param {jQuery} element - jQuery object to attach tab bar functionality to.
   * @param {Object} options - Overrides to the default plugin settings.
   */function ResponsiveToggle(element,options){_classCallCheck(this,ResponsiveToggle);this.$element=$(element);this.options=$.extend({},ResponsiveToggle.defaults,this.$element.data(),options);this._init();this._events();Foundation.registerPlugin(this,'ResponsiveToggle');}/**
   * Initializes the tab bar by finding the target element, toggling element, and running update().
   * @function
   * @private
   */_createClass(ResponsiveToggle,[{key:'_init',value:function _init(){var targetID=this.$element.data('responsive-toggle');if(!targetID){console.error('Your tab bar needs an ID of a Menu as the value of data-tab-bar.');}this.$targetMenu=$('#'+targetID);this.$toggler=this.$element.find('[data-toggle]').filter(function(){var target=$(this).data('toggle');return target===targetID||target==="";});this.options=$.extend({},this.options,this.$targetMenu.data());// If they were set, parse the animation classes
if(this.options.animate){var input=this.options.animate.split(' ');this.animationIn=input[0];this.animationOut=input[1]||null;}this._update();}/**
   * Adds necessary event handlers for the tab bar to work.
   * @function
   * @private
   */},{key:'_events',value:function _events(){var _this=this;this._updateMqHandler=this._update.bind(this);$(window).on('changed.zf.mediaquery',this._updateMqHandler);this.$toggler.on('click.zf.responsiveToggle',this.toggleMenu.bind(this));}/**
   * Checks the current media query to determine if the tab bar should be visible or hidden.
   * @function
   * @private
   */},{key:'_update',value:function _update(){// Mobile
if(!Foundation.MediaQuery.atLeast(this.options.hideFor)){this.$element.show();this.$targetMenu.hide();}// Desktop
else{this.$element.hide();this.$targetMenu.show();}}/**
   * Toggles the element attached to the tab bar. The toggle only happens if the screen is small enough to allow it.
   * @function
   * @fires ResponsiveToggle#toggled
   */},{key:'toggleMenu',value:function toggleMenu(){var _this2=this;if(!Foundation.MediaQuery.atLeast(this.options.hideFor)){/**
       * Fires when the element attached to the tab bar toggles.
       * @event ResponsiveToggle#toggled
       */if(this.options.animate){if(this.$targetMenu.is(':hidden')){Foundation.Motion.animateIn(this.$targetMenu,this.animationIn,function(){_this2.$element.trigger('toggled.zf.responsiveToggle');_this2.$targetMenu.find('[data-mutate]').triggerHandler('mutateme.zf.trigger');});}else{Foundation.Motion.animateOut(this.$targetMenu,this.animationOut,function(){_this2.$element.trigger('toggled.zf.responsiveToggle');});}}else{this.$targetMenu.toggle(0);this.$targetMenu.find('[data-mutate]').trigger('mutateme.zf.trigger');this.$element.trigger('toggled.zf.responsiveToggle');}}}},{key:'destroy',value:function destroy(){this.$element.off('.zf.responsiveToggle');this.$toggler.off('.zf.responsiveToggle');$(window).off('changed.zf.mediaquery',this._updateMqHandler);Foundation.unregisterPlugin(this);}}]);return ResponsiveToggle;}();ResponsiveToggle.defaults={/**
   * The breakpoint after which the menu is always shown, and the tab bar is hidden.
   * @option
   * @type {string}
   * @default 'medium'
   */hideFor:'medium',/**
   * To decide if the toggle should be animated or not.
   * @option
   * @type {boolean}
   * @default false
   */animate:false};// Window exports
Foundation.plugin(ResponsiveToggle,'ResponsiveToggle');}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * Reveal module.
 * @module foundation.reveal
 * @requires foundation.util.keyboard
 * @requires foundation.util.box
 * @requires foundation.util.triggers
 * @requires foundation.util.mediaQuery
 * @requires foundation.util.motion if using animations
 */var Reveal=function(){/**
   * Creates a new instance of Reveal.
   * @class
   * @param {jQuery} element - jQuery object to use for the modal.
   * @param {Object} options - optional parameters.
   */function Reveal(element,options){_classCallCheck(this,Reveal);this.$element=element;this.options=$.extend({},Reveal.defaults,this.$element.data(),options);this._init();Foundation.registerPlugin(this,'Reveal');Foundation.Keyboard.register('Reveal',{'ENTER':'open','SPACE':'open','ESCAPE':'close'});}/**
   * Initializes the modal by adding the overlay and close buttons, (if selected).
   * @private
   */_createClass(Reveal,[{key:'_init',value:function _init(){this.id=this.$element.attr('id');this.isActive=false;this.cached={mq:Foundation.MediaQuery.current};this.isMobile=mobileSniff();this.$anchor=$('[data-open="'+this.id+'"]').length?$('[data-open="'+this.id+'"]'):$('[data-toggle="'+this.id+'"]');this.$anchor.attr({'aria-controls':this.id,'aria-haspopup':true,'tabindex':0});if(this.options.fullScreen||this.$element.hasClass('full')){this.options.fullScreen=true;this.options.overlay=false;}if(this.options.overlay&&!this.$overlay){this.$overlay=this._makeOverlay(this.id);}this.$element.attr({'role':'dialog','aria-hidden':true,'data-yeti-box':this.id,'data-resize':this.id});if(this.$overlay){this.$element.detach().appendTo(this.$overlay);}else{this.$element.detach().appendTo($(this.options.appendTo));this.$element.addClass('without-overlay');}this._events();if(this.options.deepLink&&window.location.hash==='#'+this.id){$(window).one('load.zf.reveal',this.open.bind(this));}}/**
   * Creates an overlay div to display behind the modal.
   * @private
   */},{key:'_makeOverlay',value:function _makeOverlay(){return $('<div></div>').addClass('reveal-overlay').appendTo(this.options.appendTo);}/**
   * Updates position of modal
   * TODO:  Figure out if we actually need to cache these values or if it doesn't matter
   * @private
   */},{key:'_updatePosition',value:function _updatePosition(){var width=this.$element.outerWidth();var outerWidth=$(window).width();var height=this.$element.outerHeight();var outerHeight=$(window).height();var left,top;if(this.options.hOffset==='auto'){left=parseInt((outerWidth-width)/2,10);}else{left=parseInt(this.options.hOffset,10);}if(this.options.vOffset==='auto'){if(height>outerHeight){top=parseInt(Math.min(100,outerHeight/10),10);}else{top=parseInt((outerHeight-height)/4,10);}}else{top=parseInt(this.options.vOffset,10);}this.$element.css({top:top+'px'});// only worry about left if we don't have an overlay or we havea  horizontal offset,
// otherwise we're perfectly in the middle
if(!this.$overlay||this.options.hOffset!=='auto'){this.$element.css({left:left+'px'});this.$element.css({margin:'0px'});}}/**
   * Adds event handlers for the modal.
   * @private
   */},{key:'_events',value:function _events(){var _this2=this;var _this=this;this.$element.on({'open.zf.trigger':this.open.bind(this),'close.zf.trigger':function closeZfTrigger(event,$element){if(event.target===_this.$element[0]||$(event.target).parents('[data-closable]')[0]===$element){// only close reveal when it's explicitly called
return _this2.close.apply(_this2);}},'toggle.zf.trigger':this.toggle.bind(this),'resizeme.zf.trigger':function resizemeZfTrigger(){_this._updatePosition();}});if(this.$anchor.length){this.$anchor.on('keydown.zf.reveal',function(e){if(e.which===13||e.which===32){e.stopPropagation();e.preventDefault();_this.open();}});}if(this.options.closeOnClick&&this.options.overlay){this.$overlay.off('.zf.reveal').on('click.zf.reveal',function(e){if(e.target===_this.$element[0]||$.contains(_this.$element[0],e.target)||!$.contains(document,e.target)){return;}_this.close();});}if(this.options.deepLink){$(window).on('popstate.zf.reveal:'+this.id,this._handleState.bind(this));}}/**
   * Handles modal methods on back/forward button clicks or any other event that triggers popstate.
   * @private
   */},{key:'_handleState',value:function _handleState(e){if(window.location.hash==='#'+this.id&&!this.isActive){this.open();}else{this.close();}}/**
   * Opens the modal controlled by `this.$anchor`, and closes all others by default.
   * @function
   * @fires Reveal#closeme
   * @fires Reveal#open
   */},{key:'open',value:function open(){var _this3=this;if(this.options.deepLink){var hash='#'+this.id;if(window.history.pushState){window.history.pushState(null,null,hash);}else{window.location.hash=hash;}}this.isActive=true;// Make elements invisible, but remove display: none so we can get size and positioning
this.$element.css({'visibility':'hidden'}).show().scrollTop(0);if(this.options.overlay){this.$overlay.css({'visibility':'hidden'}).show();}this._updatePosition();this.$element.hide().css({'visibility':''});if(this.$overlay){this.$overlay.css({'visibility':''}).hide();if(this.$element.hasClass('fast')){this.$overlay.addClass('fast');}else if(this.$element.hasClass('slow')){this.$overlay.addClass('slow');}}if(!this.options.multipleOpened){/**
       * Fires immediately before the modal opens.
       * Closes any other modals that are currently open
       * @event Reveal#closeme
       */this.$element.trigger('closeme.zf.reveal',this.id);}var _this=this;function addRevealOpenClasses(){if(_this.isMobile){if(!_this.originalScrollPos){_this.originalScrollPos=window.pageYOffset;}$('html, body').addClass('is-reveal-open');}else{$('body').addClass('is-reveal-open');}}// Motion UI method of reveal
if(this.options.animationIn){var afterAnimation=function afterAnimation(){_this.$element.attr({'aria-hidden':false,'tabindex':-1}).focus();addRevealOpenClasses();Foundation.Keyboard.trapFocus(_this.$element);};if(this.options.overlay){Foundation.Motion.animateIn(this.$overlay,'fade-in');}Foundation.Motion.animateIn(this.$element,this.options.animationIn,function(){if(_this3.$element){// protect against object having been removed
_this3.focusableElements=Foundation.Keyboard.findFocusable(_this3.$element);afterAnimation();}});}// jQuery method of reveal
else{if(this.options.overlay){this.$overlay.show(0);}this.$element.show(this.options.showDelay);}// handle accessibility
this.$element.attr({'aria-hidden':false,'tabindex':-1}).focus();Foundation.Keyboard.trapFocus(this.$element);/**
     * Fires when the modal has successfully opened.
     * @event Reveal#open
     */this.$element.trigger('open.zf.reveal');addRevealOpenClasses();setTimeout(function(){_this3._extraHandlers();},0);}/**
   * Adds extra event handlers for the body and window if necessary.
   * @private
   */},{key:'_extraHandlers',value:function _extraHandlers(){var _this=this;if(!this.$element){return;}// If we're in the middle of cleanup, don't freak out
this.focusableElements=Foundation.Keyboard.findFocusable(this.$element);if(!this.options.overlay&&this.options.closeOnClick&&!this.options.fullScreen){$('body').on('click.zf.reveal',function(e){if(e.target===_this.$element[0]||$.contains(_this.$element[0],e.target)||!$.contains(document,e.target)){return;}_this.close();});}if(this.options.closeOnEsc){$(window).on('keydown.zf.reveal',function(e){Foundation.Keyboard.handleKey(e,'Reveal',{close:function close(){if(_this.options.closeOnEsc){_this.close();_this.$anchor.focus();}}});});}// lock focus within modal while tabbing
this.$element.on('keydown.zf.reveal',function(e){var $target=$(this);// handle keyboard event with keyboard util
Foundation.Keyboard.handleKey(e,'Reveal',{open:function open(){if(_this.$element.find(':focus').is(_this.$element.find('[data-close]'))){setTimeout(function(){// set focus back to anchor if close button has been activated
_this.$anchor.focus();},1);}else if($target.is(_this.focusableElements)){// dont't trigger if acual element has focus (i.e. inputs, links, ...)
_this.open();}},close:function close(){if(_this.options.closeOnEsc){_this.close();_this.$anchor.focus();}},handled:function handled(preventDefault){if(preventDefault){e.preventDefault();}}});});}/**
   * Closes the modal.
   * @function
   * @fires Reveal#closed
   */},{key:'close',value:function close(){if(!this.isActive||!this.$element.is(':visible')){return false;}var _this=this;// Motion UI method of hiding
if(this.options.animationOut){if(this.options.overlay){Foundation.Motion.animateOut(this.$overlay,'fade-out',finishUp);}else{finishUp();}Foundation.Motion.animateOut(this.$element,this.options.animationOut);}// jQuery method of hiding
else{this.$element.hide(this.options.hideDelay);if(this.options.overlay){this.$overlay.hide(0,finishUp);}else{finishUp();}}// Conditionals to remove extra event listeners added on open
if(this.options.closeOnEsc){$(window).off('keydown.zf.reveal');}if(!this.options.overlay&&this.options.closeOnClick){$('body').off('click.zf.reveal');}this.$element.off('keydown.zf.reveal');function finishUp(){if(_this.isMobile){if($('.reveal:visible').length===0){$('html, body').removeClass('is-reveal-open');}if(_this.originalScrollPos){$('body').scrollTop(_this.originalScrollPos);_this.originalScrollPos=null;}}else{if($('.reveal:visible').length===0){$('body').removeClass('is-reveal-open');}}Foundation.Keyboard.releaseFocus(_this.$element);_this.$element.attr('aria-hidden',true);/**
      * Fires when the modal is done closing.
      * @event Reveal#closed
      */_this.$element.trigger('closed.zf.reveal');}/**
    * Resets the modal content
    * This prevents a running video to keep going in the background
    */if(this.options.resetOnClose){this.$element.html(this.$element.html());}this.isActive=false;if(_this.options.deepLink){if(window.history.replaceState){window.history.replaceState('',document.title,window.location.href.replace('#'+this.id,''));}else{window.location.hash='';}}}/**
   * Toggles the open/closed state of a modal.
   * @function
   */},{key:'toggle',value:function toggle(){if(this.isActive){this.close();}else{this.open();}}},{key:'destroy',/**
   * Destroys an instance of a modal.
   * @function
   */value:function destroy(){if(this.options.overlay){this.$element.appendTo($(this.options.appendTo));// move $element outside of $overlay to prevent error unregisterPlugin()
this.$overlay.hide().off().remove();}this.$element.hide().off();this.$anchor.off('.zf');$(window).off('.zf.reveal:'+this.id);Foundation.unregisterPlugin(this);}}]);return Reveal;}();Reveal.defaults={/**
   * Motion-UI class to use for animated elements. If none used, defaults to simple show/hide.
   * @option
   * @type {string}
   * @default ''
   */animationIn:'',/**
   * Motion-UI class to use for animated elements. If none used, defaults to simple show/hide.
   * @option
   * @type {string}
   * @default ''
   */animationOut:'',/**
   * Time, in ms, to delay the opening of a modal after a click if no animation used.
   * @option
   * @type {number}
   * @default 0
   */showDelay:0,/**
   * Time, in ms, to delay the closing of a modal after a click if no animation used.
   * @option
   * @type {number}
   * @default 0
   */hideDelay:0,/**
   * Allows a click on the body/overlay to close the modal.
   * @option
   * @type {boolean}
   * @default true
   */closeOnClick:true,/**
   * Allows the modal to close if the user presses the `ESCAPE` key.
   * @option
   * @type {boolean}
   * @default true
   */closeOnEsc:true,/**
   * If true, allows multiple modals to be displayed at once.
   * @option
   * @type {boolean}
   * @default false
   */multipleOpened:false,/**
   * Distance, in pixels, the modal should push down from the top of the screen.
   * @option
   * @type {number|string}
   * @default auto
   */vOffset:'auto',/**
   * Distance, in pixels, the modal should push in from the side of the screen.
   * @option
   * @type {number|string}
   * @default auto
   */hOffset:'auto',/**
   * Allows the modal to be fullscreen, completely blocking out the rest of the view. JS checks for this as well.
   * @option
   * @type {boolean}
   * @default false
   */fullScreen:false,/**
   * Percentage of screen height the modal should push up from the bottom of the view.
   * @option
   * @type {number}
   * @default 10
   */btmOffsetPct:10,/**
   * Allows the modal to generate an overlay div, which will cover the view when modal opens.
   * @option
   * @type {boolean}
   * @default true
   */overlay:true,/**
   * Allows the modal to remove and reinject markup on close. Should be true if using video elements w/o using provider's api, otherwise, videos will continue to play in the background.
   * @option
   * @type {boolean}
   * @default false
   */resetOnClose:false,/**
   * Allows the modal to alter the url on open/close, and allows the use of the `back` button to close modals. ALSO, allows a modal to auto-maniacally open on page load IF the hash === the modal's user-set id.
   * @option
   * @type {boolean}
   * @default false
   */deepLink:false,/**
   * Allows the modal to append to custom div.
   * @option
   * @type {string}
   * @default "body"
   */appendTo:"body"};// Window exports
Foundation.plugin(Reveal,'Reveal');function iPhoneSniff(){return /iP(ad|hone|od).*OS/.test(window.navigator.userAgent);}function androidSniff(){return /Android/.test(window.navigator.userAgent);}function mobileSniff(){return iPhoneSniff()||androidSniff();}}(jQuery);
'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}!function($){/**
 * Slider module.
 * @module foundation.slider
 * @requires foundation.util.motion
 * @requires foundation.util.triggers
 * @requires foundation.util.keyboard
 * @requires foundation.util.touch
 */var Slider=function(){/**
   * Creates a new instance of a slider control.
   * @class
   * @param {jQuery} element - jQuery object to make into a slider control.
   * @param {Object} options - Overrides to the default plugin settings.
   */function Slider(element,options){_classCallCheck(this,Slider);this.$element=element;this.options=$.extend({},Slider.defaults,this.$element.data(),options);this._init();Foundation.registerPlugin(this,'Slider');Foundation.Keyboard.register('Slider',{'ltr':{'ARROW_RIGHT':'increase','ARROW_UP':'increase','ARROW_DOWN':'decrease','ARROW_LEFT':'decrease','SHIFT_ARROW_RIGHT':'increase_fast','SHIFT_ARROW_UP':'increase_fast','SHIFT_ARROW_DOWN':'decrease_fast','SHIFT_ARROW_LEFT':'decrease_fast'},'rtl':{'ARROW_LEFT':'increase','ARROW_RIGHT':'decrease','SHIFT_ARROW_LEFT':'increase_fast','SHIFT_ARROW_RIGHT':'decrease_fast'}});}/**
   * Initilizes the plugin by reading/setting attributes, creating collections and setting the initial position of the handle(s).
   * @function
   * @private
   */_createClass(Slider,[{key:'_init',value:function _init(){this.inputs=this.$element.find('input');this.handles=this.$element.find('[data-slider-handle]');this.$handle=this.handles.eq(0);this.$input=this.inputs.length?this.inputs.eq(0):$('#'+this.$handle.attr('aria-controls'));this.$fill=this.$element.find('[data-slider-fill]').css(this.options.vertical?'height':'width',0);var isDbl=false,_this=this;if(this.options.disabled||this.$element.hasClass(this.options.disabledClass)){this.options.disabled=true;this.$element.addClass(this.options.disabledClass);}if(!this.inputs.length){this.inputs=$().add(this.$input);this.options.binding=true;}this._setInitAttr(0);if(this.handles[1]){this.options.doubleSided=true;this.$handle2=this.handles.eq(1);this.$input2=this.inputs.length>1?this.inputs.eq(1):$('#'+this.$handle2.attr('aria-controls'));if(!this.inputs[1]){this.inputs=this.inputs.add(this.$input2);}isDbl=true;// this.$handle.triggerHandler('click.zf.slider');
this._setInitAttr(1);}// Set handle positions
this.setHandles();this._events();}},{key:'setHandles',value:function setHandles(){var _this2=this;if(this.handles[1]){this._setHandlePos(this.$handle,this.inputs.eq(0).val(),true,function(){_this2._setHandlePos(_this2.$handle2,_this2.inputs.eq(1).val(),true);});}else{this._setHandlePos(this.$handle,this.inputs.eq(0).val(),true);}}},{key:'_reflow',value:function _reflow(){this.setHandles();}/**
  * @function
  * @private
  * @param {Number} value - floating point (the value) to be transformed using to a relative position on the slider (the inverse of _value)
  */},{key:'_pctOfBar',value:function _pctOfBar(value){var pctOfBar=percent(value-this.options.start,this.options.end-this.options.start);switch(this.options.positionValueFunction){case"pow":pctOfBar=this._logTransform(pctOfBar);break;case"log":pctOfBar=this._powTransform(pctOfBar);break;}return pctOfBar.toFixed(2);}/**
  * @function
  * @private
  * @param {Number} pctOfBar - floating point, the relative position of the slider (typically between 0-1) to be transformed to a value
  */},{key:'_value',value:function _value(pctOfBar){switch(this.options.positionValueFunction){case"pow":pctOfBar=this._powTransform(pctOfBar);break;case"log":pctOfBar=this._logTransform(pctOfBar);break;}var value=(this.options.end-this.options.start)*pctOfBar+this.options.start;return value;}/**
  * @function
  * @private
  * @param {Number} value - floating point (typically between 0-1) to be transformed using the log function
  */},{key:'_logTransform',value:function _logTransform(value){return baseLog(this.options.nonLinearBase,value*(this.options.nonLinearBase-1)+1);}/**
  * @function
  * @private
  * @param {Number} value - floating point (typically between 0-1) to be transformed using the power function
  */},{key:'_powTransform',value:function _powTransform(value){return(Math.pow(this.options.nonLinearBase,value)-1)/(this.options.nonLinearBase-1);}/**
   * Sets the position of the selected handle and fill bar.
   * @function
   * @private
   * @param {jQuery} $hndl - the selected handle to move.
   * @param {Number} location - floating point between the start and end values of the slider bar.
   * @param {Function} cb - callback function to fire on completion.
   * @fires Slider#moved
   * @fires Slider#changed
   */},{key:'_setHandlePos',value:function _setHandlePos($hndl,location,noInvert,cb){// don't move if the slider has been disabled since its initialization
if(this.$element.hasClass(this.options.disabledClass)){return;}//might need to alter that slightly for bars that will have odd number selections.
location=parseFloat(location);//on input change events, convert string to number...grumble.
// prevent slider from running out of bounds, if value exceeds the limits set through options, override the value to min/max
if(location<this.options.start){location=this.options.start;}else if(location>this.options.end){location=this.options.end;}var isDbl=this.options.doubleSided;if(isDbl){//this block is to prevent 2 handles from crossing eachother. Could/should be improved.
if(this.handles.index($hndl)===0){var h2Val=parseFloat(this.$handle2.attr('aria-valuenow'));location=location>=h2Val?h2Val-this.options.step:location;}else{var h1Val=parseFloat(this.$handle.attr('aria-valuenow'));location=location<=h1Val?h1Val+this.options.step:location;}}//this is for single-handled vertical sliders, it adjusts the value to account for the slider being "upside-down"
//for click and drag events, it's weird due to the scale(-1, 1) css property
if(this.options.vertical&&!noInvert){location=this.options.end-location;}var _this=this,vert=this.options.vertical,hOrW=vert?'height':'width',lOrT=vert?'top':'left',handleDim=$hndl[0].getBoundingClientRect()[hOrW],elemDim=this.$element[0].getBoundingClientRect()[hOrW],//percentage of bar min/max value based on click or drag point
pctOfBar=this._pctOfBar(location),//number of actual pixels to shift the handle, based on the percentage obtained above
pxToMove=(elemDim-handleDim)*pctOfBar,//percentage of bar to shift the handle
movement=(percent(pxToMove,elemDim)*100).toFixed(this.options.decimal);//fixing the decimal value for the location number, is passed to other methods as a fixed floating-point value
location=parseFloat(location.toFixed(this.options.decimal));// declare empty object for css adjustments, only used with 2 handled-sliders
var css={};this._setValues($hndl,location);// TODO update to calculate based on values set to respective inputs??
if(isDbl){var isLeftHndl=this.handles.index($hndl)===0,//empty variable, will be used for min-height/width for fill bar
dim,//percentage w/h of the handle compared to the slider bar
handlePct=~~(percent(handleDim,elemDim)*100);//if left handle, the math is slightly different than if it's the right handle, and the left/top property needs to be changed for the fill bar
if(isLeftHndl){//left or top percentage value to apply to the fill bar.
css[lOrT]=movement+'%';//calculate the new min-height/width for the fill bar.
dim=parseFloat(this.$handle2[0].style[lOrT])-movement+handlePct;//this callback is necessary to prevent errors and allow the proper placement and initialization of a 2-handled slider
//plus, it means we don't care if 'dim' isNaN on init, it won't be in the future.
if(cb&&typeof cb==='function'){cb();}//this is only needed for the initialization of 2 handled sliders
}else{//just caching the value of the left/bottom handle's left/top property
var handlePos=parseFloat(this.$handle[0].style[lOrT]);//calculate the new min-height/width for the fill bar. Use isNaN to prevent false positives for numbers <= 0
//based on the percentage of movement of the handle being manipulated, less the opposing handle's left/top position, plus the percentage w/h of the handle itself
dim=movement-(isNaN(handlePos)?(this.options.initialStart-this.options.start)/((this.options.end-this.options.start)/100):handlePos)+handlePct;}// assign the min-height/width to our css object
css['min-'+hOrW]=dim+'%';}this.$element.one('finished.zf.animate',function(){/**
                     * Fires when the handle is done moving.
                     * @event Slider#moved
                     */_this.$element.trigger('moved.zf.slider',[$hndl]);});//because we don't know exactly how the handle will be moved, check the amount of time it should take to move.
var moveTime=this.$element.data('dragging')?1000/60:this.options.moveTime;Foundation.Move(moveTime,$hndl,function(){// adjusting the left/top property of the handle, based on the percentage calculated above
// if movement isNaN, that is because the slider is hidden and we cannot determine handle width,
// fall back to next best guess.
if(isNaN(movement)){$hndl.css(lOrT,pctOfBar*100+'%');}else{$hndl.css(lOrT,movement+'%');}if(!_this.options.doubleSided){//if single-handled, a simple method to expand the fill bar
_this.$fill.css(hOrW,pctOfBar*100+'%');}else{//otherwise, use the css object we created above
_this.$fill.css(css);}});/**
     * Fires when the value has not been change for a given time.
     * @event Slider#changed
     */clearTimeout(_this.timeout);_this.timeout=setTimeout(function(){_this.$element.trigger('changed.zf.slider',[$hndl]);},_this.options.changedDelay);}/**
   * Sets the initial attribute for the slider element.
   * @function
   * @private
   * @param {Number} idx - index of the current handle/input to use.
   */},{key:'_setInitAttr',value:function _setInitAttr(idx){var initVal=idx===0?this.options.initialStart:this.options.initialEnd;var id=this.inputs.eq(idx).attr('id')||Foundation.GetYoDigits(6,'slider');this.inputs.eq(idx).attr({'id':id,'max':this.options.end,'min':this.options.start,'step':this.options.step});this.inputs.eq(idx).val(initVal);this.handles.eq(idx).attr({'role':'slider','aria-controls':id,'aria-valuemax':this.options.end,'aria-valuemin':this.options.start,'aria-valuenow':initVal,'aria-orientation':this.options.vertical?'vertical':'horizontal','tabindex':0});}/**
   * Sets the input and `aria-valuenow` values for the slider element.
   * @function
   * @private
   * @param {jQuery} $handle - the currently selected handle.
   * @param {Number} val - floating point of the new value.
   */},{key:'_setValues',value:function _setValues($handle,val){var idx=this.options.doubleSided?this.handles.index($handle):0;this.inputs.eq(idx).val(val);$handle.attr('aria-valuenow',val);}/**
   * Handles events on the slider element.
   * Calculates the new location of the current handle.
   * If there are two handles and the bar was clicked, it determines which handle to move.
   * @function
   * @private
   * @param {Object} e - the `event` object passed from the listener.
   * @param {jQuery} $handle - the current handle to calculate for, if selected.
   * @param {Number} val - floating point number for the new value of the slider.
   * TODO clean this up, there's a lot of repeated code between this and the _setHandlePos fn.
   */},{key:'_handleEvent',value:function _handleEvent(e,$handle,val){var value,hasVal;if(!val){//click or drag events
e.preventDefault();var _this=this,vertical=this.options.vertical,param=vertical?'height':'width',direction=vertical?'top':'left',eventOffset=vertical?e.pageY:e.pageX,halfOfHandle=this.$handle[0].getBoundingClientRect()[param]/2,barDim=this.$element[0].getBoundingClientRect()[param],windowScroll=vertical?$(window).scrollTop():$(window).scrollLeft();var elemOffset=this.$element.offset()[direction];// touch events emulated by the touch util give position relative to screen, add window.scroll to event coordinates...
// best way to guess this is simulated is if clientY == pageY
if(e.clientY===e.pageY){eventOffset=eventOffset+windowScroll;}var eventFromBar=eventOffset-elemOffset;var barXY;if(eventFromBar<0){barXY=0;}else if(eventFromBar>barDim){barXY=barDim;}else{barXY=eventFromBar;}var offsetPct=percent(barXY,barDim);value=this._value(offsetPct);// turn everything around for RTL, yay math!
if(Foundation.rtl()&&!this.options.vertical){value=this.options.end-value;}value=_this._adjustValue(null,value);//boolean flag for the setHandlePos fn, specifically for vertical sliders
hasVal=false;if(!$handle){//figure out which handle it is, pass it to the next function.
var firstHndlPos=absPosition(this.$handle,direction,barXY,param),secndHndlPos=absPosition(this.$handle2,direction,barXY,param);$handle=firstHndlPos<=secndHndlPos?this.$handle:this.$handle2;}}else{//change event on input
value=this._adjustValue(null,val);hasVal=true;}this._setHandlePos($handle,value,hasVal);}/**
   * Adjustes value for handle in regard to step value. returns adjusted value
   * @function
   * @private
   * @param {jQuery} $handle - the selected handle.
   * @param {Number} value - value to adjust. used if $handle is falsy
   */},{key:'_adjustValue',value:function _adjustValue($handle,value){var val,step=this.options.step,div=parseFloat(step/2),left,prev_val,next_val;if(!!$handle){val=parseFloat($handle.attr('aria-valuenow'));}else{val=value;}left=val%step;prev_val=val-left;next_val=prev_val+step;if(left===0){return val;}val=val>=prev_val+div?next_val:prev_val;return val;}/**
   * Adds event listeners to the slider elements.
   * @function
   * @private
   */},{key:'_events',value:function _events(){this._eventsForHandle(this.$handle);if(this.handles[1]){this._eventsForHandle(this.$handle2);}}/**
   * Adds event listeners a particular handle
   * @function
   * @private
   * @param {jQuery} $handle - the current handle to apply listeners to.
   */},{key:'_eventsForHandle',value:function _eventsForHandle($handle){var _this=this,curHandle,timer;this.inputs.off('change.zf.slider').on('change.zf.slider',function(e){var idx=_this.inputs.index($(this));_this._handleEvent(e,_this.handles.eq(idx),$(this).val());});if(this.options.clickSelect){this.$element.off('click.zf.slider').on('click.zf.slider',function(e){if(_this.$element.data('dragging')){return false;}if(!$(e.target).is('[data-slider-handle]')){if(_this.options.doubleSided){_this._handleEvent(e);}else{_this._handleEvent(e,_this.$handle);}}});}if(this.options.draggable){this.handles.addTouch();var $body=$('body');$handle.off('mousedown.zf.slider').on('mousedown.zf.slider',function(e){$handle.addClass('is-dragging');_this.$fill.addClass('is-dragging');//
_this.$element.data('dragging',true);curHandle=$(e.currentTarget);$body.on('mousemove.zf.slider',function(e){e.preventDefault();_this._handleEvent(e,curHandle);}).on('mouseup.zf.slider',function(e){_this._handleEvent(e,curHandle);$handle.removeClass('is-dragging');_this.$fill.removeClass('is-dragging');_this.$element.data('dragging',false);$body.off('mousemove.zf.slider mouseup.zf.slider');});})// prevent events triggered by touch
.on('selectstart.zf.slider touchmove.zf.slider',function(e){e.preventDefault();});}$handle.off('keydown.zf.slider').on('keydown.zf.slider',function(e){var _$handle=$(this),idx=_this.options.doubleSided?_this.handles.index(_$handle):0,oldValue=parseFloat(_this.inputs.eq(idx).val()),newValue;// handle keyboard event with keyboard util
Foundation.Keyboard.handleKey(e,'Slider',{decrease:function decrease(){newValue=oldValue-_this.options.step;},increase:function increase(){newValue=oldValue+_this.options.step;},decrease_fast:function decrease_fast(){newValue=oldValue-_this.options.step*10;},increase_fast:function increase_fast(){newValue=oldValue+_this.options.step*10;},handled:function handled(){// only set handle pos when event was handled specially
e.preventDefault();_this._setHandlePos(_$handle,newValue,true);}});/*if (newValue) { // if pressed key has special function, update value
        e.preventDefault();
        _this._setHandlePos(_$handle, newValue);
      }*/});}/**
   * Destroys the slider plugin.
   */},{key:'destroy',value:function destroy(){this.handles.off('.zf.slider');this.inputs.off('.zf.slider');this.$element.off('.zf.slider');clearTimeout(this.timeout);Foundation.unregisterPlugin(this);}}]);return Slider;}();Slider.defaults={/**
   * Minimum value for the slider scale.
   * @option
   * @type {number}
   * @default 0
   */start:0,/**
   * Maximum value for the slider scale.
   * @option
   * @type {number}
   * @default 100
   */end:100,/**
   * Minimum value change per change event.
   * @option
   * @type {number}
   * @default 1
   */step:1,/**
   * Value at which the handle/input *(left handle/first input)* should be set to on initialization.
   * @option
   * @type {number}
   * @default 0
   */initialStart:0,/**
   * Value at which the right handle/second input should be set to on initialization.
   * @option
   * @type {number}
   * @default 100
   */initialEnd:100,/**
   * Allows the input to be located outside the container and visible. Set to by the JS
   * @option
   * @type {boolean}
   * @default false
   */binding:false,/**
   * Allows the user to click/tap on the slider bar to select a value.
   * @option
   * @type {boolean}
   * @default true
   */clickSelect:true,/**
   * Set to true and use the `vertical` class to change alignment to vertical.
   * @option
   * @type {boolean}
   * @default false
   */vertical:false,/**
   * Allows the user to drag the slider handle(s) to select a value.
   * @option
   * @type {boolean}
   * @default true
   */draggable:true,/**
   * Disables the slider and prevents event listeners from being applied. Double checked by JS with `disabledClass`.
   * @option
   * @type {boolean}
   * @default false
   */disabled:false,/**
   * Allows the use of two handles. Double checked by the JS. Changes some logic handling.
   * @option
   * @type {boolean}
   * @default false
   */doubleSided:false,/**
   * Potential future feature.
   */// steps: 100,
/**
   * Number of decimal places the plugin should go to for floating point precision.
   * @option
   * @type {number}
   * @default 2
   */decimal:2,/**
   * Time delay for dragged elements.
   */// dragDelay: 0,
/**
   * Time, in ms, to animate the movement of a slider handle if user clicks/taps on the bar. Needs to be manually set if updating the transition time in the Sass settings.
   * @option
   * @type {number}
   * @default 200
   */moveTime:200,//update this if changing the transition time in the sass
/**
   * Class applied to disabled sliders.
   * @option
   * @type {string}
   * @default 'disabled'
   */disabledClass:'disabled',/**
   * Will invert the default layout for a vertical<span data-tooltip title="who would do this???"> </span>slider.
   * @option
   * @type {boolean}
   * @default false
   */invertVertical:false,/**
   * Milliseconds before the `changed.zf-slider` event is triggered after value change.
   * @option
   * @type {number}
   * @default 500
   */changedDelay:500,/**
  * Basevalue for non-linear sliders
  * @option
  * @type {number}
  * @default 5
  */nonLinearBase:5,/**
  * Basevalue for non-linear sliders, possible values are: `'linear'`, `'pow'` & `'log'`. Pow and Log use the nonLinearBase setting.
  * @option
  * @type {string}
  * @default 'linear'
  */positionValueFunction:'linear'};function percent(frac,num){return frac/num;}function absPosition($handle,dir,clickPos,param){return Math.abs($handle.position()[dir]+$handle[param]()/2-clickPos);}function baseLog(base,value){return Math.log(value)/Math.log(base);}// Window exports
Foundation.plugin(Slider,'Slider');}(jQuery);