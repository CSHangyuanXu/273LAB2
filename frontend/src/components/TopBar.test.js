import TopBar from "./TopBar";
import { render, fireEvent, waitForElement } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
test("if user not login login button should show", () => {
  const { getByText } = render(
    <BrowserRouter>
      <TopBar user={null} />
    </BrowserRouter>
  );
  // make sure login button is in the dom
  expect(getByText("Login")).toBeInTheDocument();
});
