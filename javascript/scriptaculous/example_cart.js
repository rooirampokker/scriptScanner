window.onload = init_cart;

function init_cart() {
	if(!$('withoutpassword')) return false;
	$('withoutpassword').onclick = show_create_account;
	$('withpassword').onclick = show_create_account;
	$('card_code_link').onclick = show_create_card;
	$('card_code_link2').onclick = show_create_card;
	//$('password').onfocus=function() {$('create_account').className="";}
	$('apply_new_account').onclick = create_account;
	$('diffshipaddr').onclick=function() {
		if(this.checked) $('shipping_info').className="content_box show";
		else $('shipping_info').className="content_box hide";
	}
	$('taxexempt').onclick=changetaxes; //function() {$('taxidno').className="show";}
	$('standard').onclick=changeshipping;
	$('express').onclick=changeshipping;
	disable_fields(true);
	if(window.userdata) {
		cart_login_response();
	}

	if($('choose_shipping').style.display == 'none') {
		cart_downloadonly();
	}
}

function removekids(ele){
	while(ele.childNodes.length>0){
		ele.removeChild(ele.childNodes[0]);
	}
}

function create_account() {
	var err = $('create_account_error');
	err.className = "show";
	err.appendChild(document.createTextNode('Please Wait...'));

	var fields = 'action=create_account&fname=' + escape($F('ff_0')) + '&lname=' + escape($F('ff_1')) + '&emailaddress=' + escape($F('ff_2')) + '&createpw=' + escape($F('ff_3')) + '&howdidyouhear=' + escape($F('howdidyouhear')) + '&title=' + escape($F('title')) + '&subscribe=' + escape($F('subscribe')) + '&errortarget=create_account_error';

	new Ajax.Request('cart_remote.php', {parameters:fields,onSuccess:cart_login_response});
}



function cart_login() {
	var span = $('errormsg');
	span.className="show";
	span.appendChild(document.createTextNode("Please Wait..."));
	new Ajax.Request('cart_remote.php', {parameters:'action=login&user=' + escape($F('login_email')) + '&pass='+escape($F('login_pass')),onSuccess:cart_login_response});
}

function cart_update() {
	var tbody = $('items_table').tBodies[0];
	var inputs = tbody.getElementsByTagName('input');

	var p = 'action=update';

	for(var i = 0; i < inputs.length; i++) {
		p += '&' + escape(inputs[i].name) + '=' + escape(inputs[i].value);
	}
	new Ajax.Request('http://196.0.0.51/Joomla/components/com_ezcatalog/cart_remote.php', {parameters:p,onSuccess:apply_coupon_response});
}


function cart_remove(fid) {
	new Ajax.Request('cart_remote.php', {parameters:'action=remove&fid=' + escape(fid),onSuccess:apply_coupon_response});
}

function cart_add_donation() {
	new Ajax.Request('cart_remote.php', {parameters:'action=add_donation&msgonly=1&fid=1&referer=donation.php&amt='+escape($('connect_amount').value),onSuccess:cart_donation_added});
}

function cart_donation_added(t) {
	$('extra_donation').style.display = 'none';
	apply_coupon_response(t);
}

function apply_coupon(field) {
	var val = field.value;
	field.value = '';
	$('couponmsg').innerHTML = 'Please wait...';
	$('couponmsg').style.display = 'block';
	document.getElementsByTagName('body')[0].style.cursor = 'wait';
	new Ajax.Request('cart_remote.php', {parameters:'action=addcoupon&code=' + escape(val),onSuccess:apply_coupon_response});
}

