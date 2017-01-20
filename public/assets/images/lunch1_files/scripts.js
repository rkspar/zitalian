jQuery(function () {
    jQuery('a').focus(function () {
        this.blur();
    });
    SI.Files.stylizeAll();
    slider.init();

});

var slider = {
    num: -1,
    cur: 0,
    cr: [],
    al: null,
    at: 10 * 1000,	/* change 1000 to control speed*/
    ar: true,
    init: function () {
        if (!slider.data || !slider.data.length) return false;

        var d = slider.data;
        slider.num = d.length;
        var pos = Math.floor(Math.random() * 1);
        for (var i = 0; i < slider.num; i++) {
            jQuery('#' + d[i].id).css({
                left: ((i - pos) * 1000)
            });
            jQuery('#slide-nav').append('<a id="slide-link-' + i + '" href="#" onclick="slider.slide(' + i + ');return false;" onfocus="this.blur();">' + (i + 1) + '</a>');
        }

        jQuery('img,div#slide-controls', jQuery('div#slide-holder')).fadeIn();
        slider.text(d[pos]);
        slider.on(pos);
        slider.cur = pos;
        window.setTimeout('slider.auto();', slider.at);
    },
    auto: function () {
        if (!slider.ar) return false;

        var next = slider.cur + 1;
        if (next >= slider.num) next = 0;
        slider.slide(next);
    },
    slide: function (pos) {
        if (pos < 0 || pos >= slider.num || pos == slider.cur) return;

        window.clearTimeout(slider.al);
        slider.al = window.setTimeout('slider.auto();', slider.at);

        var d = slider.data;
        for (var i = 0; i < slider.num; i++)
        jQuery('#' + d[i].id).stop().animate({
            left: ((i - pos) * 1000)
        },
        1000, 'swing');

        slider.on(pos);
        slider.text(d[pos]);
        slider.cur = pos;
    },
    on: function (pos) {
        jQuery('#slide-nav a').removeClass('on');
        jQuery('#slide-nav a#slide-link-' + pos).addClass('on');
    },
    text: function (di) {
        slider.cr['a'] = di.client;
        slider.cr['b'] = di.desc;
        slider.ticker('#slide-client span', di.client, 0, 'a');
        slider.ticker('#slide-desc', di.desc, 0, 'b');
    },
    ticker: function (el, text, pos, unique) {
        if (slider.cr[unique] != text) return false;

        ctext = text.substring(0, pos) + (pos % 2 ? '-' : '_');
        jQuery(el).html(ctext);

        if (pos == text.length) jQuery(el).html(text);
        else window.setTimeout('slider.ticker("' + el + '","' + text + '",' + (pos + 1) + ',"' + unique + '");', 30);
    }
};

if (!window.SI) {
    var SI = {};
};
SI.Files = {
    htmlClass: 'SI-FILES-STYLIZED',
    fileClass: 'file',
    wrapClass: 'cabinet',

    fini: false,
    able: false,
    init: function () {
        this.fini = true;

        var ie = 0
        if (window.opera || (ie && ie < 5.5) || !document.getElementsByTagName) {
            return;
        }
        this.able = true;

        var html = document.getElementsByTagName('html')[0];
        html.className += (html.className != '' ? ' ' : '') + this.htmlClass;
    },
    stylize: function (elem) {
        if (!this.fini) {
            this.init();
        };
        if (!this.able) {
            return;
        };

        elem.parentNode.file = elem;
        elem.parentNode.onmousemove = function (e) {
            if (typeof e == 'undefined') e = window.event;
            if (typeof e.pageY == 'undefined' && typeof e.clientX == 'number' && document.documentElement) {
                e.pageX = e.clientX + document.documentElement.scrollLeft;
                e.pageY = e.clientY + document.documentElement.scrollTop;
            };
            var ox = oy = 0;
            var elem = this;
            if (elem.offsetParent) {
                ox = elem.offsetLeft;
                oy = elem.offsetTop;
                while (elem = elem.offsetParent) {
                    ox += elem.offsetLeft;
                    oy += elem.offsetTop;
                };
            };
            var x = e.pageX - ox;
            var y = e.pageY - oy;
            var w = this.file.offsetWidth;
            var h = this.file.offsetHeight;
            this.file.style.top = y - (h / 2) + 'px';
            this.file.style.left = x - (w - 30) + 'px';
        };
    },
    stylizeById: function (id) {
        this.stylize(document.getElementById(id));
    },
    stylizeAll: function () {
        if (!this.fini) {
            this.init();
        };
        if (!this.able) {
            return;
        };

        var inputs = document.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if (input.type == 'file' && input.className.indexOf(this.fileClass) != -1 && input.parentNode.className.indexOf(this.wrapClass) != -1) this.stylize(input);
        };
    }
};

(function (jQuery) {
    jQuery.fn.pngFix = function (settings) {
        settings = jQuery.extend({
            blankgif: 'blank.gif'
        },
        settings);
        var ie55 = (navigator.appName == 'Microsoft Internet Explorer' && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf('MSIE 5.5') != -1);
        var ie6 = (navigator.appName == 'Microsoft Internet Explorer' && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf('MSIE 6.0') != -1);

        if (jQuery.browser.msie && (ie55 || ie6)) {

            jQuery(this).each(function () {
                var bgIMG = jQuery(this).css('background-image');
                if (bgIMG.indexOf(".png") != -1) {
                    var iebg = bgIMG.split('url("')[1].split('")')[0];
                    jQuery(this).css('background-image', 'none');
                    jQuery(this).get(0).runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + iebg + "',sizingMethod='" + settings.sizingMethod + "')";
                }
            });

        }
        return jQuery;
    };
})(jQuery);
jQuery(function () {
    if (jQuery.browser.msie && jQuery.browser.version < 7) {

}
});