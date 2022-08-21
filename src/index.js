import './css/styles.css';
import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  
let getGallery;
let page = 1;

const refs ={
    form: document.querySelector(".search-form"),
    input:document.querySelector("input"),
    getBtn: document.querySelector("button"),
    galleryBox: document.querySelector(".gallery"),
    loadBtn: document.querySelector(".load-more")
  }
  
refs.getBtn.addEventListener("click", onSumbitForm);
refs.loadBtn.addEventListener("click", onLoadBtn);
refs.loadBtn.style.display = "none";
  
function onSumbitForm(e) {
    page = 1;
    e.preventDefault()
    getGallery = refs.input.value;
    if(getGallery) {
      refs.galleryBox.innerHTML = "";
    }
    getPosts()
}
    
function onLoadBtn(e) {
    e.preventDefault();
    page +=1;
    getPosts();
}
  
const getPosts = async () => {
    try {
      if(getGallery !== "") {
        let response = await axios.get(`https://pixabay.com/api/?key=29421805-b7bf8868c688f05d7bddc62f0&q=${refs.input.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
  
        createList(response.data.hits);
        if (!response.data.hits.length) {
          error()
          refs.loadBtn.style.display = "none";
        }else{
          refs.loadBtn.style.display = "block";
        }
        }else{
          error()
          refs.loadBtn.style.display = "none";
      } 
    } 
    catch {
      console.log(error);
    }; 
}

function error() {
    Notiflix.Notify.warning("К сожалению, нет изображений, соответствующих вашему поисковому запросу. Пожалуйста, попробуйте еще раз"); 
}
    
function createList(data) {
    const result = data.map(({ webformatURL,  largeImageURL, tags, likes, views, comments, downloads}) => {
    return `
      <div class="photo-card">
        <div class="img-thumb">
            <a class="gallery_link" href="${webformatURL}">
            <img  class="gallery__image" 
             src="${largeImageURL}" alt="${tags }  loading="lazy" 
            />
          </a>
        </div>
          <div class="info">
            <p class="info-item">
              <b>likes:${likes}</b>
            </p>
            <p class="info-item">
              <b>views:${views}</b>
            </p>
            <p class="info-item">
              <b>comments:${comments}</b>
            </p>
            <p class="info-item">
              <b>downloads:${downloads}</b>
            </p>
          </div>
      </div>
    `;
    }).join('');
    
    refs.galleryBox.insertAdjacentHTML("beforeend", result);
    lightbox.refresh()
}
  


