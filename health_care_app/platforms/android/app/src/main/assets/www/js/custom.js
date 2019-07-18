function go_back(){
  var current_page = $(".app_page:visible").attr("page");

  if(current_page == "splash"){
    //ignore
  }else if(current_page == "signin"){
    change_page("splash");
  }else if(current_page == "signup"){
    change_page("splash");
  }else if(current_page == "sms_verification"){
    change_page("signin");
  }else if(current_page == "set_password"){
    change_page("signin");
  }else if(current_page == "forgot"){
    change_page("signin");
  }else if(current_page == "patient_dashboard"){
    //ignore
  }else if(current_page == "doctor_dashboard"){
    //ignore
  }else if(current_page == "services"){
    change_page("patient_dashboard");
  }else if(current_page == "specialities"){
    change_page("patient_dashboard");
  }else if(current_page == "doctors"){
    change_page("patient_dashboard");
  }else if(current_page == "schedule"){
    change_page("doctors");
  }else if(current_page == "terms_and_contitions"){
    change_page("schedule");
  }else if(current_page == "appointments"){
    if(user_data['type'] == "patient"){
      change_page("patient_dashboard");
    }else if(user_data['type'] == "doctor"){
      change_page("doctor_dashboard");
    }
  }else if(current_page == "appointment_details"){
    change_page("appointments");
  }else if(current_page == "patient_documents"){
    if(user_data['type'] == "patient"){
      change_page("patient_dashboard");
    }else if(user_data['type'] == "doctor"){
      change_page("appointment_details");
    }
  }else if(current_page == "video"){
    change_page("patient_examination");
  }else if(current_page == "chat"){
    change_page("appointment_details");
  }else if(current_page == "chat_more"){
    change_page("chat");
  }else if(current_page == "profile"){
    change_page("patient_dashboard");
  }else if(current_page == "update_profile"){
    change_page("profile");
  }else if(current_page == "patient_examination"){
    change_page("chat");
  }else{
    //ignore
  }
}
function change_page(new_page){



  if(new_page == "signin" || new_page == "signup"){
    $(".auth_buttons").hide();
    $(".app_page").slideUp(1000,function(){
      setTimeout(function(){
        $(".app_page[page='"+new_page+"']").slideDown();
      },250);
    });
  }else if(new_page == "splash"){
    $(".app_page").fadeOut(function(){
      setTimeout(function(){
        $(".app_page[page='"+new_page+"']").slideDown(500);
        $(".auth_buttons").fadeIn();
      },250);
    });
    return false;
  }else if(new_page == "chat" || new_page == "patient_examination" || new_page == "video"){
    setTimeout(function(){
      $(".chat_here").scrollTop($(".chat_here")[0].scrollHeight);
    },100);

    if(user_data['type'] == "doctor"){
      $(".main_navbar").slideUp();
      $(".doctor_chat_navbar").slideDown();
    }else{
      $(".doctor_chat_navbar").slideUp();
      $(".main_navbar").slideDown();
    }
  }else{
    $(".doctor_chat_navbar").slideUp();
    $(".main_navbar").slideDown();
  }

  if(new_page == "patient_dashboard"){
    $(".navbar-bottom .col").removeClass("col-active");
    $(".navbar-bottom .goto_home").addClass("col-active");
  }else if(new_page == "appointments"){
    $(".navbar-bottom .col").removeClass("col-active");
    $(".navbar-bottom .get_appointments").addClass("col-active");
  }else if(new_page == "profile"){
    $(".navbar-bottom .col").removeClass("col-active");
    $(".navbar-bottom .get_profile").addClass("col-active");
  }

  if(new_page == "patient_dashboard" || new_page == "doctor_dashboard"){
    if(user_data['type'] == "patient"){
      new_page = 'patient_dashboard';
    }else if(user_data['type'] == "doctor"){
      new_page = 'doctor_dashboard';
    }
  }

  if(new_page == "terms_and_contitions"){
    $(".token_no").text(Math.floor((Math.random() * 100000) + 100));
    $(".patient_name").text(user_data['name']);

    window.location.replace("#");

    //$(".app_page, .blog-single").scrollTop($(".app_page, .blog-single")[0].scrollHeight);
    $(".terms_and_contitions_text").hide();
    setTimeout(function(){
      $(".terms_and_contitions_text").slideDown();
    },500);
  }

  $(".app_page").hide();
  $(".app_page[page='"+new_page+"']").show();
}

