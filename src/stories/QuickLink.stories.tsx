import React from "react";

import { QuickLink } from "~components/startPage/quickLink/QuickLink";

import "../style.css";

export const DefaultQuickLink = () => (
  <QuickLink
    quickLinkSettings={{
      bigQuickLinks: false,
      type: "gradient"
    }}
    setEditingLink={() => {}}
    setShowModal={() => {}}
    id={1}
    pageName={"test quick link"}
    favicon={
      "https://developer.mozilla.org/favicon-48x48.bc390275e955dacb2e65.png"
    }
    url={""}
  />
);

export const BigDefaultQuickLink = () => (
  <QuickLink
    quickLinkSettings={{
      bigQuickLinks: true,
      type: "gradient"
    }}
    setEditingLink={() => {}}
    setShowModal={() => {}}
    id={1}
    pageName={"test quick link"}
    favicon={
      "https://developer.mozilla.org/favicon-48x48.bc390275e955dacb2e65.png"
    }
    url={""}
  />
);

export const BigTransparentQuickLink = () => (
  <QuickLink
    quickLinkSettings={{
      bigQuickLinks: true,
      type: "transparent"
    }}
    setEditingLink={() => {}}
    setShowModal={() => {}}
    id={1}
    pageName={"test quick link"}
    favicon={
      "https://developer.mozilla.org/favicon-48x48.bc390275e955dacb2e65.png"
    }
    url={""}
  />
);

export const TransparentQuickLink = () => (
  <QuickLink
    quickLinkSettings={{
      bigQuickLinks: false,
      type: "transparent"
    }}
    setEditingLink={() => {}}
    setShowModal={() => {}}
    id={1}
    pageName={"test quick link"}
    favicon={
      "https://developer.mozilla.org/favicon-48x48.bc390275e955dacb2e65.png"
    }
    url={""}
  />
);
