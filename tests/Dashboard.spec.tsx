import { render, screen } from "@testing-library/react";
import { ProjectProvider } from "../src/context/ProjectContext";
import Dashboard from "../src/components/Dashboard";

test("Dashboard renders title", () => {
    render(
        <ProjectProvider>
            <Dashboard />
        </ProjectProvider>
    );
    const heading = screen.getByText(/Drafter Drafter/i);
    expect(heading).toBeInTheDocument();
});

test("Dashboard has New Project button", () => {
    render(
        <ProjectProvider>
            <Dashboard />
        </ProjectProvider>
    );
    const button = screen.getByRole('button', { name: /New Project/i });
    expect(button).toBeInTheDocument();
});
