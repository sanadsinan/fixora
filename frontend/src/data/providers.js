// Dummy data for now. Later this will come from the backend.
export const providers = [
  {
    id: 1, name: "Rahul Nair", service: "Plumbing", location: "Kochi", rating: 4.8, price: 300,
    description: "Pipe repairs, leak fixing, tap and bathroom fittings. 8 years of experience. Available 8 AM to 6 PM, Monday to Saturday.",
  },
  {
    id: 2, name: "Anil Kumar", service: "Electrical", location: "Kakkanad", rating: 4.7, price: 350,
    description: "Wiring, switchboard repair, fan and light installation. 6 years of experience. Available 9 AM to 7 PM.",
  },
  {
    id: 3, name: "Maya Joseph", service: "Cleaning", location: "Edappally", rating: 4.9, price: 500,
    description: "Full home deep cleaning, kitchen and bathroom cleaning. Own equipment included. Available 7 AM to 5 PM.",
  },
  {
    id: 4, name: "Suresh Babu", service: "Carpentry", location: "Aluva", rating: 4.6, price: 450,
    description: "Furniture repair, door and window fitting, custom shelves. 10 years of experience.",
  },
  {
    id: 5, name: "Faisal M", service: "AC Repair", location: "Kochi", rating: 4.8, price: 600,
    description: "AC servicing, gas refill and installation for all major brands. Same-day visits available.",
  },
  {
    id: 6, name: "Joby Thomas", service: "Painting", location: "Thrippunithura", rating: 4.5, price: 400,
    description: "Interior and exterior painting, wall putty and polish. Free colour suggestions.",
  },
  {
    id: 7, name: "Sreeja P", service: "Cleaning", location: "Kakkanad", rating: 3.9, price: 350,
    description: "Regular home cleaning and move-in or move-out cleaning.",
  },
  {
    id: 8, name: "Nikhil Raj", service: "Plumbing", location: "Aluva", rating: 4.2, price: 280,
    description: "Drain cleaning, water tank and motor repair, bathroom fittings.",
  },
];

export const reviews = [
  { id: 1, providerId: 1, customer: "Arun S", rating: 5, comment: "Came on time and fixed the leak in half an hour." },
  { id: 2, providerId: 1, customer: "Divya M", rating: 4.5, comment: "Neat work and fair price. Would book again." },
  { id: 3, providerId: 2, customer: "Hari K", rating: 5, comment: "Solved a wiring problem that two others could not." },
  { id: 4, providerId: 3, customer: "Neha R", rating: 5, comment: "The house looked brand new. Very professional." },
  { id: 5, providerId: 3, customer: "Joseph T", rating: 4.5, comment: "Thorough cleaning, finished earlier than expected." },
];

export const categories = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Carpentry",
  "AC Repair",
  "Painting",
];