import React from "react";
import HorizontalLinearStepper from "./StepperForm/HorizontalLinearStepper";
const MultiStepForm = () => {
  return (
    <>
      <section className="main-section position-relative pt-4 pb-120">
        <div className="container position-relative">
          {" "}
          <HorizontalLinearStepper />
        </div>
      </section>
    </>
  );
};

export default MultiStepForm;
