(function() {
      const header = document.getElementById('mainHeader');
      const progress = document.getElementById('progressBar');
      const hamburger = document.getElementById('hamburger');
      const mobileMenu = document.getElementById('mobileMenu');
      const closeMobile = document.getElementById('closeMobile');
      const themeToggle = document.getElementById('themeToggle');
      const themeToggleMobile = document.getElementById('themeToggleMobile');
      const overlay = document.getElementById('megaOverlay');
      let dark = false;

      // اسکرول
      window.addEventListener('scroll', function() {
        const y = window.scrollY;
        header.classList.toggle('scrolled', y > 30);
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = maxScroll > 0 ? (y / maxScroll) * 100 + '%' : '0%';
      });

      // همبرگر - منوی موبایل
      hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });
      closeMobile.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });

      // ===== دکمه سوییچ تم (هر دو) =====
      function toggleTheme() {
        dark = !dark;
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
        const icon = dark ? 'fa-sun' : 'fa-moon';
        themeToggle.querySelector('i').className = 'fas ' + icon;
        themeToggleMobile.querySelector('i').className = 'fas ' + icon;
      }

      themeToggle.addEventListener('click', toggleTheme);
      themeToggleMobile.addEventListener('click', toggleTheme);

      // ===== مگامنیو موبایل با کلیک =====
      const navItems = document.querySelectorAll('.nav-desktop > li[data-tab]');
      let activeMega = null;

      function isMobile() {
        return window.innerWidth < 769;
      }

      navItems.forEach(li => {
        li.addEventListener('click', function(e) {
          if (e.target.closest('a') && !e.target.closest('.mega-menu')) {
            return;
          }
          if (e.target.closest('.mega-menu')) return;
          if (!isMobile()) return;

          e.preventDefault();
          const mega = this.querySelector('.mega-menu');
          if (!mega) return;

          if (activeMega && activeMega !== mega) {
            activeMega.classList.remove('open');
          }

          mega.classList.toggle('open');
          activeMega = mega.classList.contains('open') ? mega : null;
          overlay.classList.toggle('active', mega.classList.contains('open'));

          navItems.forEach(n => n.classList.remove('active'));
          if (mega.classList.contains('open')) {
            this.classList.add('active');
          } else {
            this.classList.remove('active');
          }
        });
      });

      overlay.addEventListener('click', function() {
        document.querySelectorAll('.mega-menu.open').forEach(m => m.classList.remove('open'));
        overlay.classList.remove('active');
        navItems.forEach(n => n.classList.remove('active'));
        activeMega = null;
      });

      window.addEventListener('scroll', function() {
        if (isMobile()) {
          document.querySelectorAll('.mega-menu.open').forEach(m => m.classList.remove('open'));
          overlay.classList.remove('active');
          activeMega = null;
        }
      });

      window.addEventListener('resize', function() {
        if (!isMobile()) {
          document.querySelectorAll('.mega-menu.open').forEach(m => m.classList.remove('open'));
          overlay.classList.remove('active');
          activeMega = null;
        }
      });

      setTimeout(() => {
        const homeLi = document.querySelector('.nav-desktop li[data-tab="home"]');
        if (homeLi) homeLi.classList.add('active');
      }, 100);
    })();






    (function() {
      // ---- مقداردهی Swiper ----
      const swiper = new Swiper('.mySwiper', {
        direction: 'horizontal',
        loop: true,
        autoplay: {
          delay: 5500,
          disableOnInteraction: false,
        },
        speed: 900,
        effect: 'slide', // می‌توانید به 'fade' هم تغییر دهید
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          renderBullet: function(index, className) {
            return '<span class="' + className + '"></span>';
          },
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        on: {
          slideChange: function() {
            // به‌روزرسانی شمارنده
            const current = this.realIndex + 1;
            document.getElementById('currentSlideNum').textContent = current;
            // انیمیشن ورود محتوای اسلاید جدید با GSAP
            animateSlideContent(this.slides[this.activeIndex]);
          },
          slideChangeTransitionStart: function() {
            // مخفی کردن محتوای اسلاید قبلی
            const prevSlide = this.slides[this.previousIndex];
            if (prevSlide) {
              const content = prevSlide.querySelector('.slide-content');
              if (content) {
                gsap.set(content, { opacity: 0, y: 40 });
              }
            }
          },
        },
      });

      // ---- تابع انیمیشن محتوای اسلاید با GSAP ----
      function animateSlideContent(slide) {
        if (!slide) return;
        const content = slide.querySelector('.slide-content');
        if (!content) return;
        // ریست position برای انیمیشن
        gsap.set(content, { opacity: 0, y: 40 });
        // اجرای انیمیشن با تأخیر
        const delay = parseFloat(content.getAttribute('data-delay')) || 0.2;
        gsap.to(content, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: delay,
          ease: 'power3.out',
        });
      }

      // ---- انیمیشن اسلاید اول در بارگذاری ----
      setTimeout(() => {
        const activeSlide = swiper.slides[swiper.activeIndex];
        if (activeSlide) {
          animateSlideContent(activeSlide);
        }
      }, 300);

      // ---- سوییچ تم (هماهنگ با هدر) ----
      const themeToggle = document.getElementById('themeToggle');
      let dark = false;

      function toggleTheme() {
        dark = !dark;
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
        const icon = themeToggle.querySelector('i');
        if (dark) {
          icon.className = 'fas fa-sun';
        } else {
          icon.className = 'fas fa-moon';
        }
        // به‌روزرسانی پس‌زمینه اسلایدر با متغیرهای CSS
        // (خودکار انجام می‌شود)
      }

      themeToggle.addEventListener('click', toggleTheme);

      // تشخیص تم سیستم در اولین بار
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        dark = true;
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.querySelector('i').className = 'fas fa-sun';
      }

      // ---- به‌روزرسانی شمارنده در ابتدا ----
      document.getElementById('currentSlideNum').textContent = '1';

    })();










