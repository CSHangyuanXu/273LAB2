import ItemFormPoup from "./ItemFormPoup";
import { render, fireEvent } from "@testing-library/react";
test("make sure Item Image heading present ", () => {
  const { getByText } = render(<ItemFormPoup isOpen={true} />);
  expect(getByText("Item Image")).toBeInTheDocument();
});
