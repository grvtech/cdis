var optionSelected = false;
var searchObj = $("#search").autocomplete({
			source: function( request, response ) {
				//alert(request.term);
		      $.ajax({
		          dataType: "json",
		          type : 'GET',
		          url: '/tools/json/search.json',
		          success: function(data) {
		        	  //$('#search').removeClass('ui-autocomplete-loading');  // hide loading image
			          //alert(data.objects.length);
			          //console.log( data ); 
		        	  var array = data.error ? [] : $.map(data.objects, function(m) {
							return {
								fname: m.fname,
								lname: m.lname,
								chart: m.chart,
								ramq: m.ramq
							};
						});
						response(array);
		          },
		        error: function(data) {
		        	//alert('qqqqq');
		            //$('#search').removeClass('ui-autocomplete-loading');  
		        }
		      });
		    },
		    open: function() {
		    	//blur the cdisuser div
		    	$(".cdisuser").fadeTo( "fast", 0.23 );
		    },
		    close: function() {
		    	//alert('3');
		    	if(!optionSelected){
		    		$(".cdisuser").fadeTo( "fast", 1 );
		    		this.value = "";
		    	}
		    },
		    focus:function(event,ui) {
		    	//highlight the item
		    },
		    select: function( event, ui ) {
		    	//change the interface to patient 
		    	$(".cdisuser").hide();
		    	optionSelected = true;
		    	//alert(this.value +"   "+ ui.item.fname);
		    	//console.log(ui);
		    },
		    search: function( event, ui ) {
		    	//detect if not alpha numeric and return error
		    	//alert("222"+this.value);
		    	if (this.value == "a") {
		    		return false;
                }
		    }
		    
		  }).data("ui-autocomplete")._renderItem = function(ul, item) {
				var $a = $("<a></a>");
				$("<span class='m-year'></span>").text(item.fname).appendTo($a);
				$("<span class='m-name'></span>").text(item.lname).appendTo($a);
				$("<span class='m-cast'></span>").text(item.ramq).appendTo($a);
				$("<span class='m-chart'></span>").text(item.chart).appendTo($a);
				return $("<li></li>").append($a).appendTo(ul);
			};