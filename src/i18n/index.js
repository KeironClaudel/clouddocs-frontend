import es from "./es";

const translations = es;

export function t(path) {
  return path.split(".").reduce((obj, key) => obj?.[key], translations);
}
