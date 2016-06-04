

function generateForm(){
	// document.getElementById('formeditor')
	for(var i = 0; i<4; i++){ //recursively create fields for pillars here
		//create variables that are createElements for inputs
		//pillar name (pNames[i])
		//pillar value (values[i])
		//pillar text (pText[i])

		var plr = document.createElement('div')
		var pName = document.createElement('input')

		pName.className = 'pName'
		plr.appendChild(pName)
		// var pName = plr.appendChild(document.createElement('input')


		// <div class = 'pillar'>
		// 	<input class = "nameinput"></input>
		// </div>

		document.getElementById('formeditor').appendChild(plr)
		plr.className = 'plr'
	}
}

function createForm(){

	//v1 implementation - DOM structure sits in normal app with no content and display disabled, until this function
	//populates it with information and inputs for admins to change / add story content




}