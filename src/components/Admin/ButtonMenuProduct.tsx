import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useRouter } from "next/navigation";
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

  const route = useRouter();
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
        className=" bg-primary-500 rounded-sm p-2 text-white hover:bg-primary-300 justify-center"
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
        className="p-0 m-0"
      >
        <MenuItem
          className="text-green-500  hover:bg-primary-200"
          sx={{
            border: 2,
            borderColor: " #22c55e",
            borderRadius: "4px",
            textAlign:"center",
          }}
          onClick={() => {
            route.push(`../products/${product_id}`);
          }}
        >
          View
        </MenuItem>
        <MenuItem className="text-orange-500 hover:bg-primary-200  my-1"
          sx={{
            border: 2,
            borderColor: "#f97316",
            borderRadius: "4px",
            textAlign:"center"
          }}
          onClick={() => {
            route.push(`./products/edit/${product_id}`);
          }}>
            Edit
        </MenuItem>
        <MenuItem
          className=" bg-red-500 text-white hover:bg-primary-200 "
          sx={{
            border: 2,
            borderColor: "#ef4444 ",
            borderRadius: "4px",
            textAlign:"center",
            m:0
          }}
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
