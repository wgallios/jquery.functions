
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

var velocity = (jQuery().velocity) ? true : false;

String.prototype.nl2br = function()
{
    return this.replace(/\n/g, "<br />");
}


// no right click context menu; usage: norightclick(); - easy peasy

Window.prototype.norightclick = function ()
{
	$(document).bind("contextmenu",function(e){ return false; });
}

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
	

	
	
	// returns an array of all css files in HEAD
	$.getLoadedCSS = function ()
	{
		var cssFiles = [];
		
		$('link').each(function(index, s){
			var src = $(s).attr('href');
			
			
			if (src == undefined)
			{
				// no css file
			}
			else
			{
				if (src.toLowerCase().indexOf('.css'))
				{
					cssFiles.push(src);
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
				if (ext == 'CSS') $._loadCSS(s);
				else if (ext == 'LESS') $._loadLess(s);
				rcss.push(s);
			}
		});
	}

	// loads a CSS file into the <head>
	$._loadCSS = function (href)
	{
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
	$._loadLess = function (href)
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
				console.log("SRC: " + src);
	            if (src.indexOf(file) >= 0 )
	            {
	                docurl = src.substring(0, src.indexOf(file));
	                console.log("MATCH: " + docurl);
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
		$.log('unloading');
		
		// delete object.name
	}
	
	// function used for logging
	$.log = $.fn.log = function (msg, stringify)
	{
		if (stringify == undefined) stringify = false;
		
		if (console)
		{
			if (stringify) msg = JSON.stingify(msg);
			
			console.error(msg);

			if (typeof this == 'object')
			{
				console.dir(this);
				//window.console && console.dir(this);				
			}
			

			
			window.console && console.log((new Error()).stack);
		}
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
				
				if (val == 'null') val = null;
					
				if (val == 'false') val = false;
				if (val == 'true') val = true;
				
				if (val == parseInt(val)) val = parseInt(val);
				if (val == parseFloat(val)) val = parseFloat(val);
								 
				data[key] = val;
			}		
		}
		
		return data;
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
					duration: options.duraiton, 
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
	
	//if (val == undefined) val = null;
	        	
	if (val == 'false') val = false;
	if (val == 'true') val = true;
	if (val == 'undefined') val = undefined;

	if (val == 'null') val = null;
	
	if (val == parseInt(val)) val = parseInt(val);
	if (val == parseFloat(val)) val = parseFloat(val);

	
    return val;
};