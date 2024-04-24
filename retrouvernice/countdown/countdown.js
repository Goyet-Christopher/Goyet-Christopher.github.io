var $ = function(id){return document.getElementById(id)};
// Create Countdown
var Countdown = {
  // Backbone-like structure
  el: $('countdown'),
  day_1: $("days-1"),
  day_2: $("days-2"),
  hour_1: $("hours-1"),
  hour_2: $("hours-2"),    
  min_1: $("min-1"),
  min_2: $("min-2"),
  sec_1: $("sec-1"),
  sec_2: $("sec-2"),

  // Params
  countdown_interval: null,
  total_seconds: 0,

  // Initialize the countdown  
  init: function () {
    const oneDay = 24 * 60 * 60 * 1000;
    var date1 = new Date();
    var date2 = new Date(2024, 5, 9, 9, 0);
    var days = Math.floor((date2-date1)/oneDay);
    var diff = new Date(date2.getTime() - date1.getTime());
    //var years = diff.getUTCFullYear() - 1970; // Gives difference as year
    //var months = diff.getUTCMonth(); // Gives month count of difference
    //var days = diff.getUTCDate(); // Gives day count of difference
    var hours = diff.getUTCHours();
    var minutes = diff.getUTCMinutes();
    var seconds = diff.getUTCSeconds();
    // Init countdown values
    this.values = {days:days, hours:hours, minutes:minutes, seconds:seconds};
    // this.values = {
    //   hours: this.$.hours.parent().attr('data-init-value'),
    //   minutes: this.$.minutes.parent().attr('data-init-value'),
    //   seconds: this.$.seconds.parent().attr('data-init-value') };

    // Initialize total seconds
    this.total_seconds = ((this.values.days * 24 + this.values.hours )* 60 + this.values.minutes) * 60 + this.values.seconds;

    // Animate countdown to the end 
    this.count();
  },
  decreaseOneSec: function () {
    var that = this.Countdown;
    if (that.total_seconds > 0) {
      --that.values.seconds;
      if (that.values.minutes >= 0 && that.values.seconds < 0) {
        that.values.seconds = 59;
        --that.values.minutes;
      }
      if (that.values.hours >= 0 && that.values.minutes < 0) {
        that.values.minutes = 59;
        --that.values.hours;
      }
      if (that.values.days >= 0 && that.values.hours < 0) {
        that.values.hours = 23;
        --that.values.days;
      }
      --that.total_seconds;
      // Update DOM values
      that.updateDOM();
    }else{
      clearInterval(this.countdown_interval);
    }
  },
  count: function () {
    this.countdown_interval = setInterval(this.decreaseOneSec, 1000);
  },
  updateDOM: function (){
    this.checkDigit(this.values.days, this.day_1, this.day_2);
    this.checkDigit(this.values.hours, this.hour_1, this.hour_2);
    this.checkDigit(this.values.minutes, this.min_1, this.min_2);
    this.checkDigit(this.values.seconds, this.sec_1, this.sec_2);
  },
  checkDigit: function (value, el_1, el_2) {
    //console.log("checkDigit : ", value, el_1.children[0], el_2.children[0]);
    var val_1 = ((value<10)?"0":value.toString().charAt(0)),
    val_2 = ((value<10)?value.toString().charAt(0):value.toString().charAt(1)),
    fig_1_value = el_1.children[0].innerHTML,
    fig_2_value = el_2.children[0].innerHTML;
    //console.log("Variables :", val_1, fig_1_value, val_2, fig_2_value);

    if (value >= 10) {
      // Animate only if the figure has changed
      //console.log("if (value >= 10) : ", fig_1_value != val_1, fig_2_value != val_2);
      if (fig_1_value != val_1){this.animateFigure(el_1, val_1);}
      if (fig_2_value != val_2){this.animateFigure(el_2, val_2);}
    } else
    {
      // If we are under 10, replace first figure with 0
      if (fig_1_value != '0'){this.animateFigure(el_1, 0);}
      if (fig_2_value != val_2){this.animateFigure(el_2, val_2);}
    }
  },
  animateFigure: function (el, value) {
    //console.log("animateFigure", el, value);
    var top = el.children[0],
    bottom = el.children[2],
    back_top = el.children[1],
    back_bottom = el.children[3];
    //console.log(top, back_top, bottom, back_bottom);
    // Before we begin, change the back value
    back_top.firstElementChild.innerHTML = value;
    // Also change the back bottom value
    back_bottom.firstElementChild.innerHTML = value;
   // Then animate
    // TweenMax.to(top, 50, {
    //     rotationX           : '-180deg',
    //     transformPerspective: 300,
    //     ease                : Quart.easeOut,
    //     onComplete          : function() {
    //         top.innerHTML = value;
    //         bottom.innerHTML = value;
    //         TweenMax.set(top, { rotationX: 0 });
    //     }
    // });

    // TweenMax.to(back_top, 50, { 
    //     rotationX           : 0,
    //     transformPerspective: 300,
    //     ease                : Quart.easeOut, 
    //     clearProps          : 'all' 
    // });  
    top.onanimationend = function(e){
        top.classList.remove("changingtop");
        top.innerHTML = value;
        bottom.innerHTML = value;
      };
    top.classList.add("changingtop");
    back_top.onanimationend = function(e){
        back_top.classList.remove("changingbacktop");
        top.innerHTML = value;
        bottom.innerHTML = value;
      };
    back_top.classList.add("changingbacktop");


  }
};

// Let's go !
Countdown.init();
    