//BY THE TIME IT GETS HERE, cart_remote.php has already done its thing - t=whatever is printed in cart_remote.php
function apply_coupon_response(t) {
	document.getElementsByTagName('body')[0].style.cursor = 'auto';
	eval('var responsedata='+t.responseText+';');
	//update_cartstatus(responsedata.totalqty);
	if(responsedata.totalqty == 0) {
		$('cart').innerHTML = '<br /><h1>Your cart is currently empty</h1>';
		return true;
	}
	if(responsedata.couponmsg) {
		$('couponmsg').innerHTML = responsedata.couponmsg;
		new Effect.Highlight($('couponmsg'));
		window.setTimeout(function () { new Effect.Fade($('couponmsg')); }, 5000);
	}

	// had to do all this junk b/c IE doesn't support innerHTML on table, tbody, or tr
	//var tbody = $('items_table').tBodies[0];
	//tbody.innerHTML = responsedata.contents_html;
	var tablehtml = '<table id="items_table" summary="Displaying items in your cart with prices and quantities" cellspacing="0">';
	tablehtml += '<thead>';
	tablehtml += $('items_table').getElementsByTagName('thead')[0].innerHTML;
	tablehtml += '</thead>';
	tablehtml += '<tbody>';
	tablehtml += responsedata.contents_html;
	tablehtml += '</tbody>';
	tablehtml += '<tbody>';
	tablehtml += $('items_table').tBodies[1].innerHTML;
	tablehtml += '</tbody>';
	tablehtml += '</table>';

	$('items_table_container').innerHTML = tablehtml;


	update_subtotal(responsedata.subtotal);

	if(responsedata.download_only) { cart_downloadonly(); }

	$('shipping_amount').innerHTML = '$' + responsedata.ship_amount;
	$('shipping_amount').abbr = responsedata.ship_amount;
	$('standard_cost').innerHTML = '$' + responsedata.ship_amount;
	$('express_cost').innerHTML = '$' + (Number(responsedata.ship_amount) + 17.95).toFixed(2);
	changeshipping();

	updatetaxes(responsedata.tax);

	$('grandtotal').title=(Number(responsedata.subtotal) + Number(responsedata.ship_amount));

	grandtotal();

}

function cart_downloadonly() {
	$('choose_shipping').style.display = 'none';
	$('shipping_tr').style.display = 'none';
	$('standard').checked = true;
	$('express').checked = false;
}

function update_subtotal(val) {
	var cell = $('subtotal').getElementsByTagName('td')[1];
	cell.innerHTML = '$' + (Number(val)).toFixed(2);
}

function cart_login_response(t) {
	if(t && t.responseText) eval('userdata='+t.responseText);
	if(userdata && userdata.errortarget) var msgspan = $(userdata.errortarget);
	else var msgspan = $('errormsg');
	removekids(msgspan);
	if(userdata.error) {
		msgspan.appendChild(document.createTextNode(userdata.error));
		}
	else {
		msgspan.className="hide";
		$('account_info').style.display = 'none';
		$('name').value=userdata.first_name+' '+userdata.last_name;
		$('name').value=userdata.first_name+' '+userdata.last_name;
		if(userdata.church_name) $('church').value=userdata.church_name;
		if(userdata.phone_work) $('telephone').value=userdata.phone_work;
		if(userdata.addr_1) $('address').value=userdata.addr_1;
		if(userdata.addr_2) $('address').value+=' '+userdata.addr_2;
		if(userdata.city) $('city').value=userdata.city;
		if(userdata.state) $('state').value=userdata.state;
		if(userdata.zip) $('zip').value=userdata.zip;
		if(userdata.country) $('country').value=userdata.country;
		var opts = $('country').getElementsByTagName('option');
		for (i=0;i<opts.length;i++) {
			if(opts[i].value == userdata.country) opts[i].selected = true;
		}

		// workaround for a weird field position / timing issue with FF
		// form values were placed outside their fields without this.
		window.setTimeout('disable_fields(false)',100);

	}


}
function show_create_account() {
	if (this.id == 'withoutpassword')
		{
		$('create_account').className = "show";
		$('login_account').className = '';
		disable_fields('no');
		$('applylogin').style.display = 'none';
		}
	else
		{
		$('create_account').className = "";
		$('login_account').className = 'show';
		disable_fields('yes');
		$('applylogin').style.display = '';
		}
}
function show_create_card() {
	var ele = document.getElementById('card_code');
	if (this.id == 'card_code_link')
		{
		ele.className = "show";
		}
	else
		{
		ele.className = "";
		}
}

function disable_fields(action) {
	var div = $('billing_info')
	var inputs = div.getElementsByTagName('input');
	for(i=0;i<inputs.length;i++) {
	inputs[i].disabled=action;
	}
	var selects = div.getElementsByTagName('select');
	for(i=0;i<selects.length;i++) {
	selects[i].disabled=action;
	}
	var div = $('payment_info')
	var inputs = div.getElementsByTagName('input');
	for(i=0;i<inputs.length;i++) {
	inputs[i].disabled=action;
	}
	var selects = div.getElementsByTagName('select');
	for(i=0;i<selects.length;i++) {
	selects[i].disabled=action;
	}
}

