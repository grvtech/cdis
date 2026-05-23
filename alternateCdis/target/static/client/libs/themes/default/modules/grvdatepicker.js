import moduleconfig from './config.json' with { type: 'json' };

export class grvdatepicker {
	constructor(element, options) {
		// Default options
		this.defaults = {
            format: 'YYYY-MM-DD',
            minDate: null,
            maxDate: null,
            defaultDate: null,
            showToday: true,
            showClear: true,
            weekStart: 0, // 0 = Sunday, 1 = Monday
            onSelect: null,
            onShow: null,
            onHide: null
        };

        // Month names
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Day names
        this.dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
		this.name="grvdatepicker";
		this.id = this.name+"-"+Date.now();
        this.element = $(element);
        this.options = $.extend({}, this.defaults, options);
        this.currentDate = new Date();
        this.selectedDate = this.currentDate;
        this.isOpen = false;
        this.yearSelectorOpen = false;
        this.datepicker = null;
		this.loadstyle();
        this.init();
		
    }

	getValue(){
		return this.element.val();
	}
	
	loadstyle(){
	    const link = document.createElement('link');
	    link.rel = 'stylesheet';
	    link.href = moduleconfig.path+this.name+".css";
	    document.head.appendChild(link);
	}
	
    init() {
        //this.element.attr('readonly', true);
		
        this.element.addClass('grvdatepicker-input');
        
        // Set default date if provided
        if (this.options.defaultDate) {
            this.selectedDate = new Date(this.options.defaultDate);
			console.log("default date : "+this.options.defaultDate);
			console.log("selected date : "+this.selectedDate);
            this.element.val(this.formatDate(this.selectedDate));
			
        }
		
        this.bindEvents();
        this.createDatepicker();
    }

    bindEvents() {
        this.element.on('click.grvdatepicker focus.grvdatepicker', (e) => {
            e.preventDefault();
            this.show();
        });

        $(document).on('click.grvdatepicker', (e) => {
            if (!$(e.target).closest('.grvdatepicker, .grvdatepicker-input').length) {
                this.hide();
            }
        });

        $(document).on('keydown.grvdatepicker', (e) => {
            if (e.keyCode === 27) { // Escape key
                this.hide();
            }
        });
    }

    createDatepicker() {
        this.datepicker = $('<div class="grvdatepicker" id="'+this.id+'" style="display: none;"></div>');
        
        const header = this.createHeader();
        const calendar = this.createCalendar();
        const footer = this.createFooter();
        const yearSelector = this.createYearSelector();

        this.datepicker.append(header, calendar, footer, yearSelector);
        $('body').append(this.datepicker);
    }

    createHeader() {
        const header = $('<div class="grvdatepicker-header"></div>');
        
        const prevBtn = $('<button class="grvdatepicker-nav" type="button">‹</button>');
        const title = $('<div class="grvdatepicker-title"></div>');
        const nextBtn = $('<button class="grvdatepicker-nav" type="button">›</button>');

        prevBtn.on('click', () => this.prevMonth());
        nextBtn.on('click', () => this.nextMonth());
        title.on('click', () => this.showYearSelector());

        header.append(prevBtn, title, nextBtn);
        return header;
    }

    createCalendar() {
        const calendar = $('<div class="grvdatepicker-calendar"></div>');
        
        const weekdays = $('<div class="grvdatepicker-weekdays"></div>');
        const adjustedDayNames = this.getAdjustedDayNames();
        
        adjustedDayNames.forEach(day => {
            weekdays.append(`<div class="grvdatepicker-weekday">${day}</div>`);
        });

        const days = $('<div class="grvdatepicker-days"></div>');
        
        calendar.append(weekdays, days);
        return calendar;
    }

