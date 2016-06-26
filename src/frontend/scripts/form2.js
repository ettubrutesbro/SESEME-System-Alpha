var editor = document.getElementById('editor')

function FormPlrInput(style,addclass,plrindex,val,nested,nestInd,nestTgt){
	var fi = document.createElement(style)
	
	fi.tgt = addclass
	fi.plr = plrindex
	fi.value = val
	fi.classList.add('form',addclass)
	fi.nestTgt = nestTgt
	fi.nested = nested

	if(nested){
		fi.nest = nestInd
		fi.reorder = function(){
			var newNum = this.parentElement.getElementsByClassName(addclass).indexOf(this)
			console.log(fi.nest + ' becomes ' + newNum)
			fi.nest = newNum
		}
	}

	fi.onchange = function(){
		console.log('trying to change data ' + this.tgt,this.plr,this.nest + 'to '+ this.value)
		//change the data
		if(!this.nested) data[this.tgt][this.plr] = this.value
		else data[this.tgt][this.plr][this.nest][this.nestTgt] = this.value
		refill(true,true)
	}

	return fi
}

function generateForm(){
	// TODO: rewrite fromplrinput to work for non-plr specific inputs like
	// maintext etc. , learn about checkbox pattern 
	editor.appendChild(new FormPlrInput('textarea','maintext'))
	generateFormPlrs()
}
function generateFormPlrs(){
	editor.plr = []
	for(var i=0; i<4; i++){
		var plr = document.createElement('div')
		plr.inputs = {
			name: new FormPlrInput('input','pNames',i,data.pNames[i]),
			val: new FormPlrInput('input','values',i,data.values[i]),
			text: new FormPlrInput('textarea','pTexts',i,data.pTexts[i]),
			links: document.createElement('div'),
			addbtn: new FormPlrInput('input','addbtn',i,'+ Add a Link')
		}

		plr.inputs.links.plr = i
		plr.inputs.links.reorder = function(remove){
			var allrows = editor.plr[this.plr].inputs.links.getElementsByClassName('linkrow')
			this.removeChild(allrows[remove])
			data.pLinks[this.plr].splice(remove,1)
			for(var it = 0; it<allrows.length; it++){
				allrows[it].type.nest = allrows[it].url.nest = allrows[it].delbtn.nest = it
			}
			editor.plr[this.plr].inputs.addbtn.style.display = 'block'
		}
		if(data.pLinks[i].length===3) plr.inputs.addbtn.style.display = 'none'
		plr.inputs.addbtn.type = 'submit'
		plr.inputs.addbtn.addEventListener('click',function(){
			var newdata = {c: 'url here', type: linkTypes[Math.floor(Math.random()*linkTypes.length)]}
			data.pLinks[this.plr].push(newdata)
			editor.plr[this.plr].inputs.links.appendChild(addLinkRow(this.plr,data.pLinks[this.plr].length-1))
			if(data.pLinks[this.plr].length===3) this.style.display = 'none'
		})

		for(var it = 0; it<data.pLinks[i].length; it++){
			plr.inputs.links.appendChild(addLinkRow(i,it))
		}

		


		var allinputs = Object.keys(plr.inputs)
		for(var it = 0; it<allinputs.length; it++){
			plr.appendChild(plr.inputs[allinputs[it]])
		}

		editor.plr[i] = plr
		editor.appendChild(plr)

	}//end pillar loop

	function addLinkRow(i,it){
		var row = document.createElement('div')
			row.classList.add('form','linkrow')
			console.log(data.pLinks[i])
			row.type = new FormPlrInput('select','pLinks',i,data.pLinks[i][it].type,true,it,'type')
			for(var ite = 0; ite<linkTypes.length; ite++){
				row.type.appendChild(new Option(linkTypes[ite],linkTypes[ite],true,
					linkTypes[ite]===data.pLinks[i][it].type?true:false))
			}
			row.url = new FormPlrInput('input','pLinks',i,data.pLinks[i][it].c,true,it,'c')

			row.delbtn = new FormPlrInput('input','x',i,'X',true,it,'')
			row.delbtn.type = 'submit'
			row.delbtn.addEventListener('click',function(){
				console.log('removing plr'+this.plr+'\'s #'+this.nest+' link')
				editor.plr[this.plr].inputs.links.reorder(this.nest)
			})

			row.appendChild(row.type)
			row.appendChild(row.url)
			row.appendChild(row.delbtn)

			return row
	}
}
