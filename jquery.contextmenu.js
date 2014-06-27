/**
	sample data object
	
	
	data.obj = 
	{
		{ name: 'Add', action: 'add', iconClass:'fa fa-plus' },
		{ name: 'Delete', action: 'delete', iconClass:'fa fa-trash-o' },
		{ name: 'Folders', action: '', iconClass:'fa fa-folder', children:
			{
				{ name: 'Test', action: 'folder-test', iconClass:'fa fa-folder' },
				{ name: 'Another Test', action: 'folder-anotherTest', iconClass:'fa fa-folder' }
			} 
		}
	}
*/

;(function($) {

	var defaults = 
	{
		debug: false,
		ajax:
		{
			method: 'get'	
		},
		data:
		{
			url: '',
			obj: {},
			ulClass: 'rightclick'
		},
		selected: function(){ }
	};
	
	function contextMenu (el, options)
	{
		this.options = $.extend(true, {}, defaults, options);
		
		this.$el = $(el);
		
		this.index = this.$el.index();
		
		// checks if the velocity plugin is enabled
		this.velocity = (jQuery().velocity) ? true : false;

		this.init();
	}
	
	var fn = contextMenu.prototype;

	fn.init = function ()
	{
		var t = this;
		
		t.stopRegularRightClick();
		t.build(function($c){
				t.bindRightClick();
				
				if (t.options.data.url.length > 0) t.getSrc(); // gets source
				else if (t.options.data.obj.length > 0) t.parseObj();
		}); // creates neccesary HTML elements
	
		

	}
	
	fn.bindRightClick = function ()
	{
		var t = this;
		var $c = this.$container;
		
		this.$el.unbind('mousedown');
		
		this.$el.mousedown(function(e){
            // console.log(e.which);
            switch (e.which)
            {
                case 3:

                    $(document).bind("contextmenu",function(e){ return false; });
                    
                    $c.css('top', String(e.pageY) + 'px');
                    $c.css('left', String(e.pageX) + 'px');
                    
                    t.show();
                    
				break;
            }
		});
	}
	
	fn.build = function (sf)
	{
		var $container = $("<div>", { class:'right-click-menu', style:"opacity:0;", id:'right-click-menu-' + this.index });
		
		$container.attr('data-contextmenu', 'true');
		

		this.$container = $container;

        $('body').append($container);
        
        // sets data that menu is not showing
		this.$container.data('showContextMenu', false);
		
		
        if (sf !== undefined && typeof sf == 'function') sf($container);
        
        return $container;
	}
	
	fn.stopRegularRightClick = function ()
	{
		var $el = this.$el;
		var t = this;
		
		var showing = $el.data('showContextMenu')
		
        $('body').mousedown(function(e){
    
            if (e.which == '1')
            {
                // clears previous right click if showing
                if ($el.data('showContextMenu') == true)
                {
                	
                    // alert('clear it');
                    t.hideAllMenus();

                }
            }
        });

	}
	
	fn.hide = function (sf, $el)
	{
		if ($el == undefined) $el = this.$el;
		
		if (this.velocity)
		{
			this.$container.velocity({  opacity:0 }, {
				complete: function ()
				{
					$el.data('showContextMenu', false); 
					if (sf !== undefined && typeof sf == 'function') sf();
				}
			});
		}
		else
		{
			this.$container.fadeOut(400, function(){
				$el.data('showContextMenu', false); 
								
				if (sf !== undefined && typeof sf == 'function') sf();
			});
		}
	}
	
	fn.hideAllMenus = function ()
	{
		var t = this;
		var $nodes = $("div[data-contextmenu='true']");
		
		$nodes.each(function(i, m){
			$m = $(m);
			t.hide(undefined, $m);
			
		})
		
		this.$container.data('rightClickMenu', true);
	}
	
	// show container
	fn.show = function (sf, $el)
	{
		var t = this;
		
		if ($el == undefined) $el = this.$el;
		
		if ($el.data('showContextMenu') == true)
		{
			t.move(e.pageX, e.pageY, $el);
			return true;
		}
		
		if (this.velocity)
		{
			this.$container.velocity({  opacity:1 }, {
				complete: function ()
				{
					$el.data('showContextMenu', true); 
					if (sf !== undefined && typeof sf == 'function') sf();
				}
			});
		}
		else
		{
			this.$container.fadeIn(400, function(){
				$el.data('showContextMenu', true); 
								
				if (sf !== undefined && typeof sf == 'function') sf();
			});
		}
	}
	
	fn.move = function (t, l, $el)
	{
		if ($el == undefined) $el = this.$el;
		
		if (this.velocity)
		{
			$el.velocity({ top:t, left:l });
		}
		else
		{
			$el.css('top', t);
			$el.css('left', l);			
		}
	}

	fn.getSrc = function ()
	{
		var t = this;
		
		var o = this.options;
		
		$.ajax({
			url: o.data.url,
			type: o.ajax.method,
			success: function (html)
			{
				t.html = html;
				
				t.$container.html(html);
			}
		});
	}
	
	fn.parseObj = function (obj, cls)
	{	
		var t = this;
		var o = this.options;
		
		if (cls == undefined) cls = '';
		
		var $ul = $("<ul>", { class: cls });
		
		
		if (o.data.obj == undefined) throw new Error("Object data is undefined!");
		
		if (typeof o.data.obj == 'object')
		{
			$(o.data.obj).each(function(i, el){
				var $el = $(el);

				var $li = t.createLI($el.name, $el.action, $el.iconClass);
				
				if ($el.chilren !== undefined && typeof $el.children == 'object')
				{
					var $childUL = t.parseObj($el.children);
					
					$li.append($childUL);
				}
				
				$ul.append($li);

			});
		}
		
		return $ul;
	}
	
	fn.parseChildItems = function (children)
	{
		if (children == undefined) return false;
	}
	
	fn.createLI = function (name, action, iconClass)
	{
		if (name == undefined) return false;
		
		var $li = $("<li>", { class:'' });
		
		if (action !== undefined) $li.data('action', action);
		
		if (iconClass !== undefined) $li.prepend("<i class='" + iconClass + "'></i> ");
		$li.append(name);
		
		return $li;
	}

	// jquery adapter
	$.fn.contextMenu = function (options)
	{
		return this.each(function(){
			if (!$(this).data('contextMenu'))
			{
				$(this).data('contextMenu', new contextMenu(this, options));
			}
		});
	};
	
	
	$.contextMenu = fn;

})(jQuery);



