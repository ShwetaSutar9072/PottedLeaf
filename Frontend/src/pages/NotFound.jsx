import { Link } from "react-router-dom";
export default function NotFound() {
  return <div className="checkout-container single"><h2>Page not found</h2><p>That page does not exist. <Link to="/">Go to the home page</Link></p></div>;
}
