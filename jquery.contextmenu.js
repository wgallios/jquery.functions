/**
	sample data object
	
	
	data.obj = 
	[
		{ name: 'Add', action: 'add', iconClass:'fa fa-plus' },
		{ name: 'Delete', action: 'delete', iconClass:'fa fa-trash-o' },
		{ name: 'Folders', action: '', iconClass:'fa fa-folder', children:
			[
				{ name: 'Test', action: 'folder-test', id:1, iconClass:'fa fa-folder' },
				{ name: 'Another Test', action: 'folder-anotherTest', id:2, iconClass:'fa fa-folder' }
			] 
		}
	]
	
	// events
	
	element.rightclick - when element for the menu is right clicked on
	
	click - When a mneu item is click
	
*/

;(function($) {

	var defaults = 
	{
		target: undefined, // elements within container that require individual actions
		debug: false,
		ulClass: 'rightclick',
		animation:
		{
			duration:200	
		},
		ajax:
		{
			method: 'get',
			dataType: 'Intelligent Guess'
		},
		data:
		{
			url: '',
			obj: {}
		},
		selected: function(e, item, action, id){ }
	};
	
	function contextMenu (el, options)
	{
		//console.log('New Context Menu Created: ' + options.target);
		
		this.options = $.extend(true, {}, defaults, options);
	
	
		if (this.options.target == undefined) throw new Error("Target is empty!");
		
		this.$el = $(el);
		
		this.index = this.$el.index();
		
		this.containers = [];
		
		this.mx = -1;
		this.my = -1;
		
		// checks if the velocity plugin is enabled
		this.velocity = (jQuery().velocity) ? true : false;

		this._init();
	}
	
	var fn = contextMenu.prototype;

	fn._init = function ()
	{
		var t = this;
		
		
		t.$el.data('showContextMenu', false);
				
		t._trackmouse();
		
		t.stopRegularRightClick();
		t._build(function($c){
				t.bindRightClick($c);
				
				if (t.options.data.url.length > 0) t.getSrc($c); // gets source
				else if (t.options.data.obj.length > 0)
				{
					$c.append(t.parseObj(t.options.data.obj, t.options.ulClass));	
				} 
		}); // creates neccesary HTML elements
	
		

	}
	
	fn._trackmouse = function ()
	{
		var t = this;
		
		$(document).mousemove(function(event) {
			t.mx = event.pageX;
        	t.my = event.pageY;
        	
        	//t.debug("X: " + t.mx + " Y: " + t.my);
		});
	}
	

	fn.refreshTargets = function ()
	{		
		var t = this;
		
		$(t.containers).each(function(i, m){
			$c = $(m);
			t.bindRightClick($c);
		})
	}
	
	fn.bindRightClick = function ($c)
	{
		var t = this;

		//var $target = $(t.options.target);
		
		var $target = $(t.$el.find(t.options.target));
		
		
		$target.each(function(i, el){
			var $el = $(el);
			
			$el.unbind('mousedown');
			
			$el.mousedown(function(e){
	
	            switch (e.which)
	            {
	                case 3:
	
						t.$el.trigger('element.rightclick', $el);
	            
	                    $(document).bind("contextmenu",function(e){ return false; });
	                    
	                    t.currentTarget = e.currentTarget;
	                    
	                    //if (t.options.selected !== undefined && typeof t.options.selected == 'function') t.options.selected(e);
	                    			
	            		if (t.$el.data('showContextMenu') == true)
						{
							t.moveContainerToMouse($c, e);
						}
						else
						{
		                    $c.css('top', String(e.pageY) + 'px');
		                    $c.css('left', String(e.pageX) + 'px');
		                    
		                    t.show($c, e);	
						}
	                    
	
	                    
					break;
	            }
			});			
		});
	}
	

	
	fn._build = function (sf)
	{
		var t = this;
		
		var $container = $("<div>", { class:'right-click-menu', style:"opacity:0;", id:'right-click-menu-' + this.index });
		
		$container.data('contextmenu', true)
			.css('display', 'none');
		
		this.containers.push($container);

        $('body').append($container);
        		
		$container.data('showing', false);
		
		
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
	
	fn.moveContainerToMouse = function ($c, e)
	{
		var t = this;
		
		t.move($c, t.mx, t.my, e);
		return true;
	}
	
	fn.hide = function ($c, sf)
	{
		//if ($el == undefined) $el = this.$el;
		
		var t = this;
		
		$c.data('showing', false);
						
		if (this.velocity)
		{
			$c.velocity({  opacity:0 }, {
				duration: t.options.animation.duration,
				complete: function ()
				{
					$c.css('display', 'none');
					
					t.hideSubMenus($c);
					
					t.$el.data('showContextMenu', false); 

					if (sf !== undefined && typeof sf == 'function') sf();
				}
			});
		}
		else
		{
			$c.fadeOut(400, function(){
							
				$c.css('display', 'none');
				t.$el.data('showContextMenu', false);
				
				t.hideSubMenus($c);
								
				if (sf !== undefined && typeof sf == 'function') sf();
			});
		}
	}
	
	fn.hideSubMenus = function ($c)
	{
		$($c.find('ul ul')).css('opacity', 0).css('display', 'none');
		
		return true;
	}
	
	fn.hideAllMenus = function ()
	{
		var t = this;
		
		
		$(t.containers).each(function(i, m){
			$m = $(m);
			
			if ($m.data('showing'))
			{
				t.hide($m);
							
			}			
		});
		
		return true;
	}
	
	// show container
	fn.show = function ($c, sf, e)
	{
		var t = this;

				
		//if ($el == undefined) $el = this.$el;
		
		
		if (t.$el.data('showContextMenu') == true)
		{
			t.moveContainerToMouse($c, e);
		}

		$c.css('display', '');
		$c.data('showing', true);
					
		if (this.velocity)
		{

			$c.velocity({  opacity:1 }, {
				duration: t.options.animation.duration,
				complete: function ()
				{
					t.$el.data('showContextMenu', true); 
					if (sf !== undefined && typeof sf == 'function') sf();
				}
			});
		}
		else
		{
						
			$c.fadeIn(400, function(){
				t.$el.data('showContextMenu', true); 
								
				if (sf !== undefined && typeof sf == 'function') sf();
			});
		}
	}
	
	fn.move = function ($c, x, y, e)
	{
		var t = this;
		
		if ($c == undefined) return false;
		
		if (this.velocity)
		{
			t.hide($c, function(){
				$c.css('top', y);
				$c.css('left', x);
				
				t.show($c);
			
			});

		}
		else
		{
			$c.css('top', y);
			$c.css('left', x);			
		}
	}

	fn.getSrc = function ($c)
	{
		var t = this;
		
		var o = this.options;
		
		$.ajax({
			url: o.data.url,
			dataType: o.ajax.dataType,
			type: o.ajax.method,
			success: function (data)
			{
				//t.debug(data);
									
				if (o.ajax.dataType.toLowerCase() == 'json')
				{
					var $ul = t.parseObj(data, o.ulClass);
					
					//t.debug($ul);

					$c.html($ul);
					
				}
				else
				{
					// Regular HTML return
					t.html = data;
				
					$c.html(data);
										
					$($c.find('ul ul')).addClass('submenu');
					

				}

			}
		});
	}
	
	fn.parseObj = function (obj, cls)
	{	
		var t = this;
		var o = this.options;
		
		if (cls == undefined) cls = '';
		
		var $ul = $("<ul>", { class: cls });
		
		
		if (obj == undefined) throw new Error("Object data is undefined!");
		
		if (typeof obj == 'object')
		{
			//console.log(obj);
			$(obj).each(function(i, el){

				var $el = $(el);
				//console.log(el.id);

				var $li = t.createLI(el.name, el.action, el.iconClass, el.id);

				if (el.children !== undefined && typeof el.children == 'object')
				{				
					var $childUL = t.parseObj(el.children, 'submenu');
					
					$childUL.css('display', 'none');
					
					//t.debug($childUL);
					
					$li.append("<div class='caret-right'></div>");

					$li.mouseenter(function(e){
						$childUL.css('display', '');
														
						$childUL.velocity({ opacity:1 }, {
							duration: t.options.animation.duration,
							complete: function()
							{

							}
						});
						
						$childUL.mouseleave(function(le){
							$childUL.velocity({ opacity:0 }, {
								duration: t.options.animation.duration,
								complete: function()
								{
									$childUL.css('display', 'none');
								}
							});
						});
					});
										
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
	
	fn.createLI = function (name, action, iconClass, id)
	{	
		if (name == undefined) return false;

		var t = this;
				
		//var $el = t.$el;

		var $li = $("<li>", { class:'' });
		
		if (action !== undefined) $li.data('action', action);

		if (id !== undefined) $li.data('id', id);
		
		if (iconClass !== undefined) $li.prepend("<i class='" + iconClass + "'></i> ");
		
		$li.click(function(e){
			e.preventDefault();
			
			if (action !== undefined) t.$el.trigger('click', action);
			
			//console.log('SF ID: ' + id);
			if (t.options.selected !== undefined && typeof t.options.selected == 'function') t.options.selected(e, t.currentTarget, action, id);
		})
		
		
		$li.append(name);
		
		return $li;
	}
	
	fn.debug = function (msg)
	{
		if (this.options.debug)
		{
			if (console)
			{
				console.log(msg);
			}
		}
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



