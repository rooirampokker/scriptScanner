
function removekids(ele){
	while(ele.childNodes.length>0){
		ele.removeChild(ele.childNodes[0]);
	}
}

/*
Script for dropdown menus
*/

sfHover = function() {
	// workaround for admin pages which don't have the same side menu
function toggler() {
     if  (document.getElementById('doReplace').checked==true) {
          document.getElementById('replaceRow').style.display='table-row';
      } else {
          document.getElementById('replaceRow').style.display='none';
      }
 }	if(!document.getElementById("nav") || !document.getElementById("nav").getElementsByTagName("LI")) return true;
	var sfEls = document.getElementById("nav").getElementsByTagName("LI");
	for (var i=0; i<sfEls.length; i++) {
		sfEls[i].onmouseover=function() {
			this.className+=" sfhover";
		}
		sfEls[i].onmouseout=function() {
			this.className=this.className.replace(new RegExp(" sfhover\\b"), "");
		}
	}
}
if (window.attachEvent) window.attachEvent("onload", sfHover);

function removekids(ele) {
	while(ele.childNodes.length > 0) {
		ele.removeChild(ele.firstChild);
	}
}

function kitspage() {
	var nokits = false;
	timeouts = new Array();
	series_basicinfo();
	sermontable();
	if(window.kits && kits.length && kits.length > 0) {
		for(var i=0; i<kits.length; i++) {
			addkit(i);
		}
	}
	else { var nokits = true; }

	if(!window.sermons || !sermons.length || sermons.length < 1) {
		$('indiv_sermons').style.display = 'none';
		if(nokits == true) $('series_unavailable').style.display = 'block';
	}

	else {
		sermon_links();
		$('indiv_sermons_h2').onclick = expandsermons;
	}
}
function addkit(id) {
	var ele, tr, td,classname, img,tbody,classname, li;
	var foo = document.createElement('div');
	foo.className = 'product_details';
	foo.id = "kit_" + id;
	foo.innerHTML = templates.kitbox;

	// expanded is a global variable in series.php
	// the plus/minus image is used to determine if a series has already been expanded or not
	if(kits[id].title == expanded) {
		var img = foo.getElementsByTagName('img');
		for(var i=0; i<img.length;i++) {
			if(img[i].alt == 'Minimize') var kitimg = img[i];
		}

		kitimg.src = "img/icon-minus.gif";
	}
	//foo.update(templates.kitbox);

	$('kitboxes').appendChild(foo);

	foo = $('tmp_kit_expand');

	// kitimg is only defined if the kit title matches the expand request variable
	if(!kitimg) foo.style.display = 'none';
	foo.id = 'kit_expand_'+id;

	foo = $('tmp_kit_title_container');
	foo.id = 'kit_title_container_' + id;
	foo.onclick = expandkit;

	// change kit title
	ele = $('tmp_kit_title');
	ele.id = 'kit_title_'+id;
	ele.appendChild(document.createTextNode(kits[id].title));

	// change kit price
  	ele = $('tmp_kit_price');
	ele.id = 'kit_price_'+id;
	//ele.appendChild(document.createTextNode(kits[id].price));

	// change kit description
	ele = $('tmp_kit_desc');
	ele.id = 'kit_desc_'+id;

	/* Written using full dom functions, since the innerHTML version didn't work in IE */

	ele.appendChild(document.createTextNode(kits[id].desc));

	/* NOTE: This changes the kit description */
	if(kits[id].title == 'Bundle Kit') {
		ele.appendChild(document.createElement('br'));
		ele.appendChild(document.createElement('br'));
		foo = document.createElement('b');
		foo.appendChild(document.createTextNode('Series CD/DVD sold separately.'));
		ele.appendChild(foo);
	}

	if(kits[id].contents && kits[id].contents.length > 0) {
		foo = document.createElement('h4');
		foo.appendChild(document.createTextNode("What's Inside:"));
		ele.appendChild(foo);

		foo = document.createElement('ul');
		for(var i=0; i < kits[id].contents.length; i++) {
			li = document.createElement('li');
			li.appendChild(document.createTextNode(kit_content_types[kits[id].contents[i]]));
			foo.appendChild(li);
		}
		ele.appendChild(foo);
		if(kits[id].preview) {
			var div = document.createElement('div');
			div.id = "previewlink";
			var lnk = document.createElement('a');
			lnk.href = kits[id].preview;
			lnk.target = "blank";
			div.appendChild(lnk);
			var img = document.createElement('img');
			img.src="img/btn-viewcontents.gif";
			img.border="0";
			lnk.appendChild(img);
			ele.appendChild(div);
		}
		if(kits[id].mediapreview) {
			var div = document.createElement('div');
			div.style.marginTop = '10px';
			div.id = "mediapreviewlink";
			div.flv = kits[id].mediapreview;
			//lnk.onclick = "";
			div.onclick = function () {
				window.open('http://media.creativepastors.com/mediapreviews/index.php?stream='+this.flv,'mediapreview','location=no,menubar=no,resizeable=no,status=no,titlebar=no,width=576,height=348');
				return false;
			}
			var img = document.createElement('img');
			img.src="img/btn-mediapreview.gif";
			img.border="0";
			img.style.cursor='pointer';
			div.appendChild(img);
			ele.appendChild(div);
		}
	}

	// add items to table
	tbody = $('tmp_kit_tbody');
	tbody.id = 'kit_tbody_'+id;

	additems(kits[id].items, tbody);

}

