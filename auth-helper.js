window.onload = () => {
    console.log('loaded');
    if (document.readyState === "complete") {
        document.getElementById('phone-number').value = localStorage.getItem('cph');
    }
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    recaptchaVerifier.render().then(function (widgetId) {
        window.recaptchaWidgetId = widgetId;
    });
    //getElementById('sign-in-button').addEventListener('click', handleSubmit);
}

function handleSubmit(e) {
    console.log('e', e);
    sendCode();
}

let x = null;

function sendCode() {
    var phoneNumber = '+880' + document.getElementById('phone-number').value;
    var appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function (confirmationResult) {
            console.log('sms sent');
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            console.log(confirmationResult);
            x = confirmationResult;
            document.getElementById('enter-code').classList.remove('d-none');
            document.getElementById('recaptcha-container').classList.add('d-none');

        }).catch(function (error) {
            // Error; SMS not sent
            console.log(error);
        });
}

function confirmCode() {
    let confirmationResult = x;
    let code = document.getElementById('v-code').value;
    confirmationResult.confirm(code).then(function (result) {
        // User signed in successfully.
        var user = result.user;
        // ...
        console.log('success!', user);
        document.getElementById('lins').classList.remove('d-none');
        document.getElementById('linf').classList.add('d-none');
    }).catch(function (error) {
        // User couldn't sign in (bad verification code?)
        // ...
        document.getElementById('linf').classList.remove('d-none');
        document.getElementById('lins').classList.add('d-none');

        document.getElementById('resend-div').classList.add('d-flex');
        document.getElementById('resend-div').classList.add('justify-content-center');
        document.getElementById('resend-div').classList.remove('d-none');
        console.log(error);
    });
}

function tryAgain() {
    let phn = document.getElementById('phone-number').value;
    localStorage.setItem('cph', phn);
    location.reload();
}

function signOut() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
}