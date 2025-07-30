import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setResponseMessage("");
    setError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple front-end validation example:
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setResponseMessage("Please fill in all fields.");
      setError(true);
      return;
    }

    // Simulate async "sending" with timeout
    setTimeout(() => {
      setResponseMessage("Thank you for reaching out! We will get back to you shortly.");
      setError(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <section
      id="contact"
      className="py-5"
      style={{ background: "linear-gradient(45deg, #f0f0f0, #c9c9c9)" }}
    >
      <div className="container">
        <h2 className="text-center mb-5">Get in Touch</h2>

        {/* Info boxes */}
        <div className="row text-center mb-5">
          <div className="col-md-4 mb-3">
            <div className="p-4 shadow-sm bg-white rounded">
              <h5>Our Location</h5>
              <p>123 Event St, Celebration City, CA</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-4 shadow-sm bg-white rounded">
              <h5>Call Us</h5>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-4 shadow-sm bg-white rounded">
              <h5>Email</h5>
              <p>support@eventsphere.com</p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="p-4 bg-white shadow rounded">
              {responseMessage && (
                <div className={`alert ${error ? "alert-danger" : "alert-success"}`} role="alert">
                  {responseMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="form-control"
                    rows="5"
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    style={{ backgroundColor: "#791651", borderColor: "#791651" }}
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
