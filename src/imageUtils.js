import imageCompression from 'browser-image-compression';

export const compressStoredImage = async () => {
    const options = {
        maxSizeMB: 1,
    }

    try {
        const storedImageUrl = window.localStorage.getItem('croppedImage');
        const blob = await (await fetch(storedImageUrl)).blob();
        return await imageCompression(blob, options);
    } catch (error) {
        console.log(error);
        window.alert(error);
    }
}


const createImage = (url) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', error => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });
}


export const getCroppedImage = async (imageSrc, crop) => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d');

    canvas.width = 1500;
    canvas.height = 1500;

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        canvas.width,
        canvas.height
    )

    return canvas.toDataURL("image/jpeg");
}