function additems(items,tbody) {
	for(var i=0; i < items.length; i++) {
		var item = items[i];
		tr = document.createElement('tr');

		// determine class name for row
		if(i % 2 == 0) classname = 'even';
		else classname = 'odd';
		if(i == items.length-1) classname += " last";
		tr.className = classname;

		// add format
		td = document.createElement('td');
		td.className = 'format';
		td.style.cursor = 'help';

		var span = document.createElement('span');
		//span.appendChild(document.createTextNode(item.format_name + ' '));
		if(item.format_name == "Outline") formatname = "Outline & Worship Map";
		else formatname = item.format_name;
		span.appendChild(document.createTextNode(formatname + ' '));
		td.appendChild(span);


		//if(item.format_name == "Outline & Worship Map") {
		if(item.format_name == "Outline") {
			lnk = document.createElement('a');
			lnk.href="files/Sample_Outline-Worship_Map.pdf";
			lnk.target="_blank";
			lnk.title = "See a PDF sample of an "+item.format_name;
			img = document.createElement('img');
			img.src = "img/icon-question.gif";
			img.style.marginTop="10px";
			img.border = "0";
			lnk.appendChild(img);
			td.appendChild(lnk);
			}
		if(item.format_name == "Mind Map") {
			lnk = document.createElement('a');
			lnk.href="files/Sample_Mind_Map.pdf";
			lnk.target="_blank";
			lnk.title = "See a PDF sample of a "+item.format_name;
			img = document.createElement('img');
			img.src = "img/icon-question.gif";
			img.border = "0";
			lnk.appendChild(img);
			td.appendChild(lnk);
			}
		if(item.format_name == "Service Script") {
			lnk = document.createElement('a');
			lnk.href="files/Sample_Service_Script.pdf";
			lnk.target="_blank";
			lnk.title = "See a PDF sample of a "+item.format_name;
			img = document.createElement('img');
			img.src = "img/icon-question.gif";
			img.border = "0";
			lnk.appendChild(img);
			td.appendChild(lnk);
			}
		if(item.format_name == "Worship Map") {
			lnk = document.createElement('a');
			lnk.href="files/Sample_Worship_Map.pdf";
			lnk.target="_blank";
			lnk.title = "See a PDF sample of a "+item.format_name;
			img = document.createElement('img');
			img.src = "img/icon-question.gif";
			img.border = "0";
			lnk.appendChild(img);
			td.appendChild(lnk);
			}
		if(item.format_name == "Transcript") {
			lnk = document.createElement('a');
			lnk.href="files/Sample_Transcript.pdf";
			lnk.target="_blank";
			lnk.title = "See a PDF sample of a "+item.format_name;
			img = document.createElement('img');
			img.src = "img/icon-question.gif";
			img.border = "0";
			lnk.appendChild(img);
			td.appendChild(lnk);
		}
		if(item.format_name == "MP3") {
		}
		tr.appendChild(td);

		// add preview
		/*
		td = document.createElement('td');
		td.className = 'preview';
		img = document.createElement('img');
		img.src = "img/"+item.preview;
		img.alt = "Watch a previews of this series";
		td.appendChild(img);
		tr.appendChild(td);
		*/

		// add price
		td = document.createElement('td');
		td.className = 'price';
		if(item.sale_price) {
			var span = document.createElement('span');
			span.className = "unit_price prediscount";
			span.appendChild(document.createTextNode(item.price));
			td.appendChild(span);

			var span = document.createElement('span');
			span.className = "unit_price discounted";
			span.appendChild(document.createTextNode(item.sale_price));
			td.appendChild(span);
		}
		else { td.appendChild(document.createTextNode(item.price)); }
		tr.appendChild(td);

		// add button
		td = document.createElement('td');
		td.className = 'addtocart';
		img = document.createElement('img');
		img.src = "img/btn-add.gif";
		img.title = "Add to Cart";
		img.id = "add_" + item.itemno;
		//img.onclick = showadded;
		img.onclick = addtocart;

		td.appendChild(img);
		tr.appendChild(td);

		tbody.appendChild(tr);
	}
}

