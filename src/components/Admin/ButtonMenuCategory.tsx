import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

type Prop = {
  createHandleMenuClick: (
    menuItem: "edit" | "delete",
    categoryId: string
  ) => void;
  categoryId: string;
};

export default function CategoryDropdownMenu({
  createHandleMenuClick,
  categoryId,
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
        className="hover:bg-primary-100 hover:rounded-full "
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
        <MenuItem
          className=" hover:bg-neutral-100  my-2"
          onClick={() => createHandleMenuClick("edit", categoryId)}
        >
          Edit
        </MenuItem>
        <MenuItem
          className=" hover:bg-neutral-100  my-2"
          onClick={() => createHandleMenuClick("delete", categoryId)}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}
