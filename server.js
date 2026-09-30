const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ================================
// MIDDLEWARE
// ================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ================================
// GMAIL TRANSPORTER
// ================================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});


// ================================
// TEST ROUTE
// ================================

app.get("/", (req, res) => {
  res.send("STARKIVE Backend is running 🚀");
});


// ================================
// INQUIRY ROUTE
// ================================

app.post("/api/inquiry", async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      company,
      service,
      message
    } = req.body;


    // Basic validation

    if (!name || !email || !message) {

      return res.status(400).json({
        success: false,
        message: "Name, email and message are required."
      });

    }


    // ================================
    // EMAIL CONTENT
    // ================================

    const mailOptions = {

      from: `"STARKIVE Website" <${process.env.EMAIL_USER}>`,

      to: process.env.EMAIL_TO,

      replyTo: email,

      subject: `New Business Enquiry — ${name}`,

      html: `

        <div style="
          font-family:Arial,sans-serif;
          max-width:650px;
          margin:auto;
          padding:20px;
        ">

          <h2 style="color:#1677ff;">
            🚀 New STARKIVE Enquiry
          </h2>

          <hr>

          <p>
            <strong>Name:</strong>
            ${name}
          </p>

          <p>
            <strong>Email:</strong>
            ${email}
          </p>

          <p>
            <strong>Phone:</strong>
            ${phone || "Not provided"}
          </p>

          <p>
            <strong>Company:</strong>
            ${company || "Not provided"}
          </p>

          <p>
            <strong>Service:</strong>
            ${service || "Not specified"}
          </p>

          <h3>
            Message
          </h3>

          <p style="
            background:#f5f5f5;
            padding:15px;
            border-radius:8px;
            white-space:pre-wrap;
          ">
            ${message}
          </p>

          <hr>

          <p>
            <strong>STARKIVE</strong>
            <br>
            YOUR BRAND. OUR MISSION.
          </p>

        </div>

      `
    };


    // ================================
    // SEND EMAIL
    // ================================

    await transporter.sendMail(mailOptions);


    // ================================
    // SUCCESS RESPONSE
    // ================================

    res.status(200).json({

      success: true,

      message: "Enquiry sent successfully!"

    });


  } catch (error) {

    console.error("Email error:", error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

});


// ================================
// START SERVER
// ================================

app.listen(PORT, () => {

  console.log(
    `STARKIVE Backend running on port ${PORT}`
  );

});
