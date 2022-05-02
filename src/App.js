import { useCallback, useState } from 'react';
import './App.css';
import Cropper from 'react-easy-crop';
import { saveAs } from 'file-saver';
import { compressStoredImage, getCroppedImage } from './imageUtils';

function App() {

  const [imageSrc, setImageSrc] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);


  const onSelectFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImageSrc(reader.result.toString() || ''),
      )
      reader.readAsDataURL(event.target.files[0])
    }
  }


  const onCropComplete = useCallback(async (croppedArea, croppedAreaPixels) => {
    const croppedImg = await getCroppedImage(imageSrc, croppedAreaPixels);
    window.localStorage.setItem('croppedImage', croppedImg);
  }, [imageSrc]);


  const onSaveCrop = async () => {
    const finalImage = await compressStoredImage();
    saveAs(finalImage);
  }


  return (
    <div className="App">
      <header className="App-header">
        <p>
          {'1. Allow user to upload image.'}
        </p>
        <p>
          {'2. Allow user to crop image to a square.'}
        </p>
        <p>
          {'3. Compress the image such that it is less than 1 mb and save it locally.'}
        </p>
        <p>
          {'You can use any packages. Styling is not so important.'}
        </p>

        <div className='action-buttons--inline'>
          <input type="file" accept="image/*" onChange={onSelectFile} />
          {imageSrc && <button onClick={onSaveCrop}>Compress & save</button>}
        </div>

        {imageSrc && (
          <>
            <label className='crop-box-annotation'>
              (Use the slider below to zoom)
            </label>
            <div className="crop-container">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="controls">
              <input
                type="range"
                min="1"
                max="3"
                value={zoom}
                onChange={(event) => { setZoom(event.target.value) }}
                step="0.1"
              />
            </div>
          </>
        )}

      </header>
    </div >
  );

}

export default App;
