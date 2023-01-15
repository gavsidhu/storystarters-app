export default function getMultipleRandom(
  arr: { prompt: string; completion: string }[],
  num: number
) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}
