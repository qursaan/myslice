var tooltip=function(){
 var id = 'tt';
 var top = 800; //3
 var left = 3; //3
 var maxw = 300;
 var speed = 10;
 var timer = 20;
 var endalpha = 95;
 var alpha = 0;
 var tt,t,c,b,h;
 var ie = document.all ? true : false;
 return{
	   show:function(v,w){
		   //console.log(tt);

		   if(tt == null){
			    tt = document.createElement('div');
			    tt.setAttribute('id',id);
			    //tt.setAttribute('style',"display: table; display: inline-block;");
			    t = document.createElement('div');
			    t.setAttribute('id',id + 'top');
			    c = document.createElement('div');
			    c.setAttribute('id',id + 'cont');
			    b = document.createElement('div');
			    b.setAttribute('id',id + 'bot');
			    tt.appendChild(t);
			    tt.appendChild(c);
			    tt.appendChild(b);
		          
			    //document.body.appendChild(tt);
			    var objTo = document.getElementById('topo_plugin')
			    objTo.appendChild(tt);
			    tt.style.position='absolute';
			   // tt.style.display='inline-block';
			    tt.style.opacity = 0;
			    //tt.style.filter = 'alpha(opacity=0)';
			    objTo.onmousemove = this.pos;
		   }//end of if tt==null

		   tt.style.display = 'block';
		   c.innerHTML = v;

		   //console.log("///////////////tooltip/////////",c);
		   tt.style.width = w ? w + 'px' : 'auto';

		   if(!w && ie){
			    t.style.display = 'none';
			    b.style.display = 'none';
			    tt.style.width = tt.offsetWidth;
			    t.style.display = 'block';
			    b.style.display = 'block';
		   } //end of if(!w && ie)

		  h=0;

		  if(tt.offsetWidth > maxw){
			tt.style.width = maxw + 'px';
		  }

		   h = parseInt(tt.offsetHeight) + top;
		   clearInterval(tt.timer);
		   tt.timer = setInterval(function(){tooltip.fade(1)},timer);

		//console.log("//////////////h:",h);
		   
		  },


		  pos:function(e){
			   //console.log(ie);
			   //var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
			   //var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
			   var u=e.clientY;
			   var l=e.clientX;

			  // if ((u-h)<0){
			//	tt.style.top =0 + 'px';
			  // }
			  // else{
			//	tt.style.top =(u-h) + 'px';
			 //  }
			   tt.style.top = e.clientY +'px';
			   //console.log("top:",tt.style.top);
			  // console.log("clientY:",e.clientY);
			   tt.style.left = (e.clientX-300) + 'px';

		  },

		  fade:function(d){
			   var a = alpha;
			   if((a != endalpha && d == 1) || (a != 0 && d == -1)){
			    	   var i = speed;
				   if(endalpha - a < speed && d == 1){
				    	i = endalpha - a;
				   }else if(alpha < speed && d == -1){
				     i = a;
			   	   }
			   	   alpha = a + (i * d);
			   	   tt.style.opacity = alpha * .01;
			   	   //tt.style.filter = 'alpha(opacity=' + alpha + ')';
			  }else{
			    	   clearInterval(tt.timer);
				   if(d == -1){
					tt.style.display = 'none'
			           }
	                  }
		   },


		 hide:function(){
		   clearInterval(tt.timer);
		   tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
		  }

	 }; //end of show function
  }();// end of return


