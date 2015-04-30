import authActionsFactory from "./AuthActions";
import eventActionsFactory from "./EventActions";

export default context => ({
  AuthActions: authActionsFactory(context),
  EventActions: eventActionsFactory(context),
});