    createFooter() {
        const footer = $('<div class="grvdatepicker-footer"></div>');
        
        if (this.options.showToday) {
            const todayBtn = $('<button class="grvdatepicker-today-btn" type="button">Today</button>');
            todayBtn.on('click', () => this.selectToday());
            footer.append(todayBtn);
        }

        if (this.options.showClear) {
            const clearBtn = $('<button class="grvdatepicker-clear-btn" type="button">Clear</button>');
            clearBtn.on('click', () => this.clear());
            footer.append(clearBtn);
        }

        return footer;
    }

    createYearSelector() {
        const yearSelector = $('<div class="grvdatepicker-year-selector"></div>');
        
        const yearHeader = $('<div class="grvdatepicker-year-header"></div>');
        const yearTitle = $('<div class="grvdatepicker-year-title">Select Year</div>');
        const closeBtn = $('<button class="grvdatepicker-year-close" type="button">×</button>');
        
        closeBtn.on('click', () => this.hideYearSelector());
        yearHeader.append(yearTitle, closeBtn);
        
        const yearsContainer = $('<div class="grvdatepicker-years"></div>');
        
        yearSelector.append(yearHeader, yearsContainer);
        return yearSelector;
    }

    getAdjustedDayNames() {
        const names = [...this.dayNames];
        if (this.options.weekStart === 1) {
            return [...names.slice(1), names[0]];
        }
        return names;
    }

    show() {
        if (this.isOpen) return;

        this.isOpen = true;
        this.yearSelectorOpen = false;
        this.updateCalendar();
        this.positionDatepicker();
        this.datepicker.fadeIn(200);

        if (this.options.onShow) {
            this.options.onShow.call(this.element[0]);
        }
    }

    hide() {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.yearSelectorOpen = false;
        this.datepicker.find('.grvdatepicker-year-selector').hide();
        this.datepicker.fadeOut(200);

        if (this.options.onHide) {
            this.options.onHide.call(this.element[0]);
        }
		
    }

    positionDatepicker() {
        const offset = this.element.offset();
        const inputHeight = this.element.outerHeight();
        const dpWidth = this.datepicker.outerWidth();
        const dpHeight = this.datepicker.outerHeight();
        const windowWidth = $(window).width();
        const windowHeight = $(window).height();
        const scrollTop = $(window).scrollTop();

        let left = offset.left;
        let top = offset.top + inputHeight + 5;

        // Adjust horizontal position if datepicker would go off screen
        if (left + dpWidth > windowWidth) {
            left = windowWidth - dpWidth - 10;
        }

        // Adjust vertical position if datepicker would go off screen
        if (top + dpHeight > scrollTop + windowHeight) {
            top = offset.top - dpHeight - 5;
        }

        this.datepicker.css({ left: left, top: top });
    }

    showYearSelector() {
        this.yearSelectorOpen = true;
        this.updateYearSelector();
        this.datepicker.find('.grvdatepicker-year-selector').show();
    }

    hideYearSelector() {
        this.yearSelectorOpen = false;
        this.datepicker.find('.grvdatepicker-year-selector').hide();
    }

    updateYearSelector() {
        const yearsContainer = this.datepicker.find('.grvdatepicker-years');
        yearsContainer.empty();

        const currentYear = this.currentDate.getFullYear();
        const startYear = currentYear - 50; // Show 50 years before current
        const endYear = currentYear + 50;   // Show 50 years after current

        for (let year = startYear; year <= endYear; year++) {
            const yearElement = $(`<div class="grvdatepicker-year">${year}</div>`);
            
            if (year === currentYear) {
                yearElement.addClass('current');
            }

            yearElement.on('click', () => this.selectYear(year));
            yearsContainer.append(yearElement);
        }

        // Scroll to current year
        const currentYearElement = yearsContainer.find('.current');
        if (currentYearElement.length) {
            const scrollTop = currentYearElement.position().top - yearsContainer.height() / 2;
            yearsContainer.scrollTop(scrollTop);
        }
    }

    selectYear(year) {
        this.currentDate.setFullYear(year);
		this.selectedDate.setFullYear(year);
        this.hideYearSelector();
        this.updateCalendar();
    }

