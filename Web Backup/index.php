<?php
    
    header("Access-Control-Allow-Origin: *");
    
    require("connection/config.php");    
    
    //sql($conn, "delete from tbl_Appointments_reservation", array(), "rows");  
    //sql($conn, "delete from chat", array(), "rows");  
    
    //$CSRFToken = md5(uniqid(rand(), true)).md5(uniqid(rand(), true));                                        
    //sql($conn, "update Users set Password = ? where UserID = ?", array("abc@123",1), "rows");  
    
    //sql($conn, "update PatientMaster set PatientID = ? where PatientID = ?", array(200,1), "rows"); 
    
    $action = $_GET['action'];
    
    $arr = array();  
    //$arr['request'] = $_REQUEST;
    
    
    //Signup 
    if($action == "signup" || $action == "set_password" || $action == "forget"){        
        //signup
        $type   = $_GET['type'];
        $name   = $_GET['name'];
        $phone  = $_GET['phone']; 
        
        //set_password
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
                    $url = "http://developer.zeddevelopers.com/hamza/twilio/twilloSMS/?request=allow_me&n=$phone&m=$msg";                      
                    
                    $CSRFToken = md5(uniqid(rand(), true)).md5(uniqid(rand(), true));                                        
                    
                    $unverified_exists = sql($conn, "select count(*) FROM Users where PhoneNo = ? and isActive = ?", array($phone,"0"), "rows");
                    if($unverified_exists[0][0] == 0){   
                        $row = sql($conn, "insert into Users (UserName,PhoneNo,isActive,CSRFToken,SIMserial) values (?,?,?,?,?)", 
                        array($name,$phone,"0",$CSRFToken,$code), "rows");   
                    }else{
                        $row = sql($conn, "update Users set CSRFToken = ?, SIMserial = ? where PhoneNo = ?", array($CSRFToken,$code,$phone), "rows");   
                    }
                         
                    $arr['success'] = true;  
                    $arr['url']     = $url;
                    $arr['token']   = $CSRFToken;
                    
                    $arr['title']   = "Welcome, $name!";                    
                    $arr['msg']     = "We have sent you an SMS on $phone with a 6-Digit verification code (OTP). '$code'";
                    
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
                    $url = "http://developer.zeddevelopers.com/hamza/twilio/twilloSMS/?request=allow_me&n=$phone&m=$msg";                      
                    
                    sql($conn, "update Users set SIMserial = ? where PhoneNo = ?", array($code,$phone), "rows");
                                        
                    $arr['success'] = true;
                    $arr['url']     = $url;
                    $arr['token']   = $row[0]['CSRFToken'];
                    
                    $arr['msg']     = "We have sent you an SMS on $phone with a 6-Digit verification code (OTP). '$code'";
                    
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
    }else if($action == "sms_verify"){  
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
    //Login
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
    //Speciality
    else if($action == "speciality"){   
        $search = $_GET['search'];
        $token  = $_GET['token']; 
        
        if(strlen($search) > 0){
            $row = sql($conn, "select * from TblSpeciality where Name like ?", array("%".$search."%"), "rows");
        }else{
            $row = sql($conn, "select * from TblSpeciality", array(), "rows"); 
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
    //Doctor
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
    //Doctor Schedule
    else if($action == "doctor_schedule"){   
        $doc_id = $_GET['doc_id'];
        $token  = $_GET['token']; 
        
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
    //Doctor Schedule + Book Appointment
    else if($action == "doctor_availability" || $action == "book_appointment"){
        $doc_id         = $_GET['doc_id'];
        $date           = $_GET['date'];
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
                        $PatientID = $row2[0][0];
                        
                        
                        if(strlen($PatientID) > 0){                            
                            $row = sql($conn, "insert into tbl_Appointments_reservation 
                            (doc_schedule_detail_id,DoctorID,PatientID,Date,Remarks) values (?,?,?,?,?)", 
                            array($schedule_id,$doc_id,$PatientID,date("d-M-Y",strtotime($date)),$reason), "rows");
                            $msg                = "Appointment booked on ".date("D, d-M-Y",strtotime($date));
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
        }else{
            $msg = "A";
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
    //Show Appointments
    else if($action == "show_appointment"){
        $token          = $_GET['token']; 
        $doc_id         = $_GET['doc_id'];
        
        if(strlen($token) > 0){
            $row2 = sql($conn, "select UserID from Users where CSRFToken = ?", array($token), "rows");
            $PatientID = $row2[0][0];  
            $row = sql($conn, "select * from tbl_Appointments_reservation where PatientID = ?", array($PatientID), "rows");                
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
            $row_patient = sql($conn, "select * from Users where UserID = ?", array($P_ID), "rows");   
            $row_patient_name = $row_patient[0]['UserName'];
            
            $my_appointments[$i]['id']                  = $A_ID;
            $my_appointments[$i]['doctor_name']         = $row_doctor_name;
            $my_appointments[$i]['patient_name']        = $row_patient_name;
            $my_appointments[$i]['doctor_speciality']   = $row_doctor_spec;
            $my_appointments[$i]['date']                = $Date;
            $my_appointments[$i]['time']                = $row_schedule_time;  
            $my_appointments[$i]['reason']              = $Remarks;
            $my_appointments[$i]['doc_id']              = $D_ID;
            $my_appointments[$i]['pat_id']              = $P_ID;
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
            $row_patient = sql($conn, "select * from Users where UserID = ?", array($P_ID), "rows");   
            $row_patient_name = $row_patient[0]['UserName'];
            
            $my_appointments[$i]['id']                  = $A_ID;
            $my_appointments[$i]['doctor_name']         = $row_doctor_name;
            $my_appointments[$i]['patient_name']        = $row_patient_name;
            $my_appointments[$i]['doctor_speciality']   = $row_doctor_spec;
            $my_appointments[$i]['date']                = $Date;
            $my_appointments[$i]['time']                = $row_schedule_time;  
            $my_appointments[$i]['reason']              = $Remarks;
            $my_appointments[$i]['doc_id']              = $D_ID;
            $my_appointments[$i]['pat_id']              = $P_ID;
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
    //Profile
    else if($action == "profile"){
        $token              = $_GET['token'];
        $user_id            = $_GET['user_id'];
        
        $profile            = array();
        
        $row_1              = sql($conn, "select * from Users where CSRFToken = ? or UserID = ?", array($token,$user_id), "rows"); 
        
        
        $UserID             = $row_1[0]['UserID'];
        $profile[]['name']    = $row_1[0]['UserName'];
        $profile[]['email']   = $row_1[0]['Emailaddress'];
        $profile[]['phone']   = $row_1[0]['PhoneNo'];
        
        $row_2          = sql($conn, "select * from PatientMaster where PatientID = ?", array($UserID), "rows");         
        if(count($row_2) == 0){
            sql($conn, "insert into PatientMaster (PatientID) values (?)", array($UserID), "rows");
            $row_2 = sql($conn, "select * from PatientMaster where PatientID = ?", array($UserID), "rows");       
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
        $profile[]['bsa']         = $row_2[0]['Initial_BSA'];
        $profile[]['cnic']        = $row_2[0]['CNIC'];
        $profile[]['passport']    = $row_2[0]['Passport']; 
        if($UserID == ""){
            $arr['success'] = false;
            $arr['msg']     = "Invalid Token!";
        }else{       
            $arr['success']     = true;
            $arr['data']        = $profile; 
        }        
    }
    //Profile update
    else if($action == "profile_update"){
        $token                      = $_GET['token']; 
        $user_id                    = $_GET['user_id'];
        
        $row_1                      = sql($conn, "select * from Users where CSRFToken = ? or UserID = ?", array($token,$user_id), "rows"); 
        $UserID                     = $row_1[0]['UserID'];
        
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
            $age    = ceil((time()-strtotime($dob))/(60*60*24*365)); 
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
        
        
        $row_1              = sql($conn, "update Users set UserName = ? where UserID = ?", array($name,$UserID), "rows"); 
        
        $row_2              = sql($conn, "update PatientMaster set         
        Gender = ?, MaritalStatus= ?, sodowo= ?, AddressLine1= ?, AddressLine2= ?, 
        City= ?, PTCL= ?, CellPhone1= ?, CellPhoneAddl= ?, Age= ?, 
        DOB= ?, PlaceOfBirth= ?,Occuptaion= ?, Initial_Height= ?, Initial_Weight= ?, 
        Initial_BSA= ?, CNIC= ?, Passport= ? 
        where PatientID = ?", 
        array($gender,$marital,$sodowo,$address1,$address2,
        $city,$ptcl,$cell1,$cell2,$age,
        $dob,$placeofbirth,$occupation,$height,$weight,
        $bsa,$cnic,$passport,
        $UserID), "count"); 
           
        
        if($row_2 == 0){
            $arr['success'] = false;
        }else{       
            $arr['success'] = true;
        } 
        //$arr['data'] = $row_2;       
    }
    //send message
    else if($action == "send_msg"){
        
        $from_id         = $_GET['from_id'];         
        $to_id           = $_GET['to_id'];        
        $msg             = $_GET['msg'];
        $msg_type        = $_GET['msg_type'];
        $date_time       = time();
        
        $row_1 = sql($conn, "insert into chat (id, from_id, to_id, msg, msg_type, date_time) values (?,?,?,?,?,?)", 
        array($date_time,$from_id,$to_id,$msg,$msg_type,$date_time), "count"); 
        
        if($row_1 == 1){
            $arr['success'] = true;
        }else{       
            $arr['success'] = false;
        } 
        //$arr['data'] = $row_2;       
    }
    //fetch message
    else if($action == "show_msg"){     
        $my_chat         = $_GET['my_chat']; //sender ID       
        $with            = $_GET['with'];   //receiver ID  
        $date_time       = $_GET['date_time'];
        
        $row_1 = sql($conn, "select * from chat where 
        ((from_id = ? and to_id = ?) or (from_id = ? and to_id = ?)) and date_time > ? order by (date_time) asc", 
        array($my_chat,$with,$with,$my_chat,$date_time), "rows"); 
        
        
        $msgs = array();
        $i = 0;
        $new_time_stamp = $date_time;
        
        
        
        foreach($row_1 as $row){
           
            $msgs[$i]['msg']        = $row['msg'];
            $msgs[$i]['date']  = date("d-M-Y",$row['date_time']);
            $msgs[$i]['time']  = date("h:i A",$row['date_time']);
            $msgs[$i]['from_id']    = $row['from_id'];
            $msgs[$i]['to_id']      = $row['to_id'];
            
            $i++;
            
            
            if($new_time_stamp < $row['date_time']){
                $new_time_stamp = $row['date_time'];
            }
        }
        
        
        $arr['data']        = $msgs;
        $arr['new_timestamp'] = $new_time_stamp;
             
    }
    //patient examination
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
        
        
        $row_1 = sql($conn, "update PatientDisease set 
        PC = ?, HOPC = ?, PMSH = ?, SH = ?, SR_CONS = ?, 
        SR_CNS = ?, SR_CVS = ?, SR_RESP = ?, SR_GASTRO = ?, SR_GENITO = ?,
        PHEX_HEADNECK = ?, PHEX_CHEST = ?, PHEX_HEART = ?, PHEX_ABDO = ?, PHEX_GENI = ?, 
        PHEX_EXTR = ?, LABS_ = ?, Histopathalogy = ?, Radiology = ?,TumorValue = ?, 
        LymphNode = ?, Metastatis = ?, IPIScoring = ?, histologicgrade = ?, stage = ?
        where PID = ?", array(
        $PC,$HOPC,$PMSH,$SH,$SR[0],
        $SR[1],$SR[2],$SR[3],$SR[4],$SR[5],
        $PHEX[0],$PHEX[1],$PHEX[2],$PHEX[3],$PHEX[4],
        $PHEX[5],$LAB,$HIS,$RAD,$TUM[0],
        $TUM[1],$TUM[2],$TUM[3],$TUM[4],$TUM[5],        
        $p_id), "count");  
        
        
        if($row_1 == 1){
            $arr['success'] = true;
        }else{       
            $arr['success'] = false;
        }            
    }
    //patient examination
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
                
                $row_pat_master = sql($conn, "select * from PatientMaster where PatientID = ?", array($row[0]), "rows"); 
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
        
        /*"AssesmentDX": null,
        "AssesmentStaging": null,
        "AssesmentScore": null,
        "AssesmentNote": null,
        "DiagnosedBy": "6",*/      
        
        
        $arr['data'] = $examination;             
    }
    else if($action == "clear"){
        sql($conn, "delete from tbl_Appointments_reservation", array(), "rows");  
        sql($conn, "delete from chat", array(), "rows");  
    } 
    else if($action == "manual"){
        $table = $_GET['table'];        
        $row = sql($conn, "select * from $table", array(), "rows");
        $arr = $row;
    }    
    
    
    
    
    
    
    die(json_encode($arr));



    require("connection/config_off.php");
?>