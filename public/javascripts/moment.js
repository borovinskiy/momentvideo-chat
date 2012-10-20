function togglePlaylist () {
  menu = document.getElementById ("menu");
  flash_div = document.getElementById ("flash_div");
  if (menu.style.display == "none") {
    menu.style.display = "block";
    flash_div.style.paddingRight = "200px";
  } else {
    menu.style.display = "none";
    flash_div.style.paddingRight = "0px";
  }
}

function thisMovie(movieName) {
  if (navigator.appName.indexOf("Microsoft") != -1) {
    return window[movieName];
  } else {
    return document[movieName];
  }
}



$(document).ready(function() {
      var menu = document.getElementById ("menu");

      $.getJSON ("playlist.json",
	  function (data) {
	      var playlist = data;
//alert(data[0]);
	      var class_one = "menuentry_one";
	      var class_two = "menuentry_two";
	      var cur_class = class_one;
	      for (var i = 0; i < playlist.length; ++i) {
		  var item = playlist [i];
		  var entry = document.createElement ("div");
		  entry.className = cur_class;
		  entry.style.padding = "10px";
//                      entry.style.backgroundColor = color;
		  entry.style.textAlign = "left";
		  entry.style.verticalAlign = "bottom";
		  entry.onclick =
			  (function (uri, stream_name) {
				   return function () {
//					   thisMovie('MySubscriber').setSource(uri, stream_name);
                                        if ( $.browser.msie ) { 
						document.getElementById('MySubscriberObject').setSource(uri, stream_name);
					}
                                        else {
						document.getElementById('MySubscriberEmbed').setSource(uri, stream_name);
					}
				   };
			   }) (item [1], item [2]);
		  entry.innerHTML = item [0];
		  menu.appendChild (entry);

		  if (cur_class == class_one)
		      cur_class = class_two;
		  else
		      cur_class = class_one;
	      }
	  }
      );
});
