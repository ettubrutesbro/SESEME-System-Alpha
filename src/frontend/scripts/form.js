

function generateForm(){
	var editor = document.getElementById('editor')
	editor.innerHTML = ''
	form.active = true
	refill(true,true)

	//generate plrs
	for(var i = 0; i<4; i++){ 
		var plr = document.createElement('div')
		plr.classList.add('form','plr')
		
		var namesvalues = document.createElement('div')
			namesvalues.classList.add('form','namesvalues')

		var pn = document.createElement('div')
			pn.classList.add('form','name')
			var pnlabel = labeler('name')
			var pninput = document.createElement('input')
				pninput.classList.add('form','pNames')
				pninput.value = data.pNames[i]

			pn.appendChild(pnlabel); pn.appendChild(pninput)
			pn.input = pninput; pn.label = pnlabel
			plr.name = pn

		var pv = document.createElement('div')
			pv.classList.add('form','value')
			var pvlabel = labeler('value')
			var pvinput = document.createElement('input')
				pvinput.classList.add('form','values')
				pvinput.value = data.values[i]

			pv.appendChild(pvlabel); pv.appendChild(pvinput)
			pv.input = pvinput; pv.label = pvlabel
			plr.value = pv

		namesvalues.appendChild(pn)
		namesvalues.appendChild(pv)

		var pt = document.createElement('div')
			pt.classList.add('form','maintext')
			var ptlabel = labeler('text ('+data.pTexts[i].length+'/140)')
			var ptinput = document.createElement('textarea')
				ptinput.classList.add('form','pTexts')
				ptinput.value = data.pTexts[i]
				ptinput.addEventListener('keyup',function(){
					this.parentElement.label.textContent = 'text ('+this.value.length+'/140)'
				})

			pt.appendChild(ptlabel); pt.appendChild(ptinput)
			pt.input = ptinput; pt.label = ptlabel
			plr.text = pt

		var pl = document.createElement('div')
			pl.classList.add('form','links')
			var pllabel = labeler('links ('+data.pLinks[i].length+'/3)')
			var linklabelrow = document.createElement('div')
				linklabelrow.classList.add('form','linklabelrow')
				linklabelrow.innerHTML += '<div class = "form linklabelrow icon label">icon</div> <div class = "form linklabelrow url label">url</div>'
			pl.appendChild(pllabel); pl.appendChild(linklabelrow)
			pl.label = pllabel
			pl.links = []
			for(var it = 0; it<data.pLinks[i].length; it++){
				pl.links[it] = formAddLink(i,it)
				pl.appendChild(pl.links[it])
			}
			plr.linkbox = pl

		var addlinkbtn = document.createElement('span')
			addlinkbtn.classList.add('form','addlinkbtn')
			addlinkbtn.index = i
			plr.linkbtn = addlinkbtn
			addlinkbtn.addEventListener('click', function(){
				var iteration = data.pLinks[this.index].length
				if(iteration===2) this.style.display = 'none'
				data.pLinks[this.index].push({c: 'url here', type: linkTypes[Math.floor(Math.random()*linkTypes.length)]})
				form['plr'+this.index].linkbox.appendChild(formAddLink(this.index,iteration,true))
				form['plr'+this.index].linkbox.label.textContent = 'links ('+data.pLinks[this.index].length+'/3)' 
				refill(true,true)
			}) 
			addlinkbtn.textContent = " + Add a Link"
			
			if(data.pLinks[i].length === 3) addlinkbtn.style.display = 'none'

			
		
		
		//populating the fields from the data


		//recursive event listeners on every input, per pillar
		var allInputs = plr.querySelectorAll('input,textarea,select')
		for(var it = 0; it<allInputs.length; it++){
			allInputs[it].index = i
			allInputs[it].addEventListener('change', function(){
				var tgtField = this.classList[1] 
				if(this.classList.contains('nested')){
					var tgtNest = this.classList[3]
					data[tgtField][this.index[0]][this.index[1]][tgtNest] = this.value
					refill(true,true)
					return
				} 
				data[tgtField][this.index] = tgtField === 'values'||'customLo'||'customHi' ? Number(this.value) : this.value
				refill(true,true)
			})
		}

	 	plr.appendChild(namesvalues)
		plr.appendChild(pt)
		plr.appendChild(pl)
		plr.appendChild(addlinkbtn)

		form['plr'+i] = plr
		editor.appendChild(plr)
		
	}// end pillar code
}

function labeler(text){
	var label = document.createElement('span')
	label.classList.add('form','label')
	label.textContent = text
	return label
}

function formAddLink(whichPlr,iter,needsEventListener){ //formAddLink(pLinks,i,it) ||
	var link = data.pLinks[whichPlr][iter]
	var row = document.createElement('div')
	row.classList.add('form','linkrow')
	
	var dropdown = document.createElement('select')
	dropdown.classList.add('form','pLinks','nested','type')
	dropdown.index = [whichPlr,iter]
	for(var ite = 0; ite<linkTypes.length; ite++){
		dropdown.appendChild(new Option(linkTypes[ite],linkTypes[ite],true,link.type===linkTypes[ite]?true:false))
	}
	row.icon = dropdown
	
	var urlinput = document.createElement('input')
	urlinput.classList.add('form','pLinks','nested','c')
	urlinput.value = link.c
	urlinput.index = [whichPlr,iter]
	row.c = urlinput

	var deletelinkbutton = document.createElement('input')
	deletelinkbutton.classList.add('form','x')
	deletelinkbutton.type = 'submit'
	deletelinkbutton.value = 'X'
	deletelinkbutton.index = [whichPlr,iter]
	deletelinkbutton.addEventListener('click',formDeleteLink)
	row.deletebtn = deletelinkbutton



	row.appendChild(dropdown); row.appendChild(urlinput); row.appendChild(deletelinkbutton)
	
	if(needsEventListener){
		dropdown.addEventListener('change',function(){
			var tgtField = this.classList[1]
			var tgtNest = this.classList[3]
			data[tgtField][this.index[0]][this.index[1]][tgtNest] = this.value
			refill(true,true)
		})
		urlinput.addEventListener('change',function(){
			var tgtField = this.classList[1]
			var tgtNest = this.classList[3]
			data[tgtField][this.index[0]][this.index[1]][tgtNest] = this.value
			refill(true,true)
		})
	}
	return row
}

function formDeleteLink(){ //deleting a link needs to remove the DOM element & restore + Add Link if applicable
	var tgtplr = form['plr'+this.index[0]]
	//get rid of this entry in data
	data.pLinks[this.index[0]].splice(this.index[1], 1)
	// adjust the linkbox label
	tgtplr.linkbox.label.textContent = 'links ('+data.pLinks[this.index[0]].length+'/3)'
	//add link button becomes visible
	tgtplr.linkbtn.style.display = 'block'

	//recalc other links' nested indices 
	for(var i=0; i<data.pLinks[this.index[0]].length; i++){
		if(i > this.index[1]){
			tgtplr.linkbox.links[i].c.index[1] -=1
			tgtplr.linkbox.links[i].url.index[1] -=1
			tgtplr.linkbox.links[i].deletebtn.index[1] -=1	
		}
		
	}


	tgtplr.linkbox.removeChild(tgtplr.linkbox.links[this.index[1]])

	refill(true,true)
}

function changeData(){
	//if nesting....
	var tgtField = this.classList[1]
	var tgtNest = this.classList[3]
	data[tgtField][this.index[0]][this.index[1]][tgtNest] = this.value
	
	//if not nested

	refill(true,true)
}

