const API_URL = process.env.NEXT_PUBLIC_API_URL; // Use NEXT_PUBLIC_API_URL

export const categoryService = {
  getCategorys: async function () {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      // console.log("from category service -----", data);
      return { data: data, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something went wrong" } };
    }
  },
};