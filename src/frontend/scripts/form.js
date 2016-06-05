

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
			// pName.className 
			pName.innerHTML = '<span class = "form label"> name </span> <input class = "form pNames"> <span class = "form label">value </span> <input class = "form values">'

		var pText = document.createElement('div')
			// pText.className
			pText.innerHTML = '<span class = "form label"> text </span><textarea class = "form pTexts">'

		// pName.className = 'pName'
		// pName.index = i
		// pName.addEventListener('click',function(){this.focus()})
		// pName.addEventListener('change',function(){data.pNames[this.index] = this.value})

		
			
		plr.appendChild(pName)
		plr.appendChild(pText)
		
		//populating the fields from the data


		//event listeners on every input, per pillar
		// var allInputs = plr.getElementsByTagName('input')
		var allInputs = plr.querySelectorAll('input,textarea')
		console.log(allInputs)

		for(var it = 0; it<allInputs.length; it++){


			allInputs[it].index = i

			allInputs[it].value = data[allInputs[it].classList[1]][i]


			// var tgtField = allInputs[it].classList[1]
			allInputs[it].addEventListener('click',function(){this.focus()})
			allInputs[it].addEventListener('change', function(){
				var tgtField = this.classList[1]
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

function createForm(){

	//v1 implementation - DOM structure sits in normal app with no content and display disabled, until this function
	//populates it with information and inputs for admins to change / add story content




}