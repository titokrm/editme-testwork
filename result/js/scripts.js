'use strict'
document.addEventListener( 'DOMContentLoaded', function() {
  const beginWork = 6;
  const endWork = 21;
  const animatTime = 200;
  const orderTableBtn = document.querySelector('#order-table-btn');
	const form = document.getElementById('form');
  const body = document.body;
  
	form.addEventListener('submit', formSend);

	async function formSend(e) {
		e.preventDefault();

		let error = formValidate(form);

		let formData = new FormData(form);

		if (error === 0) {
			body.classList.add('js-sending');
			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
        //console.log(response);
        
				let result = await response.json();
				form.reset();
        body.classList.remove('js-sending');
        closeDropWindow();
        setTimeout(() => {
          showDropWindow('#sendSuccesfullWindow');
        }, animatTime);        
//				console.log(result.message);        
			} else {
        body.classList.remove('js-sending');
        closeDropWindow();
        setTimeout(() => {
          showDropWindow('#sendErrorWindow');
        }, animatTime);        
			}
		}

	}


	function formValidate(form) {
		let error = 0;
		let formReq = document.querySelectorAll('.js-req');
    function formRemoveErrorFocus(event) {
      formRemoveError(event.target);
      removeEventListener('focus', formRemoveErrorFocus);
    }

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			formRemoveError(input);

			if (input.classList.contains('js-email')) {
				if (emailTest(input)) {
					formAddError(input);
          input.addEventListener('focus', formRemoveErrorFocus);
					error++;
				}
			} else {
        if (input.classList.contains('js-time')) {
          let [h, m] = input.value.split(':');
          if (parseInt(h) < beginWork || parseInt(h) >= endWork || (parseInt(h) === endWork - 1 && parseInt(m) > 30)) {
            formAddError(input);
            input.addEventListener('focus', formRemoveErrorFocus);
            error++;
          }
        }
				if (input.value === '') {
					formAddError(input);
          input.addEventListener('focus', formRemoveErrorFocus);
					error++;
				}
			}
		}
		return error;
	}
	function formAddError(input) {
		input.classList.add('js-error');
	}
	function formRemoveError(input) {
		input.classList.remove('js-error');
	}
	//Функция теста email
	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}
  function showDropWindow(windowId) {
    let win = document.querySelector('.drop-window');
    lockScroll('header.header', true);
    win.style = 'opacity: 1; visibility: visible;';
    document.querySelector(windowId).style = 'display: block;'
  }
  function closeDropWindow() {
    let win = document.querySelector('.drop-window');
    win.style = 'opacity: 0; visibility: visible;';
    setTimeout(() => {
      win.style = '';  
      [...document.querySelectorAll('.drop-window__window')].forEach(item => {
        item.style = '';
      });
      unlockScroll('header.header', true);
    }, animatTime);
  }


  function clickHandler(event) {
    if (event.target.closest('.js-close-win')) {
      event.preventDefault();
      closeDropWindow();
      removeEventListener('keydown', escdHandler);
      removeEventListener('click', clickHandler);
    }
  }
  function escdHandler(event) {
    if (event.code === 'Escape') {
      closeDropWindow();
      removeEventListener('keydown', escdHandler);
      removeEventListener('click', clickHandler);
    }
  }
  orderTableBtn.addEventListener('click', () => {
    showDropWindow('#formWindow');
    let date = new Date();
    let dateField = document.querySelector('.field__field-control--type--input[type="date"]');
    let timeField = document.querySelector('.field__field-control--type--input[type="time"]');
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    date.setSeconds(0);
    date.setMilliseconds(0);
    dateField.valueAsDate = date;
    timeField.valueAsDate = date;
    dateField.min = dateField.value;
   
    document.addEventListener('keydown', escdHandler);
    document.addEventListener('click', clickHandler);
  });
  menuSlide({
    timeAnimate: animatTime,
    changePosition: true,
    addHeaderPadding: true,
    changeVisible: 150
  });

  const swiper = new Swiper('.slider-reviews .swiper', {
    loop: true,

    navigation: {
      nextEl: '.slider-reviews__next-btn',
      prevEl: '.slider-reviews__prev-btn',
    },

    autoplay: {
      delay: 2000,      
    },

    grabCursor: true,

    spaceBetween: 100,
  });  
  const sliderBlock = document.querySelector('.slider-reviews');
  sliderBlock.addEventListener('mouseenter', () => {
    swiper.autoplay.stop();
  })
  sliderBlock.addEventListener('mouseleave', () => {
    swiper.autoplay.start();
  })
});