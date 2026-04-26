/**
 * Next.js runs this file automatically on matched requests - nothing in the app imports it.
 * The exported `proxy` name and `config.matcher` are the framework contract.
 *
 * Bootstrap and session checks call the Go API via same-origin `/api/*` URLs resolved from
 * `getApiRoute()` / `getAuthMeUrl()`. Configure Next.js rewrites (`API_ORIGIN`) so `/api/*`
 * forwards to the Go API when it runs on another host.
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getAuthBootstrapStatusUrl,
  getAuthMeUrl,
} from "@/lib/auth/auth-me-url";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { isAuthPagePath, isProtectedPath } from "@/lib/auth/routes";
import { getAppRoute } from "./configs";

async function fetchNeedsBootstrapFromRequest(
  request: NextRequest,
): Promise<boolean> {
  const url = getAuthBootstrapStatusUrl(request.url);
  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      return false;
    }

    const data = (await res.json()) as { needsBootstrap?: boolean };

    return data.needsBootstrap === true;
  } catch {
    return false;
  }
}

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const cookie = request.headers.get("cookie") ?? "";
  if (!cookie.includes(`${SESSION_COOKIE}=`)) {
    return false;
  }
  const url = getAuthMeUrl(request.url);
  try {
    const res = await fetch(url, {
      headers: { cookie },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsBootstrap = await fetchNeedsBootstrapFromRequest(request);

  if (pathname === "/setup") {
    if (!needsBootstrap) {
      return NextResponse.redirect(getAppRoute("home"));
    }

    return NextResponse.next();
  } else {
    if (needsBootstrap) {
      const url = request.nextUrl.clone();
      url.pathname = "/setup";
      url.search = "";
      return NextResponse.redirect(url);
    }

    const sessionValid = await hasValidSession(request);

    if (isProtectedPath(pathname) && !sessionValid) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    if (sessionValid && isAuthPagePath(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * App routes except Next internals, favicon, and public asset prefixes so an
     * empty database cannot reach the rest of the app until /setup completes.
     */
    "/((?!_next/|favicon.ico|brand/|icons/|api/).*)",
  ],
};
