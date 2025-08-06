export function getClientIp(){
	var request = $.ajax({
		  url: "/ncdis/service/data/getClientIp",
		  type: "GET",
		  async : false,
		  dataType: "json"
		});
		request.done(function( json ) {
			
		});
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
	//window.location = "index.html";
		gti();
}