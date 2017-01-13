$(document).ready(function() {
    var host = window.location.hostname;
    var grant = "client_credentials";
    var wellknown = window.location.protocol + "//" + window.location.hostname + "/.well-known/smoope";

    $.ajax({
	url: wellknown,
	async: false,
	success: function(data) {
	    $("#server").val(data.tokenEndpoint);
	},
	error: function() {
	    // fallback dev oauth
	    $("#server").val("http://10.35.10.10:8083/token");
	}
    });
    
    $('#passwordGrant').click(function(e) {
	$("#clientid").val("smoope-web");
	$("#clientsecret").val("");
	$("#username").prop('disabled', false);
	$("#password").prop('disabled', false);
	grant = "password";
    });

    $("#clientGrant").click(function(e) {
	$("#clientid").val("");
	$("#clientsecret").val("");
	$("#username").prop('disabled', true);
	$("#password").prop('disabled', true);

	grant = "client_credentials";
    });
    
    $('#form-signin').submit(function(event){
	var data = 'grant_type=' + grant;
	if (grant === "password") {
	    data = 'password='+$("#password").val()+'&username='+$("#username").val() + '&' + data;
	}

	event.preventDefault();
	$.ajax({
	    url : $("#server").val(),
	    type : 'POST',
	    async : false,
	    data : data,
	    headers : {
		Authorization : 'Basic ' + btoa($("#clientid").val() + ':' + $("#clientsecret").val()),
		"Content-Type" : 'application/x-www-form-urlencoded',
		"Accept" : 'application/json'
	    },
	    dataType : 'json',
	    success : function(data) {
		document.cookie = "MyHalBrowserToken=" + data.access_token;
		window.location.href = 'browser.html'
	    }
	});
    });
});