    updateCalendar() {
        this.updateHeader();
        this.updateDays();
    }

    updateHeader() {
		let title = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
		if(this.selectedDate != null){
			title = `${this.monthNames[this.selectedDate.getMonth()]} ${this.selectedDate.getFullYear()}`;
		}
        this.datepicker.find('.grvdatepicker-title').text(title);
    }

    updateDays() {
        const daysContainer = this.datepicker.find('.grvdatepicker-days');
        daysContainer.empty();

        let year = this.currentDate.getFullYear();
        let month = this.currentDate.getMonth();
		
		if(this.selectedDate != null){
			year = this.selectedDate.getFullYear();
			month = this.selectedDate.getMonth();
		}
		/**/
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        let startDay = firstDay.getDay();
        if (this.options.weekStart === 1) {
            startDay = (startDay === 0) ? 6 : startDay - 1;
        }

        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

        // Previous month days
        const prevMonth = new Date(year, month - 1, 0);
        const prevMonthDays = prevMonth.getDate();
        
        for (let i = startDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            const date = new Date(year, month - 1, day);
            const dayElement = this.createDayElement(day, date, true);
            daysContainer.append(dayElement);
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayElement = this.createDayElement(day, date, false);
            
            // Mark today
            if (isCurrentMonth && day === today.getDate()) {
                dayElement.addClass('today');
            }

            // Mark selected
            if (this.selectedDate && this.isSameDate(date, this.selectedDate)) {
                dayElement.addClass('selected');
            }

            daysContainer.append(dayElement);
        }

        // Next month days
        const totalCells = daysContainer.children().length;
        const remainingCells = 42 - totalCells; // 6 weeks * 7 days
        
        for (let day = 1; day <= remainingCells && day <= 14; day++) {
            const date = new Date(year, month + 1, day);
            const dayElement = this.createDayElement(day, date, true);
            daysContainer.append(dayElement);
        }
    }

    createDayElement(day, date, isOtherMonth) {
        const dayElement = $(`<div class="grvdatepicker-day">${day}</div>`);
        
        if (isOtherMonth) {
            dayElement.addClass('other-month');
        }

        // Check if date is disabled
        if (this.isDateDisabled(date)) {
            dayElement.addClass('disabled');
        } else {
            dayElement.on('click', () => this.selectDate(date));
        }

        return dayElement;
    }

    isDateDisabled(date) {
        if (this.options.minDate && date < new Date(this.options.minDate)) {
            return true;
        }
        if (this.options.maxDate && date > new Date(this.options.maxDate)) {
            return true;
        }
        return false;
    }

    selectDate(date) {
        this.selectedDate = new Date(date);
        this.element.val(this.formatDate(this.selectedDate));
		//this.currentDate = this.selectedDate;
        this.hide();

        if (this.options.onSelect) {
            this.options.onSelect.call(this.element[0], this.selectedDate);
        }

        this.element.trigger('change');
    }

    selectToday() {
        const today = new Date();
        if (!this.isDateDisabled(today)) {
            this.selectDate(today);
        }
    }

    clear() {
        this.selectedDate = null;
        this.element.val('');
        this.hide();
        this.element.trigger('change');
    }

    prevMonth() {
        //this.currentDate.setMonth(this.currentDate.getMonth() - 1);
		this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);
        this.updateCalendar();
    }

    nextMonth() {
        //this.currentDate.setMonth(this.currentDate.getMonth() + 1);
		this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);
        this.updateCalendar();
    }

    formatDate(date) {
		console.log("format date : "+date);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');

        return this.options.format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    }

    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getUTCDate() === date2.getUTCDate();
    }

    destroy() {
        this.element.off('#'+this.id);
        $(document).off('#'+this.id);
        if (this.datepicker) {
            this.datepicker.remove();
        }
        this.element.removeData('#'+this.id);
    }
}

          
