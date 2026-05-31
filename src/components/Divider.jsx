import Bunting from "./Bunting.jsx";

// Section separators, varied per scene. Built from CSS or properly-designed
// repeatable assets — NOT by stretching/tiling a flat texture (that looked bad
// as a "beam"). More types (lampião, balões, pipoca…) get added as real
// repeatable elements with correct spacing on a string.
export default function Divider({ type = "bunting" }) {
  // eslint-disable-next-line no-unused-vars
  void type;
  return <Bunting count={16} className="absolute inset-x-0 top-0 h-6" />;
}
