;(function($){
 
 	var defaults = 
	{
		target: 'body',
		header: undefined,
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
			close: true,
			text: "Ok",
			clickFunction: function() {}
		},
		deny:
		{
			show: false,
			close: true,
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


		
		$div = $("<div>", { id: 'dialog-content-backdrop' });
		
		$wrap = $("<div>", { id: 'dialog-content-wrapper' });
		
		$container = $("<div>", { id: 'dialog-content-container' });		


		
		$div.css('backgroundColor', '#333333')
			.css('opacity', 0);
			
			

		
		//$('body > div').css('overflow', 'hidden');
		/*
		$wrap.css('backgroundColor', t.orgColor)
			.css('backgroundImage', t.orgImg)
			.css('backgroundRepeat', t.orgRepeat)
			.css('width', w)
			.css('height', h)
			.css('padding-top', t.paddingTop)
			.css('padding-left', t.paddingLeft)
			.css('padding-bottom', t.paddingBottom)
			.css('padding-right', t.paddingRight)
			.css('overflow', 'hidden');
			
		var html = $.parseHTML($('body').html());
		
		$wrap.append(html);
		$wrap.append($div);


		
		$(document.body).html( $wrap );
		*/
		
		$('body')
			.prepend($div)
			.prepend($container);		

		var h = $div.height();
		var w = $div.width();

		
		$('body').css('width', w)
			.css('height', h)
			.css('overflow', 'hidden');
		
		$('html, body').css('backgroundColor', '');
				
		$('body').css('backgroundColor', '#333')
			.css('backgroundImage', 'none')
			//.css('padding', 0)
			//.css('margin', 0);
		
		if (sf !== undefined && typeof sf == 'function') sf($wrap, $container);
		//jQuery("body").html().detach().appendTo($wrap);
		
		return true;
	}
	
	fn.zoomOut = function ($wrap)
	{
		var zoom = this.options.zoom / 100;
		
		var t = this;


		var backDropH = (100 - t.options.zoom) + 100;
		
		$(window).trigger('dialog.before.zoomout');

		//$('html, body').velocity("scroll", 400);
		//$('body').velocity({ paddingTop:0, paddingLeft:0, paddingRight:0, paddingBottom:0, margin:0 });

		$('#dialog-content-backdrop').velocity({ opacity:t.options.backdropOpacity, height:backDropH + '%'});
		
		$('body').velocity({
			scaleX:zoom,
			scaleY:zoom
		}, {
			duration:t.options.duration,
			complete:function(){
				$(window).trigger('dialog.after.zoomout');
			}
		});
		

		//$('#dialog-content-backdrop').foggy();		
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
		
		$closeBtn.click(function(e){
			t.destroy($dc);
		});
		
		if (t.options.closeBtn) $header.append($closeBtn);
		if (t.options.header !== undefined) $header.append("<h3>" + t.options.header + "</h3>");

		$dc.prepend($header);
		
		$dc.append($body);
		
		$dc.append($footer);

		

		
		if (t.options.accept.show)
		{
			$okBtn = $("<button>", { class: 'dialog-ok-btn', type:'button', html:t.options.accept.text });
			
			$okBtn.click(function(e){
				e.preventDefault();
				
				$(this).attr('disabled', 'disabled');
				
				if (t.options.accept.clickFunction !== undefined && typeof t.options.accept.clickFunction == 'function') t.options.accept.clickFunction(e);
				
				$(window).trigger('dialog.ok');
				
				if (t.options.accept.close) t.destroy($dc);
			});
			
			$footer.append($okBtn);
			
		}

		if (t.options.deny.show)
		{
			$denyBtn = $("<button>", { class: 'dialog-deny-btn', type:'button', html:t.options.deny.text });
			
			$denyBtn.click(function(e){
				e.preventDefault();
				
				$(this).attr('disabled', 'disabled');
											
				$(window).trigger('dialog.cancel');
			
				if (t.options.deny.close) t.destroy($dc);
				
				if (t.options.deny.clickFunction !== undefined && typeof t.options.deny.clickFunction == 'function') t.options.deny.clickFunction(e);
				
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
		
		/*\
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
		
	
		$('#dialog-content-container').velocity({ opacity:0 }, {
			complete:function()
			{
				$('#dialog-content-container').remove();
				
				$(window).trigger('dialog.destroy');
			}
		});



		$('#dialog-content-backdrop').velocity({ opacity:0 }, {
			complete:function()
			{
				$(this).remove();
			}
		});
					
		$('body').velocity({
			scaleX:1,
			scaleY:1
		}, {
			duration:t.options.duration,
			complete:function()
			{
				setTimeout(function(){
				t.$el.removeData('Dialog');
				
				
				$('body').css('width', '')
					.css('height', '')
					.css('overflow', '')			
					.css('backgroundColor', t.orgColor)
					.css('backgroundImage', t.orgImg)
					.css('backgroundRepeat', t.orgRepeat);						
				}, 1000)
			
				/*
				$('#dialog-content-wrapper').css('overflow', '');
						
				$('html, body').css('backgroundColor', '');
				
				$('body').css('backgroundColor', this.orgColor);
				$('body').css('backgroundImage', this.orgImg);
				$('body').css('backgroundRepeat', this.orgRepeat);
				
				$('body').css('padding-top', t.paddingTop)
						.css('padding-left', t.paddingLeft)
						.css('padding-bottom', t.paddingBottom)
						.css('padding-right', t.paddingRight);
				
				
				$('#dialog-content-wrapper').css('padding-top', '0px')
						.css('padding-left', '0px')
						.css('padding-bottom', '0px')
						.css('padding-right', '0px');
				
				$(document.body).html( $('#dialog-content-wrapper').html() );
				*/
				


				 
				$('body').redraw();
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
