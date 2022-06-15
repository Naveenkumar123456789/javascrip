
(function($) {
    "use strict";
    $(document).ready(function() {

        /* -----------------------------------------------------------------------------

        	1.) GENERAL

        ----------------------------------------------------------------------------- */

        /* -------------------------------------------------------------------------
        	CHECK FOR TOUCH DISPLAY
        ------------------------------------------------------------------------- */

        $('body').one('touchstart', function() {
            $(this).addClass('m-touch');
        });

        /* -------------------------------------------------------------------------
        	INIT PAGE
        ------------------------------------------------------------------------- */

        if (!$.fn.lsvrInitPage) {
            $.fn.lsvrInitPage = function(element) {

                var $element = $(element);

                // FLUID MEDIA
                if ($.fn.lsvrFluidEmbedMedia) {
                    $element.lsvrFluidEmbedMedia();
                }

                // LIGHTBOXES
                if ($.fn.lsvrInitLightboxes) {
                    $element.lsvrInitLightboxes();
                }

                // LOAD HIRES IMAGES FOR HiDPI SCREENS
                if ($.fn.lsvrLoadHiresImages) {
                    $element.lsvrLoadHiresImages();
                }

                // AJAX FORMS
                if ($.fn.lsvrAjaxForm) {
                    $element.find('form.m-ajax-form').each(function() {
                        $(this).lsvrAjaxForm();
                    });
                }

            };
        }
        $.fn.lsvrInitPage('body');

      

        var mediaQueryBreakpoint;
        if ($.fn.lsvrGetMediaQueryBreakpoint) {
            mediaQueryBreakpoint = $.fn.lsvrGetMediaQueryBreakpoint();
            $(document).on('screenTransition', function() {
                mediaQueryBreakpoint = $.fn.lsvrGetMediaQueryBreakpoint();
            });
        } else {
            mediaQueryBreakpoint = $(window).width();
        }


        /* -----------------------------------------------------------------------------

        	2.) COMPONENTS

        ----------------------------------------------------------------------------- */

        if (!$.fn.lsvrInitComponents) {
            $.fn.lsvrInitComponents = function(element) {

                var $element = $(element);

                /* -------------------------------------------------------------------------
                	ACCORDION
                ------------------------------------------------------------------------- */

                if ($.fn.lsvrAccordion) {
                    $element.find('.c-accordion').each(function() {
                        $(this).lsvrAccordion();
                    });
                }

                /* -------------------------------------------------------------------------
                	ALERT MESSAGE
                ------------------------------------------------------------------------- */

                if ($.fn.lsvrAlertMessage) {
                    $element.find('.c-alert-message').each(function() {
                        $(this).lsvrAlertMessage();
                    });
                }

                /* -------------------------------------------------------------------------
                	GALLERY
                ------------------------------------------------------------------------- */

                if ($.fn.masonry && $.fn.lsvrImagesLoaded) {
                    $('.c-gallery .gallery-images.m-layout-masonry').each(function() {
                        var $this = $(this);
                        $this.lsvrImagesLoaded(function() {
                            $this.masonry();
                            $this.removeClass('m-loading');
                        });
                    });
                } else {
                    $('.c-gallery .gallery-images.m-layout-masonry.m-loading').each(function() {
                        $(this).removeClass('m-loading');
                    });
                }

                /* -------------------------------------------------------------------------
                	GOOGLE MAP
                ------------------------------------------------------------------------- */

                if ($.fn.lsvrLoadGoogleMaps && $element.find('.gmap-canvas').length > 0) {
                    $.fn.lsvrLoadGoogleMaps();
                }

                /* -------------------------------------------------------------------------
                	SLIDER
                ------------------------------------------------------------------------- */

                if ($.fn.lsvrSlider) {
                    $element.find('.c-slider').each(function() {
                        $(this).lsvrSlider();
                    });
                }

                /* -------------------------------------------------------------------------
                	TABS
                ------------------------------------------------------------------------- */

                if ($.fn.lsvrTabs) {
                    $element.find('.c-tabs').each(function() {
                        $(this).lsvrTabs();
                    });
                }

            };
        }
        $.fn.lsvrInitComponents('body');


        /* -----------------------------------------------------------------------------

        	3.) HEADER

        ----------------------------------------------------------------------------- */

        /* -------------------------------------------------------------------------
        	GMAP SWITCHER
        ------------------------------------------------------------------------- */

        $('.header-gmap-switcher').each(function() {

            var $this = $(this);
            $this.click(function() {

                // OPEN MAP
                if (!$this.hasClass('m-active')) {

                    $('.header-gmap-switcher').addClass('m-active');
                    $('body').addClass('m-header-map-active');
                    $.event.trigger({
                        type: 'headerMapOpened',
                        message: 'Header map opened.',
                        time: new Date()
                    });

                    // HIDE LOGO ON MOBILE
                    if (mediaQueryBreakpoint <= 991) {
                        $('.header-branding').slideUp(300);
                    }

                }

                // CLOSE MAP
                else {

                    $('.header-gmap-switcher').removeClass('m-active');
                    $('body').removeClass('m-header-map-active');
                    $.event.trigger({
                        type: 'headerMapClosed',
                        message: 'Header map closed.',
                        time: new Date()
                    });

                    // SHOW LOGO ON MOBILE
                    if (mediaQueryBreakpoint <= 991) {
                        $('.header-branding').slideDown(300);
                    }

                }

            });

            // RESET ON SCREEN TRANSITION
            $(document).on('screenTransition', function() {
                $('.header-gmap-switcher').removeClass('m-active');
                $('body').removeClass('m-header-map-active');
                $('.header-branding').removeAttr('style');
            });

        });

        /* -------------------------------------------------------------------------
        	IMAGE SLIDESHOW
        ------------------------------------------------------------------------- */

        $('.header-image').each(function() {
            if (mediaQueryBreakpoint > 991 && $.timer && $(this).data('autoplay') && $(this).find('.image-layer').length > 1) {

                var $this = $(this),
                    layers = $this.find('.image-layer'),
                    interval = parseInt($this.data('autoplay')),
                    timer;

                layers.filter(':eq(0)').addClass('m-active');
                layers.filter(':eq(1)').addClass('m-next');

                interval = interval < 1 ? 0 : interval * 1000;

                if (interval > 0) {

                    // START SLIDESHOW
                    timer = $.timer(interval, function() {
                        layers.filter('.m-active').fadeOut(900, function() {
                            $(this).removeClass('m-active').css('display', '');
                            layers.filter('.m-next').addClass('m-active').removeClass('m-next');
                            if (layers.filter('.m-active').is(':last-child')) {
                                layers.filter(':eq(0)').addClass('m-next');
                            } else {
                                layers.filter('.m-active').next().addClass('m-next');
                            }
                        });
                    });

                    // PAUSE WHEN MAP IS OPENED
                    $(document).on('headerMapOpened', function() {
                        timer.pause();
                    });

                    // RESUME WHEN MAP IS CLOSED
                    $(document).on('headerMapClosed', function() {
                        timer.resume();
                    });

                }

            }
        });

        /* -------------------------------------------------------------------------
        	HEADER TOGGLE
        ------------------------------------------------------------------------- */

        $('.header-toggle').each(function() {

            var $this = $(this);
            $this.click(function() {

                // HIDE
                if ($('.header-tools').is(':visible')) {
                    $this.removeClass('m-active');
                    $('.header-menu, .header-tools').slideUp(300);
                }
                // SHOW
                else {
                    $this.addClass('m-active');
                    $('.header-menu, .header-tools').slideDown(300);
                }

            });

            // RESET ON SCREEN TRANSITION
            $(document).on('screenTransition', function() {
                $this.removeClass('m-active');
                $('.header-menu, .header-tools').removeAttr('style');
            });

        });

        /* -------------------------------------------------------------------------
        	HEADER MENU
        ------------------------------------------------------------------------- */

        $('.header-menu ul > li:last-child').prev().addClass('m-penultimate');
        $('.header-menu ul > li:last-child').addClass('m-last');

        if (!$.fn.lsvrHeaderMenuSubmenu) {
            $.fn.lsvrHeaderMenuSubmenu = function() {

                var $this = $(this),
                    $parent = $this.parent();

                $parent.addClass('m-has-submenu');

                // HOVER
                $parent.hover(function() {
                    if (mediaQueryBreakpoint > 991 && !$('body').hasClass('m-touch')) {
                        $parent.addClass('m-hover');
                        $this.show().addClass('animated fadeInDown');
                    }
                }, function() {
                    if (mediaQueryBreakpoint > 991 && !$('body').hasClass('m-touch')) {
                        $parent.removeClass('m-hover');
                        $this.hide().removeClass('animated fadeInDown');
                    }
                });

                // CLICK ON TOUCH DISPLAY
                $parent.find('> a').click(function() {
                    if (mediaQueryBreakpoint > 991 && !$parent.hasClass('m-hover')) {

                        if ($(this).parents('ul').length < 2) {
                            $('.header-menu li.m-hover').each(function() {
                                $(this).removeClass('m-hover');
                                $(this).find('> ul').hide();
                            });
                        }

                        $parent.addClass('m-hover');
                        $this.show().addClass('animated fadeInDown');

                        $('html').on('touchstart', function(e) {
                            $parent.removeClass('m-hover');
                            $this.hide().removeClass('animated fadeInDown');
                        });

                        $parent.on('touchstart', function(e) {
                            e.stopPropagation();
                        });

                        return false;

                    }
                });

                // CREATE TOGGLES
                if ($parent.find('> .toggle').length < 1) {
                    $parent.append('<button class="submenu-toggle" type="button"><i class="fa"></i></button>');
                }
                var $toggle = $parent.find('> .submenu-toggle');

                // TOGGLE
                $toggle.click(function() {

                    // close
                    if ($(this).hasClass('m-active')) {
                        $toggle.removeClass('m-active');
                        $this.slideUp(300);
                    }

                    // open
                    else {

                        // deactivate others
                        if ($(this).parents('ul').length < 2) {
                            $('.header-menu > ul > li > .submenu-toggle.m-active').each(function() {
                                $(this).removeClass('m-active');
                                $(this).parent().find('> ul').slideUp(300);
                            });
                        }

                        // activate this
                        $toggle.addClass('m-active');
                        $this.slideDown(300);

                    }

                });

                // HIDE ON SCREEN TRANSITION
                $(document).on('screenTransition', function() {
                    $toggle.removeClass('m-active');
                    $this.removeAttr('style');
                });

            };

            $('.header-menu ul > li > ul').each(function() {
                if (!$(this).is(':visible')) {
                    $(this).lsvrHeaderMenuSubmenu();
                }
            });

        }


        /* -----------------------------------------------------------------------------

        	4.) WIDGETS

        ----------------------------------------------------------------------------- */

        /* -------------------------------------------------------------------------
        	MAILCHIMP SUBSCRIBE WIDGET
        ------------------------------------------------------------------------- */

        if ($.fn.lsvrMailchimpSubscribeForm) {
            $('.mailchimp-subscribe-widget').each(function() {
                $(this).lsvrMailchimpSubscribeForm();
            });
        }


        /* -----------------------------------------------------------------------------

        	5.) SIDEBAR

        ----------------------------------------------------------------------------- */

        /* -------------------------------------------------------------------------
        	SIDE MENU
        ------------------------------------------------------------------------- */

        // SUB MENU
        if (!$.fn.lsvrSideMenuSubmenu) {
            $.fn.lsvrSideMenuSubmenu = function() {

                var $this = $(this),
                    $parent = $this.parent();

                $parent.addClass('m-has-submenu');

                // HOVER
                $parent.hover(function() {
                    if (mediaQueryBreakpoint > 991 && !$('body').hasClass('m-touch')) {
                        $parent.addClass('m-hover');
                        $this.show().addClass('animated fadeInDown');
                    }
                }, function() {
                    if (mediaQueryBreakpoint > 991 && !$('body').hasClass('m-touch')) {
                        $parent.removeClass('m-hover');
                        $this.hide().removeClass('animated fadeInDown');
                    }
                });

                // CLICK ON TOUCH DISPLAY
                $parent.find('> a').click(function() {
                    if (mediaQueryBreakpoint > 991 && !$parent.hasClass('m-hover')) {

                        if ($(this).parents('ul').length < 2) {
                            $('.side-menu li.m-hover').each(function() {
                                $(this).removeClass('m-hover');
                                $(this).find('> ul').hide();
                            });
                        }

                        $parent.addClass('m-hover');
                        $this.show().addClass('animated fadeInDown');

                        $('html').on('touchstart', function(e) {
                            $parent.removeClass('m-hover');
                            $this.hide().removeClass('animated fadeInDown');
                        });

                        $parent.on('touchstart', function(e) {
                            e.stopPropagation();
                        });

                        return false;

                    }
                });

            };

            // SHOWING SUBMENUS
            if ($('.side-menu').first().hasClass('m-show-submenu')) {
                $('.side-menu ul > li').not('.m-active').find(' > ul').each(function() {
                    $(this).lsvrSideMenuSubmenu();
                });
            }

            // NOT SHOWING SUBMENUS
            else {
                $('.side-menu ul > li > ul').each(function() {
                    $(this).lsvrSideMenuSubmenu();
                });
            }

        }


        /* -----------------------------------------------------------------------------

        	6.) OTHER

        ----------------------------------------------------------------------------- */

        /* -------------------------------------------------------------------------
        	SCROLL ANIMATION
        ------------------------------------------------------------------------- */

        $('a[href^="#"]').each(function() {

            var $this = $(this),
                element = $this.attr('href');

            if ($(element).length > 0) {
                $this.click(function(e) {
                    $('html, body').animate({
                        'scrollTop': $(element).offset().top - 95
                    }, 500);
                    return false;
                });
            }

        });

        /* -------------------------------------------------------------------------
        	STYLE SWITCHER
        ------------------------------------------------------------------------- */

        var enableStyleSwitcher = true;

        if (enableStyleSwitcher) {



            // INIT SWITCHER
            $('#style-switcher').each(function() {

                var switcher = $(this),
                    toggle = switcher.find('.style-switcher-toggle'),
                    skins = switcher.find('.skin-list button'),
                    switches = switcher.find('.switch-list button');

                // TOGGLE SWITCHER
                toggle.click(function() {
                    switcher.toggleClass('m-active');
                });

                // SET SKIN
                skins.click(function() {
                    skins.filter('.m-active').removeClass('m-active');
                    $(this).toggleClass('m-active');
                    if ($('head #skin-temp').length < 1) {
                        $('head').append('<link id="skin-temp" rel="stylesheet" type="text/css" href="library/css/skin/' + $(this).data('skin') + '.css">');
                    } else {
                        $('#skin-temp').attr('href', 'library/css/skin/' + $(this).data('skin') + '.css');
                    }
                });

            });

        }

    });

})(jQuery);

