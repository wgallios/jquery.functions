
/**
* Author: William Gallios

The MIT License (MIT)

Copyright (c) 2014 William Gallios

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

var rjs = [];
var rcss = [];

//var rjsLoading = false;
var noredirect = true;

var hashStartDelimiter = '!';
var hashDelimiter = '|';


// object that checks for plugins
var plugins = {};

plugins.number = (jQuery().number) ? true : false;
plugins.velocity = (jQuery().velocity) ? true : false;

;(function($){
	'use strict';
	
	// jquery function to check if element exists;
	$.fn.exists = function ()
	{
		return this.length > 0; 
	}
	
	
	
	// gets all scripts in page
	$.getLoadedScripts = function ()
	{
		var scripts = [];
		var $this = $(this);

		$('script').each(function(index, s){
			var src = $(s).attr('src');
			
			if (src == undefined)
			{
				// hard coded JS	
			}
			else
			{
				scripts.push(src);
			}
		});
		
		return scripts;
	}
	

	
	
	// returns an object array of all css files in HEAD
	$.getLoadedCSS = function ()
	{
		var cssFiles = [];
		
		$('link').each(function(index, s){
			var src = $(s).attr('href');
			
			if (src !== undefined)
			{
				if (src.toLowerCase().indexOf('.css'))
				{
					cssFiles.push(this);
				}
			}
		});
		
		return cssFiles;
	}

	$.loadCSSScripts = function (files)
	{
		
		var self = this;
		
		$(files).each(function(i, s){
		
			if (s == undefined) return false;
			
			var ext = getFileExt(s);
				
			var loaded = $.checkCSSLoaded(s);
			
			// removes element from array if already loaded
			if (loaded) delete files[i];
			else
			{
				if (ext == 'CSS') $.loadCSS(s);
				else if (ext == 'LESS') $.loadLess(s);
				rcss.push(s);
			}
		});
	}

	// unloads a CSS Script
	$.unloadCSS = function (href)
	{
		if (href == undefined) throw new Error("CSS href is undefined!");
		
		var scripts = $.getLoadedCSS();
		
		var removed = false;
		
		for (var i = 0; i < scripts.length; i++)
		{
			if ($(scripts[i]).attr('href').indexOf(href) > 0)
			{
				$(scripts[i]).remove();
				removed = true;
				break;
			}
		}
		
		if (removed) return true;
		
		return false;
	}

	// loads a CSS file into the <head>
	$.loadCSS = function (href, min, cache)
	{
		if (min == undefined) min = false;
		if (cache == undefined) cache = true;
		
		if (min) href = $.min(href);
	
		if (href == undefined) throw new Error("CSS href is undefined!");
		
		var script = $("<link/>",{
			rel: "stylesheet",
			type: "text/css",
			href: href
			});

		script.appendTo("head");
		
		return script;
	}
	
	// loads less file into head
	$.loadLess = function (href)
	{
		if (href == undefined) throw new Error("Less href is undefined!");
		
		var script = $("<link/>",{
			rel: "stylesheet/less",
			href: href
			});

		script.appendTo("head");
		
		less.sheets.push($('link[href="' + href + '"]')[0]);
		less.refresh();
		
		return script;	
	}

	$.docUrl = function (file, selector, srcTag)
	{
		if (selector == undefined) selector = 'script';
		if (srcTag == undefined) srcTag = 'src';
		
		var docurl = '';
		
		var s = $('head').find('script');
		
		$(s).each(function(i, s){
				var $s = $(s);

				var src = $s.attr(srcTag);
				
				if (src == undefined) return false;

	            if (src.indexOf(file) >= 0 )
	            {
	                docurl = src.substring(0, src.indexOf(file));

	                return true;
	            }
	            
		});
		
		if (docurl == '') return false;
		
		return docurl;
	
	}

	/**
	* gets srcs attritubute from a string
	* 
	*/
	$.fn.getSrcs = function ($tag)
	{
		var srcs = [];
		
		var src;
		
		$(this).each(function(index, s){
			if ($(s).prop('tagName') == 'SCRIPT')
			{
				src = $(s).attr('src');
				
				if (src !== undefined) srcs.push(src);
			}	
		});

		return srcs;		
	}
	
	//.$.loadJSSrcs.files = [];
	
	$.fn.loadedJS = new Object();
	$.fn.loadedJS.files = [];
	
	// takes an element and loads all 
	$.fn.loadJSSrcs = function (successFunction, errorFunction)
	{
		var this_ = this;
		var $this = $(this);
		
		
		var scripts = [];
		
		$(this).each(function(index, url){

			try
			{

				//$.log((new Error).lineNumber);
				//throw new Error(this);
				if (url == undefined) throw new Error("no URL");
				
				$.loadJS(url, successFunction, errorFunction);
				
				$.fn.loadedJS.files.push(url);
				scripts.push(url);
			}
			catch (e)
			{
				//this_.log(e.message);
				return false;
			}

		});
		
		return true;
			
	}
	
	$.loadJS = function (url, successFunction, errorFunction)
	{
		$.ajax({
			url: url,
			dataType: 'script',
			success: function (data, textStatus, jqxhr)
			{
				if (successFunction !== undefined && successFunction == 'function') successFunction(data, textStatus, jqxhr);

			},
			error: function (xhr, ajaxOptions, thrownError)
			{
				$.log("Unable to fetch Javascript file: " + url + " [" + thrownError + "]");
				
				if (errorFunction !== undefined && errorFunction == 'function') errorFunction(xhr, ajaxOptions, thrownError);
			}
		});
		
		return url;
	}
	
	$.fn.loadJSSrcs.unload = function ()
	{	
		clog('unloading');
		
		// delete object.name
	}
	
	// function used for logging
	$.log = $.fn.log = function (msg, stringify, type, stackTrace)
	{
		if (type == undefined) type = 'log';
		if (stringify == undefined) stringify = false;
		if (stackTrace == undefined) stackTrace = false;
		
		if (console)
		{
			if (stringify) msg = JSON.stingify(msg);
			
			if (type == 'warn') console.warn(msg);
			if (type == 'error') console.error(msg);
			else console.log(msg);
			
			if (typeof this == 'object')
			{
				console.dir(this);
			}
						
			if (stackTrace) window.console && console.log((new Error()).stack);
		
			return true;
		}
		
		return false;
	}
	
	// redraws element to freshs its layout
	$.fn.redraw = function()
	{
		$(this).each(function(index, el){
			this.offsetHeight;
		});
	};
	
	$.isJS = function (src)
	{
		var ext = $._getFileExt(src);

		if (ext == 'JS') return true;
		
		return false;
	}
	
	$.getFileExt = $.fn.getFileExt = function (file)
	{
		if (typeof file == 'string')
		{
			return $._getFileExt(file);
		}
		else
		{
			//$.log(typeof file);
		}
	}
	
	// private function that extracts the ext from a string
	$._getFileExt = function (fileString)
	{
		if (typeof fileString !== 'string') throw new Error("file name is not a string!");
		
		     	
        var ld = fileString.lastIndexOf('.');

		var ext = fileString.substr((ld + 1), (fileString.length - ld));

		if (ext.indexOf('?') > 0)
		{
			ext = ext.substr(0, ext.indexOf('?'));	
		}
		
		if (ext.indexOf('&') > 0)
		{
			ext = ext.substr(0, ext.indexOf('&'));	
		}
		
		ext = ext.toUpperCase();


		return ext;

	}
	
	$.min = function (src, method)
	{
		if (method == undefined) method = 'f';
		///min/?{$method}={$path}{$name}{$debug}{$version}
		
		var minv = $('head').data('minv');
		var mindebug = $('head').data('mindebug');
		
		src = "/min/?" + method +"=" + src;
		
		if (minv !== undefined) src += "&" + minv;
		if (mindebug !== undefined) src += '&debug';
		
		return src;
	}

	
	$.requireJS = function (files, cb)
	{
		var jsToLoad = [];
		
		var self = this;
		$(files).each(function(i, s){
			var loaded = $.checkJSLoaded(s);
			
			// removes element from array if already loaded
			if (loaded) delete files[i];
			else
			{
				jsToLoad.push(s);
				rjs.push(s);
			}
		});
		

		if (jsToLoad.length > 0 )
		{
			require(jsToLoad, function(data){
				if (cb !== undefined && typeof cb == 'function') cb(data);
			});
		}
		else
		{
			if (cb !== undefined && typeof cb == 'function') cb();
		}
		/*
		$.when(
			$.Deferred(function(){
			
				var self = this;
			
				$(files).each(function(i, s){
					var loaded = $.checkJSLoaded(s);
					
					// removes element from array if already loaded
					if (loaded) delete files[i];
					else rjs.push(s);
				});
			
				
				require(files, function(data){
					self.resolve();
				});
			//rJS(files);
		}))
		.done(function(){
			var d = new Date();
			
			if (cb !== undefined && typeof cb == 'function') cb();
		});
		*/		

	}
	
	$._requireJS = function (files)
	{

		
		$(files).each(function(i, s){
			var loaded = $.checkJSLoaded(s);
			
			// removes element from array if already loaded
			if (loaded) delete files[i];
			else rjs.push(s);
		});
	
		//rjsLoading = true;
	
		//global.log(files);
		require(files, function(data){
			//rjsLoading = false;
			
			//d.resolve(data);
			
			//if (cb !== undefined && typeof cb == 'function') cb(data, files);
			
			return true;
		});
		
		//return d.promise();
	}
	
	$.getLoadedJSFiles = function ()
	{
		return rjs;
	}
	
	// checks if the src is in the loaded JS array
	// from $.requireJS
	$.checkJSLoaded = function (src)
	{
		var loaded = false;
		
		var check = jQuery.inArray(src, rjs);
		

		if (check > -1) return true;
		else return false;
	}
	
	$.checkCSSLoaded = function (src)
	{
		var loaded = false;
		
		var check = jQuery.inArray(src, rcss);
		
		if (check > -1) return true;
		else return false;
	}
	

	$.fn.disableSpin = function (options)
	{
		var ds = $(this).data('disableSpin');
		
		if (ds !== undefined && ds == true) return false; // stops button from being called twice with function
	
		if (options == undefined) options = {};
	
		var defaults = 
		{
			disable: true,
			spinClass: 'fa fa-spin fa-spinner'
		}
		
		$(this).data('disableSpin', true)
		
		options = $.extend(true, {}, defaults, options);

		//console.log(options);

		var oVal = $(this).val();
			

		if (options.disable == true)
		{
			$(this).attr('disabled', 'disabled');
		}
		
		var $i = $(this).find('i');
		
		if ($i == undefined)
		{
			$(this).data('i', false);
			$(this).data('oVal', oVal);
			
			$i = $("<i>", { class: options.spinClass });
			
			$(this).prepend($i + ' ');
		}
		else
		{
			
			var oClass = $i.attr('class');
		
			$(this).data('i', true);
			$(this).data('oClass', oClass); // saves original class data for restoration later
			
			
			$i.attr('class', options.spinClass ); // removes classes
		}

		return true;
		
	}
	
	$.fn.enableSpin = function ()
	{
		var ds = $(this).data('disableSpin');
		
		// ensures element has gone through disableSpin function first
		if (ds == undefined || ds == false) return false;
		
		// checks if disabled, if so, enables btn
		if ($(this).attr('disabled') == 'disabled')
		{
			$(this).removeAttr('disabled');
		}
		
		var hadI = $(this).data('i');
		
		if (hadI)
		{
			var oClass = $(this).data('oClass');
			
			// restores original class
			$(this).find('i').attr('class', oClass);
		}
		else
		{
			// removes <i> element
			$(this).find('i').remove();
			
			var oVal = $(this).data('oVal');

			// restores original value			
			$(this).val(oVal);
		}
		
		$(this).removeData(['disableSpin', 'i', 'oClass', 'oVal']);
		
		return true;
	}

	
	$.fn.location = $.fn.location = function (url)
	{
		var this_ = this;
		
		window.noredirect = false;
				
		$(window).trigger('jquery.redirect', [url]);

		return true;
	}

	/**
	* sets a hash variable hashSetVar('x', 123) would be #?x=123
	*/
	$.hashSetVar = function (k, v)
	{
		var hash = getHash();
		
		v = encodeURI(v); // url encodes value
		
		var qio = hash.indexOf(hashStartDelimiter);
			
		var set = $.hashSet(k);
		
		if (set)
		{
			$.hashUnsetVar(k);
			
			$.hashSetVar(k, v);
			
			return true;
		}
		
		if (hash == undefined || hash.length <= 0) window.location.hash = hashStartDelimiter + k + '=' + v;
		if (qio < 0) window.location.hash = hash  + hashStartDelimiter + k + '=' + v;
		else window.location.hash = hash + hashDelimiter + k + '=' + v;
		
		return true;
	}
	
	/**
	* privatish function to check if a has var isset
	*/
	$.hashSet = function (k)
	{

		var data = $.getHashVars();
		var set = false;

		$.each(data, function(key, val){
			
			if (key == k)
			{
				set = true;
				return true;
			}
		});

		if (set) return true;

		return false;
	}
	

	/**
	* unsets a hash variable after ?
	*/
	$.hashUnsetVar = function (k)
	{
		var data = $.getHashVars();
			
		var hash = window.location.hash;
		
		hash = hash.substring(1);
				
		if (hash == undefined || hash.length < 1) return true;
				
		var qio = hash.indexOf(hashStartDelimiter);
		var pre = hash.substring(0, qio); // hash data before variables incase its set

		
		window.location.hash = pre;

		$.each(data, function(key, val){
			
			if (key !== k)
			{
				$.hashSetVar(key, val);
			}
		});
		
		
		return true;
	}
	
	/**
	* gets a hash variable value #?x=123 would return Int 123
	*/
	$.hashVal = function (k)
	{
		var data = $.getHashVars();
		var v;
		
		$.each(data, function(key, val){
			
			if (key == k)
			{
				v = val;
				return true;
			}
		});
		
		v = decodeURI(v); // decodes value
		
		return v;
	}
	
	/**
	* gets all hash variables after ?
	*/
	$.getHashVars = function ()
	{
		var hash = window.location.hash;
		
		if (hash == undefined || hash.length < 1) return false;
		
		hash = hash.substring(1);
		
		var qio = hash.indexOf(hashStartDelimiter);
		
		hash = hash.substring(qio + 1);
		
				
		var vars = hash.split(hashDelimiter);
		
		var data = {};
		
		for (var i = 0; i < vars.length; i++)
		{
			var eio = vars[i].indexOf('=');
			
			if (eio > 0)
			{
				var key = vars[i].substr(0, eio);
				var val = vars[i].substring(eio + 1);
			
				val = decodeURI(val);
				
				val = parse(val);
				
				data[key] = val;
			}		
		}
		
		return data;
	}
	
	/**
	* gets the inverted color of the input color
	*/
	$.inverseColor = function (c)
	{
	    var color = c;
	    
	    color = color.substring(1);
	    color = parseInt(color, 16);
	    color = 0xFFFFFF ^ color;
	    color = color.toString(16);
	    color = ("000000" + color).slice(-6);
	    color = "#" + color;
	    
	    return color;
	}

	/**
	* affix item to page when scrolling past it
	*/
	$.fn.affixTop = function (top, options)
	{
		if (top == undefined) top = 0;
		
		var t = this;

		if (options == undefined) options = {};
	
		var defaults = 
		{
			marginTop: 0,
			marginLeft: 0,
			marginBottom: 0,
			marginRight: 0
		}
		
				
		options = $.extend(true, {}, defaults, options);
	
		var w = $(t).outerWidth();	

		var oT = $(t).offset().top;
			
		var orgPos = $(t).css('position');
		var orgTop = $(t).css('top');

		var mt = $(t).css('margin-top');
		var ml = $(t).css('margin-left');
		var mb = $(t).css('margin-bottom');		
		var mr = $(t).css('margin-right');
		
		// starts tracking scroll
		
		$(window).scroll(function(){
			// gets elements offset from top			
			
			var st = $(this).scrollTop();
						
			if ((st + top) >= oT)
			{
				if (!$(t).hasClass('affix'))
				{	
					$(t).addClass('affix')
						.css('width', w)
						.css('position', 'fixed')
						.css('margin-top', options.marginTop)
						.css('margin-left', options.marginLeft)
						.css('margin-bottom', options.marginBottom)
						.css('margin-right', options.marginRight)
						.css('top', top);
				}
			}
			else
			{
				if ($(t).hasClass('affix'))
				{
					$(t).removeClass('affix')
						.css('width', '')
						.css('position', orgPos)
						.css('margin-top', mt)
						.css('margin-left', ml)
						.css('margin-bottom', mb)
						.css('margin-right', mr)
						.css('top', '');
				}
			}
		});
		
		return true;
	}
	
	/**
	* goes through a div and checks all required fields
	*/
	$.fn.validateForm = function ()
	{
		var valid = true;
		
		var t = this;
		
		$(t).clearInputWarnings();
		
		$(t).find("[required='']").each(function(index, el){
			var $el = $(el);
			var msg = $el.data('msg');
			
			if ($el.prop('tagName') == 'INPUT')
			{
				if ($el.attr('type').toUpperCase() == 'TEXT' || $el.attr('type').toUpperCase() == 'PASSWORD')
				{
					if ($el.val() == '')
					{
						valid = false;
						
						if (msg !== undefined) Warning(msg);
						
						$el.focus();
						$el.inputWarn();
						
						return false;	
					}
				}
			}
		});
		
		
		return valid;
	}
	
	$.fn.clearInputWarnings = function ()
	{
		$(this).find('.form-group').removeClass('has-warning');
		
		return true;
	}
	
	$.fn.inputWarn = function ()
	{
		var t = this;
		
		var formGroup = $(this).parent().parent('.form-group');
		
		if (formGroup == undefined) return false;
		
		$(formGroup).addClass('has-warning');
		
		return true;
	}
	
	/**
	* binds an event function however triggers to catch the event
	*/
	$.fn.bindEvent = function (ev, eventFunction)
	{
		var t = this;

		$(t).trigger('bind.event.prefire', ev);	

		$(t).on(ev, function (event){
			$(t).trigger('bind.event.prefunction', event);	
			
			if (eventFunction !== undefined && typeof eventFunction == 'function') eventFunction(event);

			$(t).trigger('bind.event.postfunction', event);
		});
		
		
		return true;
	}
	
	/**
	* dot dot dot. ands dots to an element on a set interval
	* Exampe:
	*	Loading .
	*	Loading ..
	*	Loading ...
	*/
	$.fn.ddd = function (options)
	{
		var t = this;
		
		if (options == undefined) options = {};
	
		var defaults = 
		{
			duration: 200,
			speed: 400,
			dots:5
		}
		
				
		options = $.extend(true, {}, defaults, options);
		
		var $span = $("<span>", { id:'ddd', style:"display:none; opacity:0;" });
		
		if (velocity) $span.velocity('fadeIn', { duration:options.duration });
		else $span.fadeIn(options.duration);
		
		$(t).append($span);
		
		var dInterval = setInterval(function(){
			var txt = $span.text();
			
			if (txt.length >= options.dots) $span.text('');
			else $span.text(txt + '.');
			
		}, options.speed);
		
		
		$.fn.ddd.clear = function ()
		{
			clearInterval(dInterval);
			
			if (velocity) 
			{	
				$span.velocity('fadeIn', { 
					duration: 400, 
					complete: function ()
					{
						$span.remove();
					}	
				});
			}
			else
			{
				$span.fadeIn(options.duration, function(){
					$span.remove();
				});
			}
		}
	}

	$.fn.disable = function ()
	{
		$(this)._toggleElements(true);
	}
	
	$.fn.enable = function ()
	{
		$(this)._toggleElements(false);		
	}
	
	$.fn._toggleElements = function (disabled)
	{
		if (disabled == undefined) return false;

		$(this).find('button, input, select, a').each(function(index, el){
			var $el = $(el);
			
			if ($el.prop('tagName') == 'A')
			{
				var url = $el.attr('href');
				
				if (disabled)
				{
					$el.addClass('disabled');
					$el.off('click');
					
					$el.data('clickFunction', $el.click);
					
					if ($el.attr('onclick') !== undefined)
					{
						$el.data('onclickFunction', $el.attr('onclick'));
						$el.removeAttr('onclick');
					}
									
					$el.bind('click', false);
					


				}
				else
				{
					

					$el.unbind('click', false);

					
					
					var ocf = $el.data('onclickFunction');
					
					
					if (ocf !== undefined) $el.attr('onclick', ocf);

					$el.removeClass('disabled');

				}
			}
			else
			{
				if (disabled) $el.attr('disabled', 'disabled');
				else $el.removeAttr('disabled');
			}
			

			
		});
		
		return true;
		
	}
	
	$.addParam = function (data, key, val)
	{
		if (data == undefined) data = '';
		
		if (typeof data == 'string')
		{
			var encodeData = encodeURI(key) + '=' + encodeURI(val);
			
			if (data.length > 0) data += '&' + encodeData;
			else data = encodeData;
		}
		
		if (typeof data == 'object' && data instanceof Array)
		{
			data.push(val);
		}
		
		if (typeof data == 'object')
		{
			data[key] = val;
		}
		
		return data;
	}

	$.fn.ajaxLoader = function ()
	{
		
	}

	$.randomString = function (length, chars)
	{
		if (length == undefined) length = 16;
		if (chars == undefined) chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		
		var result = '';
		
		for (var i = length; i > 0; --i)
		{
			result += chars[Math.round(Math.random() * (chars.length - 1))];
		}
		
		return result;
	}

	$(window).on('jquery.redirect', function (e, url)
	{
		$(window).trigger('preprocess.redirect', [url]);
		
		if (window.noredirect == false)
		{
			window.location = url;
		}		
		$(window).trigger('postprocess.redirect', [url]);
	});

	

})(jQuery);


