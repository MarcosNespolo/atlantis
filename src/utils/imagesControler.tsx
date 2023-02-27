import { ALERT_MESSAGE_CODE } from "./constants"

export async function uploadImage(image: File, name: string, bucket: string) {


    let fileExt = name.split('.')?.pop()?.toLowerCase() ?? 'jpg'

    console.log(fileExt)

    if (getMimeType(fileExt) == '') {
        return false
    }

    if (fileExt.toLowerCase() == 'heic' || fileExt.toLowerCase() == 'heif') {
        await convertImageHeic(image).then((fileConverted) => {
            image = fileConverted
            fileExt = 'jpeg'
        })
    }

    image = await resizeImage(URL.createObjectURL(image), { width: 1024, type: getMimeType(fileExt) }) as File
    image = await resizeImage(URL.createObjectURL(image), { height: 768, type: getMimeType(fileExt) }) as File

    const base64Image = await convertToBase64(image)


    const message = await Promise.all([fetch('/api/image', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ file: base64Image, name, bucket })
    }).then(res => {
        return res.json()
    }).then(result => {
        console.log(result)
        if (result?.hasOwnProperty('error') || !result?.aquarium) {
            console.log('Error na API:', result.error)
            return { message: result.error, code: ALERT_MESSAGE_CODE.DANGER }
        } else {
            return { message: result?.message, code: result?.code }
        }
    }
    )])

    return message
}

const convertToBase64 = (file: File) => {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result);
        }
    })
}

export function resizeImage(src: string, options: { width?: number, height?: number, type?: string, quality?: any }) {

    return loadImage(document.createElement('img'), src).then((image: CanvasImageSource) => {

        var canvas = document.createElement('canvas');

        if (options.width && !options.height) {
            options.height = Number(image.height) * (options.width / Number(image.width))
        } else if (!options.width && options.height) {
            options.width = Number(image.width) * (options.height / Number(image.height))
        }

        Object.assign(canvas, options);

        canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height);

        return new Promise(function (resolve) {
            canvas.toBlob(resolve, options.type || 'image/jpeg', options.quality)
        })
    })
}

export function loadImage(img: any, src: string): Promise<CanvasImageSource> {
    return new Promise((resolve, reject) => {
        img.src = src;
        img.completed ? resolve(img) : img.addEventListener('load', function () {
            resolve(img)
        });
        img.addEventListener('error', reject);
    })
}

export function getMimeType(extension: string, onlyImage?: boolean) {
    switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'jfif':
        case 'webp':
        case 'pjpeg':
        case 'pjp':
            return 'image/jpeg'
        case 'png':
            return 'image/png'
        case 'svg':
            return 'image/svg+xml'
        case 'heic':
            return 'image/heic'
        case 'gif':
            return 'image/gif'
        case 'tif':
        case 'tiff':
            return 'image/tiff'
        default:
            return ''
    }

}

async function convertImageHeic(file: Blob, type?: string) {
    const heic2any = require('heic2any')
    const imageBlob = await heic2any({
        blob: file,
        toType: type ? type : 'image/jpeg'
    });
    return new File([imageBlob as BlobPart], 'fileName')
}