function cart_form_submit() {
	if($('promocode').value.length > 1) {
		apply_coupon($('promocode'));
	}
	else if(window.userdata && userdata.first_name) {
		cart_checkout();
	}

	else if($('withpassword').checked) {
		cart_login();
	}

	else if($('withoutpassword').checked) {
		create_account();
	}

}
function cart_checkout() {
	// validate shipping client side
	if(!$('standard').checked && !$('express').checked) {
		$('choose_shipping_header').style.color="#f00";
		$('standard').focus();
		Element.scrollTo('choose_shipping_header');
		new Effect.Highlight($('choose_shipping_header'));
		return false;
	}

	// tax id is required on cp if you are in texas and are trying to avoid sales tax
	if(window.location.href.indexOf('creativepastors.com') > -1 &&
		$('taxexempt').checked &&
		$('taxid').value.length < 3 &&
		$('state').value.toUpperCase() == 'TX') {
			Element.scrollTo('taxidno');
			new Effect.Highlight($('taxidno'));
			return false;
	}

	var postdata = Form.serialize($('cart_form'));

	// clear error messages
	var errors = document.getElementsByTagName('tr');
	for(var i =0; i < errors.length; i++) {
		if(errors[i].className && errors[i].className == 'error') {
			errors[i].parentNode.removeChild(errors[i]);
		}
	}

	$('submitorder').style.display = 'none';

	var err = $('submitorder_wait');
	removekids(err);
	err.style.display = "block";
	err.appendChild(document.createTextNode('Please Wait...'));
	new Effect.Highlight(err);

	document.getElementsByTagName('body')[0].style.cursor = 'wait';

	new Ajax.Request('cart_remote.php', {parameters:'action=checkout&'+postdata,onSuccess:cart_checkout_response});

}

function cart_checkout_response(t) {
	var validator_response = eval('var response = '+t.responseText);

	document.getElementsByTagName('body')[0].style.cursor = 'auto';

	if(response.status && response.status == 'error') {
		$('submitorder_wait').style.display = 'none';
		$('submitorder').style.display = '';

		var errormsg = response.msg;
		//alert(errormsg.length);
		for(var i = 0; i < errormsg.length; i++) {
			//alert('i got here: loop ' + i);
			var tr = document.createElement('tr');
			tr.className = 'error';

			var td = document.createElement('td');
			td.appendChild(document.createTextNode(errormsg[i][1]));
			td.colSpan=2;
			tr.appendChild(td);

			// find row that contains the element
			if($(errormsg[i][0]) && $(errormsg[i][0]).parentNode.nodeName.toLowerCase() == 'td') {
				if(i == 0) {
					window.location.hash = '#' + errormsg[i][0];
					$(errormsg[i][0]).focus();
				}

				var targetrow = $(errormsg[i][0]).parentNode.parentNode;
				targetrow.parentNode.insertBefore(tr,targetrow);

			}
			//else alert(errormsg[i][1]);
		}
		//alert('i got here 8');

	}
	else if(response.error) { alert(response.error); }
	else if(response.success) { window.location.href = 'receipt.php?id=' + response.invoice; }
}

function grandtotal() {
	var express = $('express').checked;
	var exempt = $('taxexempt').checked;
	var grandtotal = Number($('grandtotal').title);

	if(express) grandtotal += 17.95;
	if(!exempt) grandtotal += Number($('tax_amount').abbr);

	$('grandtotal').innerHTML = 'Total: $' + grandtotal.toFixed(2);


}

function changeshipping() {

	$('choose_shipping_header').style.color="#000";

	var express = $('express').checked;

	if(express) {
		$('shipping_amount').innerHTML = '$' + (Number($('shipping_amount').abbr) + 17.95).toFixed(2);
		$('grandtotal').innerHTML = 'Total: $' + (Number($('grandtotal').title) + 17.95).toFixed(2);
	}
	else {
		$('shipping_amount').innerHTML = '$' + Number($('shipping_amount').abbr).toFixed(2);
		$('grandtotal').innerHTML = 'Total: $' + Number($('grandtotal').title).toFixed(2);
	}
	grandtotal();
}

function updatetaxes(val) {
	$('tax_amount').abbr = Number(val).toFixed(2);
	changetaxes();
}

function changetaxes() {
	if(this && this.id) {
		exempt = this.checked;
	}
	else exempt = $('taxexempt').checked;

	if(exempt) {
		$('tax_amount').innerHTML = '$0.00';
		$('taxidno').className="show";
	}
	else {
		$('taxidno').className="hide";
		$('tax_amount').innerHTML = '$' + $('tax_amount').abbr;
	}
	grandtotal();
}
