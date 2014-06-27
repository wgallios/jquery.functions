;(function($){
 
 	var defaults = 
	{
		debug: false,
		type: 'warning', // warning, success, danger, info
		opacity:0.9,
		borderRadius:10,
		clearTimeoutSeconds:3, // 0 for no timeout
		animation:
		{
			duration:400	
		},
		container:
		{
			id: 'jquery-alerts-container',
			clas: 'jquery-alerts-container', // default container class
			width: '50%',
			x: 30,
			y: 30
		},
		defaultHeaders:
		{
			warning: 'Warning',
			success: 'Success',
			danger: 'Error',
			info: 'Information'
		},
		icon: // default icons for vaiours icon packages
		{
			fontawesome:
			{
				warning: 'fa fa-exclamation-triangle',
				success: 'fa fa-thumbs-up',
				danger: 'fa fa-times-circle-o',
				info: 'fa fa-info-circle',	
			}
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
		this.checkFontAwesome();
		this.buildContainer();
	}
	
	fn.buildContainer = function ()
	{
		var o = this.options;
		
		if ($('#' + o.container.id).length <= 0)
		{
			$container = $("<div>", {id: o.container.id, class: o.container.clas});
			
			$container.css('width', o.container.width)
				.css('top', o.container.x)
				.css('left', o.container. y);
			
			this.$container = $container;
		
			this.$el.prepend($container);
		}
		
		return true;
	}

	fn.buildAlert = function (type, msg, header)
	{
		var t = this;
	
		var o = this.options;
	
		if (type == undefined) type = o.type;

		type = type.toLowerCase(); // ensures type is lower case
		
		if (header == undefined)
		{		
			header = o.defaultHeaders[type];
		}
		
		var $alert = $("<div>", { class:'jquery-alert jquery-alert-' + type });
		
		var $closeBtn = $("<button>", { type:'button', class:'close-alert' });
		$closeBtn.html('&times;');
		
		$alert.prepend($closeBtn);
		
		$closeBtn.click(function(e){
			t.clearAlert($alert);
		});
		
		
		if (this.fontawesome)
		{
			header = "<i class='" + o.icon.fontawesome[type] + "'></i> " + header;
		}
		
		var html = "<h3>" + header + "</h3>" +
		"<span class='alert-text'>" + msg + "</span>";
		
		
		$alert.append(html);
		
		this.$container.prepend($alert);
				
		var h = $alert.outerHeight(); // gets final height for alert
		
		$alert.css('opacity', 0)
			.css('height', 0 + 'px')
			.css('border-radius', o.borderRadius);
		

		
		if (this.velocity)
		{
			$alert.velocity({ opacity:o.opacity, height:h });
			//$alert.velocity('slideDown', {});

		}
		else
		{
			$alert.css('opacity', o.opacity)
				.css('height', '');
		}
		
		return $alert;
	}
	
	fn.warning = function (msg, header)
	{
		var t = this;
		
		if (msg == undefined || msg == '') return false;
		
		if (header == undefined) header = this.options.defaultHeaders.warning;
		
		var $alert = this.buildAlert('warning', msg, header);
		
		t.setAlertTimeout($alert);
	}
	
	fn.success = function (msg, header)
	{
		var t = this;
		
		if (msg == undefined || msg == '') return false;
		
		if (header == undefined) header = this.options.defaultHeaders.success;
		
		var $alert = this.buildAlert('success', msg, header);
		
		t.setAlertTimeout($alert);
	}

	fn.danger = function (msg, header)
	{
		var t = this;
		
		if (msg == undefined || msg == '') return false;
		
		if (header == undefined) header = this.options.defaultHeaders.danger;
		
		var $alert = this.buildAlert('danger', msg, header);
		
		t.setAlertTimeout($alert);
	}
	
	fn.info = function (msg, header)
	{
		var t = this;
		
		if (msg == undefined || msg == '') return false;
		
		if (header == undefined) header = this.options.defaultHeaders.info;
		
		var $alert = this.buildAlert('info', msg, header);
		
		t.setAlertTimeout($alert);
	}
	
	fn.setAlertTimeout = function ($alert)
	{
		var t = this;
				
		if (t.options.clearTimeoutSeconds > 0)
		{
			setTimeout(function(){
				t.clearAlert($alert);
			}, (t.options.clearTimeoutSeconds * 1000));	
		}
	}
	
	fn.checkFontAwesome = function ()
	{
		var fa = false;
		
		$('head link').each(function(i, f){
			var href = $(f).attr('href');
			
			if (href == undefined) return false;
			if (href == '') return false;
			
			if (href.indexOf('font-awesome') > 0)
			{
				fa = true;
				return true;
			}
			
		});
		
		this.fontawesome = fa;
		
		return fa;
	}

	fn.clearAlert = function ($alert)
	{
		var duration = this.options.animation.duration;
		
		if (this.velocity)
		{
			$alert.velocity({ opacity:0 }, {
				duration: duration,
				complete:function()
				{
					$(this).remove();
				}
			});
		}
		else
		{
			$alert.fadeOut(duration, function(){
				$alert.remove();
			})
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


