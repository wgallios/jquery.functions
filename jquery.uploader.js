
/**
* Author: William Gallios

Description: Designed to convert reguar HTML uploaders to allow dynamic drag and drop
as well as progress of upload


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


Credits: 
	
	Special thanks to Chat Engler for the ajax progress script to handle
	upload percentage
	
	Chad Engler - jquery.ajax-progress.js 
	https://github.com/englercj

*/



;(function($) {

	'use strict';
    //is onprogress supported by browser?
    var hasOnProgress = ("onprogress" in $.ajaxSettings.xhr());

    //If not supported, do nothing
    if (!hasOnProgress)
    {
        return;
    }
    
    //patch ajax settings to call a progress callback
    var oldXHR = $.ajaxSettings.xhr;
    
    $.ajaxSettings.xhr = function() {
        var xhr = oldXHR();
        
        if (xhr instanceof window.XMLHttpRequest)
        {
            xhr.addEventListener('progress', this.progress, false);
        }
        
        if (xhr.upload)
        {
            xhr.upload.addEventListener('progress', this.progress, false);
        }
        
        return xhr;
    };
    
	var defaults = 
	{
		debug: false,
		uploadUrl: '',
		containerClass: 'uploader-dropzone',
		inheritClasses: false,
		filePostKey: 'file',
		showProgress: true,
		CSRF:{
			enabled: false,
			key: '',
			val: '',
			expires: 3600000 // 1 hour
		}
	};
	
	function uploader (el, options)
	{
		this.options = $.extend(true, {}, defaults, options);
		this.el = $(el);
		
		var $this = this;
		this.files = [];
		
		// checks if the velocity plugin is enabled
		this.velocity = (jQuery().velocity) ? true : false;
		
		

		this.init();
	}
	
	var fn = uploader.prototype;
	
	
	fn.init = function ()
	{
		var $node = $(this.el);
		
		
		// remove intial html element
		$node.css('display', 'none');
		
		this.build(); // generates HTML
		this.buildProgressContainer();
	
		//var pb = this.createProgressBar();
		//var pb2 = this.createProgressBar();
				
	}
	
	fn.build = function ()
	{
		var this_ = this;
		var options = this.options;
		var $el = $(this.el);
		
		var uploadBtn = $.parseHTML("<button type='button' class='upload-btn' id='upload-btn'>Upload</button>");
	
		$(uploadBtn).click(function(e){
			$el.click();
		});
		
		var html = $.parseHTML("<div class='" + options.containerClass + "'>"+
		"<span>Click upload, or drop files here.</span>" +
		"</div> <!-- /." + this.options.containerClass + " -->");
		
		$(html).prepend(uploadBtn);
		
		if (this.options.inheritClasses)
		{
			var classes = this.el.attr('class');
			
			if (classes !== undefined)
			{
				$(html).attr('class', classes);	
			}
		}
		
		$(html).insertBefore(this.el)
			.bind('dragenter', function (e){
				e.originalEvent.stopPropagation();
			 	e.originalEvent.preventDefault();
			
			 	$(this_).trigger('dragenterr', e);
			 	$(this).find('span').text("Drop Files Here"); 
			
				$(this).addClass('dropzone-highlight');	
			})
			.bind('dragover', function(e){
				e.originalEvent.stopPropagation();
			 	e.originalEvent.preventDefault();
			})
			.bind('drop', function (e){
					e.originalEvent.stopPropagation();
				 	e.originalEvent.preventDefault();


				 	$(this_).trigger('drop', e);
				
					var dt = e.originalEvent.dataTransfer;
					var files = dt.files;
					 
					this_.processUpload(files);	
					
					
					$(this).removeClass('dropzone-highlight');	
				 	$(this).find('span').text("Click upload, or drop files here.");

			});

		
		return true;
	}
	
	fn.processUpload = function (files)
	{
		var csrf = this.options.CSRF;

		for (var i = 0; i < files.length; i++)
		{
			var fd = new FormData();
			
			fd.append(this.options.filePostKey, files[i]);
				
			if (csrf.enabled)
			{
				fd.append(csrf.key, csrf.val);
			}
					
			//var progressbar = user.setProgressBar();
			
			//$(progressbar).find('.fileNameTxt').text(files[i].name);


			var pb = this.createProgressBar();
			
			this.setPBFileName(pb, files[i].name);
			
			//global.log(pb, true);
			
			if (this.velocity) $(pb).velocity({ opacity:1 });
			else $(pb).fadeIn();
			
			this.sendFile(fd, pb);
						

			this.files.push(files[i]);			

		}
	}
	
	fn.sendFile = function (fd, pb)
	{

		var this_ = this;
		
		$.ajax({
			url: this.options.uploadUrl,
			data: fd,
			processData: false,
			contentType: false,
			dataType: 'Intelligent Guess',
			type: 'POST',
		    progress: function(e)
		    {
		        //make sure we can compute the length
		        if (e.lengthComputable)
		        {
		            //calculate the percentage loaded
		            var pct = (e.loaded / e.total) * 100;

					var d = pct.toString().indexOf('.');
					
					var pctDisplay = (d > 0) ? pct.toString().substr(0, d) : pct;
					
					pctDisplay = parseInt(pctDisplay);
					
					
					this_.setPBPercent(pb, pctDisplay);
					
					if (pct >= 100)
					{
						this_.removeProgressBar(pb);
						//user.hideProgressbar(progressbar);
					}
	
		        }
		        else
		        {
			        //this usually happens when Content-Length isn't set
		            console.warn('Content Length not reported!');
		        }
			},
			success: function(data)
			{
			  
			}
		});
	}
	
	fn.buildProgressContainer = function ()
	{
		if ($('#progress-container').length <= 0)
		{
			this.pbc = $.parseHTML("<div id='progress-container'></div>");
		
			$('body').prepend(this.pbc);
		}
		
		return true;
	}
	
	fn.createProgressBar = function ()
	{
		var $bar = $("<div>", { class:'uploader-progress-container', style:"opacity:0" });
			
		var html = $.parseHTML("<div class='progress-bg'></div>" +
		"<div class='progress-content'>" +
		"<span class='fileinfo'><span class='file'></span>" +
		"<span class='percent'>0</span></span>" +
		"<div class='uploader-progress-bar' style=\"width:0%\"></div>" +
		"</div>");
		
		
		$bar.append(html);
		
		$(this.pbc).append($bar);
		
		return $bar;
	}
	
	fn.removeProgressBar = function ($pb)
	{
		if (this.velocity) $pb.velocity({ opacity:0 }, { delay:800, complete:function(){  $(this).remove(); }});
		else $pb.fadeOut(400, function(){ $(this).remove(); });
		
		return true;
	}
	
	
	fn.setPBFileName = function (pb, file)
	{
		var $bar = $(pb).find('.file');
		
		$bar.text(file);
		
		return true;
	}

	fn.setPBPercent = function (pb, percent)
	{
		var pct = $(pb).find('.percent');
		var bar = $(pb).find('.uploader-progress-bar');
		
		pct.text(percent);
		
		$(bar).css('width', percent + '%');
	}

	// jquery adapter
	$.fn.uploader = function (options)
	{
		return this.each(function(){
			if (!$(this).data('uploader'))
			{
				$(this).data('uploader', new uploader(this, options));
			}
		});
	};
	
	
	$.uploader = fn;
	
})(jQuery);