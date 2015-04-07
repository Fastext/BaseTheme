/**
 * History
 */

var BaseThemeHistory = function(){
    var _this = this;

    _this.state = null;
    _this.stateBlock = true;

    _this.$link = $('.ajax-link');

    // Methods
    _this.init();
};


/**
 * Init
 * @return {[type]} [description]
 */
BaseThemeHistory.prototype.init = function(){
    var _this = this;

    // Events
    _this.$link.on('click', $.proxy(_this.linkClick, _this));
    History.Adapter.bind(window,'statechange', $.proxy(_this.stateChange, _this));

};


/**
 * Destroy
 * @return {[type]} [description]
 */
BaseThemeHistory.prototype.destroy = function(){
    var _this = this;

    // Events

};


/**
 * State change
 * @return {[type]} [description]
 */
BaseThemeHistory.prototype.stateChange = function(){
    var _this = this;

    _this.state = History.getState();

    // console.log('--- CHANGE STATE ---');
    // console.log('Title      -> '+_this.state.title);
    // console.log('URL        -> '+_this.state.url);
    // console.log('Transition -> '+_this.state.data.transition);
    // console.log('Context    -> '+_this.state.data.context);
    // console.log(_this.state);

    if(!_this.stateBlock){
        // console.log('CHANGE PAGE');

        _this.context = _this.state.data.context;

        _this.loadPage();

        // Analytics
        _this.relativeUrl = _this.state.url.substring(_this.baseUrl.length);
        if(typeof(ga) !== 'undefined') ga('send', 'pageview', {'page':'/'+_this.relativeUrl, 'title':_this.state.title});
    }

    // console.log('--------------------');

};


/**
 * Link click
 * @return {[type]} [description]
 */
BaseThemeHistory.prototype.linkClick = function(e){
    var _this = this;

    // console.log('-> Link click');

    var linkClassName = e.currentTarget.className;

    // Check if link is not active
    if(linkClassName.indexOf('active') == -1 && !_this.transition) {

        _this.transition = true;

        // Push first state
        if(_this.state === null){
            History.pushState(
                {
                    'node_type'     : BaseTheme.page.type,
                    'node_name'     : BaseTheme.page.id,
                    'index'         : parseInt(e.currentTarget.getAttribute('data-index')),
                    'transition'    : e.currentTarget.getAttribute('data-node-type')+'_to_'+BaseTheme.page.type,
                    'context'       : 'link',
                    'is_home'       : BaseTheme.page.isHome
                },
                document.title,
                window.location.href
            );

            _this.stateBlock = false;
        }

        var context = (e.currentTarget.className.indexOf('nav-item-link') >= 0) ? 'nav' : 'link',
            dataHome = e.currentTarget.getAttribute('data-is-home'),
            isHome = (dataHome == '1') ? true : false,
            title = e.currentTarget.getAttribute('data-title');

        if(title === '') title = e.currentTarget.innerHTML;

        // Push history state
        History.pushState(
            {
                'node_type'     : e.currentTarget.getAttribute('data-node-type'),
                'node_name'     : e.currentTarget.getAttribute('data-node-name'),
                'index'         : parseInt(e.currentTarget.getAttribute('data-index')),
                'transition'    : BaseTheme.page.type+'_to_'+e.currentTarget.getAttribute('data-node-type'),
                'context'       : context,
                'is_home'       : isHome
            },
            title,
            e.currentTarget.href
        );
    }

    e.preventDefault();
};


/**
 * Load page
 * @return {[type]} [description]
 */
BaseThemeHistory.prototype.loadPage = function(){
    var _this = this;

    _this.loadingBeginDate = new Date();

    // Load content
    $.ajax({
        url: _this.state.url,
        type: 'get',
        success: function(data){

            // console.log('-> Page loaded');

            BaseTheme.$ajaxContainer.append(data);

            // Update selectors

            // Disappear page
            TweenLite.to(BaseTheme.page.$cont, 0.8, {opacity:0, delay:0, ease:Expo.easeOut});
            BaseTheme.page.destroy();

            // Init new page
            BaseTheme.pageFuture = new MraPage(_this.state.data.node_name, 'ajax', _this.state.data.is_home);

            BaseTheme.pageFuture.$cont.waitForImages({
                finished: $.proxy(BaseTheme.pageLoaded, _this),
                waitForAll: true
            });

        }
    });

};


/**
 * Images loaded
 * @return {[type]} [description]
 */
BaseThemeHistory.prototype.pageLoaded = function(){
    var _this = this;

    BaseTheme.pageFuture.init();

    BaseTheme.page = BaseTheme.pageFuture;
    BaseTheme.pageFuture = null;

    _this.loadingEndDate = new Date();
    _this.loadingDuration = _this.loadingEndDate - _this.loadingBeginDate;

    var delay = (_this.loadingDuration > 1200) ? 0 : 1200 - _this.loadingDuration;

    var transitionDuration = 800 + delay;

    setTimeout(function(){

        // Hide loading

        // Animate content
        BaseTheme.page.animateContent();

        enableScroll();

    }, delay);


    // Change active nav
    BaseTheme.nav.$item.removeClass('active');
    BaseTheme.nav.$link.removeClass('active');

    var $navItem = $('#nav-item-'+_this.state.data.node_name),
        $navLink = $('#nav-link-'+_this.state.data.node_name);

    if($navItem.length) addClass($navItem[0], 'active');
    if($navLink.length) addClass($navLink[0], 'active');

    // Reset page transition
    setTimeout(function(){
        _this.transition = false;
    }, transitionDuration);
};


/**
 * Update link
 * @return {[type]} [description]
 */
BaseThemeHistory.prototype.updateLink = function(){
    var _this = this;

    _this.$link.off('click', $.proxy(_this.linkClick, _this));
    _this.$link = $('.ajax-link');
    _this.$link.on('click', $.proxy(_this.linkClick, _this));
};
