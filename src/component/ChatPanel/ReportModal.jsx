import React from 'react';
import { Modal, Form, FloatingLabel, Button } from 'react-bootstrap';

const ReportModal = ({
  setIsShowReportModal,
  isShowReportModal,
  handleSubmitReport,
  reason,
  handleChangeReason,
  reportReasons,
  setComment,
  comment,
  error,
}) => {
  return (
    <Modal
      show={isShowReportModal}
      onHide={() => setIsShowReportModal(false)}
      centered
      className="radius_30 max-648"
    >
      <Modal.Header closeButton className="new_modal_close"></Modal.Header>
      <Modal.Body className="space_modal">
        <div className="modal_inner_content">
          {/* Icon Section */}
          <div className="icon_top_circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="45"
              height="40"
              viewBox="0 0 45 40"
              fill="none"
            >
              <path
                d="M18.7931 1.88097L0.504374 33.5556C0.174015 34.1276 6.11423e-05 34.7765 1.6115e-08 35.4371C-6.11101e-05 36.0976 0.173773 36.7465 0.504026 37.3186C0.834278 37.8907 1.30931 38.3657 1.88137 38.696C2.45342 39.0262 3.10234 39.2001 3.76289 39.2H40.3373C40.9979 39.2001 41.6468 39.0262 42.2189 38.696C42.7909 38.3657 43.2659 37.8907 43.5962 37.3186C43.9265 36.7465 44.1003 36.0976 44.1002 35.4371C44.1002 34.7765 43.9262 34.1276 43.5959 33.5556L25.3091 1.88097C24.9789 1.30908 24.504 0.834182 23.9321 0.504003C23.3602 0.173824 22.7115 0 22.0511 0C21.3907 0 20.742 0.173824 20.1701 0.504003C19.5982 0.834182 19.1233 1.30908 18.7931 1.88097Z"
                fill="#EE404C"
              />
              <path
                d="M22.2874 11.6514H21.8103C20.6357 11.6514 19.6836 12.6035 19.6836 13.7781V23.9433C19.6836 25.1179 20.6357 26.07 21.8103 26.07H22.2874C23.4619 26.07 24.4141 25.1179 24.4141 23.9433V13.7781C24.4141 12.6035 23.4619 11.6514 22.2874 11.6514Z"
                fill="#FFF7ED"
              />
              <path
                d="M22.0488 34.1309C23.3551 34.1309 24.4141 33.0719 24.4141 31.7656C24.4141 30.4593 23.3551 29.4004 22.0488 29.4004C20.7425 29.4004 19.6836 30.4593 19.6836 31.7656C19.6836 33.0719 20.7425 34.1309 22.0488 34.1309Z"
                fill="#FFF7ED"
              />
            </svg>
          </div>

          {/* Title Section */}
          <div className="modal_top_title">
            <h2>Report This Buyer</h2>
            <p>Addressing Buyer Misconduct for Resolution</p>
          </div>

          {/* Form Section */}
          <Form onSubmit={handleSubmitReport} className="modal_inner_form">
            {/* Reason Dropdown */}
            <Form.Group className="mb-3 text-start">
              <Form.Label className="offer_label">Reason For Report</Form.Label>
              <Form.Select
                aria-label="Select a reason"
                value={reason}
                onChange={handleChangeReason}
              >
                <option value="">Select a reason</option>
                {reportReasons.map((data, index) => (
                  <option value={data.id} key={index}>
                    {data.name}
                  </option>
                ))}
              </Form.Select>
              {error && <div className="text-danger mt-1">{error}</div>}
            </Form.Group>

            {/* Comment Section */}
            <Form.Group className="mb-3 text-start">
              <Form.Label className="offer_label">Comment</Form.Label>
              <FloatingLabel controlId="floatingTextarea2">
                <Form.Control
                  as="textarea"
                  placeholder="Write your comment here"
                  style={{ height: '100px' }}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>

            {/* Submit Button */}
            <Form.Group className="d-flex justify-content-end">
              <Button
                variant="primary"
                type="submit"
                className="w-100 btn-fill"
              >
                Submit
              </Button>
            </Form.Group>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ReportModal;
