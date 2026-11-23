import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";
import { useApp } from "../AppContext.jsx";

const empty = { fullName: "", address: "", email: "", phone: "", username: "", password: "", confirm: "" };

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useApp();
  const [f, setF] = useState(empty);
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (f.password.length < 6) return setError("Password must be at least 6 characters.");
    if (f.password !== f.confirm) return setError("Passwords do not match.");
    if (!/^\d{10}$/.test(f.phone)) return setError("Enter a 10 digit mobile number.");
    const { confirm, ...user } = f;
    try {
      await api.register(user);
      toast("Registered! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.message.startsWith("Request failed")
        ? "Could not register. The username, email or phone may already be in use."
        : err.message);
    }
  };

  return (
    <div className="checkout-container single">
      <div>
        <h2>Registration</h2>
        <form onSubmit={submit}>
          <label>Full Name</label>
          <input type="text" placeholder="Enter Name" required value={f.fullName} onChange={set("fullName")} />
          <label>Address</label>
          <input type="text" placeholder="Street, City, State" required value={f.address} onChange={set("address")} />
          <label>Email</label>
          <input type="email" placeholder="email" required value={f.email} onChange={set("email")} />
          <label>Phone</label>
          <input type="text" inputMode="numeric" placeholder="Mobile Number" required value={f.phone} onChange={set("phone")} />
          <label>Username</label>
          <input type="text" placeholder="Username" required value={f.username} onChange={set("username")} />
          <label>Password</label>
          <input type="password" placeholder="Password" required value={f.password} onChange={set("password")} />
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm Password" required value={f.confirm} onChange={set("confirm")} />
          {error && <p className="error">{error}</p>}
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
