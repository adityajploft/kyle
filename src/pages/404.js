import React from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <section className='error_page main-section position-relative'>
      <Container>
        <Row className="justify-content-center">
            <Col sm={12} md={8} lg={8}>
                <div className='error_pageContent card-box text-center mt-0'>
                    <Image src='/assets/images/404image.svg' alt="404image" />
                    <h2>Page Not Found</h2>
                    <Link className='btn btn-fill w-auto' to={'/'}>Back to home</Link>
                </div>
            </Col>
        </Row>
      </Container>
    </section>
  )
}

export default ErrorPage;