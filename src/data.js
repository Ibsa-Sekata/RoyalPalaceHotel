export const rooms = [
  { id: 1, name: "Deluxe Room", type: "Deluxe", price: 6500, guests: 2, beds: "1 King Bed", size: "38 m²", status: "Available", image: "photo-1611892440504-42a792e24d32", description: "A calm, elegant retreat with warm finishes and a private balcony." },
  { id: 2, name: "Executive Suite", type: "Suite", price: 13000, guests: 2, beds: "1 King Bed", size: "62 m²", status: "Available", image: "photo-1590490360182-c33d57733427", description: "A generous suite with a separate lounge and thoughtful amenities." },
  { id: 3, name: "Presidential Suite", type: "Luxury", price: 25000, guests: 4, beds: "2 King Beds", size: "120 m²", status: "Booked", image: "photo-1611892440504-42a792e24d32", description: "Our signature residence for exceptional stays and special occasions." },
  { id: 4, name: "Garden View Room", type: "Deluxe", price: 7800, guests: 2, beds: "1 Queen Bed", size: "42 m²", status: "Available", image: "photo-1566665797739-1674de7a421a", description: "Relax in a light-filled room overlooking the hotel gardens." },
  { id: 5, name: "Royal Family Suite", type: "Family", price: 18500, guests: 5, beds: "2 Beds + Sofa", size: "88 m²", status: "Cleaning", image: "photo-1578683010236-d716f9a3f461", description: "Room to reconnect, with a separate living area for the family." },
  { id: 6, name: "Premium Twin", type: "Twin", price: 9200, guests: 2, beds: "2 Twin Beds", size: "45 m²", status: "Available", image: "photo-1595576508898-0ad5c879a061", description: "A refined twin room designed for comfort and convenience." }
];
export const bookings = [
  { id: "BK-1001", guest: "Abebe Kebede", room: "101", checkIn: "12/05/2025", checkOut: "15/05/2025", status: "Confirmed", amount: 19500 },
  { id: "BK-1002", guest: "Mekdes Alemu", room: "205", checkIn: "13/05/2025", checkOut: "16/05/2025", status: "Checked In", amount: 25000 },
  { id: "BK-1003", guest: "Yonas Tesfaye", room: "309", checkIn: "14/05/2025", checkOut: "17/05/2025", status: "Pending", amount: 13000 },
  { id: "BK-1004", guest: "Sara Ahmed", room: "412", checkIn: "15/05/2025", checkOut: "18/05/2025", status: "Confirmed", amount: 22500 },
  { id: "BK-1005", guest: "Daniel Kim", room: "508", checkIn: "16/05/2025", checkOut: "19/05/2025", status: "Cancelled", amount: 18000 }
];
export const revenueData = [
  { month: "Jan", revenue: 180 }, { month: "Feb", revenue: 240 }, { month: "Mar", revenue: 290 },
  { month: "Apr", revenue: 360 }, { month: "May", revenue: 310 }, { month: "Jun", revenue: 420 },
  { month: "Jul", revenue: 385 }
];
export const occupancyData = [
  { name: "Occupied", value: 86 }, { name: "Available", value: 32 }, { name: "Maintenance", value: 6 }
];
