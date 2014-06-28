;(function($){
 
 	var defaults = 
	{
		debug: false,
		zoom: 90,
		height:150,
		width:300,
		bounce:20,
		backdropOpacity:0.6,
		containerClass: 'dialog-container',
		accept:
		{
			show: true,
			text: "Ok",
			clickFunction: function() {}
		},
		deny:
		{
			show: true,
			text: "Cancel",
			clickFunction: function() {}
		}		
	}
	
	function Dialog (el, msg, options)
	{
		this.options = $.extend(true, {}, defaults, options);
		this.$el = $(el);

		this.init();
		
		this.msg = msg;
		
		this.velocity = (jQuery().velocity) ? true : false;
		this.foggy = (jQuery().foggy) ? true : false;
						
		return this;	
	}
	
	var fn = Dialog.prototype;
	
	fn.init = function (msg)
	{
		var t = this;
		
		t.wrapContent(function($wrap, $container){
			t.zoomOut($wrap);
			t.buildDialog(msg, $container);	
		});
		
		
	}
	
	fn.wrapContent = function (sf)
	{
		
		var bgColor = $('body').css('backgroundColor');
		var bgImg = $('body').css('backgroundImage');
		var bgRepeat = $('body').css('backgroundRepeat');
		
		var h = $(window).height();
		var w = $(window).width();


		$container = $("<div>", { id: 'dialog-content-container' });		
		$wrap = $("<div>", { id: 'dialog-content-wrapper' });

		
		$div = $("<div>", { id: 'dialog-content-backdrop' });
		
		$div.css('backgroundColor', '#333333')
			.css('opacity', 0);
		
		$wrap.css('backgroundColor', bgColor)
			.css('backgroundImage', bgImg)
			.css('backgroundRepeat', bgRepeat)
			.css('width', w)
			.css('height', h)
			.css('overflow', hidden);
			
		var html = $('body').html();
		
		$wrap.append(html);
		$wrap.append($div);
				
		$(document.body).html( $wrap );

		$('body').prepend($container);		


				
		$('body').css('backgroundColor', '#333')
			.css('backgroundImage', 'none');
		
		if (sf !== undefined && typeof sf == 'function') sf($wrap, $container);
		//jQuery("body").html().detach().appendTo($wrap);
		
		return true;
	}
	
	fn.zoomOut = function ($wrap)
	{
		

		
		var zoom = this.options.zoom / 100;
		var t = this;
		
		$wrap.velocity({
			scaleX:zoom,
			scaleY:zoom
		}, {
			duration:1200,
			complete:function()
			{
				$(html).velocity("scroll", 400);
		
				//$('.blur').foggy();
			}
		});
		
		$('#dialog-content-backdrop').velocity({ opacity:t.options.backdropOpacity });
		
	}
	
	
	fn.buildDialog = function (msg, $container)
	{
		var t = this;
		
		$dc = $("<div>", { class: this.options.containerClass });
		
		var bounce = t.options.bounce;
		
		var dcTop = ($(window).height() / 2) - (t.options.height / 2);
		var dcLeft = ($(window).width() / 2) - (t.options.width / 2);
				
		console.log(dcTop);	
		
		$dc.css('top', dcTop + 'px')
			.css('left', dcLeft + 'px')
			.css('width', 0)
			.css('height', 0);
		
		var html = "<span>" + msg + '</span>';
		
		$dc.html(html);
		
		$container.append($dc);
		
		$dc.velocity({ width:(t.options.width + bounce), height:(t.options.height + bounce) }, {
			complete:function ()
			{
				$dc.velocity({ width:(t.options.width - bounce), height:(t.options.height - bounce) });
			}
		});
		
		return $dc;
	}
	

	
	// jquery adapter
	$.fn.Dialog = function (msg, options)
	{
		return this.each(function(){
			if (!$(this).data('Dialog'))
			{
				$(this).data('Dialog', new Dialog(this, msg, options));
			}
		});
	};
	
	
	$.dialog = fn;

})(jQuery);


Window.prototype.Dialog = function (msg, options)
{
	return jQuery.dialog.constructor(this, msg, options);
}
