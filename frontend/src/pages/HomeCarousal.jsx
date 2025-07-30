import React from 'react'
import { Carousel } from 'react-bootstrap';

const HomeCarousal = () => {
    return (
        <Carousel data-bs-theme="dark">
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src= {"https://th.bing.com/th/id/OIP.dNpvEfhSkMN7eZPbSq5YHgHaDl?w=349&h=169&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"}
                    alt="First slide"
                />
                <Carousel.Caption>
                    <h5>First slide label</h5>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src= {"https://th.bing.com/th/id/OIP.7KQBAiLzGzcMBkDIF0CyCwHaE7?w=267&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"}
                    alt="Second slide"
                />
                <Carousel.Caption>
                    <h5>Second slide label</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src= {"https://th.bing.com/th/id/OIP.QT-gegCmL1M8ZH5Zl-C4qgHaE8?w=266&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"}
                    alt="Third slide"
                />
                <Carousel.Caption>
                    <h5>Third slide label</h5>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                    </p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    )
}

export default HomeCarousal;