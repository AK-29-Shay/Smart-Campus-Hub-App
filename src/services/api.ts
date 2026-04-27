import { Resource, Booking, Ticket, Notification } from "../types";

const API_BASE = "/api";

export const apiService = {
  // Resources
  async getResources(): Promise<Resource[]> {
    const res = await fetch(`${API_BASE}/resources`);
    if (!res.ok) throw new Error("Failed to fetch resources");
    return res.json();
  },

  // In a real app, these would hit the server which interacts with Firestore
  // For this environment, we'll implement some logic directly in the frontend 
  // or via express endpoints.
  
  async searchResources(query: string): Promise<Resource[]> {
    const resources = await this.getResources();
    return resources.filter(r => 
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.location.toLowerCase().includes(query.toLowerCase()) ||
      r.type.toLowerCase().includes(query.toLowerCase())
    );
  }
};
