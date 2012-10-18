/**
 * Aifang Javascript Framework.
 * Copyright 2012 ANJUKE Inc. All rights reserved.
 *
 * @path: ui/autocomplete.js
 * @author: Jock
 * @version: 1.0.0
 * @date: 2012/10/11
 *
 */

/// require('ui.ui');
/// require('string.trim');

/**
 * @namespace J.ui.autocomplete
 *
 * @require dom.dom, event.on
 *
 *
 */

(function (J, D) {

    /**
     * 缺省的选项配置
     * @type {Object}
     */
    var defaultOpts = {
        url:'/',
        autoSubmit: true,
        defer: 0,
        width: 0,
        params: {},
        source: {},
        offset:{
            x:0,
            y:-2
        },
        query: 'kw',
        cache:true,
        onChange:null,
        onSelect:null,
        tpl:null
    };

    /**
     * Auto Complete Function
     * @param el 需要绑定的输入框
     * @param options 扩展选项
     * @constructor
     */
    function Autocomplete(el, options) {

        var disabled = false, el = J.g(el), selectedIndex = -1, currentValue = el.val().trim(), CACHED = [], opts, tId, aId, mainId, isShow = false, divs,
            mainContainer, container, valueChangeTimer = null, ignoreValueChange = false, intervalTimer = null ;

        (function(){
            el.attr('autocomplete', 'off');
            opts = J.mix(defaultOpts, options || {}, true);
            tId = getId();
            aId = 'Autocomplete_' + tId;
            mainId = 'AutocompleteMain_' + tId;
            opts.width || (opts.width = el.width()-2);

            buildMain();
            buildCss();
            fixPosition();
            bindEvent();

        })();

        function getId(){
            return tId ? tId : Math.floor(Math.random() * 0x100000).toString(16);
        }

        function buildMain(){
            J.create('div', {
                id:mainId,
                style:'position:absolute;z-index:9999;'
            }).html('<div id="' + aId + '" style="display:none; width:'+opts.width+'px"></div>').appendTo('body');
            mainContainer = J.g(mainId);
            container = J.g(aId);
        }

        function buildCss(){
            var tplName = opts.tpl || 'def', tpl = J['tpl'], tplCss = ((tpl && tpl[tplName]) || "|{border:1px solid #ddd;border-top:0;background:#FFF;cursor:pointer;text-align:left;overflow:hidden;}| .ui_sel{background:#FFFFBB;}| .ui_item{border-top:1px solid #ddd;height:25px;line-height:25px;padding:0 10px;white-space:nowrap;overflow:hidden;font-size:12px}");
            if(!Autocomplete.tpl['#'+aId])
                Autocomplete.tpl['#'+aId] = J.rules(tplCss.replace(/\|/g,'#'+aId), true);
        }

        function fixPosition() {
			var offset = el.offset();
			mainContainer.setStyle({ top: (offset.y + el.height() + opts.offset.y) + 'px', left: (offset.x + opts.offset.x) + 'px' });
		}

        function bindEvent(){
            J.on(el, /opera/i.test(J.ua.ua) ? 'keypress' : 'keydown', KeyPress);
            J.on(el, 'keyup', keyup);
            J.on(el, 'blur', blur);
            J.on(el, 'focus', focus);
        }

        function KeyPress(e){
            if (disabled) { return; }
			switch (e.keyCode) {
				case 27: //KEY_ESC:
					el.val(currentValue.trim());
					hide();
					break;
				case 9: //KEY_TAB:
				case 13: //KEY_RETURN:
					if (selectedIndex === -1) {
						hide();
						return;
					}
					select();
					if (e.keyCode === 9) { return; }
					break;
				case 38: //KEY_UP:
					moveUp();
					break;
				case 40: //KEY_DOWN:
					moveDown();
					break;
				default:
					return;
			}
			e.preventDefault();
        }

        function keyup(e){
            if (disabled) return;
			switch (e.keyCode) {
				case 38: //KEY_UP:
				case 40: //KEY_DOWN:
                case 13: //KEY_RETURN:
					return;
			}
            if(ignoreValueChange) return;
			clearTimeout(valueChangeTimer);
			valueChangeTimer = setTimeout(valueChange, opts.defer);
        }

        function blur(){
            clearInterval(intervalTimer);
            J.on(D,'click',function(){
                hide();
                J.un(D, 'click', arguments.callee);
            })
        }

        function focus(){
            if (disabled) { return; }
            intervalTimer = setInterval(function(){
                if(currentValue != el.val().trim() && !ignoreValueChange) valueChange();
            },300);
        }

        function valueChange(){
			if (disabled || ignoreValueChange) {
				ignoreValueChange = false;
				return;
			}
            if(!(currentValue = el.val().trim())) return;
            selectedIndex = -1;
            onChange();
			getData();
        }

        function getCacheKey(){
            return encodeURIComponent(currentValue.trim());
        }

        function getData(){
            var a;
            if(opts.cache && (a = CACHED[getCacheKey()])) return suggest(a,'c');
            opts.params[opts.query] = currentValue.trim();
            J.getJSON(opts.url, {
                data:opts.params,
                onSuccess:suggest
            });
        }

        function suggest(a, c){
            var k,len,div;
            c || (k = getCacheKey()) && (CACHED[k] = a);

            if ((len = a.length) === 0) {
				hide();
				return;
			}
            container.empty();
            for (var i = 0; i < len; i++)
                (div = J.create('div', {"class": selectedIndex === i ? 'ui_item ui_sel':'ui_item',title:getValue(a[i])}).html(a[i]).appendTo(container)).on('mouseover', activate, i).on('click', select, i);
            show();
            divs = container.s('div');
        }

        function activate(e, selIndex){
            divs.each(function(i, div){
                div.removeClass('ui_sel')
            });
            divs.eq(selectedIndex = selIndex).addClass('ui_sel');
        }

        function select(e, selIndex){
            var form;
            ignoreValueChange = true;
            !J.isUndefined(selIndex) && el.val( getValue(currentValue = divs.eq(selectedIndex = selIndex).html()) );
            hide();
            onSelect();
            if(opts.autoSubmit && (form = el.up('form'))){
                form && form.get().submit();
            }
        }

        function getValue(v){
            return v ? v.trim().replace(/<[\/]?\w+>/g,'') : '';
        }

        function moveUp(){
            if (selectedIndex <= 0)  return;
            var div;
            ignoreValueChange = true;
            el.val( currentValue = getValue((div = divs.eq(--selectedIndex).addClass('ui_sel')).html()) );
            div.next().removeClass('ui_sel');
            onChange();
        }

        function moveDown(){
            if (!isShow || selectedIndex === divs.length-1)  return;
            var div;
            ignoreValueChange = true;
            el.val( currentValue = getValue((div = divs.eq(++selectedIndex).addClass('ui_sel')).html()) );
            selectedIndex > 0 && div.prev().removeClass('ui_sel');
            onChange();
        }

        function onChange(){
            opts.onChange && opts.onChange(currentValue);
        }

        function onSelect(){
            opts.onSelect && opts.onSelect(currentValue);
        }

        function show(){
            selectedIndex = -1;
			isShow || (container.show(),isShow = true);
        }

        function hide(){
            selectedIndex = -1;
            ignoreValueChange = false;
			isShow && (container.empty().hide(),isShow = false);
        }

        function enable(){
            disabled = false;
        }

        function disable(){
            disabled = true;
        }

        return {
            enable:enable,
            disable:disable,
            hide:hide,
            show:show
        };
	}

    Autocomplete.tpl = {};


    J.dom.fn.autocomplete = function(options){
        return new Autocomplete(this.get(), options)
    };

    J.ui.autocomplete = Autocomplete;


})(J, document);