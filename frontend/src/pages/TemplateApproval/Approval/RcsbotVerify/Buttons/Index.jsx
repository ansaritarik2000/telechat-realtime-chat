import Discard from "./Discard";
import Submit from "./Submit";
import Reset from "./Reset";

export default function FooterButtons({ onSubmitHandller }) {
  return (
    <div className="flex justify-between items-center pt-8">
      <div className="flex gap-3">
        <Discard />
        <Reset />
      </div>

      <Submit onsubmit={onSubmitHandller} />
    </div>
  );
}
