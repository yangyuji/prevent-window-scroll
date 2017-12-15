/*
* author: "oujizeng",
* license: "MIT",
* name: "noscroll.js",
* version: "1.0.0"
*/

(function (root, factory) {
    if (typeof module != 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root['nosroll'] = factory();
    }
}(this, function () {

    var util = {
        hasClass: function (e, c) {
            var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
            return re.test(e.className);
        },
        addClass: function (e, c) {
            if ( this.hasClass(e, c) ) {
                return;
            }
            var newclass = e.className.split(' ');
            newclass.push(c);
            e.className = newclass.join(' ');
        },
        removeClass: function (e, c) {
            if ( !this.hasClass(e, c) ) {
                return;
            }
            var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
            e.className = e.className.replace(re, '');
        },
        data: function (e, key, val) {
            //console.log(e);
            if (val) e.dataset[key] = val;
            else {
                if (!e.dataset || e.dataset.length <= 0) return null;
                return e.dataset[key] || null;
            }
        }
    };

    var nosroll = function(overflow, scrollable) {

        // 如果没有滚动容器选择器，或者已经绑定了滚动时间，忽略
        if (!scrollable || util.data(overflow, 'hasBindScroll')) {
            console.log(!scrollable);
            console.log(util.data(overflow, 'hasBindScroll'));
            return;
        }

        // 判断和筛选是否是搓浏览器
        var isBadBrowser;

        var data = {
            scroll: null,
            posY: 0,
            scrollY: 0,
            maxscroll: 0
        };

        // 事件处理
        overflow.addEventListener('touchstart', touchstart, true);
        overflow.addEventListener('touchmove', touchmove, true);
        overflow.addEventListener('touchend', touchend, true);
        overflow.addEventListener('touchcancel', touchend, true);

        function touchstart (event) {
            var events = event.touches[0] || event;
            var target = event.target;

            var scroll = null;
            // 获取标记的滚动元素，自身或子元素皆可
            if (util.hasClass(target, scrollable)) {
                scroll = target;
            }
            // 查找父元素
            while(target && scroll == null) {
                if (util.hasClass(target, scrollable)) {
                    scroll = target;
                } else {
                    target = target.parentNode;
                }
            }

            console.log(scroll);
            // 没找到滚动元素
            if (!scroll) {
                return;
            }

            // 当前滚动元素标记
            data.scroll = scroll;
            data.posY = events.pageY;
            data.scrollY = scroll.scrollTop;
            // 是否可以滚动
            data.maxscroll = scroll.scrollHeight - scroll.clientHeight;
        }

        function touchmove (event) {

            var events = event.touches[0] || event;

            // 如果容器不足以滚动，则禁止触发整个窗体元素的滚动
            if (data.maxscroll <= 0 || isBadBrowser) {
                // 禁止滚动
                event.preventDefault();
            }

            // 垂直滑动距离
            var distanceY = events.pageY - data.posY;

            // 不兼容浏览器处理
            if (isBadBrowser) {
                data.scroll.scrollTop(data.scrollY - distanceY);
                data.scroll.dispatchEvent('scroll');
                return;
            }

            // 当前的滚动高度
            var scrollTop = data.scroll.scrollTop;
            console.log(scrollTop);

            // 上下边缘检测
            if (distanceY > 0 && scrollTop == 0) {
                // 上滑到顶部，禁止滚动
                event.preventDefault();
                return;
            }

            // 下边缘检测
            if (distanceY < 0 && (scrollTop + 1 >= data.maxscroll)) {
                // 下滑到底部，禁止滚动
                event.preventDefault();
                return;
            }
        }

        function touchend () {
            data.maxscroll = 0;
        }

        // 防止多次重复绑定
        util.data(overflow, 'hasBindScroll', true);
    };

    return nosroll;
}));