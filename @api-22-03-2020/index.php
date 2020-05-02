<?php
    header("Access-Control-Allow-Origin: *");

    error_reporting(0);
    require("connection/config.php");

    $action = $_REQUEST['action'];
    $arr    = array();

    if($action == "signup" || $action == "set_password" || $action == "forget"){

        //signup
        $type     = $_GET['type'];
        $name     = $_GET['name'];
        $phone    = $_GET['phone'];
        $token    = $_GET['token'];
        $password = $_GET['password'];

        if($type == "patient"){
            if($action == "signup"){


                $row = sql($conn, "select count(*) FROM Users where PhoneNo = ? and isActive = ?", array($phone,"1"), "rows");
                if($row[0][0] > 0){
                    $arr['success'] = false;
                    $arr['msg']   = "Phone $phone already exists, please try another phone number!";
                }else{

                    $code = rand(1,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9);
                    $msg = "$code is the verification code.";
                    //$url = "http://bsms.telecard.com.pk/SMSPortal/Customer/ProcessSMS.aspx?userid=adamjee&pwd=adamjee123&msg=$msg&mobileno=$phone";
                    //$url = "http://developer.zeddevelopers.com/hamza/twilio/twilloSMS/?request=allow_me&n=$phone&m=$msg";
                    $url = "https://pahs.com.pk/app/sms.php?number=$phone&message=$msg&mask=PAHCS";

                    $CSRFToken = md5(uniqid(rand(), true)).md5(uniqid(rand(), true));

                    $unverified_exists = sql($conn, "select count(*) FROM Users where PhoneNo = ? and isActive = ?", array($phone,"0"), "rows");
                    if($unverified_exists[0][0] == 0){
                        $row = sql($conn, "insert into Users (UserName,PhoneNo,LoginID,isActive,CSRFToken,SIMserial,ServiceID) values (?,?,?,?,?,?,?)",
                        array($name,$phone,$phone,"0",$CSRFToken,$code,"1"), "rows");

                        $UserID = $conn->lastInsertId();

                        sql($conn, "insert into PatientMaster (UserID) values (?)", array($UserID), "rows");

                        $PatientID = "M".$conn->lastInsertId();

                        sql($conn, "update PatientMaster set PatientID = ? where UserID = ?", array($PatientID,$UserID), "rows");
                    }else{
                        $row = sql($conn, "update Users set CSRFToken = ?, SIMserial = ? where PhoneNo = ?", array($CSRFToken,$code,$phone), "rows");
                    }

                    $arr['success'] = true;
                    $arr['url']     = $url;
                    $arr['token']   = $CSRFToken;

                    $arr['title']   = "Welcome, $name!";
                    $arr['msg']     = "We have sent you an SMS on $phone with a 6-Digit verification code (OTP) [$code].";

                }
            }else if($action == "set_password"){
                $row = sql($conn, "select count(*) FROM Users where CSRFToken = ? ", array($token), "rows");
                if($row[0][0] == 0){
                    $arr['success'] = false;
                    $arr['msg']     = "Invalid request, no account is linked with that request";
                }else{
                    $row = sql($conn, "update Users set Password = ? where CSRFToken = ?", array($password,$token), "rows");
                    $arr['success'] = true;
                    $arr['token']   = $token;
                    $arr['msg']     = "Password set successfully!";
                }
            }else if($action == "forget"){
                $row = sql($conn, "select count(*) FROM Users where PhoneNo = ? ", array($phone), "rows");
                if($row[0][0] == 0){
                    $arr['success'] = false;
                    $arr['msg']     = "Invalid request, no account is linked with that request";
                }else{
                    $row = sql($conn, "select * from Users where PhoneNo = ?", array($phone), "rows");


                    $code = rand(1,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9);
                    $msg = "$code is the verification code.";
                    //$url = "http://bsms.telecard.com.pk/SMSPortal/Customer/ProcessSMS.aspx?userid=adamjee&pwd=adamjee123&msg=$msg&mobileno=$phone";
                    //$url = "http://developer.zeddevelopers.com/hamza/twilio/twilloSMS/?request=allow_me&n=$phone&m=$msg";
                    $url = "https://pahs.com.pk/app/sms.php?number=$phone&message=$msg&mask=PAHCS";

                    sql($conn, "update Users set SIMserial = ? where PhoneNo = ?", array($code,$phone), "rows");

                    $arr['success'] = true;
                    $arr['url']     = $url;
                    $arr['token']   = $row[0]['CSRFToken'];

                    $arr['msg']     = "We have sent you an SMS on $phone with a 6-Digit verification code (OTP) [$code].";

                }

            }
        }else if($type == "doctor"){
            $arr['success'] = false;
            $arr['msg']   = "Doctor registration is currently unavailable!";
        }else if($type == "service"){
            $arr['success'] = false;
            $arr['msg']   = "Service registration is currently unavailable!";
        }else{
            $arr['success'] = false;
            $arr['msg']   = "Invalid user type. Please select patient, doctor or service!";
        }
    }
    else if($action == "sms_verify"){
        $token      = $_GET['token'];
        $otp        = $_GET['otp'];

        //echo "select count(*) FROM Users where CSRFToken = '$token' and SimSerial = '$otp'"  ;

        $row = sql($conn, "select count(*) FROM Users where CSRFToken = ? and SimSerial = ?", array($token,$otp), "rows");
        if($row[0][0] > 0){
            $arr['success'] = true;
            $arr['msg']     = "Phone number verified!";
            $arr['token']   = $token;
            $row = sql($conn, "update Users set isActive = ? where CSRFToken = ?", array("1",$token), "rows");

        }else{
            $arr['success'] = false;
            $arr['msg']   = "Invalid OTP Code";
        }
    }
    else if($action == "signin"){
        $phone      = $_GET['phone'];
        $password   = $_GET['password'];

        $row = sql($conn, "select count(*) FROM Users where (PhoneNo = ? or LoginID = ?) and Password = ? ", array($phone,$phone,$password), "rows");
        if($row[0][0] == 0){
            $arr['success'] = false;
            $arr['msg']     = "Invalid login credentials!";
        }else{
            $row = sql($conn, "select * from Users where (PhoneNo = ? or LoginID = ?)", array($phone,$phone), "rows");
            $arr['success'] = true;
            $arr['token']   = $row[0]['CSRFToken'];
            $arr['UserID']  = $row[0]['UserID'];

            if($arr['UserID'] == "2"){
                $arr['UserID']  = 1;
                $arr['type']    = "doctor";
            }else{
                $arr['type'] = "patient";
            }

            $arr['name']    = $row[0]["UserName"];
        }
    }
    else if($action == "speciality"){
        $search = $_GET['search'];
        $token  = $_GET['token'];
        $type   = $_GET['type'];

        if(strlen($search) > 0){
            $row = sql($conn, "select * from TblSpeciality where type = ? and Name like ?", array($type,"%".$search."%"), "rows");
        }else{
            $row = sql($conn, "select * from TblSpeciality where type = ?", array($type,), "rows");
        }

        if(strlen($token) == 0){
            $arr['success'] = false;
            $arr['msg']     = "Missing token in request!";
        }else{
            if(count($row) > 0){
                $arr['success'] = true;
                $arr['count']   = count($row);
                $arr['data']    = $row;
            }else{
                $arr['success'] = false;
                $arr['count']   = count($row);
                $arr['msg']     = "Sorry, no specialities found!";
            }
        }

    }
    else if($action == "doctors"){
        $search = $_GET['search'];
        $s_id   = $_GET['s_id'];
        $token  = $_GET['token'];

        if(strlen($s_id) > 0){
            //$row = sql($conn, "select * from Doctors where SpecialityID = ?", array($s_id), "rows");
            $row = sql($conn, "select * from Doctors where SpecialityID = ?", array($s_id), "rows");
        }else if(strlen($search) > 0){
            $row = sql($conn, "select * from Doctors where DoctorName like ?", array("%".$search."%"), "rows");
        }else{
            //$row = sql($conn, "select * from Doctors", array(), "rows");
        }

        if(strlen($token) == 0){
            $arr['success'] = false;
            $arr['msg']     = "Missing token in request!";
        }else{
            if(count($row) > 0){
                $arr['success'] = true;
                $arr['count']   = count($row);
                $arr['data']    = $row;
            }else{
                $arr['success'] = false;
                $arr['count']   = count($row);
                $arr['msg']     = "Sorry, no doctors found!";
            }
        }
    }
    else if($action == "doctor_schedule"){
        $doc_id = $_GET['doc_id'];
        $token  = $_GET['token'];

        //[pahs_homecare].[user_bizsolpkhomecare].[tbl_doc_schedule_detail]

        if(strlen($doc_id) > 0){
            $row = sql($conn, "select * from tbl_doc_schedule_detail where DoctorID = ?", array($doc_id), "rows");
            $doc_schedule = array();
            $i = 0;

            foreach($row as $r){
                $doc_schedule[$i]['schedule_id']    = $r['doc_schedule_detail_id'];
                $doc_schedule[$i]['day']            = $r['Day'];
                $doc_schedule[$i]['shift']          = $r['Shift'];
                $doc_schedule[$i]['time']           = $r['Time'];
                //$doc_schedule['active']         = $r['Isactive'];
                $i++;
            }

            $row_2 = sql($conn, "select * from Rates where DoctorID = ?", array($doc_id), "rows");
            $doc_rate = array();
            $i = 0;
            foreach($row_2 as $r){
                $doc_rate[$i]['rate_id']        = $r['Doc_rate_id'];
                $doc_rate[$i]['text']           = $r['Description'];
                $doc_rate[$i]['amount']         = $r['Rate'];
                $i++;
            }



        }

        if(strlen($token) == 0){
            $arr['success'] = false;
            $arr['msg']     = "Missing token in request!";
        }else{
            if(count($row) > 0){
                $arr['success'] = true;
                $arr['count']   = count($row);
                $arr['data']    = $doc_schedule;
                $arr['rates']   = $doc_rate;
            }else{
                $arr['success'] = false;
                $arr['count']   = count($row);
                $arr['msg']     = "Doctor schedule is not defined!";
            }
        }
    }
    else if($action == "doctor_availability" || $action == "book_appointment"){



        //sql($conn, "delete from tbl_Appointments_reservation where UserID = ?",
        //array("228"), "rows");

        $doc_id         = $_GET['doc_id'];
        $date           = $_GET['date'];
        $day            = date("D",strtotime($date));
        $schedule_id    = $_GET['schedule_id'];
        $token          = $_GET['token'];
        $reason         = $_GET['reason'];

        $doctor_availablity = true;
        $msg                = "Doctor is available";

        if(strlen($doc_id) > 0 && strlen($schedule_id) > 0){
            $row = sql($conn, "select * from tbl_doc_schedule_detail where doc_schedule_detail_id = ?", array($schedule_id), "rows");
            foreach($row as $r){
                $doc_day        = $r['Day'];
            }

            if($doc_day == date("D",strtotime($date))){//check day (doc is din baithta bhe hai ys nahi)
                $row = sql($conn, "select * from tbl_Appointments_reservation where DoctorID = ? and doc_schedule_detail_id = ?",
                array($doc_id, $schedule_id), "rows");



                $app = true;
                foreach($row as $r){
                    if(date("d/M/Y",strtotime($date)) == date("d/M/Y",strtotime($r['Date']))){
                        $doctor_availablity = false;
                        $msg                = "Doctor is not available on ".date("D, d-M-Y",strtotime($date));
                        $app                = false;
                    }
                }

                if($app == true){
                    if($action == "book_appointment"){
                        //book appointment

                        $row2 = sql($conn, "select UserID from Users where CSRFToken = ?", array($token), "rows");


                        $UserID = $row2[0][0];

                        $videoid = rand(1,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9);

                        $row2 = sql($conn, "select PID from PatientMaster
                        where UserID = ?", array($UserID), "rows");
                        $PatientID = $row2[0][0];

                        if(strlen($PatientID) > 0){


                            $row = sql($conn, "insert into tbl_Appointments_reservation
                            (doc_schedule_detail_id,DoctorID,UserID,PatientID,Date,Remarks,Booking_Status,videoid)
                            values (?,?,?,?,?,?,?,?)",
                            array($schedule_id,$doc_id,$UserID,$PatientID,date("d-M-Y",strtotime($date)),$reason,"booked",$videoid), "rows");



                            $msg                = "Appointment booked on ".date("D, d-M-Y",strtotime($date));

                            //invoice

                            $row_users  = sql($conn, "select * from Users where CSRFToken = ?", array($token), "rows");

                            $row_doctor = sql($conn, "select DoctorName from Doctors where DoctorID = ?", array($doc_id), "rows");



                            $ReservationID  = $conn->lastInsertId();
                            $Payment_Status = "Pending";
                            $Payment_Token  = $schedule_id;
                            $Net_Amount     = "1000";
                            $UserID         = $row_users[0]['UserID'];
                            $PatientName    = $row_users[0]['UserName'];
                            $DoctorName     = $row_doctor[0]['DoctorName'];
                            $Token_No       = $schedule_id;
                            $Day            = $day;
                            $Date           = $date;


                            $row = sql($conn, "insert into Appointment_bill
                            (ReservationID,Payment_Status,Payment_Token,Net_Amount,UserID,PatientName,DoctorName,Token_No,Day,Date)
                            values (?,?,?,?,?,?,?,?,?,?)",
                            array($ReservationID,$Payment_Status,$Payment_Token,$Net_Amount,$UserID,$PatientName,$DoctorName,$Token_No,$Day,$Date), "rows");


                            //die("->$row");
                            //[$PatientID]
                        }else{
                            $token = ""; //not valid
                        }

                    }
                }
            }else{
                $doctor_availablity = false;
                $msg                = "Doctor is not available on ".date("D, d/M/Y",strtotime($date));
            }
        }

        if(strlen($token) == 0){
            $arr['success'] = false;
            $arr['msg']     = "Missing or invalid token in request!";
        }else{
            $arr['success']     = true;
            $arr['avilablible'] = $doctor_availablity;
            $arr['msg']         = $msg;
        }
    }
    else if($action == "show_appointment"){
        $token          = $_GET['token'];
        $doc_id         = $_GET['doc_id'];

        if(strlen($token) > 0){
            $row2 = sql($conn, "select UserID from Users where CSRFToken = ?", array($token), "rows");
            $PatientID = $row2[0][0];
            $row = sql($conn, "select * from tbl_Appointments_reservation where UserID = ?", array($PatientID), "rows");
        }else if (strlen($doc_id) > 0){
            $row = sql($conn, "select * from tbl_Appointments_reservation where DoctorID = ?", array($doc_id), "rows");
        }

        //die(json_encode($PatientID));
        $my_appointments = array();
        $i = 0;

        //$row = sql($conn, "select * from tbl_Appointments_reservation", array(), "rows");
        foreach($row as $r){

            $A_ID   = $r[0];
            $R_ID   = $r['ReservationID'];
            $S_ID   = $r['doc_schedule_detail_id'];
            $D_ID   = $r['DoctorID'];
            $P_ID   = $r['PatientID'];
            $Date   = $r['Date'];
            $Remarks= $r['Remarks'];

            if(strlen($D_ID) == 0 || strlen($P_ID) == 0){
                continue;
            }

            //tbl doctor
            $row_doctor = sql($conn, "select * from Doctors where DoctorID = ?", array($D_ID), "rows");
            $row_doctor_name = $row_doctor[0]['DoctorName'];
            $row_doctor_spec = $row_doctor[0]['Speciality'];

            //tbl schedule
            $row_schedule = sql($conn, "select * from tbl_doc_schedule_detail where doc_schedule_detail_id = ?", array($S_ID), "rows");
            $row_schedule_time = $row_schedule[0]['Time'];

            if($Remarks == null || $Remarks == "null"){
                $Remarks = "";
            }

            //tbl users
            $row_patient = sql($conn, "select PatientName from PatientMaster where PID = ?", array($P_ID), "rows");
            $row_patient_name = $row_patient[0]['PatientName'];


            $my_appointments[$i]['id']                  = $A_ID;
            $my_appointments[$i]['doctor_name']         = $row_doctor_name;
            $my_appointments[$i]['patient_name']        = $row_patient_name;
            $my_appointments[$i]['doctor_speciality']   = $row_doctor_spec;
            $my_appointments[$i]['date']                = $Date;
            $my_appointments[$i]['time']                = $row_schedule_time;
            $my_appointments[$i]['reason']              = $Remarks;
            $my_appointments[$i]['doc_id']              = $D_ID;
            $my_appointments[$i]['pat_id']              = $P_ID;
            $my_appointments[$i]['PID']                 = $P_ID;

            $time_stamp = strtotime("$Date $row_schedule_time");
            if(time() > $time_stamp){
              $my_appointments[$i]['status']              = "OLD";
            }else{
              $my_appointments[$i]['status']              = "NEW";
            }


            $i++;

        }

        if($i == 0){
            $arr['success']     = false;
            $arr['msg']         = "No appointments to show!";
        }else{
            $arr['success']     = true;
            $arr['data']        = $my_appointments;
        }
    }
    else if($action == "get_invoices"){
      $token          = $_GET['token'];
      $doc_id         = $_GET['doc_id'];


      if(strlen($token) > 0){
          $row2 = sql($conn, "select UserID from Users where CSRFToken = ?", array($token), "rows");
          $UserID = $row2[0][0];
          $row_bills = sql($conn, "select * from Appointment_bill where UserID = ?", array($UserID), "rows");
      }

      if(count($row_bills) == 0){
          $arr['success']     = false;
          $arr['msg']         = "No invoices to show!";
      }else{
          $arr['success']     = true;
          $arr['data']        = $row_bills;
      }

    }
    else if($action == "get_appointment_detail"){
        //$token      = $_GET['token'];
        $id         = $_GET['id'];
        $row        = sql($conn, "select * from tbl_Appointments_reservation where ReservationID = ?", array($id), "rows");



        //die(json_encode($PatientID));
        $my_appointments = array();
        $i = 0;

        //$row = sql($conn, "select * from tbl_Appointments_reservation", array(), "rows");
        foreach($row as $r){

            $A_ID   = $r[0];
            $R_ID   = $r['ReservationID'];
            $S_ID   = $r['doc_schedule_detail_id'];
            $D_ID   = $r['DoctorID'];
            $P_ID   = $r['UserID'];
            $Date   = $r['Date'];
            $Remarks= $r['Remarks'];

            if(strlen($D_ID) == 0 || strlen($P_ID) == 0){
                continue;
            }

            //tbl doctor
            $row_doctor = sql($conn, "select * from Doctors where DoctorID = ?", array($D_ID), "rows");
            $row_doctor_name = $row_doctor[0]['DoctorName'];
            $row_doctor_spec = $row_doctor[0]['Speciality'];

            //tbl schedule
            $row_schedule = sql($conn, "select * from tbl_doc_schedule_detail where doc_schedule_detail_id = ?", array($S_ID), "rows");
            $row_schedule_time = $row_schedule[0]['Time'];

            if($Remarks == null || $Remarks == "null"){
                $Remarks = "";
            }

            //tbl users
            $row_patient = sql($conn, "select * from Users where UserID = ?", array($P_ID), "rows");
            $row_patient_name = $row_patient[0]['UserName'];
            $CSRFToken        = $row_patient[0]['CSRFToken']; //for chart



            $my_appointments[$i]['id']                  = $A_ID;
            $my_appointments[$i]['doctor_name']         = $row_doctor_name;
            $my_appointments[$i]['patient_name']        = $row_patient_name;
            $my_appointments[$i]['doctor_speciality']   = $row_doctor_spec;
            $my_appointments[$i]['date']                = $Date;
            $my_appointments[$i]['time']                = $row_schedule_time;
            $my_appointments[$i]['reason']              = $Remarks;
            $my_appointments[$i]['doc_id']              = $D_ID;
            $my_appointments[$i]['pat_id']              = $P_ID;
            $my_appointments[$i]['PID']                 = $P_ID;
            $my_appointments[$i]['CSRFToken']           = $CSRFToken;


            $i++;

        }

        if($i == 0){
            $arr['success']     = false;
            $arr['msg']         = "No appointments to show!";
        }else{
            $arr['success']     = true;
            $arr['data']        = $my_appointments;
        }
    }
    else if($action == "profile"){
        $token              = $_GET['token'];
        $user_id            = $_GET['user_id'];

        $profile            = array();

        $row_1              = sql($conn, "select * from Users where CSRFToken = ? or UserID = ?", array($token,$user_id), "rows");


        $UserID             = $row_1[0]['UserID'];
        $profile[]['name']    = $row_1[0]['UserName'];
        $profile[]['email']   = $row_1[0]['Emailaddress'];
        $profile[]['phone']   = $row_1[0]['PhoneNo'];

        $row_2          = sql($conn, "select * from PatientMaster where UserID = ?", array($UserID), "rows");
        if(count($row_2) == 0){
            // update UserID
            sql($conn, "insert into PatientMaster (UserID) values (?)", array($UserID), "rows");
            $PatientID = "M".$conn->lastInsertId();
            //update
            sql($conn, "update PatientMaster set PatientID = ? where UserID = ?", array($PatientID,$UserID), "rows");

            $row_2 = sql($conn, "select * from PatientMaster where UserID = ?", array($UserID), "rows");
        }
        $profile[]['gender']      = $row_2[0]['Gender'];
        $profile[]['marital']     = $row_2[0]['MaritalStatus'];
        $profile[]['sodowo']      = $row_2[0]['sodowo'];
        $profile[]['address1']    = $row_2[0]['AddressLine1'];
        $profile[]['address2']    = $row_2[0]['AddressLine2'];
        $profile[]['city']        = $row_2[0]['City'];
        $profile[]['ptcl']        = $row_2[0]['PTCL'];
        $profile[]['cell1']       = $row_2[0]['CellPhone1'];
        $profile[]['cell2']       = $row_2[0]['CellPhoneAddl'];
        $profile[]['age']         = $row_2[0]['Age'];
        $profile[]['dob']         = $row_2[0]['DOB'];
        $profile[]['placeofbirth']= $row_2[0]['PlaceOfBirth'];
        $profile[]['occupation']  = $row_2[0]['Occuptaion'];
        $profile[]['height']      = $row_2[0]['Initial_Height'];
        $profile[]['weight']      = $row_2[0]['Initial_Weight'];
        $profile[]['bsa']         = round($row_2[0]['Initial_BSA'],3);
        $profile[]['cnic']        = $row_2[0]['CNIC'];
        $profile[]['passport']    = $row_2[0]['Passport'];

        if($row_1[0]['UserName'] == null || $row_1[0]['UserName'] == ""){
          $arr['msg_title']    = "Complete your profile";
          $arr['msg_text']     = "Please enter your name!";
        }else if($row_2[0]['Gender'] == null || $row_2[0]['Gender'] == ""){
          $arr['msg_title']    = "Complete your profile";
          $arr['msg_text']     = "Please select your gender!";
        }else if($row_2[0]['MaritalStatus'] == null || $row_2[0]['MaritalStatus'] == ""){
          $arr['msg_title']    = "Complete your profile";
          $arr['msg_text']     = "Please select your marital status!";
        }else if($row_2[0]['CellPhone1'] == null || $row_2[0]['CellPhone1'] == ""){
          $arr['msg_title']    = "Complete your profile";
          $arr['msg_text']     = "Please update your cell phone number!";
        }else if($row_2[0]['Initial_Height'] == null || $row_2[0]['Initial_Height'] == ""){
          $arr['msg_title']    = "Complete your profile";
          $arr['msg_text']     = "Please update your height!";
        }else if($row_2[0]['Initial_Weight'] == null || $row_2[0]['Initial_Weight'] == ""){
          $arr['msg_title']    = "Complete your profile";
          $arr['msg_text']     = "Please update your weight!";
        }

        if($UserID == ""){
            $arr['success'] = false;
            $arr['msg']     = "Invalid Token!";
        }else{
            $arr['success']     = true;
            $arr['data']        = $profile;
        }
    }
    else if($action == "profile_update"){
        $token           = $_GET['token'];
        $user_id         = $_GET['user_id'];

        $name            = $_GET['name'];
        $gender          = $_GET['gender'];
        $marital         = $_GET['marital'];
        $sodowo          = $_GET['sodowo'];
        $address1        = $_GET['address1'];
        $address2        = $_GET['address2'];
        $city            = $_GET['city'];
        $ptcl            = $_GET['ptcl'];
        $cell1           = $_GET['cell1'];
        $cell2           = $_GET['cell2'];
        $dob             = $_GET['dob'];
        $placeofbirth    = $_GET['placeofbirth'];
        $occupation      = $_GET['occupation'];
        $height          = $_GET['height'];
        $weight          = $_GET['weight'];
        $bsa             = $_GET['bsa'];
        $cnic            = $_GET['cnic'];
        $passport        = $_GET['passport'];

        if($dob == "" || $dob == "null" || $dob == null){
            $dob    = "";
            $age    = "";
        }else{
          $age    = floor((time()-strtotime($dob))/(60*60*24*365));
        }
        if($height == "" || $height == "null" || $height == null){
            $height = "";
        }

        if($weight == "" || $weight == "null" || $weight == null){
            $weight = "";
        }

        if($bsa == "" || $bsa == "null" || $bsa == null){
            $bsa = "";
        }

        if($passport == "" || $passport == "null" || $passport == null){
            $passport = "";
        }

        $update_query = array();

        //get user ID
        $row_1        = sql($conn, "select * from Users where CSRFToken = ? or UserID = ?", array($token,$user_id), "rows");
        $UserID       = $row_1[0]['UserID'];

        //update name
        $update_query[]  = sql($conn, "update Users set
        UserName = ? where UserID = ?", array($name,$UserID), "rows");

        //sql($conn, "update PatientMaster set PatientName = ? where PID = ?", array($P_ID), "rows");
        //$row_patient = sql($conn, "update PatientMaster set PatientName = ? where PID = ?", array($P_ID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        Gender = ? where UserID = ?",array($gender,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        MaritalStatus= ? where UserID = ?",
        array($marital,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        sodowo= ? where UserID = ?",
        array($sodowo,$UserID), "rows");

        $update_query[]  = sql($conn, "update PatientMaster set
        AddressLine1= ? where UserID = ?",
        array($address1,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        AddressLine2= ? where UserID = ?",
        array($address2,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        City= ? where UserID = ?",
        array($city,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        PTCL= ? where UserID = ?",
        array($ptcl,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        CellPhone1= ? where UserID = ?",
        array($cell1,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        CellPhoneAddl= ? where UserID = ?",
        array($cell2,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        Age= ? where UserID = ?",
        array($age,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        DOB= ? where UserID = ?",
        array($dob,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        PlaceOfBirth= ? where UserID = ?",
        array($placeofbirth,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        Occuptaion= ? where UserID = ?",
        array($occupation,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        Initial_Height= ? where UserID = ?",
        array($height,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        Initial_Weight= ? where UserID = ?",
        array($weight,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        Initial_BSA= ? where UserID = ?",
        array($bsa,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        CNIC= ? where UserID = ?",
        array($cnic,$UserID), "rows");

        $update_query[] = sql($conn, "update PatientMaster set
        Passport= ?   where UserID = ?",
        array($passport,$UserID), "rows");

        $arr['success'] = true;
        $arr['update_query'] = json_encode($update_query);

    }
    else if($action == "send_msg"){


        /*
        !important columns

        pkid: "702",
        msg: "I am DOC",
        doc_id: "1",
        patient_id: "17252",
        chat_time: "2019-08-07 13:08:55.000",
        appointment_id: "0",
        senderid: "17252"
        */

        //$appointment_id assume latest
        $appointment_id = "";

        $senderid     = $_GET['senderid'];
        $recipientid  = $_GET['recipientid'];
        $sender       = $_GET['sender']; //patient _ or _doc
        $msg          = $_GET['msg'];
        $date_time    = time();
        $chat_time    = date("Y-m-d H:m:s.000");
        $appointment_id = $_GET['appointment_id'];

        if($sender == "patient"){
          $doc_id       = $recipientid;
          $patient_id   = $senderid;
        }else if($sender == "doctor"){
          $doc_id       = $senderid;
          $patient_id   = $recipientid;
        }

        $row_1 = sql($conn, "insert into chat
        (msg, doc_id, patient_id, chat_time, appointment_id, senderid)
        values (?,?,?,?,?,?)",
        array($msg, $doc_id, $patient_id, $chat_time, $appointment_id, $senderid),
        "count");

        if($row_1 == 1){
            $arr['success'] = true;
        }else{
            $arr['success'] = false;
        }
        //$arr['data'] = $row_2;
    }
    else if($action == "show_msg"){
        $chat_id_doc        = $_GET['chat_id_doc']; //sender ID
        $chat_id_pat        = $_GET['chat_id_pat'];   //receiver ID
        $last_msg_id        = $_GET['last_msg_id'];

        if($last_msg_id == ""){
          $last_msg_id = 0;
        }


        $row_1 = sql($conn, "select * from chat where doc_id = ? AND patient_id = ? AND pkid > ?
        order by (pkid) asc",
        array($chat_id_doc,$chat_id_pat,$last_msg_id), "rows");

        $msgs = array();
        $i = 0;
        $new_id = $last_msg_id;

        foreach($row_1 as $row){

            $msgs[$i]['id']        = $row['pkid'];
            $msgs[$i]['msg']        = $row['msg'];
            $msgs[$i]['date']       = substr($row['chat_time'],0,10);
            $msgs[$i]['time']       = substr($row['chat_time'],10,9);
            $msgs[$i]['doc_id']     = $row['doc_id'];
            $msgs[$i]['pat_id']     = $row['patient_id'];
            $msgs[$i]['senderid']   = $row['senderid'];

            $i++;

            if($new_id < $row['pkid']){
                $new_id = $row['pkid'];
            }
        }


        $arr['data']          = $msgs;
        $arr['last_msg_id']   = $new_id;

    }
    else if($action == "save_examination"){
        $p_id = $_GET['p_id'];
        $d_id = $_GET['d_id'];//to show all patients

        //pre-requisite
        $row_1 = sql($conn, "select * from PatientDisease where PID = ?", array($p_id), "rows");
        if(count($row_1) == 0){
            sql($conn, "insert into PatientDisease (PID,UserID,DiagnosedBy) values (?,?,?)", array($p_id,$p_id,$d_id), "rows");
            $row_1 = sql($conn, "select * from PatientDisease where PID = ?", array($p_id), "rows");
        }



        /*"DiagnosisDate": "2018-05-08 00:40:55.447",
        "PC": null,
        "HOPC": null,
        "PMSH": null,
        "SH": null,
        "SR_CONS": null,
        "SR_CNS": null,
        "SR_CVS": null,
        "SR_RESP": null,
        "SR_GASTRO": null,
        "SR_GENITO": null,
        "PHEX_VITALID": null,
        "PHEX_HEADNECK": null,
        "PHEX_CHEST": null,
        "PHEX_HEART": null,
        "PHEX_ABDO": null,
        "PHEX_GENI": null,
        "PHEX_EXTR": null,
        "LABS_": null,
        "TumorValue": null,
        "LymphNode": null,
        "Metastatis": null,
        "AssesmentDX": null,
        "AssesmentStaging": null,
        "AssesmentScore": null,
        "AssesmentNote": null,
        "Histopathalogy": null,
        "Radiology": null,
        "IPIScoring": null,
        "histologicgrade": null,
        "stage": null,
        "DiagnosedBy": "6",*/

        $PC     = $_GET['data2'];
        $HOPC   = $_GET['data3'];
        $PMSH   = $_GET['data4'];
        $SH     = $_GET['data5'];
        $SR     = explode(",",$_GET['data6']);
        $PHEX   = explode(",",$_GET['data7']);
        $LAB    = $_GET['data8'];
        $HIS    = $_GET['data9'];
        $RAD    = $_GET['data10'];
        $TUM    = explode(",",$_GET['data11']);

        $data12    = $_GET['data12'];
        $data13    = $_GET['data13'];


        $row_1 = sql($conn, "update PatientDisease set
        PC = ?, HOPC = ?, PMSH = ?, SH = ?, SR_CONS = ?,
        SR_CNS = ?, SR_CVS = ?, SR_RESP = ?, SR_GASTRO = ?, SR_GENITO = ?,
        PHEX_HEADNECK = ?, PHEX_CHEST = ?, PHEX_HEART = ?, PHEX_ABDO = ?, PHEX_GENI = ?,
        PHEX_EXTR = ?, LABS_ = ?, Histopathalogy = ?, Radiology = ?,TumorValue = ?,
        LymphNode = ?, Metastatis = ?, IPIScoring = ?, histologicgrade = ?, stage = ?,
        AssesmentDX = ?, AssesmentNote = ?
        where PID = ?", array(
        $PC,$HOPC,$PMSH,$SH,$SR[0],
        $SR[1],$SR[2],$SR[3],$SR[4],$SR[5],
        $PHEX[0],$PHEX[1],$PHEX[2],$PHEX[3],$PHEX[4],
        $PHEX[5],$LAB,$HIS,$RAD,$TUM[0],
        $TUM[1],$TUM[2],$TUM[3],$TUM[4],$TUM[5],
        $data12, $data13,
        $p_id), "count");


        if($row_1 == 1){
            $arr['success'] = true;
        }else{
            $arr['success'] = false;
        }
    }
    else if($action == "show_examination"){
        //get
        $p_id = $_GET['p_id'];
        $d_id = $_GET['d_id'];//to show all patients

        //pre-requisite
        $row_1 = sql($conn, "select * from PatientDisease where PID = ?", array($p_id), "rows");
        if(count($row_1) == 0){
            sql($conn, "insert into PatientDisease (PID,UserID,DiagnosedBy) values (?,?,?)", array($p_id,$p_id,$d_id), "rows");
            $row_1 = sql($conn, "select * from PatientDisease where PID = ?", array($p_id), "rows");
        }

        $p_ids = array();
        $row_list = sql($conn, "select distinct(PID) from PatientDisease where DiagnosedBy = ?", array($d_id), "rows");
        $i = 0;
        foreach($row_list as $row){
            if($row[0] != null && strlen($row[0]) > 0){

                $row_pat_master = sql($conn, "select * from PatientMaster where UserID = ?", array($row[0]), "rows");
                $row_user       = sql($conn, "select * from Users where UserID = ?", array($row[0]), "rows");
                $p_ids[$i]["id"]        = $row[0];
                $p_ids[$i]["name"]      = $row_user[0]['UserName'];
                $p_ids[$i]["sodowo"]    = $row_pat_master[0]['sodowo'];
                $p_ids[$i]["gender"]    = $row_pat_master[0]['Gender'];
                $p_ids[$i]["date"]      = $row_pat_master[0]['CNIC'];
                $i++;
            }
        }


        $examination = array();

        $examination["data2"] = $row_1[0]['PC'];
        $examination["data3"] = $row_1[0]['HOPC'];
        $examination["data4"] = $row_1[0]['PMSH'];
        $examination["data5"] = $row_1[0]['SH'];
        $examination["data6"] = array($row_1[0]['SR_CONS'],$row_1[0]['SR_CNS'],$row_1[0]['SR_CVS'],$row_1[0]['SR_RESP'],$row_1[0]['SR_GASTRO'],$row_1[0]['SR_GENITO']);
        $examination["data7"] = array($row_1[0]['PHEX_HEADNECK'],$row_1[0]['PHEX_CHEST'],$row_1[0]['PHEX_HEART'],$row_1[0]['PHEX_ABDO'],$row_1[0]['PHEX_GENI'],$row_1[0]['PHEX_EXTR']);
        $examination["data8"] = $row_1[0]['LABS_'];
        $examination["data9"] = $row_1[0]['Histopathalogy'];
        $examination["data10"] = $row_1[0]['Radiology'];
        $examination["data11"] = array($row_1[0]['TumorValue'],$row_1[0]['LymphNode'],$row_1[0]['Metastatis'],$row_1[0]['IPIScoring'],$row_1[0]['histologicgrade'],$row_1[0]['stage']);
        $examination["data12"] = $row_1[0]['AssesmentDX'];
        $examination["data13"] = $row_1[0]['AssesmentNote'];

        /*"AssesmentDX": null,
        "AssesmentStaging": null,
        "AssesmentScore": null,
        "AssesmentNote": null,
        "DiagnosedBy": "6",*/


        $arr['data'] = $examination;
    }
    else if($action == "patient"){
        $doc_id = $_GET['doc_id'];
        $search = $_GET['search'];

        $p_ids = array();
        $row_list = sql($conn, "select distinct(PID) from PatientDisease where DiagnosedBy = ?", array($doc_id), "rows");
        $i = 0;
        foreach($row_list as $row){
            if($row[0] != null && strlen($row[0]) > 0){
                $row_pat_master = sql($conn, "select * from PatientMaster where UserID = ?", array($row[0]), "rows");
                $row_user       = sql($conn, "select * from Users where UserID = ?", array($row[0]), "rows");

                if(strlen($row_user[0]['UserName']) > 0){
                  $name = $row_user[0]['UserName'];
                }else{
                  $name = $row_pat_master[0]['PatientName'];
                }

                if(strlen($row_pat_master[0]['PID']) > 0){
                  if (strpos(strtolower($name), strtolower($search)) !== false) {
                    $p_ids[$i]["name"]      = $name;
                    $p_ids[$i]["mrn"]       = $row_pat_master[0]['PID'];
                    $p_ids[$i]["phone"]     = $row_pat_master[0]['CellPhone1'];

                    //$p_ids[$i]["sodowo"]    = $row_pat_master[0]['sodowo'];
                    //$p_ids[$i]["gender"]    = $row_pat_master[0]['Gender'];
                    //$p_ids[$i]["date"]      = $row_pat_master[0]['CNIC'];
                    $i++;
                  }
                }
            }
        }
        $arr['data'] = $p_ids;
        $arr['success'] = true;
        $arr['count'] = count($p_ids);
    }
    else if($action == "share_examination"){
        //get
        $p_id = $_GET['p_id'];
        $d_id = $_GET['d_id'];//to show all patients
        $type = $_GET['type'];

        $row_1 = sql($conn, "select * from Users where UserID = ?", array($p_id), "rows");
        $patient_name = $row_1[0]['UserName'];
        $row_2 = sql($conn, "select * from PatientMaster where UserID = ?", array($p_id), "rows");
        if($patient_name == ""){
          $patient_name = $row_2[0]['PatientName'];
        }
        $PatientID = $row_2[0]['PatientID'];

        $row_doctor = sql($conn, "select * from Doctors where DoctorID = ?", array($d_id), "rows");
        $doc_name  = $row_doctor[0]['DoctorName'];


        //pre-requisite
        $row_1 = sql($conn, "select * from PatientDisease where PID = ?", array($p_id), "rows");
        if(count($row_1) == 0){
            sql($conn, "insert into PatientDisease (PID,UserID,DiagnosedBy) values (?,?,?)", array($p_id,$p_id,$d_id), "rows");
            $row_1 = sql($conn, "select * from PatientDisease where PID = ?", array($p_id), "rows");
        }

        $p_ids = array();
        $row_list = sql($conn, "select distinct(PID) from PatientDisease where DiagnosedBy = ?", array($d_id), "rows");
        $i = 0;
        foreach($row_list as $row){
            if($row[0] != null && strlen($row[0]) > 0){

                $row_pat_master = sql($conn, "select * from PatientMaster where UserID = ?", array($row[0]), "rows");
                $row_user       = sql($conn, "select * from Users where UserID = ?", array($row[0]), "rows");
                $p_ids[$i]["id"]        = $row[0];
                $p_ids[$i]["name"]      = $row_user[0]['UserName'];
                $p_ids[$i]["sodowo"]    = $row_pat_master[0]['sodowo'];
                $p_ids[$i]["gender"]    = $row_pat_master[0]['Gender'];
                $p_ids[$i]["date"]      = $row_pat_master[0]['CNIC'];
                $i++;
            }
        }



        /*"AssesmentDX": null,
        "AssesmentStaging": null,
        "AssesmentScore": null,
        "AssesmentNote": null,
        "DiagnosedBy": "6",*/

        if($type == "complete"){
          $fileName = md5(uniqid(rand(), true)).md5(uniqid(rand(), true));
          $myFile = "../reports/$fileName.html";
          $fh = fopen($myFile, 'w'); // or die("error");
          $stringData = '
          <html><head><title>Home Care Report</title><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>
          <style>body{font-family:sans-serif; padding:0 20px;} img{display:block; margin: 0 auto; width:200px;} .collapsible-header{font-size: 18px; margin-top:25px; font-weight:bold;border:1x solid #000; border-bottom: 1px solid #000;} h1{font-size: 24px;text-align: center;border-bottom: 1px solid #000;margin-bottom: 0;} .date_time{text-align:right; margin-top: 0;} table tr th{text-align: left;}</style>
          <img src="https://pahs.com.pk/website/images/Logo_png.png" alt="Home Care" />
		      <h1>Examination</h1>
          <div class="collapsible-header text-bold active">
              <i class="fa fa-comments"></i>Patient General Information
          </div>
          <div class="collapsible-body">
              <table>
        					<tr><th>Print Date:</th><td>'.date('d-M-Y H:i:s a').'</td></tr>
        					<tr><th>Doctor:</th><td>'.$doc_name.'</td></tr>
        					<tr><th>Patient ID:</th><td>'.$PatientID.'</td></tr>
        					<tr><th>Patient Name:</th><td>'.$patient_name.'</td></tr>
				      </table>
         </div>

              <div class="collapsible-header text-bold active">
                <i class="fa fa-comments"></i>Presenting Complain:
              </div>
              <div class="collapsible-body">
                '.$row_1[0]['PC'].'
              </div>
              <div class="collapsible-header text-bold">
                <i class="fa fa-history"></i>History of Presenting Complains:
              </div>
              <div class="collapsible-body">
                '.$row_1[0]['HOPC'].'
              </div>
              <div class="collapsible-header text-bold">
                <i class="fa fa-heartbeat"></i>Past Medical/Surgical History:
              </div>
              <div class="collapsible-body">
                '.$row_1[0]['PMSH'].'
              </div>
              <div class="collapsible-header text-bold">
                <i class="fa fa-history"></i>Social History:
              </div>
              <div class="collapsible-body">
                '.$row_1[0]['SH'].'
              </div>
              <div class="collapsible-header text-bold">
                <i class="fa fa-user-md"></i>Systematic Review:
              </div>
              <div class="collapsible-body">
                <label>Constitutional: </label>
                '.$row_1[0]['SR_CONS'].'
                <br/>

                <label>CVS: </label>
                '.$row_1[0]['SR_CNS'].'
                <br/>

                <label>Gastrointestinal: </label>
                '.$row_1[0]['SR_CVS'].'
                <br/>

                <label>CNS: </label>
                '.$row_1[0]['SR_RESP'].'
                <br/>

                <label>Respiratory: </label>
                '.$row_1[0]['SR_GASTRO'].'
                <br/>

                <label>Genitourinary: </label>
                '.$row_1[0]['SR_GENITO'].'

              </div>
              <div class="collapsible-header text-bold">
                <i class="fa fa-male"></i>Phycial Examination:
              </div>
              <div class="collapsible-body">
                <label>Head and Neck Examination: </label>
                '.$row_1[0]['PHEX_HEADNECK'].'
                <br/>

                <label>Chest Examination: </label>
                '.$row_1[0]['PHEX_CHEST'].'
                <br/>

                <label>Heart Examination: </label>
                '.$row_1[0]['PHEX_HEART'].'
                <br/>

                <label>Abdominal Examination: </label>
                '.$row_1[0]['PHEX_ABDO'].'
                <br/>

                <label>Genitourinary System Examination: </label>
                '.$row_1[0]['PHEX_GENI'].'
                <br/>

                <label>Extremity Examination: </label>
                '.$row_1[0]['PHEX_EXTR'].'

              </div>
              <div class="collapsible-header text-bold">
                <i class="fa fa-medkit"></i>Labs:
              </div>
              <div class="collapsible-body">
                '.$row_1[0]['LABS_'].'
              </div>
              <div class="collapsible-header text-bold">
                <i class="fa fa-heart"></i>Histopathology:
              </div>
              <div class="collapsible-body">
                '.$row_1[0]['Histopathalogy'].'
              </div>
              <div class="collapsible-header text-bold">
                <i class="fa fa-dot-circle-o"></i>Radiology:
              </div>
              <div class="collapsible-body">
                '.$row_1[0]['Radiology'].'
              </div>
              <div class="collapsible-header text-bold">
                <i class="fa fa-database"></i>TNM Staging:
              </div>
              <div class="collapsible-body">
                <label>Tumor (T)/Value: </label>
                '.$row_1[0]['TumorValue'].'
                <br/>

                <label>Lymph Node (N): </label>
                '.$row_1[0]['LymphNode'].'
                <br/>

                <label>Metastatis (M): </label>
                '.$row_1[0]['Metastatis'].'
                <br/>

                <label>IPI Scoring: </label>
                '.$row_1[0]['IPIScoring'].'
                <br/>

                <label>Histologic Grade: </label>
                '.$row_1[0]['histologicgrade'].'
                <br/>

                <label>Stage: </label>
                '.$row_1[0]['stage'].'
              </div>
              <div class="collapsible-header text-bold">
                <i class="fa fa-heart"></i>Assesment (DX):
              </div>
              <div class="collapsible-body">
                '.$row_1[0]['AssesmentDX'].'
              </div>
              <div class="collapsible-header text-bold">
                <i class="fa fa-heart"></i>Assesment Note:
              </div>
              <div class="collapsible-body">
                '.$row_1[0]['AssesmentNote'].'
              </div>
          </body></html>';
        }else if($type == "limited"){
          $fileName = md5(uniqid(rand(), true)).md5(uniqid(rand(), true));
          $myFile = "../reports/$fileName.html";
          $fh = fopen($myFile, 'w'); // or die("error");
          $stringData = '
          <html><head><title>Home Care Report</title><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>
          <style>body{font-family:sans-serif; padding:0 20px;} img{display:block; margin: 0 auto; width:200px;} .collapsible-header{font-size: 18px; margin-top:25px; font-weight:bold;border:1x solid #000; border-bottom: 1px solid #000;} h1{font-size: 24px;text-align: center;border-bottom: 1px solid #000;margin-bottom: 0;} .date_time{text-align:right; margin-top: 0;} table tr th{text-align: left;}</style>
          <img src="https://pahs.com.pk/website/images/Logo_png.png" alt="Home Care" />
		      <h1>Examination</h1>
          <div class="collapsible-header text-bold active">
              <i class="fa fa-comments"></i>Patient General Information
          </div>
          <div class="collapsible-body">
              <table>
        					<tr><th>Print Date:</th><td>'.date('d-M-Y H:i:s a').'</td></tr>
        					<tr><th>Doctor:</th><td>'.$doc_name.'</td></tr>
        					<tr><th>Patient ID:</th><td>'.$PatientID.'</td></tr>
        					<tr><th>Patient Name:</th><td>'.$patient_name.'</td></tr>
				      </table>
         </div>
              <div class="collapsible-header text-bold">
                <i class="fa fa-heart"></i>Assesment (DX):
              </div>
              <div class="collapsible-body">
                '.$row_1[0]['AssesmentDX'].'
              </div>
              <div class="collapsible-header text-bold">
                <i class="fa fa-heart"></i>Assesment Note:
              </div>
              <div class="collapsible-body">
                '.$row_1[0]['AssesmentNote'].'
              </div>
          </body></html>';
        }

        fwrite($fh, $stringData);
        fclose($fh);

        $report_path = "http://pahs.com.pk/reports/".$fileName.".html";

        $arr['data'] = "Report Sent $report_path !";

        //now send
        $appointment_id = "";
        $senderid     = $d_id;
        $recipientid  = $p_ids;
        $sender       = $d_id; //patient _ or _doc
        $msg          = "Tap <a href='$report_path'>HERE</a> to see your latest report!";
        $date_time    = time();
        $chat_time    = date("Y-m-d H:m:s.000");
        $appointment_id = $_GET['appointment_id'];

        $row_1 = sql($conn, "insert into chat
        (msg, doc_id, patient_id, chat_time, appointment_id, senderid)
        values (?,?,?,?,?,?)",
        array($msg, $d_id, $p_id, $chat_time, $appointment_id, $senderid),
        "count");


    }
    else if($action == "add_doc"){
      $p_id           = $_GET['p_id'];
      $DocDateTime    = "2019-09-01 00:05:54.000";
      $DocFullPath    = $_GET['path'];
      $category       = $_GET['category'];
      $TitleName      = $_GET['title'];
      $ReservationID  = $_GET['app_id'];
      //
      // die("insert into PatientScanDocs
      // (PId,DocDateTime,DocFullPath,DocImage,category,TitleName,ReservationID)
      // values ('$p_id','$DocDateTime','$DocFullPath','$DocFullPath','$category','$TitleName','$ReservationID')");

      $added = sql($conn, "insert into PatientScanDocs
      (PID,DocDateTime,DocFullPath,DocImage,category,TitleName,ReservationID)
      values (?,?,?,?,?,?,?)",
      array($p_id, $DocDateTime,$DocFullPath,$DocFullPath,$category,$TitleName,$ReservationID), "count");



      if($added == 1){
        $arr['success'] = true;
      }else{
        $arr['success'] = false;
      }
    }
    else if($action == "show_doc"){
      $p_id           = $_GET['p_id'];
      $ReservationID  = $_GET['app_id'];

      $rows = sql($conn, "select * from PatientScanDocs where PId = ? OR ReservationID = ?",
      array($p_id, $ReservationID), "rows");

      //if(count($rows) > 0){
        $arr['success'] = true;
        $arr['data']    = $rows;
      //}else{
      //  $arr['success'] = false;
      //}
    }
    else if($action == "upload"){

        $file_name      = $_FILES["file"]["name"];
        $file_tmp_name 	= $_FILES["file"]["tmp_name"];
        $file_type      = pathinfo($file_name, PATHINFO_EXTENSION);

        $rand_name	= md5(uniqid(rand(), true)).".".$file_type;
        $location 	= "../doc_uploads/$rand_name";
        move_uploaded_file($file_tmp_name,$location);

        $name      = $_POST['name'];
        die($rand_name);

    }
    else if($action == "send_sms"){

        $app_id      = $_GET['app_id'];


        $row        = sql($conn, "select * from tbl_Appointments_reservation where ReservationID = ?", array($app_id), "rows");

        $arr['success']     = false;

        foreach($row as $r){

            $D_ID   = $r['DoctorID'];
            $P_ID   = $r['UserID'];

            $row_doctor = sql($conn, "select * from Doctors where DoctorID = ?", array($D_ID), "rows");
            $doc_name  = $row_doctor[0]['DoctorName'];

            $row_patient = sql($conn, "select * from Users where UserID = ?", array($P_ID), "rows");
            $patient   = $row_patient[0]['UserName'];
            $phone     = $row_patient[0]['PhoneNo'];


            $msg = "Dear Patient $patient Your appointment with $doc_name will be started in few minutes, please login to APP. Thanks. PAHC TEAM";
            $url = "https://pahs.com.pk/app/sms.php?number=$phone&message=$msg&mask=PAHCS";

            $arr['success']     = true;


        }


        $arr['url']         = $url;


    }
    else if($action == "manual"){
        $table = $_GET['table'];
        $row = sql($conn, "select * from $table", array(), "rows");
        $arr = $row;
    }

    die(json_encode($arr));

    require("connection/config_off.php");
?>
