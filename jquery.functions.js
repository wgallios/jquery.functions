
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


	// loads a CSS file into the <head>
	$.loadCSS = function (href)
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
				this_.log(e.message);
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

})(jQuery);