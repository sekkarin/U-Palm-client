import { Grid, Typography } from "@mui/material";
import React from "react";

const Header: React.FC = () => {
  return (
    <footer className="w-[100%] bg-primary-600 mt-10 ">
      <Grid container className="p-2 text-white" spacing={2}>
        <Grid item xl={12} md={4}>
          <Typography
            variant="h5"
            className="sm:text-center text-center md:text-start"
          >
            ติดต่อเรา
          </Typography>
          <Typography>
            <b>สำนักงาน</b>: 32 ซอย 12 ถนนเพชรเกษม ตำบลหาดใหญ่ อำเภอหาดใหญ่
            จังหวัดสงขลา 90110
          </Typography>
          <Typography>
            <b>อีเมล</b>: upalm.official@gmail.com
          </Typography>
          <Typography>
            <b>โทร</b>: 063-8899059
          </Typography>
        </Grid>
        <Grid item xl={12} md={4}>
          <Typography variant="h5" className="text-center">
            Contact Us
          </Typography>
          <Typography>
            <b>Head Office</b>: 32 Soi 12, Phetkasem road, Hatyai, Songkhla,
            Thailand 90110
          </Typography>
          <Typography>
            <b>Email</b>: upalm.official@gmail.com
          </Typography>
          <Typography>
            <b>Tel</b>: (+66)63-8899059
          </Typography>
        </Grid>
        <Grid item sm={12} xs={12} md={4}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d226.86981866223502!2d100.4817291!3d7.0199163!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304d28ff0805eadf%3A0xb3a4929958c9921f!2zMzIg4LmA4Lie4LiK4Lij4LmA4LiB4Lip4LihIOC4i-C4reC4oiAxMiDguJXguLPguJrguKUg4Lir4Liy4LiU4LmD4Lir4LiN4LmIIOC4reC4s-C5gOC4oOC4reC4q-C4suC4lOC5g-C4q-C4jeC5iCDguKrguIfguILguKXguLIgOTAxMTA!5e1!3m2!1sth!2sth!4v1730521887664!5m2!1sth!2sth"
            width="300"
            className="w-full"
            height="250"
            loading="lazy"
          ></iframe>
        </Grid>
      </Grid>
    </footer>
  );
};

export default Header;
