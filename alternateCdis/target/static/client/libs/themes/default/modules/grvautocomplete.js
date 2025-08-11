import moduleconfig from './config.json' with { type: 'json' };

export class grvautocomplete {
	static includes = {};
    constructor(config){
		this.container = $("#"+config.container);
		this.name = "grvautocomplete";
		this.id = this.name+"-"+Date.now();
		this.delay = (config.delay)?config.delay:300;
		this.highlight = (config.highlight)?config.highlight:true;
		this.minLength = (config.minLength)?config.minLength:1;
		this.maxHeight = (config.maxHeight)?config.maxHeight:300;
		this.source = config.source; //source is an url api to backend that returns json
		this.holder = $("<div>",{class:"grvautocomplete-container",id:this.id}).appendTo(this.container);
		this.input = $("<input>",{class:"grvautocomplete-input",autocomplete:"off"}).appendTo(this.holder);
		this.timeout = null;
		this.isOpen = false;
		this.dropdown = null;
		this.currentIndex = -1;
		this.loadstyle();
		this.createDropdown();
		this.bindEvents();
	}            
	
	
	loadstyle(){
	    const link = document.createElement('link');
	    link.rel = 'stylesheet';
	    link.href = moduleconfig.path+this.name+".css";
	    document.head.appendChild(link);
	}
		
	loadincludes(){
		$.each(moduleconfig.includes, function(i,mod){
			if(mod.module == "grvautocomplete"){
				$.each(mod.libs, async function(j,lib){
					grvautocomplete.includes[lib.alias] = await import(lib.file);
				});
			}
		})
	}
	
	
	bindEvents() {
		const self = this;
		this.input.on('input.autocomplete', function() {
			const query = $(this).val().trim();
			clearTimeout(self.timeout);
			if (query.length >= self.minLength) {
				self.timeout = setTimeout(() => self.search(query), self.delay);
			} else {
				self.hideDropdown();
			}
		});

		this.input.on('keydown.autocomplete', function(e) {
			if (!self.isOpen) return;
			switch(e.keyCode) {
               case 38: // Up arrow
                   e.preventDefault();
                   self.navigateUp();
                   break;
               case 40: // Down arrow
                   e.preventDefault();
                   self.navigateDown();
                   break;
               case 13: // Enter
                   e.preventDefault();
                   self.selectCurrent();
                   break;
               case 27: // Escape
                   self.hideDropdown();
                   break;
           }
		});

		this.input.on('blur.autocomplete', function() {setTimeout(() => self.hideDropdown(), 150);});

		$(document).on('click.autocomplete', function(e) {
			if (!self.input.is(e.target) && !self.dropdown.is(e.target) && !self.dropdown.has(e.target).length) {
				self.hideDropdown();
			}
		});
	}
	
	createDropdown() {
		this.dropdown = $('<div>',{class:"grvautocomplete-dropdown"});
		this.holder.append(this.dropdown);
	}
	
	search(query) {
		const self = this;
		if (typeof this.source === 'function') {
			this.showLoading();
			this.source(query, function(results) {
				self.hideLoading();
				self.displayResults(results, query);
			});
		}
	}
	
	displayResults(results, query) {
		const self = this;
		this.dropdown.empty();
		this.currentIndex = -1;

		if (results.length === 0) {
			this.dropdown.html('<div class="no-results">No results found</div>');
		} else {
			results.forEach((item, index) => {
				const $item = $('<div class="autocomplete-item"></div>');
	                                
				if (this.highlight) {
					console.log(item)
					const highlightedText = this.highlightMatch(item, query);
					$item.html(highlightedText);
				} else {
					$item.text(item);
				}

				$item.data('index', index).data('value', item);
				this.dropdown.append($item);
			});

			this.dropdown.on('click.autocomplete', '.autocomplete-item', function() {
				const item = $(this).data('value');
				self.selectItem(item);
			});

			this.dropdown.on('mouseenter.autocomplete', '.autocomplete-item', function() {
				$('.autocomplete-item').removeClass('active');
				$(this).addClass('active');
				self.currentIndex = $(this).data('index');
			});
		}

		this.showDropdown();
	}
	
	
	highlightMatch(text, query) {
		const regex = new RegExp(`(${query})`, 'gi');
		//return text.replace(regex, '<span class="match">$1</span>');
		return '<span class="match">query</span>';
	}

	showLoading() {
		this.dropdown.html('<div class="loading">Searching...</div>');
		this.showDropdown();
	}

	hideLoading() {
		this.dropdown.find('.loading').remove();
	}

	showDropdown() {
		this.dropdown.show();
		this.isOpen = true;
	}

	hideDropdown() {
		this.dropdown.hide();
        this.isOpen = false;
        this.currentIndex = -1;
    }

	navigateUp() {
		const $items = this.dropdown.find('.autocomplete-item');
		if ($items.length === 0) return;
		$items.removeClass('active');
		this.currentIndex = (this.currentIndex <= 0) ? $items.length - 1 : this.currentIndex - 1;
		$items.eq(this.currentIndex).addClass('active');
	}

	navigateDown() {
        const $items = this.dropdown.find('.autocomplete-item');
        if ($items.length === 0) return;

        $items.removeClass('active');
        this.currentIndex = (this.currentIndex >= $items.length - 1) ? 0 : this.currentIndex + 1;
        $items.eq(this.currentIndex).addClass('active');
    }

	selectCurrent() {
        const $activeItem = this.dropdown.find('.autocomplete-item.active');
        if ($activeItem.length) {
            const item = $activeItem.data('value');
            this.selectItem(item);
        }
    }

    selectItem(item) {
        this.input.val(item);
        this.hideDropdown();
        this.input.trigger('autocomplete:select', [item]);
    }	
	
}
