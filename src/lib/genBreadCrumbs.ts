export const generateBreadcrumbs = (pathname: string) => {
  // Get the current pathname

  // Split the pathname into parts
  const crumbs = pathname.split("/").filter(Boolean);

  // Initialize an array to hold the breadcrumb links
  const links: string[] = [];

  // Build breadcrumbs progressively
  let currentPath = "";

  crumbs.forEach((segment: string) => {
    currentPath += `/${segment}`;
    links.push(currentPath.replace("/", "")); // Skip the initial slash in output
  });

  return { crumbs, links };
};
