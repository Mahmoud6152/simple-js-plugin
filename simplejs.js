let simpleJs = {
  wrapSlides: function(slides) {
    let slidesContainer = document.createElement('div');
    
    slides.forEach((slide) => {
      let slideBox = document.createElement('div');
      slideBox.append(slide);
      slidesContainer.append(slideBox);
    });
    
    return slidesContainer;
  },
  
  makePagination: function(numberOfSlides) {
    let paginationContainer = document.createElement('div');
    
    for(var x = 1; x <= numberOfSlides; x++) {
      paginationContainer.append(document.createElement('span'));
    }
    
    return paginationContainer;
  },
  
  makeBtns: function(icons) {
    let leftBtnContainer = document.createElement('div');
    let rightBtnContainer = document.createElement('div');
    
    leftBtnContainer.innerHTML = icons.left;
    rightBtnContainer.innerHTML = icons.right;
    
    return {leftBtn: leftBtnContainer, rightBtn: rightBtnContainer};
  },
  
  defOptions: {
    containerId: '',
    infinite: true,
    fade: false,
    pagination: true,
    paginationColors: {main: 'transparent', border: 'gray', active: 'gray'},
    autoplayInterval: 0,
    animationDuration: '1s',
    btnIcons: {left: '<i></i>', right:'<i></i>'}
  },
  
  validateOptions: function(defOptions, userOptions) {
    let finalOptions = {};
    
      for(var option in userOptions) {
        if(defOptions.hasOwnProperty(option)) {
          finalOptions[option] = userOptions[option];
        }
      }
      for(var option in defOptions) {
        if(!finalOptions.hasOwnProperty(option)) {
          finalOptions[option] = defOptions[option];
        }
      }
    
    return finalOptions;
  },
  
  build: function(options) {
    let sliderArea = document.querySelector(options.containerId);
    let slides = Array.from(sliderArea.children);
    let slidesContainer = this.wrapSlides(slides);
    let paginationContainer = this.makePagination(slides.length);
    let btns = this.makeBtns(options.btnIcons);
    
    sliderArea.append(slidesContainer, paginationContainer, btns.leftBtn, btns.rightBtn);
    
    return sliderArea;
  },
  
  styleElements: function(sliderArea, options) {
    let slides = Array.from(sliderArea.children[0].children);
    let paginationContainer = sliderArea.children[1];
    let paginationDots = Array.from(paginationContainer.children);
    
    
    sliderArea.classList.add('slider-area');
    
    
    slides.forEach((slide, index) => {
      slide.dataset.index = index;
      slide.style.transition = options.animationDuration;
    });
    if(options.fade) {
      slides.forEach(slide => {
        slide.classList.add('fade-parked');
      });
      slides[0].classList.add('fade-active');
    } else {
      slides.forEach(slide => {
        slide.classList.add('parked');
      });
      slides[0].classList.add('active');
    }
    
    
    if(!options.pagination) {
      paginationContainer.style.display = 'none';
    } else {
      paginationDots.forEach((dot, index) => {
        dot.style.backgroundColor = options.paginationColors.main;
        dot.style.borderColor = options.paginationColors.border;
        dot.dataset.index = index;
      });
      paginationDots[0].style.backgroundColor = options.paginationColors.active;
    }
    
    
    if(options.btnIcons.left === '<i></i>') {
      sliderArea.children[2].children[0].classList.add('slider-buttons');
      sliderArea.children[3].children[0].classList.add('slider-buttons');
    }
  },
  
  moveToPagination: function(sliderArea, nextPaginationDot, activeClassName, options) {
    let nextSlideIndex = Number(nextPaginationDot.dataset.index);
    
    Array.from(sliderArea.children[1].children).forEach(dot => {
      dot.style.backgroundColor = options.paginationColors.main;
    });
    nextPaginationDot.style.backgroundColor = options.paginationColors.active;
    this.moveToSlide(sliderArea, nextSlideIndex, activeClassName);
  },
  
  moveToSlide: function(sliderArea, nextSlideIndex, activeClassName) {
    let slides = Array.from(sliderArea.children[0].children);
    let nextSlide = slides.find(slide => {
      return Number(slide.dataset.index) === nextSlideIndex;
    });
    
    slides.forEach(slide => {
      slide.classList.remove(activeClassName);
    });
    nextSlide.classList.add(activeClassName);
  },
  
  moveSlidesFinite: function(sliderArea, direction, activeClassName, options) {
    let slides = Array.from(sliderArea.children[0].children);
    let activeIndex = slides.findIndex(elem => {
      return elem.classList.contains(activeClassName);
    }); 
    let nextIndex = direction === -1 && activeIndex === 0 ?
        0 : direction === 1 && activeIndex === slides.length-1 ?
        slides.length-1 : activeIndex + direction;
    
    if(activeIndex === nextIndex) {
      
    } else {
      sliderArea.children[0].children[nextIndex].classList.add(activeClassName);
      sliderArea.children[0].children[activeIndex].classList.remove(activeClassName);
    }
    
    this.movePagination(sliderArea, activeIndex, nextIndex, options);
  },
  
  moveSlidesInfinite: function(sliderArea, direction, activeClassName, options) {
    let slidesContainer = sliderArea.children[0];
    let slides = Array.from(slidesContainer.children);
    let activeIndex = slides.findIndex(elem => {
      return elem.classList.contains(activeClassName);
    });
    let nextIndex = activeIndex === 0 && direction === -1 ?
        slides.length-1 : activeIndex === slides.length-1 && direction === 1 ?
        0 : activeIndex + direction;
    
    if(direction === 1 && nextIndex === 0) {
      slidesContainer.append(slidesContainer.children[0]);
      activeIndex -= 1;
      nextIndex = slides.length-1;
      slidesContainer.children[nextIndex].classList.add(activeClassName);
      setTimeout(function(){
        slidesContainer.children[activeIndex].classList.remove(activeClassName);
      }, 20);
      
    } else if(direction === -1 && nextIndex === slides.length-1) {
      slidesContainer.prepend(slidesContainer.children[slides.length-1]);
      activeIndex += 1;
      nextIndex = 0;
      slidesContainer.children[activeIndex].classList.remove(activeClassName);
      setTimeout(function(){
        slidesContainer.children[nextIndex].classList.add(activeClassName);
      }, 20);
      
    } else {
      slidesContainer.children[nextIndex].classList.add(activeClassName);
      setTimeout(function(){
        slidesContainer.children[activeIndex].classList.remove(activeClassName);
      }, 20);
    }
    
    this.movePagination(sliderArea, activeIndex, nextIndex, options);
  },
  
  movePagination: function(sliderArea, activeIndex, nextIndex, options) {
    let nextSlideIndex = sliderArea.children[0].children[nextIndex].dataset.index;
    let activeSlideIndex = sliderArea.children[0].children[activeIndex].dataset.index;
    
    sliderArea.children[1].children[activeSlideIndex].style.backgroundColor = options.paginationColors.main;
    sliderArea.children[1].children[nextSlideIndex].style.backgroundColor = options.paginationColors.active;
  },
  
  moveWithTimer: function(sliderArea, options) {
    let that = this;
    
    setInterval(function(){
      if(options.infinite) {
        if(options.fade) {
          that.moveSlidesInfinite(sliderArea, 1, 'fade-active', options);
        } else {
          that.moveSlidesInfinite(sliderArea, 1, 'active', options);
        }
      } else {
        if(options.fade) {
          that.moveSlidesFinite(sliderArea, 1, 'fade-active', options);
        } else {
          that.moveSlidesFinite(sliderArea, 1, 'active', options);
        }
      }
    }, options.autoplayInterval);
  },
  
  initEventListeners: function(sliderArea, options) {
    let leftBtn = document.querySelector(`${options.containerId}>div:nth-child(3)`);
    let rightBtn = document.querySelector(`${options.containerId}>div:nth-child(4)`);
    let paginationContainer = sliderArea.children[1];
    let that = this;
    let touchStartIndex = null;
    let touchEndIndex = null;
    let touchThreshold = 50;
    
    paginationContainer.addEventListener('click', function(event) {
      if(event.target.localName === 'span') {
        if(options.fade) {
          that.moveToPagination(sliderArea, event.target, 'fade-active', options);
        } else {
          that.moveToPagination(sliderArea, event.target, 'active', options);
        }
      }
    });
    
    leftBtn.addEventListener('click', function() {
      if(options.infinite) {
        if(options.fade) {
          that.moveSlidesInfinite(sliderArea, -1, 'fade-active', options);
        } else {
          that.moveSlidesInfinite(sliderArea, -1, 'active', options);
        }
      } else {
        if(options.fade) {
          that.moveSlidesFinite(sliderArea, -1, 'fade-active', options);
        } else {
          that.moveSlidesFinite(sliderArea, -1, 'active', options);
        }
      }
    });
    
    rightBtn.addEventListener('click', function() {
      if(options.infinite) {
        if(options.fade) {
          that.moveSlidesInfinite(sliderArea, 1, 'fade-active', options);
        } else {
          that.moveSlidesInfinite(sliderArea, 1, 'active', options);
        }
      } else {
        if(options.fade) {
          that.moveSlidesFinite(sliderArea, 1, 'fade-active', options);
        } else {
          that.moveSlidesFinite(sliderArea, 1, 'active', options);
        }
      }
    });
    
    if(!options.fade) {
      sliderArea.addEventListener('touchstart', function(event) {
        touchStartIndex = event.changedTouches[0].pageX;
      });
      sliderArea.addEventListener('touchend', function(event) {
        touchEndIndex = event.changedTouches[0].pageX;
        
        if(touchEndIndex - touchStartIndex > touchThreshold) {
          if(options.infinite) {
            that.moveSlidesInfinite(sliderArea, -1, 'active', options);
          } else {
            that.moveSlidesFinite(sliderArea, -1, 'active', options);
          }
        } else if(touchStartIndex - touchEndIndex > touchThreshold) {
          if(options.infinite) {
            that.moveSlidesInfinite(sliderArea, 1, 'active', options);
          } else {
            that.moveSlidesFinite(sliderArea, 1, 'active', options);
          }
        }
      });
    }
  },
  
  start: function(userOptions) {
    let instance = Object.assign({}, this);
    let options = instance.validateOptions(instance.defOptions, userOptions);
    let sliderArea = instance.build(options);
    
    instance.styleElements(sliderArea, options);
    instance.initEventListeners(sliderArea, options);
    if(options.autoplayInterval) {
      instance.moveWithTimer(sliderArea, options);
    }
  },
  
  destroy: function(selector) {
    document.querySelector(selector).remove();
  }
};

this.simpleJs = simpleJs;
