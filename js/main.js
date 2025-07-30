jQuery(document).ready(function($) {
  "use strict";

  // ======================
  // 1. Variáveis Globais
  // ======================
  const $window = $(window);
  const $body = $('body');
  const $header = $("#header");
  const $backToTop = $('.back-to-top');
  const $mobileNavContainer = $("#nav-menu-container");
  const $mobileNavToggle = $("#mobile-nav-toggle");
  const $mobileBodyOverly = $("#mobile-body-overly");

  // ======================
  // 2. Botão "Voltar ao Topo"
  // ======================
  function initBackToTop() {
    $window.scroll(function() {
      $backToTop.toggleClass('visible', $window.scrollTop() > 100);
    });

    $backToTop.click(function(e) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: 0
      }, 1200, 'easeInOutQuint');
    });
  }

  // ======================
  // 3. Header Fixo
  // ======================
  function initStickyHeader() {
    if ($header.length) {
      $header.sticky({
        topSpacing: 0,
        zIndex: '1000',
        stickyClass: 'header-sticky',
        wrapperClassName: 'header-wrapper'
      });
    }
  }

  // ======================
  // 4. Carrosséis
  // ======================
  function initCarousels() {
    // Carrossel Principal
    $("#intro-carousel").owlCarousel({
      autoplay: true,
      autoplayTimeout: 6000,
      autoplayHoverPause: true,
      dots: false,
      loop: true,
      animateOut: 'fadeOut',
      items: 1,
      lazyLoad: true,
      nav: true,
      navText: ['<i class="bi bi-chevron-left"></i>', '<i class="bi bi-chevron-right"></i>']
    });

    // Depoimentos
    $(".testimonials-carousel").owlCarousel({
      autoplay: true,
      autoplayTimeout: 5000,
      dots: true,
      loop: true,
      center: true,
      responsive: {
        0: { items: 1 },
        768: { items: 2 },
        992: { items: 3 }
      }
    });

    // Clientes
    $(".clients-carousel").owlCarousel({
      autoplay: true,
      autoplayTimeout: 3000,
      dots: false,
      loop: true,
      responsive: {
        0: { items: 2 },
        576: { items: 3 },
        768: { items: 4 },
        992: { items: 6 }
      }
    });
  }

  // ======================
  // 5. Animação WOW.js
  // ======================
  function initAnimations() {
    new WOW({
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 20,
      mobile: true,
      live: true
    }).init();
  }

  // ======================
  // 6. Menu de Navegação
  // ======================
  function initNavigation() {
    // Superfish Desktop Menu
    $('.nav-menu').superfish({
      animation: {
        opacity: 'show',
        height: 'show'
      },
      speed: 300,
      delay: 400
    });

    // Menu Mobile
    if ($mobileNavContainer.length) {
      const $mobileNav = $mobileNavContainer.clone().prop('id', 'mobile-nav');
      $mobileNav.find('> ul').removeAttr('class id');
      
      $body.append(
        $mobileNav,
        '<button id="mobile-nav-toggle" aria-label="Menu"><i class="bi bi-list"></i></button>',
        '<div id="mobile-body-overly"></div>'
      );

      $mobileNav.find('.menu-has-children').prepend('<i class="bi bi-chevron-down"></i>');

      // Eventos do Menu Mobile
      $(document)
        .on('click', '.menu-has-children i', function() {
          $(this).toggleClass('bi-chevron-up bi-chevron-down')
                 .next().toggleClass('menu-item-active')
                 .next('ul').slideToggle(300);
        })
        .on('click', '#mobile-nav-toggle', function() {
          $body.toggleClass('mobile-nav-active');
          $(this).find('i').toggleClass('bi-list bi-x');
          $mobileBodyOverly.toggle();
        })
        .on('click', function(e) {
          if (!$mobileNav.is(e.target) && 
              $mobileNav.has(e.target).length === 0 && 
              !$mobileNavToggle.is(e.target)) {
            closeMobileMenu();
          }
        });
    }

    // Fechar Menu Mobile
    function closeMobileMenu() {
      $body.removeClass('mobile-nav-active');
      $mobileNavToggle.find('i').removeClass('bi-x').addClass('bi-list');
      $mobileBodyOverly.hide();
    }

    // Scroll Suave
    $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function(e) {
      const $this = $(this);
      const path = location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '');
      const host = location.hostname === this.hostname;
      
      if (path && host) {
        e.preventDefault();
        const target = $($this.attr('href'));
        
        if (target.length) {
          const topSpace = $header.hasClass('header-fixed') ? $header.outerHeight() : $header.outerHeight() - 20;
          
          $('html, body').animate({
            scrollTop: target.offset().top - topSpace
          }, 1200, 'easeInOutQuint');
          
          // Atualizar menu ativo
          $('.nav-menu .menu-active').removeClass('menu-active');
          $this.closest('li').addClass('menu-active');
          
          // Fechar menu mobile
          if ($body.hasClass('mobile-nav-active')) {
            closeMobileMenu();
          }
        }
      }
    });
  }

  // ======================
  // 7. Popup de Portfólio
  // ======================
  function initPortfolioPopup() {
    $('.portfolio-popup').magnificPopup({
      type: 'image',
      removalDelay: 350,
      mainClass: 'mfp-with-zoom',
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        arrowMarkup: '<button class="mfp-arrow mfp-arrow-%dir%"><i class="bi bi-chevron-%dir%"></i></button>',
        tPrev: 'Anterior',
        tNext: 'Próximo'
      },
      zoom: {
        enabled: true,
        duration: 300,
        easing: 'ease-in-out',
        opener: function(openerElement) {
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        }
      },
      image: {
        titleSrc: 'title'
      }
    });
  }

  // ======================
  // 8. Mapa do Google
  // ======================
  function initGoogleMap() {
    const $map = $('#google-map');
    if (!$map.length) return;
    
    const latitude = $map.data('latitude');
    const longitude = $map.data('longitude');
    
    function initMap() {
      const location = new google.maps.LatLng(latitude, longitude);
      const mapOptions = {
        zoom: 15,
        center: location,
        scrollwheel: false,
        styles: [
          {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#444444"}]
          },
          {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{"color": "#f2f2f2"}]
          },
          {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
          },
          {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{"saturation": -100}, {"lightness": 45}]
          },
          {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
          }
        ]
      };
      
      const map = new google.maps.Map($map[0], mapOptions);
      
      // Marcador personalizado
      new google.maps.Marker({
        position: location,
        map: map,
        icon: {
          url: 'img/map-marker.png',
          scaledSize: new google.maps.Size(50, 65)
        },
        title: 'Nossa Localização'
      });
    }
    
    // Carregar API do Google Maps
    if (typeof google !== 'undefined') {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=SUA_CHAVE_API&callback=initMap`;
      script.defer = true;
      script.async = true;
      document.head.appendChild(script);
      window.initMap = initMap;
    }
  }

  // ======================
  // 9. Inicialização
  // ======================
  function init() {
    initBackToTop();
    initStickyHeader();
    initCarousels();
    initAnimations();
    initNavigation();
    initPortfolioPopup();
    initGoogleMap();
    
    // Pré-carregar animações
    $window.on('load', function() {
      setTimeout(function() {
        $body.addClass('page-loaded');
      }, 300);
    });
  }

  // Iniciar tudo
  init();
});