import React from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

describe("App Routing", () => {
  test("shows already logged in message when user is authenticated", () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    expect(screen.getByText(/Sudah Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
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

  test("shows already logged in message on /login route when authenticated", () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={["/login"]}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );
    expect(screen.getByText(/Sudah Login/i)).toBeInTheDocument();
  });

  test("can navigate to main page from already logged in state", async () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={["/login"]}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    const mainPageButton = screen.getByText(/Ke Halaman Utama/i);
    fireEvent.click(mainPageButton);

    // Should navigate to dashboard
    await waitFor(() => {
      expect(screen.getByText(/Dashboard Gudang PLN/i)).toBeInTheDocument();
    });
  });
});

describe("Authentication Flow", () => {
  test("login functionality works", async () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={["/login"]}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    // Fill in login form
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: 'owner@gudang.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    // Should redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText(/Dashboard Gudang PLN/i)).toBeInTheDocument();
    });
  });

  test("login with invalid credentials fails", async () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={["/login"]}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(emailInput, { target: { value: 'invalid@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    // Should still be on login page
    expect(screen.getByText(/Login Sistem Gudang/i)).toBeInTheDocument();
  });
});

describe("Navigation", () => {
  test("navigation links work correctly", async () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText(/Dashboard Gudang PLN/i)).toBeInTheDocument();
    });

    // Check if navigation elements are present
    expect(screen.getByText(/Transaksi/i)).toBeInTheDocument();
    expect(screen.getByText(/Gudang/i)).toBeInTheDocument();
    expect(screen.getByText(/Laporan/i)).toBeInTheDocument();
  });
});