(function() {
      const themeToggle = document.getElementById('themeToggle');
      let dark = false;

      // بررسی تم فعلی
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
        dark = true;
        themeToggle.querySelector('i').className = 'fas fa-sun';
      }

      themeToggle.addEventListener('click', function() {
        dark = !dark;
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
        const icon = this.querySelector('i');
        if (dark) {
          icon.className = 'fas fa-sun';
        } else {
          icon.className = 'fas fa-moon';
        }
      });

      // تشخیص تم سیستم
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        if (!document.documentElement.getAttribute('data-theme')) {
          document.documentElement.setAttribute('data-theme', 'dark');
          themeToggle.querySelector('i').className = 'fas fa-sun';
          dark = true;
        }
      }
    })();








    (function() {
      const scrollWrapper = document.getElementById('testimonialsScroll');
      
      if (scrollWrapper) {
        // اسکرول با چرخ ماوس (افقی)
        scrollWrapper.addEventListener('wheel', function(e) {
          if (e.deltaY !== 0) {
            e.preventDefault();
            this.scrollLeft += e.deltaY;
          }
        }, { passive: false });

        // قابلیت کشیدن با ماوس (drag)
        let isDown = false;
        let startX;
        let scrollLeft;

        scrollWrapper.addEventListener('mousedown', function(e) {
          isDown = true;
          this.style.cursor = 'grabbing';
          startX = e.pageX - this.offsetLeft;
          scrollLeft = this.scrollLeft;
        });

        scrollWrapper.addEventListener('mouseleave', function() {
          isDown = false;
          this.style.cursor = 'grab';
        });

        scrollWrapper.addEventListener('mouseup', function() {
          isDown = false;
          this.style.cursor = 'grab';
        });

        scrollWrapper.addEventListener('mousemove', function(e) {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - this.offsetLeft;
          const walk = (x - startX) * 1.5;
          this.scrollLeft = scrollLeft - walk;
        });

        // برای تاچ موبایل
        let touchStartX = 0;
        let touchScrollLeft = 0;

        scrollWrapper.addEventListener('touchstart', function(e) {
          touchStartX = e.touches[0].pageX - this.offsetLeft;
          touchScrollLeft = this.scrollLeft;
        }, { passive: true });

        scrollWrapper.addEventListener('touchmove', function(e) {
          const x = e.touches[0].pageX - this.offsetLeft;
          const walk = (x - touchStartX) * 1.5;
          this.scrollLeft = touchScrollLeft - walk;
        }, { passive: true });
      }
    })();









        (function() {
      const scrollWrapper = document.getElementById('whyScroll');
      
      if (scrollWrapper) {
        // اسکرول با چرخ ماوس (افقی)
        scrollWrapper.addEventListener('wheel', function(e) {
          if (e.deltaY !== 0) {
            e.preventDefault();
            this.scrollLeft += e.deltaY;
          }
        }, { passive: false });

        // قابلیت کشیدن با ماوس (drag)
        let isDown = false;
        let startX;
        let scrollLeft;

        scrollWrapper.addEventListener('mousedown', function(e) {
          isDown = true;
          this.style.cursor = 'grabbing';
          startX = e.pageX - this.offsetLeft;
          scrollLeft = this.scrollLeft;
        });

        scrollWrapper.addEventListener('mouseleave', function() {
          isDown = false;
          this.style.cursor = 'grab';
        });

        scrollWrapper.addEventListener('mouseup', function() {
          isDown = false;
          this.style.cursor = 'grab';
        });

        scrollWrapper.addEventListener('mousemove', function(e) {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - this.offsetLeft;
          const walk = (x - startX) * 1.5;
          this.scrollLeft = scrollLeft - walk;
        });

        // برای تاچ موبایل
        let touchStartX = 0;
        let touchScrollLeft = 0;

        scrollWrapper.addEventListener('touchstart', function(e) {
          touchStartX = e.touches[0].pageX - this.offsetLeft;
          touchScrollLeft = this.scrollLeft;
        }, { passive: true });

        scrollWrapper.addEventListener('touchmove', function(e) {
          const x = e.touches[0].pageX - this.offsetLeft;
          const walk = (x - touchStartX) * 1.5;
          this.scrollLeft = touchScrollLeft - walk;
        }, { passive: true });
      }
    })();








    (function() {
      // -------- تب‌ها --------
      const tabs = document.querySelectorAll('.pest-gallery-tab');
      const items = document.querySelectorAll('.pest-gallery-item');

      tabs.forEach(tab => {
        tab.addEventListener('click', function() {
          tabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');

          const filter = this.getAttribute('data-filter');

          items.forEach(item => {
            const type = item.getAttribute('data-type');
            if (filter === 'all' || filter === type) {
              item.classList.remove('hidden');
              item.style.animation = 'none';
              setTimeout(() => {
                item.style.animation = 'pestGalleryItemShow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
              }, 10);
            } else {
              item.classList.add('hidden');
            }
          });
        });
      });

      // -------- مودال --------
      const modal = document.getElementById('galleryModal');
      const modalContent = document.getElementById('modalContent');
      const modalTitleText = document.getElementById('modalTitleText');
      const modalClose = document.getElementById('modalClose');

      items.forEach(item => {
        item.addEventListener('click', function(e) {
          if (e.target.closest('.pest-gallery-play')) return;
          
          const type = this.getAttribute('data-type');
          const title = this.getAttribute('data-title') || 'نمونه کار';
          const desc = this.getAttribute('data-desc') || '';

          modalContent.innerHTML = '';

          if (type === 'image') {
            const imgSrc = this.querySelector('img')?.getAttribute('src');
            if (imgSrc) {
              const img = document.createElement('img');
              img.src = imgSrc;
              img.alt = title;
              modalContent.appendChild(img);
            }
          } else if (type === 'video') {
            const videoEl = this.querySelector('video');
            if (videoEl) {
              const video = document.createElement('video');
              video.src = videoEl.src;
              video.controls = true;
              video.autoplay = true;
              video.style.maxWidth = '100%';
              video.style.maxHeight = '85vh';
              video.style.borderRadius = '24px';
              modalContent.appendChild(video);
            }
          }

          modalTitleText.textContent = title + ' • ' + desc;
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        });
      });

      function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        const video = modalContent.querySelector('video');
        if (video) video.pause();
        modalContent.innerHTML = '';
      }

      modalClose.addEventListener('click', closeModal);
      modal.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
      });

      // -------- پخش ویدئو --------
      document.querySelectorAll('.pest-gallery-play').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const video = this.parentElement.querySelector('video');
          if (video) {
            if (video.paused) {
              video.play();
              this.style.display = 'none';
            } else {
              video.pause();
              this.style.display = 'flex';
            }
          }
        });
      });

      document.querySelectorAll('.pest-gallery-media video').forEach(video => {
        video.addEventListener('ended', function() {
          const playBtn = this.parentElement.querySelector('.pest-gallery-play');
          if (playBtn) playBtn.style.display = 'flex';
        });
      });
    })();











    (function() {
    'use strict';

    const pestData = [
      {
        id: 1, name: 'ساس ', sub: 'Cimex lectularius',
        desc: 'ساس تختخواب حشره‌ای خون‌خوار است که شب‌ها از انسان تغذیه می‌کند.',
        fullDesc: `<strong>ساس تختخواب (Cimex lectularius)</strong> یکی از آزاردهنده‌ترین آفات شهری است.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر:</strong> ۴ تا ۶ ماه</li>
          <li><i class="fas fa-check-circle"></i> <strong>تخم‌گذاری:</strong> روزانه ۱ تا ۵ تخم</li>
          <li><i class="fas fa-check-circle"></i> <strong>خطر:</strong> خارش شدید و حساسیت</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> سمپاشی تخصصی و حرارت‌دهی</li>
        </ul>`,
        img: 'sass.jpg', badge: 'خون‌خوار', icon: 'bug'
      },
      {
        id: 2, name: 'سوسک ', sub: 'Periplaneta americana',
        desc: 'سوسک آمریکایی بزرگ‌ترین سوسک شهری است. در فاضلاب‌ها و زیرزمین‌ها زندگی می‌کند.',
        fullDesc: `<strong>سوسک آمریکایی (Periplaneta americana)</strong> با طول حدود ۴ سانتی‌متر، بزرگ‌ترین سوسک شهری است.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر:</strong> تا ۲ سال</li>
          <li><i class="fas fa-check-circle"></i> <strong>تخم‌گذاری:</strong> هر بار ۱۴ تا ۱۶ تخم</li>
          <li><i class="fas fa-check-circle"></i> <strong>بیماری‌ها:</strong> سالمونلا، تیفوئید</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> طعمه‌گذاری حرفه‌ای و سمپاشی محیطی</li>
        </ul>`,
        img: 'soosk.jpg', badge: 'بزرگ‌ترین', icon: 'skull'
      },
      {
        id: 3, name: 'مورچه سیاه', sub: 'Lasius niger',
        desc: 'مورچه سیاه معمولی‌ترین مورچه در محیط‌های شهری است. لانه‌ها را در دیوارها می‌سازد.',
        fullDesc: `<strong>مورچه سیاه (Lasius niger)</strong> یکی از رایج‌ترین مورچه‌های شهری است.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر ملکه:</strong> تا ۱۵ سال</li>
          <li><i class="fas fa-check-circle"></i> <strong>تخم‌گذاری:</strong> روزانه ۱۰ تا ۲۰ تخم</li>
          <li><i class="fas fa-check-circle"></i> <strong>آسیب:</strong> آلوده‌سازی مواد غذایی</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> طعمه‌گذاری هوشمند و مسدود کردن مسیرها</li>
        </ul>`,
        img: 'moorche.jpg', badge: 'رایج', icon: 'bug'
      },
      {
        id: 4, name: 'مورچه قرمز', sub: 'Solenopsis invicta',
        desc: 'مورچه قرمز یا مورچه آتشین نیشی دردناک دارد و به محصولات کشاورزی آسیب می‌رساند.',
        fullDesc: `<strong>مورچه قرمز (Solenopsis invicta)</strong> یا مورچه آتشین، نیشی سوزاننده دارد.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر ملکه:</strong> تا ۷ سال</li>
          <li><i class="fas fa-check-circle"></i> <strong>خطر:</strong> نیش سمی و آلرژی‌زا</li>
          <li><i class="fas fa-check-circle"></i> <strong>آسیب:</strong> به محصولات کشاورزی</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> طعمه‌گذاری تخصصی و سمپاشی ایمن</li>
        </ul>`,
        img: 'moorche-red.jpg', badge: 'خطرناک', icon: 'bug'
      },
      {
        id: 5, name: 'موش خانگی', sub: 'Mus musculus',
        desc: 'موش خانگی کوچک‌ترین جونده شهری است. به سرعت تکثیر می‌شود و به مواد غذایی آسیب می‌زند.',
        fullDesc: `<strong>موش خانگی (Mus musculus)</strong> با جثه کوچک، یکی از رایج‌ترین جوندگان شهری است.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر:</strong> ۱ تا ۲ سال</li>
          <li><i class="fas fa-check-circle"></i> <strong>تخم‌گذاری:</strong> هر بار ۵ تا ۱۰ بچه</li>
          <li><i class="fas fa-check-circle"></i> <strong>بیماری‌ها:</strong> سالمونلا، هانتاویروس</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> طعمه‌گذاری ایمن و تله‌گذاری حرفه‌ای</li>
        </ul>`,
        img: 'moosh.jpg', badge: 'تکثیر سریع', icon: 'rat'
      },
      {
        id: 6, name: 'موش صحرایی', sub: 'Rattus norvegicus',
        desc: 'موش صحرایی یا موش قهوه‌ای بزرگ‌ترین جونده شهری است. در فاضلاب‌ها زندگی می‌کند.',
        fullDesc: `<strong>موش صحرایی (Rattus norvegicus)</strong> یکی از خطرناک‌ترین جوندگان شهری است.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر:</strong> ۱ تا ۳ سال</li>
          <li><i class="fas fa-check-circle"></i> <strong>تخم‌گذاری:</strong> هر بار ۶ تا ۱۲ بچه</li>
          <li><i class="fas fa-check-circle"></i> <strong>بیماری‌ها:</strong> لپتوسپیروز، طاعون</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> طعمه‌گذاری قوی و مکان‌یابی لانه‌ها</li>
        </ul>`,
        img: 'moosh2.jpg', badge: 'خطرناک‌ترین', icon: 'rat'
      },
      {
        id: 7, name: 'موریانه', sub: 'Isoptera',
        desc: 'موریانه‌ها حشرات اجتماعی هستند که به چوب و سازه‌های چوبی آسیب شدیدی می‌رسانند.',
        fullDesc: `<strong>موریانه‌ها (Isoptera)</strong> حشرات اجتماعی هستند که از سلولز تغذیه می‌کنند.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر ملکه:</strong> تا ۳۰ سال</li>
          <li><i class="fas fa-check-circle"></i> <strong>تخم‌گذاری:</strong> روزانه تا ۲۰۰۰ تخم</li>
          <li><i class="fas fa-check-circle"></i> <strong>آسیب:</strong> تخریب سازه‌های چوبی</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> سیستم‌های طعمه‌گذاری تخصصی</li>
        </ul>`,
        img: 'mooriane.jpg', badge: 'تخریب‌گر', icon: 'bug'
      },
      {
        id: 8, name: 'بید لباس', sub: 'Tineola bisselliella',
        desc: 'بید لباس به پارچه‌های پشمی و ابریشمی آسیب می‌زند.',
        fullDesc: `<strong>بید لباس (Tineola bisselliella)</strong> یکی از آفات مهم منسوجات است.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر:</strong> ۱ تا ۲ سال</li>
          <li><i class="fas fa-check-circle"></i> <strong>تخم‌گذاری:</strong> ۵۰ تا ۱۰۰ تخم</li>
          <li><i class="fas fa-check-circle"></i> <strong>آسیب:</strong> سوراخ‌کردن لباس‌ها</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> سمپاشی کمدها و قرص‌های ضد بید</li>
        </ul>`,
        img: 'bid.jpg', badge: 'آفت پارچه', icon: 'bug'
      },
      {
        id: 9, name: 'سیلو (سوسک نقره‌ای)', sub: 'Lepisma saccharina',
        desc: 'سیلو در مکان‌های مرطوب زندگی می‌کند و به کاغذ و مواد نشاسته‌ای آسیب می‌زند.',
        fullDesc: `<strong>سیلو (Lepisma saccharina)</strong> یا سوسک نقره‌ای، در محیط‌های مرطوب زندگی می‌کند.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر:</strong> ۲ تا ۳ سال</li>
          <li><i class="fas fa-check-circle"></i> <strong>تخم‌گذاری:</strong> تا ۵۰ تخم</li>
          <li><i class="fas fa-check-circle"></i> <strong>آسیب:</strong> به کاغذ دیواری و کتاب‌ها</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> کاهش رطوبت و سمپاشی نقطه‌ای</li>
        </ul>`,
        img: 'soosk-no.jpg', badge: 'مرطوب‌دوست', icon: 'bug'
      },
      
      {
        id: 10, name: 'سوسک آلمانی', sub: 'Blattella germanica',
        desc: 'سوسک‌های آلمانی کوچک‌ترین و رایج‌ترین سوسک‌ها در منازل هستند.',
        fullDesc: `<strong>سوسک آلمانی (Blattella germanica)</strong> یکی از مقاوم‌ترین آفات شهری است. به سرعت تکثیر می‌شود و در محیط‌های گرم و مرطوب زندگی می‌کند.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر:</strong> حدود ۶ ماه</li>
          <li><i class="fas fa-check-circle"></i> <strong>تخم‌گذاری:</strong> هر بار ۳۰ تا ۴۰ تخم</li>
          <li><i class="fas fa-check-circle"></i> <strong>بیماری‌ها:</strong> سالمونلا، اسهال خونی</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> ژل‌های طعمه‌دار و سمپاشی نقطه‌ای با مواد بدون بو</li>
        </ul>`,
        img: 'soosk-ar.jpg', badge: 'شایع‌ترین', icon: 'bug'
      },

      {
        id: 11, name: 'کنه کبوتر', sub: 'Argas reflexus',
        desc: 'کنه کبوتر انگل خارجی پرندگان است که می‌تواند انسان را نیز نیش بزند.',
        fullDesc: `<strong>کنه کبوتر (Argas reflexus)</strong> انگل خارجی پرندگان است.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر:</strong> تا ۵ سال</li>
          <li><i class="fas fa-check-circle"></i> <strong>تخم‌گذاری:</strong> تا ۱۰۰ تخم</li>
          <li><i class="fas fa-check-circle"></i> <strong>خطر:</strong> انتقال بیماری‌های پرندگان</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> سمپاشی لانه‌ها</li>
        </ul>`,
        img: 'kane.jpg', badge: 'انگل پرندگان', icon: 'bug'
      },
      {
        id: 12, name: 'مگس میوه', sub: 'Drosophila melanogaster',
        desc: 'مگس میوه به میوه‌های رسیده و تخمیرشده جذب می‌شود.',
        fullDesc: `<strong>مگس میوه (Drosophila melanogaster)</strong> یکی از رایج‌ترین مگس‌های شهری است.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر:</strong> ۲ تا ۳ هفته</li>
          <li><i class="fas fa-check-circle"></i> <strong>تخم‌گذاری:</strong> تا ۵۰۰ تخم</li>
          <li><i class="fas fa-check-circle"></i> <strong>آسیب:</strong> فساد میوه‌ها</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> تله‌های فرمونی و سمپاشی سبک</li>
        </ul>`,
        img: 'magas-mive.jpg', badge: 'فصلی', icon: 'bug'
      },
      {
        id: 13, name: 'مگس خانگی', sub: 'Musca domestica',
        desc: 'مگس خانگی یکی از رایج‌ترین حشرات شهری است که ناقل بیماری‌های مختلف است.',
        fullDesc: `<strong>مگس خانگی (Musca domestica)</strong> یکی از مهم‌ترین ناقلان بیماری‌ها است.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر:</strong> ۲ تا ۴ هفته</li>
          <li><i class="fas fa-check-circle"></i> <strong>تخم‌گذاری:</strong> تا ۱۰۰۰ تخم</li>
          <li><i class="fas fa-check-circle"></i> <strong>بیماری‌ها:</strong> اسهال خونی، حصبه، وبا</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> سمپاشی محیطی و تله‌های چسبنده</li>
        </ul>`,
        img: 'magas.jpg', badge: 'ناقل بیماری', icon: 'bug'
      },
      {
        id: 14, name: 'پشه', sub: 'Culicidae',
        desc: 'پشه‌ها حشرات خون‌خوار هستند که بیماری‌هایی مانند مالاریا را منتقل می‌کنند.',
        fullDesc: `<strong>پشه‌ها (Culicidae)</strong> یکی از خطرناک‌ترین حشرات برای انسان هستند.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر:</strong> ۲ تا ۴ هفته</li>
          <li><i class="fas fa-check-circle"></i> <strong>تخم‌گذاری:</strong> تا ۳۰۰ تخم</li>
          <li><i class="fas fa-check-circle"></i> <strong>بیماری‌ها:</strong> مالاریا، تب دنگی، زیکا</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> سمپاشی مه‌پاش و حذف آب‌های راکد</li>
        </ul>`,
        img: 'pashe.jpg', badge: 'خون‌خوار خطرناک', icon: 'bug'
      },
      {
        id: 15, name: 'سوسک فرش', sub: 'Anthrenus verbasci',
        desc: 'سوسک فرش به الیاف طبیعی و فرش‌ها آسیب می‌زند.',
        fullDesc: `<strong>سوسک فرش (Anthrenus verbasci)</strong> یکی از آفات مهم فرش‌ها است.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر:</strong> ۱ تا ۲ سال</li>
          <li><i class="fas fa-check-circle"></i> <strong>تخم‌گذاری:</strong> تا ۴۰ تخم</li>
          <li><i class="fas fa-check-circle"></i> <strong>آسیب:</strong> سوراخ‌کردن فرش‌ها</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> سمپاشی تخصصی قالی‌ها</li>
        </ul>`,
        img: 'soosk-farsh.jpg', badge: 'آفت فرش', icon: 'bug'
      },
      {
        id: 16, name: 'سوسک آسیاب', sub: 'Oryzaephilus surinamensis',
        desc: 'سوسک آسیاب یکی از آفات مهم انبارها و مواد غذایی خشک است.',
        fullDesc: `<strong>سوسک آسیاب (Oryzaephilus surinamensis)</strong> یکی از مهم‌ترین آفات انبارها است.
        <ul class="pi-detail-list">
          <li><i class="fas fa-check-circle"></i> <strong>طول عمر:</strong> ۶ تا ۱۰ ماه</li>
          <li><i class="fas fa-check-circle"></i> <strong>تخم‌گذاری:</strong> تا ۲۰۰ تخم</li>
          <li><i class="fas fa-check-circle"></i> <strong>آسیب:</strong> آلوده‌سازی مواد غذایی</li>
          <li><i class="fas fa-check-circle"></i> <strong>روش مبارزه:</strong> سمپاشی انبارها و تله‌های فرمونی</li>
        </ul>`,
        img: 'soosk-asiab.jpg', badge: 'آفت انبار', icon: 'bug'
      }
    ];

    // ===== RENDER CARDS =====
    const grid = document.getElementById('pestIdentGrid');
    if (!grid) return;

    pestData.forEach((pest) => {
      const card = document.createElement('div');
      card.className = 'pest-ident-card';
      card.setAttribute('data-id', pest.id);
      card.innerHTML = `
        <div class="pest-ident-card-img">
          <img src="${pest.img}" alt="${pest.name}" onerror="this.src='img/pest/default.jpg'">
          <span class="pi-badge">${pest.badge}</span>
          <span class="pi-icon-corner"><i class="fas fa-${pest.icon || 'bug'}"></i></span>
          <div class="pi-overlay"><i class="fas fa-search-plus"></i></div>
        </div>
        <div class="pest-ident-card-body">
          <div class="pi-name-row"><h3>${pest.name}</h3></div>
          <div class="pi-sub">${pest.sub}</div>
          <div class="pi-desc">${pest.desc}</div>
          <div class="pi-info-row">
            <span><i class="fas fa-clock"></i> شناسایی سریع</span>
            <span><i class="fas fa-shield-alt"></i> راهکار تخصصی</span>
          </div>
          <div class="pest-ident-card-footer">
            <button class="pi-more-btn" data-id="${pest.id}"><i class="fas fa-chevron-left"></i> جزییات بیشتر</button>
            <i class="fas fa-${pest.icon || 'bug'} pi-icon-small"></i>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    // ===== MODAL =====
    const modal = document.getElementById('piModal');
    const modalClose = document.getElementById('piModalClose');
    const modalCancel = document.getElementById('piModalCancel');
    const modalImg = document.getElementById('piModalImg').querySelector('img');
    const modalTitle = document.getElementById('piModalTitle');
    const modalSub = document.getElementById('piModalSub');
    const modalBadge = document.getElementById('piModalBadge');
    const modalDesc = document.getElementById('piModalDesc');
    const requestBtn = document.getElementById('piRequestBtn');

    function openModal(id) {
      const pest = pestData.find(p => p.id === id);
      if (!pest) return;
      modalImg.src = pest.img;
      modalImg.alt = pest.name;
      modalTitle.textContent = pest.name;
      modalSub.textContent = pest.sub;
      modalBadge.textContent = pest.badge;
      modalDesc.innerHTML = pest.fullDesc;
      requestBtn.dataset.id = pest.id;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });

    document.addEventListener('click', function(e) {
      const btn = e.target.closest('.pi-more-btn');
      if (btn) {
        const id = parseInt(btn.dataset.id);
        openModal(id);
      }
    });

    document.addEventListener('click', function(e) {
      const card = e.target.closest('.pest-ident-card');
      if (card && !e.target.closest('.pi-more-btn') && !e.target.closest('.pest-ident-card-footer')) {
        const id = parseInt(card.dataset.id);
        openModal(id);
      }
    });

    requestBtn.addEventListener('click', function() {
      const id = this.dataset.id;
      const pest = pestData.find(p => p.id == id);
      if (pest) {
        window.location.href = `contact.html?pest=${encodeURIComponent(pest.name)}`;
      } else {
        window.location.href = 'contact.html';
      }
    });

    // ===== HORIZONTAL SCROLL =====
    const scrollWrapper = document.getElementById('pestIdentScroll');
    if (scrollWrapper) {
      scrollWrapper.addEventListener('wheel', function(e) {
        if (e.deltaY !== 0) {
          e.preventDefault();
          this.scrollLeft += e.deltaY;
        }
      }, { passive: false });

      let isDown = false, startX, scrollLeft;
      scrollWrapper.addEventListener('mousedown', function(e) {
        isDown = true;
        this.style.cursor = 'grabbing';
        startX = e.pageX - this.offsetLeft;
        scrollLeft = this.scrollLeft;
      });
      scrollWrapper.addEventListener('mouseleave', function() {
        isDown = false;
        this.style.cursor = 'grab';
      });
      scrollWrapper.addEventListener('mouseup', function() {
        isDown = false;
        this.style.cursor = 'grab';
      });
      scrollWrapper.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - this.offsetLeft;
        const walk = (x - startX) * 1.5;
        this.scrollLeft = scrollLeft - walk;
      });

      let touchStartX = 0, touchScrollLeft = 0;
      scrollWrapper.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].pageX - this.offsetLeft;
        touchScrollLeft = this.scrollLeft;
      }, { passive: true });
      scrollWrapper.addEventListener('touchmove', function(e) {
        const x = e.touches[0].pageX - this.offsetLeft;
        const walk = (x - touchStartX) * 1.5;
        this.scrollLeft = touchScrollLeft - walk;
      }, { passive: true });
    }

  })();















  // ===== FAQ Accordion =====
(function() {
  'use strict';

  const faqItems = document.querySelectorAll('.pest-faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.pest-faq-question');
    const answer = item.querySelector('.pest-faq-answer');

    question.addEventListener('click', function() {
      // بستن سایر آیتم‌ها (اختیاری - برای باز شدن فقط یکی)
      // faqItems.forEach(other => {
      //   if (other !== item && other.classList.contains('active')) {
      //     other.classList.remove('active');
      //   }
      // });

      // تغییر وضعیت آیتم فعلی
      item.classList.toggle('active');
    });
  });

  // باز کردن اولین آیتم به طور پیش‌فرض (اختیاری)
  // const firstItem = document.querySelector('.pest-faq-item');
  // if (firstItem) {
  //   firstItem.classList.add('active');
  // }

})();














// ===== انیمیشن شمارش اعداد =====
(function() {
  'use strict';

  // انیمیشن شمارش اعداد (در صورت وجود)
  function animateCounters() {
    const counters = document.querySelectorAll('.pest-clients-stat-number');
    counters.forEach(counter => {
      const text = counter.textContent;
      const match = text.match(/(\d+)/);
      if (!match) return;
      
      const target = parseInt(match[1]);
      const suffix = text.replace(/\d+/, '');
      const duration = 1500;
      const startTime = Date.now();

      function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        counter.textContent = current.toLocaleString('fa-IR') + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      update();
    });
  }

  // اجرای شمارش با تأخیر (وقتی سکشن در viewport باشد)
  const section = document.querySelector('.pest-clients-section');
  if (section) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(section);
  }

})();










// ===== بلاگ - هیچ اسکریپت خاصی لازم نیست =====
// فقط برای نمایش سکشن بلاگ، کافی است همین کد HTML و CSS استفاده شود.
// اگر نیاز به انیمیشن ورود مقالات دارید، می‌توانید از کد زیر استفاده کنید:

(function() {
  'use strict';

  // انیمیشن نمایش مقالات با تأخیر
  const cards = document.querySelectorAll('.pest-blog-card');
  
  if (cards.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // اضافه کردن تأخیر بر اساس ایندکس
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach((card, index) => {
      // تنظیم حالت اولیه
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      observer.observe(card);
    });
  }

})();















// ===== دکمه شناور پشتیبانی =====
(function() {
  const supportBtn = document.getElementById('supportBtn');
  const supportPopup = document.getElementById('supportPopup');
  const supportClose = document.getElementById('supportPopupClose');
  const floatingSupport = document.getElementById('floatingSupport');

  if (supportBtn && supportPopup) {
    // باز کردن پاپ‌آپ
    supportBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      floatingSupport.classList.toggle('active');
    });

    // بستن با دکمه ضربدر
    if (supportClose) {
      supportClose.addEventListener('click', function(e) {
        e.stopPropagation();
        floatingSupport.classList.remove('active');
      });
    }

    // بستن با کلیک خارج از پاپ‌آپ
    document.addEventListener('click', function(e) {
      if (!floatingSupport.contains(e.target)) {
        floatingSupport.classList.remove('active');
      }
    });

    // بستن با Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        floatingSupport.classList.remove('active');
      }
    });
  }
})();