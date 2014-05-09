$(function(){

	$('#calendar').fullCalendar({
	});	


	var grabDateLink = function (){
		$('.fc-day').on('click', function(){
			var dateClicked = $(this).data("date")
			window.location.href = '/events/' + dateClicked;
			return false;
		});
	}
grabDateLink();

});

