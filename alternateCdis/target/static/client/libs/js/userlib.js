export function getUser(iduser){
	var uObj = null;
	var request = $.ajax({
		  url: "/ncdis/service/data/getUser?iduser="+iduser+"&language=en",
		  type: "GET",
		  async: false,
		  dataType: "json"
		});
		request.done(function( json ) {
			uObj = json.objs[0];
		});

		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
		//
	return uObj;
}