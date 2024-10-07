import React from 'react';
import ImageGallery from 'react-image-gallery';


const ComImage = ({ product,showThumbnails }) => {
    // const images = product.map(image => ({

    //     original: image.original,
    //     thumbnail: image.thumbnail,
    // }));

    return (
        <div>
            <ImageGallery thumbnailHeight={200} showThumbnails={showThumbnails} showFullscreenButton={false} showPlayButton={false} autoPlay={true} slideDuration={1000} slideInterval={4000}  items={product} />
        </div>
    );
};

export default ComImage;
