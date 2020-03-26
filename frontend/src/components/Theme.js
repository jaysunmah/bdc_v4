import React, { Component } from "react";
import { createMuiTheme } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

export const muiTheme = createMuiTheme({
  palette: {
    primary: blue
  }
});