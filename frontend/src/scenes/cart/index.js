import { Box, Typography, Button, useTheme, Paper } from "@mui/material";
import { tokens } from "../../theme";
import { useStore } from "../../context/StoreContext";
import Header from "../../components/Header";

const Cart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { cart, confirmOrder } = useStore();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Box m="20px">
      <Header title="SHOPPING CART" subtitle="Review your items before purchase" />
      {cart.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <Box>
          {cart.map((item) => (
            <Paper key={`${item.storeId}-${item.id}`} sx={{ p: 2, mb: 2, backgroundColor: colors.primary[400] }}>
              <Typography variant="h5">{item.name}</Typography>
              <Typography>Store: {item.storeName} (Sold by {item.ownerName})</Typography>
              <Typography>Quantity: {item.quantity}</Typography>
              <Typography>Price: ${item.price}</Typography>
              <Typography fontWeight="bold">Subtotal: ${item.price * item.quantity}</Typography>
            </Paper>
          ))}
          <Box mt={4} textAlign="right">
            <Typography variant="h3" fontWeight="bold">Total: ${total.toFixed(2)}</Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2, fontSize: "16px" }}
              onClick={confirmOrder}
            >
              Confirm Order
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Cart;
