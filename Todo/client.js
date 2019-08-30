const DOM = {
	form : {
		input : document.getElementById('form.input'),
		date : document.getElementById('form.date'),
		submit : document.getElementById('form.submit'),
		list : document.getElementById('form.list')
	}
}

init();

DOM.form.submit.addEventListener('click', async function() {

	let args = {
		input : DOM.form.input.value,
		date : DOM.form.date.value
	};

	let item = await Jaxer.async.insertItem(args);
	renderItem(item, true);
	DOM.form.input.value = "";
	DOM.form.date.value = "";

});

async function init() {

	let items = await Jaxer.async.selectItems();
	for(let i = 0; i < items.length; i++) {
		renderItem(items[i], false);
	}

}

function renderItem(item, animate) {

	let li = document.createElement('li');
	let div = document.createElement('div');
	div.setAttribute('class', 'add-form readonly no-indent');
	if(item.item_fav) {
		div.classList.add("favorite");
	}

	let table = document.createElement('table');
	let rowOne = table.insertRow();

	let plusCell = rowOne.insertCell();
	plusCell.classList.add('plus');
	let checkbox = document.createElement('input');
	checkbox.setAttribute('type', 'checkbox');
	plusCell.appendChild(checkbox);

	let inputCell = rowOne.insertCell();
	inputCell.setAttribute('colspan', '2');
	let input = document.createElement('input');
	input.setAttribute("type", "text");
	inputCell.appendChild(input);
	input.value = item.item_name;
	input.setAttribute("readonly", "readonly");
	
	let rowTwo = table.insertRow();
	let starCell = rowTwo.insertCell();
	starCell.classList.add("star");

	let a = document.createElement('a');
	a.textContent = "★";
	starCell.appendChild(a);

	let dateCell = rowTwo.insertCell();
	dateCell.classList.add("top");
	let span = document.createElement("span");
	span.textContent = "Deadline";

	let date = document.createElement("input");
	date.setAttribute("type", "date");
	date.setAttribute("readonly", "readonly");
	date.value = item.item_date;
	dateCell.appendChild(span);
	dateCell.appendChild(date);

	div.appendChild(table);
	li.appendChild(div);

	let btnCell = rowTwo.insertCell();
	btnCell.setAttribute('class', 'top right');

	let button = document.createElement('button');
	button.textContent = "Edit";
	btnCell.appendChild(button);

	if(item.item_done) {
		div.classList.add("checked");
		checkbox.checked = true;
		button.textContent = "Remove";
	}

	a.addEventListener('click', handleFavorite.bind(null, item.id, div));
	checkbox.addEventListener('change', handleComplete.bind(null, item.id, div, button));
	button.addEventListener('click', handleButtonClick.bind(null, item.id, div, button, input, date));
	
	if(animate) {
		div.classList.add("new");
		setTimeout( function() {
			div.classList.remove("new");
		}, 100);
	}
	/*
	let node = DOM.form.list.children[0];
	DOM.form.list.insertBefore(li, node);
	*/
	DOM.form.list.appendChild(li);

}

async function handleFavorite(id, div, evt) {
	
	if(!div.classList.contains("readonly")) {
		return;
	}

	div.classList.toggle('favorite');
	let num = div.classList.contains("favorite") ? 1 : 0;
	let res = await Jaxer.async.updateFavorite(id, num);

}

async function handleComplete(id, div, btn, evt) {
	
	if(!div.classList.contains("readonly")) {
		return;
	}
	
	div.classList.toggle('checked');
	let num = div.classList.contains("checked") ? 1 : 0;
	console.log(num);
	let res = await Jaxer.async.updateComplete(id, num);

	if(num) {
		btn.textContent = "Remove";
	} else {
		btn.textContent = "Edit";
	}

}

async function handleButtonClick(id, div, btn, input, date) {

	if(div.classList.contains("checked")) {

		let li = div.parentNode;
		DOM.form.list.removeChild(li);
		let res = await Jaxer.async.removeContent(id);

	} else if(div.classList.contains("readonly")) {

		div.classList.remove("readonly");
		btn.textContent = "Save";

		input.removeAttribute("readonly");
		date.removeAttribute("readonly");
		
		input.focus();

	} else {

		div.classList.add("readonly");
		btn.textContent = "Edit";

		input.setAttribute("readonly", "readonly");
		date.setAttribute("readonly", "readonly");
		
		let res = await Jaxer.async.updateContent(id, input.value, date.value);
	}

}
