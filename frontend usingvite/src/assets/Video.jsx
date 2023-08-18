import React, { useState } from 'react';

function VideoUploader() {
    const [videoUrl, setVideoUrl] = useState('');

    const handleVideoChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const videoUrl = URL.createObjectURL(selectedFile);
            setVideoUrl(videoUrl);
        }
    };

    const handleConvertAndUse = () => {
        console.log('Video URL:', videoUrl);
        // Now you can use the 'videoUrl' in your application
    };

    return (
        <div>
            <input type="file" accept="video/*" onChange={handleVideoChange} />
            {videoUrl && <video src={videoUrl} controls style={{ maxWidth: '100%' }} />}
            <button onClick={handleConvertAndUse}>Convert and Use</button>
        </div>
    );
}

export default VideoUploader;
