

function generateForm(){
	var editor = document.getElementById('editor')
	editor.innerHTML = ''
	formActive = true
	refill(true,true)

	// document.getElementById('formeditor')
	for(var i = 0; i<4; i++){ //recursively create fields for pillars here
		//create variables that are createElements for inputs
		//pillar name (pNames[i])
		//pillar value (values[i])
		//pillar text (pText[i])
		var plr = document.createElement('div')
		plr.classList.add('form','plr')
		// plr.innerHTML = '<span>name</span><input class = "pName"><span>/text</span><input class = "pText"> '

		var namesvalues = document.createElement('div')
			namesvalues.classList.add('form','namesvalues')



		var pName = document.createElement('div')
			pName.classList.add('form','name')
			labeler('name',pName)
			pName.innerHTML += '<input class = "form pNames" value = "'+data.pNames[i]+'">'
		var pValue = document.createElement('div')
			pValue.classList.add('form','value')
			labeler('value',pValue)
			pValue.innerHTML += '<input class = "form values" value = "'+data.values[i]+'">'

		namesvalues.appendChild(pName)
		namesvalues.appendChild(pValue)

		var pText = document.createElement('div')
			pText.classList.add('form','maintext')
			labeler('text',pText)
			pText.innerHTML += '<textarea class = "form pTexts">'+data.pTexts[i]+'</textarea>'

		var pLinks = document.createElement('div')
			pLinks.classList.add('form','links')
			labeler('links',pLinks)
			var linklabelrow = document.createElement('div')
			linklabelrow.classList.add('form','linklabelrow')
			linklabelrow.innerHTML += '<div class = "form linklabelrow icon label">icon</div> <div class = "form linklabelrow url label">url</div>'
			pLinks.appendChild(linklabelrow)

			//for every link, add in an input for type and one for c
			for(var it = 0; it<data.pLinks[i].length; it++){
				formAddLink(pLinks,i,it)
			}
		var addlinkbtn = document.createElement('span')
			addlinkbtn.classList.add('form','addlinkbtn')
			addlinkbtn.addEventListener('click', function(){
				
				var plrIndex = [].indexOf.call(this.parentNode.parentNode.getElementsByClassName('plr'), this.parentNode)
				var iteration = (this.previousSibling.childNodes.length - 1)
				if(iteration===2) this.style.display = 'none'
				data.pLinks[plrIndex].push({c: 'url here', type: linkTypes[Math.floor(Math.random()*linkTypes.length)]})
				console.log('pushing new object to data pLinks#' + plrIndex)
				formAddLink(this.previousSibling,plrIndex,iteration,true)
				refill(true,true)

			}) 
			addlinkbtn.textContent = " + Add a Link"
			if(data.pLinks[i].length === 3) addlinkbtn.style.display = 'none'

			
		plr.appendChild(namesvalues)
		plr.appendChild(pText)
		plr.appendChild(pLinks)
		plr.appendChild(addlinkbtn)
		
		//populating the fields from the data


		//recursive event listeners on every input, per pillar
		var allInputs = plr.querySelectorAll('input,textarea,select')
		for(var it = 0; it<allInputs.length; it++){
			allInputs[it].index = i
			// allInputs[it].addEventListener('click',function(){this.focus()})
			allInputs[it].addEventListener('change', function(){
				var tgtField = this.classList[1] 
				if(this.classList.contains('nested')){
					var tgtNest = this.classList[3]
					data[tgtField][this.index][Number(this.dataset.nest)][tgtNest] = this.value
					refill(true,true)
					return
				} 
				data[tgtField][this.index] = tgtField === 'values' ? Number(this.value) : this.value
				refill(true,true)
			})

		}
 
		plr.className = 'plr'
		editor.appendChild(plr)
		
	}
}

function labeler(text,parentElement){
	var label = document.createElement('span')
	label.classList.add('form','label')
	label.textContent = text

	parentElement.appendChild(label)
}

function formAddLink(DOMelement,whichPlr,iter,needsEventListener){ //formAddLink(pLinks,i,it) ||
	var link = data.pLinks[whichPlr][iter]
	var row = document.createElement('div')
	row.classList.add('form','linkrow')

	
	var dropdown = document.createElement('select')
	dropdown.classList.add('form','pLinks','nested','type')
	dropdown.index = whichPlr
	dropdown.dataset.nest = iter
	dropdown.innerHTML += '<option value = "'+link.type+'">'+link.type+'</option>'
	for(var ite = 0; ite<linkTypes.length; ite++){
		if(linkTypes[ite] === link.type) continue
		dropdown.innerHTML+= '<option value = "' + linkTypes[ite] + '">'+linkTypes[ite]+'</option>'
	}
	
	
	var urlinput = document.createElement('input')
	urlinput.classList.add('form','pLinks','nested','c')
	urlinput.value = link.c
	urlinput.index = whichPlr
	urlinput.dataset.nest = iter 

	row.appendChild(dropdown)
	row.appendChild(urlinput)
	DOMelement.appendChild(row)
	
	if(needsEventListener){
		dropdown.addEventListener('change',function(){
			var tgtField = this.classList[1]
			var tgtNest = this.classList[3]
			data[tgtField][this.index][Number(this.dataset.nest)][tgtNest] = this.value
			refill(true,true)
		})
		urlinput.addEventListener('change',function(){
			var tgtField = this.classList[1]
			var tgtNest = this.classList[3]
			data[tgtField][this.index][Number(this.dataset.nest)][tgtNest] = this.value
			refill(true,true)
		})
	}	
}

function formDeleteLink(){ //deleting a link needs to remove the DOM element & restore + Add Link if applicable

}

function createForm(){

	//v1 implementation - DOM structure sits in normal app with no content and display disabled, until this function
	//populates it with information and inputs for admins to change / add story content




}