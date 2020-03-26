import React, { Component } from "react";
import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

export const muiTheme = createMuiTheme({
  palette: {
    primary: red
  }
});