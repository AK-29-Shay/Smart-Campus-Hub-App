export type ResourceType = "LECTURE_HALL" | "LAB" | "MEETING_ROOM" | "EQUIPMENT";
export type ResourceStatus = "ACTIVE" | "OUT_OF_SERVICE";

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  capacity: number;
  location: string;
  availability: string;
  status: ResourceStatus;
}

export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface Booking {
  id: string;
  resourceId: string;
  userId: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendees: number;
  status: BookingStatus;
  rejectionReason?: string;
  createdAt: string;
}

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "REJECTED";

export interface Ticket {
  id: string;
  resourceId: string;
  location: string;
  category: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  reporterId: string;
  assigneeId?: string;
  images: string[];
  resolutionNotes?: string;
  createdAt: string;
}

export type UserRole = "USER" | "ADMIN" | "TECHNICIAN";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: string;
}
