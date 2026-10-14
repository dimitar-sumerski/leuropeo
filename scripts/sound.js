
var folder;
var vol = 5; // sila na zwuka
var songlist; // masiv s lista na pesnite, neobhodim za vizualizaciata i sabitiata
var songs = new Array(); //Tova e masiva s imenata na pesnite / failovete
var current_song = 0; // start at song 0 in playlist
var media; // holds the filename of the current song


document.write('<DIV ID="player"></DIV>');

function loadsongs()
{
	songlist = $('album').getElements('li');

	songlist.each( function(item) 
		
		{ 
			//Pylni masiwa s imena na pesnite	
			songs.include(item.getElement('.name').get('text'));
			//Zalaga iventi na pesnite w spisaka	
			item.addEvent('click',function() 
				{
									   
				media = item.getElement('.name').get('text');	
				current_song = songlist.indexOf(item);
				if ($('player').get('html') != '')
				stop_song();
				play_song();
								   
				});
			volume_slider();
				
		});

	media = songs[0]; // media becomes first song in list

}  // function loadsongs()

function load(media)
{  

media = folder + media + '.mp3';

if (detect_browser() == "MSIE" || detect_browser() == "Netscape")
{ 
$('player').set('html', '<object id="sound"' 
+ 'classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6"'
+ 'style="position:absolute;left:-1000;top:-1000; visibility: hidden"'
+ 'codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701"'
+ 'standby="Loading Microsoft Windows Media Player components..."'  
+ 'type="application/x-oleobject">'                
+ '<param name="url" value="'+media+'">'      
+ '<param name="volume" value="100">'            
+ '<embed id="sound" type="application/x-mplayer2" src="'+media+'"' 
+ 'style="position:absolute;left:-1000;top:-1000; visibility: hidden"'
+ 'classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6"'
+ 'pluginspage="http://www.microsoft.com/Windows/MediaPlayer/"'
+ 'type="application/x-mplayer2"'
+ 'url="'+media+'"' 
+ 'volume="100"' 
+ '> </embed>'
+ '</object>');
}
else // if Safari or Firefox, then load Quicktime controls
{
$('player').set('html', '<OBJECT id="sound" '
+ 'CLASSID="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" '
+ 'WIDTH="160" HEIGHT="144" '
+ 'style="position:absolute;left:-1000;top:-1000; visibility: hidden"'
+ 'CODEBASE="http://www.apple.com/qtactivex/qtplugin.cab">'
+ '<PARAM name="SRC" VALUE="'+media+'">'
+ '<PARAM name="AUTOPLAY" VALUE="true">'
+ '<PARAM name="CONTROLLER" VALUE="false">'
+ '<PARAM name="VOLUME" VALUE="100">'
+ '<PARAM name="ENABLEJAVASCRIPT" VALUE="true">'
+ '<PARAM name="TYPE" VALUE="audio/wav">'
+ '<embed classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" ' 
+ 'name="sound" '
+ 'id="sound" ' 
+ 'style="position:absolute;left:-1000;top:-1000; visibility: hidden"'
+ 'src="'+media+'" ' 
+ 'pluginspage="http://www.apple.com/quicktime/download/" '
+ 'volume="100" ' 
+ 'enablejavascript="true" '
+ 'type="audio/wav" '
+ 'height="16" '
+ 'width="200" '
+ 'autostart="true"'
+ '> </embed>'
+ '</OBJECT>');
}

} // end function load(media)

function play_song()
{
	// Check to see if current song has stopped
	if ($('player').get('html') == '')
	{
		//alert(current_song);
		load(media);
		display_song();	
		volume(vol);
		$('pause_btn').setStyle('background','url(../img/pause.gif) center top no-repeat');
		check_time.delay(1000);
	}
	
}  // end function play

function stop_song()
{
	
	if (document.sound) 
	{	
		// Call stop function if available in quicktime player
		if (typeof document.sound.Stop == 'function')
		{
			document.sound.Stop();
		}

		// Call stop function if available in Media player
		else if (typeof document.sound.controls == 'object')
		{
			document.sound.controls.Stop();
		}
	}
	
	// Wipe out contents of player DIV
	$('player').set('html','');
	
} // end function stop()

function pause_song()
{

	// if a song is not playing then just return
	if ($('player').get('html') == '') 
	{	
		play_song();
	} 
	else {
	
		// if IE or Netscape then Media Player Pause Controls
		if (detect_browser() == "MSIE" || detect_browser() == "Netscape")
		{ 	
				// if pause
			if ($('pause_btn').getStyle('background').match("pause"))
			{
		
				document.sound.controls.pause();
				$('pause_btn').setStyle('background', 'url(../img/play.gif) center top no-repeat');

			}
			else // if unpause
			{
				document.sound.controls.play();
				$('pause_btn').setStyle('background', 'url(../img/pause.gif)');
			}
		}
		else // If Firefox or Safari then use Quicktime Stop (Pause)	
		{
				
			// if pause
			if ($('pause_btn').getStyle('background').match("pause"))
			{

				// Tova e hak za Opera, koiato ne razpoznawa funkciata stop;
				if (typeof document.sound.Stop != 'function')
						{
							stop_song();
						}
				
				$('pause_btn').setStyle('background', 'url(../img/play.gif) center top no-repeat');
				document.sound.Stop();			
				
			}
			else // if unpause
			{
				document.sound.Play();
				$('pause_btn').setStyle('background', 'url(../img/pause.gif)');
			}
		}
	}
}  // end function pause_song()

