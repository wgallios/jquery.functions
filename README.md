<h1>jQuery Functions</h1>

Extra jQuery functions I use.

<h3>Uploader</h3>

<h4>Usage</h4>

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
	
<h3>License</h3>

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