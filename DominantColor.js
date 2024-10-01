import logo from './logo.svg';
import './DominantColor.css';
import React, { useState, useRef } from "react";
import ColorThief from "colorthief";

function DominantColor() {
  const [dominantColor, setDominantColor] = useState(null);
  const [image, setImage] = useState(null);
  const imgRef = useRef(null);

  // Handles the image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const imageURL = URL.createObjectURL(file);
    setImage(imageURL);
  };
  
  // Uses colorThief to find the dominant color of the image
  const getColor = () => {
    const colorThief = new ColorThief();
    const image = imgRef.current;

    if (image.complete) {
      const color = colorThief.getColor(image);
      setDominantColor(color);
    } else {
      image.onload = () => {
        const color = colorThief.getColor(image);
        setDominantColor(color);
      };
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Dominant Color Finder</h1>
      
      {/* Input for uploading an image */}
      <input type="file" accept="image/*" onChange={handleImageChange} />
      
      {/* Image view */}
      {image && (
        <div>
          <img
            src={image}
            ref={imgRef}
            crossOrigin="anonymous"
            alt="Uploaded"
            style={{ maxWidth: "500px", margin: "20px auto" }}
          />
          <button onClick={getColor}>Find Dominant Color</button>
        </div>
      )}
      
      {/* Dominant color frame w/ color vals */}
      {dominantColor && (
        <div>
          <h2>Dominant Color:</h2>
          <div
            style={{
              backgroundColor: `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`,
              width: "50px",
              height: "50px",
              margin: "0 auto",
            }}
          />
          <p>RGB: {dominantColor.join(", ")}</p>
          <p>HEX: #{dominantColor.map((c) => c.toString(16).padStart(2, "0")).join("")}</p>
        </div>
      )}
    </div>
  );
}

export default DominantColor;