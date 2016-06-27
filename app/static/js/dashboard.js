$(function(){
	$.ajax({
		url: '/getAllWishes',
		type: 'GET',
		success: function(resp) {
			console.log(resp);
			var data = JSON.parse(resp);
			var itemsPerRow = 0;
			var div = $('<div>').attr('class', 'row');
			for (var i=0; i<data.length; i++) {

				if (itemsPerRow < 3) {

					if (i==data.length-1) {
						div.append(CreateThumb(
							data[i].wish_id, 
							data[i].wish_title,
							data[i].wish_description,
							data[i].wish_file_path,
							data[i].wish_likes,
							data[i].liked));
						$('.well').append(div);
					} 
					else {
						div.append(CreateThumb(
							data[i].wish_id, 
							data[i].wish_title,
							data[i].wish_description,
							data[i].wish_file_path,
							data[i].wish_likes,
							data[i].liked));
						itemsPerRow++;
					}
				} 
				else {
					$('.well').append(div);
					div = $('<div>').attr('class','row');
					div.append(CreateThumb(
						data[i].wish_id, 
						data[i].wish_title,
						data[i].wish_description,
						data[i].wish_file_path,
						data[i].wish_likes,
						data[i].liked));
					if (i==data.length-1) {
						$('.well').append(div);
					}
					itemsPerRow = 1;

				}
			}
		},
		error: function(resp) {
			console.log(resp);
		}
	});

	$(document).on('click', '[id^="btn_"]', function() {
		$.ajax({
			url:'/addUpdateLike',
			method: 'POST',
			data: {
				wish_id: $(this).attr('id').split('_')[1],
				wish_like: 1
			},
			success: function(resp){
				console.log(resp);
				var obj = JSON.parse(resp);

				if (obj.wish_like == true && obj.wish_likes > 1) {
					$('#span_'+obj.wish_id).html('&nbsp;You & '+(Number(obj.wish_likes)-1)+' Others like this');
				}

				else if (obj.wish_like == true && obj.wish_likes == 1) {
					$('#span_'+obj.wish_id).html('&nbsp;You like this');
				}		

				else {
					$('#span_'+obj.wish_id).html('&nbsp;'+obj.wish_likes+' like this');
				}

			},
			error: function(error){
				console.log(error);
			}
		});

	});
})

function CreateThumb(id, title, desc, filepath, likes, liked) {
	var mainDiv = $('<div>').attr('class','col-sm-4 col-md-4');
	var thumbNail = $('<div>').attr('class', 'thumbnail');
	var img = $('<img>').attr({
		'src':filepath,
		'data-holder-rendered':true,
		'style':'height:150px; width:150px; display:block;'
	});
	var caption = $('<div>').attr('class', 'caption');
	var title = $('<h3>').text(title);
	var desc = $('<p>').text(desc);
	var p = $('<p>');
	var btn = $('<button>').attr({
		'id':'btn_'+id,
		'type':'button',
		'class':'btn btn-danger btn-sm'
	});
	var span = $('<span>').attr({
		'class':'glyphicon glyphicon-thumbs-up',
		'aria-hidden':'true'
	});

	var likeSpan = $('<span>').attr({
		'id':'likeSpan',
		'aria-hidden':'true',
		'id': 'span_'+id
	});

	if (liked == true) {
		s = '';
		s = (likes -1) ? ' & '+(Number(likes)-1):'';
		likeSpan.html(
		'&nbsp;You'+ s +' like this');
	} else {
		likeSpan.html(
		'&nbsp;'+ likes +' like this');
	}
	p.append(btn.append(span));
	p.append(likeSpan);
	caption.append(title);
	caption.append(desc);
	caption.append(p);

	thumbNail.append(img);
	thumbNail.append(caption);
	mainDiv.append(thumbNail);
	return mainDiv;
}