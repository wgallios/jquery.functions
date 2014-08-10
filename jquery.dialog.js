/**
* Dialog does utilzie Bootstrap Styles
*/

;(function($){
 
 	var defaults = 
	{
		target: 'body',
		header: 'Confirm',
		zoom: 90,
		height:150,
		width:300,
		bounce:20,
		duration:300,
		ready: function (dialog){},
		backdrop:
		{
			show: true,
			opacity: 0.6,
			className: 'modal-backdrop fade in'
		},
		closeBtn: true,
		containerClass: 'dialog-container',
		accept:
		{
			show: true,
			close: true,
			text: "Ok",
			className: 'btn btn-primary',
			clickFunction: function() {}
		},
		deny:
		{
			show: false,
			close: true,
			text: "Cancel",
			className: 'btn btn-default',
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
		
		t.buildDialog(msg, $('body'));

		/*		
		t.wrapContent(function($wrap, $container){
			t.zoomOut($wrap);
			t.buildDialog(msg, $container);
		});
		
		*/	
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

		$('#dialog-content-backdrop').velocity({ opacity:t.options.backdrop.opacity, height:backDropH + '%'});
		
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
		
		if (this.options.backdrop.show)
		{
			$backdrop = $("<div>", { id:'dialog-content-backdrop', class: this.options.backdrop.className });
			$container.append($backdrop);
		}
		
		
		//$wrapBack = $("<div>", { id: 'dialog-content-container-backdrop' });
		
		$wrap = $("<div>", { id: 'dialog-content-container' });
		
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
		
		$wrap.append($dc);

		if (t.options.accept.show)
		{
			$okBtn = $("<button>", { class: this.options.accept.className, type:'button', html:t.options.accept.text });
			
			$okBtn.click(function(e){
				e.preventDefault();
				
				$okBtn.disableSpin();
				
				if (t.options.accept.clickFunction !== undefined && typeof t.options.accept.clickFunction == 'function') t.options.accept.clickFunction(e);
				
				$(window).trigger('dialog.ok');
				
				if (t.options.accept.close) t.destroy($dc);
			});
			
			$footer.append($okBtn);
			
		}

		if (t.options.deny.show)
		{
			$denyBtn = $("<button>", { class: this.options.deny.className, type:'button', html:t.options.deny.text });
			
			$denyBtn.click(function(e){
				e.preventDefault();
				
				$denyBtn.disableSpin();
											
				$(window).trigger('dialog.cancel');
			
				if (t.options.deny.close) t.destroy($dc);
				
				if (t.options.deny.clickFunction !== undefined && typeof t.options.deny.clickFunction == 'function') t.options.deny.clickFunction(e);
				
			});
			
			$footer.prepend($denyBtn);
			
		}

		var bounce = t.options.bounce;

		var dcTop = ($(window).height() / 2) - (t.options.height / 2);		


		var html = "<span>" + msg + '</span>';
		
		$body.html(html);
		
		$container.append($wrap);
		
		$dc.velocity({ opacity:1 }, {
			duration: t.options.duration,
			complete: function(){
				if (t.options.ready !== undefined && typeof t.options.ready == 'function') t.options.ready($dc);
			}
		});
		
		return $dc;
	}
	
	fn.destroy = function ($dc)
	{
		var t = this;
		
	
		$('#dialog-content-container').velocity({ opacity:0 }, {
			duration: t.options.duration,
			complete:function()
			{
				$('#dialog-content-container').remove();
				$(t).removeData();
								
				$(window).trigger('dialog.destroy');
			}
		});

		$('#dialog-content-backdrop').velocity({ opacity:0 }, {
			duration: t.options.duration,
			complete:function()
			{
				$(this).remove();
			}
		});
		
		/*
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
			

				 
				$('body').redraw();
			}
		});
		*/
		
		return true;	
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


Window.prototype.Confirm = function (msg, acceptFunction, denyFunction, header)
{
	if (header == undefined) header = 'Confirm';
	
	return jQuery.dialog.constructor(this, msg, { 
		header: header,
		accept:{
			close: true,
			clickFunction: function(e)
			{
				if (acceptFunction !== undefined && typeof acceptFunction == 'function') acceptFunction(e);
			}
		},
		deny:{
			show: true,
			clickFunction: function(e)
			{
				if (denyFunction !== undefined && typeof denyFunction == 'function') acceptFunction(e);
			}
		}
	});
}