/**
* redirect(url) allows has triggers to dynamically catch redirect
*/
Window.prototype.redirect = function (url)
{
	return jQuery.fn.location(url);
};

Window.prototype.getFileExt = function (src)
{
	return jQuery.fn.getFileExt(src);
};

Window.prototype.hashSetVar = function (k, v)
{
	return jQuery.hashSetVar(k, v);
};

Window.prototype.hashSet = function (k)
{
	return jQuery.hashSet(k);
};

Window.prototype.hashUnsetVar = function (k)
{
	return jQuery.hashUnsetVar(k);
};

Window.prototype.hashVal = function (k)
{
	return jQuery.hashVal(k);
};

Window.prototype.getHashVars = function ()
{
	return jQuery.getHashVars();
};

Window.prototype.getHash = function ()
{
	var h = window.location.hash;
	
	if (h == undefined) return undefined;
	
	return h.substring(1);
};

Window.prototype.isJS = function (src)
{
	return jQuery.isJS(src);
};


Window.prototype.parse = function (val)
{
	if (val == undefined) return undefined;
	
	if (val == 'false') val = false;
	if (val == 'true') val = true;
	if (val == 'undefined') val = undefined;

	if (val == 'null') val = null;
	
	if (val == parseInt(val)) val = parseInt(val);
	if (val == parseFloat(val)) val = parseFloat(val);
	
	return val;
}

