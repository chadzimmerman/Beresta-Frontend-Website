import React from "react";
import treebanner from "../assets/treebanner.jpg";

function Banner() {
  return (
    <div className="banner-container">
      <img src={treebanner} alt="Slavic Trees" className="banner-image" />
    </div>
  );
}

export default Banner;
