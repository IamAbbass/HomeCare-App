 ;(function(window) {
    'use strict';

    const MESSAGES = {
        'login': 'Login as any user on this computer and another user on another computer.',
        'create_session': 'Creating a session...',
        'connect': 'Connecting...',
        'connect_error': 'Something went wrong with the connection. Check internet connection or user info and try again.',
        'login_as': 'Logged in as ',
        'title_login': 'Choose a user to login with:',
        'title_callee': 'Choose users to call:',
        'calling': 'Calling...',
        'webrtc_not_avaible': 'WebRTC is not available in your browser',
        'no_internet': 'Please check your Internet connection and try again'
    };

    /*const CC_CREDENTIALS = {
        appId: 385,
        authKey: 'DFBMs5-dKBBCXcd',
        authSecret: 'SkCW-ThdnmRg9Za'
    };*/

    //PAHS
    const CC_CREDENTIALS = {
      appId: 1237,
      authKey: 'KyNVuU8tSeOYf39',
      authSecret: 'E6yhBsqtkyfkUV5'
    };
    
    const CC_CONFIG = {
        // endpoints: {
        //     api: "",
        //     chat: ""
        // },
        debug: true,
        videocalling: {
            answerTimeInterval: 30,
            dialingTimeInterval: 5,
            disconnectTimeInterval: 35,
            statsReportTimeInterval: 5
        }
    };

    const CC_USERS = [
      {
        id: 206534,
        login: "doctor",
        password: "doctor12"
      },
      {
        id: 206533,
        login: "patient",
        password: "patient1"
      }
    ];

    window.CONFIG = {
        'CREDENTIALS': CC_CREDENTIALS,
        'APP_CONFIG': CC_CONFIG,
        'USERS': CC_USERS,
        'MESSAGES': MESSAGES
    };
}(window));