function sermontable() {
	var sermon, td, ele, div, html, tr = false;
	var tbody = $('sermon_list').tBodies[0];

	if(!window.sermons || !sermons.length || sermons.length < 1) {
		$('seriesweeks').style.display = 'none';
		$('sermon_list').style.display = 'none';
		return true;
	}


	$('seriesweeks').innerHTML = sermons.length;


	for(var i=0; i<sermons.length; i++) {
		sermon = sermons[i];
		if(i % 3 == 0) {
			if(tr) { tbody.appendChild(tr); }
			tr = document.createElement('tr');
		}
		td = document.createElement('td');
		td.msgid = i;
		ele = document.createElement('span');
		ele.appendChild(document.createTextNode((i+1)));
		td.appendChild(ele);
		ele = document.createElement('h4');
		ele.appendChild(document.createTextNode(sermon.title));
		td.appendChild(ele);
		ele = document.createElement('div');
		ele.appendChild(document.createTextNode(sermon.subtitle));
		td.appendChild(ele);
		td.title = 'Click for more information';
		td.onclick = hoverbox;

		tr.appendChild(td);
	}
	tbody.appendChild(tr);

}

function sermon_links() {
	var sermon, lnk, li, ul = $('sermon_links');
	for(var i=0; i<sermons.length; i++) {
		sermon = sermons[i];
		li = document.createElement('li');
		lnk = document.createElement('a');
		if(i==0) lnk.className = 'on';
		lnk.href = "#indiv_sermons";
		lnk.onmouseover=sermon_links_hover;
		lnk.appendChild(document.createTextNode((i+1) + ". " + sermon.title));
		li.appendChild(lnk);
		lnk.id = 'sermonlink_'+i;
		ul.appendChild(li);
	}
	showsermon(0);
}

function sermon_links_hover() {
	var items = $('sermon_links').getElementsByTagName('a');
	for(var i=0; i<items.length; i++) {
		if(items[i] == this) {
			items[i].className = 'on';
			showsermon(this.id.substring(11));
		}
		else items[i].className = 'off';
	}
}

function showsermon(id) {
	var container = $('sermon_details');
	var st = container.getElementsByTagName('h4')[0];
	var ss = container.getElementsByTagName('strong')[0];
	var sd = container.getElementsByTagName('p')[0];
	var sermon = sermons[id];

	removekids(st);
	st.appendChild(document.createTextNode((Number(id)+1) + ". " + sermon.title));

	removekids(ss);
	ss.appendChild(document.createTextNode(sermon.subtitle));

	if(sermon.desc && sermon.desc){
	sd.innerHTML = sermon.desc;
	sd.style.marginBottom="30px";
	}
	else {
		sd.innerHTML= "No description available for this sermon.";
		sd.style.height="130px";
	}

	var tbody = $('indiv_sermons').getElementsByTagName('tbody')[0];
//	tbody.innerHTML = '';
	removekids(tbody);
	additems(sermon.items, tbody);

}

