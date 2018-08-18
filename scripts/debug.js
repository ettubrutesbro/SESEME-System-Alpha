function debugSeedlingPress(which){
    console.log('pressed',which,'story was',story)
    if(which===story){
        //advance story
        forceNext()
    }
    if(which!==story){
        //change story
        forceToPart(0)
        forceStory(which)
    }
}

function debugOpenClose(){
    document.getElementById('debug').classList.toggle('open')
    if(dom.help.className === 'close'){
        document.getElementById('debug').style.display = 'none'
    }
}


document.getElementById('debuglabel').addEventListener('click',debugOpenClose)
document.getElementById('debugclose').addEventListener('click',debugOpenClose)
document.getElementById('forces1').addEventListener('click',function(){debugSeedlingPress(0)})
document.getElementById('forces2').addEventListener('click',function(){debugSeedlingPress(1)})
document.getElementById('forces3').addEventListener('click',function(){debugSeedlingPress(2)})
document.getElementById('initform').addEventListener('click',function(){generateForm()})