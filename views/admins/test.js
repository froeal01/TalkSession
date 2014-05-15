	function prettifyDate(date){
			var formattedDate = date.match(/^(\d{4}-\d\d-\d\d)/);
		 	return formattedDate[1]
	  }	

	var date = new Date();