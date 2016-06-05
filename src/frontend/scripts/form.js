

function generateForm(){
	var linkTypes = ['chain','list','data','www','yt','pix',
			'article','book','site','convo','tw','tw2','tw3','ig',
			'ig2','fb','podcast']
	// document.getElementById('formeditor')
	for(var i = 0; i<4; i++){ //recursively create fields for pillars here
		//create variables that are createElements for inputs
		//pillar name (pNames[i])
		//pillar value (values[i])
		//pillar text (pText[i])
		var plr = document.createElement('div')
		plr.className = 'plr'
		// plr.innerHTML = '<span>name</span><input class = "pName"><span>/text</span><input class = "pText"> '

		var pName = document.createElement('div')
			// pName.className 
			labeler('name',pName)
			pName.innerHTML += '<input class = "form pNames" value = "'+data.pNames[i]+'">'
			labeler('value',pName)
			pName.innerHTML += '<input class = "form values" value = "'+data.values[i]+'">'

		var pText = document.createElement('div')
			// pText.className
			labeler('text',pText)
			pText.innerHTML += '<textarea class = "form pTexts">'+data.pTexts[i]+'</textarea>'

		var pLinks = document.createElement('div')
			labeler('links',pLinks)



			
				//for every link, add in an input for type and one for c
				for(var it = 0; it<data.pLinks[i].length; it++){
					pLinks.appendChild(document.createElement('div'))

					pLinks.innerHTML += '<select class = "form pLinks nested type" value="'+data.pLinks[i][it].type+'" data-nest="'+it+'">'
					var dropdown = pLinks.getElementsByTagName('select')[it]
						dropdown.innerHTML += '<option value = "'+data.pLinks[i][it].type+'">'+data.pLinks[i][it].type+'</option>'
						for(var ite = 0; ite<linkTypes.length; ite++){
							if(linkTypes[ite] === data.pLinks[i][it].type) continue
							dropdown.innerHTML+= '<option value = "' + linkTypes[ite] + '">'+linkTypes[ite]+'</option>'
						}
					dropdown.nestedIndex = it
					
					pLinks.innerHTML += '<input class = "form pLinks nested c" value="' + data.pLinks[i][it].c + '" data-nest="'+it+'">'
					// pLinks.innerHTML += '</div>'
				}
				//UNLESS the length was 3, add in the + button 
				pLinks.innerHTML += '<span class = "form linkbtn"> + Add a Link </span>'



		// pName.className = 'pName'
		// pName.index = i
		// pName.addEventListener('click',function(){this.focus()})
		// pName.addEventListener('change',function(){data.pNames[this.index] = this.value})

		
			
		plr.appendChild(pName)
		plr.appendChild(pText)
		plr.appendChild(pLinks)
		
		//populating the fields from the data


		//event listeners on every input, per pillar
		// var allInputs = plr.getElementsByTagName('input')
		var allInputs = plr.querySelectorAll('input,textarea,select')

		for(var it = 0; it<allInputs.length; it++){

			allInputs[it].index = i
			allInputs[it].addEventListener('click',function(){this.focus()})
			allInputs[it].addEventListener('change', function(){
				var tgtField = this.classList[1] 
				if(this.classList.contains('nested')){
					var tgtNest = this.classList[3]
					data[tgtField][this.index][Number(this.dataset.nest)][tgtNest] = this.value
					refill(true,true)
					return
				} 
				 
				console.log(tgtField + this.index + ' is due for a change')
				data[tgtField][this.index] = tgtField === 'values' ? Number(this.value) : this.value
				refill(true,true)
			})

		}
		// var pName = plr.appendChild(document.createElement('input')


		// <div class = 'pillar'>
		// 	<input class = "nameinput"></input>
		// </div>

		plr.className = 'plr'
		document.getElementById('editor').appendChild(plr)
		
	}
}

function labeler(text,parentElement){
	var label = document.createElement('span')
	label.classList.add('form','label')
	label.textContent = text

	parentElement.appendChild(label)
}

function createForm(){

	//v1 implementation - DOM structure sits in normal app with no content and display disabled, until this function
	//populates it with information and inputs for admins to change / add story content




}