import React from "react";
import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { UserProvider } from "../contexts/UserContext";
import { TransactionProvider } from "../contexts/TransactionContext";
import { WarehouseProvider } from "../contexts/WarehouseContext";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>
    <TransactionProvider>
      <WarehouseProvider>
        {children}
      </WarehouseProvider>
    </TransactionProvider>
  </UserProvider>
);

describe("App Basic Functionality", () => {
  test("renders the app without crashing", () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    // Basic test to ensure the app renders
    expect(document.body).toBeInTheDocument();
  });

  test("renders NotFound page on unknown route", () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={["/unknown-route"]}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  test("shows authenticated user message", () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    // Check for authenticated user message
    const sudahLoginElements = screen.getAllByText(/Sudah Login/i);
    expect(sudahLoginElements.length).toBeGreaterThan(0);
  });
});
