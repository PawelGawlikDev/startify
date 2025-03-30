import React from "react";

import {
  AddQuickLinkButton,
  QuickLink
} from "@/components/startPage/quickLink/QuickLink";

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
    url={""}
  />
);

export const AddQuickLinkButtonStories = () => (
  <div className="flex w-full justify-center">
    <AddQuickLinkButton
      quickLinkSettings={{
        bigQuickLinks: false,
        type: "gradient"
      }}
      setShowModal={() => {}}
      setEditingLink={() => {}}
    />
  </div>
);
