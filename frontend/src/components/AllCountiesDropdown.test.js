import AllCountriesDropdown from "./AllCountiesDropdown";
import { render, fireEvent, waitForElement } from "@testing-library/react";

test("make sure Country heading present ", () => {
  const { getByText } = render(<AllCountriesDropdown />);
  expect(getByText("Country")).toBeInTheDocument();
});
