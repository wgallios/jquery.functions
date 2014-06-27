;(function($){
 
 	var defaults = 
	{
		debug: false,
		type: 'warning', // warning, success, danger, info
		width: '300px',
		height: 'auto',
		x: 15,
		y: 15,
		opacity:0.95,
		borderRadius:10,
		clearTimeoutSeconds:3, // 0 for no timeout
		defaultHeaders:
		{
			warning: 'Warning',
			success: 'Success',
			danger: 'Danger',
			info: 'Information'
		}
	};
 	
 	function alerts (el, options)
	{
		this.options = $.extend(true, {}, defaults, options);
		this.$el = $(el);
		this.index = this.$el.index();
		

		// checks if the velocity plugin is enabled
		this.velocity = (jQuery().velocity) ? true : false;

		this.init();
	}
	
	var fn = alerts.prototype;
	
	fn.init = function ()
	{

	}

	fn.buildAlert = function (type, msg, header)
	{
	
		var o = this.options;
	
		if (type == undefined) type = o.type;
		
		var $alert = $("<div>", { class:'jquery-alert jquery-alert-' + type });
			
		console.log(this.options);
		console.log(o);
						
		$alert.css('opacity', 0)
			.css('width', o.width)
			.css('height', o.height)
			.css('left', o.x)
			.css('top', o.y)
			.css('border-radius', o.borderRadius);
		
		var html = "<h3>" + o.header + "</h3>" + 
		"<span class='alert-text'>" + msg + "</span>";
		
		
		$alert.append(html);
		
		this.$el.prepend($alert);
		
		if (this.velocity)
		{
			$alert.velocity({ opacity:o.opacity });
		}
		else
		{
			$alert.css('opacity', o.opacity);
		}
		
		return $alert;
	}
	
	fn.warning = function (msg, header)
	{
		var t = this;
		
		if (msg == undefined || msg == '') return false;
		
		if (header == undefined) header = this.options.defaultHeaders.warning;
		
		var $alert = this.buildAlert('warning', msg, header);
		
		if (t.options.clearTimeoutSeconds > 0)
		{
			setTimeout(function(){
				t.clearAlert($alert);
			}, (t.options.clearTimeoutSeconds * 1000));	
		}
		
	}

	fn.clearAlert = function ($alert)
	{
		if (this.velocity)
		{
			$alert.velocity({ opacity:0 });
		}
		else
		{
			$alert.css('opacity', 0);
		}
		
	}

	// jquery adapter
	$.fn.alerts = function (options)
	{
		return this.each(function(){
			if (!$(this).data('alerts'))
			{
				$(this).data('alerts', new alerts(this, options));
			}
		});
	};
	
	
	$.alerts = fn;
	/*
	
    $.fn.alerts = function (msg, options)
    {
    
    	if (options == undefined) options = {};
    
    	var html = '';
        var header = "Alert!";
        
    	if (msg == undefined || msg == '')
    	{
			return false;
    	}
    	
	    if (options.type == undefined)
	    {
	        options.type = 'warning';
	    }
	
		// checks if container has been created
		if ($('#jquery-alerts-container').length <= 0)
		{
			this.prepend("<div id='jquery-alerts-container'></div>");
		}
	

	
	    if (options.type == 'danger') header = "<i class='fa fa-times-circle-o'></i> Error";
	    if (options.type == 'info') header = "<i class='fa fa-exclamation-circle'></i> Information";
	    if (options.type == '-success') header = "<i class='fa fa-thumbs-up'></i> Success";
	

    	html = "<div class='jquery-alert'>" +
    	"<div class='alert alert-" + options.type + "'>" +
    	"<button type='button' class='close' data-dismiss='alert'>&times;</button><h4>" + header + "</h4>" +
    	msg +
    	"<div class='clearfix'></div>" + 
    	"</div> <!-- /.alert -->" +
    	"</div> <!-- /.jquery-alert -->";
    	


		this.find('#jquery-alerts-container').prepend(html);
		
		$('#jquery-alerts-container').find('.jquery-alert').each(function(index, item){
			// checks opacity
			//console.log($(item).css('opacity'));
			
			if ($(item).css('opacity') == 0)
			{
				$(item).velocity({ opacity:0.9 }, {
					duration: 500
				});
				
				// set a timeout
				setTimeout(function(){
					$(item).velocity({ opacity:0 }, {
						complete: function(){
							$(this).remove();
						}
					});
				}, 3000)
			}
		});
		
		// fades element in
		//$('#jquery-alerts-container .jquery-alert').last().velocity({ opacity:1 });

		//alert(msg);

    }
    
    */
})(jQuery);


