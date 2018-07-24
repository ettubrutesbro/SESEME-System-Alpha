var editor = document.getElementById('editor')

function FormInput(style,addclass,indexed,plrindex,val,nested,nestInd,nestTgt){
    var fi = document.createElement(style)
    
    fi.tgt = addclass
    if(indexed) fi.plr = plrindex
    fi.value = val
    fi.classList.add('form',addclass)
    fi.nestTgt = nestTgt    
    fi.nest = nestInd

    fi.onchange = function(){
        console.log('trying to change data ' + this.tgt,this.plr,this.nest + 'to '+ this.value)
        //change the data
        if(this.tgt === 'title') data.title[this.plr][this.nestTgt] = this.value
        else if(!indexed) data[this.tgt] = this.value
        else if(!this.nested) data[this.tgt][this.plr] = this.value
        else data[this.tgt][this.plr][this.nest][this.nestTgt] = this.value
        refill(true,true)
    }

    return fi
}

function generateForm(){
    // TODO: rewrite fromplrinput to work for non-plr specific inputs like
    // maintext etc. , learn about checkbox pattern 
    // editor.appendChild(new FormIpnut('input','title',false,0,data.titleblock))
    editor.style.display = 'block'
    editor.titleblock = document.createElement('div')
    editor.titleblock.classList.add('form','titleblock')
    editor.titleblock.reorder = function(remove){
        this.removeChild(this.children[remove])
        data.title.splice(remove,1)
        for(var i = 0; i<data.title.length;i++){
            this.children[i].content.plr = this.children[i].font.plr =
            this.children[i].size.plr = this.children[i].margin.plr =
            this.children[i].delbtn.plr = i
        }
    }
    editor.addtitlebtn = new FormInput('input','addbtn',true,i,'+ Add Line')
    editor.addtitlebtn.type = 'submit'
    for(var i = 0; i<data.title.length; i++){
        editor.titleblock.appendChild(addTitleRow(i))
    }
    editor.maintext = new FormInput('textarea','maintext',false,0,data.maintext)
    editor.appendChild(editor.titleblock)
    editor.appendChild(editor.addtitlebtn)
    editor.appendChild(editor.maintext)

    generateFormPlrs()
}
function generateFormPlrs(){
    editor.plr = []
    for(var i=0; i<4; i++){
        var plr = document.createElement('div')
        plr.inputs = {
            name: new FormInput('input','pNames',true,i,data.pNames[i]),
            val: new FormInput('input','values',true,i,data.values[i]),
            text: new FormInput('textarea','pTexts',true,i,data.pTexts[i]),
            links: document.createElement('div'),
            addbtn: new FormInput('input','addbtn',true,i,'+ Add a Link')
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
            row.type = new FormInput('select','pLinks',i,data.pLinks[i][it].type,true,it,'type')
            for(var ite = 0; ite<linkTypes.length; ite++){
                row.type.appendChild(new Option(linkTypes[ite],linkTypes[ite],true,
                    linkTypes[ite]===data.pLinks[i][it].type?true:false))
            }
            row.url = new FormInput('input','pLinks',true,i,data.pLinks[i][it].c,true,it,'c')

            row.delbtn = new FormInput('input','x',true,i,'X',true,it,'')
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

    function FormLabel(classname,content){
        var lbl = document.createElement('label')
        lbl.classList.add('form',classname)
        lbl.textContent = content
        return lbl
    }
}

    function addTitleRow(i){
        var row = document.createElement('div')
        row.classList.add('form','linkrow')
        row.content = new FormInput('input','title',true,i,data.title[i].c,false,0,'c')
        row.content.classList.add('titlecontent')
        row.font = new FormInput('select','title',true,i,data.title[i].size,false,0,'font')
            row.font.appendChild(new Option('Sans','Karla',true,data.title[i].font!=='Droid Serif'?true:false))
            row.font.appendChild(new Option('Serif','Droid Serif',true,data.title[i].font==='Droid Serif'?true:false))
        row.font.classList.add('titlefont')
        row.size = new FormInput('input','title',true,i,data.title[i].size,false,0,'size')
        row.size.classList.add('titlesize')
        row.margin = new FormInput('input','title',true,i,data.title[i].margin||0,false,0,'margin')
        row.margin.classList.add('titlemargin')
        row.delbtn = new FormInput('input','x',true,i,'X')
        row.delbtn.type = 'submit'
            row.delbtn.addEventListener('click',function(){
                console.log('removing title line#' + this.plr)
                editor.titleblock.reorder(this.plr)
            })
        row.appendChild(row.content)
        row.appendChild(row.font)
        row.appendChild(row.size)
        row.appendChild(row.margin)
        row.appendChild(row.delbtn)
        return row
    }
