export type DropStatus = "ACTIVE" | "SCHEDULED" | "ENDED" | "DRAFT" | string;

export function isDropActive(status: DropStatus) {
  return status === "ACTIVE";
}

export function isDropSoldOut(availableStock: number) {
  return availableStock <= 0;
}

export function dropStatusLabel(status: DropStatus) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "SCHEDULED":
      return "Scheduled";
    case "ENDED":
      return "Ended";
    case "DRAFT":
      return "Draft";
    default:
      return status;
  }
}
