import React from 'react';
import ImageGallery from 'react-image-gallery';


const ComImageHome = ({ product, showThumbnails }) => {
    // const images = product.map(image => ({

    //     original: image.original,
    //     thumbnail: image.thumbnail,
    // }));

    return (
        <div>
            {/* <ImageGallery thumbnailHeight={200} showThumbnails={showThumbnails} showFullscreenButton={false} showPlayButton={false} autoPlay={true} slideDuration={1000} slideInterval={4000}  items={product} /> */}

            <div id="indicators-carousel" class="relative w-full" data-carousel="static">

                <div class="relative h-56 overflow-hidden rounded-lg md:h-96">

                    <div class="hidden duration-700 ease-in-out" data-carousel-item="active">
                        <img src="https://firebasestorage.googleapis.com/v0/b/swd-longchim.appspot.com/o/images%2Flovepik-birds-in-the-cage-picture_500385209.jpg?alt=media&token=ca4b297f-16e2-485d-8a3d-163044c68507" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..." />
                    </div>


                    {product.map((e, index) => (
                        <div class="hidden duration-700 ease-in-out" data-carousel-item>
                            <img src='https://firebasestorage.googleapis.com/v0/b/swd-longchim.appspot.com/o/images%2Flovepik-birds-in-the-cage-picture_500385209.jpg?alt=media&token=ca4b297f-16e2-485d-8a3d-163044c68507' class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..." />
                        </div>
                    ))}
                </div>
                <div class="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
                    <button type="button" class="w-3 h-3 rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
                    <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
                    <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
                    <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 4" data-carousel-slide-to="3"></button>
                    <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 5" data-carousel-slide-to="4"></button>
                </div>
                <button type="button" class="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
                    <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30   group-hover:bg-white/50   group-focus:ring-4 group-focus:ring-white  group-focus:outline-none">
                        <svg class="w-4 h-4 text-white  " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
                        </svg>
                        <span class="sr-only">Previous</span>
                    </span>
                </button>
                <button type="button" class="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
                    <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30   group-hover:bg-white/50   group-focus:ring-4 group-focus:ring-white  group-focus:outline-none">
                        <svg class="w-4 h-4 text-white  " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                        </svg>
                        <span class="sr-only">Next</span>
                    </span>
                </button>
            </div>


        </div>
    );
};

export default ComImageHome;
