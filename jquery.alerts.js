
/**

* Events:
	alert.before.show // triggered after item is prepended to container and before it renders
	alert.after.show // triggered after the alert has been show
	alert.before.hide // triggered before the alert is to be cleared via plugin
	alert.after.hide // triggered after alert has been cleared 
*/

;(function($){

 	var defaults = 
	{
		debug: false,
		type: 'warning', // warning, success, danger, info
		opacity:0.9,
		zindex:999,
		borderRadius:4,
		clearTimeoutSeconds:3, // 0 for no timeout. alias: timeout
		GET:['site-alert', 'site-warning', 'site-success', 'site-info', 'site-danger', 'site-error', 'warning', 'alert', 'success', 'info', 'danger', 'error'], // GET params that the plugin will look for to try to render
		animation:
		{
			duration:400	
		},
		container:
		{
			id: 'jquery-alerts-container',
			clas: 'jquery-alerts-container', // default container class
			width: '30%',
			right: 15,
			top: 15
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
		initmsg: undefined,
		inline: false, // prepends alert to element rather than into container
		display: true // if False just returns HTML
	};
 	
 	function alerts (el, msg, header, options)
	{
		this.options = $.extend(true, {}, defaults, options);
		this.el = el;
		this.$el = $(el);
		this.index = this.$el.index();
		
		if (options.timeout !== undefined) this.options.clearTimeoutSeconds = options.timeout;
		
		// checks if the velocity plugin is enabled
		this.velocity = (jQuery().velocity) ? true : false;

		if (this.options.inline && this.options.display)
		{
			return this.buildAlert(el, msg, header);
		}
		else if (this.options.display)
		{
			var $alert = this.init(msg, header);

			return $alert;
		}
		else
		{
			return this.buildAlert(undefined, msg, header);
		}
	}
	
	var fn = alerts.prototype;
	
	fn.init = function (msg, header)
	{
		var t = this;
		var $alert;
		
		t.checkFontAwesome();
		t.buildContainer(function($container){
			$alert = t.buildAlert($container, msg, header);			
		});

		return $alert;
	}
	
	fn.buildContainer = function (sf)
	{
		var o = this.options;
		var t = this;
		
		var c = $(t.$el).find('.' + o.container.clas).first();
		
		if (c.length <= 0)
		{
			$container = $("<div>", {class: o.container.clas});
			
			$container.css('width', o.container.width)
//				.css('padding', '30px');
				.css('right', o.container.right)
				.css('top', o.container.top);
			
			//this.$container = $container;
		
			$(t.$el).prepend($container);
		}
		else
		{
			$container = $(c);
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
		
		if ($container !== undefined)
		{

			$(t).trigger('alert.before.show', $alert);
						 		
			$container.prepend($alert);
		}
			
		var h = $alert.outerHeight(); // gets final height for alert
		
		$alert.css('display', 'none')
			.css('z-index', t.options.zindex)
			//.css('height', 0 + 'px')
			.css('border-radius', o.borderRadius);
		

		
		if (this.velocity)
		{
			//$alert.velocity({ opacity:o.opacity, height:h });
			$alert.velocity('slideDown', { duration: o.animation.duration, complete:function(){
				
				$(t).trigger('alert.after.show', $alert);
				
			} });

		}
		else
		{
			$alert.fadeIn(o.animation.duration, function (){
				$(t).trigger('alert.after.show', $alert);
			});
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
		var t = this;
		var duration;
		
		if (this.options == undefined) duration = 400;
		else duration = this.options.animation.duration;
		
		var vel = this.velocity;
		
		if (vel == undefined) vel = (jQuery().velocity) ? true : false;
		
		if (vel)
		{
			$(t).trigger('alert.before.hide', $alert);
			
			$alert.velocity('slideUp', {
				duration: duration,
				complete:function()
				{
					$alert.remove();
					$(t).removeData();
					$(t).trigger('alert.after.hide', $alert);
				}
			});
		}
		else
		{
			$alert.fadeOut(duration, function(){
				$alert.remove();
				$(t).removeData();
				$(t).trigger('alert.after.hide', $alert);
			})
		}
		
		return true;
	}
	
	fn.urlAlerts = function ()
	{
		this.checkFontAwesome();
		
		
		
		if (GETParam('site-alert') !== undefined && GETParam('site-alert').length > 0 ) Warning(GETParam('site-alert'));
		if (GETParam('site-info') !== undefined && GETParam('site-info').length > 0 ) Info(GETParam('site-info'));
		//if (GETParam('site-error') !== undefined && GETParam('site-error').length > 0 ) Danger(GETParam('site-error'));
		if (GETParam('site-danger') !== undefined && GETParam('site-danger').length > 0 ) Danger(GETParam('site-danger'));
		if (GETParam('site-success') !== undefined && GETParam('site-success').length > 0 ) Success(GETParam('site-success'));
		
		if (GETParam('warning') !== undefined && GETParam('warning').length > 0 ) Warning(GETParam('warning'));
		if (GETParam('info') !== undefined && GETParam('info').length > 0 ) Info(GETParam('info'));
		if (GETParam('danger') !== undefined && GETParam('danger').length > 0 ) Danger(GETParam('danger'));
		if (GETParam('error') !== undefined && GETParam('error').length > 0 ) Danger(GETParam('error'));
		if (GETParam('success') !== undefined && GETParam('success').length > 0 ) Success(GETParam('success'));
	return true;
	}
	
	// function to parse HTML markup alerts
	fn.htmlAlerts = function ()
	{
		this.checkFontAwesome();
		
		$('alert').each(function(i, el){

			$(el).css('z-index', 1);

			var options = $(el).data('options');

			if ($(el).data('type').toUpperCase() == 'WARNING') $(el).Warning($(el).data('msg'), $(el).data('header'), options);
			if ($(el).data('type').toUpperCase() == 'SUCCESS') $(el).Success($(el).data('msg'), $(el).data('header'), options);			
			if ($(el).data('type').toUpperCase() == 'INFO') $(el).Info($(el).data('msg'), $(el).data('header'), options);			
			if ($(el).data('type').toUpperCase() == 'DANGER') $(el).Danger($(el).data('msg'), $(el).data('header'), options); // stranger danger
		});

		return true;
	};

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

	$.fn.Warning = function (msg, header, options)
	{
		var t = this;
		
		return $.fn._inline(this, 'warning', msg, header, options);
	};
	
	// Functions to use for just body
	$.Warning = function (msg, header, options) { return new alerts($('body'), msg, header, options); }
	$.Success = function (msg, header, options) { return new alerts($('body'), msg, header, $.extend(true, {}, options, { type: 'success' })); }
	$.Info = function (msg, header, options) { return new alerts($('body'), msg, header, $.extend(true, {}, options, { type: 'info' })); }
	$.Danger = function (msg, header, options) { return new alerts($('body'), msg, header, $.extend(true, {}, options, { type: 'danger' })); }
	
	$.fn.Success = function (msg, header, options)
	{
		var t = this;
		
		return $.fn._inline(t, 'success', msg, header, options);
	};
	
	$.fn.Info = function (msg, header, options)
	{
		var t = this;
		
		return $.fn._inline(t, 'info', msg, header, options);
	};
	
	$.fn.Danger = function (msg, header, options)
	{
		var t = this;
		
		return $.fn._inline(t, 'danger', msg, header, options);
	};
	
	$.fn._inline = function (el, type, msg, header, options)
	{

		var inlineDefaultOptions = 
		{
			type: type,
			inline: true
		};
		
		options = $.extend(true, {}, inlineDefaultOptions, options);
		
		return new alerts(el, msg, header, options);
	}
	
	$.fn.clearAlerts = function ()
	{
		$(this).find('.jquery-alert').each(function(i, alert){
			clearAlert($(alert));
		})
	}

})(jQuery);


Window.prototype.Warning = function (msg, header, options)
{
	if (options == undefined) options = {};
	
	return jQuery.alerts.constructor($('body'), msg, header, options);
}

Window.prototype.Success = function (msg, header, options)
{
	if (options == undefined) options = {};
	
	return jQuery.alerts.constructor($('body'), msg, header, $.extend(true, {}, options, { type: 'success' }));
}

Window.prototype.Danger = function (msg, header, options)
{
	if (options == undefined) options = {};
	
	return jQuery.alerts.constructor($('body'), msg, header, $.extend(true, {}, options, { type: 'danger' }));
}

Window.prototype.Info = function (msg, header, options)
{
	if (options == undefined) options = {};
	
	return jQuery.alerts.constructor($('body'), msg, header, $.extend(true, {}, options, { type: 'info' }));
}

Window.prototype.clearAlert = function ($alert)
{
	return jQuery.alerts.clearAlert($alert);
}

//jQuery.alerts.urlAlerts();
jQuery.alerts.htmlAlerts();
