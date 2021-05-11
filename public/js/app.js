$(document).ready(function () {
    $('#register-form').submit(function (e) {
        const registerForm = document.getElementsByClassName('register-form')[0]
        const userFirstName = registerForm.getElementsByClassName(
            'register-first-name'
        )[0].value
        const userLastName = registerForm.getElementsByClassName(
            'register-last-name'
        )[0].value
        const userEmail = registerForm.getElementsByClassName(
            'register-email'
        )[0].value
        const userPassword = registerForm.getElementsByClassName(
            'register-password'
        )[0].value
        const userConfirmPassword = registerForm.getElementsByClassName(
            'register-confirm-password'
        )[0].value

        if (userPassword === userConfirmPassword) {
            const userObj = new Object()
            userObj.userFirstName = userFirstName
            userObj.userLastName = userLastName
            userObj.userEmail = userEmail
            userObj.userPassword = userPassword
            userObj.userConfirmPassword = userConfirmPassword

            const userObjString = JSON.stringify(userObj)
            const userObjJson = JSON.parse(userObjString)

            e.preventDefault()

            $.ajax({
                url: 'api/user/register',
                type: 'POST',
                data: userObjJson,
                dataType: 'json',
                ContentType: 'application/json',
                success: function (data) {
                    if (data.message === 'OK') {
                        alert('User Created')
                        window.location.href = '/login'
                    } else {
                        alert('Error')
                    }
                },
            })
        }
    })
})

$(document).ready(function () {
    $('#login-form').submit(function (e) {
        const registerForm = document.getElementsByClassName('login-form')[0]
        const emailInput = registerForm.getElementsByClassName('login-email')[0]
            .value
        const passwordInput = registerForm.getElementsByClassName(
            'login-password'
        )[0].value

        const loginObj = new Object()
        loginObj.email = emailInput
        loginObj.password = passwordInput

        const loginObjString = JSON.stringify(loginObj)
        const loginObjJson = JSON.parse(loginObjString)

        e.preventDefault()

        $.ajax({
            url: 'api/user/login',
            type: 'POST',
            data: loginObjJson,
            dataType: 'json',
            ContentType: 'application/json',
            success: function (data) {
                if (data.message === 'OK') {
                    alert('User Logged In')
                    window.location.href = '/'
                } else {
                    alert('Error')
                }
            },
        })
    })
})

$(document).ready(function () {
    $('#update-profile-form').submit(function (e) {
        const updateProfileForm = document.getElementsByClassName(
            'update-profile-form'
        )[0]

        const firstNameInput = updateProfileForm.getElementsByClassName(
            'first-name'
        )[0].value

        let genderInput = ''

        console.log(firstNameInput)

        const gender = document.getElementsByName('gender')

        console.log(gender)

        for (i = 0; i < gender.length; i++) {
            if (gender[i].checked) {
                console.log(gender[i].value)
                genderInput = gender[i].value
                console.log(genderInput)
            }
        }

        const lastNameInput = updateProfileForm.getElementsByClassName(
            'last-name'
        )[0].value
        const emailInput = updateProfileForm.getElementsByClassName('email')[0]
            .value
        const addressInput = updateProfileForm.getElementsByClassName(
            'address'
        )[0].value
        const cityInput = updateProfileForm.getElementsByClassName('city')[0]
            .value
        const hobbieInput = updateProfileForm.getElementsByClassName(
            'hobbies'
        )[0].value
        const stateInput = updateProfileForm.getElementsByClassName('state')[0]
            .value
        const professionInput = updateProfileForm.getElementsByClassName(
            'profession'
        )[0].value
        const salaryInput = updateProfileForm.getElementsByClassName(
            'salary'
        )[0].value
        const sportInput = updateProfileForm.getElementsByClassName('sport')[0]
            .value

        const userUpdateObj = new Object()
        userUpdateObj.first_name = firstNameInput
        userUpdateObj.last_name = lastNameInput
        userUpdateObj.email = emailInput
        userUpdateObj.address = addressInput
        userUpdateObj.city = cityInput
        userUpdateObj.gender = genderInput
        userUpdateObj.hobbies = hobbieInput
        userUpdateObj.state = stateInput
        userUpdateObj.profession = professionInput
        userUpdateObj.salary = salaryInput
        userUpdateObj.sport = sportInput

        const updateObjString = JSON.stringify(userUpdateObj)
        const updateObjJson = JSON.parse(updateObjString)

        console.log(updateObjJson)

        e.preventDefault()

        $.ajax({
            url: 'api/user/edit_profile',
            type: 'POST',
            data: updateObjJson,
            dataType: 'json',
            ContentType: 'application/json',
            success: function (data) {
                if (data.message === 'OK') {
                    alert('User Profile Updated')
                    window.location.href = '/'
                } else {
                    alert('Error')
                }
            },
        })
    })
})

$(document).ready(function () {
    $('#change-password-form').submit(function (e) {
        const updatePasswordForm = document.getElementsByClassName(
            'change-password-form'
        )[0]
        const passwordInput = updatePasswordForm.getElementsByClassName(
            'password'
        )[0].value
        const confirmPasswordInput = updatePasswordForm.getElementsByClassName(
            'confirm-password'
        )[0].value

        const passwordObj = new Object()
        passwordObj.password = passwordInput

        if (passwordInput === confirmPasswordInput) {
            const passwordObj = new Object()
            passwordObj.password = passwordInput

            const passwordObjString = JSON.stringify(passwordObj)
            const passwordObjJson = JSON.parse(passwordObjString)
            e.preventDefault()

            $.ajax({
                url: 'api/user/change_password',
                type: 'POST',
                data: passwordObjJson,
                dataType: 'json',
                ContentType: 'application/json',
                success: function (data) {
                    if (data.message === 'OK') {
                        alert('Password Changed')
                        window.location.href = '/'
                    } else {
                        alert('Error')
                    }
                },
            })
        }
    })
})
