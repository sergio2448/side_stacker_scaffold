import Home from "../pages/index";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

describe("Home", () => {
  it("renders home page", () => {
    const { container } = render(<Home />);
    expect(container.querySelector("button")).toBeInTheDocument();
  });
});