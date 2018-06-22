/*
* author: "oujizeng",
* license: "MIT",
* github: "https://github.com/yangyuji/prevent-window-scroll",
* name: "noscroll.js",
* version: "1.1.1"
*/

(function (root, factory) {
    if (typeof module != 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root['nosroll'] = factory();
    }
}(this, function () {

    var nosroll = function(overflow, scrollable) {

        // 如果没有滚动容器选择器，或者已经绑定了滚动时间，忽略
        if (!scrollable || overflow.dataset['bindScroll']) {
            return;
        }

        var current = {
            scroll: null,
            posY: 0,
            maxscroll: 0
        };

        // 事件处理
        overflow.addEventListener('touchstart', touchstart, true);
        overflow.addEventListener('touchmove', touchmove, true);
        overflow.addEventListener('touchend', touchend, true);
        overflow.addEventListener('touchcancel', touchend, true);

        function touchstart (e) {
            var target = e.target;

            var scroll = null;
            // 获取标记的滚动元素，自身或子元素皆可
            if (target.classList.contains(scrollable)) {
                scroll = target;
            }
            while(target && scroll == null) {
                if (target.classList && target.classList.contains(scrollable)) {
                    scroll = target;
                } else {
                    target = target.parentNode;
                }
            }
            if (!scroll) {
                return;
            }

            // 当前滚动元素标记
            current.scroll = scroll;
            current.posY = e.touches[0].pageY;
            // 是否可以滚动
            current.maxscroll = scroll.scrollHeight - scroll.offsetHeight;
        }

        function touchmove (e) {
            // 如果容器不足以滚动，则禁止触发整个窗体元素的滚动
            if (current.maxscroll <= 0) {
                // 禁止滚动
                !e.defaultPrevented && e.preventDefault();
            }

            // 垂直滑动距离
            var distanceY = e.touches[0].pageY - current.posY;
            // 当前的滚动高度
            var scrollTop = current.scroll.scrollTop;
            // console.log(scrollTop);

            // 上下边缘检测
            if (distanceY > 0 && scrollTop === 0) {
                // 上滑到顶部，禁止滚动
                !e.defaultPrevented && e.preventDefault();
                return;
            }

            // 下边缘检测
            if (distanceY < 0 && (scrollTop + 1 >= current.maxscroll)) {
                // 下滑到底部，禁止滚动
                !e.defaultPrevented && e.preventDefault();
                return;
            }
        }

        function touchend () {
            current.maxscroll = 0;
        }

        // 防止多次重复绑定
        overflow.dataset['bindScroll'] = true;
    };

    return nosroll;
}));