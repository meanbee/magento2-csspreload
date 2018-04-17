/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
(function(w){
    "use strict";
    /* exported loadCSS */
    var loadCSS = function( href, before, media ){
        // Arguments explained:
        // `href` [REQUIRED] is the URL for your CSS file.
        // `before` [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
        // By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.
        // `media` [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'
        var doc = w.document;
        var ss = doc.createElement( "link" );
        var ref;
        if( before ){
            ref = before;
        }
        else {
            var refs = ( doc.body || doc.getElementsByTagName( "head" )[ 0 ] ).childNodes;
            ref = refs[ refs.length - 1];
        }

        var sheets = doc.styleSheets;
        ss.rel = "stylesheet";
        ss.href = href;
        // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
        ss.media = "only x";

        // wait until body is defined before injecting link. This ensures a non-blocking load in IE11.
        function ready( cb ){
            if( doc.body ){
                return cb();
            }
            setTimeout(function(){
                ready( cb );
            });
        }
        // Inject link
        // Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
        // Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
        ready( function(){
            ref.parentNode.insertBefore( ss, ( before ? ref : ref.nextSibling ) );
        });
        // A method (exposed on return object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.
        var onloadcssdefined = function( cb ){
            var resolvedHref = ss.href;
            var i = sheets.length;
            while( i-- ){
                if( sheets[ i ].href === resolvedHref ){
                    return cb();
                }
            }
            setTimeout(function() {
                onloadcssdefined( cb );
            });
        };

        function loadCB(){
            if( ss.addEventListener ){
                ss.removeEventListener( "load", loadCB );
            }
            ss.media = media || "all";
        }

        // once loaded, set link's media back to `all` so that the stylesheet applies once it loads
        if( ss.addEventListener ){
            ss.addEventListener( "load", loadCB);
        }
        ss.onloadcssdefined = onloadcssdefined;
        onloadcssdefined( loadCB );
        return ss;
    };
    // commonjs
    if( typeof exports !== "undefined" ){
        exports.loadCSS = loadCSS;
    }
    else {
        w.loadCSS = loadCSS;
    }
}( typeof global !== "undefined" ? global : this ));

/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
/* This file is meant as a standalone workflow for
- testing support for link[rel=preload]
- enabling async CSS loading in browsers that do not support rel=preload
- applying rel preload css once loaded, whether supported or not.
*/
(function( w ){
    "use strict";
    // rel=preload support test
    if( !w.loadCSS ){
        w.loadCSS = function(){};
    }
    // define on the loadCSS obj
    var rp = loadCSS.relpreload = {};
    // rel=preload feature support test
    // runs once and returns a function for compat purposes
    rp.support = (function(){
        var ret;
        try {
            ret = w.document.createElement( "link" ).relList.supports( "preload" );
        } catch (e) {
            ret = false;
        }
        return function(){
            return ret;
        };
    })();

    // if preload isn't supported, get an asynchronous load by using a non-matching media attribute
    // then change that media back to its intended value on load
    rp.bindMediaToggle = function( link ){
        // remember existing media attr for ultimate state, or default to 'all'
        var finalMedia = link.media || "all";

        function enableStylesheet(){
            link.media = finalMedia;
        }

        // bind load handlers to enable media
        if( link.addEventListener ){
            link.addEventListener( "load", enableStylesheet );
        } else if( link.attachEvent ){
            link.attachEvent( "onload", enableStylesheet );
        }

        // Set rel and non-applicable media type to start an async request
        // note: timeout allows this to happen async to let rendering continue in IE
        setTimeout(function(){
            link.rel = "stylesheet";
            link.media = "only x";
        });
        // also enable media after 3 seconds,
        // which will catch very old browsers (android 2.x, old firefox) that don't support onload on link
        setTimeout( enableStylesheet, 3000 );
    };

    // loop through link elements in DOM
    rp.poly = function(){
        // double check this to prevent external calls from running
        if( rp.support() ){
            return;
        }
        var links = w.document.getElementsByTagName( "link" );
        for( var i = 0; i < links.length; i++ ){
            var link = links[ i ];
            // qualify links to those with rel=preload and as=style attrs
            if( link.rel === "preload" && link.getAttribute( "as" ) === "style" && !link.getAttribute( "data-loadcss" ) ){
                // prevent rerunning on link
                link.setAttribute( "data-loadcss", true );
                // bind listeners to toggle media back
                rp.bindMediaToggle( link );
            }
        }
    };

    // if unsupported, run the polyfill
    if( !rp.support() ){
        // run once at least
        rp.poly();

        // rerun poly on an interval until onload
        var run = w.setInterval( rp.poly, 500 );
        if( w.addEventListener ){
            w.addEventListener( "load", function(){
                rp.poly();
                w.clearInterval( run );
            } );
        } else if( w.attachEvent ){
            w.attachEvent( "onload", function(){
                rp.poly();
                w.clearInterval( run );
            } );
        }
    }


    // commonjs
    if( typeof exports !== "undefined" ){
        exports.loadCSS = loadCSS;
    }
    else {
        w.loadCSS = loadCSS;
    }
}( typeof global !== "undefined" ? global : this ) );
