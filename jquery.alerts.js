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
		},
		initHeader: undefined,
		initmsg: undefined
	};
 	
 	function alerts (el, msg, header, options)
	{
		this.options = $.extend(true, {}, defaults, options);
		this.$el = $(el);
		this.index = this.$el.index();
		

		// checks if the velocity plugin is enabled
		this.velocity = (jQuery().velocity) ? true : false;

		this.init(msg, header);
		
		return this;
	}
	
	var fn = alerts.prototype;
	
	fn.init = function (msg, header)
	{
		var t = this;
		
		t.checkFontAwesome();
		t.buildContainer(function($container){
			t.buildAlert($container, msg, header);
		});
		

	}
	
	fn.buildContainer = function (sf)
	{
		var o = this.options;
		
		if ($('#' + o.container.id).length <= 0)
		{
			$container = $("<div>", {id: o.container.id, class: o.container.clas});
			
			$container.css('width', o.container.width)
				.css('top', o.container.x)
				.css('left', o.container. y);
			
			//this.$container = $container;
		
			$('body').prepend($container);
		}
		else
		{
			$container = $('#' + o.container.id);
		}
		
		if (sf !== undefined && typeof sf == 'function') sf($container);
		
		
		return $container;
	}

	fn.buildAlert = function ($container, msg, header)
	{
		var t = this;
	
		var o = this.options;
	
		type = o.type;

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
		
		$container.prepend($alert);
				
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
		
		t.setAlertTimeout($alert);
		
		return $alert;
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
	$.fn.alerts = function (msg, header, options)
	{
		return this.each(function(){
			if (!$(this).data('alerts'))
			{
				$(this).data('alerts', new alerts(this, msg, header, options));
			}
		});
	};
	
	
	$.alerts = fn;

})(jQuery);

Window.prototype.Warning = function (msg, header, options)
{
	if (options == undefined) options = {};
	
	return jQuery.alerts.constructor(this, msg, header, options);
}

Window.prototype.Success = function (msg, header, options)
{
	if (options == undefined) options = {};
	
	return jQuery.alerts.constructor(this, msg, header, $.extend(true, {}, options, { type: 'success' }));
}

Window.prototype.Danger = function (msg, header, options)
{
	if (options == undefined) options = {};
	
	return jQuery.alerts.constructor(this, msg, header, $.extend(true, {}, options, { type: 'danger' }));
}

Window.prototype.Info = function (msg, header, options)
{
	if (options == undefined) options = {};
	
	return jQuery.alerts.constructor(this, msg, header, $.extend(true, {}, options, { type: 'info' }));
}