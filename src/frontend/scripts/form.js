var formActive = false

function generateForm(){
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
			pName.classList.add('form','namesvalues')
			labeler('name',pName)
			pName.innerHTML += '<input class = "form pNames" value = "'+data.pNames[i]+'">'
			labeler('value',pName)
			pName.innerHTML += '<input class = "form values" value = "'+data.values[i]+'">'

		var pText = document.createElement('div')
			pText.classList.add('form','maintext')
			labeler('text',pText)
			pText.innerHTML += '<textarea class = "form pTexts">'+data.pTexts[i]+'</textarea>'

		var pLinks = document.createElement('div')
			pLinks.classList.add('form','links')
			labeler('links',pLinks)



			
				//for every link, add in an input for type and one for c
				for(var it = 0; it<data.pLinks[i].length; it++){

					pLinks.innerHTML += '<select class = "form pLinks nested type" value="'+data.pLinks[i][it].type+'" data-nest="'+it+'">'
					var dropdown = pLinks.getElementsByTagName('select')[it]
						dropdown.innerHTML += '<option value = "'+data.pLinks[i][it].type+'">'+data.pLinks[i][it].type+'</option>'
						for(var ite = 0; ite<linkTypes.length; ite++){
							if(linkTypes[ite] === data.pLinks[i][it].type) continue
							dropdown.innerHTML+= '<option value = "' + linkTypes[ite] + '">'+linkTypes[ite]+'</option>'
						}
					
					pLinks.innerHTML += '<input class = "form pLinks nested c" value="' + data.pLinks[i][it].c + '" data-nest="'+it+'">'
				}
				//add link button
				var linkbtn = document.createElement('div')
					linkbtn.classList.add('form','linkbtn')
					linkbtn.addEventListener('click', function(){
						//which plr are we in?
						var plrIndex = [].indexOf.call(this.parentNode.parentNode.parentNode.children, this.parentNode.parentNode)
						//which link will we be creating / how many precede this one? 
						var iteration = (this.parentNode.childNodes.length - 2) / 2
						formAddLink(this.parentNode,plrIndex,iteration)
					}) 
					linkbtn.textContent = " + Add a Link"
				pLinks.appendChild(linkbtn)
				// if(data.pLinks[i].length < 3) pLinks.innerHTML += '<div class = "form linkbtn"> + Add a Link </span>'



		// pName.className = 'pName'
		// pName.index = i
		// pName.addEventListener('click',function(){this.focus()})
		// pName.addEventListener('change',function(){data.pNames[this.index] = this.value})

		
			
		plr.appendChild(pName)
		plr.appendChild(pText)
		plr.appendChild(pLinks)
		
		//populating the fields from the data


		//recursive event listeners on every input, per pillar
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
		//special actions: add link button, add lines, etc. 
		function debugAddLink(){
			var plrIndex = this.parentNode.parentNode.parentNode.children
			console.log([].indexOf.call(plrIndex,this.parentNode.parentNode))

			// console.log(plrIndex)
		}

		function formAddLink(daddy,whichPlr,iter){ //formAddLink(pLinks,i,it) || 
			// || formAddLink(this.parentNode,[].call.indexOf(this.parentNode.parentNode.parentNode.children,this.parentNode.parentNode),this.parentNode)
			// daddy.innerHTML += 

			//conditional variable: maybe theres' no data at this iter!
			var linkInData = true

			if(!data.pLinks[whichPlr] || !data.pLinks[whichPlr][iter]) var link = {c: 'url here', type: 'linktype'}
			else var link = data.pLinks[whichPlr][iter]

			daddy.innerHTML += '<select class = "form pLinks nested type" data-nest="'+iter+'">'
			var dropdown = daddy.getElementsByTagName('select')[iter]
				dropdown.innerHTML += '<option value = "'+link.type+'">'+link.type+'</option>'
				for(var ite = 0; ite<linkTypes.length; ite++){
					if(linkTypes[ite] === link.type) continue
					dropdown.innerHTML+= '<option value = "' + linkTypes[ite] + '">'+linkTypes[ite]+'</option>'
				}
			
			daddy.innerHTML += '<input class = "form pLinks nested c" value="' + link.c + '" data-nest="'+iter+'">'	
		}

		// var linkbtn = plr.getElementsByClassName('linkbtn')[0]
		// document.getElementsByClassName('linkbtn').addEventListener('click',function(){

		// })

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