var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("backbutton", go_back, false);
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');


        var base_url  = "http://portalhomecare.bizsolpk.com/app/?";
        var user_data = [];
        var chat_id   = null;
        var chat_name = null;
        var recent_chat_time = 0;

        //booking
        var book_doc_id      = null;

        var quick_replies_title = ['Away','Thank You','Waiting','Driving'];
        var quick_replies_text  = ['I am currently unavailable','Thank you so much :)','I am waiting for your reply','Can not talk, I am driving'];

        var current_pid = null;

        $(document).ready(function(){



          $(document).keyup(function(e){
              if(e.key == "Backspace"){
                //go_back();
              }
          });

          $(".app_page[page='splash']").show();

          $(".chat_here").height($(document).height()-152);

          $( window ).resize(function() {
            $(".chat_here").height($(document).height()-152);
          });

          setTimeout(function(){
            $(".app_page[page='splash'] img").animate({
              opacity: 1,
            }, 1000, function() {
              if(window.localStorage.getItem("active_settion") == null){
                $(".auth_buttons").fadeIn();
              }else{
                user_login();
              }
            });
          },500);

          $(".signin_form").submit(function(e){
            e.preventDefault();
            var signin_username = $('.signin_username').val();
            var signin_password = $('.signin_password').val();

            $.ajax({
            	url:   base_url,
            	data: {
            		action:   "signin",
                phone:    signin_username,
                password: signin_password,
            	},
            	type: 'GET',
            	dataType: 'html',
            	beforeSend: function(xhr){
                swal({text: "Please wait...", icon: "images/custom/load.gif",button:false,});
            	},
            	success: function(response){
                var response = $.parseJSON(response);
                console.log(response,"response");
                if(response.success == true){
                  swal({icon: "success", text: "Welcome "+response.name+" !", button:false, timer:3000});
                  window.localStorage.setItem("active_settion",JSON.stringify(response).toString());
                  user_login();
                }else{
                  swal({icon: "warning", text: response.msg, dangerMode: true, button:false, timer: 3000});
                }
            	}, error:function(){
                swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
            	}
            });
          });

          $(".signup_form").submit(function(e){
            e.preventDefault();
            var signup_username = $('.signup_username').val();
            var signup_phone    = $('.signup_phone').val();

            if(signup_username.length == 0){
              swal({text:"Username is required!", icon: "warning",dangerMode: true,button:false,});
            }else if(signup_phone.length == 0){
              swal({text:"Phone is required!", icon: "warning",dangerMode: true,button:false,});
            }else{
              $.ajax({
              	url:   base_url,
              	data: {
              		action:   "signup",
                  name: signup_username,
                  phone:    signup_phone,
                  type: "patient",
              	},
              	type: 'GET',
              	dataType: 'html',
              	beforeSend: function(xhr){
                  swal({text:"Creating your new account..",icon: "images/custom/load.gif",button:false,});
              	},
              	success: function(response){
                  var response = $.parseJSON(response);
                  console.log(response,"response");
                  if(response.success == true){
                    swal({icon: "success", title: response.title, text: response.msg, button:false, timer:3000});
                    user_data['token'] = response.token;
                    $(".verificaton_help").text(response.msg);
                    $.get(response.url,function(){
                      swal({icon: "info", text: "SMS Sent!", button:false, timer:3000});
                    });
                    change_page("sms_verification");
                  }else{
                    swal({icon: "warning", text: response.msg, dangerMode: true, button:false, timer: 3000});
                    user_data = [];
                  }
              	}, error:function(){
                  swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
              	}
              });
            }
          });

          $(".verification_form").submit(function(e){
            e.preventDefault();
            var verification_code = $('.verification_code').val();

            if(verification_code.length != 6){
              swal({text:"Verification code should contain 6 digits!", icon: "warning",dangerMode: true,button:false,});
            }else{
              $.ajax({
                url:   base_url,
                data: {
                  action:   "sms_verify",
                  otp: verification_code,
                  token:    user_data['token'],
                },
                type: 'GET',
                dataType: 'html',
                beforeSend: function(xhr){
                  swal({text:"Verifying code ..",icon: "images/custom/load.gif",button:false,});
                },
                success: function(response){
                  var response = $.parseJSON(response);
                  console.log(response,"response");
                  if(response.success == true){
                    swal({icon: "success", text: response.msg, button:false, timer:3000});
                    user_data['token'] = response.token;
                    change_page("set_password");
                  }else{
                    swal({icon: "warning", text: response.msg, dangerMode: true, button:false, timer: 3000});
                  }
                }, error:function(){
                  swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
                }
              });
            }
          });

          $(".forgot_form").submit(function(e){
            e.preventDefault();
            var forgot_phone = $('.forgot_phone').val();

            $.ajax({
            	url:   base_url,
            	data: {
            		action:   "forget",
                phone: forgot_phone,
                type: "patient",
            	},
            	type: 'GET',
            	dataType: 'html',
            	beforeSend: function(xhr){
                swal({icon: "images/custom/load.gif",button:false,});
            	},
            	success: function(response){
                var response = $.parseJSON(response);
                console.log(response,"response");
                if(response.success == true){
                  swal({icon: "success", text: response.msg, button:false, timer:3000});
                  user_data['token'] = response.token;
                  $(".verificaton_help").text(response.msg);
                  $.get(response.url,function(){
                    swal({icon: "info", text: "SMS Sent!", button:false, timer:3000});
                  });
                  change_page("sms_verification");
                }else{
                  swal({icon: "warning", text: response.msg, dangerMode: true, button:false, timer: 3000});
                }
            	}, error:function(){
                swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
            	}
            });
          });

          $(".set_password_form").submit(function(e){
            e.preventDefault();
            var new_password  = $('.new_password').val();
            var re_password   = $('.re_password').val();
            if(new_password.length > 0){
              if(new_password == re_password){
                $.ajax({
                	url:   base_url,
                	data: {
                		action:   "set_password",
                    password: new_password,
                    type: "patient",
                    token: user_data['token'],
                	},
                	type: 'GET',
                	dataType: 'html',
                	beforeSend: function(xhr){
                    swal({icon: "images/custom/load.gif",button:false,});
                	},
                	success: function(response){
                    var response = $.parseJSON(response);
                    console.log(response,"response");
                    if(response.success == true){
                      swal({icon: "success", text: response.msg, button:false, timer:3000});
                      user_data['token'] = response.token;
                      change_page("signin");
                    }else{
                      swal({icon: "warning", text: response.msg, dangerMode: true, button:false, timer: 3000});
                    }
                	}, error:function(){
                    swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
                	}
                });
              }else{
                swal({text:"Password did not matched!", icon: "warning",dangerMode: true,button:false,});
              }
            }else{
              swal({text:"Please enter new password!", icon: "warning",dangerMode: true,button:false,});
            }
          });

          $(".goto_splash").click(function(){
            change_page("splash");
          });

          $(".goto_signup").click(function(){
            change_page("signup");
          });

          $(".goto_home").click(function(){
            user_data = $.parseJSON(window.localStorage.getItem("active_settion"));
            $(".app_page").hide();
            if(user_data['type'] == "patient"){
              $(".app_page[page='patient_dashboard']").fadeIn(1000);
            }else if(user_data['type'] == "doctor"){
              $(".app_page[page='doctor_dashboard']").fadeIn(1000);
            }
            $(".navbar-bottom .col").removeClass("col-active");
            $(".navbar-bottom .goto_home").addClass("col-active");
          });

          $(".btn_back").click(function(){

          });

          $(".goto_forgot").click(function(){
            change_page("forgot");
          });

          $(".goto_signin").click(function(){
            change_page("signin");
          });

          $(".get_services").click(function(){
            $.ajax({
            	url:   base_url,
            	data: {
            		action:  "speciality",
                search:  "",
                token:   user_data['token'],
                type:   "2",
            	},
            	type: 'GET',
            	dataType: 'html',
            	beforeSend: function(xhr){
                swal({icon: "images/custom/load.gif",button:false,});
            	},
            	success: function(response){
                var response = $.parseJSON(response);
                console.log(response,"response");
                if(response.success == true){
                  swal.close();
                  change_page("services");

                  $(".services_count").html('<div class="col s12">'+response.count+' Services</div>');
                  $(".services_here").empty();

                  $(response.data).each(function(i,e){
                    $(".services_here").append('<div class="col s4">'+
                      '<div s_id="'+(e.SpecialityID)+'" class="contents get_doctors">'+
                        '<i class="fa fa-user-md"></i>'+
                        '<h4></h4>'+
                        '<p>'+(e.Name)+'</p>'+
                      '</div>'+
                    '</div>');

                    if((i+1)%3 == 0){
                      $(".services_here").append('<div class="col s12"></div>');
                    }
                    //console.log((i+1)%3);
                  });
                }else{
                  swal({icon: "warning", text: response.msg, dangerMode: true,button:false, timer: 3000});
                }
            	}, error:function(){
                swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
            	}
            });
          });

          $(".get_specialities").click(function(){
            $.ajax({
            	url:   base_url,
            	data: {
            		action:  "speciality",
                search:  "",
                token:   user_data['token'],
                type:   "1",
            	},
            	type: 'GET',
            	dataType: 'html',
            	beforeSend: function(xhr){
                swal({icon: "images/custom/load.gif",button:false,});
            	},
            	success: function(response){
                var response = $.parseJSON(response);
                console.log(response,"response");
                if(response.success == true){
                  swal.close();
                  change_page("specialities");

                  $(".speciality_count").html('<div class="col s12">'+response.count+' Specialities</div>');
                  $(".speciality_here").empty();

                  $(response.data).each(function(i,e){
                    $(".speciality_here").append('<div class="col s4">'+
                      '<div s_id="'+(e.SpecialityID)+'" class="contents get_doctors">'+
                        '<i class="fa fa-user-md"></i>'+
                        '<h4></h4>'+
                        '<p>'+(e.Name)+'</p>'+
                      '</div>'+
                    '</div>');
                    /*
                    if((i+1)%3 == 1){
                      $(".speciality_here").append('<div class="col s12"></div>');
                    }*/
                    //console.log((i+1)%3);
                  });
                }else{
                  swal({icon: "warning", text: response.msg, dangerMode: true,button:false, timer: 3000});
                }
            	}, error:function(){
                swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
            	}
            });
          });

          $(document).delegate(".get_doctors","click",function(){
            var s_id = $(this).attr("s_id");

            $.ajax({
            	url:   base_url,
            	data: {
            		action:  "doctors",
                s_id:    s_id,
                search:  "",
                token:   user_data['token'],
            	},
            	type: 'GET',
            	dataType: 'html',
            	beforeSend: function(xhr){
                swal({icon: "images/custom/load.gif",button:false,});
            	},
            	success: function(response){
                var response = $.parseJSON(response);
                console.log(response,"response");
                if(response.success == true){
                  swal.close();
                  change_page("doctors");
                  $(".doctor_count").html('<div class="col s12">'+response.count+' Doctor(s)</div>');
                  $(".doctors_here").empty();
                  $(response.data).each(function(i,e){
                    $(".doctors_here").append('<div d_name="'+(e.DoctorName)+'" d_spec="'+(e.Speciality)+'" d_id="'+(e.DoctorID)+'" class="contents get_schedule">'+
            					'<div class="list-img">'+
            						'<img class="doc_avatar" src="images/custom/doc_avatar.jpg" alt="">'+
            					'</div>'+
            					'<div class="list-text">'+
            						'<h6>'+(e.DoctorName)+' <span class="pull-right">'+(e.Consultingfee)+'</span></h6>'+
            						'<p>Speciality: '+(e.Speciality)+' <button type="button" class="pull-right button z-depth-1">Book Now</button></p>'+
            					'</div>'+
            				'</div>');
                    //e.Sharing
                    //e.OtherFee
                    //e.UserID
                    //e.isActive
                    //e.rank_out_of_10
                  });
                }else{
                  swal({icon: "warning", text: response.msg, dangerMode: true,button:false, timer: 3000});
                }
            	}, error:function(){
                swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
            	}
            });
          });

          $(document).delegate(".schedule_here .col","click",function(){
            if($(this).hasClass("col-active")){
              $(this).removeClass("col-active");
            }else{
              $(this).addClass("col-active");
              $(".app_date_time").text($(this).text());
            }
          });


          $(".booking_date").change(function(){
            $(".app_date_show").text($(this).val());
          });



          $(document).delegate(".pricing .col","click",function(){
            $(".pricing .col-active").removeClass("col-active");
            $(this).addClass("col-active");
          });



          $(document).delegate(".get_schedule","click",function(){

            var doc_id = $(this).attr("d_id");
            book_doc_id = doc_id;

            var d_name = $(this).attr("d_name");
            var d_spec = $(this).attr("d_spec");

            $(".booking_doc").html(d_name+"<br /><small>"+d_spec+"</small>");

            $.ajax({
            	url:   base_url,
            	data: {
            		action:  "doctor_schedule",
                doc_id:  doc_id,
                token:   user_data['token'],
            	},
            	type: 'GET',
            	dataType: 'html',
            	beforeSend: function(xhr){
                swal({icon: "images/custom/load.gif",button:false,});
            	},
            	success: function(response){
                var response = $.parseJSON(response);
                console.log(response,"response");
                if(response.success == true){
                  swal.close();
                  change_page("schedule");
                  $(response.data).each(function(i,e){
                    $(".schedule_here").append('<div id="'+(e.schedule_id)+'" class="col s4">'+
                      '<div class="contents text-center">'+
                        '<h4 class="text-center">'+(e.day)+' '+(e.time)+'</h4>'+
                        '<p class="text-center">'+(e.shift)+'</p>'+
                      '</div>'+
                    '</div>');

                    //day": "Mon",
                    //shift": "Morning",
                    //time": "10:00"

                  });
                }else{
                  swal({icon: "warning", text: response.msg, dangerMode: true, button:false, timer: 3000});
                }
            	}, error:function(){
                swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
            	}
            });
          });

          $(".appointment_form").submit(function(e){
            e.preventDefault();

            var date_time        = $(".booking_date").val();
            var time_slots       = $(".schedule_here .col-active").length;
            var total_pricings   = $(".pricing .col-active").length;
            var price            = +$(".pricing .col-active").attr("price");


            if(total_pricings == 0){
              swal({icon: "warning", text: "Select a pricing!", dangerMode: true, button:false, timer: 3000});
            }else if(time_slots == 0){
              swal({icon: "warning", text: "Time slot is required!", dangerMode: true, button:false, timer: 3000});
            }else if(date_time == ""){
              swal({icon: "warning", text: "Appointment date is required!", dangerMode: true, button:false, timer: 3000});
            }else if(time_slots != price){
              swal({icon: "info", title:"Select "+price+" time slot(s)", text: "You have selected "+time_slots+" time slot(s) but you have selected price for "+price+" time slot(s).", dangerMode: true, button:false,});
            }else{
              $(".schedule_here .col-active").each(function(i,e){
                  if(i == 0){ //only one
                    var book_schedule_id = $(this).attr("id");

                    $.ajax({
                      url:   base_url,
                      data: {
                        action:  "doctor_availability",
                        doc_id:  book_doc_id,
                        date : date_time, //"11-Nov-2019",
                        schedule_id : book_schedule_id,
                        token:   user_data['token'],
                        reason: $(".booking_reason").val(),
                      },
                      type: 'GET',
                      dataType: 'html',
                      beforeSend: function(xhr){
                        swal({icon: "images/custom/load.gif",button:false,});
                      },
                      success: function(response){
                        var response = $.parseJSON(response);
                        console.log(response,"response");
                        if(response.success == true && response.avilablible == true){
                          swal.close();
                          change_page("terms_and_contitions");
                        }else{
                          swal({icon: "warning", text: response.msg, dangerMode: true, button:false, timer: 3000});
                        }
                      }, error:function(){
                        swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
                      }
                    });

                  }

              });
            }

          });

          $(".goto_booking").click(function(){
            change_page("schedule");
          });

          $(".accept_and_book").click(function(){

            $(".schedule_here .col-active").each(function(i,e){
                if(i == 0){ //only one
                  var book_schedule_id = $(this).attr("id");

                  $.ajax({
                  	url:   base_url,
                  	data: {
                  		action:  "book_appointment", //doctor_availability
                      doc_id:  book_doc_id,
                      date : $(".booking_date").val(), //"11-Nov-2019",
                      schedule_id : book_schedule_id,
                      token:   user_data['token'],
                      reason: $(".booking_reason").val(),
                  	},
                  	type: 'GET',
                  	dataType: 'html',
                  	beforeSend: function(xhr){
                      swal({icon: "images/custom/load.gif",button:false,});
                  	},
                  	success: function(response){
                      var response = $.parseJSON(response);
                      console.log(response,"response");
                      if(response.success == true && response.avilablible == true){
                        swal({icon: "success", text: response.msg, button:false, timer: 3000}).then((value) => {
                          $(".get_appointments").click();
                        });
                      }else{
                        swal({icon: "warning", text: response.msg, dangerMode: true, button:false, timer: 3000});
                      }
                  	}, error:function(){
                      swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
                  	}
                  });

                }

            });




          });

          function get_appointments(){

            if(user_data['type'] == "doctor"){
              var url_param = "doc_id="+user_data['UserID'];
            }else if(user_data['type'] == "patient"){
              var url_param = "token="+user_data['token'];
            }

            $.ajax({
              	url:   base_url+url_param,
              	data: {
              		action:  "show_appointment",
              	},
              	type: 'GET',
              	dataType: 'html',
              	beforeSend: function(xhr){
                  swal({icon: "images/custom/load.gif",button:false,});
              	},
              	success: function(response){
                  var response = $.parseJSON(response);
                  console.log(response,"response");
                  if(response.success == true){
                    swal.close();

                    $(".appointments_here, .appointments_filter").empty();

                    $(".app_count").html((response.data).length);

                    $(response.data).each(function(i,e){
                      $(".appointments_here").append('<div a_id="'+(e.id)+'" class="contents">'+
              					'<div class="list-text">'+
              						'<h6>'+(e.doctor_name+' - '+e.doctor_speciality)+'</h6>'+
              						'<p>'+(e.reason)+'</p>'+
                          '<p><i class="fa fa-calendar"></i> '+(e.date+' '+e.time)+'</p>'+
                          '<p>'+
                          '<button id="'+(e.id)+'" type="button" class="pull-left button z-depth-1 get_appointment_detail"><i class="fa fa-eye"></i> View</button>'+
                          '<button id="'+(e.id)+'" type="button" class="pull-right button z-depth-1 set_appointment_reminder"><i class="fa fa-bell"></i> Reminer</button>'+

                          '</p>'+
                        '</div>'+
              				'</div>');

                      $(".appointments_filter").append('<div a_id="'+(e.id)+'" class="contents">'+
              					'<div class="list-text">'+
              						'<h6>'+(e.doctor_name+' - '+e.doctor_speciality)+'</h6>'+
              						'<p>'+(e.reason)+'</p>'+
                          '<p><i class="fa fa-calendar"></i> '+(e.date+' '+e.time)+'</p>'+
                        '</div>'+
              				'</div>');



                      if(user_data['type'] == "patient"){
                        chat_id   = e.doc_id;
                        chat_name = e.doctor_name;
                      }else if(user_data['type'] == "doctor"){
                        chat_id   = e.pat_id;
                        chat_name = e.patient_name;
                      }
                      //


                      if(user_data['type'] == "patient"){
                        $(".appointment_up_next_box .appointment_with").text(e.doctor_name+' - '+e.doctor_speciality);
                      }else{
                        $(".appointment_up_next_box .appointment_with").text(e.patient_name);
                      }
                      $(".appointment_up_next_box .appointment_when").html('<i class="fa fa-calendar"></i> '+e.date+' '+e.time);
                      setTimeout(function(){
                        $(".appointment_up_next_box").slideDown(1000);
                      },250);
                    });
                  }else{
                    swal({icon: "warning", text: response.msg, dangerMode: true,button:false, timer: 3000});
                  }
              	}, error:function(){
                  swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
              	}
              });
          }

          $(".get_appointments").click(function(){
            $(".navbar-bottom .col").removeClass("col-active");
            $(".navbar-bottom .get_appointments").addClass("col-active");

            change_page("appointments");

            get_appointments();
          });


          $(document).delegate(".get_appointment_detail","click",function(){
            change_page("appointment_details");
            var id = $(this).attr("id");

            $.ajax({
            	url:   base_url,
            	data: {
            		action:  "get_appointment_detail",
                id:  id,
                token:   user_data['token'],
            	},
            	type: 'GET',
            	dataType: 'html',
            	beforeSend: function(xhr){
                swal({icon: "images/custom/load.gif",button:false,});
            	},
            	success: function(response){
                var response = $.parseJSON(response);
                console.log(response,"response");
                if(response.success == true){
                  swal.close();

                  $(response.data).each(function(i,e){
                    $(".app_doctor_name").text(e.doctor_name);
                    $(".app_doctor_speciality").text(e.doctor_speciality);
                    $(".app_patient_name").text(e.patient_name);
                    $(".app_date").text(e.date);
                    $(".app_time").text(e.time);
                    $(".app_reason").text(e.reason);

                    if(user_data['type'] == "patient"){
                      chat_id   = e.doc_id;
                      chat_name = e.doctor_name;
                    }else if(user_data['type'] == "doctor"){
                      chat_id   = e.pat_id;
                      chat_name = e.patient_name;
                    }

                    //for examination
                   $(".btn_patient_examination").attr("p_id",e.pat_id);

                    /*
                    id: "9394",
                    doctor_name: "Dr. Sabir Hussain",
                    patient_name: "Amir Bukhari",
                    doctor_speciality: "Cancer",
                    date: "2019-11-11",
                    time: "10:00",
                    reason: "Hdjdjr",
                    doc_id: "1",
                    pat_id: "1"
                    */

                  });


                }else{
                  swal({icon: "warning", text: response.msg, dangerMode: true,button:false, timer: 3000});
                }
            	}, error:function(){
                swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
            	}
            });
          });

          $(".appointment_cancel").click(function(){
            swal({
              title: "Are you sure?",
              text: "Are you sure you want to cancel this appointment?",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            })
            .then((yes) => {
              if (yes) {
                swal({icon: "success", text: "Appointment cancelled!", dangerMode: true,button:false, timer: 3000});
              } else {
                swal.close();
              }
            });

          });
          $(".appointment_reschedule").click(function(){
            swal({icon: "images/custom/load.gif",button:false,});
          });

          function show_msgs(chat_id){
            $.ajax({
              url:   base_url,
              data: {
                action:  "show_msg",
                my_chat:  user_data['UserID'],
                with:     chat_id,
                date_time:recent_chat_time,
              },
              type: 'GET',
              dataType: 'html',
              beforeSend: function(xhr){
                swal({icon: "images/custom/load.gif",button:false,});
              },
              success: function(response){
                var response = $.parseJSON(response);
                console.log(response,"response");
                swal.close();
                $(".chat_here").empty();

                var old_date = null;

                $.each(response.data, function(i, e) {

                  if(e.msg == "" || e.msg == "undefined"){

                  }else{
                    if(e.from_id == user_data['UserID']){
                      bubble_class = "my_msg";
                    }else{
                      bubble_class = "there_msg";
                    }

                    if(old_date != e.date){
                      $(".chat_here").append("<p class='date_seperator'>"+(e.date)+"</p>");
                      old_date = e.date;
                    }

                    $(".chat_here").append("<p class='"+bubble_class+"'>"+(e.msg)+"<br/><span class='pull-right msg_date'>"+(e.time)+"</span></p>");
                  }


                });

                $(".chat_here").scrollTop($(".chat_here")[0].scrollHeight);


                /*msg: "Test",
                from_id: "1",
                to_id: "1"*/

              }, error:function(){
                swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
              }
            });
          }
          $(".appointment_chat").click(function(){
            change_page("chat");

            $(".chat_with").html(chat_name);

            patient_examination(chat_id);
            show_msgs(chat_id);


          });

          $(".btn_attach").click(function(){
            $(".chat_attachments").click();
          });

          $(".chat_attachments").change(function(){
            swal({text:"Upload feature is coming soon!", icon: "info",dangerMode: true,button:false,});

            $(".chat_attachments")[0].reset();
          });

          $(".appointment_examination").click(function(){

          });

          $(".chat_form").submit(function(e){
            e.preventDefault();

            var msg = $(".chat_message").val();

            if(msg.length > 0){
              $.ajax({
                url:   base_url,
                data: {
                  action:  "send_msg",
                  from_id:  user_data['UserID'],
                  to_id:    chat_id,
                  date_time:recent_chat_time,
                  msg : msg,
                  msg_type: "text",
                },
                type: 'GET',
                dataType: 'html',
                beforeSend: function(xhr){
                  $(".chat_here").append("<p class='my_msg'>"+msg+"<br/><span class='pull-right msg_date'>just now</span></p>");
                  $(".chat_here").scrollTop($(".chat_here")[0].scrollHeight);
                },
                success: function(response){
                  var response = $.parseJSON(response);
                  console.log(response,"response");



                  $(".chat_message").val("");

                }, error:function(){
                  swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
                }
              });
            }


          });

          $(document).delegate(".set_appointment_reminder","click",function(){
            var id = $(this).attr("id");
            swal({icon: "success", text: "Reminder Set!", dangerMode: true,button:false, timer: 3000});
          });

          $(".get_profile").click(function(){
            if(user_data['type'] == "patient"){

            $(".navbar-bottom .col").removeClass("col-active");
            $(".navbar-bottom .get_profile").addClass("col-active");

            change_page("profile");

            $.ajax({
              url:   base_url,
              data: {
                action:  "profile",
                token:   user_data['token'],
              },
              type: 'GET',
              dataType: 'html',
              beforeSend: function(xhr){
                swal({icon: "images/custom/load.gif",button:false,});
              },
              success: function(response){
                var response = $.parseJSON(response);
                console.log(response,"response");
                if(response.success == true){
                  swal.close();
                  $.each(response.data, function(i, array) {
                    $.each(array, function(key, value) {
                      $(".profile_form input[name='"+(key)+"']").val(value);

                      if(key == "name"){
                        $(".login_name").text(value);
                      }



                    });
                  });
                }else{
                  swal({icon: "warning", text: response.msg, dangerMode: true,button:false, timer: 3000});
                }
              }, error:function(){
                swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
              }
            });
          }else{
            swal({icon: "warning", text: "Can not get your profile data!", dangerMode: true,button:false, timer: 3000});
          }
          });

          $(".profile_form").submit(function(e){
            e.preventDefault();

            $.ajax({
              url:   base_url+$(".profile_form").serialize(),
              data: {
                action:  "profile_update",
                token:   user_data['token'],
              },
              type: 'GET',
              dataType: 'html',
              beforeSend: function(xhr){
                swal({icon: "images/custom/load.gif",button:false,});
              },
              success: function(response){
                var response = $.parseJSON(response);
                console.log(response,"response");
                if(response.success == true){
                  swal({icon: "success",button:false, timer: 3000});
                }else{
                  swal({icon: "warning", text: response.msg, dangerMode: true,button:false, timer: 3000});
                }
              }, error:function(){
                swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
              }
            });
          });




          function user_login(){
            user_data = $.parseJSON(window.localStorage.getItem("active_settion"));

            console.log(user_data['token']);
            console.log(user_data['UserID']);
            console.log(user_data['type']);
            console.log(user_data['name']);

            $(".login_name").text(user_data['name']);

            setTimeout(function(){
              $(".navbar-bottom").slideDown();
            },500);

            $(".app_page").hide();
            if(user_data['type'] == "patient"){
              $(".app_page[page='patient_dashboard']").fadeIn(1000);
              $(".btn_patient_examination, .btn_patient_doc").hide();
              //$(".profile_nav_bar").show();
            }else if(user_data['type'] == "doctor"){
              $(".app_page[page='doctor_dashboard']").fadeIn(1000);
              $(".btn_patient_examination, .btn_patient_doc").show();
              //$(".profile_nav_bar").hide();
            }

            get_appointments();


          }

          $(".btn_logout").click(function(){
            swal({
              title: "Are you sure?",
              text: "Are you sure you want to logout?",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            })
            .then((logout) => {
              if (logout) {
                window.localStorage.clear();
                window.location.reload();
              } else {
                swal.close();
              }
            });



          });

          $(".navbar-bottom .col").click(function(){
              $(".navbar-bottom .col").removeClass("col-active");
              $(this).addClass("col-active");
          });

          $(".chat_more").click(function(){
            change_page("chat_more");
          });

          $(".back_to").click(function(){
            var page = $(this).attr("page");

            change_page(page);
          });

          $(quick_replies_title).each(function(key,value){
            $(".quick_replies").append("<div class='contents'>"+
              "<div class='list-text send_quick_reply' key='"+key+"'>"+
                "<h6>"+quick_replies_title[key]+"</h6>"+
                "<p>"+quick_replies_text[key]+"</p>"+
              "</div>"+
            "</div>");
          });

          $(document).delegate(".send_quick_reply","click",function(){
            var key = $(this).attr("key");
            var msg = quick_replies_text[key];

            $(".chat_message").val(msg);

            $(".chat_form").submit();

            change_page("chat");
          });

          $(".appointments_filter").click(function(){
            swal({text:"Filter chat by appointment feature is coming soon!", icon: "info",dangerMode: true,button:false,});
            change_page("chat");
          });

          function patient_examination(p_id){
            $.ajax({
            	url:   base_url,
            	data: {
            		action:   "show_examination",
                p_id:     p_id,
                d_id:     user_data['UserID'],
            	},
            	type: 'GET',
            	dataType: 'html',
            	beforeSend: function(xhr){
                swal({text: "Please wait...", icon: "images/custom/load.gif",button:false,});
            	},
            	success: function(response){
                var response = $.parseJSON(response);
                console.log(response,"response");

                swal.close();

                $(".patient_examination[name='data2']").val(response.data.data2);
                $(".patient_examination[name='data3']").val(response.data.data3);
                $(".patient_examination[name='data4']").val(response.data.data4);
                $(".patient_examination[name='data5']").val(response.data.data5);
                $(".patient_examination[name='data6_1']").val(response.data.data6[0]);
                $(".patient_examination[name='data6_2']").val(response.data.data6[1]);
                $(".patient_examination[name='data6_3']").val(response.data.data6[2]);
                $(".patient_examination[name='data6_4']").val(response.data.data6[3]);
                $(".patient_examination[name='data6_5']").val(response.data.data6[4]);
                $(".patient_examination[name='data6_6']").val(response.data.data6[5]);
                $(".patient_examination[name='data7_1']").val(response.data.data7[0]);
                $(".patient_examination[name='data7_2']").val(response.data.data7[1]);
                $(".patient_examination[name='data7_3']").val(response.data.data7[2]);
                $(".patient_examination[name='data7_4']").val(response.data.data7[3]);
                $(".patient_examination[name='data7_5']").val(response.data.data7[4]);
                $(".patient_examination[name='data7_6']").val(response.data.data7[5]);
                $(".patient_examination[name='data8']").val(response.data.data8);
                $(".patient_examination[name='data9']").val(response.data.data9);
                $(".patient_examination[name='data10']").val(response.data.data10);
                $(".patient_examination[name='data11_1']").val(response.data.data11[0]);
                $(".patient_examination[name='data11_2']").val(response.data.data11[1]);
                $(".patient_examination[name='data11_3']").val(response.data.data11[2]);
                $(".patient_examination[name='data11_4']").val(response.data.data11[3]);
                $(".patient_examination[name='data11_5']").val(response.data.data11[4]);
                $(".patient_examination[name='data11_6']").val(response.data.data11[5]);

            	}, error:function(){
                swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
            	}
            });
          }

          $(".btn_patient_examination").click(function(){
            change_page("patient_examination");

            var p_id = $(this).attr("p_id");
            current_pid = p_id;

            patient_examination(p_id);
            show_msgs(p_id);
          });

          $(".btn_patient_doc, .get_documents").click(function(){
            change_page("patient_documents");
          });


          $(".examination_form").submit(function(e){
            e.preventDefault();
            var examination_form = $(".examination_form").serialize();


            $.ajax({
            	url:   base_url,
            	data: {
            		action:   "save_examination",
                p_id:     current_pid,
                d_id:     user_data['UserID'],
                data2:    $(".patient_examination[name='data2']").val(),
                data3:    $(".patient_examination[name='data3']").val(),
                data4:    $(".patient_examination[name='data4']").val(),
                data5:    $(".patient_examination[name='data5']").val(),
                data6:    $(".patient_examination[name='data6_1']").val()+","+$(".patient_examination[name='data6_2']").val()+","+$(".patient_examination[name='data6_3']").val()+","+$(".patient_examination[name='data6_4']").val()+","+$(".patient_examination[name='data6_5']").val()+","+$(".patient_examination[name='data6_6']").val()+",",
                data7:    $(".patient_examination[name='data7_1']").val()+","+$(".patient_examination[name='data7_2']").val()+","+$(".patient_examination[name='data7_3']").val()+","+$(".patient_examination[name='data7_4']").val()+","+$(".patient_examination[name='data7_5']").val()+","+$(".patient_examination[name='data7_6']").val()+",",
                data8:    $(".patient_examination[name='data8']").val(),
                data9:    $(".patient_examination[name='data9']").val(),
                data10:    $(".patient_examination[name='data10']").val(),
                data11:    $(".patient_examination[name='data11_1']").val()+","+$(".patient_examination[name='data11_2']").val()+","+$(".patient_examination[name='data11_3']").val()+","+$(".patient_examination[name='data11_4']").val()+","+$(".patient_examination[name='data11_5']").val()+","+$(".patient_examination[name='data11_6']").val()+",",
              },
            	type: 'GET',
            	dataType: 'html',
            	beforeSend: function(xhr){
                swal({text: "Please wait...", icon: "images/custom/load.gif",button:false,});
            	},
            	success: function(response){
                var response = $.parseJSON(response);
                console.log(response,"response");
                swal({text:"Saved", icon: "success",dangerMode: true,button:false,});
            	}, error:function(){
                swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
            	}
            });

          });

        });


    },
    receivedEvent: function(id) {
    }
};
app.initialize();
