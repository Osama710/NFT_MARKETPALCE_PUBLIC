

  import "slick-carousel/slick/slick.css"; 
  import "slick-carousel/slick/slick-theme.css";

//Demo slider 
import React, { Component } from "react"; 
import Slider from "react-slick";



class AsNavFor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null
    };
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
  }

  render() {
    return (
      <div>
        <Slider
          asNavFor={this.state.nav2}
          ref={slider => (this.slider1 = slider)}
        >
          <div>
          <video width="100%" >
        <source src="/images/items/TWD-Trailer.mp4" type="video/mp4" />
        <source src="/images/items/TWD-Trailer.mp4" type="video/ogg" />
      </video>
          </div>
          <div >
            <img src="/images/items/TWD-Trailer2.jpeg" alt="img" />
          </div>
          <div>
            <img src="/images/items/TWD-Trailer3.jpeg" alt="img" />
          </div>
          <div>
            <img src="/images/items/TWD-Trailer4.jpeg" alt="img" />
          </div>
          <div>
            <img src="/images/items/TWD-Trailer5.jpeg" alt="img" />
          </div>
        </Slider>
        <Slider
          asNavFor={this.state.nav1}
          ref={slider => (this.slider2 = slider)}
          slidesToShow={3}
          swipeToSlide={true}
          focusOnSelect={true}
          arrows={false}
        >
          <div className='nav-btn'>
            <img src="/images/items/twd_banner.jpg" alt="img" />
          </div>
          <div className='nav-btn'>
            <img src="/images/items/TWD-Trailer2.jpeg" alt="img" />
          </div>
          <div className='nav-btn'>
            <img src="/images/items/TWD-Trailer3.jpeg" alt="img" />
          </div>
          <div className='nav-btn'>
            <img src="/images/items/TWD-Trailer4.jpeg" alt="img" />
          </div>
          <div className='nav-btn'>
            <img src="/images/items/TWD-Trailer5.jpeg" alt="img" />
          </div>
        </Slider>
      </div>
    );
  }
}

function gallery_slider(){
        return (
            <div className='gallery-slider'>
          <AsNavFor />
          </div>
        );
}

export default gallery_slider;