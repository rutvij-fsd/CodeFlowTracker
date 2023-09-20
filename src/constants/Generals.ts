export let BASE_URL: string = "";

export function updateBaseURL(val: string) {
  if (typeof val !== "string") return;
  BASE_URL = `https://api.github.com/repos/${val}/contents/`;
}

export function getBaseURLToDev() {
  return BASE_URL;
}
