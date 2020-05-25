<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App',

    // mounted() {
    //     function detectZoom() {
    //         var ratio = 0,
    //             screen = window.screen,
    //             ua = navigator.userAgent.toLowerCase();
    //
    //         if (window.devicePixelRatio !== undefined) {
    //             ratio = window.devicePixelRatio;
    //         }
    //         else if (~ua.indexOf('msie')) {
    //             if (screen.deviceXDPI && screen.logicalXDPI) {
    //                 ratio = screen.deviceXDPI / screen.logicalXDPI;
    //             }
    //         }
    //         else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
    //             ratio = window.outerWidth / window.innerWidth;
    //         }
    //
    //         if (ratio) {
    //             ratio = Math.round(ratio * 100);
    //         }
    //         return ratio;
    //     };
    //
    //     window.onload = window.onresize = function () {
    //         if(detectZoom() > 100){ //当前电脑/浏览器缩放大于100%, 按等比缩小; 当电脑和浏览器都存在缩放，值会累计加在一起的；
    //             document.body.style.zoom = (125/detectZoom()).toFixed(2);
    //         }else{
    //             document.body.style.zoom = 1;
    //         }
    //     };
    // },
   created() {

   }
    }
</script>

<style scoped>
    .content {

        height: 100%;
        width: 100%;
    }
</style>