$(document).ready(function() {
    var nav = function() {
        $('.gw-nav > li > a').click(function() {
            var gw_nav = $('.gw-nav');
            gw_nav.find('li').removeClass('active');
            $('.gw-nav > li > ul > li').removeClass('active');

            var checkElement = $(this).parent();
            var ulDom = checkElement.find('.gw-submenu')[0];

            if (ulDom == undefined) {
                checkElement.addClass('active');
                $('.gw-nav').find('li').find('ul:visible').slideUp();
                return;
            }
            if (ulDom.style.display != 'block') {
                gw_nav.find('li').find('ul:visible').slideUp();
                gw_nav.find('li.init-arrow-up').removeClass('init-arrow-up').addClass('arrow-down');
                gw_nav.find('li.arrow-up').removeClass('arrow-up').addClass('arrow-down');
                checkElement.removeClass('init-arrow-down');
                checkElement.removeClass('arrow-down');
                checkElement.addClass('arrow-up');
                checkElement.addClass('active');
                checkElement.find('ul').slideDown(300);
            } else {
                checkElement.removeClass('init-arrow-up');
                checkElement.removeClass('arrow-up');
                checkElement.removeClass('active');
                checkElement.addClass('arrow-down');
                checkElement.find('ul').slideUp(300);

            }
        });
        $('.gw-nav > li > ul > li > a').click(function() {
            $(this).parent().parent().parent().removeClass('active');
            $('.gw-nav > li > ul > li').removeClass('active');
            $(this).parent().addClass('active')
        });
    };
    nav();
});



/* got to top*/
window.onscroll = function() {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
/*td button for table*/


$('#btnAdd').on('click', function(e) {
    e.preventDefault();
    var elem = $(this).next('.td1')
    elem.toggle('slow');
});
/*button inside the table*/
function myFunction(el) {

    var parent = el.parentNode;
    var grandParent = parent.parentNode;
    var x = grandParent.nextElementSibling;
    //console.log(sib);

    if (!x.style.display || x.style.display === 'none') {
        x.style.display = 'table-row';
    } else {
        x.style.display = 'none';
    }
}

/*pop up*/
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("gmBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// alert for external website
var elems = document.getElementsByClassName('confirmation');
var confirmIt = function(e) {
    if (!confirm('Are you sure you want to continue with external website?')) e.preventDefault();
};
for (var i = 0, l = elems.length; i < l; i++) {
    elems[i].addEventListener('click', confirmIt, false);
}