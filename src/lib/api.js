function apiFetch(url, options = {}) {
  return fetch(url, options).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });
}

export function getCaseStudies() {
  return apiFetch("https://ftk-api.pages.dev/case-studies");
}

export function getTeamMembers() {
  return apiFetch("https://ftk-api.pages.dev/team");
}
