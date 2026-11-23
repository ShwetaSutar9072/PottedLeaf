import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../api";
import { useApp } from "../AppContext.jsx";

export default function Profile() {
  const { user, signOut } = useApp();
  const [u, setU] = useState(user);
  useEffect(() => { api.getUser(user.id).then((x) => x && setU(x)).catch(() => {}); }, [user.id]);

  const rows = [["Full name", u.fullName], ["Username", u.username], ["Email", u.email], ["Phone", u.phone], ["Address", u.address]];
  return (
    <div className="checkout-container single">
      <div>
        <h2>My Profile</h2>
        <dl className="profile">
          {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <p className="note">Editing your details needs an update endpoint in the backend.</p>
        <p><Link to="/orders">View my orders</Link> · <Link to="/wishlist">My wishlist</Link></p>
        <button onClick={signOut}>Logout</button>
      </div>
    </div>
  );
}