function next_song(dir)
{
	playlist_length = songs.length - 1;
	
	// stop the current song if playing
	if ($('player').get('html') != '')
		stop_song();
	
	if (dir == 1) // previous
	{
		current_song--;
		if (current_song < 0) 
			current_song = playlist_length; // loop to last song
	}
	else // next
	{
		current_song++;
		if (current_song > playlist_length)
			current_song = 0; // loop to first song
	}
	
	media = songs[current_song];
	play_song();

} // end function next_song(dir)

function volume(step)
{
	
	// if a song is not playing then just return
	if ($('player').get('html') == '' || detect_browser() == "Opera") 
		return;

	// if IE or Netscape then Media Player Volume Controls
	if (detect_browser() == "MSIE" || detect_browser() == "Netscape")
		{ 
			document.sound.settings.volume = step * 10;
		}
		
		else // if Firefox or Safari then Quicktime volume controls
		{
			document.sound.SetVolume(step * 30);
		}	
	
} // end function volume(dir)

function display_song()
{
	
	songlist.each(
		function(item) 
		{
	
			if (item.getElement('.name').get('text') == media) {
				item.getElement('.name').setStyle('background','url(../img/play_state.gif) 99% 51% no-repeat');	
				item.getElement('.name').setStyle('color','#666');
			}
			
			else {
				item.getElement('.name').setStyle('background','none');	
					item.getElement('.name').setStyle('color','#000');
			}
		});

}  // end function display_song()

function check_time()
{
	// This function get's the end time
	// so that if a song reaches the end it will play the
	// next song
	var time;
	var duration;
	var song_status;
	var mins; // used for quicktime
	var secs; // used for quicktime
	var scale; // used for quicktime
	
	// if IE or Netscape then Media Player 
	if (detect_browser() == "MSIE" || detect_browser() == "Netscape")
	{
		
		song_status = document.sound.playState;
		time = document.sound.controls.currentPositionString;
		duration = document.sound.currentMedia.durationString;
		
	}	
	else  // Firefox or Safari
	{
	
	song_status = document.sound.GetPluginStatus();	
	if (song_status.toLowerCase() != 'playable' &&
		song_status.toLowerCase() != 'complete')
	{	
		check_time.delay(250); // recall this function every 250 ms
		return;
	}
	
	time = document.sound.GetTime();
	duration = document.sound.GetDuration();
	scale = document.sound.GetTimeScale();
	time = Math.floor(time*(1/scale));  // convert to seconds
	duration = Math.floor(duration*(1/scale));  // converts to seconds
	// convert seconds into mm:ss
	mins = Math.floor(time / 60);
	secs = time - (mins * 60);	
	time = mins + ':' + secs;
	mins = Math.floor(duration / 60);
	secs = duration - (mins * 60);	
	duration = mins + ':' + secs;
		
	}
	
	// This is for Firefox
	if (time == duration) // if at end of song
	{	
		next_song(2); // then play next song in playlist
		return;
	}
	// This is for Ie
	if (song_status == 1) // song stopped
	{	
		next_song(2);
		return;
	}
	
	check_time.delay(250); 
	
} // end function display_time()

function volume_slider() {
	
	var SliderObject = new Slider('slider', 'knob', 
		{
	   	range: [0, 10],
		snap: false,
		steps: 10,
		offset: 0,
		wheel: false,
		mode: 'horizontal',
		
		onChange: function(step) {
		vol = step;
		volume(step);
		}

	});
	
	$('knob').setStyle('left','96px');	
	$('knob').setStyle('position','absolute');	
	
} // end function volume_slider

function detect_browser()
{
	var browser_name = navigator.userAgent;
	// We have to check for Opera first because
	// at the beginning of the userAgent variable
	// Opera claims it is MSIE. 
	
	if (browser_name.indexOf("Opera")!= -1)
		browser_name = "Opera";
	else if (browser_name.indexOf("Firefox")!= -1)
		browser_name = "Firefox";
	else if (browser_name.indexOf("MSIE")!= -1)
		browser_name = "MSIE";
	else if (browser_name.indexOf("Netscape")!= -1)
		browser_name = "Netscape";
	else if (browser_name.indexOf("Safari")!= -1)
		browser_name = "Safari";
	
	return browser_name;
	
} // end function detect_browser()



function album_description() {
var effect = new Fx.Tween($('cover'), {link: 'cancel', duration: '1000'});	
$('cover').addEvent('mouseenter', function() {effect.start('opacity', 0); });
$('cover').addEvent('mouseleave', function() {effect.start('opacity', 1);});
}





