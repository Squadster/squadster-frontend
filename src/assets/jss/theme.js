import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        fontWeight: "bold",
        margin: "10px"
      }
    }
  }
});
