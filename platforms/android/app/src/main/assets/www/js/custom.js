function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

//onDeviceReady();

function onDeviceReady() {


  // verify grant for multiple permissions
  var Permission = window.plugins.Permission;
  var permissions =
		['android.permission.RECORD_AUDIO',
    'android.permission.ACCESS_NETWORK_STATE',
		'android.permission.READ_PHONE_STATE',
		'android.permission.READ_EXTERNAL_STORAGE',
		'android.permission.WRITE_EXTERNAL_STORAGE',
    'android.permission.CAMERA',];
  Permission.request(permissions, function(results) {

  }, alert);


  /*
  cordova.plugins.CordovaCall.setIcon('logo');
  cordova.plugins.CordovaCall.setAppName('Home Care Appointment - 10 AM');
  cordova.plugins.CordovaCall.setVideo(true);
  cordova.plugins.CordovaCall.receiveCall('Dr. Sabir Hussain');

  cordova.plugins.CordovaCall.sendCall('Dr. Sabir Hussain');
  setTimeout(function(){
    cordova.plugins.CordovaCall.connectCall();
  }, 5000);
  */

  document.addEventListener('backbutton', function (evt) {
    evt.preventDefault();
    go_back();
  }, false);

  try{
    var objCanvas = document.getElementById('canvas');
    window.plugin.CanvasCamera.initialize(objCanvas);
  }catch(e){}

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
    }else if(current_page == "invoices"){
      change_page("patient_dashboard");
    }else if(current_page == "specialities"){
      change_page("patient_dashboard");
    }else if(current_page == "doctors"){
      change_page("patient_dashboard");
    }else if(current_page == "search_patient"){
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
    }else if(current_page == "chat_more" ){
      change_page("chat");
    }else if(current_page == "video_call" ){
      change_page("chat");
    }else if(current_page == "profile"){
      change_page("patient_dashboard");
    }else if(current_page == "update_profile"){
      change_page("profile");
    }else if(current_page == "patient_examination"){
      change_page("chat");
    }else if(current_page == "new_document"){
      change_page("patient_documents");
    }else if(current_page == "chart"){
      change_page("appointment_details");
    }else{
      //ignore
    }
  }
  function change_page(new_page){

    if(new_page == "signin" || new_page == "signup"){
      $(".auth_buttons").hide();

      $(".app_page").hide();
      $(".app_page[page='"+new_page+"']").show();
      //return false;
    }else if(new_page == "splash"){
      $(".auth_buttons").fadeIn();

      $(".app_page").hide();
      $(".app_page[page='"+new_page+"']").show();
      //return false;
    }else if(new_page == "chat"){
      setTimeout(function(){
        $(".chat_here").scrollTop($(".chat_here")[0].scrollHeight);
      },100);

      setTimeout(function(){
        $(".chat_here").height($(window).height()-155);
      },250);
    }else if(new_page == "appointments"){
      $(".navbar-bottom .col").removeClass("col-active");
      $(".navbar-bottom .get_appointments").addClass("col-active");
    }else if(new_page == "profile"){
      $(".navbar-bottom .col").removeClass("col-active");
      $(".navbar-bottom .get_profile").addClass("col-active");
    }else if(new_page == "patient_dashboard" || new_page == "doctor_dashboard"){
      if(user_data['type'] == "patient"){
        new_page = 'patient_dashboard';
      }else if(user_data['type'] == "doctor"){
        new_page = 'doctor_dashboard';
      }
      $(".navbar-bottom .col").removeClass("col-active");
      $(".navbar-bottom .goto_home").addClass("col-active");
    }else if(new_page == "terms_and_contitions"){
      $(".token_no").text(Math.floor((Math.random() * 100000) + 100));
      $(".patient_name").text(user_data['name']);
      window.location.replace("#");
      //$(".app_page, .blog-single").scrollTop($(".app_page, .blog-single")[0].scrollHeight);
      $(".terms_and_contitions_text").hide();
      setTimeout(function(){
        $(".terms_and_contitions_text").slideDown();
      },500);
    }else if(new_page == "search_patient"){

    }

    if(new_page == "chat" || new_page == "patient_examination" || new_page == "video"){
      setTimeout(function(){
        $(".chat_here").scrollTop($(".chat_here")[0].scrollHeight);
      },100);
    }

    //navbar
    if(new_page == "chat" || new_page == "patient_examination" || new_page == "video"){
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

    if(new_page == "video"){

      $(".calling_text").fadeIn();
      $(".dialing").fadeIn();
      $("canvas").hide();

      $(".app_calling").html("Calling");

      $(".dialing").fadeIn();
      setTimeout(function(){
        $(".app_calling").html("Creating secure connection with ");
      },5000);
      setTimeout(function(){
        $(".app_calling").html("Receiving Credentials of ");
      },10000);
      setTimeout(function(){
        $(".app_calling").html("Connecting to ");

        $(".calling_text").hide();
        $(".dialing").hide();
        $("canvas").slideDown();

        var options = {
            cameraFacing: 'front',
            width: $(window).height(),
            height: $(window).width(),
            canvas: {
              width: $(window).height(),
              height: $(window).width(),
            },
            capture: {
              width: $(window).height(),
              height: $(window).width(),
            },
        };
        try{
          window.plugin.CanvasCamera.start(options);
        }catch(e){}
      },15000);
      setTimeout(function(){
        swal({text:chat_name+" is offline !", icon: "info",button:false,});
        $(".app_calling").html("Can not connect with ");

      },30000);



    }

    //transition
    $(".app_page").hide();
    $(".app_page[page='"+new_page+"']").show();

    $(".drag-target").click();

  }

  var base_url          = "https://pahs.com.pk/app/?";
  var document_folder   = "https://pahs.com.pk/doc_uploads/";
  var user_data = [];
  var chat_id_pat   = null; //cache
  var chat_id_doc   = null;
  var chat_name = null;
  var chart_csrf = null;
  var last_msg_id = 0;

  var chatting_with = null;

  //booking
  var book_doc_id      = null;

  var quick_replies_title = ['Away','Thank You','Waiting','Driving'];
  var quick_replies_text  = ['I am currently unavailable','Thank you so much :)','I am waiting for your reply','Can not talk, I am driving'];

  var current_pid = null;

  //using
  var current_appointment_id  = null;
  var current_pat_master_id   = null;

  var new_doc_path = null;

  var profile_complete = true;


  $(document).ready(function(){



    $(document).keyup(function(e){
        if(e.key == "Backspace"){
          //go_back();
        }
    });

    $(".app_page[page='splash']").show();


    $( window ).resize(function() {
      setTimeout(function(){
        $(".chat_here").height($(window).height()-155);
        $(".app_page[page='video']").height($(window).height());
      },250);
    });

    $(".app_page[page='video']").height($(window).height());

    setTimeout(function(){
      $(".app_page[page='splash'] img").animate({
        opacity: 1,
      }, 1000, function() {
        if(window.localStorage.getItem("active_settion") == null ||
      window.localStorage.getItem("active_settion") == "null"){
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
          //console.log(response,"response");
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
            //console.log(response,"response");
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
            //console.log(response,"response");
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
          //console.log(response,"response");
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
              //console.log(response,"response");
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

    $(".dial_call").click(function(){
      change_page("video_call");
    });



    $(".new_document").click(function(){
      change_page("new_document");
      $(".document_preview").attr("src","").hide();
    });

    $(".goto_signup").click(function(){
      change_page("signup");
    });

    $(".goto_home").click(function(){
      if(profile_complete == true){
        user_data = $.parseJSON(window.localStorage.getItem("active_settion"));
        $(".app_page").hide();
        if(user_data['type'] == "patient"){
          $(".app_page[page='patient_dashboard']").fadeIn(1000);
        }else if(user_data['type'] == "doctor"){
          $(".app_page[page='doctor_dashboard']").fadeIn(1000);
        }
        $(".navbar-bottom .col").removeClass("col-active");
        $(".navbar-bottom .goto_home").addClass("col-active");
      }else{
          swal({
            title: "Please Complete Profile",
            text: "Please fill all required fields in profile.",
            icon: "warning",
          })
      }
    });

    $(".btn_back").click(function(){

    });

    $(".goto_forgot").click(function(){
      change_page("forgot");
    });

    $(".goto_signin").click(function(){
      change_page("signin");
    });

    function get_services(search){
      $.ajax({
      	url:   base_url,
      	data: {
      		action:  "speciality",
          search:  search,
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
          //console.log(response,"response");
          if(response.success == true){
            try{swal.close();}catch(e){}
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
              ////console.log((i+1)%3);
            });
          }else{
            swal({icon: "warning", text: response.msg, dangerMode: true,button:false, timer: 3000});
          }
      	}, error:function(){
          swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
      	}
      });
    }

    //yahan
    function get_patients(search){
      $.ajax({
      	url:   base_url,
      	data: {
      		action:  "patient",
          search:  search,
          doc_id:   user_data['UserID'],
      	},
      	type: 'GET',
      	dataType: 'html',
      	beforeSend: function(xhr){
          swal({icon: "images/custom/load.gif",button:false,});
      	},
      	success: function(response){
          var response = $.parseJSON(response);
          //console.log(response,"response");
          if(response.success == true){
            try{swal.close();}catch(e){}

            $(".patient_count").html('<div class="col s12">'+response.count+' Result(s)</div>');
            $(".patient_here").empty();

            $(response.data).each(function(i,e){
              $(".patient_here").append('<div class="col s4">'+
                '<div s_id="'+(e.mrn)+'" class="contents">'+
                  '<i class="fa fa-user"></i>'+
                  '<h4></h4>'+
                  '<p>'+(e.name)+'</p>'+
                '</div>'+
              '</div>');

              if((i+1)%3 == 0){
                $(".patient_here").append('<div class="col s12"></div>');
              }
              ////console.log((i+1)%3);
            });
          }else{
            swal({icon: "warning", text: response.msg, dangerMode: true,button:false, timer: 3000});
          }
      	}, error:function(){
          swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
      	}
      });
    }

    $(".get_services").click(function(){
      get_services("");
      $(".services_search").val("");
    });

    var wait_a_bit;
    $(".services_search").keyup(function(){
      try{clearTimeout(wait_a_bit)}catch(e){}
      var search = $(this).val();
      wait_a_bit = setTimeout(function(){
        get_services(search);
      },500);
    });

    var wait_a_bit;
    $(".patient_search").keyup(function(){
      try{clearTimeout(wait_a_bit)}catch(e){}
      var search = $(this).val();
      wait_a_bit = setTimeout(function(){
        get_patients(search);
      },500);
    });


    function get_specialities(search){
      $.ajax({
      	url:   base_url,
      	data: {
      		action:  "speciality",
          search:  search,
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
          //console.log(response,"response");
          if(response.success == true){
            try{swal.close();}catch(e){}
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

              ////console.log((i+1)%3);
            });
          }else{
            swal({icon: "warning", text: response.msg, dangerMode: true,button:false, timer: 3000});
          }
      	}, error:function(){
          swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
      	}
      });
    }

    $(".get_specialities").click(function(){
      get_specialities("");
      $(".specialities_search").val("");
    });

    var wait_a_bit;
    $(".specialities_search").keyup(function(){
      try{clearTimeout(wait_a_bit)}catch(e){}
      var search = $(this).val();
      wait_a_bit = setTimeout(function(){
        get_specialities(search);
      },500);
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
          //console.log(response,"response");
          if(response.success == true){
            try{swal.close();}catch(e){}
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
      						'<p>'+(e.Speciality)+' <button type="button" class="pull-right button z-depth-1">Book Now</button></p>'+
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

    $(".booking_date").attr("min",new Date().getFullYear() + "-" +  parseInt(new Date().getMonth() + 1 ) + "-" + new Date().getDate());

    $(".booking_date").change(function(){
      $(".app_date_show").text($(this).val());
    });



    $(document).delegate(".pricing .col","click",function(){
      $(".pricing .col-active").removeClass("col-active");
      $(this).addClass("col-active");
      var price = $(this).find("h4").text();
      $(".appointment_price").text(price);
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
          //console.log(response,"response");
          if(response.success == true){
            try{swal.close();}catch(e){}
            change_page("schedule");

            $(".schedule_here").empty();
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
                  //console.log(response,"response");
                  if(response.success == true && response.avilablible == true){
                    try{swal.close();}catch(e){}
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

    function calculate_bsa(){
      var height = $("input[name='height']").val() || 0;
      var weight = $("input[name='weight']").val() || 0;
      var bsa    = Math.sqrt(((weight*height)/3600)).toFixed(3);
      $("input[name='bsa']").val(bsa);
    }

    $("input[name='height'], input[name='weight']").keyup(function(){
        calculate_bsa();
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
                //console.log(response,"response");
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
            //swal({icon: "images/custom/load.gif",button:false,});
        	},
        	success: function(response){
            var response = $.parseJSON(response);
            //console.log(response,"response");
            if(response.success == true){
              try{swal.close();}catch(e){}

              $(".appointments_here, .appointments_filter").empty();

              $(".app_count").html((response.data).length);

              $(response.data).each(function(i,e){
                var remind_btn = "";
                var color_class = "";
                var sms_notification = "";


                if(user_data['type'] == "patient"){
                  var display_name = e.doctor_name+' - '+e.doctor_speciality;
                }else{ //doctor
                  if(e.patient_name == null || e.patient_name == "null"){
                    var display_name = "<kbd>No Name</kbd>"+' - (M'+e.PID+')';
                  }else{
                    var display_name = e.patient_name+' - (M'+e.PID+')';
                  }



                  if(e.status == "NEW"){
                    sms_notification = '<button id="'+(e.id)+'" type="button" class="pull-right button button-black send_sms"><i class="fa fa-envelope"></i> SMS</button>';
                  }

                }

                if(display_name == null){
                  display_name = "";
                }


                if(e.status == "NEW"){
                  remind_btn = '<button id="'+(e.id)+'" type="button" class="pull-right button z-depth-1 set_appointment_reminder"><i class="fa fa-bell"></i> Reminer</button>';
                  color_class = "text-success";
                }else{
                  color_class = "text-danger";
                }



                $(".appointments_here").append('<div a_id="'+(e.id)+'" class="contents">'+
        					'<div class="list-text">'+
                    '<h5>ID: '+(e.id)+'</h5>'+
        						'<h6>'+(display_name)+'</h6>'+
        						'<p>'+(e.reason)+'</p>'+
                    '<p class="'+color_class+'"><i class="fa fa-calendar"></i> '+(e.date+' '+e.time)+'</p>'+
                    '<p>'+
                    '<button id="'+(e.id)+'" type="button" class="pull-left button z-depth-1 get_appointment_detail"><i class="fa fa-eye"></i> View</button>'+
                    remind_btn+
                    sms_notification+
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

                chat_id_doc   = e.doc_id;
                chat_id_pat   = e.PID;

                if(user_data['type'] == "patient"){
                  chat_name = e.doctor_name;
                }else if(user_data['type'] == "doctor"){
                  chat_name = e.patient_name;
                }

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
              //swal({icon: "warning", text: response.msg, dangerMode: true,button:false, timer: 3000});
            }
        	}, error:function(){
            swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
        	}
        });
    }
    $(".get_appointments").click(function(){
      if(profile_complete == true){
        $(".navbar-bottom .col").removeClass("col-active");
        $(".navbar-bottom .get_appointments").addClass("col-active");

        change_page("appointments");

        get_appointments();
      }else{
          swal({
            title: "Please Complete Profile",
            text: "Please fill all required fields in profile.",
            icon: "warning",
          })
      }
    });


    function get_invoices(){

      $.ajax({
        	url:   base_url,
        	data: {
        		action:  "get_invoices",
            token: user_data['token']
        	},
        	type: 'GET',
        	dataType: 'html',
        	beforeSend: function(xhr){
            swal({icon: "images/custom/load.gif",button:false,});
        	},
        	success: function(response){
            swal.close();

            var response = $.parseJSON(response);
            //console.log(response,"response");
            if(response.success == true){
              try{swal.close();}catch(e){}

              $(".invoices_here, .invoices_here_filter").empty();

              $(".invoices_here_count").html((response.data).length);

              $(response.data).each(function(i,e){

                //e.billId
                //e.ReservationID
                //e.Payment_Status
                //e.Payment_Token
                //e.Net_Amount
                //e.UserID
                //e.PatientName
                //e.DoctorName
                //e.Token_No
                //e.Day
                //e.Date


                $(".invoices_here").append('<div id="'+(e.id)+'" class="get_appointment_detail contents">'+
        					'<div class="list-text">'+
        						'<h6>'+(e.DoctorName)+' '+(e.Date)+'</h6>'+
        						'<p><i class="fa fa-money"></i> Rs. '+(e.Net_Amount)+'</p>'+
                    '<p><i class="fa fa-check"></i> '+(e.Payment_Status)+'</p>'+
                  '</div>'+
        				'</div>');


              });
            }else{
              //swal({icon: "warning", text: response.msg, dangerMode: true,button:false, timer: 3000});
            }
        	}, error:function(){
            swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
        	}
        });
    }
    $(".get_invoices").click(function(){
      change_page("invoices");
      get_invoices();
    });


    $(document).delegate(".get_appointment_detail","click",function(){
      change_page("appointment_details");
      var id = $(this).attr("id");

      current_appointment_id = id;

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
          //console.log(response,"response");
          if(response.success == true){
            try{swal.close();}catch(e){}

            $(response.data).each(function(i,e){
              $(".app_doctor_name").text(e.doctor_name);
              $(".app_doctor_speciality").text(e.doctor_speciality);
              $(".app_patient_name").text(e.patient_name);
              $(".app_date").text(e.date);
              $(".app_time").text(e.time);
              $(".app_reason").text(e.reason);



              current_pat_master_id = e.PID; //for documents

              chat_id_doc   = e.doc_id;
              chat_id_pat   = e.PID;

              if(user_data['type'] == "patient"){
                chat_name = e.doctor_name;
              }else if(user_data['type'] == "doctor"){
                chat_name = e.patient_name;
                chart_csrf = e.CSRFToken;
              }
              //for examination
              $(".btn_patient_examination").attr("p_id",e.pat_id);
            });


          }else{
            swal({icon: "warning", text: response.msg, dangerMode: true,button:false, timer: 3000});
          }
      	}, error:function(){
          swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
      	}
      });

      /*
      $.ajax({
					   url: base_url+"custom_order.php",
					   type: "POST",
					   data:  new FormData(this),
					   contentType: false,
					   cache: false,
					   processData:false,
					   beforeSend : function(){
							 swal({
 								title: 'Please wait..',
 								text: "We're sending you order",
 								buttons: false,
 								html: true
 							});
					   },
					   success: function(data){
							 //console.log(data);

							 $("input[name='image[]'], textarea[name='contact_comment']").val("");

			 					swal({
			 						title: "Order Sent!",
			 						text: "Thank you for your order!",
			 						icon: "success",
			 						timer: 3000,
			 						buttons: false,
			 					});
					   },
					   error: function(e){

					   }
					 });
      */
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
          try{swal.close();}catch(e){}
        }
      });

    });
    $(".appointment_reschedule").click(function(){
      swal({icon: "images/custom/load.gif",button:false,});
    });

    function show_msgs(){
      $.ajax({
        url:   base_url,
        data: {
          action      : "show_msg",
          chat_id_doc : chat_id_doc,
          chat_id_pat : chat_id_pat,
          sender      : user_data['type'],
          last_msg_id : last_msg_id,
        },
        type: 'GET',
        dataType: 'html',
        beforeSend: function(xhr){
          //swal({icon: "images/custom/load.gif",button:false,});
        },
        success: function(response){
          var response = $.parseJSON(response);
          //console.log(response,"response");
          try{swal.close();}catch(e){}

          var old_date = null;
          $.each(response.data, function(i, e) {
            if(e.msg == "" || e.msg == "undefined"){
            }else{

              /*
              id: "1",
              msg: "I am DOC",
              date: "2019-08-07",
              time: " 03:08:57",
              doc_id: "1",
              pat_id: "17252",
              senderid: "17252"
              */

              if(user_data['type'] == "patient"){
                if(e.senderid == e.pat_id){
                  bubble_class = "my_msg";
                }else{
                  bubble_class = "there_msg";
                }
              }else if(user_data['type'] == "doctor"){
                if(e.senderid == e.doc_id){
                  bubble_class = "my_msg";
                }else{
                  bubble_class = "there_msg";
                }
              }

              if(old_date != e.date){
                //$(".chat_here").append("<p class='date_seperator'>"+(e.date)+"</p>");
                old_date = e.date;
              }

              $(".temp_msg").remove();

              var already_exists = $(".chat_here #"+e.id).length;
              if(already_exists == 0){
                $(".chat_here").append("<p id='"+e.id+"' class='"+bubble_class+"'>"+(e.msg)+"<br/><span class='pull-right msg_date'>"+(e.date+" "+e.time)+"</span></p>");
              }

              /*
              if(e.from_id == user_data['UserID']){
                if(recent_chat_time == 0){

                  $(".chat_here").append("<p class='"+bubble_class+"'>"+(e.msg)+"<br/><span class='pull-right msg_date'>"+(e.time)+"</span></p>");
                }
              }else{
                if(old_date != e.date){
                  $(".chat_here").append("<p class='date_seperator'>"+(e.date)+"</p>");
                  old_date = e.date;
                }
                $(".chat_here").append("<p class='"+bubble_class+"'>"+(e.msg)+"<br/><span class='pull-right msg_date'>"+(e.time)+"</span></p>");
              }
              */

            }
          });

          if((response.data).length > 0){
            $(".chat_here").scrollTop($(".chat_here")[0].scrollHeight);
          }else{
            //console.log((response.data).length);
          }

          last_msg_id = response.last_msg_id;


          setTimeout(function(){
            show_msgs();
          },2000);

        }, error:function(){
          swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
        }
      });
    }
    $(".appointment_chat").click(function(){



      //if(chatting_with != chat_id){
        //recent_chat_time = 0;
        //$(".chat_here").empty();
        //chatting_with = chat_id;
      //}

      change_page("chat");
      $(".chat_with").html(chat_name);
      patient_examination(chat_id_pat);

      show_msgs();

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

      if(user_data['type'] == "patient"){
        var recipientid = chat_id_doc;
        var senderid    = chat_id_pat;
      }else if(user_data['type'] == "doctor"){
        var recipientid = chat_id_pat;
        var senderid    = chat_id_doc;
      }

      if(msg.length > 0){

        $.ajax({
          url:   base_url,
          data: {
            action:         "send_msg",
            senderid:       senderid,
            recipientid:    recipientid,
            sender:         user_data['type'],
            msg :           msg,
            appointment_id: current_appointment_id,
          },
          type: 'GET',
          dataType: 'html',
          beforeSend: function(xhr){
            $(".chat_message").val("");
            $(".chat_here").append("<p class='temp_msg my_msg'>"+msg+"<br/><span class='pull-right msg_date'>just now</span></p>");
            $(".chat_here").scrollTop($(".chat_here")[0].scrollHeight);
          },
          success: function(response){
            var response = $.parseJSON(response);
            //console.log(response,"response");



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

      var date = new Date();

      cordova.plugins.notification.local.schedule({
          id: 1,
          title: "Reminder set successfully!",
          message: "You will get a notification like this.",
          foreground: true
      });


    });

    $(document).delegate(".send_sms","click",function(){
      var id = $(this).attr("id");

      $.ajax({
        url:   base_url,
        data: {
          action:  "send_sms",
          app_id:   id,
        },
        type: 'GET',
        dataType: 'html',
        beforeSend: function(xhr){
          swal({icon: "images/custom/load.gif",button:false,});
        },
        success: function(response){
          var response = $.parseJSON(response);


          if(response.success == true){
            try{swal.close();}catch(e){}
            var url = response.url;
            $.get(url,function(){

            });
          }
        }, error:function(){
          swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
        }
      });



      //Dear Patient xxxxxxx Your appointment with XXXXX will be started in few minutes, please login to APP. Thanks. PAHC TEAM
    });


    function fetch_profile(token,chart){
      $.ajax({
        url:   base_url,
        data: {
          action:  "profile",
          token:   token,
        },
        type: 'GET',
        dataType: 'html',
        beforeSend: function(xhr){
          //swal({icon: "images/custom/load.gif",button:false,});
        },
        success: function(response){
          var response = $.parseJSON(response);
          //console.log(response,"response");
          if(response.success == true){

            profile_complete = true;


            //try{swal.close();}catch(e){}

            if(chart == false){
              $(".profile_required").children("i").removeClass("fa-exclamation-triangle attention").addClass("fa-user");
              try{
                if(response.msg_title || response.msg_text){
                  swal({title:response.msg_title, text:response.msg_text, icon:"info",button: false}).then(function(e){
                    $(".navbar-bottom .col").removeClass("col-active");
                    $(".navbar-bottom .get_profile").addClass("col-active");

                    change_page("profile");
                  });
                  $(".profile_required").children("i").removeClass("fa-user").addClass("fa-exclamation-triangle attention");
                  profile_complete = false;
                }
              }catch(e){}
            }

            $.each(response.data, function(i, array) {
              $.each(array, function(key, value) {
                if(chart == false){
                  $(".profile_form input[name='"+(key)+"']").val(value);
                  $(".profile_form select[name='"+(key)+"']").val(value);

                  if(key == "name"){
                    $(".login_name").text(value);
                  }

                  if(key == "dob"){
                    $(".profile_form input[name='"+(key)+"']").val(value.split(" ")[0]);
                  }
                }else{
                  $(".chart").children("input."+key).val(value);
                }

              });
            });
          }else{
            if(chart == false){
              swal({icon: "warning", text: response.msg, dangerMode: true,button:false, timer: 3000});
            }
          }
        }, error:function(){
          swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
        }
      });
    }

    $(".get_profile").click(function(){
      if(user_data['type'] == "patient"){

      $(".navbar-bottom .col").removeClass("col-active");
      $(".navbar-bottom .get_profile").addClass("col-active");

      change_page("profile");
      fetch_profile(user_data['token'],false);
    }else{
      swal({icon: "info", text: "You can use our Web Panel to update your profile!", dangerMode: false,button:true});
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
          //console.log(response,"response");
          if(response.success == true){
            swal({icon: "success",button:false, timer: 3000});
            $(".profile_required").children("i").removeClass("fa-exclamation-triangle attention").addClass("fa-user");
            fetch_profile(user_data['token'],false);
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

      //console.log(user_data['token']);
      //console.log(user_data['UserID']);
      //console.log(user_data['type']);
      //console.log(user_data['name']);

      $(".login_name").text(user_data['name']);

      setTimeout(function(){
        $(".navbar-bottom").slideDown();
      },500);

      $(".app_page").hide();
      if(user_data['type'] == "patient"){
        $(".app_page[page='patient_dashboard']").fadeIn(1000);
        $(".btn_patient_examination, .btn_patient_doc, .btn_chart").hide();
        $(".get_invoices").show();

        //Patient
  			$(".join__btn[value='98682']").click(); //leema

        setInterval(function(){
          $(".j-user[data-id='98686']").click();
        },1000);
        // alert("Patient");
      }else if(user_data['type'] == "doctor"){
        $(".app_page[page='doctor_dashboard']").fadeIn(1000);
        $(".btn_patient_examination, .btn_patient_doc, .btn_chart").show();
        //$(".profile_nav_bar").hide();

        $(".search_patient").show();

        //Doctor
  			$(".join__btn[value='98686']").click(); //axis
        // alert("Doctor");
        setInterval(function(){
          $(".j-user[data-id='98682']").click();
        },1000);
      }

      get_appointments();

      if(user_data['type'] == "patient"){
        setTimeout(function(){
          fetch_profile(user_data['token'],false);
        },1000);
      }

      //get docs from cache

      /*
      var my_docs = localStorage.getItem("documents_"+user_data['token']);
      if(my_docs != null){
        my_docs = $.parseJSON(my_docs);
        $(my_docs).each(function(i,path){
          $(".documents_here").append('<div class="col s6">'+
           '<div class="contents">'+
             '<a href="'+path+'" data-lightbox="portfolio">'+
               '<img class="my_document" src="'+path+'" alt="">'+
             '</a>'+
           '</div>'+
         '</div>');
        })
      }
      */


      /*
      Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);

      function isAvailableSuccess(result) {
        //console.log("Fingerprint is available");

        Fingerprint.show({
          clientId: "Fingerprint-Demo",
          clientSecret: "password" //Only necessary for Android
        }, successCallback, errorCallback);

        function successCallback(){
          swal({text:"Authentication Successful!", icon: "success",dangerMode: false,button:false,timer:2000,});

        }
        function errorCallback(err){
          //alert("Authentication invalid " + err);
        }
      }
      function isAvailableError(message) {
        //console.log(message);
      }
      */



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
          window.localStorage.setItem("active_settion",null);
          window.location.reload();
        } else {
          try{swal.close();}catch(e){}
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

    $(".search_patient").click(function(){
      change_page("search_patient");
    });





    $(".chat_message").focus(function(){
      //$(".navbar-bottom").hide();
    });

    $(".chat_message").blur(function(){
      //$(".navbar-bottom").show();
    });

    $(".back_to").click(function(){
      if(profile_complete == true){
        var page = $(this).attr("page");
        change_page(page);
      }else{
          swal({
            title: "Please Complete Profile",
            text: "Please fill all required fields in profile.",
            icon: "warning",
          })
      }
    });


    //yahan
    $(".initialize_call").click(function(){

      $(".initialize_call").find("i").removeClass("fa-video-camera").addClass("fa-circle-o-notch fa-spin");

      setTimeout(function(){
        $(".initialize_call").find("i").removeClass("fa-circle-o-notch fa-spin").addClass("fa-check");
        var join_call_msg = "Your appointment is just started now";
        var call_id       = "AppointmentNo-"+current_appointment_id;
        join_call_msg     += "<a class='initialization_link button button-1' href='https://appr.tc/r/"+(call_id)+"'>Join Call</a>";
        $(".chat_message").val(join_call_msg);
        $(".chat_form").submit();
      },1000);

      setTimeout(function(){
        $(".initialize_call").find("i").removeClass("fa-check").addClass("fa-video-camera");
      },2000);

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
          //console.log(response,"response");

          try{swal.close();}catch(e){}

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

          $(".patient_examination[name='data12']").val(response.data.data12);
          $(".patient_examination[name='data13']").val(response.data.data13);

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

      show_msgs();

    });

    $(".btn_patient_doc, .get_documents").click(function(){
      change_page("patient_documents");
      $.ajax({
      	url:   base_url,
      	data:{
      		action:  "show_doc",
          p_id:     current_pat_master_id,
          app_id:   current_appointment_id,
      	},
      	type: 'GET',
      	dataType: 'html',
      	beforeSend: function(xhr){
          swal({icon: "images/custom/load.gif",button:false,});
          $(".documents_here").empty();
      	},
      	success: function(response){
          var response = $.parseJSON(response);
          //console.log(response,"response");
          if(response.success == true){
            try{swal.close();}catch(e){}

            var ClearLine = 0;

            $(response.data).each(function(i,e){
              ClearLine++;

              /*
              "DOCID": "14530",
              "PID": "3052",
              "DocDateTime": "2019-06-01 23:12:25.373",
              "DocFullPath": "3052-POC-1-6-2019-23-12-.png",
              "DocImage": null,
              "category": "Pathology",
              "TitleName": "POC",
              "ReservationID": "9386",
              */
              var DocFullPath = document_folder+(e.DocFullPath);

              $(".documents_here").append('<div class="col s6">'+
               '<div class="contents">'+
                 '<a href="'+(DocFullPath)+'" data-lightbox="portfolio">'+
                   '<img class="my_document" src="'+(DocFullPath)+'" alt="">'+
                 '</a>'+
               '</div>'+
             '</div>');

             if(ClearLine == 2){
              $(".documents_here").append("<div class='col s12'></div>");
               ClearLine = 0;
             }

            });
          }else{
            swal({icon: "warning", text: response.msg, dangerMode: true,button:false, timer: 3000});
          }
      	}, error:function(){
          swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
      	}
      });

    });

    $(".btn_chart").click(function(){
      fetch_profile(chart_csrf);
      change_page("chart");
    });

    $(".attach_document").click(function(){
       //console.log("todo");
    });

    $(".capture_document").click(function(){
      navigator.camera.getPicture(function onSuccess(imageURI) {
        $(".document_preview").attr("src",imageURI).fadeIn();
        new_doc_path = imageURI;
      }, function onFail(message) {
        swal({title: "Failed Because:", text: message, icon:"warning", button:false,});
      },{
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI
     });


    });

    $(".document_form").submit(function(e){
        e.preventDefault();
        path = $(".document_preview").attr("src");

        var old_docs = localStorage.getItem("documents_"+user_data['token']);
        var new_docs = [];
        if(old_docs == null){
          new_docs.push(path);
        }else{
          new_docs = $.parseJSON(old_docs);
          new_docs.push(path);
        }
        new_docs = JSON.stringify(new_docs);
        localStorage.setItem("documents_"+user_data['token'],new_docs);

        //localStorage.setItem("user_"+user_data['UserID']+"documents");

        $(".documents_here").append('<div class="col s6">'+
         '<div class="contents">'+
           '<a href="'+path+'" data-lightbox="portfolio">'+
             '<img class="my_document" src="'+path+'" alt="">'+
           '</a>'+
         '</div>'+
       '</div>');


       swal({text: "Please wait...", icon: "images/custom/load.gif",button:false,});

       try{
         var options = new FileUploadOptions();
         options.fileKey = "file";
         options.fileName = new_doc_path.substr(new_doc_path.lastIndexOf('/') + 1);
         options.mimeType = "image/jpeg";
         //console.log(options.fileName);
         var params = new Object();
         params.action = "upload";
         options.params = params;
         options.chunkedMode = false;
         var ft = new FileTransfer();
         ft.upload(new_doc_path, base_url, function(result){

           //var path = "https://pahs.com.pk/doc_uploads/"+result.response;
           var path = result.response;

           $.ajax({
           	url:   base_url,
           	data: {
           		 action:   "add_doc",
               p_id:     current_pat_master_id,
               path:     path,
               title:    $(".new_doc_title").val(),
               category: $(".new_doc_category").val(),
               app_id:   current_appointment_id,
             },
           	type: 'GET',
           	dataType: 'html',
           	beforeSend: function(xhr){
               swal({text: "Please wait...", icon: "images/custom/load.gif",button:false,});
           	},
           	success: function(response){
               var response = $.parseJSON(response);
               //console.log(response,"response");

               if(response.success == true){
                 swal({text:"Document Uploaded!", icon: "success",dangerMode: false,button:false,timer:2000,});
                 change_page("patient_documents");
               }else{
                 swal({text:"Please try later!", icon: "warning",dangerMode: false,button:false,timer:2000,});
               }

           	}, error:function(){
               swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
           	}
           });

         }, function(error){
           swal({text: JSON.stringify(error),icon:"warning", button:false,});
         }, options);
       }catch(e){
         console.log("Document not uploaded");
       }
    })


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
          data12:    $(".patient_examination[name='data12']").val(),
          data13:    $(".patient_examination[name='data13']").val(),

        },
      	type: 'GET',
      	dataType: 'html',
      	beforeSend: function(xhr){
          swal({text: "Please wait...", icon: "images/custom/load.gif",button:false,});
      	},
      	success: function(response){
          var response = $.parseJSON(response);
          //console.log(response,"response");
          swal({text:"Saved", icon: "success",dangerMode: true,button:false,});
      	}, error:function(){
          swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
      	}
      });

    });


    $(".share_report").click(function(){

      $.ajax({
      	url:   base_url,
      	data: {
      		action:   "share_examination",
          p_id:     current_pid,
          type:   "complete",
          d_id:     user_data['UserID'],
        },
      	type: 'GET',
      	dataType: 'html',
      	beforeSend: function(xhr){
          swal({text: "Please wait...", icon: "images/custom/load.gif",button:false,});
      	},
      	success: function(response){
          var response = $.parseJSON(response);
          //console.log(response,"response");
          swal({text:"Report shared with patient", icon: "success",dangerMode: true,button:false,});
      	}, error:function(){
          swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
      	}
      });
    });

    $(".share_report_limited").click(function(){

      $.ajax({
      	url:   base_url,
      	data: {
          action:   "share_examination",
          type:   "limited",
          p_id:     current_pid,
          d_id:     user_data['UserID'],
        },
      	type: 'GET',
      	dataType: 'html',
      	beforeSend: function(xhr){
          swal({text: "Please wait...", icon: "images/custom/load.gif",button:false,});
      	},
      	success: function(response){
          var response = $.parseJSON(response);
          //console.log(response,"response");
          swal({text:"Report shared with patient", icon: "success",dangerMode: true,button:false,});
      	}, error:function(){
          swal({text:"Can not connect to internet!", icon: "warning",dangerMode: true,button:false,});
      	}
      });
    });

  });


}
