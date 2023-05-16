var follow = $('.follow-btn').click((e) => {
    let btn = e.currentTarget

    if($(btn).hasClass('clicked')) {
        $(btn).removeClass('clicked')
    } else {
        $(btn).addClass('clicked');
    }
})