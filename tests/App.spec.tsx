import { render, screen } from "@testing-library/react";
import { App } from "../src/App";

test("App component displays Drafter Drafter heading", () => {
    render(<App />);
    const heading = screen.getByText(/Drafter Drafter/i);
    expect(heading).toBeInTheDocument();
});

test("App component displays New Project button", () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /New Project/i });
    expect(button).toBeInTheDocument();
});