/**
* gets a URL paramater
*/
Window.prototype.GETParam = function (param)
{
    var url = window.location.search.substring(1);
    
    var urlVars = url.split('&');
    
    var val;
    
    for (var i = 0; i < urlVars.length; i++) 
    {
    	// if isset but no val, will return null not undefined
    	if (urlVars[i].indexOf('=') < 0)
    	{
	    	if (urlVars[i] == param)
	    	{
		    	val = null;
		    	break;
	    	}
    	}
    	else
    	{
	    	
	        var chunks = urlVars[i].split('=');
	        
	        if (chunks[0] == param) 
	        {
	        	val = chunks[1];
	        	
				break;
			}
    	}
    }
	
	val = decodeURI(val);
	
	val = parse(val);
	
    return val;
};

Window.prototype.inverseColor = function (color)
{
	return jQuery.inverseColor(color);
}

Window.prototype.clog = function (msg, stringify, stackTrace)
{
	return jQuery.log(msg, stringify, 'log', stackTrace);
}

Window.prototype.cwarn = function (msg, stringify, stackTrace)
{
	return jQuery.log(msg, stringify, 'warn', stackTrace);
}

Window.prototype.cerror = function (msg, stringify, stackTrace)
{
	return jQuery.log(msg, stringify, 'error', stackTrace);
}

String.prototype.nl2br = function()
{
    return this.replace(/\n/g, "<br />");
}


// no right click context menu; usage: norightclick(); - easy peasy

Window.prototype.norightclick = function ()
{
	$(document).bind("contextmenu",function(e){ return false; });
}