/*
 * ============================================================================
 * BaseTheme entry point
 * ============================================================================
 */

var BaseTheme = {};

BaseTheme.$window = null;
BaseTheme.$body = null;

BaseTheme.windowSize = {
    width: 1920,
    height: 1280
};

BaseTheme.firstResize = true;

BaseTheme.$nav = null;
BaseTheme.nav = null;

BaseTheme.isMobile = false;
BaseTheme.isIE = false;

BaseTheme.page = null;
BaseTheme.pageFuture = null;

BaseTheme.$ajaxContainer = null;
BaseTheme.ajaxEnabled = false;


/**
 * On document ready
 * @param event
 */
BaseTheme.onDocumentReady = function(e) {
    var _this = _this;

    // Store temp configuration
    for( var index in temp ){
        BaseTheme[index] = temp[index];
    }

    BaseTheme.init();
};


/**
 * Init
 * @return {[type]} [description]
 */
BaseTheme.init = function(){
    var _this = this;

    // Set default TweenLite ease
    TweenLite.defaultEase = Expo.easeOut;

    // Selectors
    _this.$window = $(window);
    _this.$body = $('body');

    // Set first window size
    var viewport = getViewportSize();

    _this.windowSize = {
        width : viewport.width,
        height : viewport.height
    };

    // isMobile test
    _this.isMobile = (isMobile.any === false) ? false : true;
    if(_this.isMobile) addClass(_this.$body[0],'is-mobile');

    // IE Test
    if(_this.$body[0].className.indexOf('ie') >= 0) _this.isIE = true;

    // Nav
    _this.$nav = $('#nav');
    if(_this.$nav.length) _this.nav = new BaseThemeNav();

    // Page 
    _this.page = new BaseThemePage(_this.$body[0].id, 'static');

    // Events
    _this.$window.on('resize', debounce($.proxy(_this.resize, _this), 50, false));
    _this.$window.on('orientationchange', debounce($.proxy(_this.resize, _this), 50, false));
    _this.$window.trigger('resize');
};


/**
 * Resize
 * @return {[type]} [description]
 */
BaseTheme.resize = function(){
    var _this = this;

    console.log('-> Resize');

    // Check is sizes has changed
    var viewport = getViewportSize();

    if(viewport.width !== _this.windowSize.width || viewport.height !== _this.windowSize.height || _this.firstResize){

        _this.windowSize = getViewportSize();

        console.log(_this.windowSize.width);

        if(_this.firstResize) _this.firstResize = false;
    }
};


/*
 * ============================================================================
 * Plug into jQuery standard events
 * ============================================================================
 */
$(document).ready(BaseTheme.onDocumentReady);
