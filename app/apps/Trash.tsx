import { ui } from "../data/interface";
export default function Trash() {
  return (
    <div className="utility-app trash-app">
      <span>⌫</span>
      <h2>{ui.trash.title}</h2>
      <p>{ui.trash.body}</p>
    </div>
  );
}