function expandkit() {
	// determine kit number
	var id = this.id.substring(20);
	var expele = $('kit_expand_'+id);
	var kitele = $('kit_'+id);

	var img = kitele.getElementsByTagName('img');
	for(var i=0; i<img.length;i++) {
		if(img[i].alt == 'Minimize') var kitimg = img[i];
	}

	// determine if the elemnt is expanded
	if(kitimg.src.substring(kitimg.src.length-8) == 'plus.gif') {
		kitimg.src = "img/icon-minus.gif";
		Effect.SlideDown(expele.id, { duration: 0.5 });

		//alert('I got here 2!');
	}
	else {
		kitimg.src = "img/icon-plus.gif";
		Effect.SlideUp(expele.id, { duration: 0.5 });
	}
}
function expandsermons() {
	var kitimg = $('indiv_sermons_img');
	var expele = $('downloads_container');

	// determine if the elemnt is expanded
	if(kitimg.src.substring(kitimg.src.length-8) == 'plus.gif') {
		kitimg.src = "img/icon-minus.gif";
		Effect.SlideDown(expele.id, { duration: 0.5 });
	}
	else {
		kitimg.src = "img/icon-plus.gif";
		Effect.SlideUp(expele.id, { duration: 0.5 });
	}
}



/*
What:		hoverbox(), unhoverbox()
Where: 	Series page
Why: 		Creates a hover box to show the sermon description
*/
function hoverbox() {
		var div, html, position, wrapper, h1, h2, img, sermon, descrip;
		//alert(this.nodeName);
		sermon = sermons[this.msgid];
		if($('hoverbox1')) { Element.remove($('hoverbox1')); }

		if(sermon.desc && sermon.desc){ var description = sermon.desc;}
		else if(sermon.long_desc) { var description = sermon.long_desc; }
		else {var description = "No description available for this sermon.";}

		html = "<div class=\"sp_wrapper\" onclick=\"unhoverbox()\">";
		html += '<img class="close_button" src="img/btn-red-x.gif" height="16" width="16" border="0" alt="Close this window" title="Close this window"/>';

		html += '<h1>About this Message</h1>';
		html += '<div class="sp_description">';
		html += '<h2>' + (this.msgid+1) + '. ' + sermon.title + '</h2>';
		html += "<p>" + description + "</p>";
		html += '</div>';
		html += '<p class="sp_closing">This sermon is available as part of the Series on CD/DVD. You may also download this sermon individually along with transcripts and other helpful tools.</p>';
		html += '</div><!-- / sermonpop_wrapper-->';
		html += '<div class="pointer">&nbsp;</div>';

		div = document.createElement('div');
		div.className = 'hoverbox';
		div.innerHTML = html;
		div.id = "hoverbox1";
		document.getElementsByTagName('body')[0].appendChild(div);

		div.style.visibility = 'hidden';
		div.style.position = 'absolute';
		position = Position.cumulativeOffset(this);
		div.style.top = (position[1] - Element.getHeight(div) + 10) + 'px';
		div.style.left = (position[0] - 100) + 'px';
		div.style.display = 'none';
		div.style.visibility = 'visible';
		Effect.Appear(div, { duration: 0.5 });
}

function unhoverbox() {
	if($('hoverbox1')) {
		Effect.Fade('hoverbox1', { duration: 0.5 });
		window.setTimeout("Element.remove($('hoverbox1'));",600);
	}
}


/*
What:		showadded()
Where: 	Series page and Cart page
Why: 		Creates an "item added" message when "Add" is clicked
*/

function init_productpage() {
	timeouts = new Array();
	var tbody =$('price_grid_body');
	var imgs = tbody.getElementsByTagName('img');
	for(var i=0; i<imgs.length; i++) {
		if (imgs[i].alt == "Add to Cart") {
			//imgs[i].onclick = showadded;
			imgs[i].onclick = addtocart;
		}
	}
}

function init_eymseriespage() {
	timeouts = new Array();
	var tbody =$('price_grid_body');
	var imgs = tbody.getElementsByTagName('img');
	for(var i=0; i<imgs.length; i++) {
		if (imgs[i].alt == "Add to Cart") {
			//imgs[i].onclick = showadded;
			imgs[i].onclick = addtocart;
		}
	}

	var cells = $('sermon_list').tBodies[0].getElementsByTagName('td');
	for(var i = 0; i < cells.length; i++) {
		cells[i].onclick = hoverbox;
		cells[i].msgid = i;
	}
}

