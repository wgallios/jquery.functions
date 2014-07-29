<h1>jQuery Functions</h1>

Extra jQuery functions I use.

<h2>Uploader</h2>

<p>Uploader Replaces HTML file uploader</p>

<h3>Usage</h3>
	
	var uploader = $("input[type='file']").uploader({
		debug: false,
		uploadUrl: '/uploade.php',
		containerClass: 'uploader-dropzone',
		inheritClasses: false,
		filePostKey: 'file',
		showProgress: true,
		successFunction: function(){},
		CSRF:
		{
			enabled: true,
			key: 'token', 
			val: ''
		}
	}).data('uploader');
	
	var uploadData = uploader.serialize();
	
<h3>Events</h3>

<code>dragenterr</code>
<code>drop</code>
<code>upload.percent.update</code>
<code>upload.complete</code>
	
<h2>Alerts</h2>

<p>Easily  display notifcations</p>

<h3>Usage</h3>
	
	var options = {
		debug: false,
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
		}
	};
	
	Warning("Alert Message!"[, 'Alert'[, options]]);
	Success("Success Message"[, 'Success'[, options]]);
	Danger("Dangerr! Oh noooo"[, 'Danger'[, options]]);
	Info("Information Message"[, 'Info'[, options]]);

<h3>HTML 5 Markup</h3>
	<alert data-type='warning' data-heading='Alert' data-msg='This contact has no attachments.' data-options='{"clearTimeoutSeconds":"0"}'></alert>
	
<h2>License</h2>

The MIT License (MIT)

Copyright (c) 2014 William Gallios

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
