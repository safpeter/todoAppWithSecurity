const formElem = document.getElementById("form");
const username = document.getElementById("username");
const password = document.getElementById("password");
const submit = document.getElementById("submitBtn");

const data = new URLSearchParams();

function submiting(){
    submit.onclick = async (e) => {
        e.preventDefault();
        console.log("hello");

        let response = await fetch('/auth/signin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        });

        let result = await response.json();
        console.log(result);
        localStorage.setItem('token', result["token"]);
        console.log("localstorage: ");

    };
}

submiting();

