let post_id_button = document.querySelector(".post_id_button");


// Get a post by it's id
post_id_button.addEventListener("click", (e) => {
    let post_id = document.querySelector(".get_post_id").value;
    let numbers_only = /^[0-9.,]+$/.test(post_id)
    
    if(!numbers_only){
        document.querySelector(".get_post_id").value = ""
        return;
    }
    
    let url = "http://localhost:3000/blog-posts/" + post_id;
    console.log(url)
    location.href = url;
});

let update_post_button = document.querySelector(".update_post_button");

update_post_button.addEventListener('click', (e) => {
    let post_id = document.querySelector(".update_post_id").value;
    let update_post_title = document.querySelector(".update_post_title").value;
    let update_post_contents = document.querySelector(".update_post_contents").value;

    let updated_post = {
        id : post_id,
        title : update_post_title,
        contents : update_post_contents
    };
    
    let url = "http://localhost:3000/blog-posts/" + post_id;

    fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(updated_post),
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => {
        if(response.status != 200)
            return;
        return response.json()})
    .then((json) => {
        // Update the local post since server succeded
        console.log("Update it now")
        console.log(json);
        let post = document.getElementById(post_id);
        children = post.children;
        console.log(children[0].innerHTML)
        let index = children[0].innerHTML.indexOf(":");
        let old = children[0].innerHTML.substring(0, index + 2);
        children[0].innerHTML = old + json.title;
        children[1].innerHTML = json.content;
    })
});
