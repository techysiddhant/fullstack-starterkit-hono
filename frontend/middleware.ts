// import { NextRequest, NextResponse } from "next/server";
// import { getDomainProject } from "./lib/domain";

// export default async function middleware(request: NextRequest) {
//   const host = request.headers.get("host") as string;
//   const domain = host.replace("www.", "").toLowerCase();

//   console.log("HOST---", host);
//   console.log("DOMAIN---", domain);

//   const path = request.nextUrl.pathname;
//   console.log("PATH---", path);

//   // fullPath is the full URL path (along with search params)
//   const searchParams = request.nextUrl.searchParams.toString();
//   const searchParamsString = searchParams.length > 0 ? `?${searchParams}` : "";
//   const fullPath = `${path}${searchParamsString}`;

//   console.log("FULL PATH---", fullPath);

//   //   const response = NextResponse.next();
//   if (domain !== "jsnode.shop") {
//     console.log("INSIDe");
//     const projectSlug = await getAssociatedProject("100xcoding.shop");
//     console.log("PROJECT SLUG", projectSlug);
//     if (projectSlug) {
//       return NextResponse.rewrite(
//         new URL(`/${projectSlug}${fullPath}`, request.url)
//       );
//     }
//   }
//   //   const user = await getUser(request, response);
// }
// async function getAssociatedProject(domain: string) {
//   let username = undefined;
//   // if sub-domain, get project slug from sub-domain
//   // if (isSubdomain(domain)) {
//   //   const slug = domain.split(".")[0];
//   //   projectSlug = slug;
//   // }
//   // if not sub-domain, tis a custom domain
//   const target = await getDomainProject(domain);
//   username = target;

//   return username;
// }
// export const config = {
//   matcher: [
//     /*
//      * Match all paths except for:
//      * 1. /api/ routes
//      * 2. /_next/ (Next.js internals)
//      * 3. /_proxy/ (proxies for third-party services)
//      * 4. /_static (inside /public)
//      * 5. /_vercel (Vercel internals)
//      * 6. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
//      */
//     "/((?!api/|_next/|blog/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)",
//   ],
// };
import { NextRequest, NextResponse } from "next/server";
import { getDomainProject } from "./lib/domain";

export const config = {
  matcher: "/", // Runs only on the homepage (custom domains will hit this)
};

export default async function middleware(request: NextRequest) {
  const host = request.headers.get("host") as string;
  const domain = host.replace("www.", "").toLowerCase();

  // Skip middleware for main domain and API routes
  if (domain === "localhost:3000" || domain === "your-main-domain.com") {
    return NextResponse.next();
  }

  // Lookup username only for custom domains
  const username = await getDomainProject(domain);

  if (username) {
    return NextResponse.rewrite(new URL(`/${username}`, request.url));
  }

  return NextResponse.next();
}
