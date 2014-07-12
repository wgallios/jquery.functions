/**
* Bootstrap Input Spinner
*/

;(function($){
 
 	var defaults = 
	{
		width:'100%',
		prefix: '',
		min:0,
	    max:99999,
		increment:1,
		displayWarning: true,
		invalidUpdate: true
	};
	
	function inputSpinner (el, options)
	{

		this.options = $.extend(true, {}, defaults, options);
		this.$el = $(el);

		this.init();

		return this;	
	}	
	
	var fn = inputSpinner.prototype;
	
	fn.init = function ()
	{
		var $input = this.build();
		return $input;
	}
	
	fn.increase = function ($input)
	{
		var o = this.options;
		var curVal = $input.val();
		
		if (curVal == undefined || curVal.length == 0) curVal = 0;
		
		if (isNaN(curVal))
		{
			//if (o.displayWarning) Warning(curVal + " is not a number! Unable to increase.");
			Warning(curVal + " is not a number! Unable to increase.");
			return false;
		}
		
		var newVal = parseInt(curVal) + o.increment;
		
		if (newVal > o.max) return false;
		
		$input.val(newVal);
		this.updateOrgInput(newVal);
				
		this.$el.trigger('input.spinner.increase', newVal);
		
		return	newVal;
	};
	
	fn.decrease = function ($input)
	{
		var o = this.options;
		
		var curVal = $input.val();

		if (curVal == undefined || curVal.length == 0) curVal = 0;
		
		if (isNaN(curVal))
		{
			//if (o.displayWarning) Warning(curVal + " is not a number! Unable to decrease.");
			Warning(curVal + " is not a number! Unable to decrease.");
			
			return false;
		}
		
			
		var newVal = parseInt(curVal) - o.increment;
		
		if (newVal < o.min) return false;
		
		this.updateOrgInput(newVal);
		$input.val(newVal);

		this.$el.trigger('input.spinner.increase', newVal);
		
		return newVal;	
	}
	
	/**
	* builds input spinner
	*/
	fn.build = function ()
	{
		var t = this;
		
		t.$el.hide(); // hides original element

		var initVal = this.$el.val();
		
		var $container = $("<div>", { class:'inputSpinnerContainer' });

		var $prefix = $("<div>", { class: 'inputSpinnerPrefix' });

		var $upBtn = $("<button>", { type:'button', class:'inputSpinnerUpBtn' });
		
		var $dnBtn = $("<button>", { type:'button', class:'inputSpinnerDnBtn' });
		
		$upBtn.html("+");
		$dnBtn.html("-");
				
		var $btnContainer = $("<div>", { class:'inputSpinnerBtnContainer' });
		
		$btnContainer.prepend($upBtn);
		$btnContainer.append($dnBtn);
				
		var $input = $("<input>", { class:'inputSpinner' });

		if (initVal !== undefined) $input.val(initVal);

		this.$input = $input;
		
		$upBtn.click(function(e){
			t.increase($input);
		});
		
		$dnBtn.click(function(e){
			t.decrease($input);
		});

		$container.css('width', t.options.width);

		this.bindEvents($input);

		$container.prepend($input);
		
		$container.append($btnContainer);
		
		if (t.options.prefix.length > 0)
		{
			$prefix.html(t.options.prefix);
			
			$container.prepend($prefix);
		}
		
		$container.insertAfter(this.$el);
	
		return $input;
	}
	
	fn.validateInput = function ($input)
	{
		var v = $input.val();
		var o = this.options;
		
		if (isNaN(v)) return false;
		
		if (parseInt(v) > o.max) return false;
		if (parseInt(v) < o.min) return false;
				
		return true;
	}
	
	fn.updateOrgInput = function (v)
	{
		if (v == undefined) return false;
		
		this.$el.val(v);
		
		this.$el.trigger('input.spinner.updated', v);
		
		return true;
	}
	
	fn.setVal = function (v)
	{
		this.$input.val(v);
		
		return true;
	}
	
	fn.bindEvents = function ($input)
	{
		var t = this;
		
		if ($input == undefined) throw new Error("Input is undefined! not able to bind events");
		
		$input.bind('change keyup', function(e){
			var valid = t.validateInput($input);

			if (!valid && t.options.displayWarning) Warning("Input value is not valid!<br><b>Min: </b> " + t.options.min + "<br><b>Max: </b> " + t.options.max);
			
			if (t.options.invalidUpdate) t.updateOrgInput($input.val());
			
		});
		
		return true;
	}
	
	// jquery adapter
	$.fn.inputSpinner = function (options)
	{
		return this.each(function(){
			if (!$(this).data('inputSpinner'))
			{
				$(this).data('inputSpinner', new inputSpinner(this, options));
			}
		});
	};
	
	
	$.inputSpinner = fn;
	
})(jQuery);