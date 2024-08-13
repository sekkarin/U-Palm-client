"use client";
import Loading from "@/app/loging";
import Layout from "@/components/Admin/Layout";
import SnackbarAlert from "@/components/SnackbarAlert";
import { ICategory } from "@/interfaces/category.interface";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import {
  Box,
  Breadcrumbs,
  Button,
  TextField,
  Typography,
  Divider,
  Autocomplete,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
  { label: "The Dark Knight", year: 2008 },
  { label: "12 Angry Men", year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: "Pulp Fiction", year: 1994 },
  {
    label: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { label: "The Good, the Bad and the Ugly", year: 1966 },
  { label: "Fight Club", year: 1999 },
  {
    label: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  {
    label: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
  },
  { label: "Forrest Gump", year: 1994 },
  { label: "Inception", year: 2010 },
  {
    label: "The Lord of the Rings: The Two Towers",
    year: 2002,
  },
  { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { label: "Goodfellas", year: 1990 },
  { label: "The Matrix", year: 1999 },
  { label: "Seven Samurai", year: 1954 },
  {
    label: "Star Wars: Episode IV - A New Hope",
    year: 1977,
  },
  { label: "City of God", year: 2002 },
  { label: "Se7en", year: 1995 },
  { label: "The Silence of the Lambs", year: 1991 },
  { label: "It's a Wonderful Life", year: 1946 },
  { label: "Life Is Beautiful", year: 1997 },
  { label: "The Usual Suspects", year: 1995 },
  { label: "Léon: The Professional", year: 1994 },
  { label: "Spirited Away", year: 2001 },
  { label: "Saving Private Ryan", year: 1998 },
  { label: "Once Upon a Time in the West", year: 1968 },
  { label: "American History X", year: 1998 },
  { label: "Interstellar", year: 2014 },
  { label: "Casablanca", year: 1942 },
  { label: "City Lights", year: 1931 },
  { label: "Psycho", year: 1960 },
  { label: "The Green Mile", year: 1999 },
  { label: "The Intouchables", year: 2011 },
  { label: "Modern Times", year: 1936 },
  { label: "Raiders of the Lost Ark", year: 1981 },
  { label: "Rear Window", year: 1954 },
  { label: "The Pianist", year: 2002 },
  { label: "The Departed", year: 2006 },
  { label: "Terminator 2: Judgment Day", year: 1991 },
  { label: "Back to the Future", year: 1985 },
  { label: "Whiplash", year: 2014 },
  { label: "Gladiator", year: 2000 },
  { label: "Memento", year: 2000 },
  { label: "The Prestige", year: 2006 },
  { label: "The Lion King", year: 1994 },
  { label: "Apocalypse Now", year: 1979 },
  { label: "Alien", year: 1979 },
  { label: "Sunset Boulevard", year: 1950 },
  {
    label:
      "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    year: 1964,
  },
  { label: "The Great Dictator", year: 1940 },
  { label: "Cinema Paradiso", year: 1988 },
  { label: "The Lives of Others", year: 2006 },
  { label: "Grave of the Fireflies", year: 1988 },
  { label: "Paths of Glory", year: 1957 },
  { label: "Django Unchained", year: 2012 },
  { label: "The Shining", year: 1980 },
  { label: "WALL·E", year: 2008 },
  { label: "American Beauty", year: 1999 },
  { label: "The Dark Knight Rises", year: 2012 },
  { label: "Princess Mononoke", year: 1997 },
  { label: "Aliens", year: 1986 },
  { label: "Oldboy", year: 2003 },
  { label: "Once Upon a Time in America", year: 1984 },
  { label: "Witness for the Prosecution", year: 1957 },
  { label: "Das Boot", year: 1981 },
  { label: "Citizen Kane", year: 1941 },
  { label: "North by Northwest", year: 1959 },
  { label: "Vertigo", year: 1958 },
  {
    label: "Star Wars: Episode VI - Return of the Jedi",
    year: 1983,
  },
  { label: "Reservoir Dogs", year: 1992 },
  { label: "Braveheart", year: 1995 },
  { label: "M", year: 1931 },
  { label: "Requiem for a Dream", year: 2000 },
  { label: "Amélie", year: 2001 },
  { label: "A Clockwork Orange", year: 1971 },
  { label: "Like Stars on Earth", year: 2007 },
  { label: "Taxi Driver", year: 1976 },
  { label: "Lawrence of Arabia", year: 1962 },
  { label: "Double Indemnity", year: 1944 },
  {
    label: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
  },
  { label: "Amadeus", year: 1984 },
  { label: "To Kill a Mockingbird", year: 1962 },
  { label: "Toy Story 3", year: 2010 },
  { label: "Logan", year: 2017 },
  { label: "Full Metal Jacket", year: 1987 },
  { label: "Dangal", year: 2016 },
  { label: "The Sting", year: 1973 },
  { label: "2001: A Space Odyssey", year: 1968 },
  { label: "Singin' in the Rain", year: 1952 },
  { label: "Toy Story", year: 1995 },
  { label: "Bicycle Thieves", year: 1948 },
  { label: "The Kid", year: 1921 },
  { label: "Inglourious Basterds", year: 2009 },
  { label: "Snatch", year: 2000 },
  { label: "3 Idiots", year: 2009 },
  { label: "Monty Python and the Holy Grail", year: 1975 },
];

export default function EditCategory({ params }: { params: { id: string } }) {
  const [formValues, setFormValues] = useState({
    category_name: "",
    parentCategory: null as string | null,
  });

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    isError: false,
  });

  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return axiosAuth.put(`/categories/${params.id}`, formData);
    },
    onError: (error) => {
      const errorMessages =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "An unexpected error occurred.";
      setSnackbarState({
        open: true,
        message: Array.isArray(errorMessages)
          ? errorMessages.join(", ")
          : `Failed to update Category: ${errorMessages}`,
        isError: true,
      });
    },
    onSuccess() {
      setSnackbarState({
        open: true,
        message: "Create successfully!",
        isError: false,
      });
      queryClient.invalidateQueries({ queryKey: ["get-all-categories"] });
    },
  });

  const handleInputChange =
    (field: keyof typeof formValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log(event.target.value);

      setFormValues({ ...formValues, [field]: event.target.value });
    };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const formData = new FormData();

    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as string);
    });

    mutation.mutate(formData);
  };
  const handleCloseSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };
  const categoryQuery = useQuery<ICategory>({
    queryKey: ["get-supplier", params.id],
    queryFn: async () => (await axiosAuth.get(`/categories/${params.id}`)).data,
  });
  const initialForm = (category: ICategory) => {
    setFormValues({
      category_name: category.category_name,
      parentCategory: category?.parent_category_id || "",
    });
  };
  useEffect(() => {
    if (categoryQuery.isSuccess && categoryQuery.data) {
      initialForm(categoryQuery.data);
    }
  }, [categoryQuery.data, categoryQuery.isSuccess]);

  if (categoryQuery.isLoading) {
    return <Loading />;
  }

  return (
    <Layout>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/admin/categories" className="underline">
          Category
        </Link>
        <Typography color="text.primary">Create Category</Typography>
      </Breadcrumbs>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {/* Supplier information */}
        <Typography variant="h6" gutterBottom>
          Category
        </Typography>
        <Divider
          sx={{
            my: 1,
          }}
        />

        <Box mt={2}>
          <TextField
            label={"Name"}
            value={formValues.category_name}
            onChange={handleInputChange("category_name")}
            fullWidth
            required
          />
        </Box>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={top100Films}
          fullWidth
          disabled
          onChange={(e, value) => {
            console.log(value);
          }}
          sx={{ mt: 1 }}
          renderInput={(params) => <TextField {...params} label="Category" />}
        />

        {/* End supplier information */}
        <Box mt={4}>
          <Button
            type="submit"
            variant="contained"
            className="bg-secondary-500"
            fullWidth
          >
            เพิ่ม
          </Button>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <SnackbarAlert
        open={snackbarState.open}
        handleCloseSnackbar={handleCloseSnackbar}
        isError={snackbarState.isError}
        message={snackbarState.message}
      />
    </Layout>
  );
}
