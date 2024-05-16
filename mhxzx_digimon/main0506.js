$(function () {



    //唱片造型切換
    $(".select_box_1 .nav_tab").click(function () {
        var list = $(this).index();
        $(this).addClass("active").siblings().removeClass("active");
        $(".view_box_1 .tab_content").eq(list).addClass("active").siblings().removeClass("active");
    });
    //角色切換
    $(".select_box_2 .nav_tab").click(function () {
        var list = $(this).index();
        $(this).addClass("active").siblings().removeClass("active");
        $(".view_box_2 .tab_content").eq(list).addClass("active").siblings().removeClass("active");
    });
    //裝飾品切換
    $(".select_box_3 .nav_tab").click(function () {
        var list = $(this).index();
        $(this).addClass("active").siblings().removeClass("active");
        $(".view_box_3 .tab_content").eq(list).addClass("active").siblings().removeClass("active");
    });


    // features
    var wid = $(window).width();
    var feature = new Swiper('.feature', {
        effect: "coverflow",
        loopedSlides: 6,
        slidesPerView: "auto",
        centeredSlides: true,
        loop: true,
        allowTouchMove: false,
        coverflowEffect: {
            rotate: 0,
            stretch: Math.floor(wid * 0.18),
            depth: 150,
            modifier: 1,
            slideShadows: false,
        },
        autoplay: true,
        breakpoints: {
            992: {
                allowTouchMove: true,
                coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 0,
                    modifier: 1,
                    slideShadows: false,
                },
            },
        },

        // Navigation arrows
        navigation: {
            nextEl: '.feature_next',
            prevEl: '.feature_prev',
        },
    });


    // pixel-grid

    var width = window.innerWidth;
    var height = window.innerHeight;
    var pixelsize = 20;
    var pixelSpacing = 2;
    var valnumPixelsX = Math.floor(width / (pixelsize + (2 * pixelSpacing)));
    var valnumPixelsY = Math.floor(height / (pixelsize + (2 * pixelSpacing)));

    var $pixelGrid = $('#pixel-grid');

    var calCWidth = (valnumPixelsX * (pixelsize + (2 * pixelSpacing)));
    var calcCHeight = (valnumPixelsY * (pixelsize + (2 * pixelSpacing)));
    //document.getElementById('debugPixsize').innerHTML += " cal canvas: " + calcCHeight + ' x ' + calCWidth;
    var pixelGrid = {

        canvas: null,
        c2d: null,
        canvasW: calCWidth,
        canvasH: calcCHeight,
        bgColor: 'black',
        pixelColor: '#006cff',
        /*rgb to calc alpha for color now */
        numPixelsX: valnumPixelsX,
        numPixelsY: valnumPixelsY,
        pixelSize: pixelsize,
        pixelSpacing: pixelSpacing,
        pixelDeathFade: 100,
        pixelBornFade: 50,
        pixelMaxLife: 50,
        pixelMinLife: 25,
        pixelMaxOffLife: 50,
        pixelMinOffLife: 25,
        pixels: [],

        init: function () {
            var canvas = document.getElementById('pixel-grid');
            canvas.width = this.canvasW;
            canvas.height = this.canvasH;
            $pixelGrid.append(canvas);
            this.canvas = canvas;
            this.c2d = canvas.getContext('2d');

            this.initPixels();
            this.renderLoop();

            // $pixelGrid.addClass('appear');
        },

        initPixels: function () {

            for (var y = 0; y < this.numPixelsY; y++) {
                for (var x = 0; x < this.numPixelsX; x++) {
                    var pixel = this.randomizePixelAttrs(x, y);
                    this.pixels.push(pixel);
                }
            }
        },

        randomizePixelAttrs: function (x, y) {

            var alpha = this.randomAlpha(),
                self = this;

            var lit = true;
            if (alpha === 0.1) {
                lit = false;
            }

            return {
                xPos: x * this.pixelSize + (2 * (x * this.pixelSpacing)),
                yPos: y * this.pixelSize + (2 * (y * this.pixelSpacing)),
                alpha: 0,
                maxAlpha: alpha,
                life: Math.floor(Math.random() * self.pixelMaxLife - self.pixelMinLife + 1) + self.pixelMinLife,
                offLife: Math.floor(Math.random() * self.pixelMaxOffLife - self.pixelMinOffLife + 1) + self.pixelMinOffLife,
                isLit: lit,
                dying: false,
                deathFade: this.pixelDeathFade,
                bornFade: this.pixelBornFade,
                randomizeSelf: function () {

                    var alpha = self.randomAlpha();

                    var lit = true;
                    if (alpha === 0.1) {
                        lit = false;
                    }

                    this.alpha = 0;
                    this.maxAlpha = alpha;
                    this.life = Math.floor(Math.random() * self.pixelMaxLife - self.pixelMinLife + 1) + self.pixelMinLife;
                    this.offLife = Math.floor(Math.random() * self.pixelMaxOffLife - self.pixelMinOffLife + 1) + self.pixelMinOffLife;
                    this.isLit = lit;
                    this.dying = false;
                    this.deathFade = self.pixelDeathFade;
                    this.bornFade = self.pixelBornFade;
                }
            };
        },

        randomAlpha: function () {

            var randStartAlpha = Math.floor(Math.random() * 101);

            // Fully lit (1)
            if (randStartAlpha > 90) {
                return 1;
            }
            // Half lit (0.5)
            else if (randStartAlpha > 80) {
                return 0.5;
            } else {
                return 0.1;
            }
        },

        renderLoop: function () {

            this.clearCanvas();
            this.renderPixels();

            window.requestAnimationFrame(function () {
                this.renderLoop();
            }.bind(this));
        },

        renderPixels: function () {
            for (var i = 0; i < this.pixels.length; i++) {
                this.drawPixel(this.pixels[i]);
            }
        },

        drawPixel: function (pixel, blue) {
            if (pixel.alpha < 0.1) {
                pixel.alpha = 0.1;
            } else if (pixel.alpha > pixel.maxAlpha) {
                pixel.alpha = pixel.maxAlpha;
            }

            blue = 130;
            this.c2d.fillStyle = 'rgba(234, 242, 247, ' + pixel.alpha + ')';
            this.c2d.fillRect(pixel.xPos, pixel.yPos, this.pixelSize, this.pixelSize);

            if (pixel.isLit) {

                if (pixel.bornFade <= 0) {

                    // Update pixel attributes
                    if (pixel.life <= 0) {
                        pixel.dying = true;

                        if (pixel.deathFade <= 0) {
                            pixel.randomizeSelf();
                        } else {
                            var divisor = 1;
                            if (pixel.maxAlpha === 0.5 && pixel.alpha > 0.5) {
                                divisor = 2;
                            }
                            pixel.alpha = (pixel.deathFade / this.pixelDeathFade) / divisor;
                            pixel.deathFade--;
                        }
                    } else {
                        pixel.life--;
                    }
                } else {
                    pixel.alpha = pixel.maxAlpha - pixel.bornFade / this.pixelBornFade;
                    pixel.bornFade--;
                }
            } else {
                if (pixel.offLife <= 0) {
                    pixel.isLit = true;
                }
                pixel.offLife--;
            }
        },

        clearCanvas: function () {
            this.c2d.fillStyle = this.bgColor;
            this.c2d.fillRect(0, 0, this.canvasW, this.canvasH);
        }
    };

    // Init pixel grid animation
    pixelGrid.init();


});
