import Discard from "./Discard";
import Submit from "./Submit";
import Reset from "./Reset";
import { useNavigate } from "react-router-dom";
export default function FooterButtons({setDisplayMessage, onSubmitHandller }) {
  const navigate = useNavigate();
  
  const discardHandller  = ()=>{
    navigate('/')
}
  return (
    <div className="flex justify-between items-center pt-8">
      <div className="flex gap-3">
        <Discard  discardHandller={discardHandller} />
        <Reset />
      </div>

      <Submit  onsubmit={onSubmitHandller} />
    </div>
  );
}