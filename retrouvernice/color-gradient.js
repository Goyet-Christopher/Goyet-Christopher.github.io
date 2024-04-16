class Gradient {
	colors = [];
	blocks_sizes = [];

	constructor(start_color, end_color) {
		this.colors = [this.hex2rgb(start_color), this.hex2rgb(end_color)];
		this.blocks_sizes = [0,1];
/*    	for (var i = 0; i < arguments.length; i++) {
    		this.colors.push(this.hex2rgb(arguments[i]));
  	    };
  	    this.equi_repart_colors();*/
	};
	append_at(color, percent){
		var newcolors = [];
		var newblocks = [];
		var len = this.colors.length;
		var i = 0;
		while (this.blocks_sizes[i]<=percent){
				newblocks.push(this.blocks_sizes[i]);
				newcolors.push(this.colors[i]);
				i = i+1;
		};
		newblocks.push(percent);
		newcolors.push(this.hex2rgb(color));
		// if (percent==this.blocks_sizes[i]){
		// 	i = i+1;
		// };
		while(i<len){
			newblocks.push(this.blocks_sizes[i]);
			newcolors.push(this.colors[i]);
			i = i+1;

  	    };
  	    this.colors = newcolors;
  	    this.blocks_sizes = newblocks;
	};
	set_color_place(n, percent){
		console.log(this.colors);
		console.log(this.blocks_sizes);
		var len = this.colors.length;
		if (percent<=0 || percent>=1 || n<1 || n>=len){return null};
		const swapElements = (array, index1, index2) => {
    		var temp = array[index1];
    		array[index1]= array[index2];
    		array[index2] = temp;
		};
		this.blocks_sizes[n] = percent;
		console.log(this.colors);
		console.log(this.blocks_sizes);
		var i=n;
		var temp = 0;
		if (this.blocks_sizes[n-1]>percent){
			while (i>1 && this.blocks_sizes[i-1]>this.blocks_sizes[i]){
				console.log("descendre");
				swapElements(this.blocks_sizes, i-1, i);
				swapElements(this.colors, i-1, i);
				i = i-1;
			}
		}else{
			if (this.blocks_sizes[n+1]<percent){
				while (i<len-1 && this.blocks_sizes[i+1]<this.blocks_sizes[i]){
					console.log("monter");
					swapElements(this.blocks_sizes, i+1, i);
					swapElements(this.colors, i+1, i);
					i = i+1;
				}
			}
		}
	};
	equi_repart_colors(){
	    var len = this.colors.length;
	    var block_start = 0;
		var block_size = len<2 ? 1 : 1/(len-1);
		for (var i = 0; i < len; i++) {
    		this.blocks_sizes.push(block_start);
    		block_start = block_start+block_size
  	    };
	};
  	hex2rgb(hex) {
		var verif = (hex[0]=='#')&&(hex.length==7);
		return verif ? {
			r: parseInt(hex.substring(1,3), 16),
			g: parseInt(hex.substring(3,5), 16),
			b: parseInt(hex.substring(5,7), 16)
			} : null;
	};
	
	rgb2hex (rgbJSON) {
 		return "#" + (1 << 24 | rgbJSON.r << 16 | rgbJSON.g << 8 | rgbJSON.b).toString(16).slice(1);
	};

	_interpolate_rgbColor(color1,color2,percent) {
    	return {
      		r: (1-percent)*color1.r + percent*color2.r,
			g: (1-percent)*color1.g + percent*color2.g,
      		b: (1-percent)*color1.b + percent*color2.b
    		};
  	};
  	get_block_num(percent){
  		var i=0;
  		while (i<this.blocks_sizes.length && this.blocks_sizes[i]<=percent){
  			i = i+1;
  		}
  		return i-1;
  	};
  	getAt(percent) {
  		var n = this.get_block_num(percent);
  		var relative_percent = 0;
  		var curr_color = this.colors[n];
  		if (n<this.blocks_sizes.length-1){
  			var a = this.blocks_sizes[n];
  			var b = this.blocks_sizes[n+1];
  			relative_percent = (percent-a)/(b-a);
  			curr_color = this._interpolate_rgbColor(this.colors[n],this.colors[n+1],relative_percent);
  		};
  		return this.rgb2hex(curr_color);
  	};
};