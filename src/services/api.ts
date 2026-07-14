import { Resource, Booking, Ticket, Notification } from "../types";

const API_BASE = "/api";

export const apiService = {
  // Resources
  async getResources(): Promise<Resource[]> {
    const res = await fetch(`${API_BASE}/resources`);
    if (!res.ok) throw new Error("Failed to fetch resources");
    return res.json();
  },

  async createResource(resource: Partial<Resource>): Promise<Resource> {
    const res = await fetch(`${API_BASE}/resources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resource),
    });
    if (!res.ok) throw new Error("Failed to create resource");
    return res.json();
  },

  async searchResources(query: string): Promise<Resource[]> {
    const resources = await this.getResources();
    return resources.filter(r => 
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.location.toLowerCase().includes(query.toLowerCase()) ||
      r.type.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Bookings
  async getBookings(): Promise<Booking[]> {
    const res = await fetch(`${API_BASE}/bookings`);
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
  },

  async createBooking(booking: Partial<Booking>): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
    if (!res.ok) throw new Error("Failed to create booking");
    return res.json();
  },

  // Tickets
  async getTickets(): Promise<Ticket[]> {
    const res = await fetch(`${API_BASE}/tickets`);
    if (!res.ok) throw new Error("Failed to fetch tickets");
    return res.json();
  },

  async createTicket(ticket: Partial<Ticket>): Promise<Ticket> {
    const res = await fetch(`${API_BASE}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket),
    });
    if (!res.ok) throw new Error("Failed to create ticket");
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return res.json();
  },

  async createNotification(notification: Partial<Notification>): Promise<Notification> {
    const res = await fetch(`${API_BASE}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification),
    });
    if (!res.ok) throw new Error("Failed to create notification");
    return res.json();
  },

  async markNotificationAsRead(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to mark notification as read");
  },

  async deleteNotification(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/notifications/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete notification");
  }
};