function addtocart(id, price) {
	var qty = 1;
	if($('quantity_'+id)) qty = $F('quantity_'+id);
	new Ajax.Request('http://196.0.0.51/Joomla/components/com_ezcatalog/cart_remote.php', {parameters:'action=add&referer=' + escape(window.location.href) + '&fid='+escape(id)+'&qty='+qty+'&price='+price+'',onFailure:failed, onSuccess:addedtocart});
}

function update_cartstatus(qty) {
	/* Note: you must also change the matching code in head.php */
	var div = $('cart_view');
	if(qty > 0) {
		var statustext = '<div>' + qty + ' items in <a href="cart.php">my cart</a></div>';
		//statustext += '<form action="cart.php" method="post">';
		//statustext += '<input id="btn_checkout" type="image" src="img/btn-checkout.gif" />';
		//statustext += '</form>';
		statustext += '<a href="cart.php"><img src="img/btn-checkout.gif" border="0" /></a>';
	}
	else statustext = '<div>Your cart is empty</div>';
	div.innerHTML = statustext;
}

function failed () {
  alert('failed');
}

function addedtocart(t) {
	eval('var added = '+t.responseText);
	var tbody = $(added.other);
	var tr = tbody.childNodes[0];

	if(added.error) {
		tr.childNodes[0].innerHTML = '&raquo; ' + tbody.error;
	}

	else {

		tr.childNodes[0].innerHTML = '&raquo; Item added';

		var img = document.createElement('img');
		img.src = 'img/btn-checkout2.gif';
		img.border=0;

		var atag = document.createElement('a');
		atag.href = 'cart.php';
		atag.appendChild(img);

		if(tr.childNodes[1].getElementsByTagName('img').length == 0) tr.childNodes[1].appendChild(atag);

		if(added.prepurchased && added.prepurchased > 0) {
			var row = document.createElement('tr');
			var cell = document.createElement('td');
			cell.appendChild(document.createTextNode("You previously purchased this item."));
			cell.colSpan = 4;
			cell.style.color='red';
			cell.style.fontSize='10px';
			cell.style.lineHeight='12px';
			cell.style.textAlign='left';
			row.appendChild(cell);
			tbody.appendChild(row);
			}
	}
	timeouts[added.other] = window.setTimeout("hideadded('" + added.other + "')",8000);
	update_cartstatus(added.itemcount);
}

function showadded() {
	//alert('I got here!');
	var formatid = this.id.substring(4);
	var table = this.parentNode.parentNode.parentNode.parentNode;
	var caption = table.getElementsByTagName('caption')[0];
	var tbody = table.getElementsByTagName('tbody')[0];
	//alert((table.getElementsByTagName('tbody').length > 1));
	if(table.getElementsByTagName('tbody').length == 1) {
		var tbody2 = document.createElement('tbody');
		tbody2.className = 'checkout';
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		td.colSpan = 3;
		td.className = 'msg';
		td.innerHTML = '&raquo; Item Added';
		tr.appendChild(td);

		td = document.createElement('td');
		var img = document.createElement('img');
		img.src = 'img/btn-checkout2.gif';
		td.appendChild(img);
		tr.appendChild(td);

		tbody2.appendChild(tr);
		tbody2.id = tbody.id + '_added';
		table.appendChild(tbody2);
		//alert(tbody2.id);
	}
	else {
		var tbody2 = table.getElementsByTagName('tbody')[1];
		var tr = tbody2.getElementsByTagName('tr')[0];
	}
	if(timeouts[tbody2.id]) { window.clearTimeout(timeouts[tbody2.id]); }
	new Effect.Highlight(tr, {endcolor: '#d7f181'});
	timeouts[tbody2.id] = window.setTimeout("hideadded('" + tbody2.id + "')",8000);
}

function hideadded(id) {
	Effect.Fade(id, {duration: 0.25} );
	window.setTimeout("Element.remove($('"+id+"'))",500);

}

var title_options = ['','Senior Pastor','Associate Pastor','Management/Executive','Worship Leader','Worship Leader','Singles','Children', 'Small Groups','Jr/Sr High','Communications','Administrative','Technology','Assimilation','Other'];
