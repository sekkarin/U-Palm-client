import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Link from "next/link";
type Prop = {
  product_id: string | undefined;
  setProductIdDeleteIdDelete: (product_id: string | undefined) => void;
  handleDeleteClick: () => void;
};

export default function ProductDropdownMenu({
  product_id,
  handleDeleteClick,
  setProductIdDeleteIdDelete,
}: Prop) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="hover:bg-primary-100"

      >
        Action <ArrowDropDownIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem className=" hover:bg-neutral-100 my-2">
          <Link href={`../products/${product_id}`} className="p-2 w-5 h-6">
            View
          </Link>
        </MenuItem>
        <MenuItem className=" hover:bg-neutral-100  my-2">
          <Link href={`./products/edit/${product_id}`} className="p-2 w-5 h-6">
            Edit
          </Link>
        </MenuItem>
        <MenuItem
          className=" hover:bg-neutral-100  my-2"
          onClick={() => {
            setProductIdDeleteIdDelete(product_id);
            handleDeleteClick();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}
