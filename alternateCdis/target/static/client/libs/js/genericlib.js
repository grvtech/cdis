
export function compareDateAsc(a,b) {if (new Date(a[0]) > new Date(b[0]))return 1;if (new Date(a[0]) < new Date(b[0]))return -1;return 0;}
export function compareDateDesc(a,b) {if (new Date(a[0]) < new Date(b[0]))return 1;if (new Date(a[0]) > new Date(b[0]))return -1;return 0;}

export function capitalizeFirstLetter(string) {return string.charAt(0).toUpperCase() + string.slice(1);}

export function isDecimal(input){let regex = /^[-+]?[0-9]+\.[0-9]+$/;return (regex.test(input));}

export function formatDate(date, format=null) {
  let p1 = new Intl.DateTimeFormat('en-US',{year: 'numeric',month: '2-digit',day: '2-digit',hour: '2-digit',minute: '2-digit',second: '2-digit',hour12: false})
  .formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
  }, {});
  
  let p2 = new Intl.DateTimeFormat('en-US',{year: 'numeric',month: 'short',day: '2-digit',hour: '2-digit',minute: '2-digit',second: '2-digit',hour12: false})
    .formatToParts(date).reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
		
    }, {});
	if(format != null) format = format.toLowerCase();
  	let result = `${p1.day}-${p1.month}-${p1.year}-${p1.hour}:${p1.minute}:${p1.second}`;
	  if(format == "yyyy-mm-dd")result = `${p1.year}-${p1.month}-${p1.day}`;
	  if(format == "dd-mm-yyyy")result = `${p1.day}-${p1.month}-${p1.year}`;
	  if(format == "yyyy/mm/dd")result = `${p1.year}/${p1.month}/${p1.day}`;
	  if(format == "yyyy/mmm")result = `${p2.year}/${p2.month}`;
	  if(format == "mmm yyyy")result = `${p2.month} ${p2.year}`;
	  if(format == "ddd mmm yyyy")result = `${p2.day} ${p2.month} ${p2.year}`;
  
  return result; 
}

export function highlightMatch(text, query) {
	let result = text.toString().toUpperCase();
	query = query.toUpperCase();
	if(result.indexOf(query) >= 0){
		result = result.replace(query,'<span class="match">'+query+'</span>')
	}	
	return result;
}


Array.prototype.max = function() {
	  return Math.max.apply(null, this);
	};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};