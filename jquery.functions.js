
/**
* Author: William Gallios
*/

;(function($){

	// jquery function to check if element exists;
	$.fn.exists = function ()
	{
		return this.length > 0; 
	}
	
	// gets all scripts in page
	$.getLoadedScripts = function ()
	{
		var scripts = [];

		
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
		if (href == undefined) throw new Exception("CSS href is undefined!");
		
		var script = $("<link/>",{
			rel: "stylesheet",
			type: "text/css",
			href: href
			});
			
		script.appendTo("head");
		
		return script;
	}

})(jQuery);