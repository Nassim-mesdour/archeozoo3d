var state = {
    subMenu : false,
    backdisable : false },

    menuDevlop = document.getElementById('menu-devlop'),
    closeEditor = document.getElementById('enable'),
    openEditor = document.getElementsByClassName('editor'),
    controlsElemLft = document.getElementsByClassName('sub_menu_lft'),
    controlsElemTop = document.getElementsByClassName('sub_menu_top'),  
    i=0;

// show and hide controls elements    
menuDevlop.addEventListener('click',function(){
    var i=0;
    for(i ; i < 6 ; i++){
        if(state.subMenu){
            (function(i){
                setTimeout(function(){
                    dragElementLeftIn(i);
                }, 50 * (i + 1));
            })(i);

            (function(i){
                setTimeout(function(){
                    dragElementRightIn(i);
                }, 50 * (i + 1));
            })(i);
        }else{
            (function(i){
                setTimeout(function(){
                    dragElementLeftOut(i);
                }, 100 * (i + 1));
            })(i);

            (function(i){
                setTimeout(function(){
                    dragElementRightOut(i);
                }, 100 * (i + 1));
            })(i);
        }

    }
    state.subMenu = !state.subMenu ;
    function dragElementLeftOut(i){
        document.getElementsByClassName('sub_menu_lft').item(i).setAttribute(
            "style","transform: translate(0px)"
        );
    }
    function dragElementLeftIn(i){
        document.getElementsByClassName('sub_menu_lft').item(i).setAttribute(
            "style","transform: translate(-72px);"
        );
    }

    function dragElementRightOut(i){ 
        document.getElementsByClassName('sub_menu_top').item(i).setAttribute(
            "style","transform: translate(0px,0px)"
        );
    }
    function dragElementRightIn(i){
        document.getElementsByClassName('sub_menu_top').item(i).setAttribute(
            "style","transform: translate(0px,-72px);"
        );
    }
},false);


// enable Editor
(function(){
    for(i;i<controlsElemLft.length;i++){
        controlsElemLft.item(i).addEventListener('click',function(){
            openEditor[0].setAttribute(
                "style","transform: scale(1,1)"
            )
        },false);
        controlsElemTop.item(i).addEventListener('click',function(){
            openEditor[0].setAttribute(
                "style","transform: scale(1,1)"
            )
        },false);
    }
})();

// disable Editor
closeEditor.addEventListener('click',function(){
    this.parentElement.setAttribute(
        "style","transform: scale(0,0)"
    )
},false);