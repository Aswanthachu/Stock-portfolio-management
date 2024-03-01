import ticketFaq from "../../models/ticketFaq.js";

export const addFaqTicket = async (req, res) => {
  try {
    const { category, subject, description } = req.body;
    if (!category || !subject || !description)
      return res.status(400).json("missing datas");

    const newTicket = await ticketFaq.create({
      category,
      subject,
      description,
    });

    if(!newTicket) return res.status(400).json({message:"Error while creating new faq ticket."})

    res.status(200).json({ message: "successfully created new FAQ." });
  } catch (error) {
    console.log(error);
    res.status(500).json({error:error.message,message:"Internal server error while creating new faq ticket."});
  }
};

export const getFaqTickets = async (req, res) => {
  try {
    const ticketFaqs = await ticketFaq.find();

    if(!ticketFaqs.length) return res.status(401).json({message:"No faq tickets found"})
    res
      .status(200)
      .json({ message: "successfully fetached ticket faq data.", ticketFaqs });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Server error while fetching ticket faq data.",error:error.message});
  }
};
