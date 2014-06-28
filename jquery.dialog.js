;(function($){
 
 	var defaults = 
	{
		debug: false,
		zoom: 90,
		height:150,
		width:300,
		bounce:20,
		duration:800,
		backdropOpacity:0.6,
		closeBtn: true,
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

		this.init(msg);
		
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
		var t = this;
		
		var bgColor = $('body').css('backgroundColor');
		var bgImg = $('body').css('backgroundImage');
		var bgRepeat = $('body').css('backgroundRepeat');
		
		this.paddingTop = $('body').css('padding-top');
		this.paddingLeft = $('body').css('padding-left');
		this.paddingBottom = $('body').css('padding-bottom');
		this.paddingRight = $('body').css('padding-right');
		
		this.margin = $('body').css('margin');
		
		
		this.orgColor = bgColor;
		this.orgImg = bgImg;
		this.orgRepeat = bgRepeat;
		
		var h = $(window).height();
		var w = $(window).width();
		
		$div = $("<div>", { id: 'dialog-content-backdrop' });
		
		$wrap = $("<div>", { id: 'dialog-content-wrapper' });
		
		$container = $("<div>", { id: 'dialog-content-container' });		


		
		$div.css('backgroundColor', '#333333')
			.css('opacity', 0);
		
		$wrap.css('backgroundColor', bgColor)
			.css('backgroundImage', bgImg)
			.css('backgroundRepeat', bgRepeat)
			.css('width', w)
			.css('padding-top', t.paddingTop)
			.css('padding-left', t.paddingLeft)
			.css('padding-bottom', t.paddingBottom)
			.css('padding-right', t.paddingRight)
			.css('overflow', 'hidden');
			
		var html = $('body').html();
		
		$wrap.append(html);
		$wrap.append($div);
				
		$(document.body).html( $wrap );

		$('body').prepend($container);		


				
		$('body').css('backgroundColor', '#333')
			.css('backgroundImage', 'none')
			.css('padding', 0)
			.css('margin', 0);
		
		if (sf !== undefined && typeof sf == 'function') sf($wrap, $container);
		//jQuery("body").html().detach().appendTo($wrap);
		
		return true;
	}
	
	fn.zoomOut = function ($wrap)
	{
		var zoom = this.options.zoom / 100;
		var t = this;

		//$('html, body').velocity("scroll", 400);
		$('body').velocity({ paddingTop:0, paddingLeft:0, paddingRight:0, paddingBottom:0, margin:0 });
		
		$wrap.velocity({
			scaleX:zoom,
			scaleY:zoom
		}, {
			duration:t.options.duration
		});
		
		$('#dialog-content-backdrop').velocity({ opacity:t.options.backdropOpacity });
		
	}
	
	
	fn.buildDialog = function (msg, $container)
	{
		var t = this;
		
		$dc = $("<div>", { class: this.options.containerClass });

		$dc.css('display', 'inline-block')
			.css('opacity', 0);

		$header = $("<div>", { class: 'dialog-header' });
		$body = $("<div>", { class: 'dialog-body' });
		$footer = $("<div>", { class: 'dialog-footer' });

		var $closeBtn = $("<button>", { type:'button', class:'close-alert' });
		$closeBtn.html('&times;');
		
		if (t.options.closeBtn) $header.append($closeBtn);
		$header.append("<h3>Title</h3>");

		$dc.prepend($header);
		$dc.append($body);
		$dc.append($footer);

		
		if (t.options.accept.show)
		{
			$okBtn = $("<button>", { class: 'dialog-ok-btn', type:'button', html:t.options.accept.text });
			
			$okBtn.click(function(e){
				e.preventDefault();
				
				$(window).trigger('dialog.ok');
				
				t.destroy($dc);
			});
			
			$footer.append($okBtn);
			
		}

		if (t.options.deny.show)
		{
			$denyBtn = $("<button>", { class: 'dialog-deny-btn', type:'button', html:t.options.deny.text });
			
			$denyBtn.click(function(e){
				e.preventDefault();
			
				$(window).trigger('dialog.cancel');
			
				t.destroy($dc);
			});
			
			$footer.prepend($denyBtn);
			
		}

		var bounce = t.options.bounce;

		var dcTop = ($(window).height() / 2) - (t.options.height / 2);		

		//var dcLeft = ($(window).width() / 2) - (t.options.width / 2);

		
		//console.log(dcTop);	
		
		$dc.css('top', dcTop + 'px');
			//.css('left', dcLeft + 'px')
			//.css('width', 0)
			//.css('height', 0);
		
		var html = "<span>" + msg + '</span>';
		
		$body.html(html);
		
		$container.append($dc);
		
		$dc.velocity({ opacity:1 });
		
		/*
		$dc.velocity({ width:(t.options.width + bounce), height:(t.options.height + bounce) }, {
			complete:function ()
			{
				$dc.velocity({ width:(t.options.width - bounce), height:(t.options.height - bounce) });
			}
		});
		*/
		return $dc;
	}
	
	
	fn.destroy = function ($dc)
	{
		var t = this;
		
	
		$dc.velocity({ opacity:0 }, {
			complete:function()
			{
				$(this).remove();
			}
		});



		$('#dialog-content-backdrop').velocity({ opacity:0 }, {
			complete:function()
			{
				$(this).remove();
			}
		});
						
		$('#dialog-content-wrapper').velocity({
			scaleX:1,
			scaleY:1
		}, {
			duration:t.options.duration,
			complete:function()
			{
					$('body').velocity({ 
			paddingTop:t.paddingTop, 
			paddingLeft:t.paddingLeft,
			paddingBottom:t.paddingBottom, 
			paddingRight:t.paddingRight,  
			margin:t.margin 
			});
				
				$('body').css('backgroundColor', '')
					.css('backgroundImage', this.orgImg)
					.css('backgroundRepeat', this.orgRepeat);
				
				$(document.body).html( $('#dialog-content-wrapper').html() );
			}
		});
		
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
