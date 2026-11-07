import { useEffect, useState } from "react";
import { api } from "../api";

// Loads the category names from the database
export default function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api("/api/categories")
      .then((list) => setCategories(list.map((c) => c.name)))
      .catch(() => {});
  }, []);

  return categories;
}