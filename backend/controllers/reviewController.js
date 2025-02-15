import prisma from "../prisma/client.js";

/** Get all reviews */
export const getReviews = async (req, res) => {
  try {
    console.log("[DEBUG] Fetching all reviews...");
    const reviews = await prisma.review.findMany();
    res.json(reviews);
  } catch (error) {
    console.error("[ERROR] Error fetching reviews:", error);
    res.status(500).json({ error: "Error fetching reviews" });
  }
};

/** Create a new review */
export const createReview = async (req, res) => {
  try {
    console.log("[DEBUG] Received request:", req.body);

    const {
      photographer_id,
      customer_id,
      rating,
      review_text,
      recommended,
    } = req.body;

    if (!photographer_id || !customer_id || !rating) {
      console.log("[ERROR] Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newReview = await prisma.review.create({
      data: {
        photographer_id,
        customer_id,
        rating,
        review_text,
        recommended,
      },
    });

    console.log("[SUCCESS] Review created:", newReview);
    res.status(201).json(newReview);
  } catch (error) {
    console.error("[ERROR] Create Review Error:", error);
    res.status(500).json({ error: "Error creating review" });
  }
};
