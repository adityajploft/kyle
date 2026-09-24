import { toast } from "react-toastify";

const getAcceptedStatus = (record) =>
  record?.is_seller_accepted ??
  record?.buyer_deal_details?.is_seller_accepted ??
  record?.property_details?.is_seller_accepted ??
  record?.seller_accepted_status ??
  record?.seller_accept_status;

export const isSellerAcceptedStatus = (status) =>
  ["accepted", "approved"].includes(String(status ?? "").toLowerCase());

export const isSellerRejectedStatus = (status) =>
  ["reject", "rejected"].includes(String(status ?? "").toLowerCase());

export const hasSellerAccepted = (record) => {
  const status = getAcceptedStatus(record);
  return status != null && isSellerAcceptedStatus(status);
};

export const hasBuyerProofOfFundDocument = (record) =>
  Boolean(
    record?.pof_document ||
      record?.proof_of_fund ||
      record?.proof_of_funds ||
      record?.proof_of_fund_document ||
      record?.proof_of_funds_document,
  );

export const hasBuyerProofOfFund = (record) =>
  Boolean(
    record?.is_proof_of_fund_verified ||
      record?.proof_of_fund_verified ||
      record?.proof_of_funds_verified ||
      hasBuyerProofOfFundDocument(record),
  );

export const shouldShowSellerApprovalStatus = (record) => {
  const status = String(record?.status ?? "").toLowerCase().trim();
  return ["interested", "want_to_buy"].includes(status);
};

export const showSellerApprovalToast = (
  message = "Matched Deal status updated successfully."
) => {
  const toastId = "seller-approval-status-toast";

  if (toast.isActive(toastId)) {
    return;
  }

  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    toastId,
  });
};

export const showSellerPendingToast = (
  message = "Seller has not accepted yet."
) => {
  const toastId = "seller-approval-pending-toast";

  if (toast.isActive(toastId)) {
    return;
  }

  toast.info(message, {
    position: toast.POSITION.TOP_RIGHT,
    toastId,
  });
};

export const showSellerRejectedToast = (
  message = "Seller has rejected the offer"
) => {
  const toastId = "seller-approval-rejected-toast";

  if (toast.isActive(toastId)) {
    return;
  }

  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    toastId,
  });
};

export const guardSellerAccepted = (
  record,
  message = "Seller has not accepted yet."
) => {
  if (hasSellerAccepted(record)) {
    return true;
  }

  const status = getAcceptedStatus(record);
  if (status != null) {
    if (isSellerRejectedStatus(status)) {
      showSellerRejectedToast();
    } else {
      showSellerPendingToast(message);
    }
  } else {
    showSellerPendingToast(message);
  }

  return false;
};
