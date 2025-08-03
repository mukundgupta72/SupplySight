import { Box, Typography, useTheme, Paper, Button } from "@mui/material";
import { tokens } from "../../theme";
import { useStore } from "../../context/StoreContext";
import Header from "../../components/Header";

const Orders = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { orders, cancelOrder } = useStore(); // Get the cancelOrder function

  return (
    <Box m="20px">
      <Header title="YOUR ORDERS" subtitle="A history of your confirmed orders" />
      {orders.length === 0 ? (
        <Typography>You have no confirmed orders.</Typography>
      ) : (
        <Box>
          {orders.map((order) => (
            <Paper key={order.id} sx={{ p: 2, mb: 3, backgroundColor: colors.primary[400] }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" fontWeight="bold">Order #{order.id}</Typography>
                  <Typography>Date: {order.date}</Typography>
                </Box>
                {/* Add Cancel Button */}
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={() => cancelOrder(order.id)}
                >
                  Cancel Order
                </Button>
              </Box>
              <Box mt={2}>
                {order.items.map(item => (
                   <Box key={`${item.storeId}-${item.id}`} display="flex" justifyContent="space-between" mb={1}>
                      <Typography>{item.name} (x{item.quantity}) from {item.storeName}</Typography>
                      <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                   </Box>
                ))}
              </Box>
              <Typography variant="h5" fontWeight="bold" textAlign="right" mt={2} color={colors.greenAccent[400]}>
                Order Total: ${order.total.toFixed(2)}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Orders;
