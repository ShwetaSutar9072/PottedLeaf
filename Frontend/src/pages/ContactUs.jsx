import { Link } from "react-router-dom";

export default function ContactUs() {
  return (
    <div className="checkout-container single">
      <div>
        <h2>Contact Us</h2>
        <p>We would love to hear from you. Reach out any time, or <Link to="/feedback">send us feedback</Link> about your experience.</p>
        <dl className="profile">
          <div><dt>Phone</dt><dd>7030169072</dd></div>
          <div><dt>Email</dt><dd>thepottedleaf@gmail.com</dd></div>
          <div><dt>Instagram</dt><dd>@The_Potted_Leaf</dd></div>
          <div><dt>Hours</dt><dd>Mon–Sat, 9 AM – 7 PM</dd></div>
        </dl>
      </div>
    </div>
  );
}
