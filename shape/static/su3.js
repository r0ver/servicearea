/* 

JSON get and Post using vanilla javascript
http://stackoverflow.com/questions/5350377/how-to-make-an-ajax-request-to-post-json-data-and-process-the-response

Just to namespace our functions and avoid collisions */
var _SU3 = _SU3 ? _SU3 : new Object();

// Does a get request
// url: the url to GET
// callback: the function to call on server response. The callback function takes a
// single arg, the response text.
_SU3.ajax = function(url, callback){
    var ajaxRequest = _SU3.getAjaxRequest(callback);
    ajaxRequest.open("GET", url, true);
    ajaxRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    ajaxRequest.send(null); 
};

// Does a post request
// callback: the function to call on server response. The callback function takes a
// single arg, the response text.
// url: the url to post to
// data: the json obj to post
_SU3.postAjax = function(url, callback, data) {
   var ajaxRequest = _SU3.getAjaxRequest(callback);
   ajaxRequest.open("POST", url, true);
   ajaxRequest.setRequestHeader("Content-Type", 'application/json' );
   ajaxRequest.send(data);    
};

// Returns an AJAX request obj
_SU3.getAjaxRequest = function(callback) {

    var ajaxRequest;

    try {
        ajaxRequest = new XMLHttpRequest();
    } catch (e) {
        try { 
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e){
                return null;
            }
        }
    }

    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState == 4) {      
           // Prob want to do some error or response checking, but for 
           // this example just pass the responseText to our callback function
           callback(ajaxRequest.responseText);
        }
    };


    return ajaxRequest;
}