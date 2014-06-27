(function($){
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
})(jQuery);


