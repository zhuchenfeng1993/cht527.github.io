
/*      1、入场、出场动画       */

var transitionLayer = $('.cd-transition-layer'),
    transitionBackground = $('.bg-layer'),
    modalWindow=$('.cd-modal');
var frameProportion = 1.78, //png frame aspect ratio
    frames = 25, //number of png frames
    resize = false;
//set transitionBackground dimentions
setLayerDimensions();

setTimeout(function(){
    modalWindow.addClass('visible');
}, 3000);

//---窗口调整大小---
window.onresize= function(){
    if( !resize ) {
        resize = true;
        (!window.requestAnimationFrame) ? setTimeout(setLayerDimensions, 300) : window.requestAnimationFrame(setLayerDimensions);
    }
};

//close modal window
modalWindow.on('click', '.modal-close', function(event){
        event.preventDefault();
        transitionLayer.addClass('closing');
        modalWindow.removeClass('visible');
        transitionBackground.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
            transitionLayer.removeClass('closing opening visible');
            transitionBackground.off('webkitAnimationEnd oanimationend msAnimationEnd animationend');
        });
});
//--- 遮罩层 调整大小---
function setLayerDimensions() {
        var windowWidth = $(window).width(),
            windowHeight = $(window).height(),
            layerHeight, layerWidth;

        if( windowWidth/windowHeight > frameProportion ) {
            layerWidth = windowWidth;
            layerHeight = layerWidth/frameProportion;
        } else {
            layerHeight = windowHeight*1.2;
            layerWidth = layerHeight*frameProportion;
        }

        transitionBackground.css({
            'width': layerWidth*frames+'px',
            'height': layerHeight+'px',
        });

        resize = false;
}

