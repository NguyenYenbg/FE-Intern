
//1.slider
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n){
    showSlides(slideIndex += n);
}

function currentSlide(n){
    showSlides(slideIndex = n);
}

function showSlides(n){
    var i;
    var slides=document.getElementsByClassName("header-slider__item");
    var dots=document.getElementsByClassName("dot");
    if(n > slides.length){
        slideIndex =1;
    }
    if(n < 1){
        slideIndex=slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display="none";
    }
    for(i=0; i< dots.length; i++){
        dots[i].className=dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display="block";
    dots[slideIndex-1].className += " active";
}



//2.scroll back to top btn
var topBtn=document.getElementById("topBtn");
//when user scroll down 20px from top, show the btn
window.onscroll=function(){
    scrollFunction()
};

function scrollFunction(){
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20){
        topBtn.style.display = "block";
    }else{
        topBtn.style.display="none";
    }
}

//when user click on the btn, scroll to the top
function topFunction(){
    document.body.scrollTop=0;
    document.documentElement.scrollTop=0;
}

